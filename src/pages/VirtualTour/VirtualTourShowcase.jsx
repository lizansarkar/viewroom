import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Button from "../../components/reuseable/Button";
import { apiGetTours } from "../../services/api";

const CATEGORY_TABS = ["ALL", "COMMERCIAL", "RESIDENTIAL", "HOTELS"];

function VirtualTourShowcase() {
  const [tours, setTours] = useState([]);
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

      if (data) {
        setTours(data);
      } else {
        setTours([]);
      }
    } catch (err) {
      console.warn("VirtualTourShowcase fetch error:", err);
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
              CURATED VIRTUAL TOURS
            </span>
            <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-3">
              FEATURED SPACES
            </h2>
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)]">
              Walk through real estate homes, luxury hotels, and commercial venues in 360°.
            </p>
          </div>

          {/* Search & Sort Input Controls */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="w-full sm:w-72">
              <input
                type="text"
                placeholder="SEARCH 360° TOURS..."
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
              <option value="popular">Most Popular</option>
              <option value="newest">Newest First</option>
              <option value="title">Title (A-Z)</option>
            </select>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-3 mb-10 overflow-x-auto pb-2 no-scrollbar">
          {CATEGORY_TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                activeTab === tab
                  ? "bg-[var(--app-text-primary)] text-[var(--app-background)] border-[var(--app-text-primary)]"
                  : "bg-transparent text-[var(--app-text-primary)] border-[var(--app-border)]/30 hover:border-[var(--app-text-primary)]"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Dynamic Grid / Loading / Empty States */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">Loading 360° Tours...</p>
          </div>
        ) : tours.length === 0 ? (
          <div className="py-20 text-center text-[var(--app-text-secondary)]">
            <p className="text-base font-bold uppercase tracking-wider mb-2">NO TOURS FOUND</p>
            <p className="text-xs">Try adjusting your search terms or category selection.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {tours.map((item) => (
              <div
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

                <span className="text-xs text-[var(--app-text-secondary)] font-medium mb-3 block">
                  {item.category} • {item.price || "Free"}
                </span>

                {/* Action Button */}
                <div>
                  <Link to="/360-virtual-tour">
                    <Button variant="secondary" className="w-full">
                      <span>Explore Tour 360°</span>
                      <span className="text-sm ml-1">→</span>
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}

export default VirtualTourShowcase;
