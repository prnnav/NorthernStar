import asyncio
import websockets
import whisper
import ollama
import sounddevice as sd
import numpy as np
import wave
import json
import base64
import subprocess
import tempfile
from aiohttp import web
from aiohttp_middlewares import cors_middleware

# -------------------------------
# Hardcoded server config
# -------------------------------
WS_PORT = 5001       # WebSocket server
HTTP_PORT = 5002     # HTTP API server
SAMPLE_RATE = 16000
CHANNELS = 1
SERVER_IP = "IPv4"

# -------------------------------
# Load Whisper model
# -------------------------------
print("Loading Whisper model...")
whisper_model = whisper.load_model("base")  # can be "small", "medium", "large"
print("Whisper model loaded.")

# -------------------------------
# Piper TTS
# -------------------------------
def tts_piper(text: str, output_path: str = "output.wav"):
    """Generate speech using Piper TTS"""
    try:
        subprocess.run(
            [
                "piper",
                "--model",
                "en_US-lessac-medium.onnx",
                "--output_file",
                output_path,
            ],
            input=text,
            text=True,
            check=True,
        )
        return output_path
    except Exception as e:
        print("Piper TTS error:", e)
        return None

# -------------------------------
# Get AI response (Ollama)
# -------------------------------
def get_ai_response(prompt: str) -> str:
    """Call Ollama for AI reply"""
    try:
        response = ollama.chat(
            model="mistral:latest",
            messages=[{"role": "user", "content": prompt}],
        )
        if "message" in response and "content" in response["message"]:
            return response["message"]["content"].strip()
        return "Sorry, Ollama did not return a valid response."
    except Exception as e:
        print("Ollama error:", e)
        return "Sorry, I couldn’t generate a response."

# -------------------------------
# Play audio locally
# -------------------------------
def play_audio(file_path: str):
    """Play .wav file locally"""
    with wave.open(file_path, "rb") as wf:
        data = wf.readframes(wf.getnframes())
        audio = np.frombuffer(data, dtype=np.int16)
        sd.play(audio, wf.getframerate())
        sd.wait()

# -------------------------------
# WebSocket handler
# -------------------------------
async def handle_ws(websocket):
    print("New WebSocket connection")
    audio_buffer = b""

    try:
        async for message in websocket:
            if isinstance(message, bytes):
                audio_buffer += message
            else:
                data = json.loads(message)

                if data.get("event") == "end":
                    # Save audio to temp file
                    with tempfile.NamedTemporaryFile(suffix=".wav", delete=False) as tmpfile:
                        wf = wave.open(tmpfile.name, "wb")
                        wf.setnchannels(CHANNELS)
                        wf.setsampwidth(2)  # 16-bit PCM
                        wf.setframerate(SAMPLE_RATE)
                        wf.writeframes(audio_buffer)
                        wf.close()
                        audio_path = tmpfile.name

                    # Transcribe
                    result = whisper_model.transcribe(audio_path)
                    user_text = result["text"].strip()
                    print("User said:", user_text)

                    await websocket.send(json.dumps({
                        "type": "transcript",
                        "text": user_text
                    }))

                    # AI response
                    ai_text = get_ai_response(user_text)
                    print("AI:", ai_text)

                    # TTS
                    tts_file = tts_piper(ai_text, "response.wav")

                    msg = {
                        "type": "response",
                        "text": ai_text
                    }
                    if tts_file:
                        with open(tts_file, "rb") as f:
                            audio_base64 = base64.b64encode(f.read()).decode("utf-8")
                            msg["audio"] = audio_base64
                    await websocket.send(json.dumps(msg))

                    if tts_file:
                        play_audio(tts_file)

                    audio_buffer = b""

    except websockets.ConnectionClosed:
        print("WebSocket closed")

# -------------------------------
# HTTP handler
# -------------------------------
async def handle_chat(request):
    try:
        data = await request.json()
        user_message = data.get("message", "")
        ai_text = get_ai_response(user_message)
        return web.json_response({"response": ai_text})
    except Exception as e:
        return web.json_response({"error": str(e)}, status=500)
        
# -------------------------------
# Extra Symphony-friendly routes
# -------------------------------
async def handle_credits(request):
    return web.json_response({"credits": 100})  # fake credits for now

async def handle_call_start(request):
    return web.json_response({"call_id": "demo-call-123"})  # placeholder

async def handle_call_end(request):
    return web.json_response({"status": "ended"})  # placeholder

async def handle_call_transcript(request):
    call_id = request.match_info.get("id", "unknown")
    return web.json_response({"call_id": call_id, "transcript": ["Demo transcript line."]})


# -------------------------------
# Main
# -------------------------------
async def main():
    # WebSocket server
    ws_server = await websockets.serve(
        handle_ws,
        "0.0.0.0",
        WS_PORT,
        ping_interval=None  # disable auto pings
    )
    print(f"WebSocket server running at ws://{SERVER_IP}:{WS_PORT}")

    # HTTP server with CORS
    app = web.Application(
        middlewares=[cors_middleware(allow_all=True)]
    )
    app.router.add_post("/chat", handle_chat)
    app.router.add_get("/api/credits/me", handle_credits)
    app.router.add_post("/api/call/start", handle_call_start)
    app.router.add_post("/api/call/end", handle_call_end)
    app.router.add_get("/api/call/transcript/{id}", handle_call_transcript)
    app.router.add_post("/api/chat", handle_chat)

    runner = web.AppRunner(app)
    await runner.setup()
    site = web.TCPSite(runner, "0.0.0.0", HTTP_PORT)
    await site.start()
    print(f"HTTP server running at http://{SERVER_IP}:{HTTP_PORT}")

    await asyncio.Future()  # run forever

if __name__ == "__main__":
    asyncio.run(main())
