// services/sttService.ts
import { Audio } from "expo-av";
import * as FileSystem from "expo-file-system";

export const SERVER_URL = "http://10.13.104.158:5000/transcribe"; // Android Emulator (use 127.0.0.1 for web)

// ==========================
// Legacy functions
// ==========================
export async function startRecording(): Promise<Audio.Recording> {
  const { status } = await Audio.requestPermissionsAsync();
  if (status !== "granted") throw new Error("Microphone permission denied");

  await Audio.setAudioModeAsync({
    allowsRecordingIOS: true,
    playsInSilentModeIOS: true,
  });

  const recording = new Audio.Recording();
  await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.HIGH_QUALITY);
  await recording.startAsync();

  console.log("🎙️ Recording started");
  return recording;
}

export async function stopRecordingAndTranscribe(
  recording: Audio.Recording,
  serverUrl: string = SERVER_URL,
  ext: string = "3gp",
  lang: "en" | "hi" = "en"
): Promise<string | null> {
  await recording.stopAndUnloadAsync();
  const uri = recording.getURI();
  if (!uri) return null;
  console.log("⏹️ Recording stopped at:", uri);

  const blob = await fileUriToBlob(uri, `audio/${ext}`);
  return uploadToServer(blob, serverUrl, ext, lang);
}

// ==========================
// Modern helpers
// ==========================
export async function fileUriToBlob(uri: string, type: string = "audio/3gp"): Promise<Blob> {
  const fileData = await FileSystem.readAsStringAsync(uri, {
    encoding: FileSystem.EncodingType.Base64,
  });
  const buffer = Uint8Array.from(atob(fileData), (c) => c.charCodeAt(0));
  return new Blob([buffer], { type });
}

export async function uploadToServer(
  blob: Blob,
  serverUrl: string,
  ext: string = "3gp",
  lang: "en" | "hi" = "en"
): Promise<string | null> {
  try {
    const formData = new FormData();
    formData.append("file", new File([blob], `recording.${ext}`, { type: blob.type }));

    const urlWithLang = `${serverUrl}?lang=${lang}`;
    const res = await fetch(urlWithLang, { method: "POST", body: formData });
    const data = await res.json();

    console.log("✅ STT Response:", data.text || data.transcript);
    return data.text || data.transcript || null;
  } catch (err) {
    console.error("❌ Upload failed:", err);
    return null;
  }
}
