import { useCallback, useEffect, useRef, useState } from 'react';
import { api, setUnauthorizedHandler } from './api';
import { LIST_SCHEMAS, OBJECT_SCHEMAS, TEXT_GROUPS } from './schemas';
import { ListEditor, ObjectEditor, PageHeader } from './Editors';
import Dashboard from './Dashboard';
import Enquiries from './Enquiries';
import Settings from './Settings';
import Icon from '../components/Icon';
import { mergeContent } from '../data/site';
import './admin.css';

const PAGES = [
  { id: 'dashboard', label: 'Dashboard', icon: 'target' },
  { id: 'enquiries', label: 'Enquiries', icon: 'mail' },
  { id: 'home', label: 'Home & About', icon: 'globe' },
  { id: 'text', label: 'Section Text', icon: 'menu' },
  { id: 'services', label: 'Services', icon: 'code' },
  { id: 'projects', label: 'Projects', icon: 'box' },
  { id: 'pricing', label: 'Pricing', icon: 'receipt' },
  { id: 'stats', label: 'Stats', icon: 'spark' },
  { id: 'values', label: 'Why Choose Us', icon: 'check' },
  { id: 'company', label: 'Company & Offer', icon: 'shield' },
  { id: 'seo', label: 'SEO', icon: 'pin' },
  { id: 'settings', label: 'Settings', icon: 'eye' },
];
const pageFromHash = () => {
  const id = window.location.hash.replace(/^#\/?/, '');
  return PAGES.some((p) => p.id === id) ? id : 'dashboard';
};

function Login({ onLogin }) {
  const [f, setF] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const submit = async (e) => {
    e.preventDefault();
    if (!f.username || !f.password) return setError('Enter your username and password.');
    setBusy(true);
    setError('');
    try {
      onLogin(await api.post('/api/auth/login', f));
    } catch (err) {
      setError(err.message);
    } finally {
      setBusy(false);
    }
  };
  return (
    <main className="a-login">
      <form className="a-login__box" onSubmit={submit} noValidate>
        <span className="logo">
          <span className="logo__mark" aria-hidden="true">S</span>
          <span className="logo__text">SONEX<small>Admin Panel</small></span>
        </span>
        <h1>Sign in</h1>
        <div className="a-field">
          <label htmlFor="l-user">Username</label>
          <input id="l-user" autoComplete="username" autoFocus value={f.username} onChange={(e) => setF({ ...f, username: e.target.value })} />
        </div>
        <div className="a-field">
          <label htmlFor="l-pass">Password</label>
          <input id="l-pass" type="password" autoComplete="current-password" value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} />
        </div>
        {error && <p className="a-error a-error--block" role="alert">{error}</p>}
        <button type="submit" className="btn btn--gold btn--block" disabled={busy}>{busy ? 'Signing in…' : 'Sign in'}</button>
        <a className="a-login__back" href="/">← Back to website</a>
      </form>
    </main>
  );
}

function Toasts({ items }) {
  return (
    <div className="a-toasts" aria-live="polite">
      {items.map((t) => (
        <div key={t.id} className={`a-toast a-toast--${t.type}`} role={t.type === 'error' ? 'alert' : 'status'}>{t.message}</div>
      ))}
    </div>
  );
}

export default function AdminApp() {
  const [user, setUser] = useState(undefined); // undefined = checking, null = logged out
  const [content, setContent] = useState(null);
  const [enquiries, setEnquiries] = useState([]);
  const [loadingEnq, setLoadingEnq] = useState(false);
  const [page, setPage] = useState(pageFromHash);
  const [menuOpen, setMenuOpen] = useState(false);
  const [toasts, setToasts] = useState([]);
  const dirty = useRef({});

  const toast = useCallback((message, type = 'success') => {
    const id = Math.random().toString(36).slice(2);
    setToasts((t) => [...t, { id, message, type }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), type === 'error' ? 6000 : 3500);
  }, []);

  const setDirty = useCallback((key, value) => { dirty.current[key] = value; }, []);
  const hasUnsaved = () => Object.values(dirty.current).some(Boolean);

  useEffect(() => {
    document.title = 'Admin · SONEX';
    const meta = Object.assign(document.createElement('meta'), { name: 'robots', content: 'noindex, nofollow' });
    document.head.appendChild(meta);
    setUnauthorizedHandler(() => { setUser(null); toast('Your session expired. Please sign in again.', 'error'); });
    api.get('/api/auth/me').then(setUser).catch(() => setUser(null));
    const warn = (e) => { if (hasUnsaved()) { e.preventDefault(); e.returnValue = ''; } };
    window.addEventListener('beforeunload', warn);
    const onHash = () => setPage(pageFromHash());
    window.addEventListener('hashchange', onHash);
    return () => { window.removeEventListener('beforeunload', warn); window.removeEventListener('hashchange', onHash); meta.remove(); };
  }, [toast]);

  const loadEnquiries = useCallback(async () => {
    setLoadingEnq(true);
    try { setEnquiries(await api.get('/api/enquiries')); } catch (err) { if (err.status !== 401) toast(err.message, 'error'); }
    finally { setLoadingEnq(false); }
  }, [toast]);

  useEffect(() => {
    if (!user) return;
    api.get('/api/content').then((c) => setContent(mergeContent(c))).catch((err) => toast(err.message, 'error'));
    loadEnquiries();
  }, [user, loadEnquiries, toast]);

  const go = (id) => {
    if (id !== page && hasUnsaved() && !window.confirm('You have unsaved changes. Leave this page without saving?')) return;
    dirty.current = {};
    window.location.hash = `/${id}`;
    setPage(id);
    setMenuOpen(false);
    window.scrollTo(0, 0);
  };

  const logout = async () => {
    if (hasUnsaved() && !window.confirm('You have unsaved changes. Log out anyway?')) return;
    await api.post('/api/auth/logout').catch(() => {});
    setUser(null);
    setContent(null);
  };

  const onSaved = useCallback((section, data) => setContent((c) => ({ ...c, [section]: data })), []);

  if (user === undefined) return <div className="boot" />;
  if (!user) return (<><Login onLogin={(u) => { setUser(u); }} /><Toasts items={toasts} /></>);

  const newCount = enquiries.filter((e) => e.status === 'new').length;
  const editorProps = { onSaved, toast, setDirty };

  let body = <div className="a-empty"><p>Loading…</p></div>;
  if (content) {
    switch (page) {
      case 'enquiries':
        body = <Enquiries items={enquiries} setItems={setEnquiries} reload={loadEnquiries} loading={loadingEnq} toast={toast} companyName={content.company.name} />;
        break;
      case 'services':
      case 'projects':
      case 'stats':
      case 'values':
        body = <ListEditor key={page} section={page} schema={LIST_SCHEMAS[page]} data={content[page]} {...editorProps} />;
        break;
      case 'pricing':
        body = <ListEditor key="plans" section="plans" schema={LIST_SCHEMAS.plans} data={content.plans} {...editorProps} />;
        break;
      case 'home':
        body = (
          <>
            <PageHeader title="Home & About" description="Main headline, intro text, mission and vision." />
            <div className="a-stack">
              <ObjectEditor section="hero" schema={OBJECT_SCHEMAS.hero} data={content.hero} {...editorProps} />
              <ObjectEditor section="about" schema={OBJECT_SCHEMAS.about} data={content.about} {...editorProps} />
            </div>
          </>
        );
        break;
      case 'company':
        body = (
          <>
            <PageHeader title="Company & Offer" description="Contact details used across the site, and the launch discount." />
            <div className="a-stack">
              <ObjectEditor section="company" schema={OBJECT_SCHEMAS.company} data={content.company} {...editorProps} />
              <ObjectEditor section="company" schema={OBJECT_SCHEMAS.social} data={content.company} {...editorProps} />
              <ObjectEditor section="budgets" schema={OBJECT_SCHEMAS.budgets} data={content.budgets} {...editorProps} />
            </div>
          </>
        );
        break;
      case 'text':
        body = (
          <>
            <PageHeader title="Section Text" description="Headings and short texts for every section of the website. Use {discount} to insert the launch discount." />
            <div className="a-stack">
              {TEXT_GROUPS.map((g) => (
                <ObjectEditor key={g.title} section="texts" schema={g} data={content.texts} {...editorProps} />
              ))}
            </div>
          </>
        );
        break;
      case 'seo':
        body = (
          <>
            <PageHeader title="SEO" description="How your website appears in Google and when shared on WhatsApp / social media." />
            <ObjectEditor section="seo" schema={OBJECT_SCHEMAS.seo} data={content.seo} {...editorProps} />
          </>
        );
        break;
      case 'settings':
        body = <Settings user={user} setUser={setUser} toast={toast} />;
        break;
      default:
        body = <Dashboard content={content} enquiries={enquiries} go={go} user={user} />;
    }
  }

  return (
    <div className="admin">
      <aside className={`a-side ${menuOpen ? 'is-open' : ''}`} aria-label="Admin navigation">
        <div className="a-side__brand">
          <span className="logo">
            <span className="logo__mark" aria-hidden="true">{content?.company.name.charAt(0) || 'S'}</span>
            <span className="logo__text">{content?.company.name || 'SONEX'}<small>Admin Panel</small></span>
          </span>
        </div>
        <nav>
          <ul>
            {PAGES.map((p) => (
              <li key={p.id}>
                <button type="button" className={page === p.id ? 'is-active' : ''} aria-current={page === p.id ? 'page' : undefined} onClick={() => go(p.id)}>
                  <Icon name={p.icon} size={18} />
                  <span>{p.label}</span>
                  {p.id === 'enquiries' && newCount > 0 && <span className="a-badge" aria-label={`${newCount} new`}>{newCount}</span>}
                </button>
              </li>
            ))}
          </ul>
        </nav>
        <div className="a-side__foot">
          <a href="/" target="_blank" rel="noopener noreferrer" className="a-side__site">View website ↗</a>
          <button type="button" className="a-side__logout" onClick={logout}>Log out</button>
        </div>
      </aside>
      {menuOpen && <div className="a-scrim" onClick={() => setMenuOpen(false)} aria-hidden="true" />}

      <div className="a-main">
        <header className="a-top">
          <button type="button" className="a-icon-btn a-top__menu" onClick={() => setMenuOpen(true)} aria-label="Open menu">
            <Icon name="menu" />
          </button>
          <span className="a-top__title">{PAGES.find((p) => p.id === page)?.label}</span>
          <span className="a-top__user">{user.username}</span>
        </header>
        <main className="a-content">{body}</main>
      </div>
      <Toasts items={toasts} />
    </div>
  );
}
