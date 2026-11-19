import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faMagnifyingGlass,
  faArrowDownWideShort,
  faChevronDown,
  faChevronLeft,
  faChevronRight,
  faVrCardboard,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";
import { apiGetTours } from "../../services/api";

const exploreTours = [
  {
    id: "tour_glass_pavilion",
    title: "The Glass Pavilion Penthouse",
    tag: "360° Tour • 4 Rooms",
    price: "Free",
    category: "RESIDENTIAL",
    type: "tour",
    image: "/panoramas/panorama_entrance.jpg",
    link: "/virtual-tour/tour_glass_pavilion",
  },
  {
    id: "tour_horizon_villa",
    title: "Horizon Coastal Villa",
    tag: "360° Tour • Oceanfront",
    price: "Free",
    category: "RESIDENTIAL",
    type: "tour",
    image: "/panoramas/panorama_floor1.jpg",
    link: "/virtual-tour/tour_horizon_villa",
  },
  {
    id: "tour_metropolitan",
    title: "Metropolitan Luxury Hotel",
    tag: "360° Tour • Grand Suite",
    price: "Free",
    category: "HOSPITALITY",
    type: "tour",
    image: "/panoramas/panorama_entrance.jpg",
    link: "/virtual-tour/tour_metropolitan",
  },
  {
    id: "tour_skyline_loft",
    title: "Minimalist Skyline Loft",
    tag: "360° Tour • Open Space",
    price: "Free",
    category: "RESIDENTIAL",
    type: "tour",
    image: "/panoramas/panorama_aerial.jpg",
    link: "/virtual-tour/tour_skyline_loft",
  },
  {
    id: "tour_alpine_sanctuary",
    title: "Alpine Mountain Sanctuary",
    tag: "360° Tour • 3 Rooms",
    price: "Free",
    category: "RESIDENTIAL",
    type: "tour",
    image: "/panoramas/panorama_floor1.jpg",
    link: "/virtual-tour/tour_alpine_sanctuary",
  },
  {
    id: "tour_design_studio",
    title: "Architectural Design Studio",
    tag: "360° Tour • Creative Studio",
    price: "Free",
    category: "CREATIVE",
    type: "tour",
    image: "/panoramas/panorama_entrance.jpg",
    link: "/virtual-tour/tour_design_studio",
  },
  {
    id: "tour_urban_penthouse",
    title: "Urban Skyline Glass Penthouse",
    tag: "360° Tour • Panoramic View",
    price: "Free",
    category: "RESIDENTIAL",
    type: "tour",
    image: "/panoramas/panorama_aerial.jpg",
    link: "/virtual-tour/tour_urban_penthouse",
  },
  {
    id: "tour_corporate_hq",
    title: "Nexus Commercial Tech HQ",
    tag: "360° Tour • 6 Offices",
    price: "Free",
    category: "COMMERCIAL",
    type: "tour",
    image: "/panoramas/panorama_entrance.jpg",
    link: "/virtual-tour/tour_corporate_hq",
  },
  {
    id: "tour_coastal_resort",
    title: "Azure Bay Lagoon Resort",
    tag: "360° Tour • Overwater Suite",
    price: "Free",
    category: "HOSPITALITY",
    type: "tour",
    image: "/panoramas/panorama_floor1.jpg",
    link: "/virtual-tour/tour_coastal_resort",
  },
  {
    id: "tour_modern_gallery",
    title: "Contemporary Spatial Art Gallery",
    tag: "360° Tour • 4 Pavilions",
    price: "Free",
    category: "CREATIVE",
    type: "tour",
    image: "/panoramas/panorama_aerial.jpg",
    link: "/virtual-tour/tour_modern_gallery",
  },
  {
    id: "tour_summit_estate",
    title: "The Summit Hillside Estate",
    tag: "360° Tour • 5 Bedrooms",
    price: "Free",
    category: "RESIDENTIAL",
    type: "tour",
    image: "/panoramas/panorama_entrance.jpg",
    link: "/virtual-tour/tour_summit_estate",
  },
  {
    id: "tour_innovation_center",
    title: "Global Fintech Innovation Hub",
    tag: "360° Tour • Atrium & Labs",
    price: "Free",
    category: "COMMERCIAL",
    type: "tour",
    image: "/panoramas/panorama_floor1.jpg",
    link: "/virtual-tour/tour_innovation_center",
  },
  {
    id: "tour_botanical_atrium",
    title: "Eco Botanical Glass Atrium",
    tag: "360° Tour • Garden Lounge",
    price: "Free",
    category: "COMMERCIAL",
    type: "tour",
    image: "/panoramas/panorama_aerial.jpg",
    link: "/virtual-tour/tour_botanical_atrium",
  },
  {
    id: "tour_grand_ballroom",
    title: "The Monarch Grand Ballroom",
    tag: "360° Tour • Event Hall",
    price: "Free",
    category: "HOSPITALITY",
    type: "tour",
    image: "/panoramas/panorama_entrance.jpg",
    link: "/virtual-tour/tour_grand_ballroom",
  },
];

const categories = ["ALL", "RESIDENTIAL", "COMMERCIAL", "HOSPITALITY", "CREATIVE"];
const TOURS_PER_PAGE = 12;

export default function Explore() {
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [apiData, setApiData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  // Reset to page 1 whenever filter or search query changes
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory, searchQuery, sortBy]);

  useEffect(() => {
    const fetchExploreData = async () => {
      setLoading(true);
      try {
        const tours = await apiGetTours({ search: searchQuery, sortBy });
        const toursList = (tours && (tours.data || tours)) || [];

        // Check local storage for any custom creator tours
        let localTours = [];
        try {
          const saved = localStorage.getItem("viewroom_custom_tours");
          if (saved) {
            const parsed = JSON.parse(saved);
            if (Array.isArray(parsed)) localTours = parsed;
          }
        } catch (e) {
          console.warn("Local tours parse error:", e);
        }

        const backendList = Array.isArray(toursList) ? toursList : [];
        const backendIds = new Set(backendList.map((t) => t.id));
        const extraLocal = localTours.filter((t) => !backendIds.has(t.id));
        const allTours = [...backendList, ...extraLocal];

        const mappedTours = allTours.map((t) => ({
          id: t.id,
          title: t.title,
          tag: `360° Tour • ${t.totalScenes || t.scenes?.length || 1} Scenes`,
          price: t.price || "Free",
          category: (t.category || "RESIDENTIAL").toUpperCase(),
          type: "tour",
          image: t.coverImage || t.scenes?.[0]?.panoramaUrl || "/panoramas/panorama_aerial.jpg",
          link: `/virtual-tour/${t.id}`,
        }));

        if (mappedTours.length > 0) {
          const liveIds = new Set(mappedTours.map((x) => x.id));
          const remainingDemo = exploreTours.filter((x) => !liveIds.has(x.id));
          setApiData([...mappedTours, ...remainingDemo]);
        } else {
          setApiData(exploreTours);
        }
      } catch (err) {
        console.warn("Explore page live API fetch fallback:", err);
        setApiData(exploreTours);
      } finally {
        setLoading(false);
      }
    };

    fetchExploreData();
  }, [searchQuery, sortBy]);

  const dataSource = apiData !== null ? apiData : exploreTours;

  const filteredData = dataSource.filter((item) => {
    const matchesCategory =
      activeCategory === "ALL" || item.category === activeCategory;

    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.tag.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  // Pagination Logic (12 tours per page)
  const totalPages = Math.max(1, Math.ceil(filteredData.length / TOURS_PER_PAGE));
  const startIndex = (currentPage - 1) * TOURS_PER_PAGE;
  const endIndex = Math.min(startIndex + TOURS_PER_PAGE, filteredData.length);
  const currentTours = filteredData.slice(startIndex, endIndex);

  const handlePageChange = (newPage) => {
    if (newPage < 1 || newPage > totalPages) return;
    setCurrentPage(newPage);
    window.scrollTo({ top: 120, behavior: "smooth" });
  };

  return (
    <div className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] min-h-screen py-12 sm:py-16 px-4 sm:px-8 lg:px-12 transition-colors duration-250 select-none">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--app-text-primary)]/70 block mb-2">
              DISCOVER & EXPLORE
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold uppercase tracking-tight mb-2">
              ALL 360° VIRTUAL SPACES
            </h1>
            <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] font-medium max-w-xl">
              Walk through immersive 360° virtual rooms and inspect architectural spaces from anywhere in the world.
            </p>
          </div>

          {/* Controls: Search Bar & Sort Dropdown */}
          <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
            <div className="relative w-full sm:w-72">
              <FontAwesomeIcon
                icon={faMagnifyingGlass}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[var(--app-text-secondary)] text-xs pointer-events-none"
              />
              <input
                type="text"
                placeholder="SEARCH 360° SPACES..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2.5 rounded-sm bg-base-200/60 border border-base-content/15 text-xs font-semibold text-base-content placeholder-base-content/50 focus:outline-none focus:border-primary transition-all shadow-xs"
              />
            </div>

            <div className="relative inline-flex items-center w-full sm:w-auto">
              <FontAwesomeIcon
                icon={faArrowDownWideShort}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-base-content/50 text-xs pointer-events-none"
              />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full sm:w-auto pl-9 pr-8 py-2.5 text-xs font-semibold transition-all border border-base-content/15 rounded-sm cursor-pointer appearance-none bg-base-200/60 text-base-content focus:outline-none focus:border-primary shadow-xs"
              >
                <option value="newest">NEWEST FIRST</option>
                <option value="popular">MOST POPULAR</option>
                <option value="title">TITLE (A - Z)</option>
              </select>
              <FontAwesomeIcon
                icon={faChevronDown}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-base-content/50 text-[10px] pointer-events-none"
              />
            </div>
          </div>
        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center justify-between flex-wrap gap-3 mb-8 pb-4 border-b border-base-content/10">
          <div className="flex items-center flex-wrap gap-2">
            {categories.map((cat) => {
              const isActive = activeCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setActiveCategory(cat)}
                  className={`px-3.5 py-1.5 text-xs font-bold uppercase tracking-wider transition-all border rounded-sm cursor-pointer ${
                    isActive
                      ? "bg-base-content text-base-100 border-base-content shadow-xs"
                      : "bg-base-200/50 text-base-content/70 border-base-content/15 hover:border-base-content/40 hover:text-base-content"
                  }`}
                >
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Counter Badge */}
          <div className="text-xs text-base-content/60 font-semibold">
            {filteredData.length > 0 ? (
              <span>
                Showing <strong className="text-base-content">{startIndex + 1} - {endIndex}</strong> of <strong className="text-base-content">{filteredData.length}</strong> tours
              </span>
            ) : null}
          </div>
        </div>

        {/* 3 Columns Grid (Max 12 per page) */}
        {loading ? (
          <div className="py-24 text-center">
            <div className="inline-block w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin mb-3"></div>
            <p className="text-xs font-semibold text-base-content/60">Loading Virtual Spaces...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-24 text-center text-base-content/60">
            <p className="text-base font-bold uppercase tracking-wider mb-1 text-base-content">NO MATCHES FOUND</p>
            <p className="text-xs">Try clearing your search terms or selecting another category.</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
              {currentTours.map((item) => (
                <Link
                  to={item.link}
                  key={item.id}
                  className="flex flex-col justify-between group cursor-pointer p-4 rounded-sm bg-base-100 border border-base-content/10 shadow-xs hover:border-base-content/30 transition-all duration-300"
                >
                  {/* Card Image Container */}
                  <div className="relative w-full h-[240px] sm:h-[260px] rounded-sm overflow-hidden mb-3.5 bg-base-200 shadow-xs">
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* 360 Badge Overlay */}
                    <div className="absolute top-3 left-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-sm border border-white/20 flex items-center gap-1.5 shadow-sm">
                      <FontAwesomeIcon icon={faVrCardboard} className="text-white text-xs" />
                      <span className="text-[10px] font-bold tracking-wider text-white uppercase">
                        360° TOUR
                      </span>
                    </div>

                    {/* Category Tag */}
                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-sm border border-white/10">
                      <span className="text-[10px] font-semibold text-white/90 uppercase">
                        {item.category}
                      </span>
                    </div>
                  </div>

                  {/* Title & Price Info */}
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-sm sm:text-base font-bold text-base-content tracking-tight line-clamp-1 group-hover:text-primary transition-colors">
                      {item.title}
                    </h3>
                    <span className="text-xs font-bold text-base-content/80 shrink-0">
                      {item.price}
                    </span>
                  </div>

                  {/* Sub-tag */}
                  <span className="text-[11px] text-base-content/60 font-medium mb-3.5 block">
                    {item.tag}
                  </span>

                  {/* Explore Button */}
                  <div>
                    <Button variant="secondary" className="w-full !rounded-sm !py-2 !text-xs pointer-events-none">
                      <span>Explore 360°</span>
                      <span className="text-xs ml-1">→</span>
                    </Button>
                  </div>
                </Link>
              ))}
            </div>

            {/* Pagination Controls (when more than 1 page) */}
            {totalPages > 1 && (
              <div className="mt-12 pt-6 border-t border-base-content/10 flex flex-col sm:flex-row items-center justify-between gap-4">
                <span className="text-xs text-base-content/60 font-medium">
                  Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
                </span>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1.5 rounded-sm bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  >
                    <FontAwesomeIcon icon={faChevronLeft} className="text-[10px]" />
                    <span>Prev</span>
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                    <button
                      key={pageNum}
                      onClick={() => handlePageChange(pageNum)}
                      className={`w-8 h-8 rounded-sm text-xs font-bold transition-all ${
                        currentPage === pageNum
                          ? "bg-base-content text-base-100 shadow-xs"
                          : "bg-base-100 border border-base-content/15 text-base-content hover:bg-base-200"
                      }`}
                    >
                      {pageNum}
                    </button>
                  ))}

                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1.5 rounded-sm bg-base-100 border border-base-content/15 text-xs font-semibold text-base-content hover:bg-base-200 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center gap-1"
                  >
                    <span>Next</span>
                    <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                  </button>
                </div>
              </div>
            )}
          </>
        )}

      </div>
    </div>
  );
}
