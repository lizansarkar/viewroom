import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faGlobe,
  faBuilding,
  faUserPlus,
  faSignInAlt,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";

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
    <div className="space-y-8 text-base-content w-full">
      {/* Hero Welcome Banner - Monochrome Black & White */}
      <div className="p-8 sm:p-12 rounded-3xl bg-base-200 border border-base-content/15 text-center max-w-3xl mx-auto flex flex-col items-center shadow-sm">
        <div className="w-14 h-14 rounded-2xl bg-base-300 text-base-content border border-base-content/20 flex items-center justify-center text-2xl mb-4 shrink-0">
          <FontAwesomeIcon icon={faGlobe} />
        </div>

        <span className="text-xs font-bold uppercase tracking-widest opacity-60 mb-2">
          VISITOR & GUEST DISCOVERY DASHBOARD
        </span>

        <h2 className="text-3xl sm:text-4xl font-heading font-black uppercase tracking-tight mb-4">
          EXPLORE THE FUTURE OF 360° SPACES
        </h2>

        <p className="text-sm opacity-70 mb-8 leading-relaxed max-w-xl">
          Welcome to ViewRoom 360°! Sign in or create a free account to bookmark 360° property spaces, save AI Concierge chats, or publish your own 360° virtual tours.
        </p>

        {/* Action Buttons using reusable Button component */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center">
          <Link to="/sign-up" className="w-full sm:w-auto">
            <Button variant="primary">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              CREATE FREE ACCOUNT
            </Button>
          </Link>
          <Link to="/sign-in" className="w-full sm:w-auto">
            <Button variant="secondary">
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              SIGN IN
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Spaces Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-heading font-black text-sm uppercase tracking-wider flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} />
            FEATURED PUBLIC 360° EXPERIENCES
          </h3>
          <Link to="/explore">
            <Button variant="neutral">
              EXPLORE ALL
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuredSpaces.map((space) => (
            <div
              key={space.id}
              className="p-5 rounded-2xl bg-base-200/60 border border-base-content/15 flex flex-col justify-between shadow-sm hover:border-base-content/30 transition-all"
            >
              <div className="relative h-48 rounded-xl overflow-hidden mb-4 bg-base-300">
                <img src={space.image} alt={space.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-base-100/90 text-base-content border border-base-content/15 text-[10px] font-extrabold uppercase">
                  {space.category}
                </span>
              </div>

              <h4 className="font-heading font-bold text-base uppercase mb-3">{space.title}</h4>

              <Link to={space.link} className="w-full">
                <Button variant="primary" className="w-full text-center">
                  LAUNCH 360° INTERACTIVE
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
