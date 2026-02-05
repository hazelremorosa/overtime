const CACHE_NAME = "ot-record-v1";
const ASSETS = [
    "./index.html",
    "./manifest.json",
    "./icon-192.svg",
    "./icon-512.svg",
    "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap",
    "https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js",
];

self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS)),
    );
    self.skipWaiting();
});

self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) =>
            Promise.all(
                keys
                    .filter((k) => k !== CACHE_NAME)
                    .map((k) => caches.delete(k)),
            ),
        ),
    );
    self.clients.claim();
});

self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches
            .match(e.request)
            .then((cached) => cached || fetch(e.request))
            .catch(() => caches.match("./index.html")),
    );
});
