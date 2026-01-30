const isProduction = process.env.NODE_ENV === 'production';

const getServiceWorkerUrl = () => {
  const base = process.env.PUBLIC_URL || '';
  return `${base}/service-worker.js`;
};

export const registerServiceWorker = async () => {
  if (!isProduction || typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register(getServiceWorkerUrl());
    return registration;
  } catch (error) {
    console.warn('Service worker registration failed', error);
    return null;
  }
};

export const unregisterServiceWorkers = async () => {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
    return;
  }

  const registrations = await navigator.serviceWorker.getRegistrations();
  await Promise.all(registrations.map((registration) => registration.unregister()));
};

export const clearCaches = async () => {
  if (typeof window === 'undefined' || !('caches' in window)) {
    return;
  }

  const keys = await caches.keys();
  await Promise.all(keys.map((key) => caches.delete(key)));
};
