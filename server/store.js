// MySQL data layer. Tables are created automatically on first start.
// Content, the admin account and the signing secret are cached in memory (single server process)
// and written through to the database on every change.
import crypto from 'node:crypto';
import mysql from 'mysql2/promise';
import { DEFAULT_CONTENT, mergeContent } from '../src/data/site.js';

let pool;
const cache = { content: {}, admin: null, secret: null };
const clone = (v) => JSON.parse(JSON.stringify(v));

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS sonex_settings (
     k VARCHAR(64) NOT NULL PRIMARY KEY,
     v TEXT NOT NULL
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS sonex_content (
     section VARCHAR(32) NOT NULL PRIMARY KEY,
     data LONGTEXT NOT NULL,
     updated_at TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS sonex_admin (
     id TINYINT UNSIGNED NOT NULL PRIMARY KEY,
     username VARCHAR(40) NOT NULL,
     salt CHAR(32) NOT NULL,
     hash CHAR(128) NOT NULL,
     version INT UNSIGNED NOT NULL DEFAULT 1,
     is_default TINYINT(1) NOT NULL DEFAULT 0
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS sonex_enquiries (
     id CHAR(36) NOT NULL PRIMARY KEY,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NULL,
     status ENUM('new','contacted','closed') NOT NULL DEFAULT 'new',
     name VARCHAR(100) NOT NULL,
     phone VARCHAR(20) NOT NULL,
     email VARCHAR(150) NOT NULL DEFAULT '',
     service VARCHAR(100) NOT NULL DEFAULT '',
     budget VARCHAR(60) NOT NULL DEFAULT '',
     message TEXT NOT NULL,
     notes TEXT NULL,
     KEY idx_created (created_at),
     KEY idx_status (status)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
  `CREATE TABLE IF NOT EXISTS sonex_testimonials (
     id CHAR(36) NOT NULL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     designation VARCHAR(100) NOT NULL DEFAULT '',
     company VARCHAR(100) NOT NULL DEFAULT '',
     rating TINYINT UNSIGNED NOT NULL DEFAULT 5,
     review TEXT NOT NULL,
     is_active TINYINT(1) NOT NULL DEFAULT 1,
     sort_order INT NOT NULL DEFAULT 0,
     image MEDIUMBLOB NULL,
     image_type VARCHAR(20) NULL,
     image_v INT UNSIGNED NOT NULL DEFAULT 0,
     created_at DATETIME NOT NULL,
     updated_at DATETIME NULL,
     KEY idx_active_sort (is_active, sort_order)
   ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
];

export async function init() {
  pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'sonex',
    charset: 'utf8mb4',
    connectionLimit: Number(process.env.DB_POOL) || 5,
    dateStrings: true,
    timezone: 'Z',
  });
  for (const sql of SCHEMA) await pool.query(sql);

  // Content: load saved sections, seed any that are missing.
  const [rows] = await pool.query('SELECT section, data FROM sonex_content');
  const saved = Object.fromEntries(rows.map((r) => [r.section, JSON.parse(r.data)]));
  for (const [section, value] of Object.entries(DEFAULT_CONTENT)) {
    if (!(section in saved)) {
      saved[section] = clone(value);
      await pool.query('INSERT INTO sonex_content (section, data) VALUES (?, ?)', [section, JSON.stringify(value)]);
    }
  }
  // Fill in fields added in newer versions so every page always gets complete data.
  cache.content = mergeContent(saved);

  // Secret used to sign login sessions.
  const [[secretRow]] = await pool.query("SELECT v FROM sonex_settings WHERE k = 'session_secret'");
  if (secretRow) cache.secret = secretRow.v;
  else {
    cache.secret = crypto.randomBytes(32).toString('hex');
    await pool.query("INSERT INTO sonex_settings (k, v) VALUES ('session_secret', ?)", [cache.secret]);
  }

  const [[admin]] = await pool.query('SELECT username, salt, hash, version, is_default FROM sonex_admin WHERE id = 1');
  cache.admin = admin ? { ...admin, isDefault: !!admin.is_default } : null;
}

export const ping = () => pool.query('SELECT 1');

/* ---------- content ---------- */
export const getContent = () => cache.content;

export async function setSection(section, data) {
  await pool.query(
    'INSERT INTO sonex_content (section, data) VALUES (?, ?) ON DUPLICATE KEY UPDATE data = VALUES(data)',
    [section, JSON.stringify(data)]
  );
  cache.content = mergeContent({ ...cache.content, [section]: data });
}

/* ---------- auth ---------- */
export const getSecret = () => cache.secret;
export const getAdmin = () => cache.admin;

export async function saveAdmin({ username, salt, hash, version, isDefault }) {
  await pool.query(
    `INSERT INTO sonex_admin (id, username, salt, hash, version, is_default) VALUES (1, ?, ?, ?, ?, ?)
     ON DUPLICATE KEY UPDATE username = VALUES(username), salt = VALUES(salt), hash = VALUES(hash),
       version = VALUES(version), is_default = VALUES(is_default)`,
    [username, salt, hash, version, isDefault ? 1 : 0]
  );
  cache.admin = { username, salt, hash, version, isDefault };
}

/* ---------- enquiries ---------- */
const toEnquiry = (r) => ({
  id: r.id,
  createdAt: r.created_at.replace(' ', 'T') + 'Z',
  updatedAt: r.updated_at ? r.updated_at.replace(' ', 'T') + 'Z' : null,
  status: r.status,
  name: r.name,
  phone: r.phone,
  email: r.email,
  service: r.service,
  budget: r.budget,
  message: r.message,
  notes: r.notes || '',
});

export async function listEnquiries(limit = 2000) {
  const [rows] = await pool.query('SELECT * FROM sonex_enquiries ORDER BY created_at DESC LIMIT ?', [limit]);
  return rows.map(toEnquiry);
}

export async function addEnquiry(e) {
  const id = crypto.randomUUID();
  // createdAt / status / notes are only passed by the seed script; the website always creates 'new' enquiries.
  const created = e.createdAt ? new Date(e.createdAt).toISOString().slice(0, 19).replace('T', ' ') : null;
  await pool.query(
    `INSERT INTO sonex_enquiries (id, created_at, status, name, phone, email, service, budget, message, notes)
     VALUES (?, COALESCE(?, UTC_TIMESTAMP()), ?, ?, ?, ?, ?, ?, ?, ?)`,
    [id, created, e.status || 'new', e.name, e.phone, e.email, e.service, e.budget, e.message, e.notes || '']
  );
  return id;
}

export const countEnquiries = async () => (await pool.query('SELECT COUNT(*) AS n FROM sonex_enquiries'))[0][0].n;
export const close = () => pool.end();

export async function updateEnquiry(id, { status, notes }) {
  const sets = [];
  const params = [];
  if (status !== undefined) { sets.push('status = ?'); params.push(status); }
  if (notes !== undefined) { sets.push('notes = ?'); params.push(notes); }
  sets.push('updated_at = UTC_TIMESTAMP()');
  const [res] = await pool.query(`UPDATE sonex_enquiries SET ${sets.join(', ')} WHERE id = ?`, [...params, id]);
  if (!res.affectedRows) return null;
  const [[row]] = await pool.query('SELECT * FROM sonex_enquiries WHERE id = ?', [id]);
  return toEnquiry(row);
}

export async function deleteEnquiry(id) {
  const [res] = await pool.query('DELETE FROM sonex_enquiries WHERE id = ?', [id]);
  return res.affectedRows > 0;
}

/* ---------- testimonials ---------- */
// The photo is stored in the row (MEDIUMBLOB) so it survives redeploys; it is served by its own
// versioned URL, and the image column is never selected for list queries.
const T_COLS = 'id, name, designation, company, rating, review, is_active, sort_order, image_type, image_v, created_at, updated_at';
const toIso = (d) => (d ? d.replace(' ', 'T') + 'Z' : null);

const toTestimonial = (r) => ({
  id: r.id,
  name: r.name,
  designation: r.designation,
  company: r.company,
  rating: r.rating,
  review: r.review,
  active: !!r.is_active,
  order: r.sort_order,
  image: r.image_type ? `/api/testimonials/${r.id}/image?v=${r.image_v}` : '',
  createdAt: toIso(r.created_at),
  updatedAt: toIso(r.updated_at),
});

export async function listTestimonials({ activeOnly = false } = {}) {
  const [rows] = await pool.query(
    `SELECT ${T_COLS} FROM sonex_testimonials ${activeOnly ? 'WHERE is_active = 1' : ''} ORDER BY sort_order, created_at`
  );
  return rows.map(toTestimonial);
}

export async function getTestimonial(id) {
  const [[row]] = await pool.query(`SELECT ${T_COLS} FROM sonex_testimonials WHERE id = ?`, [id]);
  return row ? toTestimonial(row) : null;
}

export const countTestimonials = async () => (await pool.query('SELECT COUNT(*) AS n FROM sonex_testimonials'))[0][0].n;

/** `t.image`: { data: Buffer, type } to set a photo; omitted for none. */
export async function addTestimonial(t) {
  const id = crypto.randomUUID();
  const [[{ next }]] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) + 1 AS next FROM sonex_testimonials');
  await pool.query(
    `INSERT INTO sonex_testimonials (id, name, designation, company, rating, review, is_active, sort_order, image, image_type, image_v, created_at)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, UTC_TIMESTAMP())`,
    [id, t.name, t.designation, t.company, t.rating, t.review, t.active ? 1 : 0, next,
      t.image?.data || null, t.image?.type || null, t.image ? 1 : 0]
  );
  return getTestimonial(id);
}

/**
 * Updates only the fields that are present.
 * `image`: undefined = keep, null = remove, { data, type } = replace.
 */
export async function updateTestimonial(id, t) {
  const sets = [];
  const params = [];
  const fields = { name: 'name', designation: 'designation', company: 'company', rating: 'rating', review: 'review' };
  for (const [key, col] of Object.entries(fields)) {
    if (t[key] !== undefined) { sets.push(`${col} = ?`); params.push(t[key]); }
  }
  if (t.active !== undefined) { sets.push('is_active = ?'); params.push(t.active ? 1 : 0); }
  if (t.image === null) sets.push('image = NULL, image_type = NULL');
  else if (t.image) { sets.push('image = ?, image_type = ?, image_v = image_v + 1'); params.push(t.image.data, t.image.type); }
  sets.push('updated_at = UTC_TIMESTAMP()');
  const [res] = await pool.query(`UPDATE sonex_testimonials SET ${sets.join(', ')} WHERE id = ?`, [...params, id]);
  return res.affectedRows ? getTestimonial(id) : null;
}

export async function deleteTestimonial(id) {
  const [res] = await pool.query('DELETE FROM sonex_testimonials WHERE id = ?', [id]);
  return res.affectedRows > 0;
}

/** Sets the display order from a list of ids (first = shown first). Unknown ids are ignored. */
export async function reorderTestimonials(ids) {
  const conn = await pool.getConnection();
  try {
    await conn.beginTransaction();
    for (const [i, id] of ids.entries()) await conn.query('UPDATE sonex_testimonials SET sort_order = ? WHERE id = ?', [i + 1, id]);
    await conn.commit();
  } catch (err) {
    await conn.rollback();
    throw err;
  } finally {
    conn.release();
  }
}

export async function getTestimonialImage(id) {
  const [[row]] = await pool.query('SELECT image, image_type, is_active FROM sonex_testimonials WHERE id = ?', [id]);
  return row?.image ? { data: row.image, type: row.image_type, active: !!row.is_active } : null;
}
