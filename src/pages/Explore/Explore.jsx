import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowDownWideShort,
  faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";
import { apiGetTours, apiGetProducts } from "../../services/api";

const exploreItems = [
  {
    id: "tour_glass_pavilion",
    title: "The Glass Pavilion Penthouse",
    tag: "360° Tour • 4 Rooms",
    price: "Free",
    category: "SPACES",
    type: "tour",
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "tour_horizon_villa",
    title: "Horizon Coastal Villa",
    tag: "360° Tour • Oceanfront",
    price: "Free",
    category: "SPACES",
    type: "tour",
    image: "https://images.unsplash.com/photo-1613977257363-707ba9348227?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "prod_aero_chair",
    title: "Ergonomic Spatial Chair X1",
    tag: "360° Spin • 3D Model",
    price: "$499",
    category: "PRODUCTS",
    type: "product",
    image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
    link: "/360-product",
  },
  {
    id: "tour_metropolitan",
    title: "Metropolitan Luxury Hotel",
    tag: "360° Tour • Suite",
    price: "Free",
    category: "SPACES",
    type: "tour",
    image: "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "prod_lunar_lamp",
    title: "Lunar Halo Ambient Light 360",
    tag: "360° Spin • Smart Light",
    price: "$249",
    category: "PRODUCTS",
    type: "product",
    image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800",
    link: "/360-product",
  },
  {
    id: "tour_skyline_loft",
    title: "Minimalist Skyline Loft",
    tag: "360° Tour • Open Space",
    price: "Free",
    category: "SPACES",
    type: "tour",
    image: "https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "tour_alpine_sanctuary",
    title: "Alpine Mountain Sanctuary",
    tag: "360° Tour • 5 Rooms",
    price: "Free",
    category: "SPACES",
    type: "tour",
    image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "tour_design_studio",
    title: "Architectural Design Studio",
    tag: "360° Tour • Studio",
    price: "Free",
    category: "SPACES",
    type: "tour",
    image: "https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
  {
    id: "tour_urban_penthouse",
    title: "Urban Skyline Glass Penthouse",
    tag: "360° Tour • Panoramic View",
    price: "Free",
    category: "SPACES",
    type: "tour",
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800",
    link: "/360-virtual-tour",
  },
];

const categories = ["ALL", "SPACES", "PRODUCTS"];

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchExploreData();
  }, [searchQuery, activeCategory, sortBy]);

  const fetchExploreData = async () => {
    setLoading(true);
    try {
      const [tours, products] = await Promise.all([
        apiGetTours({ search: searchQuery, sortBy }),
        apiGetProducts({ search: searchQuery, sortBy }),
      ]);

      if (tours || products) {
        const mappedTours = (tours || []).map((t) => ({
          id: t.id,
          title: t.title,
          tag: `360° Tour • ${t.totalScenes || 1} Scenes`,
          price: t.price || "Free",
          category: "SPACES",
          type: "tour",
          image: t.coverImage,
          link: `/360-virtual-tour`,
        }));

        const mappedProducts = (products || []).map((p) => ({
          id: p.id,
          title: p.title,
          tag: `360° Spin • ${p.subtitle || "3D Model"}`,
          price: typeof p.price === "number" ? `$${p.price}` : p.price,
          category: "PRODUCTS",
          type: "product",
          image: p.coverFrame,
          link: `/360-product`,
        }));

        const combined = [...mappedTours, ...mappedProducts];
        if (combined.length >= 9) {
          setApiData(combined);
        } else {
          setApiData(null);
        }
      }
    } catch (err) {
      console.warn("Explore page live API fetch fallback:", err);
    } finally {
      setLoading(false);
    }
  };

  const dataSource = apiData !== null ? apiData : exploreItems;

  const filteredData = dataSource.filter((item) => {
    const matchesCategory =
      activeCategory === "ALL" || item.category.toUpperCase() === activeCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  return (
    <div className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] min-h-screen py-16 px-6 sm:px-12 lg:px-20 transition-colors duration-250 select-none">
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
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium">
              Walk through 360° virtual rooms and inspect interactive 3D products before you go.
            </p>
          </div>

          {/* Controls: Search Bar & Sort Dropdown styled identically to VirtualGallery.jsx */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-secondary)] text-xs pointer-events-none"
              />
              <input
                type="text"
                placeholder="SEARCH SPACES OR PRODUCTS..."
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
                <option value="newest" className="bg-[var(--app-background)] text-[var(--app-text-primary)]">
                  SORT: NEWEST FIRST
                </option>
                <option value="popular" className="bg-[var(--app-background)] text-[var(--app-text-primary)]">
                  SORT: MOST POPULAR
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

        {/* Category Filter Buttons styled identically to VirtualGallery.jsx */}
        <div className="flex items-center justify-start flex-wrap gap-2 sm:gap-3 mb-10">
          {categories.map((cat) => {
            const isActive = activeCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-4 py-2 text-[11px] sm:text-xs font-bold uppercase tracking-wider transition-all duration-300 border rounded-md cursor-pointer ${
                  isActive
                    ? "bg-[var(--app-text-primary)] text-[var(--app-background)] border-[var(--app-text-primary)] shadow-md scale-105"
                    : "bg-[var(--app-text-primary)]/5 text-[var(--app-text-secondary)] border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-primary)]/50 hover:text-[var(--app-text-primary)]"
                }`}
              >
                {cat}
              </button>
            );
          })}
        </div>

        {/* 3 Columns Grid (3 per row) */}
        {loading ? (
          <div className="py-20 text-center">
            <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4"></div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--app-text-secondary)]">Searching Virtual Spaces...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-20 text-center text-[var(--app-text-secondary)]">
            <p className="text-base font-bold uppercase tracking-wider mb-2">NO MATCHES FOUND</p>
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
