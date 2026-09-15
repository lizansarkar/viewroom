import React from "react";
import Button from "../../components/reuseable/Button";

/* Pure SVG Icons matching project style */
const IconSpin360 = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.85.83 6.72 2.24" strokeLinecap="round" />
    <path d="M21 3v6h-6" strokeLinecap="round" strokeLinejoin="round" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const IconTagSpec = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 0 1 0 2.828l-7 7a2 2 0 0 1-2.828 0l-7-7A1.994 1.994 0 0 1 3 12V7a4 4 0 0 1 4-4z" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconBox3D = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <path d="M12 3L2 8l10 5 10-5-10-5zM2 16l10 5 10-5M2 12l10 5 10-5" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const IconZapLightning = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" {...props}>
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const features = [
  {
    icon: IconSpin360,
    title: "360° SPIN CAPTURE",
    description: "Ultra high-resolution 36 to 72 frame smooth rotation sequences with automated turntable precision.",
  },
  {
    icon: IconTagSpec,
    title: "HOTSPOT ANNOTATIONS",
    description: "Embed interactive hotspots highlighting material specs, micro-stitching, and craft details.",
  },
  {
    icon: IconBox3D,
    title: "3D & AR EXPORT",
    description: "Convert physical products into USDZ & GLTF 3D models for instant mobile Augmented Reality preview.",
  },
  {
    icon: IconZapLightning,
    title: "LIGHTSPEED EMBED",
    description: "Lightweight HTML5 responsive viewer compatible with Shopify, WooCommerce, and custom React platforms.",
  },
];

function Product360Features() {
  return (
    <section className="w-full bg-base-100 text-base-content px-4 sm:px-6 lg:px-10 py-14 sm:py-16 lg:py-20 border-t border-[var(--app-border)]/15">
      <div className="max-w-7xl mx-auto">
        
        {/* Top: Header block */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-10 mb-12 sm:mb-16">
          <div>
            <span className="font-heading text-xs font-bold tracking-[0.2em] text-[var(--app-text-secondary)] uppercase">
              FEATURES & CAPABILITIES
            </span>
            <h2 className="mt-3 font-heading text-3xl sm:text-4xl lg:text-[2.75rem] font-extrabold leading-[1.05] tracking-tight">
              Built for Conversion. <br />
              Designed for Detail.
            </h2>
          </div>
          <div className="flex items-end">
            <p className="text-sm sm:text-base text-[var(--app-text-secondary)] leading-relaxed lg:max-w-md">
              Static photographs leave questions unanswered. Interactive 360° product spins let customers examine every angle, building buyer confidence and increasing sales.
            </p>
          </div>
        </div>

        {/* Feature Grid */}
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

        {/* Bottom CTA Actions */}
        <div className="flex items-center gap-4">
          <Button variant="primary">Explore Features</Button>
          <Button variant="neutral">Documentation</Button>
        </div>

      </div>
    </section>
  );
}

export default Product360Features;
