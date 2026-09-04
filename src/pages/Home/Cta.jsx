import React from 'react';
import Button from '../../components/reuseable/Button';

function Cta() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-20 px-6 sm:px-12 transition-colors duration-250">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center justify-center">
        
        {/* Main Heading */}
        <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-4 text-[var(--app-text-primary)]">
          READY TO STEP INSIDE?
        </h2>

        {/* Subtitle Description */}
        <p className="text-sm sm:text-base md:text-lg text-[var(--app-text-secondary)] max-w-2xl mb-8 leading-relaxed">
          Find a space, open the door and walk through it from wherever you are.
        </p>

        {/* Action Buttons */}
        <div className="flex items-center justify-center gap-4">
          {/* Explore Button */}
          <Button variant="primary">
            Explore
          </Button>

          {/* Create Button */}
          <Button variant="secondary">
            Create
          </Button>
        </div>

      </div>
    </section>
  );
}

export default Cta;