import { useState } from "react";

export type Emotion = "neutral" | "happy" | "sad" | "angry" | "excited";

export default function useEmotion() {
  const [emotion, setEmotion] = useState<Emotion>("neutral");

  // Basic keyword-driven emotion detection
  function detectEmotion(input: string) {
    const lower = input.toLowerCase();
    if (lower.includes("love") || lower.includes("good")) setEmotion("happy");
    else if (lower.includes("sad") || lower.includes("lonely")) setEmotion("sad");
    else if (lower.includes("angry") || lower.includes("hate")) setEmotion("angry");
    else if (lower.includes("wow") || lower.includes("great")) setEmotion("excited");
    else setEmotion("neutral");
  }

  return { emotion, setEmotion, detectEmotion };
}
