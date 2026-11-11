import './env.js';
import express from 'express';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as store from './store.js';
import { projectSlug } from '../src/data/site.js';
import {
  ensureAdmin, checkPassword, setCredentials, issueSession, clearSession, currentAdmin, requireAdmin, publicAdmin,
  DEFAULT_USER, DEFAULT_PASSWORD,
} from './auth.js';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIST = path.join(ROOT, 'dist');
const PORT = Number(process.env.PORT) || 4100;

try {
  await store.init();
} catch (err) {
  console.error(`\n  Could not connect to MySQL (${process.env.DB_USER || 'root'}@${process.env.DB_HOST || 'localhost'}/${process.env.DB_NAME || 'sonex'}).`);
  console.error(`  ${err.code || ''} ${err.message}`);
  console.error('  Check the DB_* values in your .env file and that MySQL is running.\n');
  process.exit(1);
}
if (await ensureAdmin()) {
  console.log(`\n  Admin account created → username: ${DEFAULT_USER}  password: ${DEFAULT_PASSWORD}`);
  console.log('  Change it from Admin → Settings after your first login.\n');
}

const app = express();
app.disable('x-powered-by');
if (process.env.TRUST_PROXY) app.set('trust proxy', 1); // behind Hostinger / nginx proxy → real client IP
app.use(express.json({ limit: '300kb' }));
app.use((req, res, next) => {
  res.set({ 'X-Content-Type-Options': 'nosniff', 'X-Frame-Options': 'DENY', 'Referrer-Policy': 'strict-origin-when-cross-origin' });
  next();
});

// Wraps async handlers so rejected promises reach the error handler.
const wrap = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

/* ---------------- helpers ---------------- */

function rateLimit({ windowMs, max, message }) {
  const hits = new Map();
  return (req, res, next) => {
    const now = Date.now();
    const rec = hits.get(req.ip);
    if (!rec || rec.reset < now) hits.set(req.ip, { count: 1, reset: now + windowMs });
    else if (++rec.count > max) return res.status(429).json({ error: message });
    if (hits.size > 5000) for (const [k, v] of hits) if (v.reset < now) hits.delete(k);
    next();
  };
}

const str = (v, max = 2000) => (typeof v === 'string' ? v.trim().slice(0, max) : '');
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Keeps only plain JSON values, trims strings and caps sizes. */
function sanitize(value, depth = 0) {
  if (depth > 5) return null;
  if (typeof value === 'string') return value.trim().slice(0, 3000);
  if (typeof value === 'number') return Number.isFinite(value) ? value : 0;
  if (typeof value === 'boolean') return value;
  if (Array.isArray(value)) return value.slice(0, 60).map((v) => sanitize(v, depth + 1));
  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).slice(0, 200).filter(([k]) => /^[a-zA-Z0-9_]{1,40}$/.test(k)).map(([k, v]) => [k, sanitize(v, depth + 1)])
    );
  }
  return null;
}

const SECTIONS = {
  company: 'object', hero: 'object', about: 'object', texts: 'object', seo: 'object',
  stats: 'array', services: 'array', projects: 'array', plans: 'array', budgets: 'array', values: 'array',
};

function validateSection(name, data) {
  if (name === 'company') {
    if (!data.name || !data.fullName) return 'Company name is required.';
    data.phoneIntl = String(data.phoneIntl || '').replace(/\D/g, '');
    data.phone = String(data.phone || '').replace(/\D/g, '');
    if (data.phoneIntl.length < 10) return 'WhatsApp / international number must include the country code, e.g. 917398748936.';
    if (data.email && !EMAIL_RE.test(data.email)) return 'Email address looks invalid.';
    data.launchDiscount = Math.min(90, Math.max(0, Math.round(Number(data.launchDiscount) || 0)));
    for (const k of ['instagram', 'facebook', 'linkedin', 'youtube', 'mapUrl']) {
      if (data[k] && !/^https?:\/\/\S+$/.test(data[k])) return `${k} link must start with https://`;
    }
  }
  if (name === 'values' && data.some((v) => !v?.title)) return 'Every value needs a title.';
  if (name === 'seo' && !data.title) return 'Page title is required.';
  if (name === 'plans') {
    for (const p of data) {
      if (!p?.name) return 'Every package needs a name.';
      p.price = Math.max(0, Math.round(Number(p.price) || 0));
    }
  }
  if (['services', 'projects'].includes(name) && data.some((i) => !i?.title)) return 'Every item needs a title.';
  if (name === 'projects') {
    // Each project gets a unique URL name for its /projects/<slug> page.
    const used = new Set();
    for (const p of data) {
      let slug = projectSlug(p) || 'project';
      for (let n = 2; used.has(slug); n++) slug = `${projectSlug(p) || 'project'}-${n}`;
      used.add(slug);
      p.slug = slug;
      if (p.liveUrl && !/^https?:\/\/\S+$/.test(p.liveUrl)) return `Live demo link for “${p.title}” must start with https://`;
      const images = [p.cover, ...(Array.isArray(p.gallery) ? p.gallery : [])].filter(Boolean);
      if (images.some((u) => typeof u !== 'string' || !/^(https?:\/\/|\/)\S+$/.test(u))) {
        return `Image links for “${p.title}” must start with https:// or /`;
      }
    }
  }
  if (name === 'stats' && data.some((s) => !s?.value || !s?.label)) return 'Every stat needs a value and a label.';
  if (name === 'budgets' && data.some((b) => typeof b !== 'string' || !b)) return 'Budgets must be text.';
  return null;
}

const ENQUIRY_STATUSES = ['new', 'contacted', 'closed'];

/* ---------------- testimonials ---------------- */

const IMAGE_MAX_BYTES = 200 * 1024; // the admin panel resizes photos to ~30–60 KB before upload
const IMAGE_SIGNATURES = {
  'image/jpeg': (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff,
  'image/png': (b) => b.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a])),
  'image/webp': (b) => b.subarray(0, 4).toString('latin1') === 'RIFF' && b.subarray(8, 12).toString('latin1') === 'WEBP',
};

/** Parses a data: URL into { data, type }. Returns a string message when it is not an acceptable image. */
function parseImage(value) {
  const m = typeof value === 'string' && /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=]+)$/.exec(value);
  if (!m) return 'Photo must be a JPG, PNG or WebP image.';
  const data = Buffer.from(m[2], 'base64');
  if (data.length > IMAGE_MAX_BYTES) return 'Photo is too large (max 200 KB after resizing).';
  if (!IMAGE_SIGNATURES[m[1]](data)) return 'Photo file looks damaged or is not a real image.';
  return { data, type: m[1] };
}

/**
 * Validates a testimonial body. With `partial`, only the fields present are checked (for edits).
 * Returns { error } or { value } ready for the store.
 */
function readTestimonial(b, { partial = false } = {}) {
  const v = {};
  const has = (k) => !partial || b[k] !== undefined;
  if (has('name')) {
    v.name = str(b.name, 100);
    if (v.name.length < 2) return { error: 'Customer name is required.' };
  }
  if (has('designation')) v.designation = str(b.designation, 100);
  if (has('company')) v.company = str(b.company, 100);
  if (has('rating')) {
    v.rating = Math.round(Number(b.rating));
    if (!(v.rating >= 1 && v.rating <= 5)) return { error: 'Rating must be between 1 and 5 stars.' };
  }
  if (has('review')) {
    v.review = str(b.review, 1500);
    if (v.review.length < 10) return { error: 'Review text is too short (at least 10 characters).' };
  }
  if (b.active !== undefined || !partial) v.active = b.active === undefined ? true : !!b.active;
  if (b.image === null || b.image === '') v.image = null;
  else if (b.image !== undefined) {
    const img = parseImage(b.image);
    if (typeof img === 'string') return { error: img };
    v.image = img;
  }
  return { value: v };
}
const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

/* ---------------- public API ---------------- */

app.get('/api/content', (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.json(store.getContent());
});

app.post(
  '/api/enquiries',
  rateLimit({ windowMs: 10 * 60e3, max: 6, message: 'Too many enquiries. Please call or WhatsApp us instead.' }),
  wrap(async (req, res) => {
    const b = req.body || {};
    if (b.website) return res.status(201).json({ ok: true }); // honeypot field filled → bot
    const e = {
      name: str(b.name, 100),
      phone: str(b.phone, 20),
      email: str(b.email, 150),
      service: str(b.service, 100),
      budget: str(b.budget, 60),
      message: str(b.message, 3000),
    };
    if (e.name.length < 2) return res.status(400).json({ error: 'Name is required.' });
    if (!/^(91)?[6-9]\d{9}$/.test(e.phone.replace(/\D/g, ''))) return res.status(400).json({ error: 'Valid phone is required.' });
    if (e.email && !EMAIL_RE.test(e.email)) return res.status(400).json({ error: 'Email looks invalid.' });
    if (e.message.length < 10) return res.status(400).json({ error: 'Message is too short.' });
    const { texts } = store.getContent();
    if (texts.showEmailField !== false && texts.requireEmail && !e.email) return res.status(400).json({ error: 'Email is required.' });
    await store.addEnquiry(e);
    res.status(201).json({ ok: true });
  })
);

// Only active testimonials, in display order.
app.get('/api/testimonials', wrap(async (req, res) => {
  res.set('Cache-Control', 'no-cache');
  res.json(await store.listTestimonials({ activeOnly: true }));
}));

// Profile photo. URLs carry a version (?v=) that changes with the photo, so active photos are cached for good.
// Photos of inactive testimonials are only visible to the admin.
app.get('/api/testimonials/:id/image', wrap(async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).end();
  const img = await store.getTestimonialImage(req.params.id);
  if (!img || (!img.active && !currentAdmin(req))) return res.status(404).end();
  res.set({
    'Content-Type': img.type,
    'Cache-Control': img.active ? 'public, max-age=31536000, immutable' : 'private, no-store',
    'Content-Security-Policy': "default-src 'none'",
  });
  res.send(img.data);
}));

/* ---------------- auth ---------------- */

const loginLimiter = rateLimit({ windowMs: 15 * 60e3, max: 8, message: 'Too many login attempts. Try again in 15 minutes.' });

app.post('/api/auth/login', loginLimiter, (req, res) => {
  const { username, password } = req.body || {};
  const ok = typeof username === 'string' && typeof password === 'string' &&
    username.trim().toLowerCase() === store.getAdmin().username.toLowerCase() && checkPassword(password);
  if (!ok) return res.status(401).json({ error: 'Wrong username or password.' });
  issueSession(res);
  res.json(publicAdmin());
});

app.post('/api/auth/logout', (req, res) => {
  clearSession(res);
  res.json({ ok: true });
});

app.get('/api/auth/me', (req, res) => {
  const admin = currentAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Not logged in.' });
  res.json(admin);
});

app.put('/api/auth/credentials', requireAdmin, loginLimiter, wrap(async (req, res) => {
  const { currentPassword, username, newPassword } = req.body || {};
  if (typeof currentPassword !== 'string' || !checkPassword(currentPassword)) return res.status(400).json({ error: 'Current password is wrong.' });
  const user = str(username, 40) || store.getAdmin().username;
  if (!/^[a-zA-Z0-9_.@-]{3,40}$/.test(user)) return res.status(400).json({ error: 'Username: 3–40 letters, numbers or . _ @ -' });
  const pw = typeof newPassword === 'string' && newPassword ? newPassword : currentPassword;
  if (pw.length < 8) return res.status(400).json({ error: 'New password must be at least 8 characters.' });
  await setCredentials(user, pw);
  issueSession(res);
  res.json(publicAdmin());
}));

/* ---------------- admin API ---------------- */

app.put('/api/content/:section', requireAdmin, wrap(async (req, res) => {
  const { section } = req.params;
  const type = SECTIONS[section];
  if (!type) return res.status(404).json({ error: 'Unknown section.' });
  const data = sanitize(req.body?.data);
  if (type === 'array' ? !Array.isArray(data) : !data || Array.isArray(data)) return res.status(400).json({ error: 'Invalid data.' });
  const problem = validateSection(section, data);
  if (problem) return res.status(400).json({ error: problem });
  await store.setSection(section, data);
  res.json({ ok: true, data });
}));

app.get('/api/enquiries', requireAdmin, wrap(async (req, res) => res.json(await store.listEnquiries())));

app.patch('/api/enquiries/:id', requireAdmin, wrap(async (req, res) => {
  const { status, notes } = req.body || {};
  if (status !== undefined && !ENQUIRY_STATUSES.includes(status)) return res.status(400).json({ error: 'Invalid status.' });
  const item = await store.updateEnquiry(req.params.id, { status, notes: notes === undefined ? undefined : str(notes, 3000) });
  if (!item) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json(item);
}));

app.delete('/api/enquiries/:id', requireAdmin, wrap(async (req, res) => {
  if (!(await store.deleteEnquiry(req.params.id))) return res.status(404).json({ error: 'Enquiry not found.' });
  res.json({ ok: true });
}));

// Testimonials management (all statuses).
app.get('/api/testimonials/manage', requireAdmin, wrap(async (req, res) => res.json(await store.listTestimonials())));

app.post('/api/testimonials', requireAdmin, wrap(async (req, res) => {
  const { error, value } = readTestimonial(req.body || {});
  if (error) return res.status(400).json({ error });
  res.status(201).json(await store.addTestimonial(value));
}));

app.put('/api/testimonials/order', requireAdmin, wrap(async (req, res) => {
  const ids = req.body?.ids;
  if (!Array.isArray(ids) || ids.length > 500 || !ids.every((id) => typeof id === 'string' && UUID_RE.test(id))) {
    return res.status(400).json({ error: 'Invalid order.' });
  }
  await store.reorderTestimonials(ids);
  res.json(await store.listTestimonials());
}));

// PUT edits the testimonial; PATCH is used for quick changes such as switching it on / off. Both accept partial bodies.
const updateTestimonial = wrap(async (req, res) => {
  if (!UUID_RE.test(req.params.id)) return res.status(404).json({ error: 'Testimonial not found.' });
  const { error, value } = readTestimonial(req.body || {}, { partial: true });
  if (error) return res.status(400).json({ error });
  const item = await store.updateTestimonial(req.params.id, value);
  if (!item) return res.status(404).json({ error: 'Testimonial not found.' });
  res.json(item);
});
app.put('/api/testimonials/:id', requireAdmin, updateTestimonial);
app.patch('/api/testimonials/:id', requireAdmin, updateTestimonial);

app.delete('/api/testimonials/:id', requireAdmin, wrap(async (req, res) => {
  if (!UUID_RE.test(req.params.id) || !(await store.deleteTestimonial(req.params.id))) {
    return res.status(404).json({ error: 'Testimonial not found.' });
  }
  res.json({ ok: true });
}));

app.get('/api/health', wrap(async (req, res) => {
  await store.ping();
  res.json({ ok: true });
}));

app.use('/api', (req, res) => res.status(404).json({ error: 'Not found.' }));

/* ---------------- production: serve the built site ---------------- */

if (fs.existsSync(path.join(DIST, 'index.html'))) {
  const template = fs.readFileSync(path.join(DIST, 'index.html'), 'utf8');
  app.use(express.static(DIST, { index: false, maxAge: '7d' }));
  const esc = (s) => String(s ?? '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

  // Puts the admin-managed SEO + business details into the HTML so search engines see them without JavaScript.
  async function renderPage() {
    const content = store.getContent();
    const testimonials = JSON.stringify(await store.listTestimonials({ activeOnly: true })).replace(/</g, '\\u003c');
    const { seo, company } = content;
    const jsonLd = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: company.fullName,
      slogan: company.tagline,
      telephone: `+${company.phoneIntl}`,
      email: company.email || undefined,
      description: seo.description,
      priceRange: '₹₹',
      sameAs: [company.instagram, company.facebook, company.linkedin, company.youtube].filter(Boolean),
    }).replace(/</g, '\\u003c');
    const json = JSON.stringify(content).replace(/</g, '\\u003c');
    return template
      .replace(/<title>[\s\S]*?<\/title>/, `<title>${esc(seo.title)}</title>`)
      .replace(/(<meta name="description" content=")[^"]*/, `$1${esc(seo.description)}`)
      .replace(/(<meta name="keywords" content=")[^"]*/, `$1${esc(seo.keywords)}`)
      .replace(/(<meta property="og:title" content=")[^"]*/, `$1${esc(seo.title)}`)
      .replace(/(<meta property="og:description" content=")[^"]*/, `$1${esc(seo.description)}`)
      .replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/, `<script type="application/ld+json">${jsonLd}</script>`)
      // Inline the content so the page renders instantly, without waiting for /api/content.
      .replace('</head>', `<script>window.__SONEX_CONTENT__=${json};window.__SONEX_TESTIMONIALS__=${testimonials}</script></head>`);
  }

  app.get('*', wrap(async (req, res) => {
    const isAdmin = req.path.startsWith('/admin');
    if (isAdmin) res.set('X-Robots-Tag', 'noindex, nofollow');
    res.set('Cache-Control', 'no-cache').type('html').send(isAdmin ? template : await renderPage());
  }));
}

app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') return res.status(400).json({ error: 'Invalid JSON.' });
  if (err.type === 'entity.too.large') return res.status(413).json({ error: 'Data too large.' });
  console.error(err);
  res.status(500).json({ error: 'Server error. Please try again.' });
});

app.listen(PORT, () => console.log(`  SONEX API running on http://localhost:${PORT}`));
