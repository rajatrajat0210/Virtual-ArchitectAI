# 🏠 Virtual Architect: AI-Powered Floorplan Analysis & Recommendations

![Virtual Architect](https://huggingface.co/spaces/rajat1343/VirtualArchAI)
![Virtual Architect](https://huggingface.co/spaces/rajat1343/VirtualArchAI) 
![Virtual Architect](https://huggingface.co/spaces/rajat1343/VirtualArchAI) 
![Virtual Architect](https://huggingface.co/spaces/rajat1343/VirtualArchAI) 
_A cutting-edge AI tool that analyzes floorplans, detects architectural elements, and provides intelligent recommendations using computer vision and LLMs._

---

## 🚀 Overview
Virtual Architect is an AI-driven floorplan analysis tool that leverages **FastAPI, React, Tailwind, and OpenCV** to provide real-time architectural insights. Users can **upload floorplans**, interact with the AI assistant via **chat and voice**, and receive actionable design recommendations.

---

## ✨ Features
- ✅ **Upload & Analyze Floorplans** – Detect walls, rooms, and extract architectural elements.  
- ✅ **AI Chatbot** – Get expert architectural advice through natural language interaction.  
- ✅ **Voice Mode** – AI-generated responses converted to speech for better accessibility.  
- ✅ **Image Processing** – Uses **OpenCV** and **Tesseract OCR** for feature extraction.  
- ✅ **Real-Time Recommendations** – Optimized room layouts, traffic flow suggestions, and lighting guidance.  
- ✅ **Interactive UI** – Built with **React + TailwindCSS** for a seamless user experience.  

---

## 🛠 Tech Stack
### **Frontend**
- ⚛️ **React (Cursor-based)**
- 🎨 **TailwindCSS**
- 📦 **Axios for API Requests**
  
### **Backend**
- 🚀 **FastAPI (Python)**
- 🖥️ **OpenCV & Pytesseract** (Computer Vision & OCR)
- 🗣 **gTTS (Google Text-to-Speech)**
- 🧠 **Groq LLaMA-3** (LLM for AI-driven recommendations)
  
### **Deployment**
- 🖥 **Frontend:** Netlify  
- 🔗 **Backend:** Railway _(Future)_, Localhost _(Current)_

---

## 🔧 Setup & Installation
### **1️⃣ Clone the Repository**
```sh
git clone https://github.com/yourusername/VirtualArchitect.git
cd VirtualArchitect

1️⃣ Clone the Repository
```bash
sh
Copy
Edit
git clone https://github.com/yourusername/VirtualArchitect.git
cd VirtualArchitect
```
2️⃣ Backend Setup (FastAPI)
```bash
sh
Copy
Edit
cd backend
python -m venv venv  # Create a virtual environment
source venv/bin/activate  # (Mac/Linux) Activate venv
venv\Scripts\activate  # (Windows) Activate venv
pip install -r requirements.txt  # Install dependencies
```
3️⃣ Frontend Setup (React)
```bash
sh
Copy
Edit
cd ../frontend
npm install  # Install dependencies
npm run dev  # Start frontend server
```
4️⃣ Run Backend Server
```bash
sh
Copy
Edit
cd backend
uvicorn app:app --reload
Backend will be available at http://localhost:8000
Frontend will be available at http://localhost:3000
```
🚀 Deployment
1️⃣ Deploy Backend (Railway)
**Sign up on Railway.app**
**Create a new project and upload your FastAPI backend8**
**Add environment variables (.env file for API keys)**
**Deploy & get the API URL**

2️⃣ Deploy Frontend (Netlify)
**Sign up on Netlify**  
**Drag and drop the frontend folder in Netlify**
**Set the REACT_APP_API_URL environment variable to your backend URL**
**Deploy & get the website URL**

📈 Future Improvements
✅ **Use GPT-4V, DeepSeek, or Claude for enhanced AI reasoning.**
✅ **Train a custom YOLOv8 model for better room and furniture detection.**
✅ **Improve UI with real-time 3D modeling and drag-and-drop layout features.**
✅ **Optimize API response times and integrate scalable cloud hosting.**

🎯 Why the FastAPI Version Was Not Deployed?
While the Gradio version was deployed on Hugging Face for quick feature validation, the FastAPI + React version requires dedicated cloud hosting for full functionality. Due to higher infrastructure requirements and costs, it is currently running locally, as shown in the documentation and demo video.

📜 License
This project is open-source and available under the MIT License.

📩 Contact
👤 Rajat
📧 Email: rajat.rajat0210@gmail.com
🔗 LinkedIn: https://www.linkedin.com/in/rajat-rajat12/  
🔗 Deployed Demo (Gradio): https://huggingface.co/spaces/rajat1343/VirtualArchAI

This README will provide clear documentation for users, contributors, and recruiters reviewing your project on GitHub. 🚀 Let me know if you want any modifications!
