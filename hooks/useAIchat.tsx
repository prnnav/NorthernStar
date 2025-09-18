// hooks/useAIChat.ts
import { useState, useCallback } from "react";
import { Audio } from "expo-av";
import Constants from "expo-constants";
import { askAI, AIResponse } from "../services/aiService";
import * as FileSystem from "expo-file-system";

// Get values from app.json → expo.extra or from env
const cfg = (Constants.expoConfig as any) ?? (Constants as any).manifest;
const EXTRA = (cfg?.extra ?? {}) as Record<string, string>;

const ELEVENLABS_API_KEY =
  EXTRA?.ELEVENLABS_API_KEY ?? process.env.ELEVENLABS_API_KEY;
const ELEVENLABS_VOICE_ID =
  EXTRA?.ELEVENLABS_VOICE_ID ?? process.env.ELEVENLABS_VOICE_ID;

export interface ChatMessage {
  id: string;
  from: "user" | "ai";
  text: string;
  emotion?: string;
}

// Convert ArrayBuffer → Base64 (React Native safe)
function arrayBufferToBase64(buffer: ArrayBuffer): string {
  let binary = "";
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;

  for (let i = 0; i < bytes.length; i += chunkSize) {
    const chunk = bytes.subarray(i, i + chunkSize);
    binary += String.fromCharCode.apply(null, chunk as unknown as number[]);
  }

  return btoa(binary);
}

export function useAIChat(enableVoice: boolean = true) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentEmotion, setCurrentEmotion] = useState<string>("calm");

  // Map emotion → ElevenLabs voice (you can expand later)
  const emotionToVoice = (emotion?: string) => {
    switch (emotion) {
      case "cheerful":
      case "empathetic":
      case "encouraging":
      case "thoughtful":
      case "calm":
      default:
        return ELEVENLABS_VOICE_ID || "alloy";
    }
  };

  // Text-to-speech playback
  const speakText = useCallback(
    async (text: string, emotion?: string) => {
      if (!enableVoice || !text.trim() || !ELEVENLABS_API_KEY) {
        console.warn("Skipping TTS: missing text or API key");
        return;
      }

      try {
        const voice = emotionToVoice(emotion || currentEmotion);
        const uri = await generateSpeechFromElevenLabs(
          text,
          voice,
          ELEVENLABS_API_KEY
        );

        const { sound } = await Audio.Sound.createAsync({ uri });
        await sound.playAsync();
      } catch (err) {
        console.warn("Error playing AI audio:", err);
      }
    },
    [enableVoice, currentEmotion]
  );

  // Send message → AI → respond + TTS
  const sendMessage = useCallback(
    async (text: string, systemPrompt?: string) => {
      if (!text.trim()) return;

      const userMsg: ChatMessage = {
        id: Date.now().toString(),
        from: "user",
        text: text.trim(),
      };
      setMessages((prev) => [...prev, userMsg]);

      setLoading(true);
      setError(null);

      try {
        const aiResp: AIResponse = await askAI(text, systemPrompt);

        const aiMsg: ChatMessage = {
          id: (Date.now() + 1).toString(),
          from: "ai",
          text: aiResp.text,
          emotion: aiResp.emotion ?? currentEmotion,
        };

        setMessages((prev) => [...prev, aiMsg]);
        setCurrentEmotion(aiMsg.emotion || currentEmotion);

        await speakText(aiMsg.text, aiMsg.emotion);
        return aiMsg;
      } catch (err: any) {
        setError(err.message || "Unknown AI error");

        const errorMsg: ChatMessage = {
          id: (Date.now() + 2).toString(),
          from: "ai",
          text: "⚠️ Error: " + (err.message || "Unknown error"),
        };

        setMessages((prev) => [...prev, errorMsg]);
        throw err;
      } finally {
        setLoading(false);
      }
    },
    [speakText, currentEmotion]
  );

  return { messages, loading, error, sendMessage, setMessages };
}

// ElevenLabs TTS fetch + save to file
async function generateSpeechFromElevenLabs(
  text: string,
  voice: string,
  apiKey: string
): Promise<string> {
  if (!apiKey) throw new Error("ElevenLabs API key not set");

  console.log("🔊 ElevenLabs request:", { text, voice });

  const response = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${voice}/stream`,
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        accept: "audio/mpeg",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_multilingual_v2",
        voice_settings: { stability: 0.3, similarity_boost: 0.75 },
      }),
    }
  );

  if (!response.ok) {
    throw new Error(
      `ElevenLabs API error: ${response.status} ${response.statusText}`
    );
  }

  const arrayBuffer = await response.arrayBuffer();
  const base64 = arrayBufferToBase64(arrayBuffer);

  const fileUri = FileSystem.cacheDirectory + `tts_${Date.now()}.mp3`;

  await FileSystem.writeAsStringAsync(fileUri, base64, {
    encoding: FileSystem.EncodingType.Base64,
  });

  return fileUri;
}
