import React from "react";
import Button from "../../components/reuseable/Button";

/* Inline SVG icons matching project style */
const IconCameraHDR = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="13" r="4" />
  </svg>
);

const IconDoorwayHotspot = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M18 20V6a2 2 0 0 0-2-2H8a2 2 0 0 0-2 2v14" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M2 20h20" strokeLinecap="round" />
    <circle cx="14" cy="12" r="1" />
  </svg>
);

const IconRadarMap = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <polygon points="12 2 19 21 12 17 5 21 12 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconVrHeadset = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <rect x="2" y="6" width="20" height="12" rx="3" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="8" cy="12" r="2" />
    <circle cx="16" cy="12" r="2" />
    <path d="M10 18v2M14 18v2" strokeLinecap="round" />
  </svg>
);

const features = [
  {
    icon: IconCameraHDR,
    title: "PANORAMIC HDR SCANNING",
    description: "Multi-exposure 8K capture delivers true-to-life lighting balance across high-contrast indoor & outdoor environments.",
  },
  {
    icon: IconDoorwayHotspot,
    title: "ROOM-TO-ROOM HOTSPOTS",
    description: "Intuitive doorway hotspots allow visitors to step seamlessly from living areas to bedrooms and balconies.",
  },
  {
    icon: IconRadarMap,
    title: "RADAR FLOOR PLAN",
    description: "Live mini-map tracking camera orientation, sight lines, and exact location within the overall floor layout.",
  },
  {
    icon: IconVrHeadset,
    title: "CROSS-DEVICE IMMERSION",
    description: "Fully responsive HTML5 engine supporting desktop drag, mobile gyroscope tilt, and immersive WebVR mode.",
  },
];

function VirtualTourFeatures() {
  return (
    <section className="w-full bg-base-100 text-base-content px-4 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20 border-t border-[var(--app-border)]/15">
      <div className="max-w-7xl mx-auto">
        
        {/* Top: Header block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12 sm:mb-16">
          <div>
            <span className="font-heading text-xs font-bold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase">
              PLATFORM FEATURES
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.05] tracking-tight">
              Spatial Freedom. <br />
              Uncompromised Clarity.
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)] leading-relaxed lg:max-w-md">
              Virtual tours bridge the gap between imagination and reality. Allow buyers, guests, and clients to explore every floor, view every room, and feel the true volume of any space.
            </p>
          </div>
        </div>

        {/* Feature Columns */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-12 sm:mb-14">
          {features.map(({ icon: IconComponent, title, description }) => (
            <div key={title} className="flex flex-col items-start">
              <IconComponent className="h-8 w-8 mb-4 text-base-content" />
              <h3 className="font-heading text-sm sm:text-base font-bold uppercase tracking-tight mb-2 leading-snug">
                {title}
              </h3>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] leading-relaxed">
                {description}
              </p>
            </div>
          ))}
        </div>

        {/* Bottom Actions */}
        <div className="flex items-center gap-4">
          <Button variant="primary">Explore Platform</Button>
          <Button variant="neutral">View Demos</Button>
        </div>

      </div>
    </section>
  );
}

export default VirtualTourFeatures;
