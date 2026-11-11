import { createContext, useContext, useEffect, useState } from 'react';
import { DEFAULT_CONTENT, mergeContent, fillText } from '../data/site';

const ContentContext = createContext(DEFAULT_CONTENT);

function setMeta(selector, attr, value) {
  const el = document.head.querySelector(selector);
  if (el && value) el.setAttribute(attr, value);
}

/**
 * Supplies the editable site content.
 * In production the server inlines it as window.__SONEX_CONTENT__ (no extra request);
 * in development it is fetched from /api/content, falling back to the built-in defaults.
 */
export function ContentProvider({ children }) {
  const inlined = typeof window !== 'undefined' ? window.__SONEX_CONTENT__ : null;
  const [content, setContent] = useState(inlined ? mergeContent(inlined) : null);

  useEffect(() => {
    if (content) return;
    // Always wait for the real (admin-managed) content; defaults are used only if the API is unreachable.
    const ctrl = new AbortController();
    fetch('/api/content', { signal: ctrl.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => setContent(mergeContent(d)))
      .catch((err) => err.name !== 'AbortError' && setContent(mergeContent(null)));
    return () => ctrl.abort();
  }, [content]);

  // Keep title / meta tags in sync with the SEO settings from the admin.
  useEffect(() => {
    if (!content) return;
    const { seo } = content;
    if (seo.title) document.title = seo.title;
    setMeta('meta[name="description"]', 'content', seo.description);
    setMeta('meta[name="keywords"]', 'content', seo.keywords);
    setMeta('meta[property="og:title"]', 'content', seo.title);
    setMeta('meta[property="og:description"]', 'content', seo.description);
  }, [content]);

  if (!content) return <div className="boot" aria-label="Loading" />;
  return <ContentContext.Provider value={content}>{children}</ContentContext.Provider>;
}

export const useContent = () => useContext(ContentContext);
export const useCompany = () => useContext(ContentContext).company;

/** Returns a function that reads a text key with {discount}/{name} filled in. */
export function useTexts() {
  const { texts, company } = useContext(ContentContext);
  return (key) => fillText(texts[key], company);
}
