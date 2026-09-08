import React, { useState } from "react";
import Button from "../../components/reuseable/Button";

function WhatIsMatterport() {
  const [activeTab, setActiveTab] = useState("enter");

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-20 px-6 sm:px-12 lg:px-20 overflow-hidden">
      <div className="max-w-7xl mx-auto flex flex-col items-center gap-0 md:gap-4">
        {/* Top Header Tag */}
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--app-text-secondary)] mb-4">
          INSIDE
        </span>

        {/* Main Title */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-center max-w-4xl leading-[1.08] mb-5 text-[var(--app-text-primary)]">
          THE DOOR OPENS BEFORE YOU ARRIVE
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-[var(--app-text-secondary)] font-medium text-center max-w-lg mb-16 leading-relaxed">
          A photograph shows you a room. ViewRoom puts you in it. Walk the floor
          and know the place.
        </p>

        {/* Main Grid Section (Left 2 Features - Center Video - Right 2 Features) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center w-full max-w-6xl">
          {/* LEFT FEATURES */}
          <div className="lg:col-span-3 flex flex-col gap-16 items-center text-center">
            {/* Feature 1: Real Scale */}
            <div className="flex flex-col items-center text-center max-w-xs">
              {/* Scale / Hourglass Style Icon */}
              <div className="mb-4 text-[var(--app-text-primary)]">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M12 3v3m0 12v3M4.5 7.5h15m-12 9h9M6 7.5l6 4.5 6-4.5M6 16.5l6-4.5 6 4.5"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 text-[var(--app-text-primary)]">
                REAL SCALE
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)] font-medium leading-relaxed">
                See the true height of a ceiling and the actual distance between
                walls.
              </p>
            </div>

            {/* Feature 2: Real Light */}
            <div className="flex flex-col items-center text-center max-w-xs">
              {/* Light Rays / Sunlight Style Icon */}
              <div className="mb-4 text-[var(--app-text-primary)]">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 3.75l16.5 16.5M3.75 9.75l10.5 10.5M3.75 15.75l4.5 4.5M9.75 3.75l10.5 10.5M15.75 3.75l4.5 4.5"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 text-[var(--app-text-primary)]">
                REAL LIGHT
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)] font-medium leading-relaxed">
                Watch how the sun falls through a window at noon.
              </p>
            </div>
          </div>

          {/* CENTER MEDIA (YOUTUBE EMBED) */}
          <div className="lg:col-span-6 w-full flex justify-center">
            <div className="relative w-full aspect-video rounded-xl overflow-hidden shadow-lg">
              {/* YouTube Video iframe */}
              <iframe
                className="w-full h-full object-cover scale-125"
                src="https://www.youtube.com/embed/FXDjMJJDbqo?autoplay=1&mute=1&loop=1&playlist=FXDjMJJDbqo&controls=0&showinfo=0&rel=0&modestbranding=1"
                title="Matterport Demo Video"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />

              {/* Top Right / Hover YouTube Overlay Link Button */}
              <a
                href="https://www.youtube.com/watch?v=FXDjMJJDbqo"
                target="_blank"
                rel="noopener noreferrer"
                className="absolute bottom-4 right-4 bg-white/70 hover:bg-white/20 text-white text-xs font-semibold px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-md transition-all duration-300 flex items-center gap-2 shadow-lg z-10 cursor-pointer"
              >
                <svg
                  className="w-4 h-4 fill-current text-red-500 group-hover:text-white transition-colors"
                  viewBox="0 0 24 24"
                >
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
                Watch on YouTube
              </a>
            </div>
          </div>

          {/* RIGHT FEATURES */}
          <div className="lg:col-span-3 flex flex-col gap-16 items-center text-center">
            {/* Feature 3: Real Flow */}
            <div className="flex flex-col items-center text-center max-w-xs">
              {/* Compass / Location Route Icon */}
              <div className="mb-4 text-[var(--app-text-primary)]">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 text-[var(--app-text-primary)]">
                REAL FLOW
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)] font-medium leading-relaxed">
                Move from room to room and understand how a life fits.
              </p>
            </div>

            {/* Feature 4: Real Silence */}
            <div className="flex flex-col items-center text-center max-w-xs">
              {/* Mute / Silence Box Icon */}
              <div className="mb-4 text-[var(--app-text-primary)]">
                <svg
                  className="w-8 h-8"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z"
                  />
                </svg>
              </div>
              <h3 className="text-sm sm:text-base font-black uppercase tracking-wider mb-2 text-[var(--app-text-primary)]">
                REAL SILENCE
              </h3>
              <p className="text-xs text-[var(--app-text-secondary)] font-medium leading-relaxed">
                No agent talking. No music. Just the space and you.
              </p>
            </div>
          </div>
        </div>

        {/* Bottom Switcher Pill using Custom Button */}
        <div className="mt-10 flex items-center gap-3">
          <Button
            variant={activeTab === "enter" ? "primary" : "secondary"}
            onClick={() => setActiveTab("enter")}
            className="!px-6 !py-2 !text-xs !font-bold"
          >
            Enter
          </Button>

          <Button
            variant={activeTab === "look" ? "neutral" : "neutral"}
            onClick={() => setActiveTab("look")}
            className="!px-6 !py-2 !text-xs !font-bold"
          >
            Look <span>&rarr;</span>
          </Button>
        </div>
      </div>
    </section>
  );
}

export default WhatIsMatterport;
