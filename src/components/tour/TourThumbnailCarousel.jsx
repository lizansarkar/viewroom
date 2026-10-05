import React, { useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronLeft, faChevronRight } from "@fortawesome/free-solid-svg-icons";
import { uiSound } from "../../utils/tourSoundEngine";

export default function TourThumbnailCarousel({
  tourNodes = [],
  currentPanoramaId,
  onSelectNode,
}) {
  const scrollRef = useRef(null);

  const scrollThumbnails = (direction) => {
    if (scrollRef.current) {
      const amount = direction === "left" ? -280 : 280;
      scrollRef.current.scrollBy({ left: amount, behavior: "smooth" });
    }
  };

  return (
    <div className="absolute bottom-4 inset-x-4 sm:inset-x-8 z-20 flex items-center justify-center pointer-events-none">
      <div className="relative w-full max-w-5xl flex items-center justify-between pointer-events-auto">
        <button
          type="button"
          onClick={() => {
            uiSound.playHoverClick();
            scrollThumbnails("left");
          }}
          onMouseEnter={() => uiSound.playHoverClick()}
          className="w-9 h-9 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 flex items-center justify-center text-sm shrink-0 mr-2 cursor-pointer shadow-xl transition-colors backdrop-blur-md"
        >
          <FontAwesomeIcon icon={faChevronLeft} />
        </button>

        <div
          ref={scrollRef}
          className="flex items-center gap-3.5 overflow-x-auto scrollbar-none py-2 px-1 scroll-smooth w-full justify-start sm:justify-center"
        >
          {tourNodes.map((node) => {
            const isActive = node.id === currentPanoramaId;
            return (
              <button
                type="button"
                key={node.id}
                onClick={() => {
                  uiSound.playCameraSwoosh();
                  onSelectNode(node.id);
                }}
                onMouseEnter={() => uiSound.playHoverClick()}
                className="flex flex-col items-center shrink-0 group cursor-pointer"
              >
                <div
                  className={`relative w-28 sm:w-36 h-16 sm:h-20 rounded-2xl overflow-hidden transition-all duration-200 ${
                    isActive
                      ? "border-2 border-white shadow-[0_0_20px_rgba(255,255,255,0.7)] scale-105"
                      : "border border-white/30 opacity-75 group-hover:opacity-100 group-hover:border-white/70"
                  }`}
                >
                  <img
                    src={node.thumbnail}
                    alt={node.name}
                    className="w-full h-full object-cover"
                  />
                  {isActive && (
                    <div className="absolute inset-0 bg-white/10 pointer-events-none" />
                  )}
                </div>

                <span
                  className={`text-[11px] sm:text-xs font-extrabold uppercase tracking-wider mt-2 transition-colors ${
                    isActive
                      ? "text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]"
                      : "text-white/75 group-hover:text-white"
                  }`}
                >
                  {node.name}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => {
            uiSound.playHoverClick();
            scrollThumbnails("right");
          }}
          onMouseEnter={() => uiSound.playHoverClick()}
          className="w-9 h-9 rounded-full bg-black/75 hover:bg-black/95 text-white border border-white/20 flex items-center justify-center text-sm shrink-0 ml-2 cursor-pointer shadow-xl transition-colors backdrop-blur-md"
        >
          <FontAwesomeIcon icon={faChevronRight} />
        </button>
      </div>
    </div>
  );
}
