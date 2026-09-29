import React from "react";
import { Link } from "react-router-dom";

// Standalone 360° Play-The-Tour Vector SVG Emblem Icon (Adapts 100% to Light & Dark Modes)
export function ViewRoomLogoIcon({ className = "w-9 h-9", ...props }) {
  return (
    <svg
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`shrink-0 transition-transform duration-300 ${className}`}
      {...props}
    >
      {/* Top Left 360° Rotational Arc Mark */}
      <path
        d="M 22 13 A 22 22 0 0 1 33 9"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />

      {/* Top Right 360° Arrowhead Rotation Mark */}
      <path
        d="M 46 11 A 22 22 0 0 1 54 22"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
      />
      <polygon
        points="52,24 57,17 48,16"
        fill="currentColor"
      />

      {/* House Pitched Roof */}
      <path
        d="M 14 27.5 L 32 15.5 L 50 27.5"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Rounded Video Screen / Spatial Room Body Box */}
      <rect
        x="18"
        y="27.5"
        width="28"
        height="20"
        rx="4"
        stroke="currentColor"
        strokeWidth="3"
        strokeLinejoin="round"
        fill="none"
      />

      {/* Centered Solid Play Triangle Mark (▶) */}
      <polygon
        points="29,31.5 40,37.5 29,43.5"
        fill="currentColor"
      />
    </svg>
  );
}

export default function Logo({ className = "", size = "md" }) {
  const iconSizes = {
    sm: "w-8 h-8",
    md: "w-10 h-10",
    lg: "w-12 h-12",
  };

  return (
    <Link
      to="/"
      className={`inline-flex items-center justify-center group focus:outline-none shrink-0 ${className}`}
      aria-label="ViewRoom Home"
    >
      {/* Pure Standalone Vector SVG Logo Symbol (No Text) */}
      <ViewRoomLogoIcon className={`${iconSizes[size] || "w-10 h-10"} text-base-content group-hover:scale-105`} />
    </Link>
  );
}
