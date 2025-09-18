import { Text } from "react-native";
import { Emotion } from "../hooks/useEmotion";

export default function EmotionIndicator({ emotion }: { emotion: Emotion }) {
  const emojiMap: Record<Emotion, string> = {
    neutral: "😐",
    happy: "😊",
    sad: "😢",
    angry: "😡",
    excited: "🤩",
  };

  return <Text style={{ fontSize: 24, marginVertical: 5 }}>{emojiMap[emotion]}</Text>;
}
