import React from 'react';
import { Eye, Shield, Compass, Sparkles, Send, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-[#070b16] border-t border-slate-800/80 text-slate-400 pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20">
                <div className="w-full h-full bg-[#0a0f1d] rounded-[10px] flex items-center justify-center">
                  <Eye className="w-5 h-5 text-emerald-400" />
                </div>
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-xl tracking-tight text-white flex items-center gap-1.5">
                  VIEW<span className="text-emerald-400 font-extrabold">ROOM</span>
                </span>
                <span className="text-[10px] tracking-widest text-slate-400 uppercase font-medium">360° Spatial Platform</span>
              </div>
            </Link>
            <p className="text-sm text-slate-400 leading-relaxed max-w-sm">
              Explore physical spaces from anywhere in the world. Next-generation 360° virtual tours for luxury homes, hotels, offices, and commercial real estate.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <div className="flex items-center gap-2 text-xs text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Next-Gen WebGL Engine</span>
              </div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Explore Categories</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore?category=house" className="hover:text-emerald-400 transition-colors cursor-pointer">Luxury Houses</Link></li>
              <li><Link to="/explore?category=apartment" className="hover:text-emerald-400 transition-colors cursor-pointer">Modern Apartments</Link></li>
              <li><Link to="/explore?category=hotel" className="hover:text-emerald-400 transition-colors cursor-pointer">Hotels & Resorts</Link></li>
              <li><Link to="/explore?category=office" className="hover:text-emerald-400 transition-colors cursor-pointer">Corporate Offices</Link></li>
              <li><Link to="/explore?category=office" className="hover:text-emerald-400 transition-colors cursor-pointer">Commercial Buildings</Link></li>
            </ul>
          </div>

          {/* Platform Links */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Platform</h4>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/explore" className="hover:text-emerald-400 transition-colors cursor-pointer">360° Virtual Builder</Link></li>
              <li><Link to="/explore" className="hover:text-emerald-400 transition-colors cursor-pointer">For Property Owners</Link></li>
              <li><Link to="/explore" className="hover:text-emerald-400 transition-colors cursor-pointer">Pricing & Plans</Link></li>
              <li><Link to="/explore" className="hover:text-emerald-400 transition-colors cursor-pointer">Partner Dashboard</Link></li>
              <li><Link to="/explore" className="hover:text-emerald-400 transition-colors cursor-pointer">Security & RBAC</Link></li>
            </ul>
          </div>

          {/* Newsletter / Contact */}
          <div>
            <h4 className="text-white font-semibold text-sm tracking-wider uppercase mb-4">Stay Informed</h4>
            <p className="text-xs text-slate-400 mb-3">Subscribe to get notified when new virtual tours are listed.</p>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-2">
              <div className="relative">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <button
                  type="submit"
                  className="absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg bg-emerald-500 hover:bg-emerald-400 text-white transition-colors flex items-center justify-center cursor-pointer"
                  aria-label="Subscribe"
                >
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-slate-800/60 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© {new Date().getFullYear()} ViewRoom. All rights reserved. Immersive Virtual Property Exploration Platform.</p>
          <div className="flex items-center gap-6">
            <Link to="/explore" className="hover:text-slate-400 transition-colors cursor-pointer">Privacy Policy</Link>
            <Link to="/explore" className="hover:text-slate-400 transition-colors cursor-pointer">Terms of Service</Link>
            <Link to="/explore" className="hover:text-slate-400 transition-colors cursor-pointer">Cookie Preferences</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
