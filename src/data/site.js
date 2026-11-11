// Central place for all business content. Edit here — components read from this file.

export const COMPANY = {
  name: 'SONEX',
  fullName: 'SONEX Software Solutions',
  tagline: 'Building Digital Possibilities.',
  phone: '7398748936',
  phoneIntl: '917398748936',
  phoneDisplay: '+91 73987 48936',
  email: 'hello@sonexsoftware.com', // TODO: replace with the real business email
  hours: 'Mon – Sat, 10:00 AM – 7:00 PM IST',
  location: 'India · Serving clients worldwide',
  launchDiscount: 30,
  logoSubtitle: 'Software Solutions',
  mapUrl: '',
  instagram: '',
  facebook: '',
  linkedin: '',
  youtube: '',
};

// Site pages, in menu order. Each one has its own URL.
export const NAV_LINKS = [
  { id: 'home', label: 'Home', path: '/' },
  { id: 'about', label: 'About', path: '/about' },
  { id: 'services', label: 'Services', path: '/services' },
  { id: 'projects', label: 'Projects', path: '/projects' },
  { id: 'pricing', label: 'Pricing', path: '/pricing' },
  { id: 'contact', label: 'Contact', path: '/contact' },
];

export const STATS = [
  { value: '50+', label: 'Projects delivered' },
  { value: '7+', label: 'Core services' },
  { value: '24h', label: 'Response time' },
  { value: '100%', label: 'Source code ownership' },
];

export const SERVICES = [
  {
    icon: 'globe',
    title: 'Website Development',
    text: 'Fast, SEO-ready business websites and landing pages that look premium and turn visitors into enquiries.',
    points: ['Responsive design', 'SEO foundations', 'CMS on request'],
  },
  {
    icon: 'code',
    title: 'Custom Software',
    text: 'Software shaped around how your business actually works — dashboards, CRMs, portals and automation.',
    points: ['Workflow automation', 'Role-based access', 'Cloud hosted'],
  },
  {
    icon: 'phone',
    title: 'Mobile Apps',
    text: 'Android and iOS apps with smooth UX, push notifications and secure back-ends.',
    points: ['Android & iOS', 'Cross-platform', 'Play / App Store launch'],
  },
  {
    icon: 'cart',
    title: 'E-commerce',
    text: 'Online stores with catalogue, cart, payment gateway, order tracking and an easy admin panel.',
    points: ['Payment gateway', 'Order management', 'Coupons & offers'],
  },
  {
    icon: 'receipt',
    title: 'Billing Software',
    text: 'GST-ready billing and invoicing with printable bills, customer ledger and daily sales reports.',
    points: ['GST invoices', 'Thermal / A4 print', 'Sales reports'],
  },
  {
    icon: 'box',
    title: 'Inventory Management',
    text: 'Real-time stock tracking across items, batches and locations with low-stock alerts.',
    points: ['Stock alerts', 'Purchase & sales', 'Multi-location'],
  },
  {
    icon: 'plug',
    title: 'API Integrations',
    text: 'Connect payments, SMS, WhatsApp, shipping, accounting and third-party tools into one flow.',
    points: ['Payment & SMS', 'WhatsApp API', 'Custom REST APIs'],
  },
];

// Portfolio items. The card shows title / category / text / tags / cover;
// the case-study page at /projects/<slug> shows everything else.
// `highlights` use the format "value | label".
export const PROJECTS = [
  {
    slug: 'luxecart-store',
    cover: '/images/projects/luxecart-store-1.jpg',
    gallery: ['/images/projects/luxecart-store-2.jpg', '/images/projects/luxecart-store-3.jpg'],
    title: 'LuxeCart Store',
    category: 'E-commerce',
    text: 'Fashion store with product filters, wishlist, Razorpay checkout and an order dashboard.',
    tags: ['React', 'Node.js', 'Razorpay'],
    accent: ['#d4a845', '#5b3e0f'],
    kind: 'store',
    industry: 'Fashion & apparel retail',
    platform: 'Web store + admin panel',
    timeline: '8 weeks',
    year: '2025',
    overview:
      'LuxeCart is a direct-to-customer online store for a women’s ethnic-wear label that was selling only through Instagram DMs and two physical outlets. The store brings the full catalogue online with size-wise stock, UPI and card payments, and a back office the shop team can run without a developer.',
    challenge:
      'Orders were taken over Instagram and WhatsApp, payment screenshots were checked by hand and stock was tracked in a notebook. Popular sizes regularly sold twice, COD returns were eating into margins and there was no record of which customers came back.',
    solution:
      'We built a fast, mobile-first store with variant-level stock (size × colour), Razorpay checkout supporting UPI, cards, net-banking and wallets, and prepaid-only rules for high-return pin codes. Orders flow into an admin dashboard with Shiprocket label printing, automatic WhatsApp order updates and a customer list with lifetime value.',
    features: [
      'Filters by size, colour, fabric, price and occasion',
      'Wishlist, recently viewed and “notify me when back in stock”',
      'Razorpay checkout — UPI, cards, net-banking and wallets',
      'Coupon engine: flat, percentage, first-order and free-shipping codes',
      'COD restricted by pin code and order value',
      'Shiprocket integration for AWB generation and tracking',
      'WhatsApp + email updates for order placed, shipped and delivered',
      'Admin dashboard with sales, top products and abandoned carts',
      'GST-compliant tax invoices generated per order',
      'SEO-friendly product URLs, sitemap and rich product snippets',
    ],
    highlights: ['1,200+ | Product variants supported', '< 2s | Page load on 4G', '6 | Payment methods', '4 | Admin roles'],
    deliverables: [
      'Customer-facing web store (mobile-first)',
      'Admin panel for products, orders, coupons and customers',
      'Razorpay & Shiprocket integration',
      'Hosting setup, SSL and domain configuration',
      'Training session and 30 days of free support',
    ],
    liveUrl: '',
  },
  {
    slug: 'swiftbill-pos',
    cover: '/images/projects/swiftbill-pos-1.jpg',
    gallery: ['/images/projects/swiftbill-pos-2.jpg', '/images/projects/swiftbill-pos-3.jpg'],
    title: 'SwiftBill POS',
    category: 'Billing Software',
    text: 'Counter billing for retail shops — GST invoices, barcode scanning and day-end reports.',
    tags: ['React', 'PHP', 'MySQL'],
    accent: ['#f0d58a', '#7a5a16'],
    kind: 'dashboard',
    industry: 'Retail & kirana stores',
    platform: 'Web app for the counter PC',
    timeline: '6 weeks',
    year: '2025',
    overview:
      'SwiftBill is a point-of-sale and billing system designed for busy retail counters — supermarkets, kirana stores, stationery and hardware shops. A cashier can scan, bill and print a GST invoice in seconds, while the owner sees sales, credit and stock from their phone.',
    challenge:
      'Most small shops either bill by hand or use desktop software that is slow, hard to learn and locked to one computer. Owners cannot see daily sales without visiting the shop, customer credit (udhaar) is kept in registers, and GST filing means re-typing every bill at month end.',
    solution:
      'SwiftBill runs in the browser with a keyboard-first billing screen tuned for barcode scanners and thermal printers. Every bill automatically splits CGST/SGST/IGST and updates stock and the customer ledger. Day-end closing, GSTR-1 ready exports and a mobile owner dashboard remove the month-end scramble.',
    features: [
      'Barcode scanning with instant product lookup',
      'Keyboard shortcuts for fast billing (no mouse needed)',
      '58mm / 80mm thermal and A4 invoice printing',
      'Automatic CGST, SGST and IGST calculation with HSN codes',
      'Split payments — cash, UPI and card on one bill',
      'Customer ledger for credit sales with SMS reminders',
      'Hold bill / recall bill for busy counters',
      'Returns, exchanges and credit notes',
      'Day-end cash closing and shift-wise reports',
      'GSTR-1 ready Excel export for your CA',
    ],
    highlights: ['~8s | Average bill time', '3 | Tax types handled', '50k+ | Items per store', '0 | New hardware needed'],
    deliverables: [
      'Billing / POS web application',
      'Owner dashboard (mobile friendly)',
      'Printer and barcode scanner setup',
      'Product import from Excel',
      'On-site staff training',
    ],
    liveUrl: '',
  },
  {
    slug: 'stockpilot',
    cover: '/images/projects/stockpilot-1.jpg',
    gallery: ['/images/projects/stockpilot-2.jpg', '/images/projects/stockpilot-3.jpg'],
    title: 'StockPilot',
    category: 'Inventory',
    text: 'Multi-warehouse inventory with stock transfers, purchase orders and low-stock alerts.',
    tags: ['Laravel', 'Vue', 'Charts'],
    accent: ['#c99a3a', '#3b2a0a'],
    kind: 'dashboard',
    industry: 'Distribution & wholesale',
    platform: 'Web app + Android scanner app',
    timeline: '10 weeks',
    year: '2024',
    overview:
      'StockPilot is an inventory management system for distributors running multiple godowns. It tracks every item by batch, expiry and location, manages purchases from suppliers and transfers between warehouses, and warns the team before anything runs out.',
    challenge:
      'Stock lived in Excel sheets updated once a day by each godown. Transfers were not recorded properly, expired stock was discovered too late, and purchase decisions were based on guesswork — leading to both dead stock and frequent “out of stock” calls from retailers.',
    solution:
      'We built a central inventory system with real-time stock per warehouse and bin location. Godown staff use an Android app to scan items in and out, purchase orders are raised from suggested re-order levels, and dashboards show slow-moving and near-expiry items so they can be cleared in time.',
    features: [
      'Real-time stock across multiple warehouses',
      'Batch, expiry date and bin-location tracking',
      'Inter-warehouse stock transfers with approval',
      'Purchase orders, GRN and supplier management',
      'Re-order level suggestions based on sales velocity',
      'Low-stock and near-expiry alerts on email and WhatsApp',
      'Barcode / QR scanning from the Android app',
      'Stock audit mode with variance report',
      'Valuation reports — FIFO and weighted average',
      'Role-based access for owner, manager and godown staff',
    ],
    highlights: ['5 | Warehouses in one view', '3 | User roles', '15+ | Built-in reports', '0 | Manual Excel updates'],
    deliverables: [
      'Inventory web application',
      'Android scanning app',
      'Data migration from existing Excel sheets',
      'Cloud hosting with daily backups',
      'Admin & staff training',
    ],
    liveUrl: '',
  },
  {
    slug: 'fittrack-app',
    cover: '/images/projects/fittrack-app-1.jpg',
    gallery: ['/images/projects/fittrack-app-2.jpg', '/images/projects/fittrack-app-3.jpg'],
    title: 'FitTrack App',
    category: 'Mobile App',
    text: 'Gym membership app with class booking, payments and trainer schedules.',
    tags: ['React Native', 'Firebase'],
    accent: ['#e8c46a', '#4a3410'],
    kind: 'mobile',
    industry: 'Fitness & wellness',
    platform: 'Android & iOS app + web admin',
    timeline: '12 weeks',
    year: '2025',
    overview:
      'FitTrack is a branded mobile app for a gym chain with three branches. Members can renew plans, book group classes, check in with a QR code and follow workout plans from their trainer — while the gym manages everything from one admin panel.',
    challenge:
      'Membership renewals were tracked on paper and in WhatsApp groups, popular classes were overcrowded while others ran half empty, and trainers shared diet and workout plans as photos that members quickly lost.',
    solution:
      'We built a cross-platform app with plan purchase and reminders before expiry, slot-based class booking with waitlists, QR check-in at the front desk and personal workout and diet plans assigned by trainers. Push notifications keep members engaged and the admin panel shows attendance, revenue and renewals due.',
    features: [
      'Membership plans with online renewal (UPI / cards)',
      'Class booking with limited slots and waitlist',
      'QR code check-in at the reception',
      'Trainer-assigned workout and diet plans',
      'Progress tracking — weight, measurements and photos',
      'Push notifications for renewals, classes and offers',
      'Multi-branch support with branch-wise reports',
      'Personal training session scheduling',
      'Referral codes and seasonal offers',
      'Admin panel for members, trainers, plans and payments',
    ],
    highlights: ['2 | Platforms (Android & iOS)', '3 | Branches managed', '12+ | App screens', '24/7 | Self-service renewals'],
    deliverables: [
      'Android & iOS member app',
      'Web admin panel for gym staff',
      'Payment gateway integration',
      'Play Store & App Store publishing',
      'Launch support and 60 days of maintenance',
    ],
    liveUrl: '',
  },
  {
    slug: 'prime-realty',
    cover: '/images/projects/prime-realty-1.jpg',
    gallery: ['/images/projects/prime-realty-2.jpg', '/images/projects/prime-realty-3.jpg'],
    title: 'Prime Realty',
    category: 'Website',
    text: 'Real-estate website with property listings, lead forms and WhatsApp enquiry buttons.',
    tags: ['Next.js', 'SEO', 'CMS'],
    accent: ['#dcb55a', '#2e220b'],
    kind: 'site',
    industry: 'Real estate',
    platform: 'Website + listing CMS',
    timeline: '5 weeks',
    year: '2024',
    overview:
      'Prime Realty is a lead-generation website for a real-estate consultancy dealing in residential flats, plots and commercial spaces. Every listing has its own search-optimised page, photo gallery, location map and one-tap WhatsApp enquiry.',
    challenge:
      'The consultancy relied on property portals where they paid per lead and competed with dozens of other brokers on the same listing. Their old website was a single static page that did not show up on Google and could not be updated without a developer.',
    solution:
      'We built a fast, search-optimised site with a simple CMS so the team can add a property in minutes. Smart filters, locality pages (e.g. “2 BHK flats in Vijay Nagar”) and WhatsApp-first enquiry buttons turn search traffic into direct leads, which land in a lead inbox with source tracking.',
    features: [
      'Property listings with gallery, floor plans and video tour',
      'Filters by city, locality, budget, BHK and property type',
      'Auto-generated SEO pages for each locality',
      'One-tap WhatsApp and call buttons on every listing',
      'Site-visit booking form with preferred date and time',
      'EMI calculator and price-per-sq.ft. display',
      'Lead inbox with source tracking (Google, Facebook, direct)',
      'Easy CMS — add, edit or mark a property as sold',
      'Google Maps location and nearby landmarks',
      'Schema markup for rich search results',
    ],
    highlights: ['95+ | Lighthouse SEO score', '< 1.5s | Largest contentful paint', '300+ | Listings capacity', '1-tap | WhatsApp enquiry'],
    deliverables: [
      'Responsive marketing website',
      'Property listing CMS',
      'On-page SEO setup and Google Search Console',
      'Google Business Profile optimisation',
      'Content upload for the first 50 listings',
    ],
    liveUrl: '',
  },
  {
    slug: 'clinicdesk',
    cover: '/images/projects/clinicdesk-1.jpg',
    gallery: ['/images/projects/clinicdesk-2.jpg', '/images/projects/clinicdesk-3.jpg'],
    title: 'ClinicDesk',
    category: 'Custom Software',
    text: 'Clinic management — appointments, patient records, prescriptions and SMS reminders.',
    tags: ['React', 'API', 'SMS'],
    accent: ['#f5df9e', '#6b4d12'],
    kind: 'dashboard',
    industry: 'Healthcare clinics',
    platform: 'Web app for reception & doctors',
    timeline: '9 weeks',
    year: '2025',
    overview:
      'ClinicDesk is a clinic management system for multi-doctor OPD clinics. It handles appointment booking, patient history, digital prescriptions and billing in one place, and sends automatic SMS and WhatsApp reminders so fewer patients miss their visit.',
    challenge:
      'Reception staff juggled a paper appointment register and phone calls, patient files were hard to find on repeat visits, and doctors wrote prescriptions by hand. No-shows were common and there was no easy way to see daily collections per doctor.',
    solution:
      'We built a fast reception screen with token-based queues and online booking, a doctor view with complete patient history, and a prescription writer with saved templates and a medicine database. Reminders go out automatically and the owner gets daily collection and footfall reports.',
    features: [
      'Online and walk-in appointment booking with token queue',
      'Doctor-wise schedules, leaves and slot durations',
      'Complete patient history — visits, vitals and reports',
      'Digital prescription with templates and medicine search',
      'Printable prescription on clinic letterhead',
      'SMS & WhatsApp reminders before appointments',
      'OPD billing with consultation and procedure charges',
      'Upload lab reports and X-rays to the patient file',
      'Daily collection and footfall reports per doctor',
      'Role-based access with secure patient data',
    ],
    highlights: ['4 | Doctors on one system', '< 30s | Patient lookup to prescription', '2 | Reminder channels', '100% | HTTPS-encrypted data'],
    deliverables: [
      'Clinic management web app',
      'Online booking page for patients',
      'SMS / WhatsApp gateway integration',
      'Prescription & invoice print layouts',
      'Staff training and onboarding',
    ],
    liveUrl: '',
  },
];

/** URL-safe slug, e.g. "LuxeCart Store" → "luxecart-store". */
export const slugify = (s) =>
  String(s || '').toLowerCase().normalize('NFKD').replace(/[^\w\s-]/g, '').trim().replace(/[\s_]+/g, '-').replace(/-+/g, '-');

/** A project's URL slug — the saved slug, else one made from the title. */
export const projectSlug = (p) => slugify(p.slug) || slugify(p.title);

// Prices in INR. `price` is the regular price; discounted price is computed from COMPANY.launchDiscount.
export const PLANS = [
  {
    name: 'Starter',
    for: 'For new businesses getting online',
    price: 14999,
    features: [
      'Up to 5 page responsive website',
      'Mobile-first premium design',
      'Contact form + WhatsApp button',
      'Basic on-page SEO',
      'Free SSL setup guidance',
      '1 month free support',
    ],
  },
  {
    name: 'Business',
    for: 'For growing brands that need more',
    price: 34999,
    featured: true,
    features: [
      'Up to 12 pages + blog / CMS',
      'Custom UI design & animations',
      'Advanced SEO & speed optimisation',
      'Google Maps, Analytics & Search Console',
      'Lead management dashboard',
      '3 months free support',
    ],
  },
  {
    name: 'E-commerce',
    for: 'For selling products online',
    price: 69999,
    features: [
      'Complete online store',
      'Payment gateway integration',
      'Product, order & coupon admin',
      'Shipping & invoice integration',
      'Customer accounts & wishlist',
      '6 months free support',
    ],
  },
  {
    name: 'Custom Software',
    for: 'Billing, inventory, CRM, apps',
    price: 99999,
    from: true,
    features: [
      'Requirement analysis & planning',
      'Custom modules for your workflow',
      'Web + mobile access',
      'API & third-party integrations',
      'Training & documentation',
      'Priority support',
    ],
  },
];

export const BUDGETS = ['Under ₹15,000', '₹15,000 – ₹35,000', '₹35,000 – ₹75,000', '₹75,000+', 'Not sure yet'];

export const HERO = {
  headlineStart: 'Building',
  headlineAccent: 'Digital',
  headlineEnd: 'Possibilities.',
  lead:
    'SONEX Software Solutions designs and develops premium websites, mobile apps and custom software — billing, inventory, e-commerce and integrations — that help your business look sharper and run faster.',
  trust: ['Free consultation', 'On-time delivery', 'Post-launch support'],
  badges: ['Websites', 'Mobile Apps', 'Billing & Inventory'],
};

export const VALUES = [
  { icon: 'spark', title: 'Design that sells', text: 'Premium interfaces built to earn trust in the first five seconds.' },
  { icon: 'shield', title: 'Built to last', text: 'Clean, secure, documented code — and you own all of it.' },
  { icon: 'clock', title: 'On schedule', text: 'Clear milestones, weekly updates and no surprise invoices.' },
];

// Headings and short texts for every section. {discount} and {name} are replaced automatically.
export const TEXTS = {
  aboutTitle: 'Technology partners for',
  aboutAccent: 'ambitious businesses.',
  missionTitle: 'Our Mission',
  visionTitle: 'Our Vision',

  servicesEyebrow: 'What we do',
  servicesTitle: 'Services that power',
  servicesAccent: 'your growth.',
  servicesText: 'One partner for everything digital — from your first website to the software that runs your daily operations.',
  servicesCtaTitle: 'Have something custom in mind?',
  servicesCtaText: "Tell us your idea. We'll suggest the right approach, timeline and budget — free.",

  projectsEyebrow: 'Portfolio',
  projectsTitle: 'Work that',
  projectsAccent: 'speaks for itself.',
  projectsText: 'A selection of demo projects showing the kind of products we design and build.',
  projectNote: 'Demo project built to showcase our capabilities. Figures describe the product’s scope; client details are illustrative.',

  pricingEyebrow: 'Pricing',
  pricingTitle: 'Simple packages,',
  pricingAccentOffer: '{discount}% off at launch.',
  pricingAccent: 'built to fit you.',
  pricingText: 'Transparent starting prices. Every project gets a free consultation and a fixed quote before work begins.',
  pricingRibbon: 'Most Popular',
  pricingNote: 'Prices exclude domain, hosting and third-party fees. Final quote depends on scope.',
  pricingOfferNote: 'Launch offer valid for a limited time.',

  testimonialsEyebrow: 'Testimonials',
  testimonialsTitle: 'What our clients',
  testimonialsAccent: 'say about us.',
  testimonialsText: 'Real feedback from business owners we have helped go digital.',

  ctaTitle: 'Ready to go digital?',
  ctaAccentOffer: 'Save {discount}% today.',
  ctaText: 'Free consultation · Fixed quote · No obligation',

  contactEyebrow: 'Contact',
  contactTitle: 'Let’s build something',
  contactAccent: 'remarkable.',
  contactText: 'Share your requirement and get a free consultation plus a fixed quote.',
  enquiryTitle: 'Business enquiries',
  enquiryText:
    'For partnerships, bulk projects, white-label development or long-term maintenance contracts, call or WhatsApp us directly. We usually reply within a few hours.',
  formTitle: 'Get a Free Quote',
  formButton: 'Send Enquiry via WhatsApp',
  successTitle: 'Thank you!',

  // Contact info labels
  labelCall: 'Call us',
  labelWhatsApp: 'WhatsApp',
  labelEmail: 'Email',
  labelHours: 'Business hours',
  labelLocation: 'Location',
  directionsText: 'Get directions',

  // Contact form
  formRequiredNote: 'Fields marked * are required.',
  fieldName: 'Full name',
  fieldNamePlaceholder: 'Your name',
  fieldPhone: 'Phone / WhatsApp',
  fieldPhonePlaceholder: '10-digit mobile',
  fieldEmail: 'Email',
  fieldEmailPlaceholder: 'you@company.com',
  fieldService: 'Service',
  fieldServicePlaceholder: 'Select a service',
  fieldServiceOther: 'Other / Not sure',
  fieldBudget: 'Budget',
  fieldBudgetPlaceholder: 'Select budget',
  fieldMessage: 'Project details',
  fieldMessagePlaceholder: 'Tell us about your business and what you need…',
  showEmailField: true,
  showBudgetField: true,
  requireEmail: false,
  formAltText: 'Prefer talking?',
  formAltCall: 'Call Now',
  formAltEmail: 'Email us',
  successText: "We've received your enquiry and opened it in WhatsApp — tap Send there for the fastest reply. If WhatsApp did not open, call us on {phone}.",
  successButton: 'Send another enquiry',
  whatsappHeader: 'New Enquiry — {name} Website',

  // Contact form error messages
  errName: 'Please enter your name.',
  errPhone: 'Enter a valid 10-digit mobile number.',
  errEmail: 'Enter a valid email address.',
  errService: 'Please choose a service.',
  errMessage: 'Tell us a little more (at least 10 characters).',

  footerText: 'Premium websites, apps and business software crafted with care.',
};

export const SEO = {
  title: 'SONEX Software Solutions | Website, App & Custom Software Development',
  description:
    'SONEX Software Solutions — Building Digital Possibilities. Premium website development, custom software, mobile apps, e-commerce, billing, inventory and API integrations.',
  keywords:
    'website development, custom software, mobile app development, e-commerce website, billing software, inventory software, API integration, SONEX',
};

export const ABOUT = {
  intro1:
    'SONEX Software Solutions is a software studio that helps shops, startups, clinics, retailers and growing companies take their business digital. We combine thoughtful design with solid engineering to deliver products that are fast, reliable and easy to use.',
  intro2:
    'From a first website to a full billing and inventory system, we work as an extension of your team — we listen first, then build what will actually move your numbers.',
  mission:
    'To make world-class software affordable and accessible for every business, delivering solutions that save time, cut costs and unlock growth.',
  vision:
    "To become India's most trusted name for business software — known for craftsmanship, transparency and long-term partnerships.",
};

/** Everything the admin panel can edit. Used to seed the database and as the fallback before content loads. */
export const DEFAULT_CONTENT = {
  company: COMPANY,
  hero: HERO,
  about: ABOUT,
  stats: STATS,
  services: SERVICES,
  projects: PROJECTS,
  plans: PLANS,
  budgets: BUDGETS,
  values: VALUES,
  texts: TEXTS,
  seo: SEO,
};

/** Fills in defaults for any missing section or missing field (e.g. after new fields are added). */
export function mergeContent(data) {
  const out = { ...DEFAULT_CONTENT };
  for (const [key, value] of Object.entries(data || {})) {
    if (!(key in DEFAULT_CONTENT)) continue;
    const def = DEFAULT_CONTENT[key];
    out[key] = !Array.isArray(def) && def && typeof def === 'object' && value && typeof value === 'object' && !Array.isArray(value)
      ? { ...def, ...value }
      : value;
  }
  if (Array.isArray(out.projects)) out.projects = out.projects.map(withProjectDefaults);
  return out;
}

const PROJECT_BLANK = {
  slug: '', cover: '', gallery: [], industry: '', platform: '', timeline: '', year: '',
  overview: '', challenge: '', solution: '', features: [], highlights: [], deliverables: [], liveUrl: '',
};

/**
 * Projects saved before the case-study fields existed only have the card fields.
 * Fill each missing field from the built-in project with the same slug/title (or a blank).
 */
function withProjectDefaults(p) {
  if (!p || typeof p !== 'object') return p;
  const slug = projectSlug(p);
  const def = PROJECTS.find((d) => d.slug === slug || d.title === p.title) || PROJECT_BLANK;
  const out = { ...p };
  for (const key of Object.keys(PROJECT_BLANK)) if (out[key] === undefined) out[key] = copyValue(def[key] ?? PROJECT_BLANK[key]);
  out.slug = slug;
  return out;
}

const copyValue = (v) => (Array.isArray(v) ? [...v] : v);

/** Replaces {discount} and {name} placeholders in admin-editable text. */
export const fillText = (text, company) =>
  String(text ?? '')
    .replace(/\{discount\}/g, company.launchDiscount)
    .replace(/\{name\}/g, company.name)
    .replace(/\{phone\}/g, company.phoneDisplay)
    .replace(/\{email\}/g, company.email);
