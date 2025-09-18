// components/audioPlayer.jsx
import React, { useState } from "react";
import { View, Button, Text } from "react-native";
import { startRecording, stopRecording } from "../services/recorder";
import { playSound } from "../services/player";

export default function AudioPlayer() {
  const [recordingUri, setRecordingUri] = useState(null);

  const handleRecord = async () => {
    await startRecording();
  };

  const handleStop = async () => {
    const uri = await stopRecording();
    setRecordingUri(uri);
  };

  const handlePlay = async () => {
    if (recordingUri) {
      await playSound(recordingUri);
    }
  };

  return (
    <View>
      <Text>🎙️ Audio Recorder</Text>
      <Button title="Start Recording" onPress={handleRecord} />
      <Button title="Stop Recording" onPress={handleStop} />
      <Button title="Play Recording" onPress={handlePlay} disabled={!recordingUri} />
    </View>
  );
}
