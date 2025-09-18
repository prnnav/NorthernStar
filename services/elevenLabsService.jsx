// services/elevenLabsService.js
export async function generateSpeech(text) {
  try {
    const apiKey = import.meta.env.VITE_ELEVENLABS_API_KEY; // store in .env
    const voiceId = "pNInz6obpgDQGcFmaJgB"; // Replace with your chosen ElevenLabs voice ID
    const url = `https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`;

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "xi-api-key": apiKey,
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_monolingual_v1", // or use multilingual model if needed
        voice_settings: {
          stability: 0.5,
          similarity_boost: 0.8,
        },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to fetch audio from ElevenLabs");
    }

    // Convert response to blob and create a URL
    const blob = await response.blob();
    return URL.createObjectURL(blob);
  } catch (error) {
    console.error("Error generating speech:", error);
    return null;
  }
}
