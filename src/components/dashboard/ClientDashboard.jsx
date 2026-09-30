import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBookmark,
  faRobot,
  faUser,
  faEye,
  faRocket,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
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
    <div className="space-y-8 text-base-content max-w-7xl mx-auto w-full">
      
      {/* Top Welcome Header & Upgrade Card matching sidebar style */}
      <div className="p-6 sm:p-7 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6 shadow-xs">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-lg shrink-0">
            <FontAwesomeIcon icon={faUser} />
          </div>
          <div>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50 block mb-1">
              Client Dashboard
            </span>
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-base-content">
              Welcome back, {user?.name || "Spatial Explorer"}
            </h2>
            <p className="text-xs text-base-content/70 mt-1 max-w-xl">
              Manage your bookmarked 360° spaces, review Spatial AI search history, and upgrade to a Creator account.
            </p>
          </div>
        </div>

        {/* 1-Click Upgrade Button */}
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

      {/* Grid: Bookmarks & AI History */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Bookmarked Spaces (2 Cols) */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
              <FontAwesomeIcon icon={faBookmark} className="text-base-content/60" />
              Saved & Bookmarked Spaces ({mockBookmarks.length})
            </h3>
            <Link to="/explore" className="text-xs font-semibold text-base-content/70 hover:text-base-content">
              Explore More →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {mockBookmarks.map((b) => (
              <div
                key={b.id}
                className="p-4 rounded-[24px] bg-base-100 border border-base-content/10 flex flex-col justify-between shadow-xs hover:border-base-content/20 transition-all"
              >
                <div className="relative h-40 rounded-2xl overflow-hidden mb-3 bg-base-200">
                  <img src={b.image} alt={b.title} className="w-full h-full object-cover" />
                  <span className="absolute top-2 left-2 px-2.5 py-0.5 rounded-full bg-base-100/90 text-base-content border border-base-content/10 text-[10px] font-semibold">
                    {b.category}
                  </span>
                </div>
                <h4 className="font-bold text-xs text-base-content mb-3 line-clamp-1">{b.title}</h4>
                <Link
                  to={b.link}
                  className="w-full py-2.5 rounded-xl bg-base-content text-base-100 text-xs font-semibold text-center flex items-center justify-center gap-1.5 transition-opacity hover:opacity-90"
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
          <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
            <FontAwesomeIcon icon={faRobot} className="text-base-content/60" />
            AI Concierge Search Logs
          </h3>

          <div className="space-y-3">
            {mockAiHistory.map((item, idx) => (
              <div
                key={idx}
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
  );
}
