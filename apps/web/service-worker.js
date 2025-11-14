const CACHE = 'note-saver-cache-v1';
const ASSETS = ['/', '/index.html', '/styles.css', '/app.js', '/manifest.webmanifest'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)));
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(self.clients.claim());
});

self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(res => res || fetch(e.request).then(fetchRes => {
    return caches.open(CACHE).then(cache => { cache.put(e.request, fetchRes.clone()); return fetchRes; });
  })).catch(()=> caches.match('/index.html')));
});