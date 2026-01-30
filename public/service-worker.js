const CACHE_VERSION = 'v2';
const CORE_CACHE = `bg-core-${CACHE_VERSION}`;
const RUNTIME_CACHE = `bg-runtime-${CACHE_VERSION}`;
const IMAGE_CACHE = `bg-images-${CACHE_VERSION}`;
const API_CACHE = `bg-api-${CACHE_VERSION}`;

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/app-config.js'
];

const PUBLIC_API_PREFIXES = [
  '/api/events',
  '/api/sports',
  '/api/social-work',
  '/api/gallery',
  '/api/members',
  '/api/news',
  '/api/settings',
  '/api/pages',
  '/api/slider-images',
  '/api/public',
  '/api/upload/file'
];

const isPublicApiRequest = (pathname) => PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));

const isImageRequest = (request, url) => {
  return (
    request.destination === 'image' ||
    url.pathname.startsWith('/api/upload/file/') ||
    /\.(png|jpe?g|gif|webp|svg)$/i.test(url.pathname)
  );
};

const isFontRequest = (request, url) => {
  return (
    request.destination === 'font' ||
    url.hostname.includes('fonts.gstatic.com') ||
    url.hostname.includes('fonts.googleapis.com')
  );
};

const cacheResponse = async (cacheName, request, response) => {
  if (!response || !(response.ok || response.type === 'opaque')) {
    return;
  }
  const cache = await caches.open(cacheName);
  await cache.put(request, response.clone());
};

const networkFirst = async (request, cacheName, fallbackUrl) => {
  try {
    const response = await fetch(request);
    await cacheResponse(cacheName, request, response);
    return response;
  } catch (error) {
    const cache = await caches.open(cacheName);
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      const fallback = await cache.match(fallbackUrl);
      if (fallback) return fallback;
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
};

const cacheFirst = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  await cacheResponse(cacheName, request, response);
  return response;
};

const staleWhileRevalidate = async (request, cacheName) => {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then(async (response) => {
      await cacheResponse(cacheName, request, response);
      return response;
    })
    .catch(() => null);
  return cached || networkPromise || new Response('Offline', { status: 503, statusText: 'Offline' });
};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CORE_CACHE).then((cache) => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((key) => !key.includes(CACHE_VERSION)).map((key) => caches.delete(key)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  if (event.request.mode === 'navigate') {
    event.respondWith(networkFirst(event.request, CORE_CACHE, '/index.html'));
    return;
  }

  if (isImageRequest(event.request, url) || isFontRequest(event.request, url)) {
    event.respondWith(cacheFirst(event.request, IMAGE_CACHE));
    return;
  }

  if (url.pathname.startsWith('/api/') && isPublicApiRequest(url.pathname) && !event.request.headers.get('authorization')) {
    event.respondWith(networkFirst(event.request, API_CACHE));
    return;
  }

  event.respondWith(staleWhileRevalidate(event.request, RUNTIME_CACHE));
});
