import React, { useRef, useEffect, useState } from "react";
import gsap from "gsap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faExpand,
  faCompress,
  faHandPointer,
  faXmark,
} from "@fortawesome/free-solid-svg-icons";

function VirtualGalleryCanvas() {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const galleryItems = [
    {
      id: 1,
      title: "LUXURY PENTHOUSE",
      location: "MINATO, TOKYO",
      tag: "ARCHITECTURE",
      image:
        "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 2,
      title: "MINIMALIST RESIDENCE",
      location: "BERLIN, GERMANY",
      tag: "INTERIOR",
      image:
        "https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 3,
      title: "MODERN PAVILION",
      location: "ZURICH, SWITZERLAND",
      tag: "SPATIAL SCULPTURE",
      image:
        "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 4,
      title: "GLASS VILLA",
      location: "LOS ANGELES, USA",
      tag: "EXTERIOR",
      image:
        "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 5,
      title: "URBAN TOWER",
      location: "SEOUL, SOUTH KOREA",
      tag: "CONSTRUCTION",
      image:
        "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80",
    },
    {
      id: 6,
      title: "LOFT STUDIO",
      location: "NEW YORK, USA",
      tag: "SPATIAL ART",
      image:
        "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80",
    },
  ];

  // Mouse Drag Scrolling Setup
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - trackRef.current.offsetLeft);
    setScrollLeft(trackRef.current.scrollLeft);
  };

  const handleMouseLeave = () => {
    setIsDragging(false);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - trackRef.current.offsetLeft;
    const walk = (x - startX) * 1.8;
    trackRef.current.scrollLeft = scrollLeft - walk;
  };

  return (
    <section className="relative w-full min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-16 px-4 sm:px-8 flex flex-col justify-between overflow-hidden select-none">
      
      {/* TOP HEADER */}
      <div className="max-w-6xl mx-auto w-full text-center z-10 my-4">
        <span className="text-[10px] sm:text-[11px] font-black uppercase tracking-[0.3em] text-[var(--app-text-secondary)] mb-2 block">
          3D VIRTUAL EXHIBITION
        </span>
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-[var(--app-text-primary)] mb-3">
          GALLERY CANVAS
        </h1>
        <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] font-medium flex items-center justify-center gap-2">
          <FontAwesomeIcon icon={faHandPointer} className="text-xs animate-bounce" />
          Drag or Scroll horizontally to explore the exhibition hall
        </p>
      </div>

      {/* HORIZONTAL 3D CANVAS TRACK */}
      <div
        ref={trackRef}
        onMouseDown={handleMouseDown}
        onMouseLeave={handleMouseLeave}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        className="w-full flex items-center gap-8 sm:gap-16 lg:gap-24 overflow-x-auto scrollbar-hide py-12 px-8 sm:px-20 cursor-grab active:cursor-grabbing perspective-[1200px]"
        style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
      >
        {galleryItems.map((item, index) => (
          <div
            key={item.id}
            onClick={() => setSelectedPhoto(item)}
            className="relative flex-shrink-0 w-[260px] sm:w-[380px] md:w-[460px] aspect-[3/4] bg-neutral-900 border border-[var(--app-text-secondary)]/20 shadow-2xl transition-all duration-500 hover:scale-[1.03] group cursor-pointer"
            style={{
              transformStyle: "preserve-3d",
            }}
          >
            {/* FRAME IMAGE */}
            <div className="w-full h-full relative overflow-hidden bg-black">
              <img
                src={item.image}
                alt={item.title}
                className="w-full h-full object-cover opacity-85 transition-transform duration-700 group-hover:scale-105"
              />
              
              {/* TOP TAG */}
              <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1 border border-white/10 text-[10px] font-extrabold text-white uppercase tracking-widest">
                {item.tag}
              </div>

              {/* OVERLAY DETAILS */}
              <div className="absolute inset-x-0 bottom-0 p-6 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end">
                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest mb-1">
                  {item.location}
                </span>
                <h3 className="text-lg sm:text-xl font-black text-white uppercase tracking-tight mb-3">
                  {item.title}
                </h3>
                
                <div className="flex items-center gap-2 text-[11px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <FontAwesomeIcon icon={faExpand} className="text-xs" />
                  <span>VIEW IN FULLSCREEN</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* FULLSCREEN LIGHTBOX MODAL */}
      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/95 backdrop-blur-lg flex items-center justify-center p-4 sm:p-10">
          <button
            onClick={() => setSelectedPhoto(null)}
            className="absolute top-6 right-6 text-white text-2xl p-3 hover:opacity-75 transition-opacity cursor-pointer z-50"
          >
            <FontAwesomeIcon icon={faXmark} />
          </button>

          <div className="relative max-w-5xl w-full max-h-[85vh] flex flex-col md:flex-row bg-neutral-900 border border-neutral-800 overflow-hidden shadow-2xl">
            <div className="w-full md:w-3/4 h-[50vh] md:h-auto bg-black relative">
              <img
                src={selectedPhoto.image}
                alt={selectedPhoto.title}
                className="w-full h-full object-contain"
              />
            </div>

            <div className="w-full md:w-1/4 p-8 flex flex-col justify-between bg-neutral-950 text-white border-t md:border-t-0 md:border-l border-neutral-800">
              <div>
                <span className="text-[10px] font-extrabold tracking-widest text-neutral-400 block mb-2">
                  {selectedPhoto.tag}
                </span>
                <h2 className="text-2xl font-black uppercase tracking-tight mb-2">
                  {selectedPhoto.title}
                </h2>
                <p className="text-xs text-neutral-400 font-medium mb-6">
                  {selectedPhoto.location}
                </p>
              </div>

              <button
                onClick={() => setSelectedPhoto(null)}
                className="w-full py-3 bg-white text-black font-extrabold text-xs uppercase tracking-wider hover:bg-neutral-200 transition-colors cursor-pointer"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}

      {/* FOOTER STATS */}
      <div className="max-w-6xl mx-auto w-full flex items-center justify-between border-t border-[var(--app-text-secondary)]/10 pt-6 my-2 text-[11px] font-bold uppercase tracking-widest text-[var(--app-text-secondary)]">
        <span>01 / VIRTUAL EXHIBITION</span>
        <span>DRAG TO ROTATE & EXPLORE</span>
      </div>

    </section>
  );
}

export default VirtualGalleryCanvas;