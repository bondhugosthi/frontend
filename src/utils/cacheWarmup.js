import { API_BASE_URL } from './apiBaseUrl';
import { resolveMediaUrl } from './mediaUrl';

const PREFETCH_CACHE = 'bg-prefetch-v1';

const CORE_ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/favicon.ico',
  '/app-config.js'
];

const PUBLIC_ENDPOINTS = [
  '/api/settings',
  '/api/slider-images?limit=3',
  '/api/events/upcoming',
  '/api/gallery?limit=6',
  '/api/news?limit=3',
  '/api/pages/home',
  '/api/public/stats'
];

const buildUrl = (path) => {
  if (!path) return '';
  if (/^https?:\/\//i.test(path)) return path;
  if (!API_BASE_URL) return path;
  if (path.startsWith('/')) return `${API_BASE_URL}${path}`;
  return `${API_BASE_URL}/${path}`;
};

const isLikelyImageUrl = (value) => {
  if (!value || typeof value !== 'string') return false;
  const lower = value.toLowerCase();
  return (
    lower.includes('/api/upload/file/') ||
    lower.includes('/uploads/') ||
    /\.(png|jpe?g|gif|webp|svg)$/.test(lower)
  );
};

const addImageUrl = (set, value) => {
  const resolved = resolveMediaUrl(value);
  if (resolved && isLikelyImageUrl(resolved)) {
    set.add(resolved);
  }
};

const walkImages = (set, data) => {
  if (!data) return;
  if (typeof data === 'string') {
    addImageUrl(set, data);
    return;
  }
  if (Array.isArray(data)) {
    data.forEach((item) => walkImages(set, item));
    return;
  }
  if (typeof data !== 'object') return;

  Object.entries(data).forEach(([key, value]) => {
    if (!value) return;
    if (typeof value === 'string') {
      if (/image|photo|logo|favicon|thumbnail|cover|url/i.test(key)) {
        addImageUrl(set, value);
      }
      return;
    }
    walkImages(set, value);
  });
};

const cacheFetch = async (cache, url) => {
  if (!url) return;
  try {
    const origin = typeof window !== 'undefined' ? window.location.origin : '';
    const resolved = new URL(url, origin);
    const isCrossOrigin = origin && resolved.origin !== origin;
    const request = new Request(resolved.toString(), {
      mode: isCrossOrigin ? 'no-cors' : 'same-origin',
      credentials: 'omit'
    });
    const response = await fetch(request);
    if (response && (response.ok || response.type === 'opaque')) {
      await cache.put(resolved.toString(), response);
    }
  } catch (error) {
    // Ignore cache warm failures.
  }
};

export const warmCache = async () => {
  if (typeof window === 'undefined' || !('caches' in window) || !('fetch' in window)) {
    return;
  }

  const cache = await caches.open(PREFETCH_CACHE);
  const urls = new Set(CORE_ASSETS);

  await Promise.all(
    PUBLIC_ENDPOINTS.map(async (endpoint) => {
      const url = buildUrl(endpoint);
      if (!url) return;
      try {
        const response = await fetch(url, { credentials: 'omit' });
        if (response && response.ok) {
          await cache.put(url, response.clone());
          const data = await response.clone().json().catch(() => null);
          if (data) {
            walkImages(urls, data);
          }
        }
      } catch (error) {
        // Ignore API warm failures.
      }
    })
  );

  await Promise.all(Array.from(urls).map((url) => cacheFetch(cache, url)));
  try {
    window.localStorage.setItem('bg_cache_warm_at', new Date().toISOString());
  } catch (error) {
    // Ignore storage errors.
  }
};
