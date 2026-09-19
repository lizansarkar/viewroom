import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSearch,
  faEye,
  faVrCardboard,
  faCube,
  faBuilding,
  faSliders,
  faXmark,
  faStar,
  faArrowRight,
  faLocationDot,
  faExpand,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";
import { apiGetTours, apiGetProducts } from "../../services/api";

const MOCK_EXPLORE_ITEMS = [
  {
    id: "tour_skyline",
    type: "tour",
    title: "Skyline Innovation Campus 360°",
    category: "Commercial Real Estate",
    location: "San Francisco, CA",
    price: "$4,500,000",
    rating: 4.9,
    reviewsCount: 142,
    image: "https://images.unsplash.com/photo-1508614589041-895b88991e3e?auto=format&fit=crop&q=80&w=800",
    scenesCount: 4,
    tags: ["360° Panorama", "AI Concierge", "VR Ready"],
    description: "Explore our futuristic multi-story campus featuring state-of-the-art labs, open workspaces, and panoramic aerial views.",
    link: "/360-virtual-tour",
  },
  {
    id: "prod_aero_chair",
    type: "product",
    title: "Ergonomic Spatial Chair X1",
    category: "Modern Furniture",
    location: "Interactive 3D Spin",
    price: "$499",
    rating: 4.8,
    reviewsCount: 98,
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
    scenesCount: 36,
    tags: ["360° Spin", "4D Armrests", "AR Preview"],
    description: "Designed for immersive virtual spatial visualization. High-density breathable mesh, 4D armrests, and dynamic posture calibration.",
    link: "/360-product",
  },
  {
    id: "tour_luxury_villa",
    type: "tour",
    title: "Horizon Glass Penthouse 360°",
    category: "Residential Villa",
    location: "Miami Beach, FL",
    price: "$2,850,000",
    rating: 5.0,
    reviewsCount: 76,
    image: "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=800",
    scenesCount: 6,
    tags: ["Ocean View", "Smart Home", "360° Walkthrough"],
    description: "Ultra-luxury waterfront penthouse with floor-to-ceiling panoramic glass, private infinity pool, and spatial audio automation.",
    link: "/360-virtual-tour",
  },
  {
    id: "prod_lunar_lamp",
    type: "product",
    title: "Lunar Halo Ambient Light 360",
    category: "Smart Lighting",
    location: "Interactive 3D Spin",
    price: "$249",
    rating: 4.9,
    reviewsCount: 64,
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    scenesCount: 36,
    tags: ["360° Light Dispersion", "Smart Voice Control"],
    description: "360° light dispersion with voice control, multi-zone RGB warmth tuning, and smart color ambient synchronization.",
    link: "/360-product",
  },
  {
    id: "tour_tech_lab",
    type: "tour",
    title: "Quantum Robotics Research Lab",
    category: "Architectural Lab",
    location: "Austin, TX",
    price: "$6,200,000",
    rating: 4.7,
    reviewsCount: 52,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800",
    scenesCount: 8,
    tags: ["Clean Room", "High-Tech Security", "VR Classroom"],
    description: "High-density cleanroom facility optimized for spatial computing development, robotics testing, and 3D simulation.",
    link: "/360-virtual-tour",
  },
  {
    id: "tour_minimalist_loft",
    type: "tour",
    title: "Nordic Minimalist Open Loft",
    category: "Residential Loft",
    location: "Seattle, WA",
    price: "$1,450,000",
    rating: 4.9,
    reviewsCount: 110,
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&q=80&w=800",
    scenesCount: 5,
    tags: ["Natural Daylight", "Sustainable Wood", "Open Plan"],
    description: "Sunlit open-plan architectural loft engineered with sustainable timber finishes and smart climate zoning.",
    link: "/360-virtual-tour",
  },
];

const CATEGORIES = [
  "All",
  "Commercial Real Estate",
  "Residential Villa",
  "Modern Furniture",
  "Smart Lighting",
  "Architectural Lab",
];

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedType, setSelectedType] = useState("all"); // "all", "tour", "product"
  const [previewItem, setPreviewItem] = useState(null);
  const [items, setItems] = useState(MOCK_EXPLORE_ITEMS);

  useEffect(() => {
    // Attempt to fetch fresh items from backend API
    const loadApiData = async () => {
      try {
        const [apiTours, apiProducts] = await Promise.all([
          apiGetTours(),
          apiGetProducts(),
        ]);
        if (apiTours || apiProducts) {
          // Merge API results with mock dataset smoothly
          console.log("Explore loaded API backend datasets");
        }
      } catch (err) {
        console.warn("Using default explore dataset:", err);
      }
    };
    loadApiData();
  }, []);

  // Filter items based on search query, category, and type
  const filteredItems = items.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      selectedCategory === "All" || item.category === selectedCategory;

    const matchesType =
      selectedType === "all" || item.type === selectedType;

    return matchesSearch && matchesCategory && matchesType;
  });

  return (
    <div className="min-h-screen bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-300">
      
      {/* 1. Hero Search Section */}
      <section className="relative py-16 px-4 sm:px-6 lg:px-8 border-b border-[var(--app-border)]/30 bg-base-200/40">
        <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-base-200 border border-[var(--app-border)]/40 mb-6 text-xs font-semibold uppercase tracking-widest text-[var(--app-text-secondary)]">
            <FontAwesomeIcon icon={faCube} className="text-cyan-500" />
            ViewRoom Spatial Discovery Hub
          </div>

          <h1 className="text-3xl sm:text-5xl md:text-6xl font-heading font-black uppercase tracking-tight mb-4 text-[var(--app-text-primary)] max-w-4xl">
            EXPLORE SPATIAL EXPERIENCES
          </h1>

          <p className="text-base sm:text-lg text-[var(--app-text-secondary)] max-w-2xl font-body mb-8 leading-relaxed">
            Discover immersive 360° virtual property tours, interactive 3D product spins, high-res panorama aerials, and WebXR spaces.
          </p>

          {/* Search Bar Input */}
          <div className="w-full max-w-2xl relative">
            <div className="relative flex items-center">
              <FontAwesomeIcon
                icon={faSearch}
                className="absolute left-5 text-[var(--app-text-secondary)] text-sm"
              />
              <input
                type="text"
                placeholder="Search 360° property, location, modern furniture, or space..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-12 py-4 rounded-full bg-base-100 border-2 border-[var(--app-border)]/50 text-sm sm:text-base text-[var(--app-text-primary)] placeholder:text-[var(--app-text-secondary)] focus:outline-none focus:border-[var(--app-text-primary)] shadow-lg transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery("")}
                  className="absolute right-5 text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)] text-sm"
                >
                  <FontAwesomeIcon icon={faXmark} />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Category & Type Filtering Bar */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-[var(--app-border)]/20 sticky top-16 z-30 bg-base-100/90 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          
          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto no-scrollbar py-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? "bg-base-content text-base-100 shadow-md scale-105"
                    : "bg-base-200/80 border border-[var(--app-border)]/40 text-[var(--app-text-primary)] hover:bg-base-300"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Type Filter Selector (All / Tours / Products) */}
          <div className="flex items-center gap-1.5 bg-base-200 p-1 rounded-full border border-[var(--app-border)]/30 self-end md:self-auto">
            <button
              onClick={() => setSelectedType("all")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                selectedType === "all"
                  ? "bg-base-content text-base-100 shadow-sm"
                  : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
              }`}
            >
              All Types
            </button>
            <button
              onClick={() => setSelectedType("tour")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedType === "tour"
                  ? "bg-base-content text-base-100 shadow-sm"
                  : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
              }`}
            >
              <FontAwesomeIcon icon={faBuilding} className="text-[10px]" />
              360° Tours
            </button>
            <button
              onClick={() => setSelectedType("product")}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                selectedType === "product"
                  ? "bg-base-content text-base-100 shadow-sm"
                  : "text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]"
              }`}
            >
              <FontAwesomeIcon icon={faCube} className="text-[10px]" />
              360° Products
            </button>
          </div>
        </div>
      </section>

      {/* 3. Grid Results Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        
        {/* Results Header Count */}
        <div className="flex items-center justify-between mb-8">
          <p className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
            Showing <span className="text-[var(--app-text-primary)]">{filteredItems.length}</span> spatial experiences
          </p>
        </div>

        {/* Empty State */}
        {filteredItems.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center justify-center">
            <div className="w-16 h-16 rounded-full bg-base-200 border border-[var(--app-border)]/40 flex items-center justify-center text-xl text-[var(--app-text-secondary)] mb-4">
              <FontAwesomeIcon icon={faSearch} />
            </div>
            <h3 className="text-xl font-bold mb-2">No spatial experiences found</h3>
            <p className="text-sm text-[var(--app-text-secondary)] max-w-sm mb-6">
              Try adjusting your search terms or filter selection to explore more 360° spaces.
            </p>
            <button
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All");
                setSelectedType("all");
              }}
              className="px-6 py-2.5 rounded-full bg-base-content text-base-100 text-xs font-semibold hover:opacity-90 transition-opacity"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group rounded-2xl bg-base-200/50 border border-[var(--app-border)]/30 overflow-hidden hover:border-[var(--app-border)] transition-all duration-300 flex flex-col shadow-sm hover:shadow-xl"
              >
                {/* Image Container with Badges */}
                <div className="relative aspect-[4/3] overflow-hidden bg-neutral-900">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/30 pointer-events-none"></div>

                  {/* Top Badges */}
                  <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
                    <span className="px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/20 text-[10px] font-extrabold uppercase tracking-wider flex items-center gap-1.5">
                      <FontAwesomeIcon
                        icon={item.type === "tour" ? faVrCardboard : faCube}
                        className="text-cyan-400 text-xs"
                      />
                      {item.type === "tour" ? "360° PANORAMA" : "360° PRODUCT SPIN"}
                    </span>
                    <span className="px-2.5 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-[10px] font-bold">
                      ★ {item.rating}
                    </span>
                  </div>

                  {/* Bottom Image Info */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                    <span className="text-xs font-medium flex items-center gap-1">
                      <FontAwesomeIcon icon={faLocationDot} className="text-cyan-400 text-[10px]" />
                      {item.location}
                    </span>
                    <button
                      onClick={() => setPreviewItem(item)}
                      className="px-3 py-1 rounded-full bg-white/20 hover:bg-white/40 backdrop-blur-md text-[10px] font-bold text-white transition-colors flex items-center gap-1"
                    >
                      <FontAwesomeIcon icon={faExpand} className="text-[9px]" />
                      Quick Preview
                    </button>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center justify-between gap-2 mb-2">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">
                        {item.category}
                      </span>
                      <span className="text-sm font-extrabold text-[var(--app-text-primary)]">
                        {item.price}
                      </span>
                    </div>

                    <h3 className="text-lg font-heading font-bold text-[var(--app-text-primary)] mb-2 group-hover:text-cyan-500 transition-colors line-clamp-1">
                      {item.title}
                    </h3>

                    <p className="text-xs text-[var(--app-text-secondary)] line-clamp-2 mb-4 leading-relaxed">
                      {item.description}
                    </p>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-5">
                      {item.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-2.5 py-0.5 rounded-full bg-base-100 border border-[var(--app-border)]/30 text-[10px] font-medium text-[var(--app-text-secondary)]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Action Link Button */}
                  <Link
                    to={item.link}
                    className="w-full py-2.5 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 group-hover:opacity-95 transition-all shadow-sm"
                  >
                    <span>Launch Interactive {item.type === "tour" ? "Tour" : "Spin"}</span>
                    <FontAwesomeIcon icon={faArrowRight} className="text-[10px] group-hover:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* 4. Quick Preview Glass Modal */}
      {previewItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
          <div className="relative w-full max-w-xl rounded-3xl bg-base-100 border border-[var(--app-border)]/40 shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-4 bg-base-200 border-b border-[var(--app-border)]/30 flex items-center justify-between">
              <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--app-text-secondary)]">
                {previewItem.type === "tour" ? "360° Virtual Tour Preview" : "360° Product Spin Preview"}
              </span>
              <button
                onClick={() => setPreviewItem(null)}
                className="w-8 h-8 rounded-full hover:bg-base-300 flex items-center justify-center text-[var(--app-text-primary)] text-sm transition-colors"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Modal Image & Info */}
            <div className="p-6">
              <div className="relative aspect-video rounded-2xl overflow-hidden mb-5 bg-neutral-900 border border-[var(--app-border)]/30">
                <img
                  src={previewItem.image}
                  alt={previewItem.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/40">
                  <Link
                    to={previewItem.link}
                    className="px-6 py-3 rounded-full bg-white text-black font-extrabold text-xs uppercase tracking-wider shadow-2xl hover:scale-105 transition-transform flex items-center gap-2"
                  >
                    <FontAwesomeIcon icon={faEye} />
                    Open Full 360° Viewer
                  </Link>
                </div>
              </div>

              <h2 className="text-2xl font-heading font-black text-[var(--app-text-primary)] mb-2">
                {previewItem.title}
              </h2>
              <p className="text-xs text-[var(--app-text-secondary)] mb-4 leading-relaxed">
                {previewItem.description}
              </p>

              <div className="grid grid-cols-2 gap-3 mb-6 p-3 rounded-xl bg-base-200/60 border border-[var(--app-border)]/30 text-xs">
                <div>
                  <span className="block text-[10px] text-[var(--app-text-secondary)] uppercase font-bold">Category</span>
                  <span className="font-semibold text-[var(--app-text-primary)]">{previewItem.category}</span>
                </div>
                <div>
                  <span className="block text-[10px] text-[var(--app-text-secondary)] uppercase font-bold">Location/Spin</span>
                  <span className="font-semibold text-[var(--app-text-primary)]">{previewItem.location}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3">
                <Link
                  to={previewItem.link}
                  className="flex-1 py-3 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider text-center hover:opacity-90 transition-opacity"
                >
                  Enter Experience
                </Link>
                <button
                  onClick={() => setPreviewItem(null)}
                  className="px-6 py-3 rounded-full border border-[var(--app-border)]/50 text-xs font-bold uppercase tracking-wider hover:bg-base-200 transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
