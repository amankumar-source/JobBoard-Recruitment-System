import { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

/* =======================
   KNOWLEDGE ENGINE
   Defined at module level — never recreated on re-renders
======================= */

const knowledge = {
  start: {
    text: "Hi 👋 I'm Jobvista Career Assistant. I can guide you with jobs, skills, resumes, and interviews.",
    options: [
      "How can I find relevant jobs?",
      "How can I improve my skills?",
      "How do I build a strong resume?",
      "How should I prepare for interviews?",
    ],
  },

  "How can I find relevant jobs?": {
    text: "You can find relevant jobs by using skill-based search, location filters, and keeping your profile updated.",
    options: [
      "How do job recommendations work?",
      "What is the best way to apply for jobs?",
    ],
  },

  "How do job recommendations work?": {
    text: "Job recommendations work best when your skills, experience, and preferences are updated in your profile.",
    options: [
      "How can I improve my skills?",
      "How do I build a strong resume?",
    ],
  },

  "What is the best way to apply for jobs?": {
    text: "Always tailor your resume, read job descriptions carefully, and apply consistently.",
    options: [
      "How do I build a strong resume?",
      "How should I prepare for interviews?",
    ],
  },

  "How can I improve my skills?": {
    text: "Focus on in-demand skills like React, Node.js, Cloud technologies, and problem-solving.",
    options: [
      "Which technical skills are in demand?",
      "How do I build a strong resume?",
    ],
  },

  "Which technical skills are in demand?": {
    text: "For developers, React, Node.js, databases, and cloud skills are highly valuable right now.",
    options: [
      "How do I build a strong resume?",
      "How should I prepare for interviews?",
    ],
  },

  "How do I build a strong resume?": {
    text: "A strong resume highlights your skills, real projects, and achievements in a clear format.",
    options: [
      "What are the best resume tips?",
      "How should I prepare for interviews?",
    ],
  },

  "What are the best resume tips?": {
    text: "Keep your resume concise, use bullet points, and customize it for each job role.",
    options: [
      "How should I prepare for interviews?",
      "How can I find relevant jobs?",
    ],
  },

  "How should I prepare for interviews?": {
    text: "Interview success comes from understanding the role, practicing questions, and explaining your projects confidently.",
    options: [
      "What are common interview questions?",
      "How can I negotiate my salary?",
    ],
  },

  "What are common interview questions?": {
    text: "Be ready to explain your projects, strengths, weaknesses, and problem-solving approach.",
    options: [
      "How can I negotiate my salary?",
      "How can I find relevant jobs?",
    ],
  },

  "How can I negotiate my salary?": {
    text: "Research market salary, know your value, and communicate confidently during negotiation.",
    options: [
      "How can I improve my skills?",
      "How can I find relevant jobs?",
    ],
  },

  fallback: {
    text: "I didn't quite understand that, but I can help you with the following:",
    options: [
      "How can I find relevant jobs?",
      "How can I improve my skills?",
      "How do I build a strong resume?",
      "How should I prepare for interviews?",
    ],
  },
};

/* =======================
   KEYWORD → INTENT MAP
   Defined at module level — never recreated
======================= */

const keywordMap = {
  job: "How can I find relevant jobs?",
  jobs: "How can I find relevant jobs?",
  apply: "What is the best way to apply for jobs?",
  resume: "How do I build a strong resume?",
  cv: "How do I build a strong resume?",
  skill: "How can I improve my skills?",
  skills: "How can I improve my skills?",
  interview: "How should I prepare for interviews?",
  salary: "How can I negotiate my salary?",
  negotiation: "How can I negotiate my salary?",
};

/* =======================
   Pure helpers — module-level, never recreated
======================= */

const findIntentFromText = (text) => {
  const lower = text.toLowerCase();
  for (const key in keywordMap) {
    if (lower.includes(key)) return keywordMap[key];
  }
  return null;
};

const looksLikeSkill = (text) => {
  const cleaned = text.trim().toLowerCase();
  return (
    cleaned.split(" ").length <= 2 &&
    /^[a-zA-Z]+$/.test(cleaned.replace(" ", ""))
  );
};

/* =======================
   COMPONENT
======================= */

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: knowledge.start.text,
      options: knowledge.start.options,
    },
  ]);

  /* Auto-scroll — only fire when chat or isTyping change */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, isTyping]);

  /* Stable handler — useCallback prevents recreation on every render */
  const sendMessage = useCallback((text) => {
    if (!text.trim()) return;

    setIsTyping(true);

    // Clear old options
    setChat((prev) =>
      prev.map((m) => (m.sender === "bot" ? { ...m, options: [] } : m))
    );

    setChat((prev) => [...prev, { sender: "user", text }]);
    setMessage("");

    setTimeout(() => {
      let data = knowledge[text];

      if (!data) {
        const intentQuestion = findIntentFromText(text);
        if (intentQuestion) {
          data = knowledge[intentQuestion];
        } else if (looksLikeSkill(text)) {
          data = knowledge["How can I improve my skills?"];
        } else {
          data = knowledge.fallback;
        }
      }

      setChat((prev) => [
        ...prev,
        {
          sender: "bot",
          text: data.text,
          options: data.options,
        },
      ]);

      setIsTyping(false);
    }, 700);
  }, []);

  const toggleOpen = useCallback(() => setOpen((p) => !p), []);
  const handleClose = useCallback(() => setOpen(false), []);
  const handleInputChange = useCallback((e) => setMessage(e.target.value), []);
  const handleKeyDown = useCallback(
    (e) => {
      if (e.key === "Enter") sendMessage(message);
    },
    [message, sendMessage]
  );
  const handleSend = useCallback(() => sendMessage(message), [message, sendMessage]);

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={toggleOpen}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full 
        bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xl hover:scale-105 transition"
      >
        ✨ <span className="hidden sm:block font-semibold">Career Assistant</span>
      </button>

      {/* CHAT BOX */}
      <AnimatePresence>
        {open && (
          <motion.div
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
                <h3 className="font-semibold">Jobvista</h3>
                <p className="text-xs opacity-90">Career Assistant</p>
              </div>
              <button onClick={handleClose} aria-label="Close chat">✕</button>
            </div>

            {/* MESSAGES */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
              {chat.map((c, i) => (
                <div key={i}>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`max-w-[80%] px-3 py-2 rounded-xl text-sm ${c.sender === "user"
                        ? "ml-auto bg-purple-600 text-white"
                        : "bg-white border"
                      }`}
                  >
                    {c.text}
                  </motion.div>

                  {c.sender === "bot" && c.options?.length > 0 && (
                    <div className="mt-2 space-y-2">
                      {c.options.map((opt, idx) => (
                        <button
                          key={idx}
                          onClick={() => sendMessage(opt)}
                          className="block w-fit text-sm px-3 py-2 rounded-xl 
                          bg-purple-100 text-purple-700 hover:bg-purple-200"
                        >
                          {opt}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              ))}

              {isTyping && (
                <div className="text-xs text-gray-500 italic">
                  Jobvista Assistant is typing…
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* INPUT */}
            <div className="p-3 border-t flex gap-2">
              <input
                value={message}
                onChange={handleInputChange}
                onKeyDown={handleKeyDown}
                placeholder="Type or choose an option..."
                disabled={isTyping}
                className="flex-1 border rounded-xl px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:outline-none"
              />
              <button
                onClick={handleSend}
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
