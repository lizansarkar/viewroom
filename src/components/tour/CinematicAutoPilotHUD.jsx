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
      {/* Top Helper Badge: Manual Touch Notification */}
      <div className="mb-3 animate-in fade-in slide-in-from-bottom-2 duration-300">
        {isPaused ? (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/85 border border-white/35 text-white font-medium text-xs shadow-2xl backdrop-blur-xl pointer-events-auto">
            <FontAwesomeIcon icon={faHandPointer} className="text-xs text-white" />
            <span>Manual Control Active • Drag freely or click Resume</span>
          </div>
        ) : (
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-black/70 border border-white/20 text-white/85 font-medium text-xs backdrop-blur-xl shadow-lg">
            <FontAwesomeIcon icon={faHandPointer} className="text-[10px] text-white/70" />
            <span>Drag mouse/touch anytime to pause and explore manually</span>
          </div>
        )}
      </div>

      {/* Main Frosted Glass Luxury Console */}
      <div className="w-full max-w-2xl bg-black/80 backdrop-blur-2xl border border-white/20 text-white rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.85)] p-4 sm:p-5 pointer-events-auto transition-all duration-300">
        {/* Header Row: Live Auto-Pilot Tag & Exit Button */}
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            {isPaused ? (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase bg-white/10 text-white/80 border border-white/20">
                <span className="w-2 h-2 rounded-full bg-white/60" />
                PAUSED
              </span>
            ) : (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold tracking-wider uppercase bg-white/15 text-white border border-white/30">
                <span className="w-2 h-2 rounded-full bg-white shadow-[0_0_8px_rgba(255,255,255,1)] animate-ping" />
                DIRECTOR'S TOUR
              </span>
            )}
            <span className="text-xs text-white/60 font-semibold hidden sm:inline">
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
              className="p-1.5 px-3 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-white/80 hover:text-white transition-all text-xs flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faXmark} className="text-xs" />
              <span className="hidden sm:inline font-semibold">Exit</span>
            </button>
          </div>
        </div>

        {/* Room Title & Highlight Info */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-3">
          <div>
            <h3 className="text-sm sm:text-base font-extrabold uppercase tracking-wider text-white flex items-center gap-2">
              <FontAwesomeIcon icon={faFilm} className="text-white/80 text-xs hidden sm:inline" />
              {currentScene?.name || "Room Showcase"}
            </h3>
            <p className="text-xs text-white/60 line-clamp-1 mt-0.5 font-medium">
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
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 shadow-lg transition-all transform hover:scale-105 cursor-pointer ${
                isPaused
                  ? "bg-white text-black hover:bg-white/90 shadow-[0_0_20px_rgba(255,255,255,0.4)]"
                  : "bg-white/15 hover:bg-white/25 text-white border border-white/25"
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
              className="px-3 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer shadow-sm"
            >
              <FontAwesomeIcon icon={faForwardStep} className="text-xs" />
              <span className="hidden sm:inline">Next Room</span>
            </button>
          </div>
        </div>

        {/* Crisp White Progress Bar */}
        <div className="w-full bg-white/15 h-1.5 rounded-full overflow-hidden">
          <div
            className="h-full bg-white shadow-[0_0_10px_rgba(255,255,255,0.9)] transition-all duration-100 ease-linear rounded-full"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      </div>
    </div>
  );
}
