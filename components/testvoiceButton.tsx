// components/TestVoiceButton.tsx
import { Audio } from "expo-av";
import React, { useState } from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, Alert } from "react-native";
import axios from "axios";

// This is a public server designed for testing HTTP requests.
const PUBLIC_TEST_SERVER_URL = "https://httpbin.org/post";

export default function TestVoiceButton() {
  const [recording, setRecording] = useState<Audio.Recording | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Upload function for the final sanity test
  const uploadFinalTest = async (uri: string) => {
    const formData = new FormData();
    formData.append("file", {
      uri,
      type: Platform.OS === "ios" ? "audio/x-caf" : "audio/3gpp",
      name: Platform.OS === "ios" ? "recording.caf" : "recording.3gp",
    } as any);

    console.log("📤 Uploading final test to public server:", PUBLIC_TEST_SERVER_URL);
    try {
      const response = await axios.post(PUBLIC_TEST_SERVER_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        timeout: 20000, // 20 second timeout
      });

      console.log("✅ Final Test SUCCESS! Public Server Response:", response.data);
      Alert.alert("Success!", "The file was successfully uploaded to the public test server.");

    } catch (err: any) {
      console.error("❌ Final Test FAILED:", err.message || err);
      Alert.alert("Upload Failed", `Error: ${err.message}.`);
    }
  };

  // Start recording
  const handlePressIn = async () => {
    try {
      await Audio.requestPermissionsAsync();
      await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
      const newRecording = new Audio.Recording();
      await newRecording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
      await newRecording.startAsync();
      setRecording(newRecording);
    } catch (err) { console.error("❌ Recording start failed:", err); }
  };

  // Stop recording and upload
  const handlePressOut = async () => {
    if (!recording) return;
    try {
      setIsProcessing(true);
      await recording.stopAndUnloadAsync();
      const uri = recording.getURI();
      setRecording(null);
      if (uri) await uploadFinalTest(uri);
    } catch (err) {
      console.error("❌ Test failed:", err);
      setRecording(null);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <TouchableOpacity
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={isProcessing}
      style={{ padding: 20, backgroundColor: recording ? "#ef4444" : "#2563eb", borderRadius: 12 }}
    >
      {isProcessing ? <ActivityIndicator color="#fff" /> : <Text style={{ color: "#fff", fontWeight: "700" }}>{recording ? "Release for Final Test" : "Hold for Final Test"}</Text>}
    </TouchableOpacity>
  );
}