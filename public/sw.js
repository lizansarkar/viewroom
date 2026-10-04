/**
 * ViewRoom 360° Progressive Web App (PWA) Offline Service Worker
 * Implements Cache-First for 360° panoramas & Stale-While-Revalidate for API responses
 */

const CACHE_NAME = "viewroom-360-v1";
const STATIC_ASSETS = [
  "/",
  "/index.html",
  "/manifest.json",
  "/panoramas/panorama_aerial.jpg",
  "/panoramas/panorama_entrance.jpg",
  "/panoramas/panorama_floor1.jpg",
];

// Install Event: Cache Core Shell Assets
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("⚡ [Service Worker] Pre-caching core 360° assets");
      return cache.addAll(STATIC_ASSETS).catch((err) => {
        console.warn("[Service Worker] Non-critical pre-cache error:", err);
      });
    })
  );
  self.skipWaiting();
});

// Activate Event: Cleanup Old Caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    })
  );
  self.clients.claim();
});

// Fetch Event: Cache-First for Panoramas, Stale-While-Revalidate for APIs
self.addEventListener("fetch", (event) => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests or browser extension schemes
  if (request.method !== "GET" || !url.protocol.startsWith("http")) return;

  // 1. Panoramas & Static Images -> Cache-First Strategy
  if (url.pathname.startsWith("/panoramas/") || url.pathname.startsWith("/uploads/") || request.destination === "image") {
    event.respondWith(
      caches.match(request).then((cachedResponse) => {
        if (cachedResponse) return cachedResponse;
        return fetch(request).then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseClone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(request, responseClone));
          }
          return networkResponse;
        });
      })
    );
    return;
  }

  // 2. API Endpoints -> Stale-While-Revalidate Strategy
  if (url.pathname.startsWith("/api/v1/")) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(request).then((cachedResponse) => {
          const fetchPromise = fetch(request).then((networkResponse) => {
            if (networkResponse && networkResponse.status === 200) {
              cache.put(request, networkResponse.clone());
            }
            return networkResponse;
          }).catch(() => cachedResponse);

          return cachedResponse || fetchPromise;
        });
      })
    );
    return;
  }

  // 3. HTML Navigation Pages -> Network-First with Cache Fallback
  event.respondWith(
    fetch(request).catch(() => {
      return caches.match(request).then((cachedResponse) => {
        return cachedResponse || caches.match("/index.html");
      });
    })
  );
});
