import React, { useState, useRef, useEffect } from "react";
import Button from "../../components/reuseable/Button";
import { apiGetProducts } from "../../services/api";

// Real 360 Interactive Product Data
const REAL_360_PRODUCTS = [
  {
    id: "aero-watch",
    title: "Aero Chronograph 360",
    tag: "360° Interactive",
    category: "Luxury Timepiece",
    variants: [
      { name: "Onyx Black", accent: "#3b82f6", image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&q=80&w=800" },
      { name: "Silver Stainless", accent: "#94a3b8", image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&q=80&w=800" },
      { name: "Rose Gold", accent: "#f43f5e", image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&q=80&w=800" },
    ],
    hotspots: [
      { angle: 45, x: 60, y: 35, title: "Sapphire Dial" },
      { angle: 180, x: 50, y: 65, title: "72h Movement" },
    ],
  },
  {
    id: "spatial-headset",
    title: "Spatial Audio Headset",
    tag: "360° Interactive",
    category: "Audio Tech",
    variants: [
      { name: "Slate Black", accent: "#6366f1", image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800" },
      { name: "Polar White", accent: "#f8fafc", image: "https://images.unsplash.com/photo-1546435770-a3e426bf472b?auto=format&fit=crop&q=80&w=800" },
    ],
    hotspots: [
      { angle: 30, x: 55, y: 30, title: "Hybrid ANC" },
      { angle: 150, x: 45, y: 60, title: "Memory Foam" },
    ],
  },
  {
    id: "lounge-chair",
    title: "Eames Silhouette Lounge",
    tag: "360° Interactive",
    category: "Designer Furniture",
    variants: [
      { name: "Walnut Wood", accent: "#d97706", image: "https://images.unsplash.com/photo-1567538096630-e0c55bd6374c?auto=format&fit=crop&q=80&w=800" },
      { name: "Nordic Grey", accent: "#cbd5e1", image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800" },
    ],
    hotspots: [
      { angle: 60, x: 50, y: 40, title: "7-Ply Veneer" },
      { angle: 210, x: 50, y: 75, title: "Swivel Base" },
    ],
  },
  {
    id: "cinema-drone",
    title: "Cinema Drone X8",
    tag: "360° Interactive",
    category: "Robotics & Optics",
    variants: [
      { name: "Carbon Fiber", accent: "#10b981", image: "https://images.unsplash.com/photo-1527977966376-1c8408f9f108?auto=format&fit=crop&q=80&w=800" },
      { name: "Stealth Grey", accent: "#64748b", image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800" },
    ],
    hotspots: [
      { angle: 45, x: 50, y: 45, title: "Gimbal 8K" },
      { angle: 180, x: 30, y: 55, title: "Obstacle Radar" },
    ],
  },
  {
    id: "mirrorless-cam",
    title: "Pro Mirrorless System",
    tag: "360° Interactive",
    category: "Photography Hardware",
    variants: [
      { name: "Matte Black", accent: "#8b5cf6", image: "https://images.unsplash.com/photo-1516035069371-29a1b244cc32?auto=format&fit=crop&q=80&w=800" },
      { name: "Vintage Chrome", accent: "#e2e8f0", image: "https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?auto=format&fit=crop&q=80&w=800" },
    ],
    hotspots: [
      { angle: 60, x: 50, y: 50, title: "Full Frame Sensor" },
      { angle: 220, x: 65, y: 40, title: "OLED Viewfinder" },
    ],
  },
  {
    id: "leather-boots",
    title: "Craftsman Leather Boots",
    tag: "360° Interactive",
    category: "Footwear & Fashion",
    variants: [
      { name: "Chestnut Brown", accent: "#b45309", image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&q=80&w=800" },
      { name: "Midnight Tan", accent: "#78350f", image: "https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&q=80&w=800" },
    ],
    hotspots: [
      { angle: 45, x: 45, y: 60, title: "Goodyear Welt" },
      { angle: 190, x: 55, y: 45, title: "Full Grain Leather" },
    ],
  },
];

// Single Interactive 360 Product Card Component
function InteractiveProductCard({ product }) {
  const [angle, setAngle] = useState(0);
  const [variantIndex, setVariantIndex] = useState(0);
  const [isAutoSpin, setIsAutoSpin] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [activeHotspot, setActiveHotspot] = useState(null);

  const cardRef = useRef(null);
  const dragStartRef = useRef(0);
  const angleStartRef = useRef(0);

  const activeVariant = product.variants[variantIndex] || product.variants[0];

  // Auto-spin loop when enabled
  useEffect(() => {
    let anim;
    if (isAutoSpin) {
      const step = () => {
        setAngle((prev) => (prev + 1) % 360);
        anim = requestAnimationFrame(step);
      };
      anim = requestAnimationFrame(step);
    }
    return () => cancelAnimationFrame(anim);
  }, [isAutoSpin]);

  // Drag interaction handlers for 360 spin
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setIsAutoSpin(false);
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    dragStartRef.current = clientX;
    angleStartRef.current = angle;
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    const clientX = e.clientX || (e.touches && e.touches[0].clientX) || 0;
    const deltaX = clientX - dragStartRef.current;
    const newAngle = (angleStartRef.current - Math.round(deltaX * 0.9) + 3600) % 360;
    setAngle(newAngle);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  const rotateStep = (deg) => {
    setIsAutoSpin(false);
    setAngle((prev) => (prev + deg + 360) % 360);
  };

  return (
    <div className="flex flex-col group select-none">
      {/* 360 Interactive Product Viewer Box */}
      <div
        ref={cardRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
        className="relative w-full h-[300px] sm:h-[340px] rounded-2xl overflow-hidden mb-4 bg-[#0d0e12] border border-slate-800/60 shadow-lg flex items-center justify-center cursor-grab active:cursor-grabbing transition-all hover:border-slate-600/80"
      >
        {/* Dynamic Accent Lighting */}
        <div
          className="absolute inset-0 opacity-30 transition-all duration-500 pointer-events-none"
          style={{
            background: `radial-gradient(circle at 50% 50%, ${activeVariant.accent}44 0%, transparent 75%)`,
          }}
        />

        {/* 360 Rotating Object Viewport */}
        <div className="relative w-full h-full flex items-center justify-center p-6">
          <img
            src={activeVariant.image}
            alt={product.title}
            className="max-h-[80%] max-w-[80%] object-contain drop-shadow-[0_15px_30px_rgba(0,0,0,0.85)] pointer-events-none transition-all duration-75"
            style={{
              transform: `rotateY(${angle}deg) rotateZ(${Math.sin((angle * Math.PI) / 180) * 2.5}deg)`,
              filter: `brightness(${1 + Math.sin((angle * Math.PI) / 180) * 0.07})`,
            }}
          />

          {/* Interactive Hotspot Overlay Pins */}
          {product.hotspots.map((hs, idx) => {
            const angleDiff = Math.abs(((angle - hs.angle + 540) % 360) - 180);
            const isVisible = angleDiff < 80;
            const isActive = activeHotspot === idx;

            if (!isVisible) return null;

            return (
              <div
                key={idx}
                style={{ top: `${hs.y}%`, left: `${hs.x}%` }}
                className="absolute z-20 -translate-x-1/2 -translate-y-1/2 pointer-events-auto"
              >
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setActiveHotspot(isActive ? null : idx);
                  }}
                  className="relative flex items-center justify-center group"
                >
                  <span className="animate-ping absolute inline-flex h-6 w-6 rounded-full bg-cyan-400 opacity-60" />
                  <span className="relative inline-flex rounded-full h-5 w-5 bg-black/90 border border-cyan-400 text-cyan-300 text-[10px] font-bold items-center justify-center shadow-md">
                    +
                  </span>
                </button>

                {/* Popover Badge */}
                {isActive && (
                  <div className="absolute bottom-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-black/90 backdrop-blur-md text-white border border-white/20 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-wide shadow-xl z-30">
                    {hs.title}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* 360 Angle Badge */}
        <div className="absolute top-3 left-3 z-10 bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-3 py-1 flex items-center gap-1.5 shadow-md">
          <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span className="text-[10px] font-bold tracking-wider text-white uppercase">
            360° SPIN • {angle}°
          </span>
        </div>

        {/* Color Variant Selector */}
        <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5 bg-black/70 backdrop-blur-md border border-white/10 rounded-full px-2.5 py-1">
          {product.variants.map((v, i) => (
            <button
              key={v.name}
              title={v.name}
              onClick={(e) => {
                e.stopPropagation();
                setVariantIndex(i);
              }}
              style={{ backgroundColor: v.accent }}
              className={`w-3.5 h-3.5 rounded-full border border-white/40 transition-transform ${
                variantIndex === i ? "scale-125 ring-2 ring-white" : "opacity-70 hover:opacity-100"
              }`}
            />
          ))}
        </div>

        {/* Bottom Floating Spin Controls */}
        <div className="absolute bottom-3 right-3 z-20 flex items-center gap-1 bg-black/80 backdrop-blur-md border border-white/15 p-1 rounded-full shadow-lg">
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateStep(-45);
            }}
            title="Rotate Left (-45°)"
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-[10px] transition-colors"
          >
            ↺
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              setIsAutoSpin(!isAutoSpin);
            }}
            title={isAutoSpin ? "Pause Spin" : "Auto Spin"}
            className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] transition-colors ${
              isAutoSpin ? "bg-cyan-500 text-black font-bold" : "bg-white/10 hover:bg-white/20 text-white"
            }`}
          >
            {isAutoSpin ? "❚❚" : "▶"}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              rotateStep(45);
            }}
            title="Rotate Right (+45°)"
            className="w-6 h-6 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center text-[10px] transition-colors"
          >
            ↻
          </button>
        </div>

        {/* Drag Hint Footer Overlay */}
        <div className="absolute bottom-3 left-3 z-10 text-[10px] text-white/60 bg-black/50 backdrop-blur-sm px-2.5 py-1 rounded-full border border-white/5 pointer-events-none">
          Drag to spin 360°
        </div>
      </div>

      {/* Title & Metadata */}
      <div className="flex items-start justify-between mb-1">
        <div>
          <span className="text-[10px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)] block">
            {product.category}
          </span>
          <h3 className="text-base font-bold text-[var(--app-text-primary)] tracking-tight uppercase">
            {product.title}
          </h3>
        </div>
        <span className="text-[11px] font-semibold text-cyan-400 bg-cyan-400/10 border border-cyan-400/20 px-2 py-0.5 rounded-full uppercase">
          {activeVariant.name}
        </span>
      </div>

      {/* Interactive Action Button */}
      <div className="mt-3">
        <Button
          variant="secondary"
          className="w-full"
          onClick={() => {
            setIsAutoSpin(!isAutoSpin);
          }}
        >
          <span>{isAutoSpin ? "Pause 360° Spin" : "Interact 360° Spin"}</span>
          <span className="text-sm ml-1">➔</span>
        </Button>
      </div>
    </div>
  );
}

const PRODUCT_CATEGORIES = ["ALL", "FURNITURE", "TECH", "FASHION"];

function Product360Grid() {
  const [products, setProducts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("price_asc");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, [searchQuery, activeCategory, sortBy]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const data = await apiGetProducts({
        search: searchQuery,
        category: activeCategory === "ALL" ? "" : activeCategory,
        sortBy,
      });

      if (data && data.length > 0) {
        // Map API data into full interactive product shape
        const mapped = data.map((item, idx) => {
          const fallback = REAL_360_PRODUCTS[idx % REAL_360_PRODUCTS.length];
          return {
            ...fallback,
            id: item.id,
            title: item.title,
            category: item.category,
            price: item.price,
          };
        });
        setProducts(mapped);
      } else {
        // Local filtering fallback
        const filtered = REAL_360_PRODUCTS.filter((p) => {
          const matchesCat = activeCategory === "ALL" || p.category.toLowerCase().includes(activeCategory.toLowerCase());
          const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || p.category.toLowerCase().includes(searchQuery.toLowerCase());
          return matchesCat && matchesSearch;
        });
        setProducts(filtered);
      }
    } catch (err) {
      console.warn("Product360Grid fetch error:", err);
      setProducts(REAL_360_PRODUCTS);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-16 px-6 sm:px-12 lg:px-20 transition-colors duration-250">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Controls Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--app-text-primary)] block mb-2">
              REAL 360° INTERACTIVE CATALOG
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-3">
              FEATURED 360° PRODUCTS
            </h2>
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)]">
              Drag horizontally on any product card below to spin 360° in real-time.
            </p>
          </div>

          {/* Search & Sort Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="SEARCH 360° PRODUCTS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-5 py-3 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)] placeholder-[var(--app-text-secondary)] focus:outline-none focus:border-[var(--app-text-primary)] transition-colors"
              />
            </div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)] focus:outline-none cursor-pointer"
            >
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
              <option value="rating">Top Rated</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {PRODUCT_CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                activeCategory === cat
                  ? "bg-[var(--app-text-primary)] text-[var(--app-background)] border-[var(--app-text-primary)]"
                  : "bg-transparent text-[var(--app-text-primary)] border-[var(--app-border)]/30 hover:border-[var(--app-text-primary)]"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* 3 Columns Grid of Real 360 Products */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">Loading 360° Products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="py-20 text-center text-[var(--app-text-secondary)]">
            <p className="text-base font-bold uppercase tracking-wider mb-2">NO PRODUCTS FOUND</p>
            <p className="text-xs">Try adjusting your search terms or category filter.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product) => (
              <InteractiveProductCard key={product.id} product={product} />
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default Product360Grid;
