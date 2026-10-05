import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faRobot,
  faUser,
  faEye,
  faRocket,
  faTrash,
  faMagnifyingGlass,
  faCheckCircle,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import { apiPromoteToCreator } from "../../services/api";

export default function ClientDashboard({ user, activeTab, setActiveTab, onUpgradeSuccess }) {
  const [upgrading, setUpgrading] = useState(false);
  const [bookmarksSearch, setBookmarksSearch] = useState("");
  const [aiSearchQuery, setAiSearchQuery] = useState("");

  const [bookmarks, setBookmarks] = useState([
    {
      id: "tour_skyline_headquarters",
      title: "Skyline Innovation Campus 360°",
      category: "Commercial Real Estate",
      image: "/panoramas/panorama_aerial.jpg",
      link: "/360-virtual-tour",
      savedAt: "2 days ago",
    },
    {
      id: "prod_aero_chair",
      title: "Ergonomic Spatial Chair X1",
      category: "Modern Furniture",
      image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
      link: "/360-product",
      savedAt: "5 days ago",
    },
    {
      id: "tour_penthouse",
      title: "Glass Pavilion Penthouse 360°",
      category: "Luxury Residential",
      image: "/panoramas/panorama_entrance.jpg",
      link: "/360-virtual-tour",
      savedAt: "1 week ago",
    },
  ]);

  const [aiHistory] = useState([
    {
      id: "q1",
      query: "How to navigate between room floors?",
      answer: "Click floor portal hotspots inside the 360° panorama scene or use the floor selector on the left control panel.",
      timestamp: "Yesterday",
    },
    {
      id: "q2",
      query: "What are the dimensions of the penthouse?",
      answer: "The Glass Pavilion Penthouse covers 4,500 sq ft with 14ft floor-to-ceiling panoramic glass walls.",
      timestamp: "3 days ago",
    },
    {
      id: "q3",
      query: "Can I customize 3D furniture materials?",
      answer: "Yes, open any 3D Product Spin to change fabric textures, metallic finishes, and lighting environments.",
      timestamp: "1 week ago",
    },
  ]);

  const handleRemoveBookmark = (id) => {
    setBookmarks((prev) => prev.filter((b) => b.id !== id));
  };

  const handleUpgrade = async () => {
    setUpgrading(true);
    try {
      await apiPromoteToCreator();
      if (onUpgradeSuccess) onUpgradeSuccess();
    } catch (err) {
      console.warn("Upgrade error:", err);
    } finally {
      setUpgrading(false);
    }
  };

  const currentRoute = activeTab || "client_overview";

  const filteredBookmarks = bookmarks.filter((b) =>
    b.title.toLowerCase().includes(bookmarksSearch.toLowerCase()) ||
    b.category.toLowerCase().includes(bookmarksSearch.toLowerCase())
  );

  const filteredAiHistory = aiHistory.filter((h) =>
    h.query.toLowerCase().includes(aiSearchQuery.toLowerCase()) ||
    h.answer.toLowerCase().includes(aiSearchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8 text-base-content max-w-7xl mx-auto w-full">
      {/* 1. OVERVIEW ROUTE VIEW (client_overview) */}
      {(currentRoute === "client_overview" || currentRoute === "overview") && (
        <div className="space-y-6">
          {/* Top Welcome Header & Upgrade Banner */}
          <div className="p-6 sm:p-7 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-lg shrink-0">
                <FontAwesomeIcon icon={faUser} />
              </div>
              <div>
                <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50 block mb-1">
                  Client Dashboard Overview
                </span>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
                  Welcome back, {user?.name || "Spatial Explorer"}
                </h2>
                <p className="text-xs text-base-content/70 mt-1 max-w-xl">
                  Manage your bookmarked 360° spaces, review Spatial AI search logs, and publish your own tours by becoming a Creator.
                </p>
              </div>
            </div>

            {/* Upgrade Button */}
            <Button
              variant="primary"
              onClick={handleUpgrade}
              disabled={upgrading}
              className="whitespace-nowrap cursor-pointer !rounded-2xl"
            >
              <FontAwesomeIcon icon={faRocket} className="mr-2" />
              <span>{upgrading ? "Upgrading..." : "Become a 360° Creator (Free)"}</span>
            </Button>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-medium text-base-content/60 block mb-1">
                  Saved 360° Spaces
                </span>
                <span className="text-2xl font-extrabold text-base-content">{bookmarks.length}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-sm shrink-0">
                <FontAwesomeIcon icon={faBookmark} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-medium text-base-content/60 block mb-1">
                  AI Concierge Queries
                </span>
                <span className="text-2xl font-extrabold text-base-content">{aiHistory.length}</span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-sm shrink-0">
                <FontAwesomeIcon icon={faRobot} />
              </div>
            </div>

            <div className="p-5 rounded-2xl bg-base-100 border border-base-content/10 flex items-center justify-between shadow-xs">
              <div>
                <span className="text-[11px] font-medium text-base-content/60 block mb-1">
                  Account Status
                </span>
                <span className="text-xs font-bold text-base-content uppercase px-2 py-0.5 rounded-full bg-base-200 border border-base-content/10 inline-block">
                  CLIENT EXPLORER
                </span>
              </div>
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-sm shrink-0">
                <FontAwesomeIcon icon={faUser} />
              </div>
            </div>
          </div>

          {/* Side by Side Preview: Bookmarks & AI Logs */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Bookmarks Section */}
            <div className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                  <FontAwesomeIcon icon={faBookmark} className="text-base-content/60" />
                  Saved & Bookmarked Spaces ({bookmarks.length})
                </h3>
                <button
                  onClick={() => setActiveTab && setActiveTab("bookmarks")}
                  className="text-xs font-semibold text-base-content/70 hover:text-base-content cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {bookmarks.slice(0, 2).map((b) => (
                  <div
                    key={b.id}
                    className="p-4 sm:p-5 rounded-[24px] bg-base-100 border border-base-content/10 flex flex-col justify-between shadow-xs hover:border-base-content/20 transition-all gap-3"
                  >
                    <div>
                      <div className="relative h-40 rounded-2xl overflow-hidden mb-3 bg-base-200">
                        <img
                          src={b.image}
                          alt={b.title}
                          onError={(e) => {
                            e.target.onerror = null;
                            e.target.src = "/panoramas/panorama_aerial.jpg";
                          }}
                          className="w-full h-full object-cover"
                        />
                        <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-base-100/90 text-base-content border border-base-content/10 text-[10px] font-semibold">
                          {b.category}
                        </span>
                      </div>
                      <h4 className="font-bold text-xs sm:text-sm text-base-content leading-snug line-clamp-1 mt-1 mb-2">{b.title}</h4>
                    </div>
                    <Link to={b.link} className="w-full block mt-3">
                      <Button variant="secondary" className="w-full text-center !rounded-xl !text-xs !py-2">
                        <FontAwesomeIcon icon={faEye} className="mr-1.5" />
                        Launch 360°
                      </Button>
                    </Link>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Concierge Search Logs */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
                  <FontAwesomeIcon icon={faRobot} className="text-base-content/60" />
                  AI Concierge Logs
                </h3>
                <button
                  onClick={() => setActiveTab && setActiveTab("ai_history")}
                  className="text-xs font-semibold text-base-content/70 hover:text-base-content cursor-pointer"
                >
                  View All →
                </button>
              </div>

              <div className="space-y-3">
                {aiHistory.slice(0, 2).map((item) => (
                  <div
                    key={item.id}
                    className="p-4 rounded-[24px] bg-base-100 border border-base-content/10 text-xs space-y-1.5 shadow-xs"
                  >
                    <div className="flex items-center justify-between text-[10px] font-semibold text-base-content/50 uppercase">
                      <span>Question</span>
                      <span className="opacity-70 font-normal">{item.timestamp}</span>
                    </div>
                    <p className="font-bold text-base-content">"{item.query}"</p>
                    <p className="text-[11px] text-base-content/70 leading-relaxed">
                      {item.answer}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. BOOKMARKS ROUTE VIEW (bookmarks) */}
      {currentRoute === "bookmarks" && (
        <div className="space-y-6">
          {/* Header & Search Bar */}
          <div className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <FontAwesomeIcon icon={faBookmark} className="text-base-content/60" />
                Saved & Bookmarked 360° Spaces
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Quick access to your saved property walkthroughs and 3D product spins
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search bookmarks..."
                value={bookmarksSearch}
                onChange={(e) => setBookmarksSearch(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-3 text-xs text-base-content/50" />
            </div>
          </div>

          {/* Bookmarks Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredBookmarks.map((b) => (
              <div
                key={b.id}
                className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col justify-between shadow-xs hover:border-base-content/20 transition-all gap-4"
              >
                <div>
                  <div className="relative h-44 rounded-2xl overflow-hidden mb-3 bg-base-200">
                    <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-base-100/90 text-base-content border border-base-content/10 text-[10px] font-semibold">
                      {b.category}
                    </span>
                    <button
                      onClick={() => handleRemoveBookmark(b.id)}
                      className="absolute top-3 right-3 p-2 rounded-full bg-black/50 text-white hover:bg-error transition-colors cursor-pointer text-xs"
                      title="Remove Bookmark"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                    </button>
                  </div>

                  <h4 className="font-bold text-sm text-base-content mt-1 leading-snug">{b.title}</h4>
                  <span className="text-xs text-base-content/50 block mt-1">Saved {b.savedAt}</span>
                </div>

                <Link to={b.link} className="w-full block mt-3">
                  <Button variant="primary" className="w-full text-center !rounded-xl !text-xs !py-2">
                    <FontAwesomeIcon icon={faEye} className="mr-2" />
                    Launch 360° Interactive
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 3. AI HISTORY ROUTE VIEW (ai_history) */}
      {currentRoute === "ai_history" && (
        <div className="space-y-6">
          {/* Header & Search Bar */}
          <div className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <FontAwesomeIcon icon={faRobot} className="text-base-content/60" />
                AI Concierge Search History & Logs
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Review past spatial Q&A queries powered by Google Gemini AI
              </p>
            </div>

            {/* Search Bar */}
            <div className="relative w-full sm:w-64">
              <input
                type="text"
                placeholder="Search AI logs..."
                value={aiSearchQuery}
                onChange={(e) => setAiSearchQuery(e.target.value)}
                className="w-full px-3.5 py-2 pl-9 rounded-xl bg-base-200/80 border border-base-content/10 text-xs font-semibold text-base-content focus:outline-none"
              />
              <FontAwesomeIcon icon={faMagnifyingGlass} className="absolute left-3 top-3 text-xs text-base-content/50" />
            </div>
          </div>

          {/* AI Logs List */}
          <div className="space-y-4">
            {filteredAiHistory.map((item) => (
              <div
                key={item.id}
                className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs"
              >
                <div className="flex items-center justify-between text-xs font-semibold text-base-content/50">
                  <span className="flex items-center gap-2">
                    <FontAwesomeIcon icon={faRobot} className="text-primary" />
                    <span>Spatial Query</span>
                  </span>
                  <span className="opacity-70">{item.timestamp}</span>
                </div>
                <h4 className="font-bold text-sm text-base-content">"{item.query}"</h4>
                <div className="p-4 rounded-2xl bg-base-200/60 border border-base-content/10 text-xs text-base-content/80 leading-relaxed">
                  {item.answer}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. UPGRADE ROUTE VIEW (upgrade) */}
      {currentRoute === "upgrade" && (
        <div className="p-8 sm:p-10 rounded-[28px] bg-base-100 border border-base-content/10 max-w-3xl mx-auto space-y-6 text-center shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-2xl mx-auto shrink-0">
            <FontAwesomeIcon icon={faRocket} />
          </div>

          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50 block mb-1">
              Account Upgrade
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content">
              Become a 360° Creator & Property Owner
            </h2>
            <p className="text-xs text-base-content/70 mt-2 max-w-xl mx-auto leading-relaxed">
              Unlock full creator capabilities! Publish 360° virtual property tours, build hot-spot room links, attach 3D product spins, and inspect real-time spatial analytics.
            </p>
          </div>

          {/* Creator Perks List */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-left max-w-lg mx-auto py-2">
            <div className="flex items-center gap-2.5 text-xs text-base-content/80 font-semibold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-success text-sm" />
              <span>Publish Unlimited 360° Tours</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-base-content/80 font-semibold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-success text-sm" />
              <span>No-Code Hotspot Room Editor</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-base-content/80 font-semibold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-success text-sm" />
              <span>Interactive 3D Product Spins</span>
            </div>
            <div className="flex items-center gap-2.5 text-xs text-base-content/80 font-semibold">
              <FontAwesomeIcon icon={faCheckCircle} className="text-success text-sm" />
              <span>Spatial Visitor Telemetry</span>
            </div>
          </div>

          {/* Action Upgrade Button */}
          <Button
            variant="primary"
            onClick={handleUpgrade}
            disabled={upgrading}
            className="!px-8 !py-3 !rounded-2xl cursor-pointer"
          >
            <FontAwesomeIcon icon={faRocket} className="mr-2" />
            <span>{upgrading ? "Upgrading Account..." : "Upgrade to Creator Now (Free)"}</span>
          </Button>
        </div>
      )}
    </div>
  );
}
