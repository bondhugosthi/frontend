const DEFAULT_PROD_API_URL = 'https://backend-epzmj9z6d-bondhu-gosthis-projects.vercel.app';
const LOCAL_API_URL = 'http://localhost:5000';

const normalizeBaseUrl = (url) => (url || '').replace(/\/+$/, '');

const getRuntimeApiUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.__APP_CONFIG__?.API_URL || '';
};

const resolveApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) {
    return process.env.REACT_APP_API_URL;
  }

  const runtimeUrl = getRuntimeApiUrl();
  if (runtimeUrl) {
    return runtimeUrl;
  }

  if (process.env.NODE_ENV === 'production') {
    return DEFAULT_PROD_API_URL;
  }

  return LOCAL_API_URL;
};

export const API_BASE_URL = normalizeBaseUrl(resolveApiBaseUrl());
