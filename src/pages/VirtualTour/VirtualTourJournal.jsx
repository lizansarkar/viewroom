import React, { useState } from "react";
import { Link } from "react-router-dom";

function LinkIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4" {...props}>
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}

function LinkedInIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.25V10.9H6.46M7.86 6.77a1.63 1.63 0 1 0 0 3.26 1.63 1.63 0 0 0 0-3.26Z" />
    </svg>
  );
}

function XIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

function FacebookIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4" {...props}>
      <path d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H7.5v-3H10V9.69c0-2.47 1.47-3.83 3.72-3.83 1.08 0 2.2.19 2.2.19v2.42h-1.24c-1.23 0-1.61.76-1.61 1.54V12h2.72l-.43 3h-2.29v6.8c4.56-.93 8-4.96 8-9.8z" />
    </svg>
  );
}

function ChevronRightIcon(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-3.5 h-3.5" {...props}>
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

export default function VirtualTourJournal() {
  const [copied, setCopied] = useState(false);

  const handleCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const shareUrls = {
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(window.location.href)}`,
    twitter: `https://twitter.com/intent/tweet?url=${encodeURIComponent(window.location.href)}&text=${encodeURIComponent("A room is not a photograph. Step inside ViewRoom 360°.")}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`,
  };

  return (
    <article className="w-full py-16 sm:py-24 bg-[var(--app-background)] text-[var(--app-text-primary)] transition-colors duration-250 select-text border-t border-[var(--app-border)]/15">
      <div className="max-w-3xl mx-auto px-5 sm:px-8">
        
        {/* Top Header Navigation & Social Actions */}
        <div className="flex items-center justify-between pb-10 sm:pb-14 text-sm">
          {/* Breadcrumb Navigation */}
          <div className="flex items-center gap-2 font-medium text-[var(--app-text-secondary)]">
            <span className="hover:text-[var(--app-text-primary)] transition-colors cursor-pointer">
              Journal
            </span>
            <ChevronRightIcon className="text-[var(--app-text-secondary)]/60" />
            <span className="font-semibold text-[var(--app-text-primary)]">
              Spaces
            </span>
          </div>

          {/* Top Social Action Buttons */}
          <div className="flex items-center gap-3.5 text-[var(--app-text-secondary)]">
            <button
              onClick={handleCopyLink}
              aria-label="Copy link"
              title="Copy link"
              className="hover:text-[var(--app-text-primary)] transition-colors relative p-1 cursor-pointer"
            >
              <LinkIcon />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-base-content text-base-100 text-[10px] font-bold whitespace-nowrap shadow-md animate-fadeIn">
                  Link Copied!
                </span>
              )}
            </button>
            <a
              href={shareUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="hover:text-[var(--app-text-primary)] transition-colors p-1"
            >
              <LinkedInIcon />
            </a>
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X (Twitter)"
              className="hover:text-[var(--app-text-primary)] transition-colors p-1"
            >
              <XIcon />
            </a>
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="hover:text-[var(--app-text-primary)] transition-colors p-1"
            >
              <FacebookIcon />
            </a>
          </div>
        </div>

        {/* Narrative Essay Content Body */}
        <div className="space-y-7 text-base sm:text-[17px] leading-[1.75] font-normal text-[var(--app-text-primary)]/90 tracking-[0.01em]">
          
          <p>
            A room is not a photograph. A photograph flattens the light and lies about the distance. It shows you a corner and calls it a home. We built ViewRoom because we were tired of being lied to by wide angles and bright edits. We wanted to stand in the middle of a room and look up. To walk from the entrance to the kitchen and know if the morning sun actually reaches the counter. To feel the ceiling height without a tape measure. So we made a place where you can do that. A place where the door opens before you arrive.
          </p>

          <p>
            The first time you step into a ViewRoom panorama, something shifts. You drag the image and the room turns with you. The floor stays under your feet. The walls hold their true distance. You look at a doorway and you know, without being told, that the bedroom is just beyond it. You click the hotspot and you are there. No loading screen. No menu. Just the next room. The space moves the way a space should move. Quietly. Honestly. At your pace.
          </p>

          <p>
            This is not a video game. There are no points and no music. There is only the room and you. The light falls where it falls. The floor runs to the wall. The window shows the real view, not the one the agent wanted you to see. You can stand in the living room for an hour. You can move through the whole house in three minutes. No one is waiting for you. No one is talking. It is the closest thing to being alone in a place you have never been.
          </p>

          {/* Featured Pull Quote Callout */}
          <blockquote className="my-10 sm:my-12 py-3 px-1 text-lg sm:text-xl font-heading font-bold tracking-tight text-[var(--app-text-primary)] border-l-2 border-primary pl-5 italic">
            "A photograph shows you a room. ViewRoom puts you in it. That is the whole idea."
          </blockquote>

          <p>
            We started with homes because homes are where the lies hurt the most. You drive across town for a viewing. You walk in and the living room is half the size it looked online. The ceiling is low. The light is wrong. You have wasted an afternoon and you still do not have a home. With ViewRoom, you know before you go. You have already walked the floor. You have already stood in the bedroom and looked out the window. You arrive with knowledge, not hope.
          </p>

          <p>
            Hotels came next. A hotel room is a promise made in photographs. The lobby is always grand. The room is always bright. But the walk from the lobby to the room is never shown. The view from the window is never the one in the picture. With ViewRoom, you can walk that hallway. You can stand at the window and see the real street below. You can know if the room is worth the price before you hand over your card.
          </p>

          <p>
            Then came the smaller spaces. The studio apartment. The office. The single room for rent. These are the spaces where scale matters most. A wide-angle lens can make a closet look like a bedroom. A panorama cannot. The truth is in the geometry. The walls do not move. The floor does not stretch. You see the space as it is, and you decide if it fits your life.
          </p>

          <p>
            The technology is simple to describe and hard to build. We take 360° images and stitch them into a continuous space. We place hotspots at the doors and openings. We connect the rooms so you can move through them without breaking the illusion. The result is a single walkable tour that feels like a place, not a slideshow. It works on your phone. It works on your laptop. It works in the dark with the screen glowing and the rest of the world gone.
          </p>

          <p>
            We believe the future of looking at spaces is not more photographs. It is fewer photographs and more presence. One panorama that lets you stand in the room. One hotspot that lets you walk through the door. One link that opens the whole building. That is ViewRoom. That is what we built. And the door is open.
          </p>

          <p>
            The next time you need to know a place, do not look at pictures. Step inside. Walk the floor. Look up at the ceiling. Move through the rooms. Know the truth of the space before you ever arrive. It is the only way to see a place for what it really is.
          </p>

        </div>

        {/* Article Footer: Share Section & Pill Badges */}
        <div className="mt-16 sm:mt-20 pt-12 text-center border-t border-[var(--app-border)]/15 flex flex-col items-center gap-6">
          <span className="font-heading font-bold text-lg sm:text-xl uppercase tracking-tight text-[var(--app-text-primary)]">
            Share this post
          </span>

          {/* Social Icons Row */}
          <div className="flex items-center justify-center gap-5 text-[var(--app-text-secondary)]">
            <button
              onClick={handleCopyLink}
              aria-label="Copy post link"
              title="Copy link"
              className="p-2 hover:text-[var(--app-text-primary)] transition-colors relative cursor-pointer"
            >
              <LinkIcon className="w-5 h-5" />
              {copied && (
                <span className="absolute -top-8 left-1/2 -translate-x-1/2 px-2.5 py-1 rounded bg-base-content text-base-100 text-[10px] font-bold whitespace-nowrap shadow-md animate-fadeIn">
                  Copied!
                </span>
              )}
            </button>
            <a
              href={shareUrls.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on LinkedIn"
              className="p-2 hover:text-[var(--app-text-primary)] transition-colors"
            >
              <LinkedInIcon className="w-5 h-5" />
            </a>
            <a
              href={shareUrls.twitter}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on X"
              className="p-2 hover:text-[var(--app-text-primary)] transition-colors"
            >
              <XIcon className="w-5 h-5" />
            </a>
            <a
              href={shareUrls.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Share on Facebook"
              className="p-2 hover:text-[var(--app-text-primary)] transition-colors"
            >
              <FacebookIcon className="w-5 h-5" />
            </a>
          </div>

          {/* Pill Tag Badges (Exact match to reference image) */}
          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-2">
            <span className="px-4 py-1.5 rounded-full border border-[var(--app-border)]/40 text-xs sm:text-sm font-semibold text-[var(--app-text-primary)] bg-base-200/40 hover:border-[var(--app-border)] transition-colors cursor-default">
              Virtual tours
            </span>
            <span className="px-4 py-1.5 rounded-full border border-[var(--app-border)]/40 text-xs sm:text-sm font-semibold text-[var(--app-text-primary)] bg-base-200/40 hover:border-[var(--app-border)] transition-colors cursor-default">
              360°
            </span>
            <span className="px-4 py-1.5 rounded-full border border-[var(--app-border)]/40 text-xs sm:text-sm font-semibold text-[var(--app-text-primary)] bg-base-200/40 hover:border-[var(--app-border)] transition-colors cursor-default">
              Real estate
            </span>
            <span className="px-4 py-1.5 rounded-full border border-[var(--app-border)]/40 text-xs sm:text-sm font-semibold text-[var(--app-text-primary)] bg-base-200/40 hover:border-[var(--app-border)] transition-colors cursor-default">
              Hotels
            </span>
          </div>

          {/* Section Divider Line */}
          <div className="w-full h-px bg-[var(--app-border)]/20 my-8" />

          {/* Author Profile Card (Elena Marchetti - Founder, ViewRoom) */}
          <div className="flex flex-col items-center text-center gap-3">
            <div className="w-14 h-14 rounded-full bg-base-300 text-base-content/60 flex items-center justify-center overflow-hidden border border-[var(--app-border)]/20 shadow-sm">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=300"
                alt="Elena Marchetti"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="flex flex-col items-center">
              <h4 className="font-heading font-black text-lg sm:text-xl text-[var(--app-text-primary)] tracking-tight">
                Elena Marchetti
              </h4>
              <p className="text-xs sm:text-sm text-[var(--app-text-secondary)] font-medium mt-0.5">
                Founder, ViewRoom
              </p>
            </div>
          </div>

        </div>

      </div>
    </article>
  );
}
