import { StrictMode, Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';
import { ContentProvider } from './content/ContentContext';
import './index.css';
import './styles/project-detail.css';
import './styles/pages.css';

// The admin panel is a separate, lazily-loaded bundle so visitors never download it.
const AdminApp = lazy(() => import('./admin/AdminApp'));
const isAdmin = /^\/admin(\/|$)/.test(window.location.pathname);

createRoot(document.getElementById('root')).render(
  <StrictMode>
    {isAdmin ? (
      <Suspense fallback={<div className="boot" aria-label="Loading" />}>
        <AdminApp />
      </Suspense>
    ) : (
      <ContentProvider>
        <App />
      </ContentProvider>
    )}
  </StrictMode>
);
