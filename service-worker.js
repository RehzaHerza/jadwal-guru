const CACHE_NAME = "jadwal-guru-v3";

const urls = [
"/",
"/index.html",
"/style.css",
"/app.js",
"/manifest.json",
"/icon-192.png",
"/icon-512.png"
];

self.addEventListener("install",e=>{
e.waitUntil(
caches.open(CACHE_NAME).then(c=>c.addAll(FILES_TO_CACHE))
);
self.skipwaiting();
});

self.addEventListener("activate", e => {
  e.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    })
  );
  self.clients.claim();
});

self.addEventListener("fetch", e=>{
e.respondWith(
caches.match(e.request).then(res => res || fetch(e.request))
);
});
