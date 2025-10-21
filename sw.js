const CACHE_NAME = 'sirene-pwa-v1';
const urlsToCache = [
  '/',
  '/manifest.json',
  '/192.png',
  '/512.png',
  '../index.html',
  '../src/App.tsx',
  '../src/index.ts'
];

// Instalação
self.addEventListener('install', function(event) {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(function(cache) {
        console.log('Cache aberto');
        return cache.addAll(urlsToCache);
      })
  );
});

// Intercepta requests
self.addEventListener('fetch', function(event) {
  event.respondWith(
    caches.match(event.request)
      .then(function(response) {
        // Retorna do cache ou faz fetch
        return response || fetch(event.request);
      })
  );
}); 