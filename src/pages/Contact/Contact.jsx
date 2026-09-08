import React, { useState } from 'react';
import Button from '../../components/reuseable/Button';

function MailIcon() {
  return (
    <svg className="w-6 h-6 text-[var(--app-text-primary)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75v10.5a2.25 2.25 0 01-2.25 2.25h-15a2.25 2.25 0 01-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25m19.5 0v.243a2.25 2.25 0 01-1.07 1.916l-7.5 4.615a2.25 2.25 0 01-2.36 0L3.32 8.91a2.25 2.25 0 01-1.07-1.916V6.75" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg className="w-6 h-6 text-[var(--app-text-primary)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 6.75c0 8.284 6.716 15 15 15h2.25a2.25 2.25 0 002.25-2.25v-1.372c0-.516-.351-.966-.852-1.091l-4.423-1.106c-.44-.11-.902.055-1.173.417l-.97 1.293c-2.826-1.47-5.11-3.754-6.58-6.58l1.293-.97c.362-.271.527-.734.417-1.173L6.963 3.102a1.125 1.125 0 00-1.091-.852H4.5A2.25 2.25 0 002.25 4.5v2.25z" />
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg className="w-6 h-6 text-[var(--app-text-primary)] mb-3" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="1.8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
    </svg>
  );
}

function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
    acceptedTerms: false,
  });

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Form Submission Logic
  };

  return (
    <section className="w-full bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 py-16 sm:py-24 px-6 sm:px-12 lg:px-20">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="mb-12">
          <span className="text-xs font-extrabold uppercase tracking-widest text-[var(--app-text-secondary)] mb-3 block">
            CONTACT
          </span>
          <h2 className="text-4xl sm:text-6xl font-black uppercase tracking-tight mb-4 text-[var(--app-text-primary)]">
            TALK TO US
          </h2>
          <p className="text-sm sm:text-base text-[var(--app-text-secondary)] font-medium">
            Tell us about the space you want to explore.
          </p>
        </div>

        {/* Content Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* LEFT COLUMN: Contact Form */}
          <form onSubmit={handleSubmit} className="lg:col-span-7 flex flex-col gap-6">
            
            {/* Name Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="name" className="text-xs sm:text-sm font-semibold text-[var(--app-text-primary)]">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full bg-transparent border border-[var(--app-text-secondary)]/40 rounded-xl px-4 py-3.5 text-sm text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)] transition-colors"
                required
              />
            </div>

            {/* Email Input */}
            <div className="flex flex-col gap-2">
              <label htmlFor="email" className="text-xs sm:text-sm font-semibold text-[var(--app-text-primary)]">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full bg-transparent border border-[var(--app-text-secondary)]/40 rounded-xl px-4 py-3.5 text-sm text-[var(--app-text-primary)] focus:outline-none focus:border-[var(--app-text-primary)] transition-colors"
                required
              />
            </div>

            {/* Message Textarea */}
            <div className="flex flex-col gap-2">
              <label htmlFor="message" className="text-xs sm:text-sm font-semibold text-[var(--app-text-primary)]">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows="5"
                placeholder="Type your message"
                value={formData.message}
                onChange={handleChange}
                className="w-full bg-transparent border border-[var(--app-text-secondary)]/40 rounded-2xl px-4 py-3.5 text-sm text-[var(--app-text-primary)] placeholder-[var(--app-text-secondary)]/60 focus:outline-none focus:border-[var(--app-text-primary)] transition-colors resize-none"
                required
              ></textarea>
            </div>

            {/* Terms Checkbox */}
            <div className="flex items-center gap-3 my-1">
              <input
                type="checkbox"
                id="acceptedTerms"
                name="acceptedTerms"
                checked={formData.acceptedTerms}
                onChange={handleChange}
                className="w-4 h-4 rounded border-[var(--app-text-secondary)]/40 accent-[var(--app-text-primary)] cursor-pointer"
                required
              />
              <label htmlFor="acceptedTerms" className="text-xs sm:text-sm font-semibold text-[var(--app-text-primary)] cursor-pointer">
                I accept the terms
              </label>
            </div>

            {/* Submit Button */}
            <div className="pt-2">
              <Button type="submit" variant="primary" className="cursor-pointer">
                Submit
              </Button>
            </div>

          </form>

          {/* RIGHT COLUMN: Contact Details */}
          <div className="lg:col-span-5 flex flex-col gap-10 lg:pl-8">
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              {/* EMAIL */}
              <div className="flex flex-col">
                <MailIcon />
                <h4 className="text-sm font-extrabold uppercase tracking-wide text-[var(--app-text-primary)] mb-1">
                  EMAIL
                </h4>
                <p className="text-xs text-[var(--app-text-secondary)] mb-2 font-medium">
                  We reply within a day.
                </p>
                <a href="mailto:hello@viewroom.com" className="text-xs sm:text-sm font-medium text-[var(--app-text-primary)] underline hover:opacity-80 transition-opacity">
                  hello@viewroom.com
                </a>
              </div>

              {/* PHONE */}
              <div className="flex flex-col">
                <PhoneIcon />
                <h4 className="text-sm font-extrabold uppercase tracking-wide text-[var(--app-text-primary)] mb-1">
                  PHONE
                </h4>
                <p className="text-xs text-[var(--app-text-secondary)] mb-2 font-medium">
                  Talk to a real person.
                </p>
                <a href="tel:+15550000000" className="text-xs sm:text-sm font-medium text-[var(--app-text-primary)] hover:opacity-80 transition-opacity">
                  +1 (555) 000-0000
                </a>
              </div>
            </div>

            {/* OFFICE */}
            <div className="flex flex-col">
              <LocationIcon />
              <h4 className="text-sm font-extrabold uppercase tracking-wide text-[var(--app-text-primary)] mb-1">
                OFFICE
              </h4>
              <p className="text-xs sm:text-sm font-medium text-[var(--app-text-primary)] mb-3">
                123 Sample St, Sydney NSW 2000 AU
              </p>
              <a
                href="#directions"
                className="inline-flex items-center gap-1 text-xs sm:text-sm font-medium text-[var(--app-text-primary)] underline hover:opacity-80 transition-opacity"
              >
                Get directions &gt;
              </a>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
}

export default Contact;