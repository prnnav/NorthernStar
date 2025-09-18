import Constants from 'expo-constants';
import { Audio } from 'expo-av';
import * as FileSystem from 'expo-file-system';

// We will read keys inside the function to prevent import-time crashes
let ws: WebSocket | null = null;
let audioPlayer: Audio.Sound | null = null;
let recording: Audio.Recording | null = null;
let isStreaming = false;
let isAuthorized = false;

// --- Microphone Streaming Logic ---
const startStreamingMicrophone = async () => {
  if (isStreaming) return;
  console.log("Attempting to start microphone stream...");
  isStreaming = true;

  try {
    const permission = await Audio.requestPermissionsAsync();
    if (!permission.granted) {
      console.error("Microphone permission was not granted.");
      isStreaming = false;
      return;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      playsInSilentModeIOS: true,
    });

    const record = async () => {
      if (!isStreaming) return;
      
      recording = new Audio.Recording();
      try {
        await recording.prepareToRecordAsync(Audio.RecordingOptionsPresets.LOW_QUALITY);
        await recording.startAsync();
        
        setTimeout(async () => {
          const currentRecording = recording;
          recording = null; 

          if (isStreaming && currentRecording) {
            try {
              await currentRecording.stopAndUnloadAsync();
              const uri = currentRecording.getURI();
            
              if (uri) {
                const base64Data = await FileSystem.readAsStringAsync(uri, {
                  encoding: FileSystem.EncodingType.Base64,
                });
                elevenLabsCallService.sendAudioChunk(base64Data);
                if (isStreaming) record();
              }
            } catch (stopError) {
               console.error('Error processing audio chunk:', stopError);
               if (isStreaming) record();
            }
          }
        }, 700);
      } catch (startError) {
        console.error('Recording chunk failed to start:', startError);
        if (isStreaming) record();
      }
    };

    record();
  } catch (initError) {
    console.error("Failed to initialize microphone streaming:", initError);
    isStreaming = false;
  }
};

const stopStreamingMicrophone = async () => {
  if (!isStreaming) return;
  console.log("Stopping microphone stream...");
  isStreaming = false;
  if (recording) {
    try {
      await recording.stopAndUnloadAsync();
    } catch (error) {
        console.error("Error stopping final recording:", error)
    }
  }
  recording = null;
};


// --- Main Service Object ---
export const elevenLabsCallService = {
  initiateCall: async (): Promise<void> => {
    if (ws) {
        console.log("Call already in progress.");
        return;
    }

    // --- KEY CHECK MOVED INSIDE THE FUNCTION ---
    const ELEVENLABS_API_KEY = Constants.expoConfig?.extra?.ELEVENLABS_API_KEY;
    const AGENT_ID = Constants.expoConfig?.extra?.ELEVENLABS_AGENT_ID;

    if (!ELEVENLABS_API_KEY || !AGENT_ID) {
      console.error("CRITICAL ERROR: ElevenLabs API Key or Agent ID is missing or incorrect in app.json. Please verify your configuration and restart the server with --clear flag.");
      return;
    }

    const wsUrl = `wss://api.elevenlabs.io/v1/conversational/${AGENT_ID}/connect`;
    ws = new WebSocket(wsUrl);

    ws.onopen = () => {
      console.log("WebSocket connected. Sending authorization message...");
      if (ws) {
        const initialMessage = {
          "xi_api_key": ELEVENLABS_API_KEY,
          "enable_updates": true,
        };
        ws.send(JSON.stringify(initialMessage));
      }
    };

    ws.onmessage = async (event) => {
      const data = JSON.parse(event.data);

      if (data.user_id && !isAuthorized) {
          isAuthorized = true;
          console.log("AUTHORIZATION SUCCESSFUL. Starting microphone stream.");
          startStreamingMicrophone();
      }

      if (data.audio) {
        console.log("Received audio chunk from ElevenLabs.");
        const audioData = `data:audio/mp3;base64,${data.audio}`;
        try {
          if (audioPlayer) await audioPlayer.unloadAsync();
          await Audio.setAudioModeAsync({ allowsRecordingIOS: false, playsInSilentModeIOS: true });
          const { sound } = await Audio.Sound.createAsync({ uri: audioData });
          audioPlayer = sound;
          await audioPlayer.playAsync();
          sound.setOnPlaybackStatusUpdate(async (status) => {
              if (status.isLoaded && status.didJustFinish) {
                  await Audio.setAudioModeAsync({ allowsRecordingIOS: true, playsInSilentModeIOS: true });
              }
          });
        } catch (error) {
          console.error("Error playing incoming audio:", error);
        }
      }
    };

    ws.onerror = (error) => { console.error("WebSocket Connection Error:", error); };

    ws.onclose = () => {
      console.log("WebSocket disconnected.");
      isAuthorized = false;
      ws = null;
    };
  },

  sendAudioChunk: (base64Data: string): void => {
    if (ws && ws.readyState === WebSocket.OPEN && isAuthorized) {
      const message = { "audio": base64Data };
      ws.send(JSON.stringify(message));
    }
  },

  endCall: (): void => {
    stopStreamingMicrophone();
    if (ws) {
      ws.close();
    }
    if (audioPlayer) {
      audioPlayer.unloadAsync();
    }
    ws = null;
    audioPlayer = null;
    isAuthorized = false;
  },
  
  muteMicrophone: () => stopStreamingMicrophone(),
  unmuteMicrophone: () => startStreamingMicrophone(),
};

