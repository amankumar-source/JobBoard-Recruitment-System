import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =======================
   KNOWLEDGE BASE
======================= */

const knowledgeBase = [
  {
    triggers: ["hi", "hello", "hey", "kaise"],
    answer:
      "Hello 👋 I’m Jobvista AI. I can guide you step by step for jobs and career growth.",
    next: "How can I find jobs?",
  },
  {
    triggers: ["find jobs", "job search"],
    answer:
      "You can find jobs using keywords, skills, and location filters. A complete profile improves visibility.",
    next: "What skills are in demand?",
  },
  {
    triggers: ["skills", "in demand"],
    answer:
      "Top skills right now include React, Node.js, Full Stack Development, AWS, and DevOps.",
    next: "How can I improve my resume?",
  },
  {
    triggers: ["resume", "cv"],
    answer:
      "A good resume highlights relevant skills, real projects, and is tailored to the job role.",
    next: "How should I prepare for interviews?",
  },
  {
    triggers: ["interview"],
    answer:
      "Prepare by understanding the job role, practicing common questions, and explaining your projects clearly.",
    next: null,
  },
];

const STORAGE_KEY = "jobvista_ai_chat";

/* =======================
   COMPONENT
======================= */

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const messagesEndRef = useRef(null);
  const chatBoxRef = useRef(null);

  const [chat, setChat] = useState(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved
      ? JSON.parse(saved)
      : [
          {
            sender: "bot",
            text: "Hi 👋 I’m Jobvista AI. How can I help you today?",
            nextQuestion: "How can I find jobs?",
          },
        ];
  });

  /* =======================
     AUTO SCROLL
  ======================= */

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  /* =======================
     SAVE CHAT
  ======================= */

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(chat));
  }, [chat]);

  /* =======================
     CLOSE ON OUTSIDE CLICK
  ======================= */

  useEffect(() => {
    const handleClickOutside = e => {
      if (chatBoxRef.current && !chatBoxRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener("mousedown", handleClickOutside);
  }, [open]);

  /* =======================
     BOT RESPONSE
  ======================= */

  const getBotResponse = text => {
    const msg = text.toLowerCase();
    for (let item of knowledgeBase) {
      if (item.triggers.some(t => msg.includes(t))) {
        return { text: item.answer, next: item.next };
      }
    }
    return {
      text:
        "I can help with jobs, skills, resumes, and interviews. Let’s continue step by step.",
      next: "How can I find jobs?",
    };
  };

  /* =======================
     SEND MESSAGE
  ======================= */

  const sendMessage = text => {
    if (!text.trim()) return;

    setChat(prev => [...prev, { sender: "user", text }]);
    setMessage("");
    setIsTyping(true);

    const reply = getBotResponse(text);

    setTimeout(() => {
      setChat(prev => [
        ...prev,
        { sender: "bot", text: reply.text, nextQuestion: reply.next },
      ]);
      setIsTyping(false);
    }, 800);
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(prev => !prev)}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full 
        bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xl hover:scale-105 transition"
      >
        ✨ <span className="hidden sm:block font-semibold">AI Career Assistant</span>
      </button>

      {/* CHAT */}
      <AnimatePresence>
        {open && (
          <motion.div
            ref={chatBoxRef}
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="fixed bottom-24 right-6 z-[9999] w-[360px] max-w-[95vw]
            h-[480px] sm:h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col"
          >
            {/* HEADER */}
            <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 flex justify-between rounded-t-2xl">
              <div>
                <h3 className="font-semibold">Jobvista AI</h3>
                <p className="text-xs opacity-90">Career Assistant</p>
              </div>
              <button onClick={() => setOpen(false)}>✕</button>
            </div>

            {/* MESSAGES (SCROLLABLE) */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chat.map((c, i) => (
                <div key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${
                      c.sender === "user"
                        ? "ml-auto bg-purple-600 text-white"
                        : "bg-white border"
                    }`}
                  >
                    {c.text}
                  </motion.div>

                  {c.sender === "bot" && c.nextQuestion && !isTyping && (
                    <button
                      onClick={() => sendMessage(c.nextQuestion)}
                      className="mt-2 text-sm px-3 py-2 rounded-xl bg-purple-100 text-purple-700 hover:bg-purple-200"
                    >
                      {c.nextQuestion}
                    </button>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="text-xs text-gray-500 italic">
                  Jobvista AI is typing…
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 border-t flex gap-2">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === "Enter" && sendMessage(message)}
                placeholder="Ask about jobs, skills, resume..."
                disabled={isTyping}
                className="flex-1 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500"
              />
              <button
                onClick={() => sendMessage(message)}
                disabled={isTyping}
                className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 rounded-xl text-sm"
              >
                Send
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default AIChatWidget;
