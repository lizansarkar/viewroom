import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import Button from '../../components/reuseable/Button';

function MatterportHowItWorks() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-20 px-4 sm:px-8 lg:px-16 overflow-hidden">
      <div className="max-w-6xl mx-auto flex flex-col items-center gap-0 md:gap-4">
        
        {/* Top Tag */}
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--app-text-secondary)] mb-4">
          INSIDE
        </span>

        {/* Main Title */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-center max-w-3xl leading-[1.08] mb-4 text-[var(--app-text-primary)]">
          THE DOOR OPENS BEFORE YOU ARRIVE
        </h2>

        {/* Subtitle */}
        <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] font-medium text-center max-w-xl mb-14 leading-relaxed">
          A photograph shows you a room. ViewRoom puts you in it.
        </p>

        {/* Asymmetric Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full">
          
          {/* LEFT TALL CARD (Scale / REAL SCALE) */}
          <div className="lg:col-span-5 bg-[var(--app-text-primary)]/1 rounded-xl overflow-hidden flex flex-col justify-between min-h-[520px] transition-colors duration-250">
            {/* Text Section */}
            <div className="p-8 sm:p-10 flex flex-col items-start justify-start">
              <span className="text-xs font-bold text-[var(--app-text-secondary)] mb-2">Scale</span>
              <h3 className="text-2xl sm:text-3xl font-black uppercase tracking-tight text-[var(--app-text-primary)] mb-4">
                REAL SCALE
              </h3>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] leading-relaxed mb-6 max-w-xs font-medium">
                See the true height of a ceiling and the actual distance between walls.
              </p>
              
              <Button variant="neutral" className="!p-0 hover:opacity-80 transition-opacity">
                <span className="text-xs font-bold text-[var(--app-text-primary)] flex items-center gap-1.5 cursor-pointer">
                  Look <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                </span>
              </Button>
            </div>

            {/* Media Section */}
            <div className="w-full aspect-[4/3] bg-[var(--app-text-primary)]/10 border-t border-[var(--app-text-secondary)]/20 relative overflow-hidden flex items-center justify-center">
              <img
                src="https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80"
                alt="Real Scale Preview"
                className="w-full h-full object-cover opacity-85 dark:opacity-75"
              />
            </div>
          </div>

          {/* RIGHT COLUMN (2 HORIZONTAL CARDS) */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* TOP HORIZONTAL CARD (Light / REAL LIGHT) */}
            <div className="bg-[var(--app-text-primary)]/1 rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 min-h-[250px] transition-colors duration-250">
              {/* Text Section */}
              <div className="p-8 flex flex-col justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-[var(--app-text-secondary)] mb-2 block">Light</span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--app-text-primary)] mb-3">
                    REAL LIGHT
                  </h3>
                  <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed max-w-xs font-medium">
                    Watch how the sun falls through a window at noon.
                  </p>
                </div>

                <Button variant="neutral" className="!p-0 mt-6">
                  <span className="text-xs font-bold text-[var(--app-text-primary)] flex items-center gap-1.5 cursor-pointer">
                    Look <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                  </span>
                </Button>
              </div>

              {/* Media Section */}
              <div className="bg-[var(--app-text-primary)]/10 border-t sm:border-t-0 sm:border-l border-[var(--app-text-secondary)]/20 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=800&q=80"
                  alt="Real Light Preview"
                  className="w-full h-full object-cover opacity-85 dark:opacity-75"
                />
              </div>
            </div>

            {/* BOTTOM HORIZONTAL CARD (Flow / REAL FLOW) */}
            <div className="bg-[var(--app-text-primary)]/1 rounded-xl overflow-hidden grid grid-cols-1 sm:grid-cols-2 min-h-[250px] transition-colors duration-250">
              {/* Text Section */}
              <div className="p-8 flex flex-col justify-between items-start">
                <div>
                  <span className="text-xs font-bold text-[var(--app-text-secondary)] mb-2 block">Flow</span>
                  <h3 className="text-xl sm:text-2xl font-black uppercase tracking-tight text-[var(--app-text-primary)] mb-3">
                    REAL FLOW
                  </h3>
                  <p className="text-xs text-[var(--app-text-secondary)] leading-relaxed max-w-xs font-medium">
                    Move from room to room and understand how a life fits.
                  </p>
                </div>

                <Button variant="neutral" className="!p-0 mt-6">
                  <span className="text-xs font-bold text-[var(--app-text-primary)] flex items-center gap-1.5 cursor-pointer">
                    Look <FontAwesomeIcon icon={faChevronRight} className="text-[10px]" />
                  </span>
                </Button>
              </div>

              {/* Media Section */}
              <div className="bg-[var(--app-text-primary)]/10 border-t sm:border-t-0 sm:border-l border-[var(--app-text-secondary)]/20 relative overflow-hidden flex items-center justify-center">
                <img
                  src="https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=800&q=80"
                  alt="Real Flow Preview"
                  className="w-full h-full object-cover opacity-85 dark:opacity-75"
                />
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default MatterportHowItWorks;