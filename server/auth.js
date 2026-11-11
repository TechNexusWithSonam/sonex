import crypto from 'node:crypto';
import { getAdmin, saveAdmin, getSecret } from './store.js';

const COOKIE = 'sonex_admin';
const SESSION_HOURS = 12;
export const DEFAULT_USER = process.env.ADMIN_USER || 'admin';
// No hard-coded default: without ADMIN_PASSWORD a random one is generated and printed once in the server log.
export const DEFAULT_PASSWORD = process.env.ADMIN_PASSWORD || `Sonex-${crypto.randomBytes(6).toString('base64url')}`;

const b64 = (s) => Buffer.from(s).toString('base64url');
const hmac = (data) => crypto.createHmac('sha256', getSecret()).update(data).digest('base64url');

export function hashPassword(password, salt = crypto.randomBytes(16).toString('hex')) {
  return { salt, hash: crypto.scryptSync(password, salt, 64).toString('hex') };
}

function safeEqual(a, b) {
  const x = Buffer.from(a);
  const y = Buffer.from(b);
  return x.length === y.length && crypto.timingSafeEqual(x, y);
}

export function checkPassword(password) {
  const admin = getAdmin();
  return safeEqual(hashPassword(password, admin.salt).hash, admin.hash);
}

/** Creates the first admin account if none exists. Returns true when it created one. */
export async function ensureAdmin() {
  if (getAdmin()) return false;
  await saveAdmin({ username: DEFAULT_USER, ...hashPassword(DEFAULT_PASSWORD), version: 1, isDefault: !process.env.ADMIN_PASSWORD });
  return true;
}

export async function setCredentials(username, password) {
  // Bumping the version logs out every existing session.
  await saveAdmin({ username, ...hashPassword(password), version: (getAdmin()?.version || 0) + 1, isDefault: false });
}

export function issueSession(res) {
  const admin = getAdmin();
  const payload = b64(JSON.stringify({ u: admin.username, v: admin.version, exp: Date.now() + SESSION_HOURS * 3600e3 }));
  res.cookie(COOKIE, `${payload}.${hmac(payload)}`, {
    httpOnly: true,
    sameSite: 'strict',
    secure: process.env.NODE_ENV === 'production' && process.env.INSECURE_COOKIE !== '1',
    maxAge: SESSION_HOURS * 3600e3,
    path: '/',
  });
}

export const clearSession = (res) => res.clearCookie(COOKIE, { path: '/' });

function readCookie(req) {
  const header = req.headers.cookie || '';
  const match = header.split(';').map((c) => c.trim()).find((c) => c.startsWith(`${COOKIE}=`));
  return match ? decodeURIComponent(match.slice(COOKIE.length + 1)) : null;
}

export const publicAdmin = () => ({ username: getAdmin().username, isDefault: !!getAdmin().isDefault });

export function currentAdmin(req) {
  const token = readCookie(req);
  if (!token) return null;
  const [payload, sig] = token.split('.');
  if (!payload || !sig || !safeEqual(hmac(payload), sig)) return null;
  try {
    const data = JSON.parse(Buffer.from(payload, 'base64url').toString());
    const admin = getAdmin();
    if (data.exp < Date.now() || data.v !== admin.version || data.u !== admin.username) return null;
    return publicAdmin();
  } catch {
    return null;
  }
}

export function requireAdmin(req, res, next) {
  const admin = currentAdmin(req);
  if (!admin) return res.status(401).json({ error: 'Please log in again.' });
  req.admin = admin;
  next();
}
