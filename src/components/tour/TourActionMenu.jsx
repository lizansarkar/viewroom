import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBars,
  faXmark,
  faMicrophone,
  faEye,
  faEyeSlash,
  faUsers,
  faCalendarCheck,
  faShareNodes,
  faVrCardboard,
  faVolumeHigh,
  faVolumeMute,
  faExpand,
  faCompress,
  faFilm,
  faPlay,
} from "@fortawesome/free-solid-svg-icons";
import { uiSound } from "../../utils/tourSoundEngine";

export default function TourActionMenu({
  isMenuOpen,
  setIsMenuOpen,
  isListening,
  onToggleVoiceAssistant,
  showHotspots,
  onToggleHotspots,
  onOpenLiveTour,
  onOpenLeadForm,
  onOpenShareModal,
  onToggleFullscreen,
  isFullscreen,
  isMuted,
  onToggleMute,
  isAutoPilot,
  onToggleAutoPilot,
}) {
  return (
    <div className="absolute top-5 right-5 z-30 flex flex-col items-center gap-3 pointer-events-auto">
      {isMenuOpen ? (
        <div className="flex flex-col items-center gap-3 animate-in fade-in zoom-in-95 duration-200">
          <button
            type="button"
            onClick={() => {
              uiSound.playHoverClick();
              setIsMenuOpen(false);
            }}
            onMouseEnter={() => uiSound.playHoverClick()}
            title="Close Action Menu"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/20 hover:bg-white/35 backdrop-blur-md border-2 border-white/80 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
          >
            <FontAwesomeIcon icon={faXmark} className="text-lg" />
          </button>

          {/* VOICE AI MICROPHONE TRIGGER BUTTON */}
          <button
            type="button"
            onClick={onToggleVoiceAssistant}
            onMouseEnter={() => uiSound.playHoverClick()}
            title={isListening ? "Stop Listening" : "Voice AI Spatial Guide"}
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md border flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer ${
              isListening
                ? "bg-white text-black border-white shadow-[0_0_25px_rgba(255,255,255,1)] animate-bounce"
                : "bg-white/25 hover:bg-white/40 border-white/40 text-white"
            }`}
          >
            <FontAwesomeIcon icon={faMicrophone} className="text-base" />
            {isListening && (
              <span className="absolute -inset-1 rounded-full border-2 border-white animate-ping"></span>
            )}
          </button>

          {/* CINEMATIC AUTO-PILOT / DIRECTOR'S TOUR BUTTON */}
          <button
            type="button"
            onClick={() => {
              uiSound.playHoverClick();
              if (onToggleAutoPilot) onToggleAutoPilot();
            }}
            onMouseEnter={() => uiSound.playHoverClick()}
            title={
              isAutoPilot
                ? "Exit Director's Tour"
                : "Play Cinematic Tour (Director's Tour / Auto-Pilot)"
            }
            className={`relative w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md border flex items-center justify-center shadow-xl transition-all duration-300 hover:scale-110 cursor-pointer ${
              isAutoPilot
                ? "bg-gradient-to-tr from-cyan-500 to-indigo-600 text-white border-cyan-300 shadow-[0_0_25px_rgba(6,182,212,0.8)] animate-pulse"
                : "bg-white/25 hover:bg-white/40 border-white/40 text-white"
            }`}
          >
            <FontAwesomeIcon icon={isAutoPilot ? faPlay : faFilm} className="text-base" />
            {isAutoPilot && (
              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-3 w-3 bg-cyan-500"></span>
              </span>
            )}
          </button>

          {/* TOGGLE HOTSPOTS VISIBILITY BUTTON */}
          <button
            type="button"
            onClick={() => {
              uiSound.playHoverClick();
              onToggleHotspots();
            }}
            onMouseEnter={() => uiSound.playHoverClick()}
            title={showHotspots ? "Hide Hotspots" : "Show Hotspots"}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md border flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer ${
              showHotspots
                ? "bg-white/25 hover:bg-white/40 border-white/40 text-white"
                : "bg-amber-500/80 text-white border-amber-400 font-bold"
            }`}
          >
            <FontAwesomeIcon icon={showHotspots ? faEye : faEyeSlash} className="text-base" />
          </button>

          {/* LIVE GUIDED TOUR CO-PRESENCE BUTTON */}
          <button
            type="button"
            onClick={() => {
              uiSound.playHoverClick();
              onOpenLiveTour();
            }}
            onMouseEnter={() => uiSound.playHoverClick()}
            title="Start Live Co-Presence Guided Tour"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
          >
            <FontAwesomeIcon icon={faUsers} className="text-base" />
          </button>

          {/* IN-ROOM LEAD CAPTURE BUTTON */}
          <button
            type="button"
            onClick={() => {
              uiSound.playHoverClick();
              onOpenLeadForm();
            }}
            onMouseEnter={() => uiSound.playHoverClick()}
            title="Schedule Private Tour / Inquire Price"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
          >
            <FontAwesomeIcon icon={faCalendarCheck} className="text-base" />
          </button>

          {/* SHARE & EMBED BUTTON */}
          <button
            type="button"
            onClick={() => {
              uiSound.playHoverClick();
              onOpenShareModal();
            }}
            onMouseEnter={() => uiSound.playHoverClick()}
            title="Share Tour Link & Embed"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
          >
            <FontAwesomeIcon icon={faShareNodes} className="text-base" />
          </button>

          {/* VR HEADSET BUTTON */}
          <button
            type="button"
            onClick={() => {
              uiSound.playHoverClick();
              onToggleFullscreen();
            }}
            onMouseEnter={() => uiSound.playHoverClick()}
            title="VR Mode / Headset"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
          >
            <FontAwesomeIcon icon={faVrCardboard} className="text-base" />
          </button>

          {/* AUDIO MUTE TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => {
              uiSound.playHoverClick();
              onToggleMute();
            }}
            onMouseEnter={() => uiSound.playHoverClick()}
            title={isMuted ? "Unmute Sound" : "Mute Sound"}
            className={`w-11 h-11 sm:w-12 sm:h-12 rounded-full backdrop-blur-md border flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer ${
              !isMuted
                ? "bg-white text-black border-white font-bold"
                : "bg-white/25 hover:bg-white/40 border-white/40 text-white"
            }`}
          >
            <FontAwesomeIcon icon={isMuted ? faVolumeMute : faVolumeHigh} className="text-base" />
          </button>

          {/* FULLSCREEN TOGGLE BUTTON */}
          <button
            type="button"
            onClick={() => {
              uiSound.playHoverClick();
              onToggleFullscreen();
            }}
            onMouseEnter={() => uiSound.playHoverClick()}
            title="Toggle Fullscreen"
            className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border border-white/40 text-white flex items-center justify-center shadow-xl transition-transform hover:scale-110 cursor-pointer"
          >
            <FontAwesomeIcon icon={isFullscreen ? faCompress : faExpand} className="text-base" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => {
            uiSound.playHoverClick();
            setIsMenuOpen(true);
          }}
          onMouseEnter={() => uiSound.playHoverClick()}
          title="Open Action Menu"
          className="w-12 h-12 rounded-full bg-white/25 hover:bg-white/40 backdrop-blur-md border-2 border-white/80 text-white flex items-center justify-center shadow-2xl transition-transform hover:scale-110 cursor-pointer"
        >
          <FontAwesomeIcon icon={faBars} className="text-lg" />
        </button>
      )}
    </div>
  );
}
