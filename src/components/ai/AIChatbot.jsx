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
      text: "Welcome to ViewRoom 360°. I am your Spatial AI Assistant. How can I help you explore floor plans, room dimensions, or product 360 models?",
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
          text: "I am currently updating spatial connections. Feel free to ask another question!",
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
    "🛋️ Furniture layout ideas",
    "💳 Pricing & 3D options",
  ];

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Floating Chat Window matching ViewRoom Theme */}
      {isOpen && (
        <div className="mb-3.5 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[78vh] rounded-2xl bg-base-100 border border-[var(--app-border)]/40 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          
          {/* Header Bar */}
          <div className="px-4 py-3.5 bg-base-200 border-b border-[var(--app-border)]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-base-content text-base-100 flex items-center justify-center font-bold text-xs shadow-sm">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--app-text-primary)] flex items-center gap-2">
                  SPATIAL AI ASSISTANT
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                </h3>
                <p className="text-[10px] text-[var(--app-text-secondary)] font-medium">Powered by Google Gemini 1.5</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full hover:bg-base-300 flex items-center justify-center text-[var(--app-text-primary)] transition-colors text-xs"
              aria-label="Close AI Chat"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-base-100">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] flex-shrink-0 ${
                    msg.sender === "user"
                      ? "bg-base-content text-base-100"
                      : "bg-base-200 border border-[var(--app-border)]/40 text-[var(--app-text-primary)]"
                  }`}
                >
                  <FontAwesomeIcon icon={msg.sender === "user" ? faUser : faRobot} />
                </div>
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-base-content text-base-100 rounded-tr-none font-medium"
                      : "bg-base-200/90 border border-[var(--app-border)]/40 text-[var(--app-text-primary)] rounded-tl-none"
                  }`}
                >
                  <p>{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1 text-right ${
                      msg.sender === "user" ? "opacity-75" : "text-[var(--app-text-secondary)]"
                    }`}
                  >
                    {msg.timestamp}
                  </span>
                </div>
              </div>
            ))}

            {/* Loading Animation */}
            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-6 h-6 rounded-full bg-base-200 border border-[var(--app-border)]/40 text-[var(--app-text-primary)] flex items-center justify-center text-[10px]">
                  <FontAwesomeIcon icon={faRobot} />
                </div>
                <div className="bg-base-200/90 p-3 rounded-2xl rounded-tl-none border border-[var(--app-border)]/40 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--app-text-primary)] animate-bounce"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--app-text-primary)] animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-1.5 h-1.5 rounded-full bg-[var(--app-text-primary)] animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Prompts Bar */}
          <div className="px-3 py-2 bg-base-200/60 border-t border-[var(--app-border)]/30 flex gap-1.5 overflow-x-auto no-scrollbar">
            {quickPrompts.map((promptText, idx) => (
              <button
                key={idx}
                onClick={() => handleSendMessage(promptText)}
                className="px-2.5 py-1 rounded-full text-[10px] font-medium bg-base-100 border border-[var(--app-border)]/40 text-[var(--app-text-primary)] hover:bg-base-content hover:text-base-100 whitespace-nowrap transition-all"
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
            className="p-3 bg-base-100 border-t border-[var(--app-border)]/30 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask about 360° spaces or products..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-base-200/60 text-xs px-3.5 py-2.5 rounded-full border border-[var(--app-border)]/40 focus:outline-none focus:border-[var(--app-text-primary)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-secondary)]"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-base-content text-base-100 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shadow-sm flex-shrink-0 text-xs"
              aria-label="Send Message"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button matching ViewRoom Luxury Design */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative w-13 h-13 sm:w-14 sm:h-14 rounded-full bg-base-content text-base-100 border border-[var(--app-border)]/50 shadow-2xl flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300"
        aria-label="Toggle AI Assistant"
      >
        <FontAwesomeIcon
          icon={isOpen ? faChevronDown : faRobot}
          className="text-lg sm:text-xl transition-transform duration-300"
        />
        {!isOpen && (
          <span className="absolute -top-0.5 -right-0.5 w-3.5 h-3.5 rounded-full bg-emerald-500 border-2 border-base-100 flex items-center justify-center">
            <span className="w-1 h-1 rounded-full bg-white animate-ping"></span>
          </span>
        )}
      </button>
    </div>
  );
}
