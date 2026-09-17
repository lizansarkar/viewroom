import React from "react";
import Button from "../../components/reuseable/Button";

const steps = [
  {
    step: "01",
    title: "ON-SITE 8K CAPTURE",
    desc: "Our certified technicians scan every room using high-precision 8K panoramic camera systems.",
  },
  {
    step: "02",
    title: "HDR STITCHING & COLOR",
    desc: "Seamless 360-degree blending, lens distortion correction, and professional architectural color grading.",
  },
  {
    step: "03",
    title: "HOTSPOT & FLOOR MAP",
    desc: "Link doorway transitions, add interactive spec callouts, and integrate 2D radar floor plans.",
  },
  {
    step: "04",
    title: "WEB & VR PUBLISH",
    desc: "Embed directly on your site or share a instant web link accessible across desktop, mobile, & VR.",
  },
];

function VirtualTourWorkflow() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-16 px-6 sm:px-12 lg:px-20 border-t border-[var(--app-border)]/15 transition-colors duration-250">
      <div className="max-w-7xl mx-auto">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="font-heading text-xs font-bold tracking-[0.2em] uppercase text-[var(--app-text-secondary)] block mb-3">
            TOUR CREATION PROCESS
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-extrabold uppercase tracking-tight">
            HOW WE BRING YOUR SPACES TO LIFE
          </h2>
        </div>

        {/* 4 Step Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-12">
          {steps.map((s) => (
            <div
              key={s.step}
              className="bg-base-200/50 border border-[var(--app-border)]/20 p-8 rounded-2xl flex flex-col justify-between shadow-md hover:border-[var(--app-border)]/60 transition-all duration-300 group hover:scale-[1.02]"
            >
              <div>
                <span className="font-heading text-3xl font-black text-[var(--app-text-secondary)] opacity-40 block mb-4 group-hover:opacity-80 transition-opacity">
                  {s.step}
                </span>
                <h3 className="font-heading text-lg font-bold uppercase tracking-tight mb-3 text-[var(--app-text-primary)]">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] leading-relaxed">
                  {s.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Action Button */}
        <div className="flex justify-center">
          <Button variant="primary">Schedule a Virtual Tour Scan</Button>
        </div>

      </div>
    </section>
  );
}

export default VirtualTourWorkflow;
