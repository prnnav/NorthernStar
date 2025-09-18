// useVoiceSocket.ts
import { useCallback, useEffect, useRef, useState } from "react";

const SERVER_URL = "ws://192.168.0.103:5001"; // <--- set to your WS server
// If you run the server elsewhere, change this URL.
const HTTP_URL = "http://192.168.0.103:5002/chat";

interface VoiceSocketState {
  isConnecting: boolean;
  isConnected: boolean;
  transcript: string;
  error: string | null;
}

interface ServerMessage {
  type: string;
  text?: string;
  lang?: string;
  error?: string;
  audio?: string; // base64 wav audio from server
  status?: string;
}

export function useVoiceSocket() {
  const [state, setState] = useState<VoiceSocketState>({
    isConnecting: false,
    isConnected: false,
    transcript: "",
    error: null,
  });

  const ws = useRef<WebSocket | null>(null);
  const stream = useRef<MediaStream | null>(null);
  const audioContext = useRef<AudioContext | null>(null);
  const processor = useRef<ScriptProcessorNode | null>(null);
  const isMounted = useRef(true);

  // Play WAV audio (base64)
  const playAudio = useCallback(async (base64: string) => {
    try {
      if (!audioContext.current) {
        audioContext.current = new AudioContext();
      }

      // decode base64 -> ArrayBuffer
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
      }
      const arrayBuffer = bytes.buffer;

      // decode audio data
      const audioBuffer = await audioContext.current.decodeAudioData(arrayBuffer.slice(0));
      const source = audioContext.current.createBufferSource();
      source.buffer = audioBuffer;
      source.connect(audioContext.current.destination);
      source.start(0);
    } catch (err) {
      console.error("Audio playback error:", err);
    }
  }, []);

  // Helper to dispatch DOM events so other UI code can listen and add chat messages
  const emitVoiceTranscriptEvent = useCallback((text: string) => {
    try {
      window.dispatchEvent(new CustomEvent("voice-transcript", { detail: { text } }));
    } catch (e) {
      // ignore if environment doesn't support window events
    }
  }, []);

  const emitVoiceAssistantEvent = useCallback((text: string) => {
    try {
      window.dispatchEvent(new CustomEvent("voice-assistant-response", { detail: { text } }));
    } catch (e) {
      // ignore
    }
  }, []);

  // Cleanup resources
  const cleanup = useCallback(() => {
    if (processor.current) {
      try {
        processor.current.disconnect();
      } catch {}
      processor.current.onaudioprocess = null;
      processor.current = null;
    }
    if (audioContext.current) {
      try {
        audioContext.current.close();
      } catch {}
      audioContext.current = null;
    }
    if (stream.current) {
      try {
        stream.current.getTracks().forEach((t) => t.stop());
      } catch {}
      stream.current = null;
    }
    if (ws.current && ws.current.readyState < 2) {
      try {
        ws.current.close();
      } catch {}
    }
    ws.current = null;

    if (isMounted.current) {
      setState({
        isConnecting: false,
        isConnected: false,
        transcript: "",
        error: null,
      });
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    return () => {
      isMounted.current = false;
      cleanup();
    };
  }, [cleanup]);

  const connect = useCallback(async () => {
    if (ws.current || state.isConnecting) return;
    setState((prev) => ({ ...prev, isConnecting: true }));

    try {
      stream.current = await navigator.mediaDevices.getUserMedia({ audio: true });

      // create AudioContext at 16000 if possible (some browsers ignore sampleRate)
      audioContext.current = new AudioContext();
      const source = audioContext.current.createMediaStreamSource(stream.current);

      // ScriptProcessorNode fallback for audio capture
      const bufferSize = 4096;
      processor.current = audioContext.current.createScriptProcessor(bufferSize, 1, 1);
      source.connect(processor.current);
      // connect to destination only to keep node alive (do not play local audio)
      processor.current.connect(audioContext.current.destination);

      ws.current = new WebSocket(SERVER_URL);
      ws.current.binaryType = "arraybuffer";

      ws.current.onopen = () => {
        if (!isMounted.current) return;
        console.log("[useVoiceSocket] Connected to STT server ✅");
        setState((prev) => ({
          ...prev,
          isConnecting: false,
          isConnected: true,
          transcript: "",
          error: null,
        }));

        // optional: send start message
        ws.current?.send(JSON.stringify({ type: "start", lang: "en" }));

        // Stream mic audio continuously as PCM16 little-endian
        processor.current!.onaudioprocess = (e) => {
          try {
            if (!ws.current || ws.current.readyState !== WebSocket.OPEN) return;
            const input = e.inputBuffer.getChannelData(0);
            const buffer = new ArrayBuffer(input.length * 2);
            const view = new DataView(buffer);
            for (let i = 0; i < input.length; i++) {
              let s = Math.max(-1, Math.min(1, input[i]));
              // convert float to PCM16
              view.setInt16(i * 2, s < 0 ? s * 0x8000 : s * 0x7fff, true);
            }
            ws.current.send(buffer);
          } catch (err) {
            console.error("Audio stream send error:", err);
          }
        };
      };

      ws.current.onmessage = (event) => {
        if (!isMounted.current) return;
        try {
          const data: ServerMessage = JSON.parse(event.data);

          if (data.type === "transcript" && data.text) {
            // append transcript to internal state
            setState((prev) => ({
              ...prev,
              transcript: (prev.transcript ? prev.transcript + " " : "") + data.text,
            }));
            // emit event so chat UI can add user message (transcript)
            emitVoiceTranscriptEvent(data.text);
          } else if (data.type === "response") {
            if (data.text) {
              // emit assistant text to chat UI
              emitVoiceAssistantEvent(data.text);
            }
            if (data.audio) {
              // play TTS audio
              playAudio(data.audio);
            }
          } else if (data.type === "status" && data.status) {
            // handle status messages if needed
            console.log("[useVoiceSocket] status:", data.status);
          } else if (data.error) {
            console.error("Server error:", data.error);
            setState((prev) => ({ ...prev, error: data.error ?? null }));
          }
        } catch (e) {
          console.error("Invalid server message:", e, event.data);
        }
      };

      ws.current.onclose = () => {
        console.log("[useVoiceSocket] Disconnected");
        cleanup();
      };

      ws.current.onerror = (e) => {
        console.error("WebSocket error", e);
        setState((prev) => ({ ...prev, error: "WebSocket error" }));
        cleanup();
      };
    } catch (err) {
      console.error("Microphone error", err);
      setState((prev) => ({ ...prev, error: "Failed to access microphone" }));
      cleanup();
    }
  }, [cleanup, playAudio, state.isConnecting, emitVoiceTranscriptEvent, emitVoiceAssistantEvent]);

  const disconnect = useCallback(() => {
    if (ws.current?.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(JSON.stringify({ type: "stop" }));
      } catch {}
    }
    cleanup();
  }, [cleanup]);

  const switchLanguage = useCallback((lang: string) => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      try {
        ws.current.send(JSON.stringify({ type: "switch_lang", lang }));
      } catch (e) {
        console.error("Failed to send switch_lang", e);
      }
    }
  }, []);

  return {
    connect,
    disconnect,
    switchLanguage,
    isConnecting: state.isConnecting,
    isConnected: state.isConnected,
    transcript: state.transcript.trim(),
    error: state.error,
  };
}
