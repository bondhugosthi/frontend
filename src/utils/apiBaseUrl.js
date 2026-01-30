const DEFAULT_PROD_API_URL = '/api/proxy';

const stripApiSuffix = (url) => (url || '').replace(/\/api\/?$/, '');

const normalizeBaseUrl = (url) => {
  const trimmed = (url || '').replace(/\/+$/, '');
  return stripApiSuffix(trimmed);
};

const getRuntimeApiUrl = () => {
  if (typeof window === 'undefined') {
    return '';
  }
  return window.__APP_CONFIG__?.API_URL || '';
};

const isRelativeUrl = (value) => typeof value === 'string' && value.startsWith('/');

const getEnvApiUrl = () => (process.env.REACT_APP_API_URL || '').trim();

const resolveApiBaseUrl = () => {
  const runtimeUrl = getRuntimeApiUrl();
  if (runtimeUrl) {
    return runtimeUrl;
  }

  const envUrl = getEnvApiUrl();

  if (process.env.NODE_ENV === 'development') {
    if (envUrl && !isRelativeUrl(envUrl)) {
      return envUrl;
    }
    // Use CRA dev proxy for relative or empty values.
    return '';
  }

  if (envUrl) {
    return envUrl;
  }

  return DEFAULT_PROD_API_URL;
};

export const API_BASE_URL = normalizeBaseUrl(resolveApiBaseUrl());
