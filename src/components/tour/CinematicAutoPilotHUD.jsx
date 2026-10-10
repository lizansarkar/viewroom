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
    <div className="absolute inset-x-0 bottom-6 sm:bottom-8 z-40 flex flex-col items-center pointer-events-none px-4">
      {/* Top Helper Badge: Manual Touch Notification */}
      <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {isPaused ? (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-500/90 text-black font-semibold text-xs shadow-lg backdrop-blur-md pointer-events-auto animate-pulse">
            <FontAwesomeIcon icon={faHandPointer} className="text-xs" />
            <span>Manual Mode Active • Drag screen freely or click Resume</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/60 border border-white/20 text-white/80 font-medium text-xs backdrop-blur-md">
            <FontAwesomeIcon icon={faHandPointer} className="text-[10px] text-cyan-400" />
            <span>Drag mouse/touch anytime to pause and explore manually</span>
          </div>
        )}
      </div>

      {/* Main Glassmorphic Cinematic Console */}
      <div className="w-full max-w-2xl bg-black/85 backdrop-blur-xl border border-white/20 text-white rounded-2xl shadow-2xl p-4 sm:p-5 pointer-events-auto transition-all duration-300">
        {/* Header Row: Live Auto-Pilot Tag & Exit Button */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {isPaused ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-400 border border-amber-500/40">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                PAUSED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold tracking-wider uppercase bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                DIRECTOR'S TOUR
              </span>
            )}
            <span className="text-xs text-white/50 hidden sm:inline">
              Room {currentIndex + 1} of {totalScenes}
            </span>
          </div>

          {/* Room Counter + Exit */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => {
                uiSound.playHoverClick();
                onExit();
              }}
              title="Exit Cinematic Auto-Pilot"
              className="p-1.5 px-2.5 rounded-lg bg-white/10 hover:bg-white/20 text-white/80 hover:text-white transition-colors text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
              <span className="hidden sm:inline font-medium">Exit</span>
            </button>
          </div>
        </div>

        {/* Room Title & Highlight Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
          <div>
            <h3 className="text-base sm:text-lg font-bold tracking-tight text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faFilm} className="text-cyan-400 text-sm hidden sm:inline" />
              {currentScene?.name || "Room Showcase"}
            </h3>
            <p className="text-xs text-white/60 line-clamp-1 mt-0.5">
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
              className={`px-4 py-2 rounded-xl font-semibold text-xs flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 cursor-pointer ${
                isPaused
                  ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/25"
                  : "bg-white/20 hover:bg-white/30 text-white border border-white/20"
              }`}
            >
              <FontAwesomeIcon icon={isPaused ? faPlay : faPause} className="text-xs" />
              <span>{isPaused ? "Resume Tour" : "Pause"}</span>
            </button>

            <button
              type="button"
              onClick={() => {
                uiSound.playCameraSwoosh();
                onNextScene();
              }}
              title="Skip to next room"
              className="p-2 sm:px-3 sm:py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-white/90 hover:text-white text-xs flex items-center gap-1.5 transition-all cursor-pointer"
            >
              <FontAwesomeIcon icon={faForwardStep} className="text-xs" />
              <span className="hidden sm:inline font-medium">Next Room</span>
            </button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-100 ease-linear rounded-full ${
              isPaused
                ? "bg-amber-400"
                : "bg-gradient-to-r from-cyan-400 via-sky-400 to-indigo-500"
            }`}
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    </div>
  );
}

