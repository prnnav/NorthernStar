import { Platform } from "react-native";

// Define the structure for the callbacks object
interface Callbacks {
  onConnect: () => void;
  onDisconnect: (event: CloseEvent) => void;
  onTranscriptUpdate: (text: string) => void;
  onAudioPlayback: (audioData: ArrayBuffer) => void;
}

class VoiceService {
  private ws: WebSocket | null = null;
  private mediaRecorder: MediaRecorder | null = null;
  private stream: MediaStream | null = null;

  // Store callbacks
  private callbacks: Callbacks | null = null;

  // Use the specific IP address for your server
  private readonly SERVER_URL = "ws://192.168.0.103:5001";

  public async startCall(callbacks: Callbacks) {
    if (this.ws) {
      console.warn("[VoiceService] Call is already in progress.");
      return;
    }

    this.callbacks = callbacks;

    try {
      console.log("[VoiceService] Requesting microphone access...");
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log("[VoiceService] Microphone access granted");

      console.log(`[VoiceService] Connecting to WebSocket at ${this.SERVER_URL}...`);
      this.ws = new WebSocket(this.SERVER_URL);

      this.ws.onopen = () => {
        console.log("[VoiceService] WebSocket connected.");
        this.callbacks?.onConnect();
        this.startRecording();
      };

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          switch (data.type) {
            case "stt":
              this.callbacks?.onTranscriptUpdate(data.text);
              break;
            case "tts_base64":
              const binaryString = window.atob(data.audio);
              const len = binaryString.length;
              const bytes = new Uint8Array(len);
              for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
              this.callbacks?.onAudioPlayback(bytes.buffer);
              break;
          }
        } catch (e) {
          console.error("[VoiceService] Error parsing server message:", e);
        }
      };

      this.ws.onclose = (event) => {
        console.log(`[VoiceService] WebSocket closed. Code: ${event.code}, Reason: ${event.reason}`);
        this.callbacks?.onDisconnect(event);
        this.cleanup(); // Centralized cleanup
      };

      this.ws.onerror = (error) => {
        console.error("[VoiceService] WebSocket connection error. Is the server running and the IP correct?", error);
      };

    } catch (error) {
      console.error("[VoiceService] Error starting call:", error);
      this.cleanup();
    }
  }

  private startRecording() {
    if (!this.stream || !this.ws) return;

    this.mediaRecorder = new MediaRecorder(this.stream);
    this.mediaRecorder.onstart = () => console.log("[VoiceService] Recording started...");
    
    this.mediaRecorder.ondataavailable = async (event) => {
      if (event.data && event.data.size > 0 && this.ws?.readyState === WebSocket.OPEN) {
        const arrayBuffer = await event.data.arrayBuffer();
        this.ws.send(arrayBuffer);
      }
    };
    
    this.mediaRecorder.start(1000); // Send audio every second
  }

  public stopCall() {
    if (this.ws) {
      this.ws.close();
    } else {
      // If there's no websocket, just clean up local resources
      this.cleanup();
    }
  }

  // Central cleanup function
  private cleanup() {
    console.log("[VoiceService] Cleaning up resources...");
    if (this.mediaRecorder && this.mediaRecorder.state !== "inactive") {
      this.mediaRecorder.stop();
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.ws = null;
    this.stream = null;
    this.mediaRecorder = null;
    // Don't clear callbacks here, onDisconnect needs them.
  }

  public switchLanguage(lang: "en" | "hi") {
    if (this.ws && this.ws.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify({ type: "switch_lang", lang }));
  }

  public sendTTS(text: string, lang: "en" | "hi") {
    if (this.ws && this.ws.readyState === WebSocket.OPEN)
      this.ws.send(JSON.stringify({ type: "tts", text, lang }));
  }
}

export default new VoiceService();

