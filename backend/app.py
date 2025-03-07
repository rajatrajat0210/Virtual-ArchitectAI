import cv2
import numpy as np
import pytesseract
import groq
import os
import tempfile
import base64
from gtts import gTTS
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, FileResponse
from PIL import Image
import uvicorn

# Initialize Groq Client
groq_client = groq.Client(api_key="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")  # Replace with your actual API key

# Set Tesseract OCR Path
pytesseract.pytesseract.tesseract_cmd = "/opt/homebrew/bin/tesseract"  # Update for your system

# Store last floorplan analysis & chat history
latest_audio_file = None
chat_history = []
last_floorplan_context = {"features": "No floorplan uploaded yet.", "text": "No text detected."}

# Initialize FastAPI App
app = FastAPI()

# Enable CORS for Frontend Requests
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Update this if hosting React elsewhere
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
async def root():
    return {"message": "Welcome to the AI Floorplan Analyzer API!"}

def detect_floorplan_features(image_path):
    """Detect rooms, walls, and extract text labels using OpenCV and OCR."""
    image = Image.open(image_path)
    image_cv = np.array(image.convert("RGB"))
    gray = cv2.cvtColor(image_cv, cv2.COLOR_RGB2GRAY)

    # Apply edge detection
    edges = cv2.Canny(gray, 50, 150)

    # Detect walls using Hough Line Transform
    lines = cv2.HoughLinesP(edges, 1, np.pi/180, threshold=120, minLineLength=80, maxLineGap=10)
    wall_count = len(lines) if lines is not None else 0

    # Detect rooms using contour detection
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    room_count = sum(1 for c in contours if cv2.contourArea(c) > 1000)  

    # Extract text labels using OCR
    extracted_text = pytesseract.image_to_string(gray, config='--psm 6').strip()

    detected_features = f"Walls: {wall_count}, Rooms: {room_count}"

    return detected_features, extracted_text, edges

def text_to_speech(text):
    """Convert AI response to speech using gTTS and return an audio file path."""
    temp_dir = tempfile.gettempdir()
    file_path = os.path.join(temp_dir, "speech_output.mp3")

    # Remove existing file
    if os.path.exists(file_path):
        os.remove(file_path)

    # Generate speech
    tts = gTTS(text=text, lang="en")
    tts.save(file_path)

    return file_path

@app.post("/api/upload")
async def upload_image(file: UploadFile = File(...)):
    """API for uploading an image and analyzing the floorplan"""
    global last_floorplan_context, chat_history, latest_audio_file

    temp_path = f"/tmp/{file.filename}"
    with open(temp_path, "wb") as f:
        f.write(await file.read())

    # Process Image
    detected_features, extracted_text, edges = detect_floorplan_features(temp_path)

    # Convert Edge Detection to Base64 for Frontend Display
    _, buffer = cv2.imencode('.png', edges)
    edge_detection_image = f"data:image/png;base64,{base64.b64encode(buffer).decode('utf-8')}"

    # Store floorplan context for chat
    last_floorplan_context = {
        "features": detected_features,
        "text": extracted_text if extracted_text else "No text detected"
    }

    # AI Architectural Analysis
    prompt = f"""
    You are an expert architect analyzing a floorplan. Provide precise, **actionable recommendations** to optimize the space.

## 📌 **Extracted Room Data**
{extracted_text if extracted_text else "No text detected"}

## 🏗 **Wall & Room Connectivity Analysis**
- **Walls Detected**: {detected_features}


## 🔍 **Key Architectural Considerations**
  **Space Efficiency** 🏠  
   - Identify underutilized areas.  
   - Suggest optimizations for better functionality.  

  **Traffic Flow 🚶‍♂️**  
   - Detect bottlenecks or congestion points.  
   - Recommend layout adjustments for better movement.  

  **Natural Lighting 🌞**  
   - Identify areas that need more light exposure.  
   - Suggest where windows or skylights should be added.  

  **Room Expansion & Layout Enhancements 📏**  
   - Suggest which walls could be reconfigured or removed.  
   - Propose creative solutions to improve space utilization.  

   **Ensure responses are structured and easy to read.**  
   **Provide expert insights with real-world architectural principles.**  
   **Format recommendations clearly using bullet points or short paragraphs and don't make it too big**
   **There should be spacing between each considerations so anyone can read easily.**
    """

    response = groq_client.chat.completions.create(
        model="llama3-70b-8192",
        messages=[{"role": "system", "content": prompt}],
        max_tokens=500
    )

    ai_reply = response.choices[0].message.content
    chat_history.clear()
    chat_history.append(("AI Recommendation", ai_reply))

    # Generate voice response
    latest_audio_file = text_to_speech(ai_reply)

    return JSONResponse(content={
        "edge_detection_image": edge_detection_image,
        "ai_response": ai_reply,
        "audio_url": f"/file/{os.path.basename(latest_audio_file)}"
    })

@app.post("/api/chat")
async def chat_with_ai(request: dict):
    """Handles user chat interactions with AI, considering floorplan context."""
    global latest_audio_file

    user_message = request.get("message", "").strip()
    if not user_message:
        raise HTTPException(status_code=400, detail="Message cannot be empty.")

    # Provide floorplan context if available
    floorplan_context = f"**Floorplan Summary**:\n- {last_floorplan_context['features']}\n- Extracted Text: {last_floorplan_context['text']}" \
        if last_floorplan_context["features"] != "No floorplan uploaded yet." else ""

    # AI Chat Response
    prompt = f"User Question: {user_message}\n{floorplan_context}\nProvide an expert response."
    response = groq_client.chat.completions.create(
        model="llama-3.3-70b-versatile",
        messages=[{"role": "user", "content": prompt}],
        max_tokens=600
    )

    ai_reply = response.choices[0].message.content
    chat_history.append((user_message, ai_reply))

    # Generate AI voice response
    latest_audio_file = text_to_speech(ai_reply)

    return JSONResponse(content={"reply": ai_reply, "audio_url": f"/file/{os.path.basename(latest_audio_file)}"})

@app.get("/file/{filename}")
async def get_audio(filename: str):
    """Endpoint to serve the generated AI audio response"""
    file_path = os.path.join(tempfile.gettempdir(), filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, media_type="audio/mpeg")
    raise HTTPException(status_code=404, detail="File not found.")

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
