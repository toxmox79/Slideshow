self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open('pwa-cache').then((cache) => {
      return cache.addAll([
        '/Slideshow/',
        '/Slideshow/index.html',
        '/Slideshow/manifest.json',
        'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg.min.js',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg-core.js',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg-core.wasm',
        'https://cdn.jsdelivr.net/npm/@ffmpeg/ffmpeg@0.12.10/dist/umd/ffmpeg-core.worker.js'
      ]);
    })
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        // Clone the response to add headers
        const responseWithHeaders = new Response(networkResponse.body, networkResponse);
        responseWithHeaders.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
        responseWithHeaders.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');

        // Cache the network response for future use
        caches.open('pwa-cache').then((cache) => {
          cache.put(event.request, networkResponse.clone());
        });
        return responseWithHeaders;
      }).catch(() => {
        // Offline: Use cached response if available
        if (cachedResponse) {
          // Add headers to cached response
          const cachedWithHeaders = new Response(cachedResponse.body, cachedResponse);
          cachedWithHeaders.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
          cachedWithHeaders.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
          return cachedWithHeaders;
        }
        // Fallback for offline and uncached (e.g., show a message in app)
        return new Response('Offline and resource not cached.', { status: 503 });
      });

      // Online: Prefer network, fallback to cache
      return cachedResponse || fetchPromise;
    })
  );
});
