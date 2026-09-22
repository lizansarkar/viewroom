import React from "react";
import { Link } from "react-router-dom";

export default function Logo({ className = "", showText = true, size = "md" }) {
  const sizeClasses = {
    sm: "h-7 w-7",
    md: "h-9 w-9",
    lg: "h-12 w-12",
  };

  const textClasses = {
    sm: "text-lg",
    md: "text-2xl",
    lg: "text-3xl",
  };

  return (
    <Link
      to="/"
      className={`inline-flex items-center gap-2.5 group focus:outline-none shrink-0 ${className}`}
      aria-label="ViewRoom Home"
    >
      {/* 360° ViewRoom Logo Symbol */}
      <div className={`relative ${sizeClasses[size] || "h-9 w-9"} flex items-center justify-center shrink-0`}>
        <img
          src="/logo.png"
          alt="ViewRoom Logo"
          className="w-full h-full object-contain rounded-full shadow-md group-hover:scale-105 transition-transform duration-300"
        />
      </div>

      {/* Brand Name Typography */}
      {showText && (
        <span
          className={`font-black tracking-tight uppercase font-heading ${textClasses[size] || "text-2xl"} bg-gradient-to-r from-base-content via-cyan-400 to-primary bg-clip-text text-transparent`}
        >
          VIEW<span className="font-light text-cyan-400">ROOM</span>
        </span>
      )}
    </Link>
  );
}
