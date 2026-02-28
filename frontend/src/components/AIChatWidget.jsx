import React, { useState, useEffect, useRef } from "react";
import { useSelector } from "react-redux";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Bot, Send, X, User2, MessageSquare, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { toast } from "sonner";
import { USER_API_END_POINT } from "@/utils/constant";

// Assuming backend runs on the same origin or we have a proxy:
const AI_CHAT_API_END_POINT = "http://localhost:8000/api/ai-chat";

const AIChatWidget = () => {
  const { user } = useSelector((store) => store.auth);
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputVal, setInputVal] = useState("");
  const [loading, setLoading] = useState(false);
  const [sessionId, setSessionId] = useState(null);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

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
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end">
      {/* Search Toggle Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-6 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform flex items-center justify-center gap-2 relative group"
        >
          <Bot className="w-6 h-6" />
          <span className="font-semibold leading-none">AI Assistant</span>
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-green-500"></span>
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
            className="bg-white border border-gray-100 shadow-2xl rounded-2xl w-[90vw] sm:w-96 md:w-[420px] h-[500px] max-h-[85vh] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 flex items-center justify-between text-white shadow-md z-10">
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
              <button
                onClick={() => setIsOpen(false)}
                className="text-white hover:bg-white/20 p-2 rounded-full transition-colors focus:outline-none"
              >
                <X className="w-5 h-5" />
              </button>
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
    </div>
  );
};

export default AIChatWidget;
