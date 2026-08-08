import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Eye, Menu, X, PlusCircle, User, Sparkles, Info } from 'lucide-react';
import Modal from '../common/Modal';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [modalContent, setModalContent] = useState(null);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  const navLinks = [
    { name: 'Explore', path: '/explore' },
    { name: 'Featured Tours', path: '/explore' },
    { name: 'Categories', path: '/#categories' },
    { name: 'Design System', path: '/design-system' },
  ];

  const handleSignIn = () => {
    setModalContent({
      title: 'Authentication Coming Soon',
      body: 'User login & registration will be connected in Phase 6. For now, enjoy exploring 360° virtual property tours freely without an account!',
    });
  };

  const handleListProperty = () => {
    setModalContent({
      title: 'Property Listing Portal',
      body: 'Owner dashboard & 360° tour builder will be unlocked in Phase 7. Stay tuned!',
    });
  };

  return (
    <>
      <header className="sticky top-0 z-50 w-full glass-panel border-b border-slate-800/60 bg-[#0a0f1d]/85 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl p-1">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 p-0.5 shadow-lg shadow-emerald-500/20 group-hover:scale-105 transition-transform duration-300">
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

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`text-sm font-medium transition-colors hover:text-emerald-400 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-lg px-2 py-1 ${
                    isActive(link.path) ? 'text-emerald-400 font-semibold' : 'text-slate-300'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-4">
              <Link
                to="/explore"
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 rounded-xl"
              >
                <Compass className="w-4 h-4 text-emerald-400" />
                Browse Spaces
              </Link>

              <button
                onClick={handleSignIn}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white rounded-lg hover:bg-slate-800/60 transition-all flex items-center gap-2 border border-slate-700/50 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <User className="w-4 h-4 text-slate-400" />
                Sign In
              </button>

              <button
                onClick={handleListProperty}
                className="px-4 py-2.5 text-sm font-semibold text-white rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 transition-all shadow-md shadow-emerald-500/25 flex items-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
              >
                <PlusCircle className="w-4 h-4" />
                List Property
              </button>
            </div>

            {/* Mobile menu button */}
            <div className="flex md:hidden items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2.5 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500"
                aria-label="Toggle Navigation Menu"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Drawer */}
        {mobileMenuOpen && (
          <div className="md:hidden border-b border-slate-800 bg-[#0a0f1d] px-4 pt-2 pb-6 space-y-4">
            <div className="flex flex-col space-y-3 pt-2">
              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`px-3 py-2 rounded-lg text-base font-medium transition-colors cursor-pointer ${
                    isActive(link.path) ? 'bg-emerald-500/10 text-emerald-400' : 'text-slate-300 hover:bg-slate-800/50'
                  }`}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="pt-4 border-t border-slate-800/80 flex flex-col gap-3">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleSignIn();
                }}
                className="w-full py-3 px-4 rounded-xl border border-slate-700 text-slate-200 hover:bg-slate-800/60 font-medium text-sm flex items-center justify-center gap-2 cursor-pointer"
              >
                <User className="w-4 h-4" />
                Sign In
              </button>
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  handleListProperty();
                }}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 font-semibold text-white text-sm shadow-md shadow-emerald-500/20 flex items-center justify-center gap-2 cursor-pointer"
              >
                <PlusCircle className="w-4 h-4" />
                List Property
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Info Feedback Modal */}
      {modalContent && (
        <Modal isOpen={true} onClose={() => setModalContent(null)} title={modalContent.title}>
          <div className="space-y-4">
            <p className="text-sm text-slate-300 leading-relaxed">{modalContent.body}</p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => setModalContent(null)}
                className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-white font-semibold text-xs transition-colors cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </Modal>
      )}
    </>
  );
}
