import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPaperPlane,
  faRobot,
  faUser,
  faChevronDown,
  faBolt,
} from "@fortawesome/free-solid-svg-icons";
import { apiAskSpatialConcierge } from "../../services/api";
import { trackEvent } from "../../services/analyticsService";

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: "ai",
      text: "Hello! I'm your ViewRoom Spatial AI Concierge. Ask me anything about floor plans, 360° virtual tour navigation, room dimensions, or 3D product configurations!",
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

  const handleSendMessage = async (e) => {
    if (e) e.preventDefault();
    const query = inputMessage.trim();
    if (!query || isLoading) return;

    const userMsg = {
      id: Date.now(),
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    };

    trackEvent("ai_queried", "Spatial AI Concierge", `Asked: '${query}'`);

    const updatedMessages = [...messages, userMsg];
    setMessages(updatedMessages);
    setInputMessage("");
    setIsLoading(true);

    try {
      // Map message history to simple array for multi-turn conversational context
      const historyPayload = updatedMessages.map((m) => ({
        sender: m.sender,
        text: m.text,
      }));

      const replyText = await apiAskSpatialConcierge(
        query,
        {
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
        },
        historyPayload
      );

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
          text: "I am currently updating spatial connections. How else can I assist your tour today?",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto cursor-ai-pointer">
      {/* Glassmorphic Chat Window matching ViewRoom Theme */}
      {isOpen && (
        <div className="mb-3.5 w-[calc(100vw-2rem)] sm:w-[390px] h-[530px] max-h-[80vh] rounded-3xl bg-slate-950/95 backdrop-blur-2xl border border-emerald-500/30 shadow-[0_25px_60px_rgba(0,0,0,0.85)] flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          
          {/* Header Bar */}
          <div className="px-4 py-3.5 bg-gradient-to-r from-slate-900 via-slate-900/90 to-slate-950 border-b border-emerald-500/20 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center font-bold text-sm shadow-lg shadow-emerald-500/20">
                <FontAwesomeIcon icon={faRobot} />
                <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-slate-100 flex items-center gap-2">
                  SPATIAL AI ASSISTANT
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-semibold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                    LIVE
                  </span>
                </h3>
                <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1 mt-0.5">
                  <FontAwesomeIcon icon={faBolt} className="text-teal-400 text-[9px]" />
                  Google Gemini 1.5 & Spatial Engine
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-8 h-8 rounded-full hover:bg-slate-800/80 flex items-center justify-center text-slate-400 hover:text-white transition-colors text-xs cursor-ai-pointer"
              aria-label="Close AI Chat"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-950/80 ai-chat-scrollbar">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex gap-2.5 ${msg.sender === "user" ? "flex-row-reverse" : "flex-row"}`}
              >
                <div
                  className={`w-7 h-7 rounded-xl flex items-center justify-center text-[11px] flex-shrink-0 shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950"
                      : "bg-slate-900 border border-slate-800 text-emerald-400"
                  }`}
                >
                  <FontAwesomeIcon icon={msg.sender === "user" ? faUser : faRobot} />
                </div>
                <div
                  className={`max-w-[84%] p-3.5 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white rounded-tr-none font-medium"
                      : "bg-slate-900/90 border border-slate-800 text-slate-200 rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                  <span
                    className={`block text-[9px] mt-1.5 text-right ${
                      msg.sender === "user" ? "text-emerald-100/80" : "text-slate-500"
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
                <div className="w-7 h-7 rounded-xl bg-slate-900 border border-slate-800 text-emerald-400 flex items-center justify-center text-[11px]">
                  <FontAwesomeIcon icon={faRobot} />
                </div>
                <div className="bg-slate-900/90 p-3.5 rounded-2xl rounded-tl-none border border-slate-800 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-bounce"></span>
                  <span className="w-2 h-2 rounded-full bg-teal-400 animate-bounce [animation-delay:0.2s]"></span>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.4s]"></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Clean Input Form (Suggestions removed for ultra-clean UI) */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-slate-900/90 border-t border-slate-800/80 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder="Ask anything or greeting..."
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-slate-950 text-xs px-4 py-3 rounded-xl border border-slate-800 focus:outline-none focus:border-emerald-500/60 text-slate-100 placeholder:text-slate-500 cursor-ai-pointer transition-colors"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 text-slate-950 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-all shadow-md shadow-emerald-500/20 flex-shrink-0 text-xs font-bold cursor-ai-pointer"
              aria-label="Send Message"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Toggle Button with Custom Cursor Pointer & Glow */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative w-14 h-14 sm:w-15 sm:h-15 rounded-2xl bg-slate-950 text-emerald-400 border border-emerald-500/40 shadow-[0_10px_30px_rgba(16,185,129,0.25)] flex items-center justify-center hover:scale-105 active:scale-95 transition-all duration-300 cursor-ai-pointer"
        aria-label="Toggle AI Assistant"
      >
        <FontAwesomeIcon
          icon={isOpen ? faChevronDown : faRobot}
          className="text-xl transition-transform duration-300 group-hover:text-emerald-300"
        />
        {!isOpen && (
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-slate-950 flex items-center justify-center">
            <span className="w-1.5 h-1.5 rounded-full bg-white animate-ping"></span>
          </span>
        )}
      </button>
    </div>
  );
}
