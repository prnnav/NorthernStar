// components/ChatBubble.tsx
import React from "react";
import { View, Text } from "react-native";

type ChatMessage = {
  id: string;
  from: "user" | "ai";
  text: string;
};

export default function ChatBubble({ message }: { message: ChatMessage }) {
  const isUser = message.from === "user";
  return (
    <View
      style={{
        alignSelf: isUser ? "flex-end" : "flex-start",
        backgroundColor: isUser ? "#111827" : "#F3F4F6",
        paddingVertical: 10,
        paddingHorizontal: 14,
        borderRadius: 16,
        marginVertical: 6,
        maxWidth: "82%",
      }}
    >
      <Text style={{ color: isUser ? "#fff" : "#111827", fontSize: 16, lineHeight: 22 }}>{message.text}</Text>
    </View>
  );
}
