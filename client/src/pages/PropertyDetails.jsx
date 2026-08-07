import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { Eye, ArrowLeft, MapPin, Bed, Bath, Share2, Heart, Sparkles, Move3d } from 'lucide-react';

export default function PropertyDetails() {
  const { id } = useParams();

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-6">
      {/* Navigation Breadcrumb & Back */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 font-medium transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        <div className="flex items-center gap-2">
          <button className="p-2 rounded-xl glass-panel border border-slate-800 text-slate-400 hover:text-white transition-colors">
            <Share2 className="w-4 h-4" />
          </button>
          <button className="p-2 rounded-xl glass-panel border border-slate-800 text-slate-400 hover:text-rose-400 transition-colors">
            <Heart className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Property Title & Info */}
      <div className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider">
            360° Virtual Tour Ready
          </span>
          <span className="text-xs text-slate-400 flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-emerald-400" /> Malibu, California
          </span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
          Azure Horizon Luxury Villa
        </h1>
      </div>

      {/* 360° Tour Preview Container (Placeholder for Phase 4 Three.js Canvas) */}
      <div className="relative w-full h-[60vh] min-h-[420px] rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-950">
        <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/20 to-teal-400/20 border border-emerald-500/30 flex items-center justify-center mb-4 shadow-xl shadow-emerald-500/10">
          <Move3d className="w-10 h-10 text-emerald-400 animate-pulse" />
        </div>
        <h3 className="text-xl font-bold text-white mb-2">360° Virtual Tour Container</h3>
        <p className="text-slate-400 text-sm max-w-md mb-6">
          The Three.js WebGL spatial viewer and interactive scene hotspots will render here in Phase 4 & 5.
        </p>

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/90 border border-slate-800 text-xs text-slate-300">
          <Sparkles className="w-4 h-4 text-emerald-400" />
          <span>Interactive Scene Graph Connected</span>
        </div>
      </div>

      {/* Scene Navigation Strip Preview */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800/80 space-y-3">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Property Scenes (8 Available)
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {['Street View', 'Entrance', 'Living Room', 'Dining Room', 'Master Bedroom', 'Balcony'].map((scene, i) => (
            <button
              key={i}
              className={`p-3 rounded-xl border text-left transition-all ${
                i === 2
                  ? 'bg-emerald-500/10 border-emerald-500/50 text-emerald-400'
                  : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-semibold mb-1">
                <span>{scene}</span>
                {i === 2 && <Eye className="w-3 h-3 text-emerald-400" />}
              </div>
              <span className="text-[10px] text-slate-500">360 Panorama</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
