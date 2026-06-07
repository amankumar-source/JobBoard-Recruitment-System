import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bot, Send, X, User2, MessageSquare, Loader2, Volume2, VolumeX } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT, AI_CHAT_API_END_POINT } from "@/utils/constant";

const AIChatWidget = () => {
  const { user } = useSelector((store) => store.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [showGreeting, setShowGreeting] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(() => {
    try {
      const saved = localStorage.getItem("aiChatSoundEnabled");
      return saved !== null ? JSON.parse(saved) : true;
    } catch (e) {
      return true;
    }
  });
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const messagesEndRef = useRef(null);
  const audioRef = useRef(null);
  const soundEnabledRef = useRef(soundEnabled);
  const showGreetingRef = useRef(showGreeting);

  const playCustomNotificationSound = () => {
    try {
      if (audioRef.current && soundEnabled) {
        audioRef.current.currentTime = 0;
        const playPromise = audioRef.current.play();
        if (playPromise !== undefined) {
          playPromise.catch(() => {
            // Fail silently to respect browser autoplay policies
          });
        }
      }
    } catch (error) {
      // Fail silently
    }
  };

  useEffect(() => {
    soundEnabledRef.current = soundEnabled;
    try {
      localStorage.setItem("aiChatSoundEnabled", JSON.stringify(soundEnabled));
    } catch (e) {
      // Fail silently if storage is blocked
    }
  }, [soundEnabled]);

  useEffect(() => {
    showGreetingRef.current = showGreeting;
  }, [showGreeting]);

  // Unlock audio on first user interaction (bypasses browser autoplay policy blocks)
  useEffect(() => {
    const unlockAudio = () => {
      if (audioRef.current) {
        if (showGreetingRef.current && soundEnabledRef.current) {
          audioRef.current.currentTime = 0;
          audioRef.current.play()
            .then(() => {
              removeUnlockListeners();
            })
            .catch(() => {});
        } else {
          audioRef.current.play()
            .then(() => {
              audioRef.current.pause();
              audioRef.current.currentTime = 0;
              removeUnlockListeners();
            })
            .catch(() => {});
        }
      }
    };

    const removeUnlockListeners = () => {
      document.removeEventListener("click", unlockAudio);
      document.removeEventListener("keydown", unlockAudio);
      document.removeEventListener("touchstart", unlockAudio);
    };

    document.addEventListener("click", unlockAudio);
    document.addEventListener("keydown", unlockAudio);
    document.addEventListener("touchstart", unlockAudio);

    return () => {
      removeUnlockListeners();
    };
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  // Session-based greeting logic
  useEffect(() => {
    const hasSeenGreeting = sessionStorage.getItem("hasShownAIChatGreeting");
    if (!hasSeenGreeting && !isOpen) {
      const showTimer = setTimeout(() => {
        setShowGreeting(true);
        sessionStorage.setItem("hasShownAIChatGreeting", "true");
      }, 2500); // 2.5s delay

      const hideTimer = setTimeout(() => {
        setShowGreeting(false);
      }, 11500); // Hide after 9s of display (11.5s total)

      return () => {
        clearTimeout(showTimer);
        clearTimeout(hideTimer);
      };
    }
  }, [isOpen]);

  // Play sound when showGreeting changes to true
  useEffect(() => {
    if (showGreeting && soundEnabled) {
      playCustomNotificationSound();
    }
  }, [showGreeting, soundEnabled]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputVal.trim()) return;

    const userMessage = inputVal;
    setInputVal("");

    // Add user message to local state immediately
    setMessages((prev) => [...prev, { role: "user", content: userMessage }]);
    setLoading(true);

    try {
      const res = await axios.post(
        `${AI_CHAT_API_END_POINT}/message`,
        { message: userMessage, sessionId },
        { withCredentials: true }
      );

      if (res.data.success) {
        setMessages((prev) => [...prev, { role: "assistant", content: res.data.reply }]);
        if (soundEnabled) {
          playCustomNotificationSound();
        }
        if (res.data.sessionId) {
          setSessionId(res.data.sessionId);
        }
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to fetch response from AI. Please try again.");
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: "Sorry, I encountered an error. Please try again." }
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 md:bottom-6 md:right-6 z-[9999] flex flex-col items-end gap-3 pointer-events-none">
      {/* Greeting Bubble */}
      <AnimatePresence>
        {showGreeting && !isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative pointer-events-auto"
          >
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="bg-white border border-gray-100 shadow-[0_8px_30px_rgba(0,0,0,0.08)] rounded-2xl p-4 w-72 sm:w-80 text-left relative"
            >
              {/* Close Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowGreeting(false);
                }}
                className="absolute top-2.5 right-2.5 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-full hover:bg-gray-100/50 cursor-pointer"
                aria-label="Dismiss greeting"
              >
                <X className="w-3 h-3" />
              </button>
              
              <div className="flex gap-3">
                <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-0.5">
                  <Bot className="w-4 h-4 text-white" />
                </div>
                <div className="pr-3 select-none">
                  <h4 className="font-bold text-[10px] text-purple-600 tracking-wider uppercase mb-0.5">AI Copilot</h4>
                  <p className="text-gray-700 text-xs sm:text-sm leading-relaxed font-medium">
                    👋 Hi! I'm your AI Career Assistant. Need help finding jobs or improving your resume?
                  </p>
                </div>
              </div>
              
              {/* Triangle Tail */}
              <div className="absolute -bottom-1.5 right-6 md:right-7 w-3 h-3 bg-white border-r border-b border-gray-100 rotate-45"></div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Search Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setShowGreeting(false);
          }}
          className="w-14 h-14 md:w-16 md:h-16 bg-gradient-to-tr from-purple-600 via-purple-500 to-pink-500 text-white rounded-full shadow-[0_8px_30px_rgba(147,51,234,0.3)] hover:shadow-[0_12px_40px_rgba(236,72,153,0.5)] hover:scale-110 active:scale-95 transition-all duration-300 ease-out flex items-center justify-center relative group border border-white/10 cursor-pointer pointer-events-auto"
          aria-label="Open AI Assistant"
        >
          <Bot className="w-6 h-6 md:w-7 md:h-7 group-hover:scale-110 group-hover:rotate-6 transition-transform duration-300 ease-out" />
          
          {/* Desktop Hover Tooltip */}
          <span className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900/95 backdrop-blur-sm text-white text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none whitespace-nowrap shadow-lg border border-gray-800/80 hidden md:block">
            Chat with AI Copilot
          </span>

          {/* Online status indicator */}
          <span className="absolute top-0.5 right-0.5 flex h-3.5 w-3.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3.5 w-3.5 bg-emerald-500 border-2 border-white"></span>
          </span>
        </button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="bg-white border border-gray-100 shadow-2xl rounded-2xl w-[90vw] sm:w-96 md:w-[420px] h-[500px] max-h-[85vh] flex flex-col overflow-hidden pointer-events-auto"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 flex items-center justify-between shadow-md z-10 relative">
              <div className="flex items-center gap-3">
                <div className="bg-white/20 p-2 rounded-lg">
                  <Bot className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="font-bold text-lg leading-tight">Jobvista Copilot</h3>
                  <p className="text-xs text-purple-100 font-medium tracking-wide flex items-center gap-1">
                    <span className="w-2 h-2 rounded-full bg-green-400 inline-block animate-pulse"></span>
                    AI Online
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <button
                  onClick={() => {
                    const nextVal = !soundEnabled;
                    setSoundEnabled(nextVal);
                    if (nextVal) {
                      playCustomNotificationSound();
                    }
                  }}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none cursor-pointer"
                  title={soundEnabled ? "Mute sounds" : "Unmute sounds"}
                  aria-label={soundEnabled ? "Mute sounds" : "Unmute sounds"}
                >
                  {soundEnabled ? (
                    <Volume2 className="w-5 h-5 text-purple-100 hover:text-white transition-colors" />
                  ) : (
                    <VolumeX className="w-5 h-5 text-purple-200 hover:text-white transition-colors" />
                  )}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-white hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 p-4 overflow-y-auto bg-gray-50/50 flex flex-col gap-4 scrollbar-thin scrollbar-thumb-indigo-200 scrollbar-track-transparent">

              {/* Welcome/Empty State Message */}
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center space-y-4 px-4 text-gray-500 mt-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center shadow-inner">
                    <MessageSquare className="w-8 h-8 text-purple-600" />
                  </div>
                  <div className="space-y-1">
                    <p className="font-semibold text-gray-800 text-lg">
                      {user ? `Hello, ${user?.fullname?.split(" ")[0]}!` : "Hello there!"}
                    </p>
                    <p className="text-sm leading-relaxed">
                      {user
                        ? "I'm your AI career assistant powered by Groq. Ask me about your skill gaps, resume formatting, or interview prep."
                        : "I'm Jobvista's AI Copilot. Please log in to start chatting about your career and job matching!"}
                    </p>
                  </div>
                </div>
              )}

              {/* Message Thread */}
              {messages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex gap-3 ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  {msg.role === "assistant" && (
                    <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] px-4 py-3 text-sm shadow-sm ${msg.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-pink-500 text-white text-white rounded-2xl rounded-tr-sm"
                      : "bg-white border border-gray-100 text-gray-800 rounded-2xl rounded-tl-sm"
                      }`}
                  >
                    {/* Render Markdown-like text cleanly using pre-wrap */}
                    <p style={{ whiteSpace: "pre-wrap", wordBreak: "break-word" }}>{msg.content}</p>
                  </div>

                  {msg.role === "user" && (
                    <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center shrink-0 shadow-sm border border-gray-300 mt-1">
                      <User2 className="w-5 h-5 text-gray-600" />
                    </div>
                  )}
                </div>
              ))}

              {/* Loading Indicator */}
              {loading && (
                <div className="flex gap-3 justify-start">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-600 to-pink-500 text-white flex items-center justify-center shrink-0 shadow-sm mt-1">
                    <Bot className="w-5 h-5 text-white" />
                  </div>
                  <div className="bg-white border border-gray-100 rounded-2xl rounded-tl-sm px-4 py-4 flex items-center gap-1 shadow-sm">
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-2 h-2 bg-purple-400 rounded-full animate-bounce"></span>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Area */}
            <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex gap-2 w-full">
              <Input
                value={inputVal}
                onChange={(e) => setInputVal(e.target.value)}
                placeholder="Ask your AI Copilot..."
                className="flex-[1_1_100%] focus-visible:ring-gray-800 rounded-xl bg-gray-50 border-gray-200"
                disabled={loading}
              />
              <Button
                type="submit"
                disabled={!inputVal.trim() || loading}
                className="flex-none bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90 rounded-xl shadow-md w-12 px-0 flex items-center justify-center transition-transform active:scale-95"
              >
                <Send className="w-5 h-5" />
              </Button>
            </form>

          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Hidden audio element for custom notification sound */}
      <audio ref={audioRef} src="/sounds/notification.mp3" preload="auto" className="hidden" />
    </div>
  );
};

export default AIChatWidget;
