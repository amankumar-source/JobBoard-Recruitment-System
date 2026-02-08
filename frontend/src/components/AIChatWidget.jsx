import { useState } from "react";
import axios from "axios";

const AIChatWidget = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([
    {
      sender: "bot",
      text: "Hi 👋 I’m Jobvista AI. I can help you find jobs, improve your resume, and suggest skills.",
    },
  ]);

  const sendMessage = async () => {
    if (!message.trim()) return;

    const userMsg = { sender: "user", text: message };
    setChat(prev => [...prev, userMsg]);
    setMessage("");

    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/ai/chat`,
        { message }
      );

      const botMsg = { sender: "bot", text: res.data.reply };
      setChat(prev => [...prev, botMsg]);
    } catch (err) {
      setChat(prev => [
        ...prev,
        { sender: "bot", text: "Something went wrong. Please try again." },
      ]);
    }
  };

  return (
    <>
      {/* FLOATING BUTTON */}
      <button
        onClick={() => setOpen(!open)}
        className="fixed bottom-6 right-6 z-[9999] flex items-center gap-2 px-5 py-3 rounded-full 
        bg-gradient-to-r from-purple-600 to-pink-500 text-white shadow-xl hover:scale-105 transition"
      >
        <span className="text-xl">✨</span>
        <span className="font-semibold hidden sm:block">
          AI Career Assistant
        </span>
      </button>

      {/* CHAT BOX */}
      {open && (
        <div
          className="fixed bottom-24 right-6 z-[9999] w-[360px] max-w-[95vw] 
          bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden"
        >
          {/* HEADER */}
          <div className="bg-gradient-to-r from-purple-600 to-pink-500 text-white p-4 flex justify-between items-center">
            <div>
              <h3 className="font-semibold text-lg">Jobvista AI</h3>
              <p className="text-xs opacity-90">
                Smart job & career assistant
              </p>
            </div>
            <button
              onClick={() => setOpen(false)}
              className="text-xl hover:opacity-80"
            >
              ✕
            </button>
          </div>

          {/* MESSAGES */}
          <div className="flex-1 p-4 space-y-3 overflow-y-auto bg-gray-50">
            {chat.map((c, i) => (
              <div
                key={i}
                className={`max-w-[80%] text-sm px-3 py-2 rounded-xl ${
                  c.sender === "user"
                    ? "ml-auto bg-purple-600 text-white"
                    : "mr-auto bg-white border"
                }`}
              >
                {c.text}
              </div>
            ))}
          </div>

          {/* INPUT */}
          <div className="p-3 border-t flex gap-2">
            <input
              value={message}
              onChange={e => setMessage(e.target.value)}
              onKeyDown={e => e.key === "Enter" && sendMessage()}
              placeholder="Ask about jobs, skills, resume..."
              className="flex-1 border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
            />
            <button
              onClick={sendMessage}
              className="bg-gradient-to-r from-purple-600 to-pink-500 text-white px-4 rounded-xl text-sm font-medium"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default AIChatWidget;
