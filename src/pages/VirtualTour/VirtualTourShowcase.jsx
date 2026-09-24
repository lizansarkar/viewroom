import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowDownWideShort,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";
import { apiGetTours } from "../../services/api";

const CATEGORY_TABS = ["ALL", "COMMERCIAL", "RESIDENTIAL", "HOTELS"];

const DEFAULT_TOURS = [
  {
    id: "tour_glass_pavilion",
    title: "The Glass Pavilion Penthouse",
    totalScenes: 5,
    price: "Free",
    category: "RESIDENTIAL",
    coverImage: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "tour_horizon_villa",
    title: "Horizon Coastal Villa",
    totalScenes: 6,
    price: "Free",
    category: "RESIDENTIAL",
    coverImage: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "tour_metropolitan",
    title: "Metropolitan Luxury Hotel",
    totalScenes: 8,
    price: "Free",
    category: "HOTELS",
    coverImage: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "tour_skyline_loft",
    title: "Minimalist Skyline Loft",
    totalScenes: 4,
    price: "Free",
    category: "RESIDENTIAL",
    coverImage: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "tour_alpine_sanctuary",
    title: "Alpine Mountain Sanctuary",
    totalScenes: 7,
    price: "Free",
    category: "RESIDENTIAL",
    coverImage: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
  },
  {
    id: "tour_design_studio",
    title: "Architectural Design Studio",
    totalScenes: 3,
    price: "Free",
    category: "COMMERCIAL",
    coverImage: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
  },
];

function VirtualTourShowcase() {
  const [tours, setTours] = useState(null);
  const [activeTab, setActiveTab] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("popular");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchTours();
  }, [searchQuery, activeTab, sortBy]);

  const fetchTours = async () => {
    setLoading(true);
    try {
      const data = await apiGetTours({
        search: searchQuery,
        category: activeTab === "ALL" ? "" : activeTab,
        sortBy,
      });

      if (data && data.length > 0) {
        setTours(data);
      } else {
        setTours(null);
      }
    } catch (err) {
      console.warn("VirtualTourShowcase fetch error:", err);
      setTours(null);
    } finally {
      setLoading(false);
    }
  };

  const dataSource = tours !== null ? tours : DEFAULT_TOURS;

  const filteredData = dataSource.filter((item) => {
    const matchesCategory =
      activeTab === "ALL" ||
      (item.category && item.category.toUpperCase() === activeTab);

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.category && item.category.toLowerCase().includes(searchQuery.toLowerCase()));

    return matchesCategory && matchesSearch;
  });

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-16 px-6 sm:px-12 lg:px-20 transition-colors duration-250 select-none">
      <div className="max-w-7xl mx-auto">

        {/* Header & Controls Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--app-text-primary)] block mb-2">
              CURATED VIRTUAL TOURS
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-3">
              FEATURED SPACES
            </h2>
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium">
              Walk through real estate homes, luxury hotels, and commercial venues in 360°.
            </p>
          </div>

          {/* Search Bar & Sort Dropdown controls matching Explore.jsx */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-secondary)] text-xs pointer-events-none"
              />
              <input
                type="text"
                placeholder="SEARCH 360° TOURS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-md bg-[var(--app-text-primary)]/5 border border-[var(--app-text-secondary)]/20 text-[11px] sm:text-xs font-bold uppercase tracking-wider text-[var(--app-text-primary)] placeholder-[var(--app-text-secondary)] focus:outline-none focus:border-[var(--app-text-primary)] transition-all duration-300 hover:border-[var(--app-text-primary)]/50"
              />
            </div>

            <div className="relative inline-flex items-center w-full sm:w-auto">
              <FontAwesomeIcon
                icon={faArrowDownWideShort}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-secondary)] text-xs pointer-events-none"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto pl-9 pr-8 py-2.5 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 border rounded-md cursor-pointer appearance-none bg-[var(--app-text-primary)]/5 text-[var(--app-text-primary)] border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/50 focus:outline-none focus:border-[var(--app-text-primary)] shadow-sm"
              >
                <option value="popular" className="bg-[var(--app-background)] text-[var(--app-text-primary)]">
                  SORT: MOST POPULAR
                </option>
                <option value="newest" className="bg-[var(--app-background)] text-[var(--app-text-primary)]">
                  SORT: NEWEST FIRST
                </option>
                <option value="title" className="bg-[var(--app-background)] text-[var(--app-text-primary)]">
                  SORT: TITLE (A - Z)
                </option>
              </select>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--app-text-secondary)] text-[10px] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Buttons matching Explore.jsx */}
        <div className="flex items-center justify-start flex-wrap gap-2 sm:gap-3 mb-10">
          {CATEGORY_TABS.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 border rounded-md cursor-pointer ${
                  isActive
                    ? "bg-[var(--app-text-primary)] text-[var(--app-background)] border-[var(--app-text-primary)] shadow-md scale-105"
                    : "bg-[var(--app-text-primary)]/5 text-[var(--app-text-secondary)] border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/50 hover:text-[var(--app-text-primary)]"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Dynamic Grid / Loading / Empty States */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">Loading 360° Tours...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 text-center text-[var(--app-text-secondary)]">
            <p className="text-base font-bold uppercase tracking-wider mb-2">NO TOURS FOUND</p>
            <p className="text-xs">Try adjusting your search terms or category selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredData.map((item) => (
              <Link
                to="/360-virtual-tour"
                key={item.id}
                className="flex flex-col justify-between group cursor-pointer p-4 sm:p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 shadow-md hover:border-[var(--app-border)]/60 transition-all duration-300"
              >
                {/* Card Image */}
                <div className="relative w-full h-[280px] sm:h-[320px] rounded-2xl overflow-hidden mb-4 bg-base-200 shadow-md">
                  <img
                    src={item.coverImage}
                    alt={item.title}
                    className="w-full h-full object-cover rounded-2xl group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* 360 Badge */}
                  <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                    <span className="text-xs font-bold tracking-wider text-white uppercase">
                      360° TOUR • {item.totalScenes || 1} SCENES
                    </span>
                  </div>
                </div>

                {/* Title & Details */}
                <div className="flex items-start justify-between mb-1">
                  <h3 className="text-base font-bold text-[var(--app-text-primary)] tracking-tight uppercase group-hover:underline">
                    {item.title}
                  </h3>
                </div>

                <span className="text-xs text-[var(--app-text-secondary)] font-medium mb-4 block">
                  {item.category} • {item.price || "Free"}
                </span>

                {/* Action Button */}
                <div>
                  <Button variant="secondary" className="w-full pointer-events-none">
                    <span>Explore Tour 360°</span>
                    <span className="text-sm ml-1">→</span>
                  </Button>
                </div>
              </Link>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default VirtualTourShowcase;
