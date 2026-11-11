// Seeds the database: tables, site content, admin login and sample enquiries.
//
//   npm run seed                                  → local DB (.env)
//   npm run seed -- --env .env.live               → live Hostinger DB
//   options:  --user <name>  --password <pass>  --new-password  --reset-content  --no-demo
import './env.js';
import crypto from 'node:crypto';
import * as store from './store.js';
import { setCredentials } from './auth.js';
import { DEFAULT_CONTENT } from '../src/data/site.js';

const arg = (name) => {
  const i = process.argv.indexOf(`--${name}`);
  return i > -1 ? process.argv[i + 1] : undefined;
};
const flag = (name) => process.argv.includes(`--${name}`);

function strongPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789';
  const part = () => Array.from(crypto.randomBytes(4), (b) => chars[b % chars.length]).join('');
  return `Sonex-${part()}-${part()}@${crypto.randomInt(10, 99)}`;
}

const hoursAgo = (h) => new Date(Date.now() - h * 3600e3).toISOString();

const DEMO_ENQUIRIES = [
  { name: 'Rahul Sharma', phone: '9876543210', email: 'rahul.sharma@example.com', service: 'E-commerce', budget: '₹35,000 – ₹75,000', message: 'I run a clothing boutique and want an online store with payment gateway and order tracking.', status: 'new', createdAt: hoursAgo(2) },
  { name: 'Priya Verma', phone: '9123456780', email: 'priya@example.com', service: 'Billing Software', budget: '₹15,000 – ₹35,000', message: 'Need GST billing software for my medical store with barcode scanning and daily reports.', status: 'new', createdAt: hoursAgo(9) },
  { name: 'Amit Patel', phone: '9988776655', email: '', service: 'Website Development', budget: 'Under ₹15,000', message: 'Simple 5-page website for my coaching institute with a WhatsApp button and enquiry form.', status: 'contacted', notes: 'Called on Monday, sent Starter package quote.', createdAt: hoursAgo(30) },
  { name: 'Sneha Gupta', phone: '9090909090', email: 'sneha.g@example.com', service: 'Mobile Apps', budget: '₹75,000+', message: 'Looking for an Android + iOS app for gym members — class booking, payments and trainer schedules.', status: 'contacted', notes: 'Meeting fixed for Friday 4 PM.', createdAt: hoursAgo(54) },
  { name: 'Vikram Singh', phone: '8899776655', email: 'vikram@example.com', service: 'Inventory Management', budget: '₹35,000 – ₹75,000', message: 'We have 2 warehouses and need stock tracking with purchase orders and low-stock alerts.', status: 'closed', notes: 'Project confirmed. Advance received.', createdAt: hoursAgo(120) },
  { name: 'Neha Joshi', phone: '7766554433', email: '', service: 'API Integrations', budget: 'Not sure yet', message: 'Want to connect our website orders with WhatsApp notifications and Shiprocket.', status: 'new', createdAt: hoursAgo(170) },
];

try {
  await store.init(); // creates tables + fills any missing content sections
  console.log(`  ✓ Connected to ${process.env.DB_NAME || 'sonex'} on ${process.env.DB_HOST || 'localhost'}`);
  console.log('  ✓ Tables ready');

  if (flag('reset-content')) {
    for (const [section, data] of Object.entries(DEFAULT_CONTENT)) await store.setSection(section, data);
    console.log('  ✓ Site content reset to defaults');
  } else {
    // Keep existing edits, but write back every section with any newly added fields filled in.
    const merged = store.getContent();
    for (const section of Object.keys(DEFAULT_CONTENT)) await store.setSection(section, merged[section]);
    console.log(`  ✓ Site content synced — ${Object.keys(DEFAULT_CONTENT).length} sections (existing edits kept; --reset-content to restore defaults)`);
  }

  // Login is only changed when asked (--user / --password / --new-password) or when no admin exists yet.
  let username = store.getAdmin()?.username;
  let password = null;
  if (!store.getAdmin() || arg('user') || arg('password') || flag('new-password')) {
    username = arg('user') || username || 'admin';
    password = arg('password') || strongPassword();
    if (password.length < 8) throw new Error('Password must be at least 8 characters.');
    await setCredentials(username, password);
    console.log('  ✓ Admin login set');
  } else {
    console.log('  ✓ Existing admin login kept (use --new-password to generate a new one)');
  }

  if (!flag('no-demo')) {
    if ((await store.countEnquiries()) === 0) {
      for (const e of DEMO_ENQUIRIES) await store.addEnquiry(e);
      console.log(`  ✓ ${DEMO_ENQUIRIES.length} sample enquiries added`);
    } else {
      console.log('  • Enquiries already exist — sample enquiries skipped');
    }
  }

  console.log('\n  ┌──────────────────────────────────────────');
  console.log(`  │ Admin URL : /admin`);
  console.log(`  │ Username  : ${username}`);
  console.log(`  │ Password  : ${password || '(unchanged)'}`);
  console.log('  └──────────────────────────────────────────');
  console.log('  Restart the server (npm run dev / npm start) so it picks up the changes.\n');
} catch (err) {
  console.error(`\n  Seed failed: ${err.code || ''} ${err.message}\n`);
  process.exitCode = 1;
} finally {
  await store.close().catch(() => {});
}
