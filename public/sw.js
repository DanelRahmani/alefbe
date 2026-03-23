// الفبا Service Worker
// Cache name — bump the version number whenever you deploy an update
const CACHE = 'alefba-v1';

// All assets that should be available offline immediately after install
const PRECACHE = [
  './alefba.html',
  './manifest.json',
  // Google Fonts — cached on first visit, served from cache thereafter
  'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Amiri:ital,wght@0,400;0,700;1,400&family=Raleway:wght@300;400;500;600;700&display=swap',
];

// ── INSTALL: pre-cache core assets ──────────────────────────────────────────
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE).then(cache => {
      // Use individual adds so one failure doesn't block everything
      return Promise.allSettled(
        PRECACHE.map(url => cache.add(url).catch(() => {
          console.warn('[SW] Failed to pre-cache:', url);
        }))
      );
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean up old caches ───────────────────────────────────────────
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys.filter(k => k !== CACHE).map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: cache-first for app shell, network-first for everything else ──────
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Only handle GET requests
  if (request.method !== 'GET') return;

  // Cache-first strategy for same-origin assets and Google Fonts
  const isCacheable =
    url.origin === self.location.origin ||
    url.hostname === 'fonts.googleapis.com' ||
    url.hostname === 'fonts.gstatic.com';

  if (!isCacheable) return;

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) {
        // Serve from cache, then refresh in background (stale-while-revalidate)
        const fetchPromise = fetch(request)
          .then(response => {
            if (response && response.status === 200) {
              caches.open(CACHE).then(cache => cache.put(request, response.clone()));
            }
            return response;
          })
          .catch(() => {});
        // Return cached version immediately
        return cached;
      }

      // Not in cache — fetch and store
      return fetch(request).then(response => {
        if (!response || response.status !== 200 || response.type === 'opaque') {
          return response;
        }
        const toCache = response.clone();
        caches.open(CACHE).then(cache => cache.put(request, toCache));
        return response;
      }).catch(() => {
        // Offline fallback: return the main app shell for navigation requests
        if (request.mode === 'navigate') {
          return caches.match('./alefba.html');
        }
      });
    })
  );
});

// ── MESSAGE: force update from the app ──────────────────────────────────────
self.addEventListener('message', event => {
  if (event.data === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});
