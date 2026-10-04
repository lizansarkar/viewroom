import React, { useEffect } from "react";

/**
 * ViewRoom 360° Dynamic OpenGraph, Twitter Card & SEO Meta Manager
 */
export default function MetaSEO({
  title = "ViewRoom 360° - Virtual Property Platform",
  description = "Explore interactive multi-floor 360° virtual tours, 3D product spins, and real-time guided walkthroughs.",
  image = "https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&q=80&w=1200",
  url = window.location.href,
  type = "website",
  twitterCard = "summary_large_image",
}) {
  useEffect(() => {
    // 1. Update Document Title
    document.title = title ? `${title} | ViewRoom 360°` : "ViewRoom 360° - Virtual Property Platform";

    // 2. Helper to set or create meta tag
    const setMetaTag = (selector, attributeName, attributeValue, content) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = document.createElement("meta");
        element.setAttribute(attributeName, attributeValue);
        document.head.appendChild(element);
      }
      element.setAttribute("content", content);
    };

    // Standard SEO Tags
    setMetaTag('meta[name="description"]', "name", "description", description);

    // OpenGraph Social Media Tags (Facebook, WhatsApp, LinkedIn, Discord)
    setMetaTag('meta[property="og:title"]', "property", "og:title", title);
    setMetaTag('meta[property="og:description"]', "property", "og:description", description);
    setMetaTag('meta[property="og:image"]', "property", "og:image", image);
    setMetaTag('meta[property="og:url"]', "property", "og:url", url);
    setMetaTag('meta[property="og:type"]', "property", "og:type", type);
    setMetaTag('meta[property="og:site_name"]', "property", "og:site_name", "ViewRoom 360°");

    // Twitter Card Tags
    setMetaTag('meta[name="twitter:card"]', "name", "twitter:card", twitterCard);
    setMetaTag('meta[name="twitter:title"]', "name", "twitter:title", title);
    setMetaTag('meta[name="twitter:description"]', "name", "twitter:description", description);
    setMetaTag('meta[name="twitter:image"]', "name", "twitter:image", image);

    // Dynamic Canonical URL Link Tag
    let canonicalLink = document.querySelector('link[rel="canonical"]');
    if (!canonicalLink) {
      canonicalLink = document.createElement("link");
      canonicalLink.setAttribute("rel", "canonical");
      document.head.appendChild(canonicalLink);
    }
    canonicalLink.setAttribute("href", url);

  }, [title, description, image, url, type, twitterCard]);

  return null;
}
