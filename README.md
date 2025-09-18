NorthernStar 🌟
Your companion for every conversation.
NorthernStar is a voice-first AI companion designed to provide empathetic support, encourage positive habit formation, and foster a sense of connection. Built with a focus on creating a safe and supportive space, this app leverages multiple AI services to deliver a natural, human-like conversational experience.
Core Features
💬 AI Companion: Engage in open-ended, empathetic conversations through text or real-time voice calls. The AI is designed to be a warm, emotionally intelligent listener.
🎯 Habit Formation: A gamified system to help build and maintain positive daily habits. Track progress, maintain streaks, and earn credits for consistency.
🗣️ Real-time Voice Calls: Experience fluid, live conversations with an ElevenLabs Conversational AI Agent using a real-time audio stream.
📝 Local Speech-to-Text: An offline-first STT server built with Python, Flask, and Vosk for transcribing recorded audio notes.
🫂 Community Connection: A hub to find and connect with other community members on similar journeys.
Tech Stack
The project contains both the mobile application and a local Python server for STT.
Frontend (Mobile App)
Framework: React Native with Expo
Navigation: Expo Router (File-based)
Language: TypeScript
UI Components: Custom components with icons from lucide-react-native
Backend & AI Services
Text AI: OpenAI API (gpt-4o-mini)
Conversational Voice AI: ElevenLabs Conversational AI Agent (via WebSockets)
Local STT Server: Python, Flask, Vosk
Audio Processing: pydub and ffmpeg
Getting Started
Follow these instructions to get a local copy up and running for development and testing purposes.
Prerequisites
Node.js (LTS version recommended)
Python 3.x and Pip
Expo Go app on your mobile device or an Android/iOS emulator
Git
1. External Dependencies (Vosk & FFmpeg)
This project requires external dependencies that are not included in the repository.
Vosk Speech Recognition Model:
Download the lightweight English model (vosk-model-small-en-us-0.15) from the Vosk website.
Unzip the folder.
Rename the folder to model-en and place it inside the /backend directory (you may need to create this directory).
FFmpeg:
Download the FFmpeg binaries for your operating system from the official FFmpeg website.
Place the ffmpeg.exe (or equivalent) binary in a known location on your system.
Important: Open the Python server script and update the path to point to your ffmpeg.exe location.
2. Setup Instructions
Clone the repository:
git clone [https://github.com/your-username/NorthernStar.git](https://github.com/your-username/NorthernStar.git)
cd NorthernStar


Configure Environment Variables:
Open the app.json file.
Locate the extra object.
Fill in your secret keys for OPENAI_API_KEY, ELEVENLABS_API_KEY, and ELEVENLABS_AGENT_ID.
Install Frontend Dependencies:
npm install


Setup and Run the Backend Server:
Create a backend folder in the project root if it doesn't exist.
Place your Python server script (e.g., STTServerindex.py) inside.
Create a virtual environment, activate it, and install the Python dependencies (Flask, vosk, pydub).
Run the server: python STTServerindex.py
Note: Ensure your computer's firewall allows connections on port 5000.
3. Running the Application
With the backend server running in one terminal, start the frontend app in a second terminal.
Terminal 2: Start the Frontend App
# Make sure you are in the project's root directory
npx expo start

Scan the QR code with the Expo Go app or run on an emulator.
Project Structure
NorthernStar/
├── app/                  # Expo Router screens
│   ├── (tabs)/           # Main app screens
│   │   ├── _layout.tsx
│   │   ├── index.tsx     # Dashboard
│   │   ├── interact.tsx  # AI Companion Chat
│   │   └── ...
│   └── _layout.tsx       # Root layout
├── assets/               # Fonts and images
├── services/             # API service logic
│   ├── aiService.ts      # OpenAI text service
│   └── elevenLabsCallService.ts # ElevenLabs voice service
└── app.json              # App configuration and API keys
