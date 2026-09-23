import React, { lazy, Suspense } from "react";
import { Routes, Route } from "react-router-dom";

// Fast Eager Loading for Core Homepage
import Home from "../pages/Home/Home";

// React.lazy Dynamic Route Code-Splitting for Heavy 360 & Dashboard Pages
const Explore = lazy(() => import("../pages/Explore/Explore"));
const Dashboard = lazy(() => import("../pages/Dashboard/Dashboard"));
const VirtualTour360 = lazy(() => import("../pages/VirtualTour/VirtualTour360"));
const Product360 = lazy(() => import("../pages/Product360/Product360"));
const Video360 = lazy(() => import("../pages/Video360/Video360"));
const Matterport = lazy(() => import("../pages/Matterport/Matterport"));
const Photography = lazy(() => import("../pages/Photography/Photography"));
const About = lazy(() => import("../pages/About/About"));
const Contact = lazy(() => import("../pages/Contact/Contact"));
const Auth = lazy(() => import("../pages/Auth/Auth"));

// Spatial Loading Spinner Fallback Component
function RouteLoadingFallback() {
  return (
    <div className="min-h-[70vh] w-full flex flex-col items-center justify-center bg-[var(--app-background)] text-[var(--app-text-primary)]">
      <div className="relative w-12 h-12 flex items-center justify-center mb-4">
        <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
        <span className="text-[10px] font-black text-cyan-400">360°</span>
      </div>
      <span className="text-xs font-bold uppercase tracking-widest text-[var(--app-text-secondary)] animate-pulse">
        Loading Spatial Experience...
      </span>
    </div>
  );
}

function AppRouter() {
  return (
    <Suspense fallback={<RouteLoadingFallback />}>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/360-virtual-tour" element={<VirtualTour360 />} />
        <Route path="/360-product" element={<Product360 />} />
        <Route path="/360-video" element={<Video360 />} />
        <Route path="/matterport" element={<Matterport />} />
        <Route path="/photography" element={<Photography />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/sign-in" element={<Auth />} />
        <Route path="/sign-up" element={<Auth />} />
      </Routes>
    </Suspense>
  );
}

export default AppRouter;
