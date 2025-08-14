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
        'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.min.js',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg-core.js',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg-core.wasm',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg-core.worker.js',
        'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.min.js',
        'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg-core.js',
        'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg-core.wasm',
        'https://unpkg.com/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg-core.worker.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        const responseWithHeaders = new Response(networkResponse.body, networkResponse);
        responseWithHeaders.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        responseWithHeaders.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
        caches.open('pwa-cache').then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return responseWithHeaders;
      }).catch(() => {
        if (cachedResponse) {
          const cachedWithHeaders = new Response(cachedResponse.body, cachedResponse);
          cachedWithHeaders.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
          cachedWithHeaders.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
          return cachedWithHeaders;
        }
        return new Response('Offline und Ressource nicht im Cache.', { status: 503 });
      });
      return cachedResponse || fetchPromise;
    })
  );
});
