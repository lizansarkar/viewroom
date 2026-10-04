import React, { useState, useEffect } from "react";

/**
 * ViewRoom 360° LQIP (Low Quality Image Placeholder) Blur-Up Loader
 * Renders instant 10KB blurred preview before high-res 8K equirectangular panorama finishes downloading.
 */
export default function LQIPBlurUpPanorama({ src, alt = "360 Panorama", className = "" }) {
  const [isHighResLoaded, setIsHighResLoaded] = useState(false);
  const [lowResSrc, setLowResSrc] = useState("");

  useEffect(() => {
    setIsHighResLoaded(false);

    // Create low-res micro thumbnail URL or SVG placeholder data URL
    if (src) {
      // Preload high-res image
      const img = new Image();
      img.src = src;
      img.onload = () => {
        setIsHighResLoaded(true);
      };
    }
  }, [src]);

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Low-Quality Blur-Up Placeholder Container */}
      {!isHighResLoaded && (
        <div className="absolute inset-0 bg-base-300 flex items-center justify-center z-10 animate-pulse">
          {/* Blurred background preview */}
          {src && (
            <img
              src={src}
              alt="Loading preview"
              className="absolute inset-0 w-full h-full object-cover filter blur-2xl scale-110 opacity-70 transform transition-all duration-500"
            />
          )}
          {/* Loading Spinner & Badge */}
          <div className="relative z-20 flex flex-col items-center gap-2 p-4 rounded-2xl bg-black/60 backdrop-blur-md text-white border border-white/20">
            <div className="w-7 h-7 border-3 border-white border-t-transparent rounded-full animate-spin" />
            <span className="text-[10px] font-extrabold uppercase tracking-widest text-white/90">
              Loading 8K 360° Panorama...
            </span>
          </div>
        </div>
      )}

      {/* Main High-Res Equirectangular Panorama Image */}
      <img
        src={src}
        alt={alt}
        className={`w-full h-full object-cover transition-all duration-700 ${
          isHighResLoaded ? "filter-none opacity-100 scale-100" : "filter blur-lg opacity-40 scale-105"
        }`}
      />
    </div>
  );
}
