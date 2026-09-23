import { apiTrackEvent } from "./api";

// Lightweight Real-Time Event Tracker Utility for ViewRoom
export const trackEvent = async (type, title, detail) => {
  try {
    const device = window.innerWidth < 768 ? "Mobile App/Web" : "Desktop (Browser)";
    const payload = {
      type,
      title,
      detail: detail || `Interacted with ${title}`,
      device,
    };

    // Asynchronous non-blocking beacon dispatch
    apiTrackEvent(payload).catch((err) => {
      console.warn("Analytics event tracking warning:", err.message);
    });
  } catch (err) {
    // Fail silently so user UI is never interrupted
  }
};
