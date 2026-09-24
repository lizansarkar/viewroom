import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ className = "", size = "md" }) {
  const sizeClasses = {
    sm: "h-8 sm:h-9",
    md: "h-10 sm:h-11",
    lg: "h-12 sm:h-14",
  };

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-3 group focus:outline-none shrink-0 ${className}`}
      aria-label="ViewRoom Home"
    >
      {/* User Uploaded Logo Image */}
      <div className={`relative ${sizeClasses[size] || "h-10"} w-auto flex items-center justify-center shrink-0`}>
        <img
          src="/logo.png"
          alt="ViewRoom Logo"
          className="h-full w-auto object-contain transition-transform duration-300 group-hover:scale-105"
        />
      </div>
    </Link>
  );
}
