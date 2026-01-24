const DEFAULT_PROD_API_URL = '/api/proxy';
const LOCAL_API_URL = 'http://localhost:5000';

const normalizeBaseUrl = (url) => (url || '').replace(/\/+$/, '');

const getRuntimeApiUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.__APP_CONFIG__?.API_URL || '';
};

const isRelativeUrl = (value) => typeof value === 'string' && value.startsWith('/');

const resolveApiBaseUrl = () => {
  const runtimeUrl = getRuntimeApiUrl();
  if (runtimeUrl) {
    return runtimeUrl;
  }

  if (process.env.NODE_ENV === 'production') {
    if (isRelativeUrl(process.env.REACT_APP_API_URL)) {
      return process.env.REACT_APP_API_URL;
    }
    return DEFAULT_PROD_API_URL;
  }

  return process.env.REACT_APP_API_URL || LOCAL_API_URL;
};

export const API_BASE_URL = normalizeBaseUrl(resolveApiBaseUrl());
