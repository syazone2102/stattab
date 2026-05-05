// StatLab PWA Service Worker
// Version: 1.0.0

const CACHE_NAME = 'statlab-v1';
const FONT_CACHE = 'statlab-fonts-v1';

// Files to cache immediately on install
const CORE_FILES = [
  './',
  './index.html',
  './manifest.json',
  './icons/icon-192.png',
  './icons/icon-512.png',
];

// Google Fonts to cache
const FONT_URLS = [
  'https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=IBM+Plex+Sans:wght@300;400;500;600&display=swap',
];

// ── INSTALL: cache core app files ──────────────────────────────────────────
self.addEventListener('install', event => {
  console.log('[StatLab SW] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      console.log('[StatLab SW] Caching core files');
      return cache.addAll(CORE_FILES);
    }).then(() => self.skipWaiting())
  );
});

// ── ACTIVATE: clean old caches ─────────────────────────────────────────────
self.addEventListener('activate', event => {
  console.log('[StatLab SW] Activating...');
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== CACHE_NAME && k !== FONT_CACHE)
          .map(k => {
            console.log('[StatLab SW] Deleting old cache:', k);
            return caches.delete(k);
          })
      )
    ).then(() => self.clients.claim())
  );
});

// ── FETCH: serve from cache, fallback to network ───────────────────────────
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Strategy: Cache-first for fonts
  if (url.hostname === 'fonts.googleapis.com' || url.hostname === 'fonts.gstatic.com') {
    event.respondWith(
      caches.open(FONT_CACHE).then(cache =>
        cache.match(event.request).then(cached => {
          if (cached) return cached;
          return fetch(event.request).then(response => {
            cache.put(event.request, response.clone());
            return response;
          });
        })
      )
    );
    return;
  }

  // Strategy: Cache-first for app files, network fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(event.request).then(cached => {
        if (cached) {
          // Serve cached, then update in background (stale-while-revalidate)
          const networkUpdate = fetch(event.request).then(response => {
            if (response && response.status === 200) {
              caches.open(CACHE_NAME).then(cache => cache.put(event.request, response.clone()));
            }
            return response;
          }).catch(() => {});
          return cached;
        }
        // Not cached — fetch from network and cache it
        return fetch(event.request).then(response => {
          if (!response || response.status !== 200) return response;
          const toCache = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, toCache));
          return response;
        }).catch(() => {
          // Offline fallback
          return caches.match('./index.html');
        });
      })
    );
    return;
  }

  // All other requests: network with cache fallback
  event.respondWith(
    fetch(event.request).catch(() => caches.match(event.request))
  );
});

// ── BACKGROUND SYNC: queue analysis tasks when offline ────────────────────
self.addEventListener('sync', event => {
  if (event.tag === 'statlab-sync') {
    console.log('[StatLab SW] Background sync triggered');
  }
});

// ── PUSH NOTIFICATIONS (future use) ───────────────────────────────────────
self.addEventListener('push', event => {
  const data = event.data?.json() || { title: 'StatLab', body: 'Analysis complete' };
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.body,
      icon: './icons/icon-192.png',
      badge: './icons/icon-96.png',
    })
  );
});
