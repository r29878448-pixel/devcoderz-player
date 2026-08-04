// sw.js - Service Worker to handle CORS for CloudFront segments
self.addEventListener('install', () => {
    self.skipWaiting();
});

self.addEventListener('activate', (event) => {
    event.waitUntil(clients.claim());
});

self.addEventListener('fetch', (event) => {
    const url = new URL(event.request.url);

    // Only intercept CloudFront requests (segments)
    const isCloudFront = url.hostname.includes('cloudfront.net') && 
                        (url.pathname.endsWith('.ts')  url.pathname.includes('.ts'));

    // Also intercept key requests if needed
    const isKeyRequest = url.pathname.includes('enc.key');

    if (isCloudFront  isKeyRequest) {
        event.respondWith(
            fetch(event.request, {
                mode: 'cors',
                credentials: 'omit',
                headers: {
                    'Origin': new URL(event.request.url).origin,
                    'Range': event.request.headers.get('Range') || '',
                }
            })
            .then(response => {
                // Clone the response and add CORS headers
                const headers = new Headers(response.headers);
                headers.set('Access-Control-Allow-Origin', '*');
                headers.set('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
                headers.set('Access-Control-Allow-Headers', 'Origin, Range, Content-Type');
                headers.set('Access-Control-Expose-Headers', 'Content-Length, Content-Range');

                return new Response(response.body, {
                    status: response.status,
                    statusText: response.statusText,
                    headers: headers
                });
            })
            .catch((error) => {
                // Fallback: If fetch fails, try through your proxy
                console.warn('Service Worker fetch failed, using proxy fallback:', error);
                const proxyUrl = /api/proxy2?get_segment=1&ts=${encodeURIComponent(event.request.url)};
                return fetch(proxyUrl);
            })
        );
    } else {
        // Pass through other requests
        return event.respondWith(fetch(event.request));
    }
});