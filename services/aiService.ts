import Constants from 'expo-constants';

const OPENAI_API_KEY = Constants.expoConfig?.extra?.OPENAI_API_KEY;

export interface AIResponse {
  text: string;
}

export async function askAI(userMessage: string): Promise<AIResponse> {
  if (!OPENAI_API_KEY) {
    throw new Error('OpenAI API key is missing. Please add it to your app.json.');
  }

  const payload = {
    model: 'gpt-4o-mini',
    messages: [
      {
        role: 'system',
        content: 'You are NorthernStar, a warm, emotionally intelligent AI companion. Reply with a natural, supportive, and concise tone.'
      },
      { role: 'user', content: userMessage },
    ],
    temperature: 0.7,
    max_tokens: 150,
  };

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`OpenAI API Error: ${errorData.error.message}`);
    }

    const data = await response.json();
    const text = data?.choices?.[0]?.message?.content ?? "I'm not sure how to respond to that.";

    return { text: text.trim() };

  } catch (error) {
    console.error("Error calling OpenAI:", error);
    return { text: "Sorry, I'm having trouble connecting right now." };
  }
}