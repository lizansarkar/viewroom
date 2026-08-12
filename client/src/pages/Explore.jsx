import React, { useState, useEffect } from 'react';
import { Search, Compass, Eye, MapPin, Bed, Bath, ArrowUpRight } from 'lucide-react';
import { Link, useSearchParams } from 'react-router-dom';
import { MOCK_PROPERTIES } from '../data/mockProperties';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoryParam = searchParams.get('category') || 'all';

  const [selectedCategory, setSelectedCategory] = useState(categoryParam);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setSelectedCategory(categoryParam);
  }, [categoryParam]);

  const handleCategoryChange = (catId) => {
    setSelectedCategory(catId);
    if (catId === 'all') {
      searchParams.delete('category');
    } else {
      searchParams.set('category', catId);
    }
    setSearchParams(searchParams);
  };

  const filteredProperties = MOCK_PROPERTIES.filter((p) => {
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          p.location.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8">
      {/* Header section */}
      <div className="space-y-3">
        <h1 className="text-3xl sm:text-4xl font-bold text-white tracking-tight flex items-center gap-3">
          <Compass className="w-8 h-8 text-emerald-400" />
          Explore Virtual Spaces
        </h1>
        <p className="text-slate-400 text-sm sm:text-base max-w-2xl">
          Discover handpicked luxury properties, apartments, hotels, and office spaces with full 360° interactive tours.
        </p>
      </div>

      {/* Search & Filter Bar */}
      <div className="glass-panel p-4 rounded-2xl border border-slate-800 flex flex-col md:flex-row gap-4 justify-between items-center">
        {/* Search Input */}
        <div className="relative w-full md:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by title or location..."
            className="w-full bg-slate-900/90 border border-slate-700/80 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
          />
        </div>

        {/* Category Pill Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
          {[
            { id: 'all', label: 'All Spaces' },
            { id: 'house', label: 'Houses' },
            { id: 'apartment', label: 'Apartments' },
            { id: 'hotel', label: 'Hotels' },
            { id: 'office', label: 'Offices' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => handleCategoryChange(cat.id)}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 ${
                selectedCategory === cat.id
                  ? 'bg-emerald-500 text-white shadow-md shadow-emerald-500/20'
                  : 'bg-slate-900/60 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Property Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {filteredProperties.map((prop) => (
          <Link
            key={prop.id}
            to={`/property/${prop.id}/view`}
            className="glass-panel rounded-2xl border border-slate-800/80 overflow-hidden hover:border-emerald-500/40 transition-all duration-300 group flex flex-col justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
          >
            {/* Image & Badge */}
            <div className="relative h-56 overflow-hidden">
              <img
                src={prop.thumbnail}
                alt={prop.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md border border-slate-700/60 text-emerald-400 text-xs font-semibold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                {prop.badge}
              </div>
              <div className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-900/90 backdrop-blur-md text-slate-300 text-xs font-medium border border-slate-800">
                {prop.scenesCount} Scenes
              </div>
            </div>

            {/* Info Body */}
            <div className="p-5 space-y-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                    {prop.location}
                  </span>
                  <span className="font-semibold text-emerald-400 text-sm">{prop.price}</span>
                </div>
                <h3 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors line-clamp-1">
                  {prop.title}
                </h3>
              </div>

              <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between text-xs text-slate-400">
                <div className="flex items-center gap-4">
                  {prop.beds > 0 && (
                    <span className="flex items-center gap-1">
                      <Bed className="w-3.5 h-3.5 text-slate-400" /> {prop.beds} Beds
                    </span>
                  )}
                  <span className="flex items-center gap-1">
                    <Bath className="w-3.5 h-3.5 text-slate-400" /> {prop.baths} Baths
                  </span>
                </div>

                <span className="px-3.5 py-1.5 rounded-lg bg-emerald-500/10 group-hover:bg-emerald-500 text-emerald-400 group-hover:text-white text-xs font-semibold transition-all flex items-center gap-1 border border-emerald-500/30">
                  Enter Tour
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
