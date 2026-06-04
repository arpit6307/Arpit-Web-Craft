import React, { useState, useEffect, useRef } from "react";
import { 
  FiCpu, FiMic, FiMicOff, FiSend, FiVolume2, FiVolumeX, FiX, FiTerminal, FiNavigation, FiChevronRight, FiChevronLeft
} from "react-icons/fi";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

// Get speech recognition constructor
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

export default function AIAssistant({ openAllProjects, closeAllProjects, isAllProjectsOpen }) {
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
  const [jarvisMode, setJarvisMode] = useState(true); // Continuous Jarvis mode by default
  const [sysStatus, setSysStatus] = useState("STANDBY");
  const [commandFeedback, setCommandFeedback] = useState("");

  const navigate = useNavigate();
  const chatEndRef = useRef(null);
  const recognitionRef = useRef(null);

  // References to keep callbacks current and prevent stale closures
  const jarvisModeRef = useRef(jarvisMode);
  const isOpenRef = useRef(isOpen);
  const isProcessingRef = useRef(isProcessing);
  const isListeningRef = useRef(isListening);
  const isSpeakingRef = useRef(false);

  useEffect(() => {
    jarvisModeRef.current = jarvisMode;
  }, [jarvisMode]);

  useEffect(() => {
    isOpenRef.current = isOpen;
    if (!isOpen) {
      isSpeakingRef.current = false;
      isProcessingRef.current = false;
      // Ensure we immediately start background wake-word listening when closed
      if (jarvisModeRef.current && !isListeningRef.current && recognitionRef.current) {
        try {
          recognitionRef.current.start();
        } catch (e) {}
      }
    }
  }, [isOpen]);

  useEffect(() => {
    isProcessingRef.current = isProcessing;
  }, [isProcessing]);

  useEffect(() => {
    isListeningRef.current = isListening;
  }, [isListening]);

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
          // If Jarvis mode is active, and we are not speaking/processing, auto-restart the listener
          if (jarvisModeRef.current && !isSpeakingRef.current && !isProcessingRef.current) {
            setTimeout(() => {
              if (jarvisModeRef.current && !isSpeakingRef.current && !isProcessingRef.current && !isListeningRef.current) {
                try {
                  recognition.start();
                } catch (e) {
                  // Already running
                }
              }
            }, 300);
          } else {
            setSysStatus((prev) => (prev === "LISTENING" ? "STANDBY" : prev));
          }
        };

        recognition.onresult = (event) => {
          try {
            const transcript = event.results[0][0].transcript;
            const lowerText = transcript.toLowerCase().trim();
            const hasWakeWord = lowerText.includes("jarvis");

            if (!isOpenRef.current) {
              // Background listening: open assistant if wake-word is detected
              if (hasWakeWord) {
                setIsOpen(true);
                setSysStatus("PROCESSING");
                const welcomeMsg = {
                  sender: "ai",
                  text: "[SYS_BOOT] Hello Operator, I am here. Jarvis activated. How can I assist you?",
                  time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
                };
                setMessages(prev => [...prev, welcomeMsg]);
                isSpeakingRef.current = true;
                speakText(welcomeMsg.text);
              }
            } else {
              // Active listening: process standard commands/queries
              handleSend(transcript);
            }
          } catch (err) {
            console.error("Speech recognition result parsing failed:", err);
          }
        };

        recognition.onerror = (event) => {
          // 'no-speech' is a common silent warning, keep console clean
          if (event.error !== "no-speech") {
            console.warn("Speech recognition error status:", event.error);
          }
          setIsListening(false);
          
          if (jarvisModeRef.current && !isSpeakingRef.current && !isProcessingRef.current) {
            setTimeout(() => {
              if (jarvisModeRef.current && !isSpeakingRef.current && !isProcessingRef.current && !isListeningRef.current) {
                try {
                  recognition.start();
                } catch (e) {}
              }
            }, 1000);
          } else {
            setSysStatus("STANDBY");
          }
        };

        recognitionRef.current = recognition;

        // Attempt initial start for background wake word detection
        if (jarvisModeRef.current) {
          try {
            recognition.start();
          } catch (e) {}
        }
      } catch (err) {
        console.error("Speech recognition instantiation failed:", err);
      }
    }

    // Fallback: start listening on first click if blocked by browser policy initially
    const handleGestureStart = () => {
      if (
        jarvisModeRef.current &&
        !isListeningRef.current &&
        !isSpeakingRef.current &&
        !isProcessingRef.current &&
        recognitionRef.current
      ) {
        try {
          recognitionRef.current.start();
        } catch (e) {
          // Already running
        }
      }
    };

    window.addEventListener("click", handleGestureStart);
    return () => {
      window.removeEventListener("click", handleGestureStart);
    };
  }, []);

  // Handle Text to Speech (TTS) safely with try-catch
  const speakText = (text) => {
    try {
      // Suspend recognition first to prevent feedback loops
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }

      if (!voiceEnabled || !window.speechSynthesis) {
        isSpeakingRef.current = false;
        if (jarvisModeRef.current && !isProcessingRef.current) {
          setTimeout(() => {
            if (jarvisModeRef.current && !isProcessingRef.current && !isListeningRef.current) {
              try {
                recognitionRef.current?.start();
              } catch (e) {}
            }
          }, 300);
        }
        return;
      }

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

      utterance.onstart = () => {
        isSpeakingRef.current = true;
      };

      utterance.onend = () => {
        isSpeakingRef.current = false;
        if (jarvisModeRef.current && !isProcessingRef.current) {
          setTimeout(() => {
            if (jarvisModeRef.current && !isProcessingRef.current && !isListeningRef.current) {
              try {
                recognitionRef.current?.start();
              } catch (e) {}
            }
          }, 400);
        }
      };

      utterance.onerror = () => {
        isSpeakingRef.current = false;
        if (jarvisModeRef.current && !isProcessingRef.current) {
          setTimeout(() => {
            if (jarvisModeRef.current && !isProcessingRef.current && !isListeningRef.current) {
              try {
                recognitionRef.current?.start();
              } catch (e) {}
            }
          }, 400);
        }
      };

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.warn("Speech synthesis failed to execute:", err);
      isSpeakingRef.current = false;
      if (jarvisModeRef.current && !isProcessingRef.current) {
        try {
          recognitionRef.current?.start();
        } catch (e) {}
      }
    }
  };

  const toggleListening = () => {
    if (!recognitionRef.current) {
      alert("Voice speech recognition is not supported in this browser. Try Google Chrome.");
      return;
    }

    try {
      if (isListening) {
        setJarvisMode(false);
        recognitionRef.current.stop();
        setCommandFeedback("LISTENING PAUSED");
        setTimeout(() => setCommandFeedback(""), 2000);
      } else {
        setJarvisMode(true);
        recognitionRef.current.start();
        setCommandFeedback("LISTENING ACTIVE");
        setTimeout(() => setCommandFeedback(""), 2000);
      }
    } catch (err) {
      console.error("Failed to toggle speech recognition:", err);
      setIsListening(false);
      setSysStatus("STANDBY");
    }
  };

  const navigateAndScroll = (targetId) => {
    // If all projects overlay is open, close it
    if (isAllProjectsOpen && typeof closeAllProjects === "function") {
      closeAllProjects();
    }

    // Check if we are on a non-home route
    if (window.location.pathname !== "/") {
      navigate("/");
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 350);
    } else {
      // If we are on home route, scroll after a brief timeout to let modal unmounting begin
      setTimeout(() => {
        const el = document.getElementById(targetId);
        if (el) el.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  // Process custom system voice commands
  const processVoiceCommand = (text) => {
    const cmd = text.toLowerCase().trim();

    if (cmd.includes("show projects") || cmd.includes("open projects") || cmd.includes("view projects") || cmd.includes("portfolio") || cmd.includes("go to projects") || cmd.includes("go to project") || cmd.includes("go projects") || cmd.includes("go project") || cmd.includes("projects section") || cmd.includes("project section")) {
      navigateAndScroll("portfolio");
      setCommandFeedback("NAVIGATING: PORTFOLIO_GRID");
      setTimeout(() => setCommandFeedback(""), 3000);
      return true;
    }

    if (cmd.includes("show about") || cmd.includes("open about") || cmd.includes("view about") || cmd.includes("go to about") || cmd.includes("go about") || cmd.includes("about section")) {
      navigateAndScroll("about");
      setCommandFeedback("NAVIGATING: ABOUT_SECTION");
      setTimeout(() => setCommandFeedback(""), 3000);
      return true;
    }

    if (cmd.includes("show services") || cmd.includes("open services") || cmd.includes("view services") || cmd.includes("go to services") || cmd.includes("go services") || cmd.includes("services section")) {
      navigateAndScroll("services");
      setCommandFeedback("NAVIGATING: SERVICES_CORE");
      setTimeout(() => setCommandFeedback(""), 3000);
      return true;
    }

    if (cmd.includes("show contact") || cmd.includes("open contact") || cmd.includes("view contact") || cmd.includes("send message") || cmd.includes("go to contact") || cmd.includes("go contact") || cmd.includes("contact section")) {
      navigateAndScroll("contact");
      setCommandFeedback("NAVIGATING: CONTACT_CHASSIS");
      setTimeout(() => {
        setCommandFeedback("");
        const input = document.querySelector("#contact input[name='name']") || document.querySelector("#contact input[type='text']") || document.querySelector("#contact input");
        if (input) input.focus();
      }, 1000);
      return true;
    }

    if (cmd.includes("open admin") || cmd.includes("login admin") || cmd.includes("admin panel") || cmd.includes("go to admin") || cmd.includes("go admin")) {
      setCommandFeedback("SYS_REDIRECT: SECURE_LOGIN");
      setTimeout(() => {
        setCommandFeedback("");
        setIsOpen(false);
        navigate("/admin");
      }, 1500);
      return true;
    }

    if (cmd.includes("scroll top") || cmd.includes("go to top") || cmd.includes("scroll up") || cmd.includes("go top")) {
      window.scrollTo({ top: 0, behavior: "smooth" });
      setCommandFeedback("SYS_ACTION: SCROLL_UP");
      setTimeout(() => setCommandFeedback(""), 3000);
      return true;
    }

    if (cmd.includes("show all projects") || cmd.includes("open all projects") || cmd.includes("projects catalog") || cmd.includes("view all projects") || cmd.includes("open gallery")) {
      if (typeof openAllProjects === "function") {
        setCommandFeedback("SYS_ACTION: OPEN_CATALOG");
        setTimeout(() => {
          setCommandFeedback("");
          openAllProjects();
        }, 1000);
        return true;
      }
    }

    if (cmd.includes("open github") || cmd.includes("go to github") || cmd.includes("view github") || cmd.includes("github profile")) {
      setCommandFeedback("SYS_ACTION: OPEN_GITHUB");
      setTimeout(() => {
        setCommandFeedback("");
        window.open("https://github.com/arpit6307", "_blank");
      }, 1000);
      return true;
    }

    if (cmd.includes("download resume") || cmd.includes("download cv") || cmd.includes("open resume") || cmd.includes("view resume") || cmd.includes("open cv") || cmd.includes("view cv")) {
      setCommandFeedback("SYS_ACTION: DOWNLOAD_CV");
      setTimeout(() => {
        setCommandFeedback("");
        window.open("/resume.pdf", "_blank");
      }, 1000);
      return true;
    }

    if (cmd.includes("mute voice") || cmd.includes("stop talking") || cmd.includes("mute assistant") || cmd.includes("disable voice") || cmd.includes("turn off audio")) {
      setVoiceEnabled(false);
      try {
        if (window.speechSynthesis) window.speechSynthesis.cancel();
      } catch (e) {}
      setCommandFeedback("AUDIO: MUTED");
      setTimeout(() => setCommandFeedback(""), 2000);
      return true;
    }

    if (cmd.includes("unmute voice") || cmd.includes("start talking") || cmd.includes("unmute assistant") || cmd.includes("enable voice") || cmd.includes("turn on audio") || cmd.includes("turn on sound")) {
      setVoiceEnabled(true);
      setCommandFeedback("AUDIO: ENABLED");
      setTimeout(() => setCommandFeedback(""), 2000);
      return true;
    }

    if (cmd.includes("close assistant") || cmd.includes("close terminal") || cmd.includes("bye") || cmd.includes("exit") || cmd.includes("minimize")) {
      setCommandFeedback("SYS_STATUS: MINIMIZED");
      setTimeout(() => {
        setCommandFeedback("");
        setIsOpen(false);
        try {
          if (window.speechSynthesis) window.speechSynthesis.cancel();
        } catch (e) {}
      }, 1000);
      return true;
    }

    return false;
  };

  // Send message to Gemini API
  const handleSend = async (forcedText) => {
    const textToSend = forcedText || inputValue;
    if (!textToSend.trim()) return;

    // Suspend speech recognition during processing
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
    }

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
- Interactive voice commands and navigation: If the user asks to navigate, scroll to, show, open, download, or toggle a specific section/link/setting, you MUST respond nicely and include the exact tag in your answer:
  - For projects/portfolio: include [GOTO_PORTFOLIO]
  - For about: include [GOTO_ABOUT]
  - For services: include [GOTO_SERVICES]
  - For contact: include [GOTO_CONTACT]
  - For admin panel/login page: include [GOTO_ADMIN]
  - For top of page: include [GOTO_TOP]
  - For opening all projects overlay / portfolio catalog: include [OPEN_ALL_PROJECTS]
  - For opening github profile: include [GOTO_GITHUB]
  - For downloading/viewing resume or CV: include [DOWNLOAD_RESUME]
  - For muting voice responses: include [MUTE_VOICE]
  - For unmuting voice responses: include [UNMUTE_VOICE]
  - For closing/minimizing the assistant terminal: include [CLOSE_BOT]
Examples: "Navigating to portfolio grid. [GOTO_PORTFOLIO]", "Muting voice responses now Operator. [MUTE_VOICE]", "Opening the complete portfolio catalog. [OPEN_ALL_PROJECTS]".

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
        
        // Execute dynamic AI-driven navigation triggers
        if (aiText.toLowerCase().includes("[goto_portfolio]")) {
          navigateAndScroll("portfolio");
          setCommandFeedback("NAVIGATING: PORTFOLIO_GRID");
          setTimeout(() => setCommandFeedback(""), 3000);
        } else if (aiText.toLowerCase().includes("[goto_about]")) {
          navigateAndScroll("about");
          setCommandFeedback("NAVIGATING: ABOUT_SECTION");
          setTimeout(() => setCommandFeedback(""), 3000);
        } else if (aiText.toLowerCase().includes("[goto_services]")) {
          navigateAndScroll("services");
          setCommandFeedback("NAVIGATING: SERVICES_CORE");
          setTimeout(() => setCommandFeedback(""), 3000);
        } else if (aiText.toLowerCase().includes("[goto_contact]")) {
          navigateAndScroll("contact");
          setCommandFeedback("NAVIGATING: CONTACT_CHASSIS");
          setTimeout(() => {
            setCommandFeedback("");
            const input = document.querySelector("#contact input[name='name']") || document.querySelector("#contact input[type='text']") || document.querySelector("#contact input");
            if (input) input.focus();
          }, 1000);
        } else if (aiText.toLowerCase().includes("[goto_admin]")) {
          setCommandFeedback("SYS_REDIRECT: SECURE_LOGIN");
          setTimeout(() => {
            setCommandFeedback("");
            setIsOpen(false);
            navigate("/admin");
          }, 1500);
        } else if (aiText.toLowerCase().includes("[goto_top]")) {
          window.scrollTo({ top: 0, behavior: "smooth" });
          setCommandFeedback("SYS_ACTION: SCROLL_UP");
          setTimeout(() => setCommandFeedback(""), 3000);
        } else if (aiText.toLowerCase().includes("[open_all_projects]")) {
          if (typeof openAllProjects === "function") {
            setCommandFeedback("SYS_ACTION: OPEN_CATALOG");
            setTimeout(() => {
              setCommandFeedback("");
              openAllProjects();
            }, 1000);
          }
        } else if (aiText.toLowerCase().includes("[goto_github]")) {
          setCommandFeedback("SYS_ACTION: OPEN_GITHUB");
          setTimeout(() => {
            setCommandFeedback("");
            window.open("https://github.com/arpit6307", "_blank");
          }, 1000);
        } else if (aiText.toLowerCase().includes("[download_resume]")) {
          setCommandFeedback("SYS_ACTION: DOWNLOAD_CV");
          setTimeout(() => {
            setCommandFeedback("");
            window.open("/resume.pdf", "_blank");
          }, 1000);
        } else if (aiText.toLowerCase().includes("[mute_voice]")) {
          setVoiceEnabled(false);
          try {
            if (window.speechSynthesis) window.speechSynthesis.cancel();
          } catch (e) {}
          setCommandFeedback("AUDIO: MUTED");
          setTimeout(() => setCommandFeedback(""), 2000);
        } else if (aiText.toLowerCase().includes("[unmute_voice]")) {
          setVoiceEnabled(true);
          setCommandFeedback("AUDIO: ENABLED");
          setTimeout(() => setCommandFeedback(""), 2000);
        } else if (aiText.toLowerCase().includes("[close_bot]")) {
          setCommandFeedback("SYS_STATUS: MINIMIZED");
          setTimeout(() => {
            setCommandFeedback("");
            setIsOpen(false);
            try {
              if (window.speechSynthesis) window.speechSynthesis.cancel();
            } catch (e) {}
          }, 1000);
        }
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
      {/* Custom CSS Keyframe Injection */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes spin-reverse {
          from { transform: rotate(360deg); }
          to { transform: rotate(0deg); }
        }
        .animate-spin-reverse {
          animation: spin-reverse 10s linear infinite;
        }
        @keyframes scanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        .animate-scanline {
          animation: scanline 8s linear infinite;
        }
      `}} />

      {/* ── Holographic Concentric AI Core Trigger Orb ── */}
      <div className="fixed bottom-20 left-4 sm:bottom-28 sm:left-8 z-[9999]">
        <button
          onClick={() => {
            setIsOpen(!isOpen);
            // Cancel speaking if we close the bot
            try {
              if (isOpen && window.speechSynthesis) window.speechSynthesis.cancel();
            } catch (e) {}
          }}
          className="group relative w-14 h-14 sm:w-16 sm:h-16 rounded-full flex items-center justify-center bg-black/90 cursor-pointer pointer-events-auto transition-all duration-300 focus:outline-none select-none border border-white/5"
          title={isOpen ? "Close AI Assistant" : "Open AI Assistant"}
        >
          {/* Glowing Aura shadow base */}
          <div className={`absolute inset-0 rounded-full transition-all duration-300 ${
            isOpen 
              ? "bg-red-500/20 shadow-[0_0_25px_rgba(239,68,68,0.4)]" 
              : "bg-cyan-500/10 shadow-[0_0_20px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_30px_rgba(6,182,212,0.5)]"
          }`} />

          {/* Outer Ring: rotates clockwise */}
          <div className={`absolute inset-[-5px] rounded-full border border-dashed animate-spin transition-colors duration-300 ${
            isOpen ? "border-red-500/30" : "border-cyan-500/40 group-hover:border-cyan-300"
          }`} style={{ animationDuration: '16s' }} />

          {/* Inner Ring: double border, rotates counter-clockwise */}
          <div className={`absolute inset-[-1px] rounded-full border-2 border-double animate-spin-reverse transition-colors duration-300 ${
            isOpen ? "border-red-500/20" : "border-cyan-500/30 group-hover:border-cyan-400"
          }`} style={{ animationDuration: '8s' }} />

          {/* Ping ripples when recording */}
          {isListening && (
            <div className="absolute inset-[-8px] rounded-full border border-red-500/40 animate-ping pointer-events-none" style={{ animationDuration: '1.8s' }} />
          )}

          {/* Central Pulsing Hologram Core */}
          <div className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full flex flex-col items-center justify-center bg-gradient-to-tr transition-all duration-300 ${
            isOpen 
              ? "from-red-600/90 to-rose-500/90 text-white" 
              : isListening 
                ? "from-red-600/90 to-rose-500/90 text-white animate-pulse" 
                : isProcessing 
                  ? "from-amber-600/90 to-yellow-500/90 text-white animate-pulse" 
                  : "from-cyan-600/90 to-blue-500/90 text-white hover:scale-105"
          }`}>
            {isOpen ? (
              <FiX className="w-5 h-5 text-white animate-pulse" />
            ) : (
              <div className="relative flex flex-col items-center justify-center">
                <FiCpu className={`w-5 h-5 text-white ${isListening ? "animate-bounce" : "animate-spin"}`} style={{ animationDuration: isListening ? '1.5s' : '10s' }} />
                <span className="text-[5px] text-white/80 font-black tracking-widest uppercase mt-0.5 scale-90 select-none">
                  JARVIS
                </span>
                {isListening && (
                  <span className="absolute w-2 h-2 rounded-full bg-red-400 -top-1 -right-1 border border-white" />
                )}
              </div>
            )}
          </div>
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
            className="fixed bottom-36 left-4 sm:bottom-44 sm:left-8 w-[calc(100vw-32px)] sm:w-96 h-[480px] bg-gradient-to-b from-[#060c16]/98 via-[#02050b]/98 to-[#040810]/98 border border-cyan-500/25 rounded-2xl flex flex-col z-[9998] shadow-2xl backdrop-blur-3xl font-mono select-none overflow-hidden"
            style={{ 
              boxShadow: '0 0 50px rgba(6,182,212,0.22), inset 0 0 20px rgba(6,182,212,0.05)',
              backgroundImage: 'radial-gradient(rgba(6, 182, 212, 0.06) 1.5px, transparent 0)',
              backgroundSize: '15px 15px'
            }}
          >
            {/* Hologram Brackets */}
            <div className={`absolute top-0 left-0 w-4 h-4 border-t-2 border-l-2 ${
              sysStatus === "LISTENING" ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : sysStatus === "PROCESSING" ? "border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            } rounded-tl transition-colors duration-300 z-20`} />
            <div className={`absolute top-0 right-0 w-4 h-4 border-t-2 border-r-2 ${
              sysStatus === "LISTENING" ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : sysStatus === "PROCESSING" ? "border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            } rounded-tr transition-colors duration-300 z-20`} />
            <div className={`absolute bottom-0 left-0 w-4 h-4 border-b-2 border-l-2 ${
              sysStatus === "LISTENING" ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : sysStatus === "PROCESSING" ? "border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            } rounded-bl transition-colors duration-300 z-20`} />
            <div className={`absolute bottom-0 right-0 w-4 h-4 border-b-2 border-r-2 ${
              sysStatus === "LISTENING" ? "border-red-500 shadow-[0_0_8px_rgba(239,68,68,0.5)]" : sysStatus === "PROCESSING" ? "border-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.5)]" : "border-cyan-500 shadow-[0_0_8px_rgba(6,182,212,0.5)]"
            } rounded-br transition-colors duration-300 z-20`} />

            {/* Scrolling Telemetry Scanline Sweep */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-cyan-500/10 shadow-[0_0_8px_rgba(6,182,212,0.3)] animate-scanline pointer-events-none z-10" />

            {/* Terminal Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-white/[0.01] relative z-10">
              <div className="flex items-center gap-2">
                <FiTerminal className="text-cyan-400 w-3.5 h-3.5 animate-pulse" />
                <span className="text-[10px] text-white tracking-widest font-black">SYS_ASSISTANT_V1</span>
                
                {/* Responsive Waveform Monitor widget */}
                <div className="flex items-end gap-[2px] h-3.5 px-1.5 border-l border-white/10 ml-1 select-none">
                  <span className={`w-[1.5px] rounded-full transition-all duration-300 ${sysStatus === "LISTENING" ? "animate-bounce bg-red-400 h-3.5" : sysStatus === "PROCESSING" ? "animate-bounce bg-amber-400 h-2.5" : "bg-cyan-500/40 h-1.5"}`} style={{ animationDuration: '0.5s' }} />
                  <span className={`w-[1.5px] rounded-full transition-all duration-300 ${sysStatus === "LISTENING" ? "animate-bounce bg-red-400 h-2" : sysStatus === "PROCESSING" ? "animate-bounce bg-amber-400 h-4" : "bg-cyan-500/40 h-2.5"}`} style={{ animationDuration: '0.7s', animationDelay: '0.15s' }} />
                  <span className={`w-[1.5px] rounded-full transition-all duration-300 ${sysStatus === "LISTENING" ? "animate-bounce bg-red-400 h-4" : sysStatus === "PROCESSING" ? "animate-bounce bg-amber-400 h-2" : "bg-cyan-500/40 h-2"}`} style={{ animationDuration: '0.4s', animationDelay: '0.05s' }} />
                  <span className={`w-[1.5px] rounded-full transition-all duration-300 ${sysStatus === "LISTENING" ? "animate-bounce bg-red-400 h-1.5" : sysStatus === "PROCESSING" ? "animate-bounce bg-amber-400 h-3" : "bg-cyan-500/40 h-3"}`} style={{ animationDuration: '0.6s', animationDelay: '0.2s' }} />
                </div>
              </div>
              
              {/* Status HUD */}
              <div className="flex items-center gap-2">
                <span className="text-[7px] text-gray-500 tracking-wider mr-1">
                  STATUS: <span className={sysStatus === "LISTENING" ? "text-red-400 font-bold" : sysStatus === "PROCESSING" ? "text-amber-400 font-bold" : "text-emerald-400"}>{sysStatus}</span>
                </span>
                
                {/* Jarvis Wake-Word Continuous Listening Toggle */}
                <button
                  onClick={() => {
                    const nextMode = !jarvisMode;
                    setJarvisMode(nextMode);
                    if (nextMode) {
                      setCommandFeedback("JARVIS ACTIVE");
                      setTimeout(() => setCommandFeedback(""), 2000);
                      try {
                        recognitionRef.current?.start();
                      } catch (e) {}
                    } else {
                      setCommandFeedback("JARVIS MUTED");
                      setTimeout(() => setCommandFeedback(""), 2000);
                      try {
                        recognitionRef.current?.stop();
                      } catch (e) {}
                    }
                  }}
                  className={`px-1.5 py-1 rounded-lg border transition-all cursor-pointer text-[8px] flex items-center gap-1.5 ${
                    jarvisMode 
                      ? "border-emerald-500/30 bg-emerald-950/20 text-emerald-400 font-bold shadow-[0_0_8px_rgba(16,185,129,0.25)] animate-pulse" 
                      : "border-white/5 bg-white/[0.01] text-gray-500"
                  }`}
                  title={jarvisMode ? "Deactivate Jarvis Wake-Word Listener" : "Activate Jarvis Wake-Word Listener"}
                >
                  <span className={`w-1.5 h-1.5 rounded-full ${jarvisMode ? "bg-emerald-400 animate-ping" : "bg-gray-600"}`} style={{ animationDuration: '2s' }} />
                  <span className="tracking-wider text-[8px]">JARVIS</span>
                </button>

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

            {/* Telemetry Display Panel */}
            <div className="flex justify-between items-center bg-cyan-950/15 border-b border-cyan-500/10 px-4 py-2 text-[7px] text-cyan-400/70 tracking-widest relative z-10 select-none">
              <div className="flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shadow-[0_0_6px_rgba(52,211,153,0.8)]" />
                <span>LINK: SECURE</span>
              </div>
              <div className="flex items-center gap-2">
                <span>BUFFER: STABLE</span>
                <span>SIG: 94%</span>
                <span>CPU: OK</span>
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
              <AnimatePresence initial={false}>
                {messages.map((msg, i) => (
                  <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 15, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    transition={{ duration: 0.25, ease: "easeOut" }}
                    className={`flex flex-col max-w-[85%] ${
                      msg.sender === "user" ? "ml-auto items-end" : "items-start"
                    }`}
                  >
                    {/* Sender Name tag */}
                    <span className="text-[7px] text-gray-500 mb-1 tracking-widest uppercase select-none">
                      {msg.sender === "user" ? `OPERATOR // ${msg.time}` : `AI_SYSTEM // ${msg.time}`}
                    </span>
                    
                    {/* Bubble content */}
                    <div className={`px-3.5 py-2.5 rounded-xl border text-[10px] sm:text-xs leading-relaxed font-sans transition-all duration-300 ${
                      msg.sender === "user"
                        ? "bg-cyan-950/20 border-cyan-500/30 text-white rounded-tr-none shadow-[0_0_15px_rgba(6,182,212,0.04)] focus:border-cyan-400"
                        : "bg-[#090f1a]/85 border-white/5 text-gray-300 rounded-tl-none shadow-[0_4px_12px_rgba(0,0,0,0.3)]"
                    }`}>
                      {msg.text}
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              
              {/* Processing Loader bubble */}
              {isProcessing && (
                <div className="flex flex-col items-start max-w-[85%]">
                  <span className="text-[7px] text-gray-600 mb-1 tracking-widest uppercase">AI_SYSTEM // DECRYPTING</span>
                  <div className="px-3.5 py-2.5 bg-[#090f1a]/85 border border-white/5 rounded-xl rounded-tl-none flex items-center gap-1.5 shadow-[0_4px_12px_rgba(0,0,0,0.3)]">
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
                    : "bg-[#090f1a]/50 border-white/10 hover:border-cyan-500/30 text-gray-400 hover:text-cyan-400"
                }`}
                title={isListening ? "Listening... click to stop" : "Start Voice command"}
              >
                {isListening ? <FiMicOff size={14} /> : <FiMic size={14} />}
              </button>

              {/* text input */}
              <div className="flex-1 relative">
                <span className="absolute left-3 top-1/2 -translate-y-1/2 text-cyan-400/70 text-[10px] font-bold pointer-events-none select-none">&gt;</span>
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder={isListening ? "Listening payload..." : "Initiate telemetry command..."}
                  className="w-full bg-[#030712]/80 border border-white/10 focus:border-cyan-500/50 focus:shadow-[0_0_15px_rgba(6,182,212,0.15)] rounded-lg p-2.5 pl-6 pr-8 text-[10px] text-white outline-none focus:outline-none placeholder-gray-600 transition-all font-mono"
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
