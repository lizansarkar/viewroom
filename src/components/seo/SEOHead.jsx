import { useEffect } from "react";

/**
 * Reusable SEO Head component for dynamic page title, meta description, and canonical link management.
 */
export default function SEOHead({ title, description, canonicalUrl }) {
  useEffect(() => {
    // 1. Dynamic Title Update
    if (title) {
      document.title = `${title} | ViewRoom 360°`;
    } else {
      document.title = "ViewRoom — 360° Virtual Tours, 3D Objects & Spatial Photography";
    }

    // 2. Dynamic Meta Description Update
    if (description) {
      let metaDesc = document.querySelector('meta[name="description"]');
      if (metaDesc) {
        metaDesc.setAttribute("content", description);
      } else {
        metaDesc = document.createElement("meta");
        metaDesc.setAttribute("name", "description");
        metaDesc.setAttribute("content", description);
        document.head.appendChild(metaDesc);
      }
    }

    // 3. Dynamic Canonical Link Update
    if (canonicalUrl) {
      let canonical = document.querySelector('link[rel="canonical"]');
      if (canonical) {
        canonical.setAttribute("href", canonicalUrl);
      } else {
        canonical = document.createElement("link");
        canonical.setAttribute("rel", "canonical");
        canonical.setAttribute("href", canonicalUrl);
        document.head.appendChild(canonical);
      }
    }
  }, [title, description, canonicalUrl]);

  return null;
}
