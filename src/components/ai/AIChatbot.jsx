import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPaperPlane,
  faRobot,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { apiAskSpatialConcierge } from "../../services/api";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I am your ViewRoom 360° Spatial AI Concierge. Ask me anything about floor navigation, room dimensions, or product 360 configurations!",
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    },
  ]);

  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen]);

  const handleSendMessage = async (textToSend) => {
    const query = textToSend || inputMessage;
    if (!query.trim() || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query.trim(),
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputMessage("");
    setIsLoading(true);

    try {
      const replyText = await apiAskSpatialConcierge(query, {
        page: window.location.pathname,
        timestamp: new Date().toISOString(),
      });

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: replyText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "I'm temporarily experiencing spatial connectivity updates. Feel free to ask another question!",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPrompts = [
    "📍 How to switch 360 floors?",
    "📐 Room specs & dimensions",
    "🛋️ Recommend furniture layout",
    "💳 Pricing & custom options",
  ];

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Floating Chat Modal */}
      {isOpen && (
        <div className="mb-4 w-[92vw] sm:w-[380px] h-[520px] max-h-[80vh] rounded-3xl bg-base-100/90 dark:bg-neutral-900/95 backdrop-blur-xl border border-white/20 dark:border-white/10 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-cyan-600 via-cyan-500 to-blue-600 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 text-white">
                <FontAwesomeIcon icon={faRobot} className="text-lg" />
              </div>
              <div>
                <h3 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                  Spatial AI Concierge
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                </h3>
                <p className="text-[11px] text-cyan-100 opacity-90">Powered by Google Gemini 1.5</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full bg-black/20 hover:bg-black/40 flex items-center justify-center text-white transition-colors"
              aria-label="Close AI Chat"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 rounded-full flex items-center justify-center text-xs flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-blue-500 to-indigo-600 text-white"
                      : "bg-cyan-500/20 text-cyan-500 dark:text-cyan-400 border border-cyan-500/30"
                  }`}
                >
                  <FontAwesomeIcon icon={msg.sender === "user" ? faUser : faRobot} />
                </div>
                <div
                  className={`max-w-[80%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white rounded-tr-none"
                      : "bg-base-200/80 dark:bg-neutral-800/80 text-base-content border border-base-300 dark:border-neutral-700/60 rounded-tl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right opacity-70 ${
                      msg.sender === "user" ? "text-cyan-100" : "text-base-content/60"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-7 h-7 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30 flex items-center justify-center text-xs">
                  <FontAwesomeIcon icon={faRobot} />
                </div>
                <div className="bg-base-200 dark:bg-neutral-800 p-3 rounded-2xl rounded-tl-none border border-base-300 dark:border-neutral-700 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts */}
          <div className="px-3 py-2 bg-base-200/40 dark:bg-neutral-950/40 border-t border-base-300/40 dark:border-neutral-800/60 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-base-100 dark:bg-neutral-800 border border-base-300 dark:border-neutral-700 text-base-content/80 hover:text-cyan-500 hover:border-cyan-500/50 whitespace-nowrap transition-colors"
              >
                {promptText}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage();
            }}
            className="p-3 bg-base-100 dark:bg-neutral-900 border-t border-base-300 dark:border-neutral-800 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask AI about 360° spaces or products..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-base-200/60 dark:bg-neutral-800/80 text-xs px-3.5 py-2.5 rounded-full border border-base-300 dark:border-neutral-700/80 focus:outline-none focus:border-cyan-500 text-base-content placeholder:text-base-content/40"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shadow-md flex-shrink-0"
              aria-label="Send Message"
            >
              <FontAwesomeIcon icon={faPaperPlane} className="text-xs" />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative w-14 h-14 rounded-full bg-gradient-to-r from-cyan-500 via-blue-600 to-cyan-400 text-white shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 border-2 border-white/20"
        aria-label="Toggle AI Concierge"
      >
        <div className="absolute -inset-1 rounded-full bg-gradient-to-r from-cyan-400 to-blue-600 blur opacity-40 group-hover:opacity-80 transition duration-300 animate-pulse"></div>
        <div className="relative flex items-center justify-center">
          <FontAwesomeIcon
            icon={isOpen ? faChevronDown : faRobot}
            className="text-xl transition-transform duration-300 group-hover:rotate-12"
          />
        </div>
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-400 border-2 border-base-100 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          </span>
        )}
      </button>
    </div>
  );
}
