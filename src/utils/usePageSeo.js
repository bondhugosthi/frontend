import { useEffect } from 'react';
import { pagesAPI, settingsAPI } from './api';

const ensureMetaTag = (attr, key, content) => {
  if (typeof document === 'undefined' || content === undefined || content === null) {
    return;
  }

  const selector = `meta[${attr}="${key}"]`;
  let tag = document.querySelector(selector);
  if (!tag) {
    tag = document.createElement('meta');
    tag.setAttribute(attr, key);
    document.head.appendChild(tag);
  }
  tag.setAttribute('content', content);
};

const normalizeKeywords = (value) => {
  if (!value) return '';
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }
  return String(value);
};

export const applySeo = ({ title, description, keywords, ogImage } = {}) => {
  if (typeof document === 'undefined') {
    return;
  }

  if (title) {
    document.title = title;
  }

  const normalizedKeywords = normalizeKeywords(keywords);

  ensureMetaTag('name', 'description', description || '');
  ensureMetaTag('name', 'keywords', normalizedKeywords);
  ensureMetaTag('property', 'og:title', title || '');
  ensureMetaTag('property', 'og:description', description || '');
  ensureMetaTag('property', 'og:image', ogImage || '');
  ensureMetaTag('property', 'og:type', 'website');
  ensureMetaTag('name', 'twitter:card', 'summary_large_image');
  ensureMetaTag('name', 'twitter:title', title || '');
  ensureMetaTag('name', 'twitter:description', description || '');
  ensureMetaTag('name', 'twitter:image', ogImage || '');
};

const usePageSeo = ({ pageName, title, description, keywords, ogImage } = {}) => {
  useEffect(() => {
    if (!pageName) return;
    let isMounted = true;

    const fetchSeo = async () => {
      try {
        const [pageRes, settingsRes] = await Promise.all([
          pagesAPI.getByName(pageName).catch(() => null),
          settingsAPI.get().catch(() => null)
        ]);

        if (!isMounted) return;

        const pageSeo = pageRes?.data?.seo || {};
        const settingsSeo = settingsRes?.data?.seo || {};

        const merged = {
          title: title || pageSeo.title || settingsSeo.defaultTitle || '',
          description: description || pageSeo.description || settingsSeo.defaultDescription || '',
          keywords: keywords || pageSeo.keywords || settingsSeo.defaultKeywords || '',
          ogImage: ogImage || pageSeo.ogImage || settingsSeo.ogImage || ''
        };

        applySeo(merged);
      } catch (error) {
        if (!isMounted) return;
        applySeo({ title, description, keywords, ogImage });
      }
    };

    fetchSeo();
    return () => {
      isMounted = false;
    };
  }, [pageName, title, description, ogImage, keywords]);
};

export default usePageSeo;
