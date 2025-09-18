import { ELEVENLABS_API_KEY, VOICE_ID } from "@env";
import { useState } from "react";

const ELEVENLABS_URL = "https://api.elevenlabs.io/v1/text-to-speech";

export function useVoice() {
  const [isPlaying, setIsPlaying] = useState(false);

  const speak = async (text: string) => {
    try {
      setIsPlaying(true);
      const response = await fetch(`${ELEVENLABS_URL}/${VOICE_ID}`, {
        method: "POST",
        headers: {
          "Accept": "audio/mpeg",
          "Content-Type": "application/json",
          "xi-api-key": ELEVENLABS_API_KEY,
        },
        body: JSON.stringify({
          text,
          voice_settings: { stability: 0.4, similarity_boost: 0.75 },
        }),
      });

      if (!response.ok) throw new Error("Failed to fetch audio");

      const audioBlob = await response.blob();
      const audioUrl = URL.createObjectURL(audioBlob);
      const audio = new Audio(audioUrl);

      audio.play();
      audio.onended = () => setIsPlaying(false);
    } catch (error) {
      console.error("Error with ElevenLabs TTS:", error);
      setIsPlaying(false);
    }
  };

  return { speak, isPlaying };
}
