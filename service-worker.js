addEventListener('fetch', event => {
  event.respondWith(handleRequest(event.request));
});

async function handleRequest(request) {
  // Proxy the request to GitHub Pages
  const response = await fetch(request);
  // Create a new response with custom headers
  const newResponse = new Response(response.body, response);
  newResponse.headers.set('Cross-Origin-Opener-Policy', 'same-origin');
  newResponse.headers.set('Cross-Origin-Embedder-Policy', 'require-corp');
  return newResponse;
}
