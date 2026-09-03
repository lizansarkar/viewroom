import React from 'react';

// Inline SVG Icons (Lucide/Heroicons style matching design)
const MailIcon = () => (
  <svg className="w-6 h-6 mb-3 text-[var(--app-text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
  </svg>
);

const PhoneIcon = () => (
  <svg className="w-6 h-6 mb-3 text-[var(--app-text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
  </svg>
);

const LocationIcon = () => (
  <svg className="w-6 h-6 mb-3 text-[var(--app-text-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.8" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
  </svg>
);

function Discover() {
  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] py-16 px-6 sm:px-12 lg:px-20 transition-colors duration-250">
      <div className="max-w-7xl mx-auto">
        {/* Header Content */}
        <div className="mb-12">
          <span className="text-xs sm:text-sm font-bold uppercase tracking-wider text-[var(--app-text-primary)] block mb-2">
            DISCOVER
          </span>
          <h2 className="text-3xl sm:text-5xl lg:text-6xl font-extrabold uppercase tracking-tight mb-4">
            FIND SPACES
          </h2>
          <p className="text-sm sm:text-base text-[var(--app-text-secondary)]">
            Search by location, type and price to find your next space.
          </p>
        </div>

        {/* Main Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-stretch">
          {/* Contact Details Left Column */}
          <div className="lg:col-span-4 flex flex-col justify-between space-y-8">
            {/* Email Section */}
            <div>
              <MailIcon />
              <h3 className="text-base font-bold uppercase tracking-tight mb-1">
                EMAIL
              </h3>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] mb-1">
                We reply within a day.
              </p>
              <a
                href="mailto:hello@viewroom.com"
                className="text-xs sm:text-sm font-semibold text-[var(--app-text-primary)] hover:underline cursor-pointer"
              >
                hello@viewroom.com
              </a>
            </div>

            {/* Phone Section */}
            <div>
              <PhoneIcon />
              <h3 className="text-base font-bold uppercase tracking-tight mb-1">
                PHONE
              </h3>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] mb-1">
                Talk to a real person.
              </p>
              <a
                href="tel:+15550000000"
                className="text-xs sm:text-sm font-semibold text-[var(--app-text-primary)] hover:underline cursor-pointer"
              >
                +1 (555) 000-0000
              </a>
            </div>

            {/* Office Section */}
            <div>
              <LocationIcon />
              <h3 className="text-base font-bold uppercase tracking-tight mb-1">
                OFFICE
              </h3>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] mb-4">
                123 Sample St, Sydney NSW 2000 AU
              </p>
              <a
                href="https://maps.google.com"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-[var(--app-text-primary)] hover:opacity-80 transition-opacity cursor-pointer"
              >
                Get Directions <span className="text-xs">&gt;</span>
              </a>
            </div>
          </div>

          {/* Image Right Column */}
          <div className="lg:col-span-8">
            <div className="w-full h-full min-h-[350px] sm:min-h-[450px] rounded-2xl overflow-hidden shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&q=80&w=1400"
                alt="Sydney Opera House structure"
                className="w-full h-full object-cover rounded-2xl"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Discover;