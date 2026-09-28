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