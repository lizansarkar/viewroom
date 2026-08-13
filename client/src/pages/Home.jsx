import React from 'react';
import { Compass, Eye, Sparkles, ArrowRight, ShieldCheck, MapPin, Building, Home as HomeIcon, Hotel } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Home() {
  const categories = [
    { id: 'house', title: 'Luxury Houses', icon: HomeIcon, count: '142 Spaces', color: 'from-emerald-500/20 to-teal-500/20', border: 'border-emerald-500/30' },
    { id: 'apartment', title: 'Modern Apartments', icon: Building, count: '98 Spaces', color: 'from-blue-500/20 to-cyan-500/20', border: 'border-blue-500/30' },
    { id: 'hotel', title: 'Hotels & Resorts', icon: Hotel, count: '64 Spaces', color: 'from-amber-500/20 to-orange-500/20', border: 'border-amber-500/30' },
    { id: 'office', title: 'Corporate Offices', icon: Compass, count: '51 Spaces', color: 'from-purple-500/20 to-indigo-500/20', border: 'border-purple-500/30' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center justify-center px-4 sm:px-6 lg:px-8 py-20 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10 space-y-8">

          {/* Heading */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight leading-[1.1]">
            Step Inside Physical Spaces <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 bg-clip-text text-transparent">
              Without Leaving Home
            </span>
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-lg sm:text-xl text-slate-300 font-normal leading-relaxed">
            Experience ultra-immersive 360-degree spatial navigation across luxury houses, penthouses, hotels, and office buildings.
          </p>

          {/* CTA Group */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              to="/explore"
              className="w-full sm:w-auto px-8 py-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base transition-all duration-300 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              <Eye className="w-5 h-5 text-white group-hover:scale-110 transition-transform" />
              Explore 360° Properties
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#categories"
              className="w-full sm:w-auto px-8 py-4 rounded-xl glass-panel border border-slate-700/80 hover:border-slate-600 text-slate-200 font-semibold text-base transition-all flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            >
              Browse Categories
            </a>
          </div>

          {/* Key Metrics (Non-interactive stats) */}
          <div className="pt-16 grid grid-cols-2 md:grid-cols-4 gap-6 border-t border-slate-800/80 max-w-4xl mx-auto">
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white">360°</p>
              <p className="text-xs text-slate-400 font-medium">Spatial Panoramas</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-emerald-400">4K</p>
              <p className="text-xs text-slate-400 font-medium">Ultra-HD Quality</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-white">0s</p>
              <p className="text-xs text-slate-400 font-medium">Instant Hotspot Transitions</p>
            </div>
            <div className="space-y-1">
              <p className="text-3xl font-extrabold text-amber-400">100%</p>
              <p className="text-xs text-slate-400 font-medium">Mobile Responsive</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Grid Section */}
      <section id="categories" className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center space-y-3 mb-12">
          <h2 className="text-3xl font-bold text-white tracking-tight">Explore By Property Type</h2>
          <p className="text-slate-400 text-sm max-w-lg mx-auto">
            Select a category to jump directly into curated 360-degree virtual room tours.
          </p>
        </div>
      </section>
    </div>
  );
}
