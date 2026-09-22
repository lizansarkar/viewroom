import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faRobot,
  faUser,
  faEye,
  faRocket,
  faCompass,
  faHistory,
  faExternalLinkAlt,
} from "@fortawesome/free-solid-svg-icons";
import { apiPromoteToCreator } from "../../services/api";

export default function ClientDashboard({ user, onUpgradeSuccess }) {
  const [upgrading, setUpgrading] = useState(false);

  const mockBookmarks = [
    {
      id: "tour_skyline_headquarters",
      title: "Skyline Innovation Campus 360°",
      category: "Commercial Real Estate",
      image: "/panoramas/panorama_aerial.jpg",
      link: "/360-virtual-tour",
    },
    {
      id: "prod_aero_chair",
      title: "Ergonomic Spatial Chair X1",
      category: "Modern Furniture",
      image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
      link: "/360-product",
    },
  ];

  const mockAiHistory = [
    {
      query: "How to navigate between floors?",
      answer: "You can click floor portal hotspots inside the 360° panorama scene or use the vertical action panel on the left.",
      timestamp: "Yesterday",
    },
    {
      query: "What are the dimensions of the penthouse?",
      answer: "The Glass Pavilion Penthouse covers 4,500 sq ft with 14ft floor-to-ceiling panoramic glass.",
      timestamp: "3 days ago",
    },
  ];

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

  return (
    <div className="space-y-8 text-[var(--app-text-primary)]">
      
      {/* Top Welcome Header & Upgrade Card */}
      <div className="p-6 sm:p-8 rounded-3xl bg-base-200/50 border border-[var(--app-border)]/30 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-500/10 text-purple-500 border border-purple-500/20 flex items-center justify-center text-xl">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div>
            <span className="text-[10px] font-black uppercase tracking-widest text-purple-500 block mb-1">
              CLIENT DASHBOARD
            </span>
            <h2 className="text-2xl sm:text-3xl font-heading font-black uppercase tracking-tight">
              WELCOME BACK, {user?.name?.toUpperCase() || "SPATIAL EXPLORER"}
            </h2>
            <p className="text-xs text-[var(--app-text-secondary)] mt-1">
              Manage your bookmarked 360° spaces, review Spatial AI search history, and upgrade to a Creator account.
            </p>
          </div>
        </div>

        {/* 1-Click Upgrade Button */}
        <button
          onClick={handleUpgrade}
          disabled={upgrading}
          className="px-6 py-3 rounded-full bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 shadow-md hover:opacity-90 transition-opacity whitespace-nowrap self-stretch md:self-auto justify-center"
        >
          <FontAwesomeIcon icon={faRocket} />
          <span>{upgrading ? "Upgrading..." : "Become a 360° Creator (Free)"}</span>
        </button>
      </div>

      {/* Grid: Bookmarks & AI History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Bookmarked Spaces (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2">
              <FontAwesomeIcon icon={faBookmark} className="text-purple-500" />
              SAVED & BOOKMARKED SPACES ({mockBookmarks.length})
            </h3>
            <Link to="/explore" className="text-xs font-bold uppercase text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]">
              Explore More →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockBookmarks.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex flex-col justify-between shadow-sm hover:border-[var(--app-border)]/60 transition-all"
              >
                <div className="relative h-40 rounded-xl overflow-hidden mb-3 bg-neutral-900">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-black/70 text-white text-[9px] font-extrabold uppercase">
                    {b.category}
                  </span>
                </div>
                <h4 className="font-heading font-bold text-xs uppercase mb-3 line-clamp-1">{b.title}</h4>
                <Link
                  to={b.link}
                  className="w-full py-2 rounded-full bg-base-content text-base-100 text-[11px] font-bold uppercase tracking-wider text-center flex items-center justify-center gap-1.5"
                >
                  <FontAwesomeIcon icon={faEye} className="text-[10px]" />
                  Launch 360°
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* Right Column: Recent AI Concierge Search History */}
        <div className="space-y-4">
          <h3 className="font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2">
            <FontAwesomeIcon icon={faRobot} className="text-cyan-500" />
            AI CONCIERGE SEARCH LOGS
          </h3>

          <div className="space-y-3">
            {mockAiHistory.map((item, idx) => (
              <div
                key={idx}
                className="p-4 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 text-xs space-y-1.5"
              >
                <div className="flex items-center justify-between text-[10px] font-bold text-cyan-500 uppercase">
                  <span>Question</span>
                  <span className="text-[var(--app-text-secondary)] font-normal">{item.timestamp}</span>
                </div>
                <p className="font-bold text-[var(--app-text-primary)]">"{item.query}"</p>
                <p className="text-[11px] text-[var(--app-text-secondary)] leading-relaxed">
                  {item.answer}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}
