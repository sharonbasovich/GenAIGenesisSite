from flask import Flask, render_template, request, jsonify
from google.cloud import speech
import io
import ffmpeg
import tempfile
import os

app = Flask(__name__)

# Google Speech-to-Text Function
def transcribe_audio(audio_bytes):
    client = speech.SpeechClient()

    audio = speech.RecognitionAudio(content=audio_bytes)
    config = speech.RecognitionConfig(
        encoding=speech.RecognitionConfig.AudioEncoding.LINEAR16,
        sample_rate_hertz=16000,  # Match the conversion rate.
        language_code="en-US",
    )

    response = client.recognize(config=config, audio=audio)

    transcript = ""
    for result in response.results:
        transcript += result.alternatives[0].transcript + " "

    return transcript.strip()

# Webpage Route
@app.route("/")
def index():
    return render_template("index.html")

# Audio Processing Route
@app.route("/transcribe", methods=["POST"])
def transcribe():
    if "audio" not in request.files:
        return jsonify({"error": "No audio file received"}), 400

    file = request.files["audio"]
    audio_data = file.read()

    if not audio_data:
        return jsonify({"error": "Empty audio file received"}), 400

    # Convert WebM to WAV if necessary
    if file.filename.endswith(".webm") or file.content_type == "audio/webm":
        print("Converting WebM to WAV...")
        audio_data = convert_webm_to_wav(audio_data)

    # Transcribe the audio
    transcript = transcribe_audio(audio_data)
    return jsonify({"transcript": transcript})

def convert_webm_to_wav(webm_audio):
    """Converts WebM/Opus to WAV (16kHz, mono)."""
    temp_webm = tempfile.NamedTemporaryFile(delete=False, suffix=".webm")
    temp_wav = tempfile.NamedTemporaryFile(delete=False, suffix=".wav")

    temp_webm.write(webm_audio)
    temp_webm.close()

    # Convert WebM to WAV using ffmpeg. Match sample rate to 16000.
    ffmpeg.input(temp_webm.name).output(temp_wav.name, format="wav", acodec="pcm_s16le", ar="16000").run(overwrite_output=True)

    with open(temp_wav.name, "rb") as f:
        wav_audio = f.read()

    os.remove(temp_webm.name)
    os.remove(temp_wav.name)

    return wav_audio

if __name__ == "__main__":
    app.run(debug=True)