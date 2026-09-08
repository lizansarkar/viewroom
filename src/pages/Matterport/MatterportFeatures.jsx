import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTag, faRulerCombined, faCamera, faShareNodes } from '@fortawesome/free-solid-svg-icons';
import Button from '../ui/Button';

function MatterportFeatures() {
  const [activeFeature, setActiveFeature] = useState(0);

  const features = [
    {
      id: 0,
      icon: faTag,
      title: 'MATTERTAGS™',
      description: 'Embed text, links, audio, or video directly inside 3D locations to highlight product details or key architectural features.',
      image: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 1,
      icon: faRulerCombined,
      title: 'SPATIAL MEASUREMENT',
      description: 'Accurately measure floor plans, wall lengths, ceiling height, and room clearances directly from any desktop or mobile screen.',
      image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 2,
      icon: faCamera,
      title: 'HDR 4K PHOTOS',
      description: 'Automatically extract print-ready high-resolution photos, 360 panoramas, and floor plan schematics from a single scan.',
      image: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80'
    },
    {
      id: 3,
      icon: faShareNodes,
      title: 'EASY SHARING',
      description: 'Share exact room views via direct links, embed into property listings, or stream live walkthroughs with clients worldwide.',
      image: 'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80'
    }
  ];

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-24 px-4 sm:px-8 lg:px-16 border-t border-[var(--app-text-secondary)]/10">
      <div className="max-w-6xl mx-auto flex flex-col items-center">
        
        {/* Header Tag */}
        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[var(--app-text-secondary)] mb-4">
          CAPABILITIES
        </span>

        {/* Section Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-black uppercase tracking-tight text-center max-w-3xl leading-[1.08] mb-16 text-[var(--app-text-primary)]">
          INTELLIGENT SPATIAL TOOLS
        </h2>

        {/* Interactive Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 w-full items-center">
          
          {/* LEFT: Interactive Feature Selector List */}
          <div className="lg:col-span-5 flex flex-col gap-4">
            {features.map((item, index) => (
              <div
                key={item.id}
                onClick={() => setActiveFeature(index)}
                className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer flex flex-col ${
                  activeFeature === index
                    ? 'bg-[var(--app-text-primary)]/10 border-[var(--app-text-primary)] shadow-lg'
                    : 'bg-[var(--app-text-primary)]/5 border-[var(--app-text-secondary)]/20 hover:border-[var(--app-text-secondary)]/50'
                }`}
              >
                <div className="flex items-center gap-3 mb-2">
                  <FontAwesomeIcon
                    icon={item.icon}
                    className={`text-sm ${
                      activeFeature === index
                        ? 'text-[var(--app-text-primary)]'
                        : 'text-[var(--app-text-secondary)]'
                    }`}
                  />
                  <h3 className="text-sm font-black uppercase tracking-wider text-[var(--app-text-primary)]">
                    {item.title}
                  </h3>
                </div>

                <p className="text-xs text-[var(--app-text-secondary)] font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>
            ))}
          </div>

          {/* RIGHT: Dynamic Active Feature Preview */}
          <div className="lg:col-span-7 w-full">
            <div className="w-full aspect-[4/3] rounded-xl bg-[var(--app-text-primary)]/5 border border-[var(--app-text-secondary)]/20 overflow-hidden relative shadow-2xl transition-colors duration-250">
              
              {/* Feature Image */}
              <img
                src={features[activeFeature].image}
                alt={features[activeFeature].title}
                className="w-full h-full object-cover transition-all duration-500 scale-100 group-hover:scale-105"
              />

              {/* Hotspot Pulse Tag Effect */}
              <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 flex items-center justify-center">
                <span className="animate-ping absolute inline-flex h-8 w-8 rounded-full bg-white opacity-75"></span>
                <div className="relative w-4 h-4 rounded-full bg-white border-2 border-black flex items-center justify-center shadow-lg" />
              </div>

              {/* Bottom Overlay Information */}
              <div className="absolute bottom-0 inset-x-0 p-6 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white flex justify-between items-end">
                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-zinc-300">
                    Active Feature Mode
                  </span>
                  <h4 className="text-lg font-black uppercase tracking-wide">
                    {features[activeFeature].title}
                  </h4>
                </div>

                <Button variant="neutral" className="!text-white hover:!text-white">
                  Explore
                </Button>
              </div>

            </div>
          </div>

        </div>

      </div>
    </section>
  );
}

export default MatterportFeatures;