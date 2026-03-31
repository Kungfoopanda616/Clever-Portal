importScripts('uv.bundle.js');
importScripts('uv.config.js');

// This uses the core engine from the bundle you pasted earlier
const sw = new UVServiceWorker();

self.addEventListener('fetch', (event) => {
    event.respondWith(sw.fetch(event));
});
