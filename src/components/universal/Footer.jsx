import React from 'react'
import { Link } from 'react-router-dom'

function Footer() {
  const year = new Date().getFullYear()

  const columns = [
    {
      title: 'Explore',
      links: [
        { label: 'Home', to: '/' },
        { label: 'Properties', to: '/properties' },
        { label: 'Hotels', to: '/hotels' },
        { label: 'Virtual tours', to: '/tours' },
        { label: 'Search', to: '/search' },
      ],
    },
    {
      title: 'Create',
      links: [
        { label: 'Create a tour', to: '/create' },
        { label: 'For owners', to: '/for-owners' },
        { label: 'How it works', to: '/how-it-works' },
        { label: 'Pricing', to: '/pricing' },
        { label: 'Sign in', to: '/sign-in' },
      ],
    },
    {
      title: 'Company',
      links: [
        { label: 'About', to: '/about' },
        { label: 'Contact', to: '/contact' },
        { label: 'Careers', to: '/careers' },
        { label: 'Press', to: '/press' },
        { label: 'Blog', to: '/blog' },
      ],
    },
    {
      title: 'Legal',
      links: [
        { label: 'Privacy', to: '/privacy' },
        { label: 'Terms', to: '/terms' },
        { label: 'Cookies', to: '/cookies' },
        { label: 'Licenses', to: '/licenses' },
        { label: 'Settings', to: '/settings' },
      ],
    },
    {
      title: 'Social',
      links: [
        { label: 'Instagram', href: 'https://instagram.com' },
        { label: 'X', href: 'https://x.com' },
        { label: 'YouTube', href: 'https://youtube.com' },
        { label: 'LinkedIn', href: 'https://linkedin.com' },
        { label: 'Facebook', href: 'https://facebook.com' },
      ],
    },
    {
      title: 'Get started',
      links: [
        { label: 'Explore 360°', to: '/explore' },
        { label: 'Create a tour', to: '/create' },
        { label: 'Sign in', to: '/sign-in' },
        { label: 'Help center', to: '/help' },
        { label: 'Contact', to: '/contact' },
      ],
    },
  ]

  const avatars = [
    'https://i.pravatar.cc/64?img=12',
    'https://i.pravatar.cc/64?img=32',
    'https://i.pravatar.cc/64?img=45',
    'https://i.pravatar.cc/64?img=8',
  ]

  const socialIcons = [
    {
      label: 'Facebook',
      href: 'https://facebook.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M13.5 21v-8.06h2.7l.4-3.14h-3.1V7.87c0-.91.25-1.53 1.56-1.53h1.66V3.53A22.4 22.4 0 0 0 14 3.4c-2.4 0-4.05 1.47-4.05 4.16v2.32H7.24v3.14h2.71V21h3.55Z" />
        </svg>
      ),
    },
    {
      label: 'Instagram',
      href: 'https://instagram.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" className="h-4 w-4">
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="3.6" />
          <circle cx="17.2" cy="6.8" r="1" fill="currentColor" stroke="none" />
        </svg>
      ),
    },
    {
      label: 'X',
      href: 'https://x.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M18.9 3H21l-6.6 7.6L22 21h-6.6l-5-6.3L4.5 21H2.4l7.1-8.2L2 3h6.7l4.6 5.8L18.9 3Zm-1.2 16h1.2L7.4 5H6.1l11.6 14Z" />
        </svg>
      ),
    },
    {
      label: 'LinkedIn',
      href: 'https://linkedin.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M6.94 8.5H4v11h2.94v-11ZM5.47 3.5A1.75 1.75 0 1 0 5.47 7a1.75 1.75 0 0 0 0-3.5ZM20 13.3c0-3-1.6-4.4-3.74-4.4-1.72 0-2.49.95-2.92 1.62V8.5H10.4c.04.85 0 11 0 11h2.94v-6.14c0-.33.02-.66.12-.9.26-.66.86-1.34 1.87-1.34 1.32 0 1.85.99 1.85 2.45V19.5H20v-6.2Z" />
        </svg>
      ),
    },
    {
      label: 'YouTube',
      href: 'https://youtube.com',
      icon: (
        <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
          <path d="M22 12c0-2.6-.2-4-.6-4.9-.3-.6-.8-1.1-1.4-1.4C18.9 5.2 12 5.2 12 5.2s-6.9 0-8 .5c-.6.3-1.1.8-1.4 1.4C2.2 8 2 9.4 2 12s.2 4 .6 4.9c.3.6.8 1.1 1.4 1.4 1.1.5 8 .5 8 .5s6.9 0 8-.5c.6-.3 1.1-.8 1.4-1.4.4-.9.6-2.3.6-4.9Zm-11.9 3.2V8.8l5.4 3.2-5.4 3.2Z" />
        </svg>
      ),
    },
  ]

  return (
    <footer className="bg-base-100 text-base-content">
      <div className="max-w-full mx-auto px-6 sm:px-8 lg:px-10 pt-14 pb-8">
        {/* Link columns */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-x-6 gap-y-10">
          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="font-heading text-sm font-bold mb-4">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-3">
                {col.links.map((item) => (
                  <li key={item.label}>
                    {item.to ? (
                      <Link
                        to={item.to}
                        className="link link-hover text-sm text-[var(--app-text-secondary)] hover:text-base-content transition-colors"
                      >
                        {item.label}
                      </Link>
                    ) : (
                      <a
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="link link-hover text-sm text-[var(--app-text-secondary)] hover:text-base-content transition-colors"
                      >
                        {item.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Logo + avatar group row */}
        <div className="flex items-center justify-between mt-14 mb-6">
          <Link
            to="/"
            className="font-['cursive'] italic text-3xl font-semibold tracking-tight"
            style={{ fontFamily: "'Brush Script MT', cursive" }}
          >
            Logo
          </Link>

          <div className="flex -space-x-3">
            {avatars.map((src, i) => (
              <img
                key={i}
                src={src}
                alt=""
                className="h-9 w-9 rounded-full ring-2 ring-base-100 object-cover"
              />
            ))}
          </div>
        </div>

        {/* Divider */}
        <div className="h-px w-full bg-[var(--app-border)]/25" />

        {/* Bottom bar */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-4 pt-6">
          <p className="text-xs text-[var(--app-text-secondary)] text-center sm:text-left">
            &copy; {year} ViewRoom. All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            {socialIcons.map((s) => (
              <a
                key={s.label}
                href={s.href}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={s.label}
                className="text-[var(--app-text-secondary)] hover:text-base-content transition-colors"
              >
                {s.icon}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer