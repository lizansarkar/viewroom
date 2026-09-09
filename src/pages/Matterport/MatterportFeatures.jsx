import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faLocationDot,
  faBorderAll,
  faStairs,
  faXmark,
  faInfo,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";

function MatterportFeatures() {
  const [activeTab, setActiveTab] = useState("enter");
  const [activeSpot, setActiveSpot] = useState(null);

  // Live 3D Experience hotspots data
  const hotspots = [
    {
      id: 1,
      top: "35%",
      left: "25%",
      title: "Living Space Area",
      description:
        "Ceiling height: 3.2m. Spatial distance measured accurately.",
    },
    {
      id: 2,
      top: "55%",
      left: "65%",
      title: "Panoramic Glass Window",
      description: "Natural sunlight entry tracked across midday hours.",
    },
    {
      id: 3,
      top: "70%",
      left: "42%",
      title: "Hardwood Flooring",
      description: "Premium finish material verified via spatial twin scan.",
    },
  ];

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-16 overflow-hidden">
      
      {/* 1. FULL WIDTH LIVE MATTERPORT 3D CANVAS */}
      <div className="w-full mb-16 px-0">
        <div className="w-full aspect-[21/9] sm:aspect-[24/9] max-h-[680px] min-h-[300px] shadow-2xl relative overflow-hidden group">
          
          {/* Background 3D Interior Preview Image */}
          <img
            src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=2000&q=80"
            alt="Live 3D Tour Canvas"
            className="w-full h-full object-cover"
          />

          {/* Clickable Matterport Hotspots */}
          {hotspots.map((spot) => (
            <div
              key={spot.id}
              style={{ top: spot.top, left: spot.left }}
              className="absolute -translate-x-1/2 -translate-y-1/2 z-20"
            >
              <button
                onClick={() =>
                  setActiveSpot(activeSpot === spot.id ? null : spot.id)
                }
                className="relative flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-white/90 text-black shadow-lg hover:scale-110 transition-transform cursor-pointer"
              >
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
                <FontAwesomeIcon
                  icon={faInfo}
                  className="text-[10px] sm:text-xs text-black relative z-10"
                />
              </button>

              {/* Hotspot Info Popup */}
              {activeSpot === spot.id && (
                <div className="absolute top-10 left-1/2 -translate-x-1/2 w-52 sm:w-60 p-3.5 rounded-xl bg-zinc-950/90 text-white border border-zinc-700/80 shadow-2xl backdrop-blur-md z-30 animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex items-center justify-between mb-1.5">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                      {spot.title}
                    </h4>
                    <button
                      onClick={() => setActiveSpot(null)}
                      className="text-zinc-400 hover:text-white text-xs cursor-pointer"
                    >
                      <FontAwesomeIcon icon={faXmark} />
                    </button>
                  </div>
                  <p className="text-[11px] text-zinc-300 leading-normal">
                    {spot.description}
                  </p>
                </div>
              )}
            </div>
          ))}

          {/* Bottom Overlay Hint */}
          <div className="absolute bottom-4 left-4 sm:left-8 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[11px] text-zinc-300 font-medium">
            Interactive 3D Walkthrough Active
          </div>
        </div>
      </div>

      {/* 2. PRESENCE CONTENT SECTION */}
      <div className="max-w-4xl mx-auto px-6 sm:px-12 flex flex-col items-center md:gap-3">
        
        {/* Top Header Tag */}
        <span className="text-[11px] font-black uppercase tracking-[0.3em] text-[var(--app-text-secondary)] mb-4">
          PRESENCE
        </span>

        {/* Main Title */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-center leading-[1.08] mb-5 text-[var(--app-text-primary)]">
          THE SPACE DOES NOT WAIT FOR YOU
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm md:text-base text-[var(--app-text-secondary)] font-medium text-center max-w-xl mb-12 sm:mb-16 leading-relaxed">
          You do not watch a video. You stand in the room and the room holds
          still while you decide where to look.
        </p>

        {/* Feature List with Separator Lines */}
        <div className="w-full border-t border-[var(--app-text-secondary)]/20">
          
          {/* Feature 1: NO DISTANCE */}
          <div className="py-7 sm:py-8 border-b border-[var(--app-text-secondary)]/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
            <div className="text-xl sm:text-2xl text-[var(--app-text-primary)] min-w-[32px] flex justify-start sm:justify-center">
              <FontAwesomeIcon icon={faLocationDot} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-[var(--app-text-primary)] mb-1">
                NO DISTANCE
              </h3>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] font-medium leading-relaxed">
                The far wall is not a backdrop. It is a wall you can walk to.
              </p>
            </div>
          </div>

          {/* Feature 2: NO HURRY */}
          <div className="py-7 sm:py-8 border-b border-[var(--app-text-secondary)]/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
            <div className="text-xl sm:text-2xl text-[var(--app-text-primary)] min-w-[32px] flex justify-start sm:justify-center">
              <FontAwesomeIcon icon={faBorderAll} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-[var(--app-text-primary)] mb-1">
                NO HURRY
              </h3>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] font-medium leading-relaxed">
                Stay in the kitchen until the light changes. No one will ask you
                to move along.
              </p>
            </div>
          </div>

          {/* Feature 3: NO NOISE */}
          <div className="py-7 sm:py-8 border-b border-[var(--app-text-secondary)]/20 flex flex-col sm:flex-row items-start sm:items-center gap-4 sm:gap-10">
            <div className="text-xl sm:text-2xl text-[var(--app-text-primary)] min-w-[32px] flex justify-start sm:justify-center">
              <FontAwesomeIcon icon={faStairs} />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-black uppercase tracking-wider text-[var(--app-text-primary)] mb-1">
                NO NOISE
              </h3>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] font-medium leading-relaxed">
                There is no music and no voice. Only the floor under your feet
                and the quiet of an empty room.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Switcher Pill */}
        <div className="mt-12 flex items-center">
          <Button
            variant={activeTab === "enter" ? "primary" : "neutral"}
            onClick={() => setActiveTab("enter")}
            className="!px-6 !py-2 !text-xs !font-bold cursor-pointer"
          >
            Enter
          </Button>

          <Button
            variant={activeTab === "look" ? "primary" : "neutral"}
            onClick={() => setActiveTab("look")}
            className="!px-6 !py-2 !text-xs !font-bold cursor-pointer"
          >
            Look
          </Button>
        </div>

      </div>
    </section>
  );
}

export default MatterportFeatures;