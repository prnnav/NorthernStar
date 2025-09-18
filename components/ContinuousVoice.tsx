import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ActivityIndicator, Platform } from "react-native";
import { Audio } from "expo-av";

// NOTE: These functions are assumed to be in the specified service file.
// Make sure you have the 'sttService' file with these exports.
import { uploadToServer, fileUriToBlob, startRecording, SERVER_URL } from "../services/sttService";

export default function ContinuousVoice({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [lang, setLang] = useState<"en" | "hi">("en");
  const processingRef = useRef(false);

  useEffect(() => {
    // This effect controls the recording lifecycle.
    startContinuousRecording();
    // The cleanup function ensures the recording is stopped when the component unmounts.
    return () => {
      stopContinuousRecording();
    };
  }, [lang]); // The recording will restart if the language is changed.

  const startContinuousRecording = async () => {
    if (isRecording) return;
    setIsRecording(true);

    try {
        const rec = await startRecording();
        setRecording(rec);

        // Set up an interval to automatically transcribe every 10 seconds
        const interval = setInterval(async () => {
          if (rec && !processingRef.current) {
            processingRef.current = true;
            try {
              // Pause, get the file, and then resume to create segments
              await rec.pauseAsync();
              const uri = rec.getURI();
              if (uri) {
                const blob = await fileUriToBlob(uri);
                const text = await uploadToServer(blob, SERVER_URL, "3gp", lang);
                if (text) onTranscript(text);
              }
              await rec.startAsync();
            } catch (err) {
              console.error("Error in continuous transcription:", err);
            } finally {
              processingRef.current = false;
            }
          }
        }, 10000); // Process every 10 seconds

        // Save the interval reference on the recording object to clean it up later
        (rec as any).interval = interval;
    } catch (error) {
        console.error("Failed to start continuous recording:", error);
        setIsRecording(false);
    }
  };

  const stopContinuousRecording = async () => {
    if (!recording) return;
    
    // Clear the interval to stop the transcription loop
    clearInterval((recording as any).interval);
    
    try {
        await recording.stopAndUnloadAsync();
    } catch (error) {
        console.error("Error stopping and unloading recording:", error);
    }

    setRecording(null);
    setIsRecording(false);
  };

  return (
    <View style={{ alignItems: "center", gap: 12 }}>
      <TouchableOpacity
        onPress={() => setLang(lang === "en" ? "hi" : "en")}
        style={{
          padding: 8,
          backgroundColor: "#6b7280",
          borderRadius: 8,
          marginBottom: 8,
        }}
      >
        <Text style={{ color: "#fff" }}>🌐 Language: {lang === "en" ? "English" : "Hindi"}</Text>
      </TouchableOpacity>

      <View
        style={{
          padding: 16,
          backgroundColor: isRecording ? "#ef4444" : "#2563eb",
          borderRadius: 12,
          alignItems: "center",
        }}
      >
        {isRecording ? (
          <Text style={{ color: "#fff", fontWeight: "700" }}>🎙️ Recording...</Text>
        ) : (
          <Text style={{ color: "#fff", fontWeight: "700" }}>Start Recording</Text>
        )}
      </View>
    </View>
  );
}

