import React, { useState, useRef } from "react";
import Button from "../../components/reuseable/Button";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faChevronLeft,
  faChevronUp,
  faChevronDown,
  faChevronRight,
  faLocationDot,
  faMap,
} from "@fortawesome/free-solid-svg-icons";

// Panoramic rooms dataset with hotspots connecting rooms
const TOUR_ROOMS = [
  {
    id: "living",
    name: "Living Room",
    sqft: "1,200 sq ft",
    floor: "Floor 42",
    panorama: "https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&q=80&w=1600",
    hotspots: [
      { id: 1, targetRoom: "kitchen", label: "Walk to Kitchen ➔", x: 72, y: 48 },
      { id: 2, targetRoom: "balcony", label: "View Balcony ➔", x: 28, y: 40 },
    ],
  },
  {
    id: "kitchen",
    name: "Chef's Kitchen",
    sqft: "450 sq ft",
    floor: "Floor 42",
    panorama: "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=1600",
    hotspots: [
      { id: 1, targetRoom: "living", label: "Back to Living Room ➔", x: 25, y: 52 },
      { id: 2, targetRoom: "suite", label: "Master Suite ➔", x: 78, y: 45 },
    ],
  },
  {
    id: "suite",
    name: "Master Suite",
    sqft: "680 sq ft",
    floor: "Floor 42",
    panorama: "https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&q=80&w=1600",
    hotspots: [
      { id: 1, targetRoom: "kitchen", label: "To Kitchen ➔", x: 20, y: 50 },
      { id: 2, targetRoom: "balcony", label: "Private Terrace ➔", x: 82, y: 42 },
    ],
  },
  {
    id: "balcony",
    name: "Skyline Balcony",
    sqft: "320 sq ft",
    floor: "Floor 42",
    panorama: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=1600",
    hotspots: [
      { id: 1, targetRoom: "living", label: "Enter Living Room ➔", x: 50, y: 58 },
    ],
  },
];

function VirtualTourViewer() {
  const [currentRoomIndex, setCurrentRoomIndex] = useState(0);
  const [panX, setPanX] = useState(0);
  const [panY, setPanY] = useState(0);
  const [showHotspots, setShowHotspots] = useState(true);
  const [showMinimap, setShowMinimap] = useState(true);
  const [isDragging, setIsDragging] = useState(false);

  const dragStartRef = useRef({ x: 0, y: 0 });
  const panStartRef = useRef({ x: 0, y: 0 });

  const activeRoom = TOUR_ROOMS[currentRoomIndex];

  // Mouse / Touch drag handlers for 360 pan
  const handleMouseDown = (e) => {
    setIsDragging(true);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    dragStartRef.current = { x: clientX, y: clientY };
    panStartRef.current = { x: panX, y: panY };
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const clientY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
    const deltaX = clientX - dragStartRef.current.x;
    const deltaY = clientY - dragStartRef.current.y;

    // Pan bounds
    const newPanX = Math.max(-250, Math.min(250, panStartRef.current.x + deltaX * 0.8));
    const newPanY = Math.max(-80, Math.min(80, panStartRef.current.y + deltaY * 0.5));

    setPanX(newPanX);
    setPanY(newPanY);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Navigate directly to room by ID
  const goToRoomById = (id) => {
    const idx = TOUR_ROOMS.findIndex((r) => r.id === id);
    if (idx !== -1) {
      setCurrentRoomIndex(idx);
      setPanX(0);
      setPanY(0);
    }
  };

  // Pan helper buttons
  const nudgePan = (dx, dy) => {
    setPanX((prev) => Math.max(-250, Math.min(250, prev + dx)));
    setPanY((prev) => Math.max(-80, Math.min(80, prev + dy)));
  };

  return (
    <div className="w-full max-w-5xl mx-auto flex flex-col items-center select-none">
      
      {/* Room Selector Navigation Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6 z-10">
        {TOUR_ROOMS.map((room, idx) => {
          const isActive = currentRoomIndex === idx;
          return (
            <button
              type="button"
              key={room.id}
              onClick={() => {
                setCurrentRoomIndex(idx);
                setPanX(0);
                setPanY(0);
              }}
              className={`btn btn-sm sm:btn-md rounded-md font-heading text-[11px] sm:text-xs tracking-wide uppercase font-semibold px-4 sm:px-5 border-none transition-colors duration-200 ${
                isActive
                  ? "bg-base-content text-base-100 hover:bg-base-content hover:text-base-100"
                  : "bg-base-200 text-base-content hover:bg-base-300"
              }`}
            >
              {room.name}
            </button>
          );
        })}
      </div>

      {/* Main 360 Tour Viewport Container */}
      <div
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="relative w-full h-[380px] sm:h-[480px] md:h-[540px] rounded-3xl overflow-hidden flex items-center justify-center cursor-grab active:cursor-grabbing"
      >
        {/* Panoramic Layer with Pan Matrix */}
        <div
          className="absolute inset-0 w-[140%] h-[140%] -top-[20%] -left-[20%] transition-transform duration-100 ease-out"
          style={{
            transform: `translate3d(${panX}px, ${panY}px, 0px) scale(1.15)`,
          }}
        >
          <img
            src={activeRoom.panorama}
            alt={activeRoom.name}
            className="w-full h-full object-cover filter brightness-[0.95]"
          />
        </div>

        {/* Room Navigation Hotspots */}
        {showHotspots &&
          activeRoom.hotspots.map((hs) => (
            <div
              key={hs.id}
              style={{
                top: `${hs.y}%`,
                left: `${hs.x}%`,
                transform: `translate3d(${panX * 0.4}px, ${panY * 0.4}px, 0px)`,
              }}
              className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
            >
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goToRoomById(hs.targetRoom);
                }}
                className="group flex items-center gap-2 bg-black/75 hover:bg-black/95 text-white border border-white/30 hover:border-cyan-400 px-3.5 py-2 rounded-full shadow-2xl backdrop-blur-md transition-all duration-200 hover:scale-105"
              >
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                <span className="text-xs font-bold tracking-wide uppercase">
                  {hs.label}
                </span>
              </button>
            </div>
          ))}

        {/* Active Room Title Tag */}
        <div className="absolute top-4 left-4 z-10 bg-black/70 backdrop-blur-md border border-white/15 rounded-full px-4 py-2 flex items-center gap-2.5 shadow-lg">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase text-white">
            360° VIRTUAL TOUR • {activeRoom.name} ({activeRoom.sqft})
          </span>
        </div>

        {/* Interactive Mini-Map Radar Overlay */}
        {showMinimap && (
          <div className="absolute bottom-4 left-4 z-10 hidden sm:flex flex-col bg-black/75 backdrop-blur-md border border-white/15 p-3 rounded-2xl shadow-2xl w-40">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-bold text-white/70 uppercase">FLOOR RADAR</span>
              <span className="text-[10px] font-semibold text-cyan-400">{activeRoom.floor}</span>
            </div>
            
            {/* Schematic Mini Map */}
            <div className="relative w-full h-24 bg-zinc-900/90 border border-white/10 rounded-lg p-2 flex flex-col justify-between">
              <div className="flex justify-between text-[9px] font-semibold text-white/60">
                <span className={currentRoomIndex === 0 ? "text-cyan-400 font-bold" : ""}>Living</span>
                <span className={currentRoomIndex === 1 ? "text-cyan-400 font-bold" : ""}>Kitchen</span>
              </div>
              <div className="flex justify-between text-[9px] font-semibold text-white/60">
                <span className={currentRoomIndex === 3 ? "text-cyan-400 font-bold" : ""}>Balcony</span>
                <span className={currentRoomIndex === 2 ? "text-cyan-400 font-bold" : ""}>Suite</span>
              </div>
              
              {/* Radar Vision Cone */}
              <div
                className="absolute w-6 h-6 border-t-2 border-cyan-400 bg-cyan-400/20 rounded-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-transform duration-200"
                style={{
                  transform: `translate(-50%, -50%) rotate(${panX * 0.8}deg)`,
                }}
              />
            </div>
          </div>
        )}

        {/* Floating Pan Controls */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/75 backdrop-blur-md border border-white/15 p-1.5 rounded-full shadow-2xl">
          <button
            onClick={(e) => {
              e.stopPropagation();
              nudgePan(60, 0);
            }}
            title="Pan Left"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nudgePan(0, 30);
            }}
            title="Pan Up"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronUp} className="text-[10px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nudgePan(0, -30);
            }}
            title="Pan Down"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronDown} className="text-[10px]" />
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              nudgePan(-60, 0);
            }}
            title="Pan Right"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors cursor-pointer"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
          </button>

          {/* Toggle Hotspots */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHotspots(!showHotspots);
            }}
            title="Toggle Doorway Hotspots"
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
              showHotspots ? "bg-cyan-500 text-black font-bold" : "bg-white/10 text-white/50"
            }`}
          >
            <FontAwesomeIcon icon={faLocationDot} className="text-[11px]" />
          </button>

          {/* Toggle Mini-Map */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowMinimap(!showMinimap);
            }}
            title="Toggle Floor Radar"
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors cursor-pointer ${
              showMinimap ? "bg-white/30 text-white" : "bg-white/10 text-white/50"
            }`}
          >
            <FontAwesomeIcon icon={faMap} className="text-[11px]" />
          </button>
        </div>

      </div>

      {/* Tour Specs Footer Bar */}
      <div className="w-full mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-2">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--app-text-secondary)]">
            LUXURY PENTHOUSE TOUR • 4 ROOMS CONNECTED
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--app-text-primary)]">
            The Glass Pavilion Residence
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary">Launch Fullscreen VR</Button>
          <Button variant="secondary">Book Space Tour</Button>
        </div>
      </div>

    </div>
  );
}

export default VirtualTourViewer;
