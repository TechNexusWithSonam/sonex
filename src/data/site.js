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

export const NAV_LINKS = [
  { id: 'home', label: 'Home' },
  { id: 'about', label: 'About' },
  { id: 'services', label: 'Services' },
  { id: 'projects', label: 'Projects' },
  { id: 'pricing', label: 'Pricing' },
  { id: 'contact', label: 'Contact' },
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

export const PROJECTS = [
  {
    title: 'LuxeCart Store',
    category: 'E-commerce',
    text: 'Fashion store with product filters, wishlist, Razorpay checkout and an order dashboard.',
    tags: ['React', 'Node.js', 'Razorpay'],
    accent: ['#d4a845', '#5b3e0f'],
    kind: 'store',
  },
  {
    title: 'SwiftBill POS',
    category: 'Billing Software',
    text: 'Counter billing for retail shops — GST invoices, barcode scanning and day-end reports.',
    tags: ['React', 'PHP', 'MySQL'],
    accent: ['#f0d58a', '#7a5a16'],
    kind: 'dashboard',
  },
  {
    title: 'StockPilot',
    category: 'Inventory',
    text: 'Multi-warehouse inventory with stock transfers, purchase orders and low-stock alerts.',
    tags: ['Laravel', 'Vue', 'Charts'],
    accent: ['#c99a3a', '#3b2a0a'],
    kind: 'dashboard',
  },
  {
    title: 'FitTrack App',
    category: 'Mobile App',
    text: 'Gym membership app with class booking, payments and trainer schedules.',
    tags: ['React Native', 'Firebase'],
    accent: ['#e8c46a', '#4a3410'],
    kind: 'mobile',
  },
  {
    title: 'Prime Realty',
    category: 'Website',
    text: 'Real-estate website with property listings, lead forms and WhatsApp enquiry buttons.',
    tags: ['Next.js', 'SEO', 'CMS'],
    accent: ['#dcb55a', '#2e220b'],
    kind: 'site',
  },
  {
    title: 'ClinicDesk',
    category: 'Custom Software',
    text: 'Clinic management — appointments, patient records, prescriptions and SMS reminders.',
    tags: ['React', 'API', 'SMS'],
    accent: ['#f5df9e', '#6b4d12'],
    kind: 'dashboard',
  },
];

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

  pricingEyebrow: 'Pricing',
  pricingTitle: 'Simple packages,',
  pricingAccentOffer: '{discount}% off at launch.',
  pricingAccent: 'built to fit you.',
  pricingText: 'Transparent starting prices. Every project gets a free consultation and a fixed quote before work begins.',
  pricingRibbon: 'Most Popular',
  pricingNote: 'Prices exclude domain, hosting and third-party fees. Final quote depends on scope.',
  pricingOfferNote: 'Launch offer valid for a limited time.',

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
  return out;
}

/** Replaces {discount} and {name} placeholders in admin-editable text. */
export const fillText = (text, company) =>
  String(text ?? '')
    .replace(/\{discount\}/g, company.launchDiscount)
    .replace(/\{name\}/g, company.name)
    .replace(/\{phone\}/g, company.phoneDisplay)
    .replace(/\{email\}/g, company.email);
