import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faBuilding,
  faCube,
  faUserPlus,
  faSignInAlt,
  faEye,
  faArrowRight,
} from "@fortawesome/free-solid-svg-icons";

export default function VisitorDashboard() {
  const featuredSpaces = [
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

  return (
    <div className="space-y-8 text-[var(--app-text-primary)]">
      
      {/* Hero Welcome Banner */}
      <div className="p-8 sm:p-12 rounded-3xl bg-base-200/50 border border-[var(--app-border)]/30 text-center max-w-3xl mx-auto flex flex-col items-center">
        <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 text-cyan-500 border border-cyan-500/20 flex items-center justify-center text-2xl mb-4">
          <FontAwesomeIcon icon={faGlobe} />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest text-cyan-500 mb-2">
          VISITOR & GUEST DISCOVERY DASHBOARD
        </span>

        <h2 className="text-3xl sm:text-5xl font-heading font-black uppercase tracking-tight mb-4">
          EXPLORE THE FUTURE OF 360° SPACES
        </h2>

        <p className="text-sm text-[var(--app-text-secondary)] mb-8 leading-relaxed max-w-xl">
          Welcome to ViewRoom 360°! Sign in or create a free account to bookmark 360° property spaces, save AI Concierge chats, or publish your own 360° virtual tours.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link to="/sign-up" className="w-full sm:w-auto">
            <button className="w-full px-8 py-3.5 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider shadow-md hover:opacity-90 transition-opacity flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faUserPlus} />
              <span>Create Free Account</span>
            </button>
          </Link>
          <Link to="/sign-in" className="w-full sm:w-auto">
            <button className="w-full px-8 py-3.5 rounded-full border border-[var(--app-border)]/40 text-xs font-bold uppercase tracking-wider hover:bg-base-200 transition-colors flex items-center justify-center gap-2">
              <FontAwesomeIcon icon={faSignInAlt} />
              <span>Sign In</span>
            </button>
          </Link>
        </div>
      </div>

      {/* Featured Spaces Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} className="text-cyan-500" />
            FEATURED PUBLIC 360° EXPERIENCES
          </h3>
          <Link to="/explore" className="text-xs font-bold uppercase text-[var(--app-text-secondary)] hover:text-[var(--app-text-primary)]">
            Explore All →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuredSpaces.map((space) => (
            <div
              key={space.id}
              className="p-5 rounded-2xl bg-base-200/50 border border-[var(--app-border)]/20 flex flex-col justify-between shadow-sm hover:border-[var(--app-border)]/60 transition-all"
            >
              <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-neutral-900">
                <img src={space.image} alt={space.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-black/70 text-white text-[10px] font-extrabold uppercase">
                  {space.category}
                </span>
              </div>

              <h4 className="font-heading font-bold text-base uppercase mb-3">{space.title}</h4>

              <Link
                to={space.link}
                className="w-full py-2.5 rounded-full bg-base-content text-base-100 text-xs font-bold uppercase tracking-wider text-center flex items-center justify-center gap-2"
              >
                <span>Launch 360° Interactive</span>
                <FontAwesomeIcon icon={faArrowRight} className="text-[10px]" />
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
