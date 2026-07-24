const CACHE_NAME = 'closerush-pwa-cache-v1';

// Assets to cache immediately on install
const PRECACHE_ASSETS = [
  '/',
  '/manifest.json',
  '/logo.png',
  '/image.png'
];

// Install event: cache core assets
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(PRECACHE_ASSETS);
    })
  );
});

// Activate event: clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event: Network-first for navigation/API, Stale-while-revalidate for static assets
self.addEventListener('fetch', (event) => {
  // Ignore non-GET requests (e.g. POST for payments, form submissions)
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // Ignore Chrome extensions or external non-http schemes
  if (!url.protocol.startsWith('http')) return;

  // For API requests, skip caching to ensure fresh data and proper payments
  if (url.pathname.startsWith('/api/')) {
    return;
  }

  // Strategy for static assets (images, css, js)
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|css|js|woff2|woff)$/) || url.pathname.startsWith('/_next/static/')) {
    event.respondWith(
      caches.match(event.request).then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then((networkResponse) => {
          // Update cache with new response
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(event.request, responseToCache);
            });
          }
          return networkResponse;
        }).catch(() => {
          // Ignore fetch errors for static assets if we have cache
        });
        
        return cachedResponse || fetchPromise;
      })
    );
    return;
  }

  // Strategy for HTML documents (Network-first with offline fallback)
  if (event.request.mode === 'navigate') {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          return caches.open(CACHE_NAME).then((cache) => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
        .catch(() => {
          return caches.match(event.request).then((cachedResponse) => {
            if (cachedResponse) {
              return cachedResponse;
            }
            // If nothing is found, return the cached homepage as fallback
            return caches.match('/');
          });
        })
    );
  }
});
