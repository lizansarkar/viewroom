import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCompass,
  faHouse,
  faVrCardboard,
  faArrowRight,
  faBuilding,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../../components/reuseable/Button";

export default function NotFound() {
  return (
    <div className="min-h-[80vh] w-full flex items-center justify-center px-4 sm:px-6 py-16 bg-[var(--app-background)] text-base-content transition-colors duration-250 select-none">
      <div className="max-w-xl w-full text-center p-8 sm:p-10 rounded-sm bg-base-100 border border-base-content/10 shadow-lg relative overflow-hidden">
        
        {/* Subtle Decorative Ambient Glow */}
        <div className="absolute -top-24 -left-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-primary/10 rounded-full blur-3xl pointer-events-none" />

        {/* 360 Spherical Compass Icon */}
        <div className="relative inline-flex items-center justify-center w-24 h-24 mb-6 rounded-full bg-base-200/80 border border-base-content/15 shadow-inner">
          <FontAwesomeIcon
            icon={faCompass}
            className="text-4xl text-primary animate-spin"
            style={{ animationDuration: "16s" }}
          />
          <span className="absolute -top-1 -right-1 px-2.5 py-0.5 text-[10px] font-black rounded-sm bg-rose-500/15 text-rose-600 dark:text-rose-400 border border-rose-500/30 uppercase tracking-wider">
            404
          </span>
        </div>

        {/* Title & Description */}
        <span className="text-[11px] font-bold uppercase tracking-widest text-base-content/50 block mb-2">
          Spatial Coordinate Error
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight mb-3 text-base-content font-heading">
          Lost in 360° Space
        </h1>
        <p className="text-xs sm:text-sm text-base-content/70 mb-8 leading-relaxed max-w-md mx-auto">
          The 360° scene or room coordinate you are attempting to visit does not exist, has expired, or was relocated to another virtual panorama.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link to="/" className="w-full sm:w-auto">
            <Button variant="primary" className="w-full !rounded-sm !py-2.5 !px-5 !text-xs gap-2">
              <FontAwesomeIcon icon={faHouse} className="text-xs" />
              <span>Back to Home</span>
            </Button>
          </Link>

          <Link to="/explore" className="w-full sm:w-auto">
            <Button variant="secondary" className="w-full !rounded-sm !py-2.5 !px-5 !text-xs gap-2">
              <FontAwesomeIcon icon={faVrCardboard} className="text-xs" />
              <span>Explore 360° Spaces</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-[10px] ml-1" />
            </Button>
          </Link>
        </div>

        {/* Helpful Shortcut Links */}
        <div className="mt-8 pt-6 border-t border-base-content/10 flex items-center justify-center gap-6 text-xs text-base-content/60 font-medium">
          <Link to="/properties" className="hover:text-base-content transition-colors flex items-center gap-1.5">
            <FontAwesomeIcon icon={faBuilding} className="text-[11px]" />
            <span>Featured Tours</span>
          </Link>
          <span>•</span>
          <Link to="/contact" className="hover:text-base-content transition-colors">
            Contact Support
          </Link>
        </div>
      </div>
    </div>
  );
}
