import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faPause,
  faForwardStep,
  faXmark,
  faFilm,
  faHandPointer,
} from "@fortawesome/free-solid-svg-icons";
import { uiSound } from "../../utils/tourSoundEngine";

export default function CinematicAutoPilotHUD({
  isActive,
  isPaused,
  onTogglePause,
  onNextScene,
  onExit,
  currentScene,
  currentIndex,
  totalScenes,
  progress,
}) {
  if (!isActive) return null;

  return (
    <div className="absolute inset-x-0 bottom-6 sm:bottom-8 z-40 flex flex-col items-center pointer-events-none px-4 select-none">
      {/* Top Helper Badge: Frosted Glass Notification */}
      <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        <div
          style={{
            backgroundColor: "rgba(15, 15, 18, 0.4)",
            backdropFilter: "blur(20px)",
            WebkitBackdropFilter: "blur(20px)",
            color: "#ffffff",
          }}
          className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/30 text-xs font-semibold shadow-xl pointer-events-auto"
        >
          <FontAwesomeIcon icon={faHandPointer} className="text-xs" style={{ color: "#ffffff" }} />
          <span style={{ color: "#ffffff" }}>
            {isPaused
              ? "Manual Mode Active • Drag screen freely or click Resume"
              : "Drag mouse/touch anytime to pause and explore manually"}
          </span>
        </div>
      </div>

      {/* Main Frosted Glass Luxury Console (Pure Translucent Blur) */}
      <div
        style={{
          backgroundColor: "rgba(15, 15, 20, 0.45)",
          backdropFilter: "blur(32px)",
          WebkitBackdropFilter: "blur(32px)",
        }}
        className="w-full max-w-2xl border border-white/25 rounded-3xl shadow-[0_16px_45px_rgba(0,0,0,0.4)] p-4 sm:p-5 pointer-events-auto transition-all duration-300"
      >
        {/* Header Row: Live Auto-Pilot Tag & Exit Button */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {isPaused ? (
              <span
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.15)",
                  borderColor: "rgba(255, 255, 255, 0.3)",
                  color: "#ffffff",
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase border"
              >
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: "#ffffff" }} />
                PAUSED
              </span>
            ) : (
              <span
                style={{
                  backgroundColor: "rgba(255, 255, 255, 0.2)",
                  borderColor: "rgba(255, 255, 255, 0.4)",
                  color: "#ffffff",
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase border"
              >
                <span
                  className="w-2 h-2 rounded-full animate-ping"
                  style={{
                    backgroundColor: "#ffffff",
                    boxShadow: "0 0 8px rgba(255,255,255,1)",
                  }}
                />
                DIRECTOR'S TOUR
              </span>
            )}
            <span
              style={{ color: "rgba(255, 255, 255, 0.85)" }}
              className="text-xs font-bold tracking-wide hidden sm:inline"
            >
              Room {currentIndex + 1} of {totalScenes}
            </span>
          </div>

          {/* Exit Button */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                uiSound.playHoverClick();
                onExit();
              }}
              title="Exit Director's Tour"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
              className="p-1.5 px-3 rounded-full border hover:bg-white/30 transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-sm font-semibold"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" style={{ color: "#ffffff" }} />
              <span style={{ color: "#ffffff" }}>Exit</span>
            </button>
          </div>
        </div>

        {/* Room Title & Highlight Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <h3
              style={{ color: "#ffffff" }}
              className="text-sm sm:text-base font-extrabold uppercase tracking-wider flex items-center gap-2 m-0"
            >
              <FontAwesomeIcon icon={faFilm} className="text-xs hidden sm:inline" style={{ color: "#ffffff" }} />
              <span style={{ color: "#ffffff" }}>{currentScene?.name || "Room Showcase"}</span>
            </h3>
            <p
              style={{ color: "rgba(255, 255, 255, 0.75)" }}
              className="text-xs line-clamp-1 mt-0.5 font-medium m-0"
            >
              {currentScene?.category || "360° Virtual Walkthrough"}
              {currentScene?.floorLevel ? ` • ${currentScene.floorLevel}` : ""}
            </p>
          </div>

          {/* Play/Pause & Skip Controls */}
          <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
            <button
              type="button"
              onClick={() => {
                uiSound.playHoverClick();
                onTogglePause();
              }}
              style={
                isPaused
                  ? {
                      backgroundColor: "#ffffff",
                      color: "#0a0a0a",
                      boxShadow: "0 0 20px rgba(255, 255, 255, 0.6)",
                    }
                  : {
                      backgroundColor: "rgba(255, 255, 255, 0.2)",
                      color: "#ffffff",
                      borderColor: "rgba(255, 255, 255, 0.35)",
                    }
              }
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all transform hover:scale-105 cursor-pointer ${
                !isPaused ? "border" : ""
              }`}
            >
              <FontAwesomeIcon
                icon={isPaused ? faPlay : faPause}
                className="text-xs"
                style={{ color: isPaused ? "#0a0a0a" : "#ffffff" }}
              />
              <span style={{ color: isPaused ? "#0a0a0a" : "#ffffff" }}>
                {isPaused ? "Resume Tour" : "Pause"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => {
                uiSound.playCameraSwoosh();
                onNextScene();
              }}
              title="Skip to next room"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.15)",
                color: "#ffffff",
                borderColor: "rgba(255, 255, 255, 0.3)",
              }}
              className="px-3.5 py-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 hover:bg-white/30 transition-all cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faForwardStep} className="text-xs" style={{ color: "#ffffff" }} />
              <span style={{ color: "#ffffff" }}>Next Room</span>
            </button>
          </div>
        </div>

        {/* Crisp Glowing White Progress Bar */}
        <div
          style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
          className="w-full h-1.5 rounded-full overflow-hidden"
        >
          <div
            style={{
              backgroundColor: "#ffffff",
              boxShadow: "0 0 10px rgba(255, 255, 255, 1)",
              width: `${Math.min(100, Math.max(0, progress))}%`,
            }}
            className="h-full transition-all duration-100 ease-linear rounded-full"
          />
        </div>
      </div>
    </div>
  );
}
