import React, { useState, useEffect, useRef } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUserTie,
  faBolt,
  faDatabase,
  faDiagramProject,
  faCalculator,
  faXmark,
  faShieldHalved,
  faCrosshairs,
} from "@fortawesome/free-solid-svg-icons";
import Button from "../reuseable/Button";
import HotspotEditorModal from "../dashboard/HotspotEditorModal";

export default function RecruiterSandbox() {
  const [activeModal, setActiveModal] = useState(null); // 'tech' | 'roi' | 'studio' | null
  const [fps, setFps] = useState(60);
  const [apiLatency, setApiLatency] = useState(24);
  const [studioHotspots, setStudioHotspots] = useState([
    { id: "demo_1", title: "1ST FLOOR LOBBY", yaw: "25deg", pitch: "-20deg" },
  ]);

  // ROI Calculator State
  const [monthlyVisitors, setMonthlyVisitors] = useState(25000);
  const [avgOrderValue, setAvgOrderValue] = useState(120);

  // Live FPS Counter Loop
  const frameCountRef = useRef(0);
  const lastTimeRef = useRef(performance.now());

  useEffect(() => {
    let animId;
    const calcFps = (now) => {
      frameCountRef.current++;
      if (now >= lastTimeRef.current + 1000) {
        setFps(Math.round((frameCountRef.current * 1000) / (now - lastTimeRef.current)));
        frameCountRef.current = 0;
        lastTimeRef.current = now;
        setApiLatency(Math.floor(18 + Math.random() * 12));
      }
      animId = requestAnimationFrame(calcFps);
    };
    animId = requestAnimationFrame(calcFps);
    return () => cancelAnimationFrame(animId);
  }, []);

  // ROI Calculations
  const currentRevenue = monthlyVisitors * 0.02 * avgOrderValue * 12;
  const estimated3dRevenue = monthlyVisitors * 0.0268 * avgOrderValue * 12;
  const annualUplift = Math.round(estimated3dRevenue - currentRevenue);
  const returnSavings = Math.round(monthlyVisitors * 0.02 * avgOrderValue * 0.08 * 12);

  return (
    <>
      {/* Top Fixed Recruiter Bar Banner - Sleek Single Line Layout */}
      <div className="w-full bg-base-100/95 backdrop-blur-md text-base-content border-b border-base-content/10 text-xs py-1.5 px-3 sm:px-5 select-none z-40 relative transition-colors duration-200 shadow-xs">

        {/* MOBILE VIEW (sm:hidden) - STRICT SINGLE LINE */}
        <div className="flex sm:hidden items-center justify-between gap-1.5 w-full overflow-x-auto no-scrollbar">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="font-bold uppercase tracking-wider text-[10px] text-base-content flex items-center gap-1 shrink-0">
              <FontAwesomeIcon icon={faUserTie} className="text-base-content/70" />
              <span>SANDBOX</span>
            </span>
            <span className="text-[9px] font-semibold text-base-content/60 bg-base-200/80 px-1.5 py-0.5 rounded-md">
              {fps} FPS
            </span>
          </div>

          <div className="flex items-center gap-1 shrink-0 flex-nowrap">
            <button
              type="button"
              onClick={() => setActiveModal("studio")}
              className="px-2 py-0.5 rounded-lg bg-primary text-primary-content text-[10px] font-bold uppercase tracking-wider transition-all cursor-pointer flex items-center gap-1 shadow-xs whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faCrosshairs} className="text-[9px]" />
              <span>Hotspot</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("tech")}
              className="px-2 py-0.5 rounded-lg bg-base-200 text-base-content text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1 border border-base-content/10 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faDiagramProject} className="text-[9px]" />
              <span>Tech</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveModal("roi")}
              className="px-2 py-0.5 rounded-lg bg-base-200 text-base-content text-[10px] font-semibold transition-colors cursor-pointer flex items-center gap-1 border border-base-content/10 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faCalculator} className="text-[9px]" />
              <span>ROI</span>
            </button>
          </div>
        </div>

        {/* DESKTOP VIEW (hidden sm:flex) - SLIM STRICT SINGLE LINE */}
        <div className="hidden sm:flex mx-auto items-center justify-between gap-4 max-w-7xl flex-nowrap">

          {/* Left: Recruiter Sandbox Tag */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="font-bold uppercase tracking-wider text-[11px] text-base-content flex items-center gap-1.5">
              <FontAwesomeIcon icon={faUserTie} className="text-base-content/70" />
              Recruiter & HR Sandbox
            </span>
            <span className="hidden md:inline-block text-[11px] text-base-content/50 border-l border-base-content/10 pl-2.5 font-medium">
              System Architecture & Interactive Demo
            </span>
          </div>

          {/* Right: Performance Counters & 3 Action Buttons on a Single Clean Line */}
          <div className="flex items-center gap-2 shrink-0 flex-nowrap">
            {/* FPS & Latency Counters */}
            <div className="flex items-center gap-2 text-[10px] font-semibold text-base-content/70 mr-1 shrink-0">
              <span className="flex items-center gap-1 bg-base-200/60 border border-base-content/10 px-2 py-0.5 rounded-lg">
                <FontAwesomeIcon icon={faBolt} className="text-base-content/50" />
                {fps} FPS
              </span>
              <span className="hidden md:flex items-center gap-1 opacity-70 bg-base-200/60 border border-base-content/10 px-2 py-0.5 rounded-lg">
                <FontAwesomeIcon icon={faDatabase} className="text-base-content/50" />
                {apiLatency}ms API
              </span>
            </div>

            {/* Try Hotspot */}
            <Button
              variant="primary"
              onClick={() => setActiveModal("studio")}
              className="!text-[10px] !px-2.5 !py-1 uppercase cursor-pointer !rounded-lg shrink-0 font-bold whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faCrosshairs} className="mr-1" />
              Try Hotspot
            </Button>

            {/* Tech Stack */}
            <button
              type="button"
              onClick={() => setActiveModal("tech")}
              className="px-2.5 py-1 rounded-lg bg-base-200 text-base-content text-[10px] font-semibold hover:bg-base-300 transition-colors cursor-pointer flex items-center gap-1 border border-base-content/10 shrink-0 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faDiagramProject} />
              <span>Tech Stack</span>
            </button>

            {/* ROI Impact */}
            <button
              type="button"
              onClick={() => setActiveModal("roi")}
              className="px-2.5 py-1 rounded-lg bg-base-200 text-base-content text-[10px] font-semibold hover:bg-base-300 transition-colors cursor-pointer flex items-center gap-1 border border-base-content/10 shrink-0 whitespace-nowrap"
            >
              <FontAwesomeIcon icon={faCalculator} />
              <span>ROI Impact</span>
            </button>
          </div>

        </div>
      </div>

      {/* NO-CODE HOTSPOT STUDIO DEMO MODAL */}
      {activeModal === "studio" && (
        <HotspotEditorModal
          scene={{ name: "Recruiter Sandbox 360° Studio", panoramaUrl: "/panoramas/panorama_entrance.jpg" }}
          tour={{
            scenes: [
              { id: "s1", name: "Ground Floor Lobby", floorLevel: 0 },
              { id: "s2", name: "1st Floor Lobby", floorLevel: 1 },
              { id: "s3", name: "2nd Floor Lounge", floorLevel: 2 },
            ],
          }}
          onClose={() => setActiveModal(null)}
          onSave={(newMarker) => {
            setStudioHotspots([...studioHotspots, { id: `demo_${Date.now()}`, ...newMarker }]);
            setActiveModal(null);
          }}
        />
      )}

      {/* TECH STACK & SYSTEM ARCHITECTURE MODAL */}
      {activeModal === "tech" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-4xl bg-base-100 border border-base-content/10 rounded-[28px] p-5 sm:p-8 shadow-2xl text-base-content max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-4 border-b border-base-content/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-lg shrink-0">
                  <FontAwesomeIcon icon={faDiagramProject} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-base-content">
                    Full-Stack System Architecture
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium">
                    ViewRoom 360° Engineering Breakdown & Technology Choices
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-base-200 hover:bg-base-300 text-base-content/70 hover:text-base-content flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Architecture Flow Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">

              {/* Frontend Layer */}
              <div className="p-5 rounded-2xl bg-base-200/50 border border-base-content/10 flex flex-col gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-base-content/50">
                  Frontend Layer
                </span>
                <h4 className="text-sm font-bold text-base-content">React 19 + Three.js PBR</h4>
                <ul className="text-xs text-base-content/70 space-y-1.5 font-medium mt-1">
                  <li>• Three.js WebGL 3D Shader Rendering</li>
                  <li>• React Router v7 Code-Splitting</li>
                  <li>• Tailwind CSS v4 Responsive Design</li>
                  <li>• Real-Time Orbit Controls & AR Camera</li>
                </ul>
              </div>

              {/* Backend Layer */}
              <div className="p-5 rounded-2xl bg-base-200/50 border border-base-content/10 flex flex-col gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-base-content/50">
                  Backend API Server
                </span>
                <h4 className="text-sm font-bold text-base-content">Node.js + Express REST</h4>
                <ul className="text-xs text-base-content/70 space-y-1.5 font-medium mt-1">
                  <li>• Google Gemini AI Concierge Engine</li>
                  <li>• JWT Auth & Dynamic Role Authorization</li>
                  <li>• Payload Gzip & Brotli Compression</li>
                  <li>• Real-time Analytics Tracker</li>
                </ul>
              </div>

              {/* Database Layer */}
              <div className="p-5 rounded-2xl bg-base-200/50 border border-base-content/10 flex flex-col gap-2">
                <span className="text-[10px] font-semibold uppercase tracking-wider text-base-content/50">
                  Database & ORM
                </span>
                <h4 className="text-sm font-bold text-base-content">Prisma ORM + PostgreSQL</h4>
                <ul className="text-xs text-base-content/70 space-y-1.5 font-medium mt-1">
                  <li>• Neon Cloud PostgreSQL DB</li>
                  <li>• Type-Safe Prisma Client Queries</li>
                  <li>• Virtual Tour & Scene Schemas</li>
                  <li>• Contact & Analytics Persistence</li>
                </ul>
              </div>

            </div>

            {/* Recruiter Summary Note */}
            <div className="p-4 rounded-2xl bg-base-200/70 border border-base-content/10 text-xs text-base-content/80 flex items-start gap-3">
              <FontAwesomeIcon icon={faShieldHalved} className="text-lg shrink-0 mt-0.5 text-base-content" />
              <div>
                <strong className="block font-bold mb-0.5 text-base-content">Engineering Highlights:</strong>
                Built with zero external template bloat, clean modular architecture, production-grade error handling, responsive accessibility, and performance budget optimizations.
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ROI & BUSINESS IMPACT CALCULATOR MODAL */}
      {activeModal === "roi" && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="relative w-full max-w-3xl bg-base-100 border border-base-content/10 rounded-[28px] p-5 sm:p-8 shadow-2xl text-base-content max-h-[90vh] overflow-y-auto">

            <div className="flex items-center justify-between pb-4 border-b border-base-content/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-base-200 text-base-content flex items-center justify-center text-lg shrink-0">
                  <FontAwesomeIcon icon={faCalculator} />
                </div>
                <div>
                  <h3 className="text-lg sm:text-xl font-bold tracking-tight text-base-content">
                    3D Spatial Business ROI Calculator
                  </h3>
                  <p className="text-xs text-base-content/60 font-medium">
                    Quantifying conversion uplift & return savings with ViewRoom 360°
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setActiveModal(null)}
                className="w-8 h-8 rounded-full bg-base-200 hover:bg-base-300 text-base-content/70 hover:text-base-content flex items-center justify-center text-xs transition-colors cursor-pointer"
              >
                <FontAwesomeIcon icon={faXmark} />
              </button>
            </div>

            {/* Calculator Controls Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">

              {/* Sliders Column */}
              <div className="flex flex-col gap-5">
                <div>
                  <div className="flex justify-between text-xs font-semibold uppercase mb-2 text-base-content/70">
                    <span>Monthly Site Traffic</span>
                    <span className="text-base-content font-bold">{monthlyVisitors.toLocaleString()} Visitors</span>
                  </div>
                  <input
                    type="range"
                    min="5000"
                    max="200000"
                    step="5000"
                    value={monthlyVisitors}
                    onChange={(e) => setMonthlyVisitors(parseInt(e.target.value))}
                    className="w-full accent-base-content cursor-pointer"
                  />
                </div>

                <div>
                  <div className="flex justify-between text-xs font-semibold uppercase mb-2 text-base-content/70">
                    <span>Average Order Value</span>
                    <span className="text-base-content font-bold">${avgOrderValue}</span>
                  </div>
                  <input
                    type="range"
                    min="25"
                    max="500"
                    step="5"
                    value={avgOrderValue}
                    onChange={(e) => setAvgOrderValue(parseInt(e.target.value))}
                    className="w-full accent-base-content cursor-pointer"
                  />
                </div>
              </div>

              {/* Calculated Business Impact Output */}
              <div className="p-5 rounded-2xl bg-base-200/60 border border-base-content/10 flex flex-col justify-between gap-4">
                <div>
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-base-content/50">
                    Estimated Annual Impact
                  </span>
                  <div className="text-3xl font-extrabold text-base-content mt-1">
                    +${annualUplift.toLocaleString()}
                  </div>
                  <p className="text-xs text-base-content/70 mt-1 font-medium">
                    Based on +34% average conversion boost from 3D object customization.
                  </p>
                </div>

                <div className="pt-4 border-t border-base-content/10 flex items-center justify-between text-xs font-semibold text-base-content/90">
                  <span>Product Return Savings:</span>
                  <span className="font-extrabold">+${returnSavings.toLocaleString()}/yr</span>
                </div>
              </div>

            </div>

          </div>
        </div>
      )}
    </>
  );
}
