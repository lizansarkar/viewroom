import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Eye, ArrowLeft, MapPin, Bed, Bath, Share2, Heart, Sparkles, Move3d, CheckCircle2, Play } from 'lucide-react';
import { getPropertyById } from '../data/mockProperties';
import Modal from '../components/common/Modal';

export default function PropertyDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const property = getPropertyById(id);

  const [isLiked, setIsLiked] = useState(false);
  const [showShareModal, setShowShareModal] = useState(false);
  const [selectedSceneId, setSelectedSceneId] = useState(property.defaultSceneId || 'living-room');

  const selectedScene = property.scenes.find((s) => s.id === selectedSceneId) || property.scenes[0];

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
    }
    setShowShareModal(true);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Navigation Breadcrumb & Actions */}
      <div className="flex items-center justify-between">
        <Link
          to="/explore"
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-emerald-400 font-medium transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg px-2 py-1"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Explore
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleShare}
            className="p-2.5 rounded-xl glass-panel border border-slate-800 text-slate-400 hover:text-white transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
            title="Share Property"
            aria-label="Share Property"
          >
            <Share2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => setIsLiked(!isLiked)}
            className={`p-2.5 rounded-xl glass-panel border transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
              isLiked
                ? 'border-rose-500/50 text-rose-500 bg-rose-500/10'
                : 'border-slate-800 text-slate-400 hover:text-rose-400'
            }`}
            title="Save to Favorites"
            aria-label="Save to Favorites"
          >
            <Heart className={`w-4 h-4 ${isLiked ? 'fill-current' : ''}`} />
          </button>
        </div>
      </div>

      {/* Property Title & Info */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div className="space-y-2">
          <div className="flex flex-wrap items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> 360° Virtual Tour Ready
            </span>
            <span className="text-xs text-slate-400 flex items-center gap-1">
              <MapPin className="w-3.5 h-3.5 text-emerald-400" /> {property.location}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white tracking-tight">
            {property.title}
          </h1>
        </div>

        <div className="flex flex-col items-start md:items-end">
          <span className="text-xs text-slate-400 uppercase tracking-wider font-semibold">Listing Price</span>
          <span className="text-2xl sm:text-3xl font-black text-emerald-400">{property.price}</span>
        </div>
      </div>

      {/* Hero 360° Tour Launch Container */}
      <div className="relative w-full h-[60vh] min-h-[420px] rounded-3xl overflow-hidden glass-panel border border-slate-800 shadow-2xl flex flex-col items-center justify-center text-center p-8 bg-slate-950 group">
        {/* Background Image Preview with Ambient Blur */}
        <div
          className="absolute inset-0 bg-cover bg-center opacity-40 group-hover:scale-105 transition-transform duration-700"
          style={{ backgroundImage: `url(${property.thumbnail})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent" />

        <div className="relative z-10 max-w-xl space-y-6 flex flex-col items-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-emerald-500/30 to-teal-400/30 border border-emerald-500/40 flex items-center justify-center shadow-xl shadow-emerald-500/20 animate-pulse">
            <Move3d className="w-10 h-10 text-emerald-400" />
          </div>

          <div className="space-y-2">
            <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Experience {selectedScene.name} in 360°
            </h3>
            <p className="text-slate-300 text-sm max-w-md mx-auto leading-relaxed">
              Step inside with full spatial 360° interaction. Drag to look around, zoom, and explore every room detail.
            </p>
          </div>

          <button
            onClick={() => navigate(`/property/${property.id}/view`)}
            className="px-8 py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-base transition-all duration-300 shadow-2xl shadow-emerald-500/35 flex items-center justify-center gap-3 cursor-pointer focus:outline-none focus:ring-4 focus:ring-emerald-500/50 hover:scale-105 active:scale-95"
          >
            <Play className="w-5 h-5 fill-current" />
            View in 360°
          </button>
        </div>
      </div>

      {/* Scene Navigation Strip */}
      <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 space-y-4">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 flex items-center gap-2">
            <Eye className="w-4 h-4 text-emerald-400" />
            Available Scenes ({property.scenes.length})
          </h4>
          <span className="text-xs text-slate-500">Click a scene to target 360° viewer</span>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {property.scenes.map((scene) => (
            <button
              key={scene.id}
              onClick={() => {
                setSelectedSceneId(scene.id);
                navigate(`/property/${property.id}/view`);
              }}
              className={`p-4 rounded-2xl border text-left transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 flex flex-col justify-between h-28 ${
                selectedSceneId === scene.id
                  ? 'bg-emerald-500/15 border-emerald-500/60 text-emerald-400 shadow-lg shadow-emerald-500/10'
                  : 'bg-slate-900/60 border-slate-800 text-slate-300 hover:border-slate-700 hover:bg-slate-800/50'
              }`}
            >
              <div className="flex items-center justify-between text-xs font-bold">
                <span className="line-clamp-1">{scene.name}</span>
                {selectedSceneId === scene.id && <Eye className="w-4 h-4 text-emerald-400 shrink-0" />}
              </div>

              <div className="flex items-center justify-between text-[11px] text-slate-400 mt-2">
                <span>360° Spatial</span>
                <span className="text-emerald-400 font-semibold flex items-center gap-0.5">
                  Launch <Play className="w-3 h-3 inline fill-current" />
                </span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Property Details Grid (Specs & Features) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pt-4">
        {/* Left Column: Specs & Overview */}
        <div className="lg:col-span-2 space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Property Overview</h3>
            <p className="text-slate-300 text-sm leading-relaxed">{property.description}</p>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-4 border-t border-slate-800">
              <div className="space-y-1">
                <span className="text-xs text-slate-400">Bedrooms</span>
                <p className="text-lg font-bold text-white flex items-center gap-1.5">
                  <Bed className="w-4 h-4 text-emerald-400" /> {property.beds} Beds
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400">Bathrooms</span>
                <p className="text-lg font-bold text-white flex items-center gap-1.5">
                  <Bath className="w-4 h-4 text-emerald-400" /> {property.baths} Baths
                </p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400">Total Area</span>
                <p className="text-lg font-bold text-white">{property.area}</p>
              </div>

              <div className="space-y-1">
                <span className="text-xs text-slate-400">Category</span>
                <p className="text-lg font-bold text-emerald-400 capitalize">{property.category}</p>
              </div>
            </div>
          </div>

          {/* Key Features */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-4">
            <h3 className="text-xl font-bold text-white tracking-tight">Features & Amenities</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {property.features.map((feature, i) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-300">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Column: Agent / Tour Action Box */}
        <div className="space-y-6">
          <div className="glass-panel p-6 rounded-3xl border border-slate-800 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-bold text-white">Virtual Tour Assistant</h3>
              <p className="text-xs text-slate-400">
                Experience full 360-degree spatial immersion. Switch between high-resolution scenes seamlessly.
              </p>
            </div>

            <button
              onClick={() => navigate(`/property/${property.id}/view`)}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-sm transition-all shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <Move3d className="w-5 h-5" />
              Launch 360° Viewer Now
            </button>
          </div>
        </div>
      </div>

      {/* Share Modal */}
      {showShareModal && (
        <Modal isOpen={true} onClose={() => setShowShareModal(false)} title="Share Virtual Tour">
          <div className="space-y-4">
            <p className="text-sm text-slate-300">
              Property tour link copied to clipboard! Share this link to allow anyone to experience the 360° virtual tour.
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setShowShareModal(false)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Close
              </button>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
