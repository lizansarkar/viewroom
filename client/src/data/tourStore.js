import { SEED_TOURS } from './demoTour';

// ---------------------------------------------------------------------------
// Tour data access layer.
//
// The viewer and editor only talk to this module. The demo data is stored in
// structured local JSON (seeded in ./demoTour.js, overrides persisted to
// localStorage). When a real backend is introduced, replace the bodies of
// getTourForProperty / saveTour / resetTour with API calls and keep the same
// return shapes — no viewer or editor rebuild required.
// ---------------------------------------------------------------------------

const storageKey = (propertyId) => `viewroom:tour:${propertyId}`;

export function getTourForProperty(propertyId) {
  // Future: `return (await fetch(`/api/properties/${propertyId}/tour`)).json()`
  const seed = SEED_TOURS[propertyId];
  if (!seed) return null;

  try {
    const raw = window.localStorage.getItem(storageKey(propertyId));
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.scenes)) return parsed;
    }
  } catch {
    // Ignore corrupt storage and fall back to the seed tour.
  }

  return seed;
}

export function saveTour(propertyId, tour) {
  try {
    window.localStorage.setItem(storageKey(propertyId), JSON.stringify(tour));
  } catch {
    // Storage may be unavailable (private mode / quota); fail silently.
  }
}

export function resetTour(propertyId) {
  try {
    window.localStorage.removeItem(storageKey(propertyId));
  } catch {
    // Ignore.
  }
}

export function genId(prefix = 'item') {
  return `${prefix}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 7)}`;
}
