import { useEffect, useState } from 'react';

// Minimal client-side router. Pages: "/", "/about", "/services", "/projects", "/projects/<slug>", "/pricing", "/contact".
const ROUTE_EVENT = 'sonex:navigate';

/** Go to a path inside the site without a full page reload (e.g. "/contact" or "/projects/stockpilot"). */
export function navigate(to) {
  if (to === window.location.pathname + window.location.hash) return;
  history.pushState(null, '', to);
  window.dispatchEvent(new Event(ROUTE_EVENT));
}

/** Current location path, updated on navigate() and on browser back / forward. */
export function usePathname() {
  const [path, setPath] = useState(window.location.pathname);
  useEffect(() => {
    const update = () => setPath(window.location.pathname);
    window.addEventListener('popstate', update);
    window.addEventListener(ROUTE_EVENT, update);
    return () => {
      window.removeEventListener('popstate', update);
      window.removeEventListener(ROUTE_EVENT, update);
    };
  }, []);
  return path;
}

/** onClick for internal <a href> links: navigates in-app unless the user opens it in a new tab. */
export function linkClick(e) {
  if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  e.preventDefault();
  navigate(e.currentTarget.getAttribute('href'));
}

export const projectPath = (slug) => `/projects/${slug}`;
