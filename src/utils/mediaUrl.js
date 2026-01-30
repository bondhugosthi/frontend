import { API_BASE_URL } from './apiBaseUrl';

const hasProtocol = (value) => /^https?:\/\//i.test(value || '');
const isDataUrl = (value) => /^(data:|blob:)/i.test(value || '');
const isApiPath = (value) => value.startsWith('/api/') || value.startsWith('/uploads/');

const getOrigin = (value) => {
  try {
    return new URL(value).origin;
  } catch (error) {
    return '';
  }
};

export const resolveMediaUrl = (input) => {
  if (!input) {
    return '';
  }

  const value = String(input).trim();
  if (!value) {
    return '';
  }

  if (isDataUrl(value)) {
    return value;
  }

  const apiBase = API_BASE_URL;

  if (!hasProtocol(value)) {
    if (!apiBase) {
      return value;
    }
    if (value.startsWith('/')) {
      if (!isApiPath(value)) {
        return value;
      }
      return `${apiBase}${value}`;
    }
    return `${apiBase}/${value}`;
  }

  if (!apiBase) {
    return value;
  }

  const apiOrigin = getOrigin(apiBase);
  const valueOrigin = getOrigin(value);
  const isUploadPath = value.includes('/api/upload/file/') || value.includes('/uploads/');
  if (!isUploadPath) {
    return value;
  }

  if (apiBase.startsWith('/')) {
    try {
      const urlObject = new URL(value);
      return `${apiBase}${urlObject.pathname}${urlObject.search}`;
    } catch (error) {
      return value;
    }
  }

  if (!apiOrigin || !valueOrigin) {
    if (typeof window !== 'undefined' && apiBase.startsWith('/') && valueOrigin === window.location.origin) {
      return `${apiBase}${value.replace(valueOrigin, '')}`;
    }
    return value;
  }

  const isLocal = /localhost|127\.0\.0\.1/i.test(valueOrigin);
  if (isLocal) {
    return value.replace(valueOrigin, apiOrigin);
  }

  if (typeof window !== 'undefined' && valueOrigin === window.location.origin && apiOrigin !== valueOrigin) {
    return value.replace(valueOrigin, apiOrigin);
  }

  return value;
};
