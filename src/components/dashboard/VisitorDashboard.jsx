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
      {/* Hero Welcome Banner matching sidebar style */}
      <div className="p-8 sm:p-10 rounded-[28px] bg-base-100 border border-base-content/10 text-center max-w-3xl mx-auto flex flex-col items-center shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-xl mb-4 shrink-0">
          <FontAwesomeIcon icon={faGlobe} />
        </div>

        <span className="text-[11px] font-semibold uppercase tracking-wider text-base-content/50 mb-1.5">
          Visitor & Guest Discovery Hub
        </span>

        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-base-content mb-3">
          Explore the Future of 360° Spaces
        </h2>

        <p className="text-xs text-base-content/70 mb-6 leading-relaxed max-w-xl">
          Welcome to ViewRoom 360°! Sign in or create a free account to bookmark 360° property spaces, save AI Concierge chats, or publish your own 360° virtual tours.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
          <Link to="/sign-up" className="w-full sm:w-auto">
            <Button variant="primary" className="!rounded-2xl">
              <FontAwesomeIcon icon={faUserPlus} className="mr-2" />
              Create Free Account
            </Button>
          </Link>
          <Link to="/sign-in" className="w-full sm:w-auto">
            <Button variant="secondary" className="!rounded-2xl">
              <FontAwesomeIcon icon={faSignInAlt} className="mr-2" />
              Sign In
            </Button>
          </Link>
        </div>
      </div>

      {/* Featured Spaces Showcase Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-base-content flex items-center gap-2">
            <FontAwesomeIcon icon={faBuilding} className="text-base-content/60" />
            Featured Public 360° Experiences
          </h3>
          <Link to="/explore">
            <Button variant="neutral" className="!rounded-xl !text-xs">
              Explore All
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {featuredSpaces.map((space) => (
            <div
              key={space.id}
              className="p-5 rounded-[28px] bg-base-100 border border-base-content/10 flex flex-col justify-between shadow-xs hover:border-base-content/20 transition-all"
            >
              <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-base-200">
                <img src={space.image} alt={space.title} className="w-full h-full object-cover" />
                <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-base-100/90 text-base-content border border-base-content/10 text-[10px] font-semibold">
                  {space.category}
                </span>
              </div>

              <h4 className="font-bold text-base text-base-content mb-3">{space.title}</h4>

              <Link to={space.link} className="w-full">
                <Button variant="primary" className="w-full text-center !rounded-xl !text-xs">
                  Launch 360° Interactive
                </Button>
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
