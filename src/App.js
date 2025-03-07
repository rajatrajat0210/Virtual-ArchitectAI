import React, { useState } from "react";
import axios from "axios";
import "tailwindcss/tailwind.css";

function App() {
  const [selectedFile, setSelectedFile] = useState(null);
  const [aiResponse, setAiResponse] = useState("");
  const [chatMessage, setChatMessage] = useState("");
  //const [chatReply, setChatReply] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [processedImage, setProcessedImage] = useState(null);
  const [audioUrl, setAudioUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [chatHistory, setChatHistory] = useState([]); // Chat history state

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleUpload = async () => {
    if (!selectedFile) return alert("Please select a file.");
    setLoading(true);
    const formData = new FormData();
    formData.append("file", selectedFile);
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setAiResponse(response.data.ai_response || "No response from AI");
      setProcessedImage(response.data.edge_detection_image);
      setImagePreview(URL.createObjectURL(selectedFile));
      setAudioUrl(response.data.audio_url ? `http://127.0.0.1:8000${response.data.audio_url}` : "");
    } catch (error) {
      console.error("Error uploading image:", error);
    }
    setLoading(false);
  };

  const handleChatSubmit = async () => {
    if (!chatMessage.trim()) return;
    setLoading(true);
  
    try {
      const response = await axios.post("http://127.0.0.1:8000/api/chat", { message: chatMessage });
      const newEntry = { user: chatMessage, ai: response.data.reply || "No response from AI." };
      
      setChatHistory([...chatHistory, newEntry]); // Append message history
      setChatMessage(""); // Clear input box after sending
    } catch (error) {
      console.error("Chat API Error:", error);
    }
  
    setLoading(false);
  };

  return (
    <div className="bg-gradient-to-b from-white to-gray-50 min-h-screen text-gray-800 flex flex-col items-center p-6 transition-all duration-300">
      <div className="max-w-7xl w-full">
        <h1 className="text-5xl font-bold mb-8 text-center">
          <img 
            src="/makeit.png" 
            alt="Virtual Architect Logo" 
            className="inline-block h-16 w-16 mr-2 object-contain"
          />
          <div className="flex items-baseline justify-center gap-2">
            <span className="font-['Boska'] italic font-bold text-5xl bg-clip-text text-transparent bg-gradient-to-r from-[#CA8535] to-black">
              Virtual Architect
            </span>
            <span className="text-5xl font-bold text-black">
              for
            </span>
          </div>
          <span 
            className="block mt-2 font-bold text-black"
            style={{
              fontSize: '48px',
              letterSpacing: '-0.02em',
              lineHeight: '1.1em',
              transition: 'color 0.725s',
              transform: 'translate3d(0px, 0px, 0px) scale3d(1, 1, 1) rotateX(0deg) rotateY(0deg) rotateZ(0deg) skew(0deg, 0deg)',
              transformStyle: 'preserve-3d',
              opacity: 1,
              fontFamily: 'Satoshi variable, sans-serif'
            }}
          >
            AI Floorplan Assistant
          </span>
        </h1>

        {/* Upload Section */}
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-8 border border-gray-100 hover:border-[#CA8535] transition-all duration-300">
          <div
            className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 ${
              isDragging ? "border-[#CA8535] bg-amber-50" : "border-gray-200 hover:border-[#CA8535] hover:bg-gray-50"
            }`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
          >
            <input
              type="file"
              onChange={handleFileChange}
              className="hidden"
              id="fileInput"
            />
            <label htmlFor="fileInput" className="cursor-pointer">
              <div className="flex flex-col items-center gap-4">
                <svg
                  className="w-12 h-12 text-[#CA8535]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                  />
                </svg>
                <span className="text-lg font-medium text-gray-700">
                  {selectedFile ? selectedFile.name : "Drop your floorplan here or click to upload"}
                </span>
                <span className="text-sm text-gray-500">
                  Supported formats: PNG, JPG, JPEG
                </span>
              </div>
            </label>
          </div>
          <button
            onClick={handleUpload}
            className={`mt-6 w-full py-3 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] ${
              loading
                ? "bg-gray-200 cursor-not-allowed text-gray-500"
                : "bg-gradient-to-r from-[#CA8535] to-black hover:from-[#B77730] hover:to-gray-900 text-white"
            }`}
            disabled={loading}
          >
            <div className="flex items-center justify-center gap-2">
              {loading && (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              )}
              {loading ? "Processing..." : "Upload & Analyze"}
            </div>
          </button>
        </div>

        {/* Images Section */}
        {(imagePreview || processedImage) && (
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {imagePreview && (
              <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-[1.02]">
                <h2 className="text-xl font-semibold mb-4 text-[#CA8535]">Original Floorplan</h2>
                <img
                  src={imagePreview}
                  alt="Uploaded"
                  className="rounded-lg w-full object-cover shadow-md"
                />
              </div>
            )}
            {processedImage && (
              <div className="bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100 transform transition-all duration-300 hover:scale-[1.02]">
                <h2 className="text-xl font-semibold mb-4 text-black">Processed Floorplan</h2>
                <img
                  src={processedImage}
                  alt="Processed"
                  className="rounded-lg w-full object-cover shadow-md"
                />
              </div>
            )}
          </div>
        )}

        {/* AI Response Section */}
        {aiResponse && (
          <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg mb-8 border border-gray-100">
            <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#CA8535] to-black">
              AI Floorplan Recommendations
            </h2>
            <div className="prose prose-sm prose-headings:text-[#CA8535] prose-headings:font-semibold prose-p:text-gray-700 prose-strong:text-[#CA8535] prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1">
              <div
                dangerouslySetInnerHTML={{ 
                  __html: aiResponse
                    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                    .replace(/(\d+\. )/g, '<br><strong>$1</strong>')
                    .replace(/\n\* /g, '<br>• ')
                    .split('\n').join('<br>')
                }}
              />
            </div>
            {audioUrl && (
              <div className="mt-6">
                <audio
                  controls
                  src={audioUrl}
                  className="w-full h-12 rounded-lg shadow-sm"
                ></audio>
              </div>
            )}
          </div>
        )}

        {/* Chat Section */}
        <div className="bg-white/80 backdrop-blur-lg p-8 rounded-2xl shadow-lg border border-gray-100">
          <h2 className="text-xl font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-[#CA8535] to-black">
            Chat with Virtual Architect
          </h2>
          
          {/* Chat History */}
          <div className="mb-6 max-h-[400px] overflow-y-auto">
            {chatHistory.map((entry, index) => (
              <div key={index} className="mb-4">
                <div className="flex flex-col gap-4">
                  {/* User Message */}
                  <div className="flex justify-end">
                    <div className="bg-amber-50 text-[#CA8535] p-3 rounded-2xl rounded-tr-sm max-w-[80%]">
                      <p className="text-sm">{entry.user}</p>
                    </div>
                  </div>
                  
                  {/* AI Response */}
                  <div className="flex justify-start">
                    <div className="bg-gray-100 text-gray-800 p-6 rounded-2xl rounded-tl-sm max-w-[80%]">
                      <div 
                        className="prose prose-sm prose-headings:text-[#CA8535] prose-headings:font-semibold prose-p:text-gray-700 prose-strong:text-[#CA8535] prose-strong:font-semibold prose-ul:list-disc prose-ul:pl-5 prose-li:mb-1"
                        dangerouslySetInnerHTML={{ 
                          __html: entry.ai
                            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                            .replace(/(\d+\. )/g, '<br><strong>$1</strong>')
                            .replace(/\n\* /g, '<br>• ')
                            .split('\n').join('<br>')
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Chat Input */}
          <div className="flex gap-4">
            <input
              type="text"
              value={chatMessage}
              onChange={(e) => setChatMessage(e.target.value)}
              placeholder="Ask about your floorplan..."
              className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#CA8535] focus:border-transparent transition-all duration-300 text-gray-700 placeholder-gray-400"
              onKeyPress={(e) => e.key === 'Enter' && handleChatSubmit()}
            />
            <button
              onClick={handleChatSubmit}
              className={`px-6 rounded-xl font-medium transition-all duration-300 transform hover:scale-[1.02] whitespace-nowrap ${
                loading
                  ? "bg-gray-200 text-gray-500 cursor-not-allowed"
                  : "bg-gradient-to-r from-[#CA8535] to-black hover:from-[#B77730] hover:to-gray-900 text-white"
              }`}
              disabled={loading}
            >
              {loading ? (
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  />
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
              ) : (
                "Send"
              )}
            </button>
          </div>
        </div>

        {/* Capabilities Slider */}
        <div className="mt-8 w-full overflow-hidden rounded-2xl shadow-lg border border-gray-100">
          <div className="relative flex items-center bg-gradient-to-r from-[#302619] to-[#121212] p-4">
            <div className="animate-scroll-slow flex whitespace-nowrap">
              {[
                "🔄 Real-time Chat  •  ",
                "🏠 Floor Plan Analysis  •  ",
                "🎨 Layout Optimization  •  ",
                "📐 Space Planning  •  ",
                "🚪 Room Configuration  •  ",
                "💡 Lighting Recommendations  •  ",
                "🪑 Furniture Placement  •  ",
                "🔧 Renovation Ideas  •  ",
                "🏗️ Structural Insights  •  ",
                "⚡ Energy Efficiency  •  ",
                "🌿 Sustainable Design  •  ",
                "🎯 Custom Solutions"
              ].map((capability, index) => (
                <span 
                  key={index}
                  className="text-lg font-medium text-white px-2"
                >
                  {capability}
                </span>
              ))}
            </div>
            <div className="animate-scroll-slow flex whitespace-nowrap" aria-hidden="true">
              {[
                "🔄 Real-time Chat  •  ",
                "🏠 Floor Plan Analysis  •  ",
                "🎨 Layout Optimization  •  ",
                "📐 Space Planning  •  ",
                "🚪 Room Configuration  •  ",
                "💡 Lighting Recommendations  •  ",
                "🪑 Furniture Placement  •  ",
                "🔧 Renovation Ideas  •  ",
                "🏗️ Structural Insights  •  ",
                "⚡ Energy Efficiency  •  ",
                "🌿 Sustainable Design  •  ",
                "🎯 Custom Solutions"
              ].map((capability, index) => (
                <span 
                  key={index}
                  className="text-lg font-medium text-white px-2"
                >
                  {capability}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Add custom animation styles */}
        <style jsx>{`
          @keyframes scroll {
            0% {
              transform: translateX(0);
            }
            100% {
              transform: translateX(-50%);
            }
          }
          .animate-scroll-slow {
            animation: scroll 30s linear infinite;
          }
        `}</style>

        {/* Footer */}
        <footer className="mt-12 mb-8 text-center">
          <div className="grid md:grid-cols-3 gap-8 mb-8">
            <div className="group bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-[#CA8535] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#302619] to-[#121212] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#CA8535] to-black group-hover:scale-105 transform transition-transform duration-500">
                  About Virtual Architect
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed transform transition-all duration-500 group-hover:text-gray-800">
                Transform your living spaces with AI-powered floor plan analysis and optimization. 
                Our intelligent system provides personalized recommendations for layout improvements, 
                space utilization, and interior design solutions.
              </p>
            </div>

            <div className="group bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-[#CA8535] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#302619] to-[#121212] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#CA8535] to-black group-hover:scale-105 transform transition-transform duration-500">
                  Key Features
                </h3>
              </div>
              <ul className="text-sm text-gray-600 space-y-2">
                {[
                  "Instant floor plan analysis",
                  "Smart space optimization",
                  "Real-time design assistance",
                  "Professional recommendations"
                ].map((feature, index) => (
                  <li key={index} className="flex items-center gap-2 transform transition-all duration-300 hover:translate-x-2">
                    <span className="flex items-center justify-center w-5 h-5 rounded-full bg-gradient-to-r from-[#302619] to-black opacity-0 group-hover:opacity-100 transition-all duration-500">
                      <svg 
                        className="w-3 h-3 text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth="3" 
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </span>
                    <span className="group-hover:text-gray-800 transition-colors duration-500">{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="group bg-white/80 backdrop-blur-lg p-6 rounded-2xl shadow-lg border border-gray-100 hover:border-[#CA8535] transition-all duration-500 hover:shadow-2xl hover:-translate-y-1">
              <div className="relative overflow-hidden rounded-xl mb-4">
                <div className="absolute inset-0 bg-gradient-to-r from-[#302619] to-[#121212] opacity-0 group-hover:opacity-10 transition-opacity duration-500"></div>
                <h3 className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-[#CA8535] to-black group-hover:scale-105 transform transition-transform duration-500">
                  Why Choose Us
                </h3>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed transform transition-all duration-500 group-hover:text-gray-800">
                Experience the future of architectural design with our AI-powered solution. 
                Get expert insights, optimize your space efficiency, and create beautiful, 
                functional living environments tailored to your needs.
              </p>
            </div>
          </div>

          <div className="text-center text-sm text-gray-500 hover:text-gray-600 transition-colors duration-300">
            <p>© 2024 Virtual Architect. All rights reserved.</p>
            <p className="mt-2">Powered by advanced AI technology for intelligent floor plan analysis and optimization.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;



