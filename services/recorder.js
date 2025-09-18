// services/recorder.js
import { Audio } from "expo-av";

let recording = null;

export async function startRecording() {
  try {
    const { granted } = await Audio.requestPermissionsAsync();
    if (!granted) {
      throw new Error("Permission to access microphone is required!");
    }

    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    recording = new Audio.Recording();
    await recording.prepareToRecordAsync(
      Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY
    );
    await recording.startAsync();

    console.log("Recording started");
  } catch (err) {
    console.error("Failed to start recording", err);
  }
}

export async function stopRecording() {
  console.log("Stopping recording..");
  if (!recording) return null;

  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  recording = null;
  console.log("Recording stopped and stored at", uri);
  return uri;
}
