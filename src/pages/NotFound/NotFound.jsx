import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCompass, faArrowLeft, faHouse } from "@fortawesome/free-solid-svg-icons";

export default function NotFound() {
  return (
    <div className="min-h-[75vh] w-full flex items-center justify-center px-4 py-16 bg-[var(--app-bg)] text-[var(--app-text-primary)]">
      <div className="max-w-lg w-full text-center p-8 rounded-2xl border border-[var(--app-border)] bg-[var(--app-card-bg)] shadow-2xl backdrop-blur-xl">
        <div className="relative inline-flex items-center justify-center w-20 h-20 mb-6 rounded-full bg-white/5 border border-white/10">
          <FontAwesomeIcon icon={faCompass} className="text-3xl text-white/80 animate-spin" style={{ animationDuration: "12s" }} />
          <span className="absolute -top-1 -right-1 px-2 py-0.5 text-[10px] font-black rounded-full bg-red-500/20 text-red-400 border border-red-500/30">
            404
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-[var(--app-text-primary)]">
          Lost in Space
        </h1>
        <p className="text-sm text-[var(--app-text-secondary)] mb-8 leading-relaxed">
          The 360° coordinate or room you are looking for does not exist or has been relocated to another dimension.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black font-semibold text-sm hover:bg-neutral-200 transition-all shadow-md active:scale-95"
          >
            <FontAwesomeIcon icon={faHouse} className="text-xs" />
            <span>Back to Home</span>
          </Link>
          <Link
            to="/explore"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl border border-[var(--app-border)] bg-white/5 text-[var(--app-text-primary)] hover:bg-white/10 font-semibold text-sm transition-all active:scale-95"
          >
            <FontAwesomeIcon icon={faArrowLeft} className="text-xs" />
            <span>Explore Tours</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
