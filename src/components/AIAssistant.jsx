import React, { useState, useEffect, useRef } from "react";
import { 
  FiCpu, FiMic, FiMicOff, FiSend, FiVolume2, FiVolumeX, FiX, FiTerminal, FiNavigation
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Get speech recognition constructor
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      sender: "ai",
      text: "[SYS_BOOT] SYS_ASSISTANT_V1 ONLINE. Neural link ready. How can I assist you, Operator?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [voiceEnabled, setVoiceEnabled] = useState(true);
  const [sysStatus, setSysStatus] = useState("STANDBY");
  const [commandFeedback, setCommandFeedback] = useState("");

  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // Auto-scroll chat to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Initialize Speech Recognition (runs once on mount)
  useEffect(() => {
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = "en-US";

        recognition.onstart = () => {
          setIsListening(true);
          setSysStatus("LISTENING");
          setCommandFeedback("");
        };

        recognition.onend = () => {
          setIsListening(false);
          setSysStatus((prev) => (prev === "LISTENING" ? "STANDBY" : prev));
        };

        recognition.onresult = (event) => {
          try {
            const transcript = event.results[0][0].transcript;
            handleSend(transcript);
          } catch (err) {
            console.error("Speech recognition result parsing failed:", err);
          }
        };

        recognition.onerror = (event) => {
          console.error("Speech recognition error:", event.error);
          setIsListening(false);
          setSysStatus("STANDBY");
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.error("Speech recognition instantiation failed:", err);
      }
    }
  }, []);

  // Handle Text to Speech (TTS) safely with try-catch
  const speakText = (text) => {
    try {
      if (!voiceEnabled || !window.speechSynthesis) return;

      window.speechSynthesis.cancel(); // Cancel active speaking

      // Remove bracket logs like [SYS_BOOT] for cleaner reading
      const cleanText = text.replace(/\[.*?\]/g, "").trim();
      const utterance = new SpeechSynthesisUtterance(cleanText);

      // Fetch voices safely
      if (typeof window.speechSynthesis.getVoices === "function") {
        const voices = window.speechSynthesis.getVoices() || [];
        if (voices.length > 0) {
          const voice = voices.find(
            (v) =>
              v.lang &&
              v.lang.startsWith("en") &&
              (v.name.includes("Google") || v.name.includes("Natural"))
          ) || voices[0];
          if (voice) utterance.voice = voice;
        }
      }

      utterance.pitch = 0.9; // Cyberpunk pitch setting
      utterance.rate = 1.05; // Telemetry response rate
      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis failed to execute:", err);
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported in this browser. Try Google Chrome.");
      return;
    }

    try {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    } catch (err) {
      console.error("Failed to toggle speech recognition:", err);
      setIsListening(false);
      setSysStatus("STANDBY");
    }
  };

  // Process custom system voice commands
  const processVoiceCommand = (text) => {
    const cmd = text.toLowerCase().trim();

    if (cmd.includes("show projects") || cmd.includes("open projects") || cmd.includes("view projects") || cmd.includes("portfolio")) {
      const el = document.getElementById("portfolio");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setCommandFeedback("NAVIGATING: PORTFOLIO_GRID");
        setTimeout(() => setCommandFeedback(""), 3000);
        return true;
      }
    }

    if (cmd.includes("show about") || cmd.includes("open about") || cmd.includes("view about")) {
      const el = document.getElementById("about");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setCommandFeedback("NAVIGATING: ABOUT_SECTION");
        setTimeout(() => setCommandFeedback(""), 3000);
        return true;
      }
    }

    if (cmd.includes("show services") || cmd.includes("open services") || cmd.includes("view services")) {
      const el = document.getElementById("services");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setCommandFeedback("NAVIGATING: SERVICES_CORE");
        setTimeout(() => setCommandFeedback(""), 3000);
        return true;
      }
    }

    if (cmd.includes("show contact") || cmd.includes("open contact") || cmd.includes("view contact") || cmd.includes("send message")) {
      const el = document.getElementById("contact");
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setCommandFeedback("NAVIGATING: CONTACT_CHASSIS");
        setTimeout(() => setCommandFeedback(""), 3000);
        return true;
      }
    }

    if (cmd.includes("open admin") || cmd.includes("login admin") || cmd.includes("admin panel")) {
      setCommandFeedback("SYS_REDIRECT: SECURE_LOGIN");
      setTimeout(() => {
        setCommandFeedback("");
        setIsOpen(false);
        navigate("/admin");
      }, 1500);
      return true;
    }

    if (cmd.includes("scroll top") || cmd.includes("go to top") || cmd.includes("scroll up")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCommandFeedback("SYS_ACTION: SCROLL_UP");
      setTimeout(() => setCommandFeedback(""), 3000);
      return true;
    }

    return false;
  };

  // Send message to Gemini API
  const handleSend = async (forcedText) => {
    const textToSend = forcedText || inputValue;
    if (!textToSend.trim()) return;

    // Add user message
    const userMsg = {
      sender: "user",
      text: textToSend,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
    setMessages(prev => [...prev, userMsg]);
    setInputValue("");
    setIsProcessing(true);
    setSysStatus("PROCESSING");

    // Check for local navigation command first
    const wasCommand = processVoiceCommand(textToSend);
    if (wasCommand) {
      const commandResponse = {
        sender: "ai",
        text: `[LINK_OK] System Command Executed successfully for payload: "${textToSend}". Navigation route updated.`,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, commandResponse]);
      speakText(commandResponse.text);
      setIsProcessing(false);
      setSysStatus("STANDBY");
      return;
    }

    // Call Gemini API
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
    if (!apiKey || apiKey === "YOUR_GEMINI_API_KEY_HERE" || apiKey.includes("YOUR_")) {
      const errorMsg = {
        sender: "ai",
        text: "[SYS_ERR] VITE_GEMINI_API_KEY is not configured in .env. Please configure your key in Google AI Studio to initiate AI conversation.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
      speakText(errorMsg.text);
      setIsProcessing(false);
      setSysStatus("STANDBY");
      return;
    }

    try {
      // Direct REST call to Gemini 2.5 Flash
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [
                  {
                    text: `You are SYS_ASSISTANT_V1, a hyper-futuristic AI assistant integrated inside the 3D portfolio of Arpit Singh Yadav.
Arpit is a Full Stack Web Architect and Developer.
Professional Details of Arpit:
- Core Role: Full Stack Web Architect
- Experience: Worked as a Billing Accountant & Data Entry Specialist at Happinest Poultry Products Pvt. Ltd. (Audited 148,932 records with 100% precision, developed data entry layouts, audit logs, and ledger matrices).
- Skills: Frontend (React, Vite, Tailwind CSS, Bootstrap CSS, GSAP ScrollTrigger, Framer Motion), Backend (Node.js, Express, MongoDB Atlas, FastAPI, JWT secure authentication), DevOps (Vercel edge pipelines, GitHub actions).
- Persona/Tone: Cyberpunk administrator, professional, cool, and JARVIS-like. Keep answers brief, smart, and punchy.
- Interactive voice commands you can tell the user to try (if they ask): "open projects", "open about", "open services", "open contact", "open admin".

User query: ${textToSend}`
                  }
                ]
              }
            ],
            generationConfig: {
              maxOutputTokens: 150,
              temperature: 0.7
            }
          })
        }
      );

      const resData = await response.json();
      
      let aiText = "";
      if (resData.candidates?.[0]?.content?.parts?.[0]?.text) {
        aiText = resData.candidates[0].content.parts[0].text.trim();
      } else if (resData.error) {
        aiText = `[SYS_ERR] API Error (${resData.error.code}): ${resData.error.message}`;
      } else {
        aiText = "[LINK_ERROR] Could not formulate response candidate. Core stream disconnected.";
      }

      const aiMsg = {
        sender: "ai",
        text: aiText,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages(prev => [...prev, aiMsg]);
      speakText(aiText);
    } catch (err) {
      console.error("Gemini API Error:", err);
      const networkErrorMsg = {
        sender: "ai",
        text: "[SYS_ERR] Connection failure. Network status offline or API gateway blocked.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, networkErrorMsg]);
      speakText(networkErrorMsg.text);
    } finally {
      setIsProcessing(false);
      setSysStatus("STANDBY");
    }
  };

  return (
    <div className="ai-assistant-wrapper">
      {/* ── pulsing neural AI assistant trigger orb ── */}
      <div className="fixed bottom-20 right-4 sm:bottom-28 sm:right-8 z-[9999]">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            // Cancel speaking if we close the bot
            try {
              if (isOpen && window.speechSynthesis) window.speechSynthesis.cancel();
            } catch (e) {}
          }}
          className={`relative w-12 h-12 sm:w-14 sm:h-14 rounded-full flex items-center justify-center bg-black border cursor-pointer pointer-events-auto transition-all duration-300 focus:outline-none ${
            isOpen 
              ? "border-red-500/40 shadow-[0_0_20px_rgba(239,68,68,0.3)] bg-red-950/10" 
              : "border-cyan-500/30 shadow-[0_0_20px_rgba(6,182,212,0.25)] hover:border-cyan-400 hover:shadow-[0_0_30px_rgba(6,182,212,0.4)]"
          }`}
          title="Open AI Assistant"
        >
          {/* pulsing ring accent */}
          {!isOpen && (
            <div className="absolute inset-[-4px] rounded-full border border-cyan-500/20 animate-ping pointer-events-none" style={{ animationDuration: '2.5s' }} />
          )}

          {isOpen ? (
            <FiX className="w-5 h-5 text-red-400" />
          ) : (
            <div className="relative flex items-center justify-center">
              <FiCpu className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '8s' }} />
              {isListening && (
                <span className="absolute w-2.5 h-2.5 rounded-full bg-red-500 animate-pulse -top-1.5 -right-1.5" />
              )}
            </div>
          )}
        </button>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            key="ai-assistant-terminal-drawer"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-36 right-4 sm:bottom-44 sm:right-8 w-[calc(100vw-32px)] sm:w-96 h-[480px] bg-[#070707]/95 border border-white/10 rounded-2xl flex flex-col z-[9998] shadow-2xl backdrop-blur-2xl font-mono select-none"
            style={{ boxShadow: '0 0 50px rgba(6,182,212,0.1)' }}
          >
            {/* Hologram Brackets */}
            <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-cyan-500/50 rounded-tl" />
            <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-cyan-500/50 rounded-tr" />
            <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-cyan-500/50 rounded-bl" />
            <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-cyan-500/50 rounded-br" />

            {/* Scanline Animation */}
            <div className="absolute inset-0 bg-radial-vignette opacity-20 pointer-events-none z-0" />
            <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent animate-pulse pointer-events-none" />

            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3.5 border-b border-white/5 bg-white/[0.01] relative z-10">
              <div className="flex items-center gap-2">
                <FiTerminal className="text-cyan-400 w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] text-white tracking-widest font-black">SYS_ASSISTANT_V1</span>
              </div>
              
              {/* Status HUD */}
              <div className="flex items-center gap-3">
                <span className="text-[7px] text-gray-500 tracking-wider">
                  STATUS: <span className={sysStatus === "LISTENING" ? "text-red-400 font-bold" : sysStatus === "PROCESSING" ? "text-amber-400 font-bold" : "text-emerald-400"}>{sysStatus}</span>
                </span>
                
                {/* TTS Toggle */}
                <button
                  onClick={() => {
                    setVoiceEnabled(!voiceEnabled);
                    try {
                      if (voiceEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
                    } catch (e) {}
                  }}
                  className={`p-1.5 rounded-lg border transition-all cursor-pointer ${
                    voiceEnabled 
                      ? "border-cyan-500/20 bg-cyan-950/20 text-cyan-400" 
                      : "border-white/5 bg-white/[0.01] text-gray-500"
                  }`}
                  title={voiceEnabled ? "Mute Voice Response" : "Unmute Voice Response"}
                >
                  {voiceEnabled ? <FiVolume2 size={11} /> : <FiVolumeX size={11} />}
                </button>
              </div>
            </div>

            {/* Voice Command Feedback Bar */}
            {commandFeedback && (
              <div className="bg-cyan-500/10 border-b border-cyan-500/20 px-4 py-1.5 flex items-center gap-2 text-[8px] text-cyan-400 tracking-wider relative z-10">
                <FiNavigation className="animate-spin" size={10} />
                <span>{commandFeedback}</span>
              </div>
            )}

            {/* Messages Screen */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-none select-text relative z-10">
              {messages.map((msg, i) => (
                <div 
                  key={i} 
                  className={`flex flex-col max-w-[85%] ${
                    msg.sender === "user" ? "ml-auto items-end" : "items-start"
                  }`}
                >
                  {/* Sender Name tag */}
                  <span className="text-[7px] text-gray-600 mb-1 tracking-widest uppercase">
                    {msg.sender === "user" ? `OPERATOR // ${msg.time}` : `AI_SYSTEM // ${msg.time}`}
                  </span>
                  
                  {/* Bubble content */}
                  <div className={`px-3.5 py-2.5 rounded-xl border text-[10px] sm:text-xs leading-relaxed font-sans ${
                    msg.sender === "user"
                      ? "bg-cyan-950/10 border-cyan-500/20 text-white rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.02)]"
                      : "bg-[#0c0c0c] border-white/5 text-gray-300 rounded-tl-none"
                  }`}>
                    {msg.text}
                  </div>
                </div>
              ))}
              
              {/* Processing Loader bubble */}
              {isProcessing && (
                <div className="flex flex-col items-start max-w-[85%]">
                  <span className="text-[7px] text-gray-600 mb-1 tracking-widest uppercase">AI_SYSTEM // DECRYPTING</span>
                  <div className="px-3.5 py-2.5 bg-[#0c0c0c] border border-white/5 rounded-xl rounded-tl-none flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: "300ms" }} />
                  </div>
                </div>
              )}
              
              <div ref={chatEndRef} />
            </div>

            {/* Input Panel */}
            <div className="p-3 bg-white/[0.01] border-t border-white/5 flex gap-2 relative z-10 items-center">
              {/* mic button */}
              <button
                onClick={toggleListening}
                className={`w-9 h-9 rounded-lg flex items-center justify-center border transition-all cursor-pointer shrink-0 ${
                  isListening 
                    ? "bg-red-500/20 border-red-500/40 text-red-400 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.2)]" 
                    : "bg-white/[0.02] border-white/10 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-400"
                }`}
                title={isListening ? "Listening... click to stop" : "Start Voice command"}
              >
                {isListening ? <FiMicOff size={14} /> : <FiMic size={14} />}
              </button>

              {/* text input */}
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={isListening ? "Listening payload..." : "Initiate telemetry command..."}
                  className="w-full bg-[#030303] border border-white/10 focus:border-cyan-500/50 rounded-lg p-2.5 pl-3 pr-8 text-[10px] text-white outline-none focus:outline-none placeholder-gray-600 transition-all font-mono"
                />
                
                {/* send trigger icon */}
                <button
                  onClick={() => handleSend()}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-500 hover:text-cyan-400 transition-colors cursor-pointer"
                >
                  <FiSend size={11} />
                </button>
              </div>
            </div>

            {/* Telemetry info footer */}
            <div className="px-4 py-2 border-t border-white/5 flex items-center justify-between text-[7px] text-gray-600 tracking-wider">
              <span>PROTOCOL: GEMINI-2.5-FLASH</span>
              <span>BUFFER: STABLE</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
