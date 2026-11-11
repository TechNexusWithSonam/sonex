# SONEX Software Solutions — Website + Admin Panel

React (Vite) website with a Node.js/Express API and MySQL database.

- Website: `/`
- Admin panel: `/admin`. From it you can edit services, projects, pricing, stats, home/about text, company details, the launch offer and budget options, manage customer testimonials (photo, rating, active/inactive), and view and manage enquiries.

## Local development (WAMP)

1. Start WampServer so MySQL is running, and create a database called `sonex` (e.g. in phpMyAdmin).
2. Check the `.env` settings (default: `root` with no password, database `sonex`).
3. Run:

```bash
npm install
npm run dev
```

- Website: http://localhost:5174
- Admin: http://localhost:5174/admin

On first start, the tables are created automatically.

### Seeding data and admin login

```bash
npm run seed                                   # local DB: content, admin login (new strong password), sample enquiries
npm run seed -- --user admin --password "MyPass@123"   # choose your own login
npm run seed -- --reset-content                # also overwrite site content with defaults
npm run seed -- --no-demo                      # skip sample enquiries and sample testimonials
npm run seed -- --show-samples                 # sample testimonials (with avatars) shown on the site — for previews/demos only
npm run seed -- --reset-samples --show-samples # replace previously seeded sample testimonials
npm run seed:live                              # same, on the live Hostinger DB (.env.live)
```

The seed prints the admin username and password. Restart the server afterwards.

## Production

```bash
npm run build   # builds the site into dist/
npm start       # serves the website, admin and API on PORT (default 4100)
```

### Hostinger (Node.js app)

1. In hPanel open **Websites → Add website → Node.js app**, and upload the project (or connect a GitHub repo).
   Do not upload `node_modules`, `dist` or `data`.
2. Settings:
   - Node version: 20 or newer
   - Build command: `npm run build`
   - Start / entry file: `server/index.js`
3. Environment variables: copy the values from `.env.hostinger` into the app's environment settings, or upload that file as `.env`.
   The app runs on Hostinger, so `DB_HOST` stays `localhost`.
4. Deploy. Then open `https://your-domain/admin` and change the admin password straight away.

To connect to the Hostinger database from your own PC, enable **Databases → Remote MySQL** for your IP in hPanel. Then use the host shown there as `DB_HOST`.

## Environment variables

| Name | Purpose |
| --- | --- |
| `PORT` | Port the server listens on (default 4100) |
| `DB_HOST`, `DB_PORT`, `DB_NAME`, `DB_USER`, `DB_PASSWORD` | MySQL connection |
| `ADMIN_USER`, `ADMIN_PASSWORD` | First admin login (only used when no admin exists yet) |
| `NODE_ENV=production` | Login cookie sent over HTTPS only |
| `TRUST_PROXY=1` | Set when running behind a proxy (Hostinger), so rate limits use the real visitor IP |

## Database tables

All tables are created automatically and prefixed with `sonex_`:
`sonex_content` (editable site sections, stored as JSON), `sonex_enquiries` (contact-form leads),
`sonex_admin` (login, scrypt-hashed password), `sonex_settings` (session signing secret).

## Where things live

- `src/components/`: website sections
- `src/admin/`: admin panel (loaded only on `/admin`)
- `src/admin/schemas.js`: which fields each admin section edits
- `src/data/site.js`: default content, used to fill the database the first time
- `server/`: API, authentication and MySQL store
