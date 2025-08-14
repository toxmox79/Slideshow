self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pwa-cache').then((cache) => {
      return cache.addAll([
        '/Slideshow/',
        '/Slideshow/index.html',
        '/Slideshow/manifest.json',
        '/Slideshow/favicon.ico',
        '/Slideshow/icon-192x192.png',
        '/Slideshow/icon-512x512.png',
        '/Slideshow/ffmpeg.min.js',
        '/Slideshow/ffmpeg-core.js',
        '/Slideshow/ffmpeg-core.wasm',
        'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      return cachedResponse || fetch(event.request).then((networkResponse) => {
        caches.open('pwa-cache').then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return networkResponse;
      }).catch(() => {
        return new Response('Offline und Ressource nicht im Cache.', { status: 503 });
      });
    })
  );
});
