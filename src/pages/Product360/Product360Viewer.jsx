import React, { useState, useRef, useEffect } from "react";
import Button from "../../components/reuseable/Button";

// Product datasets with rotation frames and hotspots
const PRODUCTS = [
  {
    id: "watch",
    name: "Aero Chronograph 360",
    category: "Luxury Timepiece",
    variants: [
      { name: "Onyx Black", bg: "#0d0d0f", accent: "#3b82f6", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=1000" },
      { name: "Silver Chrome", bg: "#1e293b", accent: "#94a3b8", image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=1000" },
      { name: "Rose Gold", bg: "#2a1b1b", accent: "#f43f5e", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=1000" },
    ],
    hotspots: [
      { id: 1, angle: 45, x: 65, y: 35, title: "Sapphire Crystal Lens", desc: "Scratch-resistant anti-reflective dual coating" },
      { id: 2, angle: 180, x: 48, y: 62, title: "Automatic Caliber", desc: "72-hour power reserve mechanical movement" },
      { id: 3, angle: 270, x: 30, y: 42, title: "Titanium Case", desc: "Grade 5 aerospace-grade brushed titanium" },
    ],
  },
  {
    id: "headset",
    name: "SoundPulse Spatial Studio",
    category: "Audio Technology",
    variants: [
      { name: "Matte Slate", bg: "#0f172a", accent: "#6366f1", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=1000" },
      { name: "Polar White", bg: "#1e293b", accent: "#e2e8f0", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=1000" },
    ],
    hotspots: [
      { id: 1, angle: 30, x: 55, y: 30, title: "Active Noise Cancellation", desc: "Dual hybrid ANC with 45dB attenuation" },
      { id: 2, angle: 120, x: 70, y: 55, title: "Memory Foam Cushions", desc: "Breathable lambskin leather ear pads" },
    ],
  },
  {
    id: "chair",
    name: "Eames Silhouette Lounge",
    category: "Designer Furniture",
    variants: [
      { name: "Walnut & Black", bg: "#18181b", accent: "#d97706", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=1000" },
      { name: "Nordic Ash", bg: "#1e293b", accent: "#cbd5e1", image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=1000" },
    ],
    hotspots: [
      { id: 1, angle: 60, x: 50, y: 40, title: "Plywood Shell", desc: "7-ply molded veneer in real American Walnut" },
      { id: 2, angle: 210, x: 45, y: 75, title: "Swivel Base", desc: "Die-cast aluminum 5-star swivel mechanism" },
    ],
  },
];

function Product360Viewer() {
  const [selectedProductIndex, setSelectedProductIndex] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [angle, setAngle] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [showHotspots, setShowHotspots] = useState(true);
  const [activeHotspot, setActiveHotspot] = useState(null);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [isDragging, setIsDragging] = useState(false);
  
  const containerRef = useRef(null);
  const dragStartRef = useRef(0);
  const angleStartRef = useRef(0);

  const product = PRODUCTS[selectedProductIndex];
  const variant = product.variants[variantIndex] || product.variants[0];

  // Auto-spin animation loop
  useEffect(() => {
    let animationFrame;
    if (isAutoSpin) {
      const spin = () => {
        setAngle((prev) => (prev + 1) % 360);
        animationFrame = requestAnimationFrame(spin);
      };
      animationFrame = requestAnimationFrame(spin);
    }
    return () => cancelAnimationFrame(animationFrame);
  }, [isAutoSpin]);

  // Drag interaction handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    dragStartRef.current = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    angleStartRef.current = angle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartRef.current;
    // Map pixel drag movement to degrees (e.g. 0.8deg per px)
    const newAngle = (angleStartRef.current - Math.round(deltaX * 0.8) + 3600) % 360;
    setAngle(newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Step rotation helper
  const rotateStep = (deg) => {
    setIsAutoSpin(false);
    setAngle((prev) => (prev + deg + 360) % 360);
  };

  return (
    <div className="w-full flex flex-col items-center select-none">
      {/* Product Selector Pills */}
      <div className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-8 z-10 px-4">
        {PRODUCTS.map((prod, idx) => {
          const isActive = selectedProductIndex === idx;
          return (
            <button
              key={prod.id}
              onClick={() => {
                setSelectedProductIndex(idx);
                setVariantIndex(0);
                setAngle(0);
                setActiveHotspot(null);
              }}
              className={`px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 border rounded-md cursor-pointer ${
                isActive
                  ? "bg-[var(--app-text-primary)] text-[var(--app-background)] border-[var(--app-text-primary)] shadow-md scale-105"
                  : "bg-[var(--app-text-primary)]/5 text-[var(--app-text-secondary)] border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/50 hover:text-[var(--app-text-primary)]"
              }`}
            >
              {prod.name}
            </button>
          );
        })}
      </div>

      {/* Main 360 Viewport Container - Full Width */}
      <div
        ref={containerRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="relative w-full h-[420px] sm:h-[560px] lg:h-[680px] overflow-hidden shadow-2xl bg-[#0b0c10] flex items-center justify-center cursor-grab active:cursor-grabbing transition-all border-y border-slate-800/60"
      >
        {/* Background Radial Glow */}
        <div
          className="absolute inset-0 opacity-40 transition-all duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${variant.accent}33 0%, transparent 70%)`,
          }}
        />

        {/* Simulated 360 Product Image with Dynamic Rotation Perspective */}
        <div
          className="relative w-full h-full flex items-center justify-center p-6 transition-transform duration-100 ease-out"
          style={{
            transform: `scale(${zoomLevel})`,
          }}
        >
          <img
            src={variant.image}
            alt={product.name}
            className="max-h-[85%] max-w-[85%] object-contain drop-shadow-[0_20px_40px_rgba(0,0,0,0.8)] pointer-events-none transition-all duration-300"
            style={{
              transform: `rotateY(${angle}deg) rotateZ(${Math.sin((angle * Math.PI) / 180) * 3}deg)`,
              filter: `brightness(${1 + Math.sin((angle * Math.PI) / 180) * 0.08})`,
            }}
          />

          {/* Interactive Hotspots Overlay */}
          {showHotspots &&
            product.hotspots.map((hs) => {
              // Calculate visibility based on rotation proximity
              const angleDiff = Math.abs(((angle - hs.angle + 540) % 360) - 180);
              const isVisible = angleDiff < 75;
              const isActive = activeHotspot === hs.id;

              if (!isVisible) return null;

              return (
                <div
                  key={hs.id}
                  style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                  className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
                >
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setActiveHotspot(isActive ? null : hs.id);
                    }}
                    className="relative group flex items-center justify-center"
                  >
                    <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-cyan-400 opacity-60" />
                    <span className="relative inline-flex rounded-full h-7 w-7 bg-black/80 border-2 border-cyan-400 text-cyan-300 text-xs font-bold items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                      +
                    </span>
                  </button>

                  {/* Hotspot Card Popover */}
                  {isActive && (
                    <div className="absolute top-9 left-1/2 -translate-x-1/2 w-56 sm:w-64 bg-base-100/95 backdrop-blur-md text-base-content border border-[var(--app-border)]/30 p-3.5 rounded-xl shadow-2xl z-30 animate-in fade-in zoom-in duration-200">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)]">
                          {hs.title}
                        </h4>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setActiveHotspot(null);
                          }}
                          className="text-xs text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
                        >
                          ✕
                        </button>
                      </div>
                      <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed">
                        {hs.desc}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
        </div>

        {/* Angle & Drag Indicator Tag */}
        <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3.5 py-1.5 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-xs font-bold tracking-wider uppercase text-white">
            360° SPIN • {angle}°
          </span>
        </div>

        {/* Drag Hint Overlay */}
        <div className="absolute bottom-4 left-4 z-10 hidden sm:flex items-center gap-2 text-[11px] text-white/70 bg-black/40 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/5">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7h8M8 12h8M8 17h8" />
          </svg>
          <span>Drag horizontally to rotate</span>
        </div>

        {/* Color Variant Selector */}
        <div className="absolute top-4 right-4 z-10 flex items-center gap-2 bg-black/60 backdrop-blur-md border border-white/10 rounded-full px-3 py-1.5">
          <span className="text-[11px] font-semibold text-white/70 uppercase mr-1">Color:</span>
          {product.variants.map((v, i) => (
            <button
              key={v.name}
              title={v.name}
              onClick={(e) => {
                e.stopPropagation();
                setVariantIndex(i);
              }}
              style={{ backgroundColor: v.accent }}
              className={`w-4 h-4 rounded-full border border-white/40 transition-transform ${
                variantIndex === i ? "scale-125 ring-2 ring-white" : "opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>

        {/* Floating Controls Bar at Bottom */}
        <div className="absolute bottom-4 right-4 z-20 flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/15 p-1.5 rounded-full shadow-2xl">
          {/* Rotate Left */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateStep(-45);
            }}
            title="Rotate Left (-45°)"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
          >
            ↺
          </button>

          {/* Auto Spin Toggle */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAutoSpin(!isAutoSpin);
            }}
            title={isAutoSpin ? "Pause Auto-Spin" : "Play Auto-Spin"}
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${
              isAutoSpin ? "bg-cyan-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            {isAutoSpin ? "❚❚" : "▶"}
          </button>

          {/* Rotate Right */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateStep(45);
            }}
            title="Rotate Right (+45°)"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
          >
            ↻
          </button>

          {/* Toggle Hotspots */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setShowHotspots(!showHotspots);
            }}
            title="Toggle Specs Hotspots"
            className={`w-8 h-8 rounded-full flex items-center justify-center text-xs transition-colors ${
              showHotspots ? "bg-white/30 text-white" : "bg-white/10 text-white/50"
            }`}
          >
            ✦
          </button>

          {/* Zoom In/Out */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              setZoomLevel(zoomLevel === 1 ? 1.3 : 1);
            }}
            title="Zoom Toggle"
            className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-xs transition-colors"
          >
            {zoomLevel === 1 ? "🔍+" : "🔍-"}
          </button>
        </div>
      </div>

      {/* Product Spec Header Bar Below Viewer */}
      <div className="max-w-7xl w-full mt-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 px-4 sm:px-8">
        <div>
          <span className="text-xs font-bold uppercase tracking-widest text-[var(--app-text-secondary)]">
            {product.category} • {variant.name}
          </span>
          <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--app-text-primary)]">
            {product.name}
          </h3>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="primary">Request 360 Spin</Button>
          <Button variant="secondary">View Specs</Button>
        </div>
      </div>
    </div>
  );
}

export default Product360Viewer;
