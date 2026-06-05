const CACHE = 'zerodebt-v1';
const ASSETS = [
  '/ZeroDebt/',
  '/ZeroDebt/index.html',
  '/ZeroDebt/manifest.json',
  '/ZeroDebt/icons/icon-192.png',
  '/ZeroDebt/icons/icon-512.png',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// Network-first for navigation, cache-first for assets
self.addEventListener('fetch', e => {
  if (e.request.mode === 'navigate') {
    e.respondWith(
      fetch(e.request).catch(() => caches.match('/ZeroDebt/index.html'))
    );
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});
