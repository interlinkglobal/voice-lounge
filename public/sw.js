const VERSION = "voice-lounge-pwa-v1";
const PRECACHE = `${VERSION}-precache`;
const RUNTIME = `${VERSION}-runtime`;
const IMAGES = `${VERSION}-images`;

const APP_SHELL = [
  "/",
  "/offline.html",
  "/manifest.webmanifest",
  "/icon-16x16.png",
  "/icon-32x32.png",
  "/icon-48x48.png",
  "/icon-72x72.png",
  "/icon-96x96.png",
  "/icon-128x128.png",
  "/icon-180x180.png",
  "/icon-192x192.png",
  "/icon-384x384.png",
  "/icon-512x512.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(PRECACHE);
    await Promise.allSettled(APP_SHELL.map(async (url) => {
      const response = await fetch(url, { cache: "reload" });
      if (response.ok) await cache.put(url, response);
    }));
    await self.skipWaiting();
  })());
});

self.addEventListener("activate", (event) => {
  event.waitUntil((async () => {
    const keep = new Set([PRECACHE, RUNTIME, IMAGES]);
    const names = await caches.keys();
    await Promise.all(names.filter((name) => !keep.has(name)).map((name) => caches.delete(name)));
    await self.clients.claim();
  })());
});

function isInternalDataRequest(url) {
  return url.pathname.startsWith("/api/") ||
    url.pathname.startsWith("/_server") ||
    url.pathname.startsWith("/__") ||
    url.pathname.includes("_serverFn");
}

async function networkFirstNavigation(request) {
  const cache = await caches.open(RUNTIME);
  try {
    const response = await fetch(request);
    if (response.ok) await cache.put(request, response.clone());
    return response;
  } catch {
    return (await cache.match(request)) ||
      (await caches.match("/")) ||
      (await caches.match("/offline.html")) ||
      Response.error();
  }
}

async function cacheFirstAsset(request) {
  const cached = await caches.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok) {
    const cache = await caches.open(RUNTIME);
    await cache.put(request, response.clone());
  }
  return response;
}

async function staleWhileRevalidateImage(request) {
  const cache = await caches.open(IMAGES);
  const cached = await cache.match(request);
  const update = fetch(request).then(async (response) => {
    if (response.ok || response.type === "opaque") await cache.put(request, response.clone());
    return response;
  }).catch(() => null);
  return cached || (await update) || Response.error();
}

self.addEventListener("fetch", (event) => {
  const request = event.request;
  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.protocol !== "http:" && url.protocol !== "https:") return;
  if (url.origin === self.location.origin && isInternalDataRequest(url)) return;

  if (request.mode === "navigate") {
    event.respondWith(networkFirstNavigation(request));
    return;
  }

  if (request.destination === "image") {
    event.respondWith(staleWhileRevalidateImage(request));
    return;
  }

  if (url.origin === self.location.origin &&
      ["style", "script", "font", "manifest"].includes(request.destination)) {
    event.respondWith(cacheFirstAsset(request));
  }
});

self.addEventListener("message", (event) => {
  if (event.data?.type === "SKIP_WAITING") self.skipWaiting();
});
