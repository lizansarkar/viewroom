import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faBuilding,
  faUserPlus,
  faSignInAlt,
  faCube,
  faRobot,
  faCompass,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";

export default function VisitorDashboard({ activeTab, _setActiveTab }) {
  const [categoryFilter, setCategoryFilter] = useState("All");

  const featuredSpaces = [
    {
      id: "tour_skyline_headquarters",
      title: "Skyline Innovation Campus 360°",
      category: "Real Estate",
      image: "/panoramas/panorama_aerial.jpg",
      scenesCount: 5,
      link: "/360-virtual-tour",
      description: "Aerial & interior 360° walkthrough of commercial tech campus.",
    },
    {
      id: "prod_aero_chair",
      title: "Ergonomic Spatial Chair X1",
      category: "3D Products",
      image: "https://images.unsplash.com/photo-1580481072645-022f9a6d8310?auto=format&fit=crop&q=80&w=800",
      scenesCount: 360,
      link: "/360-product",
      description: "Full 360° interactive product spin with PBR material shaders.",
    },
    {
      id: "tour_penthouse",
      title: "Glass Pavilion Penthouse",
      category: "Real Estate",
      image: "/panoramas/panorama_entrance.jpg",
      scenesCount: 4,
      link: "/360-virtual-tour",
      description: "Luxury penthouse 360° virtual tour with panoramic glass view.",
    },
    {
      id: "matterport_lab",
      title: "Spatial Robotics Lab 3D",
      category: "Matterport",
      image: "/panoramas/panorama_floor1.jpg",
      scenesCount: 6,
      link: "/matterport",
      description: "High-density Matterport spatial scan of R&D robotics facility.",
    },
  ];

  const filteredSpaces =
    categoryFilter === "All"
      ? featuredSpaces
      : featuredSpaces.filter((s) => s.category === categoryFilter);

  const currentView = activeTab || "visitor_overview";

  return (
    <div className="space-y-8 text-base-content w-full">
      {/* 1. DISCOVERY HUB ROUTE VIEW (visitor_overview) */}
      {(currentView === "visitor_overview" || currentView === "overview") && (
        <div className="space-y-6">
          {/* Hero Welcome Banner matching sidebar aesthetic */}
          <div className="p-8 sm:p-10 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col items-center text-center max-w-4xl mx-auto shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-xl mb-4 shrink-0">
              <FontAwesomeIcon icon={faGlobe} />
            </div>

            <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50 mb-1.5">
              Visitor & Guest Discovery Hub
            </span>

            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content mb-3">
              Explore the Future of Interactive 360° Spaces
            </h2>

            <p className="text-xs text-base-content/70 mb-6 leading-relaxed max-w-xl">
              Welcome to ViewRoom 360°! Discover interactive 360° property walkthroughs, test 3D product customization, and ask questions to our AI Concierge.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
              <Link to="/sign-up" className="w-full sm:w-auto">
                <Button variant="primary" className="!rounded-2xl !px-5">
                  <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
                  Create Free Account
                </Button>
              </Link>
              <Link to="/sign-in" className="w-full sm:w-auto">
                <Button variant="secondary" className="!rounded-2xl !px-5">
                  <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
                  Sign In
                </Button>
              </Link>
              <Link to="/explore" className="w-full sm:w-auto">
                <Button variant="neutral" className="!rounded-2xl !px-5">
                  <FontAwesomeIcon icon={faCompass} className="mr-2" />
                  Explore Spaces
                </Button>
              </Link>
            </div>
          </div>

          {/* Platform Feature Cards (3 Columns) matching sidebar aesthetic */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-base">
                <FontAwesomeIcon icon={faBuilding} />
              </div>
              <h3 className="font-bold text-base text-base-content">360° Property Tours</h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Step inside real estate properties with spherical panorama navigation and room portals.
              </p>
              <Link
                to="/360-virtual-tour"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                <span>Launch Virtual Tour</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </Link>
            </div>

            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-base">
                <FontAwesomeIcon icon={faCube} />
              </div>
              <h3 className="font-bold text-base text-base-content">3D Product Spins</h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Rotate and inspect 3D furniture and products with real-time WebGL material customization.
              </p>
              <Link
                to="/360-product"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                <span>Inspect 3D Product</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </Link>
            </div>

            <div className="p-6 rounded-[28px] bg-base-100 border border-base-content/10 space-y-3 shadow-xs">
              <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-base">
                <FontAwesomeIcon icon={faRobot} />
              </div>
              <h3 className="font-bold text-base text-base-content">AI Concierge Assistant</h3>
              <p className="text-xs text-base-content/70 leading-relaxed">
                Ask questions about dimensions, materials, and floor plans powered by Google Gemini AI.
              </p>
              <Link
                to="/contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-primary hover:underline pt-1"
              >
                <span>Try AI Concierge</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* 2. FEATURED SPACES ROUTE VIEW (featured) */}
      {(currentView === "featured" || currentView === "tours") && (
        <div className="space-y-6">
          {/* Header & Category Filter Bar */}
          <div className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shadow-xs">
            <div>
              <h3 className="font-bold text-base text-base-content flex items-center gap-2">
                <FontAwesomeIcon icon={faBuilding} className="text-base-content/60" />
                Featured Public 360° Experiences
              </h3>
              <p className="text-xs text-base-content/60 mt-0.5">
                Hand-picked interactive 360° tours and 3D product showcases
              </p>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 bg-base-200/60 p-1.5 rounded-2xl border border-base-content/10">
              {["All", "Real Estate", "3D Products", "Matterport"].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategoryFilter(cat)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    categoryFilter === cat
                      ? "bg-base-100 text-base-content font-bold shadow-xs border border-base-content/10"
                      : "text-base-content/60 hover:text-base-content hover:bg-base-100/50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Featured Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {filteredSpaces.map((space) => (
              <div
                key={space.id}
                className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col justify-between shadow-xs hover:border-base-content/20 transition-all"
              >
                <div>
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-base-200">
                    <img src={space.image} alt={space.title} className="w-full h-full object-cover" />
                    <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-base-100/90 text-base-content border border-base-content/10 text-[10px] font-semibold">
                      {space.category}
                    </span>
                    <span className="absolute bottom-3 right-3 px-2.5 py-0.5 rounded-full bg-black/60 text-white backdrop-blur-xs text-[10px] font-semibold">
                      {space.scenesCount} {space.category === "3D Products" ? "Degrees" : "Scenes"}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-base-content mb-1">{space.title}</h4>
                  <p className="text-xs text-base-content/60 mb-4 line-clamp-2">{space.description}</p>
                </div>

                <Link to={space.link} className="w-full pt-2">
                  <Button variant="primary" className="w-full text-center !rounded-xl !text-xs">
                    Launch 360° Interactive
                  </Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
