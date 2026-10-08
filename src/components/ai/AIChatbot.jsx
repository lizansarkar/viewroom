import React, { useState, useRef, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faXmark,
  faPaperPlane,
  faUser,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import { ViewRoomLogoIcon } from "../reuseable/Logo";
import { apiAskSpatialConcierge } from "../../services/api";
import { trackEvent } from "../../services/analyticsService";

// Dynamic cycling suggestions inside the input placeholder
const INPUT_SUGGESTIONS = [
  'Ask: "How do 360° Virtual Tours work?"',
  'Ask: "Explain Matterport 3D Pro Scans"',
  'Ask: "Can I customize 360° 3D Products?"',
  'Ask: "Pricing & Photography Booking"',
];

// ViewRoom Logo with BIG Animated Sparkle Stars (Jhikimiki effect, adapts 100% to Light & Dark modes)
export function ViewRoomAIIcon({ className = "w-12 h-12", isHeader = false }) {
  return (
    <div className={`relative inline-flex items-center justify-center shrink-0 ${className}`}>
      {/* Embedded CSS for smooth organic twinkling ("jhikimiki") animation */}
      <style>{`
        @keyframes vr_jhikimiki_main {
          0%, 100% { transform: scale(1) rotate(0deg); opacity: 1; }
          50% { transform: scale(0.62) rotate(14deg); opacity: 0.35; }
        }
        @keyframes vr_jhikimiki_top {
          0%, 100% { transform: scale(0.58) rotate(-12deg); opacity: 0.35; }
          50% { transform: scale(1.18) rotate(5deg); opacity: 1; }
        }
        @keyframes vr_jhikimiki_right {
          0%, 100% { transform: scale(1.12) rotate(0deg); opacity: 1; }
          50% { transform: scale(0.5) rotate(22deg); opacity: 0.3; }
        }
        .vr-star-main { transform-origin: 24px 30px; animation: vr_jhikimiki_main 1.8s ease-in-out infinite; }
        .vr-star-top { transform-origin: 14px 11px; animation: vr_jhikimiki_top 1.5s ease-in-out infinite; }
        .vr-star-right { transform-origin: 38px 14px; animation: vr_jhikimiki_right 2.1s ease-in-out infinite; }
      `}</style>

      {/* Base ViewRoom 360° Logo Emblem */}
      <ViewRoomLogoIcon className="w-full h-full text-current" />

      {/* BIG 3-Star Cluster attached to top-right of the logo */}
      <svg
        viewBox="0 0 50 50"
        fill="currentColor"
        className={`absolute pointer-events-none text-current overflow-visible ${
          isHeader
            ? "-top-2.5 -right-3 w-6 h-6"
            : "-top-3.5 -right-4 sm:-top-4 sm:-right-5 w-8 h-8 sm:w-10 sm:h-10"
        }`}
      >
        {/* Top Medium Star */}
        <path
          d="M 14 1 Q 14 11 24 11 Q 14 11 14 21 Q 14 11 4 11 Q 14 11 14 1 Z"
          className="vr-star-top"
        />

        {/* Center / Bottom Main Big Star */}
        <path
          d="M 24 14 Q 24 30 40 30 Q 24 30 24 46 Q 24 30 8 30 Q 24 30 24 14 Z"
          className="vr-star-main"
        />

        {/* Right Small / Accent Star */}
        <path
          d="M 38 6 Q 38 14 46 14 Q 38 14 38 22 Q 38 14 30 14 Q 38 14 38 6 Z"
          className="vr-star-right"
        />
      </svg>
    </div>
  );
}

export default function AIChatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [inputMessage, setInputMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [suggestionIndex, setSuggestionIndex] = useState(0);

  // Initial default welcome introduction from ViewRoom AI
  const [messages, setMessages] = useState([
    {
      id: "intro-msg",
      sender: "ai",
      text: "Hello! I am your ViewRoom AI Spatial Concierge. I can guide you through our 360° virtual tours, Matterport 3D digital twins, interactive 3D products, and booking inquiries. How can I help you today?",
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

  // Smoothly cycle through the 4 input placeholder suggestions every 3.5s
  useEffect(() => {
    if (!isOpen) return;
    const interval = setInterval(() => {
      setSuggestionIndex((prev) => (prev + 1) % INPUT_SUGGESTIONS.length);
    }, 3500);
    return () => clearInterval(interval);
  }, [isOpen]);

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
      const historyPayload = updatedMessages.map((m) => ({
        sender: m.sender,
        text: typeof m.text === "string" ? m.text : (m.text?.reply || ""),
      }));

      const response = await apiAskSpatialConcierge(
        query,
        {
          page: window.location.pathname,
          timestamp: new Date().toISOString(),
        },
        historyPayload
      );

      let cleanText = "";
      if (typeof response === "string") {
        cleanText = response;
      } else if (response && typeof response === "object") {
        cleanText = response.reply || response.message || response.text || "";
      }

      if (!cleanText) {
        cleanText = "Hello! I am your ViewRoom AI Spatial Concierge. How can I help you explore our 360° virtual spaces today?";
      }

      const aiMsg = {
        id: Date.now() + 1,
        sender: "ai",
        text: cleanText,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      };

      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      setMessages((prev) => [
        ...prev,
        {
          id: Date.now() + 1,
          sender: "ai",
          text: "Hello! I am your ViewRoom AI Spatial Concierge. Feel free to ask about room dimensions, floor portals, or 360° navigation.",
          timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 sm:bottom-6 sm:right-6 z-50 flex flex-col items-end pointer-events-auto">
      {/* Clean Website Theme Chat Window (Fully Responsive) */}
      {isOpen && (
        <div className="mb-3.5 w-[calc(100vw-2rem)] sm:w-[380px] h-[520px] max-h-[78vh] rounded-2xl bg-base-100 border border-[var(--app-border)]/40 shadow-2xl flex flex-col overflow-hidden transition-all duration-300 transform scale-100 origin-bottom-right">
          
          {/* Header Bar - ViewRoom AI Branding */}
          <div className="px-4 py-3.5 bg-base-200 border-b border-[var(--app-border)]/30 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-base-100 border border-[var(--app-border)]/40 text-[var(--app-text-primary)] flex items-center justify-center shadow-sm flex-shrink-0">
                <ViewRoomAIIcon className="w-5 h-5" isHeader={true} />
              </div>
              <div>
                <h3 className="font-heading font-extrabold text-xs uppercase tracking-wider text-[var(--app-text-primary)]">
                  VIEWROOM SPATIAL AI
                </h3>
                <p className="text-[10px] text-[var(--app-text-secondary)] font-medium">
                  360° Virtual Concierge • Gemini AI
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="w-7 h-7 rounded-full hover:bg-base-300 flex items-center justify-center text-[var(--app-text-primary)] transition-colors text-xs cursor-pointer"
              aria-label="Close AI Chat"
            >
              <FontAwesomeIcon icon={faXmark} />
            </button>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-base-100 ai-chat-scrollbar">
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
                  {msg.sender === "user" ? (
                    <FontAwesomeIcon icon={faUser} />
                  ) : (
                    <ViewRoomLogoIcon className="w-3.5 h-3.5" />
                  )}
                </div>
                <div
                  className={`max-w-[82%] p-3 rounded-2xl text-xs leading-relaxed shadow-sm ${
                    msg.sender === "user"
                      ? "bg-base-content text-base-100 rounded-tr-none font-medium"
                      : "bg-base-200/90 border border-[var(--app-border)]/40 text-[var(--app-text-primary)] rounded-tl-none"
                  }`}
                >
                  <p className="whitespace-pre-line">
                    {typeof msg.text === "string" ? msg.text : (msg.text?.reply || msg.text?.message || JSON.stringify(msg.text))}
                  </p>
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

            {/* Loading Indicator */}
            {isLoading && (
              <div className="flex gap-2.5 items-center">
                <div className="w-6 h-6 rounded-full bg-base-200 border border-[var(--app-border)]/40 text-[var(--app-text-primary)] flex items-center justify-center text-[10px]">
                  <ViewRoomLogoIcon className="w-3.5 h-3.5" />
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

          {/* Input Form with Dynamic Cycling Suggestion Placeholder */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-base-100 border-t border-[var(--app-border)]/30 flex items-center gap-2"
          >
            <input
              type="text"
              placeholder={INPUT_SUGGESTIONS[suggestionIndex]}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              className="flex-1 bg-base-200/60 !text-[14px] px-3.5 py-2.5 rounded-full border border-[var(--app-border)]/40 focus:outline-none focus:border-[var(--app-text-primary)] text-[var(--app-text-primary)] placeholder:text-[var(--app-text-secondary)]/70 cursor-text transition-all duration-300"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isLoading}
              className="w-9 h-9 rounded-full bg-base-content text-base-100 flex items-center justify-center disabled:opacity-40 hover:opacity-90 transition-opacity shadow-sm flex-shrink-0 text-xs cursor-pointer disabled:cursor-not-allowed"
              aria-label="Send Message"
            >
              <FontAwesomeIcon icon={faPaperPlane} />
            </button>
          </form>
        </div>
      )}

      {/* Floating Trigger Button: ZERO Background Color, Bold ViewRoom Logo + BIG Twinkling ("Jhikimiki") Stars */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        className="group relative p-2 bg-transparent border-0 shadow-none flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 cursor-pointer outline-none select-none text-[var(--app-text-primary)]"
        aria-label="Toggle ViewRoom AI Assistant"
      >
        {isOpen ? (
          <div className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-base-200/90 border border-[var(--app-border)]/40 flex items-center justify-center text-[var(--app-text-primary)] shadow-lg hover:bg-base-300 transition-colors">
            <FontAwesomeIcon
              icon={faChevronDown}
              className="text-lg transition-transform duration-300"
            />
          </div>
        ) : (
          <ViewRoomAIIcon className="w-12 h-12 sm:w-14 sm:h-14" />
        )}
      </button>
    </div>
  );
}
