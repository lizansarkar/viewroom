import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-solid-svg-icons";

export default function TourVoiceToast({
  isListening,
  isAiThinking,
  aiTranscript,
  aiSpokenResponse,
}) {
  return (
    <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20 max-w-md w-[90%] sm:w-auto pointer-events-auto">
      <div className="bg-white/95 backdrop-blur-md border border-black/15 rounded-2xl px-4.5 py-2.5 shadow-xl flex items-center gap-3 text-black">
        <div className="relative shrink-0 flex items-center justify-center">
          <FontAwesomeIcon icon={faCommentDots} className="text-black text-base animate-pulse" />
          {isAiThinking && (
            <div className="absolute inset-0 rounded-full border border-black animate-spin" />
          )}
        </div>
        <div className="flex flex-col text-left">
          <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-500">
            VOICE AI SPATIAL ASSISTANT
          </span>
          <p className="text-xs sm:text-sm font-semibold leading-tight text-black">
            {isListening ? aiTranscript : isAiThinking ? "Analyzing spatial intent..." : aiSpokenResponse}
          </p>
        </div>
      </div>
    </div>
  );
}
