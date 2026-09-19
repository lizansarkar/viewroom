import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/reuseable/Button";
import { apiGetTours, apiGetProducts } from "../../services/api";

const exploreItems = [
  {
    id: "tour_glass_pavilion",
    title: "The Glass Pavilion Penthouse",
    tag: "360° Tour • 4 Rooms",
    price: "Free",
    category: "Spaces",
    type: "tour",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "tour_horizon_villa",
    title: "Horizon Coastal Villa",
    tag: "360° Tour • Oceanfront",
    price: "Free",
    category: "Spaces",
    type: "tour",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "prod_aero_chair",
    title: "Ergonomic Spatial Chair X1",
    tag: "360° Spin • 3D Model",
    price: "$499",
    category: "Products",
    type: "product",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
    link: "/360-product",
  },
  {
    id: "tour_metropolitan",
    title: "Metropolitan Luxury Hotel",
    tag: "360° Tour • Suite",
    price: "Free",
    category: "Spaces",
    type: "tour",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "prod_lunar_lamp",
    title: "Lunar Halo Ambient Light 360",
    tag: "360° Spin • Smart Light",
    price: "$249",
    category: "Products",
    type: "product",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    link: "/360-product",
  },
  {
    id: "tour_skyline_loft",
    title: "Minimalist Skyline Loft",
    tag: "360° Tour • Open Space",
    price: "Free",
    category: "Spaces",
    type: "tour",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "tour_alpine_sanctuary",
    title: "Alpine Mountain Sanctuary",
    tag: "360° Tour • 5 Rooms",
    price: "Free",
    category: "Spaces",
    type: "tour",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "tour_design_studio",
    title: "Architectural Design Studio",
    tag: "360° Tour • Studio",
    price: "Free",
    category: "Spaces",
    type: "tour",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
];

const categories = ["ALL", "SPACES", "PRODUCTS"];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = exploreItems.filter((item) => {
    const matchesCategory =
      activeCategory === "ALL" || item.category.toUpperCase() === activeCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] min-h-screen py-16 px-6 sm:px-12 lg:px-20 transition-colors duration-250">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section matching Properties / Home page design */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--app-text-primary)] block mb-2">
              DISCOVER & EXPLORE
            </span>
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-3">
              ALL SPACES & PRODUCTS
            </h1>
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)]">
              Walk through 360° virtual rooms and inspect interactive 3D products before you go.
            </p>
          </div>

          {/* Search Bar matching ViewRoom minimal pill input */}
          <div className="w-full md:w-80">
            <input
              type="text"
              placeholder="SEARCH SPACES OR PRODUCTS..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-3 rounded-full bg-base-200/60 border border-[var(--app-border)]/40 text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)] placeholder-[var(--app-text-secondary)] focus:outline-none focus:border-[var(--app-text-primary)] transition-colors"
            />
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {categories.map((cat) => (
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

        {/* 3 Columns Grid matching Properties.jsx */}
        {filteredData.length === 0 ? (
          <div className="py-20 text-center text-[var(--app-text-secondary)]">
            <p className="text-base font-bold uppercase tracking-wider mb-2">NO SPACES FOUND</p>
            <p className="text-xs">Try clearing your search terms or selecting another category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((item) => (
              <Link
                to={item.link}
                key={item.id}
                className="flex flex-col justify-between group cursor-pointer p-4 sm:p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-md hover:border-[var(--app-border)]/60 transition-all duration-300"
              >
                {/* Card Image Container */}
                <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden mb-4 bg-base-200 shadow-md">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* 360 Badge Overlay */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs font-bold tracking-wider text-white uppercase">
                      {item.type === "tour" ? "360° TOUR" : "360° PRODUCT"}
                    </span>
                  </div>
                </div>

                {/* Title & Price Info */}
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-base font-bold text-[var(--app-text-primary)] tracking-tight uppercase group-hover:underline">
                    {item.title}
                  </h3>
                  <span className="text-sm font-bold text-[var(--app-text-primary)]">
                    {item.price}
                  </span>
                </div>

                {/* Sub-tag */}
                <span className="text-xs text-[var(--app-text-secondary)] font-medium mb-4 block">
                  {item.tag}
                </span>

                {/* Explore Button */}
                <div>
                  <Button variant="secondary" className="w-full pointer-events-none">
                    <span>Explore 360°</span>
                    <span className="text-sm ml-1">→</span>
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
