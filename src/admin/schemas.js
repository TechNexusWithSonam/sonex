// Describes every editable section so one generic editor can handle them all.
// Field types: text, textarea, number, select, checkbox, lines (one item per line → array), colors (two colours).
import { ICON_NAMES } from '../components/Icon';

export const LIST_SCHEMAS = {
  services: {
    title: 'Services',
    description: 'Cards shown in the Services section and in the contact form dropdown.',
    itemName: 'service',
    label: (i) => i.title,
    sub: (i) => i.text,
    blank: { icon: 'globe', title: '', text: '', points: [] },
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'icon', label: 'Icon', type: 'select', options: ICON_NAMES },
      { name: 'text', label: 'Description', type: 'textarea' },
      { name: 'points', label: 'Key points', type: 'lines', hint: 'One point per line' },
    ],
  },
  projects: {
    title: 'Projects',
    description: 'Portfolio items. Categories become the filter buttons.',
    itemName: 'project',
    label: (i) => i.title,
    sub: (i) => i.category,
    blank: { title: '', category: '', text: '', tags: [], kind: 'site', accent: ['#d4a845', '#3b2a0a'] },
    fields: [
      { name: 'title', label: 'Project name', type: 'text', required: true },
      { name: 'category', label: 'Category', type: 'text', required: true, hint: 'e.g. Website, Mobile App' },
      { name: 'text', label: 'Description', type: 'textarea' },
      { name: 'tags', label: 'Technologies', type: 'lines', hint: 'One per line' },
      {
        name: 'kind',
        label: 'Preview style',
        type: 'select',
        options: [
          { value: 'site', label: 'Website' },
          { value: 'store', label: 'Online store' },
          { value: 'dashboard', label: 'Dashboard / software' },
          { value: 'mobile', label: 'Mobile app' },
        ],
      },
      { name: 'accent', label: 'Preview colours', type: 'colors' },
    ],
  },
  plans: {
    title: 'Pricing packages',
    description: 'Enter the regular price — the launch discount from Company & Offer is applied automatically.',
    itemName: 'package',
    label: (i) => i.name,
    sub: (i) => `₹${Number(i.price || 0).toLocaleString('en-IN')}${i.featured ? ' · Most popular' : ''}`,
    blank: { name: '', for: '', price: 0, from: false, featured: false, features: [] },
    fields: [
      { name: 'name', label: 'Package name', type: 'text', required: true },
      { name: 'for', label: 'Short description', type: 'text' },
      { name: 'price', label: 'Regular price (₹)', type: 'number', min: 0 },
      { name: 'from', label: 'Show “Starting at” above the price', type: 'checkbox' },
      { name: 'featured', label: 'Highlight as “Most Popular”', type: 'checkbox' },
      { name: 'features', label: 'Features', type: 'lines', hint: 'One feature per line' },
    ],
  },
  values: {
    title: 'Why choose us',
    description: 'The three value points shown under Mission & Vision in the About section.',
    itemName: 'value',
    label: (i) => i.title,
    sub: (i) => i.text,
    blank: { icon: 'spark', title: '', text: '' },
    fields: [
      { name: 'title', label: 'Title', type: 'text', required: true },
      { name: 'icon', label: 'Icon', type: 'select', options: ICON_NAMES },
      { name: 'text', label: 'Description', type: 'textarea' },
    ],
  },
  stats: {
    title: 'Stats',
    description: 'The numbers shown under the hero section. Four look best.',
    itemName: 'stat',
    label: (i) => `${i.value} — ${i.label}`,
    blank: { value: '', label: '' },
    fields: [
      { name: 'value', label: 'Value', type: 'text', required: true, hint: 'e.g. 50+' },
      { name: 'label', label: 'Label', type: 'text', required: true },
    ],
  },
};

export const OBJECT_SCHEMAS = {
  company: {
    title: 'Company details & offer',
    fields: [
      { name: 'name', label: 'Short name', type: 'text', required: true, hint: 'Shown in the logo, e.g. SONEX' },
      { name: 'fullName', label: 'Full company name', type: 'text', required: true },
      { name: 'tagline', label: 'Tagline', type: 'text' },
      { name: 'launchDiscount', label: 'Launch discount (%)', type: 'number', min: 0, max: 90, hint: 'Set 0 to switch the offer off everywhere' },
      { name: 'phoneDisplay', label: 'Phone (as displayed)', type: 'text', hint: 'e.g. +91 73987 48936' },
      { name: 'phone', label: 'Phone (10 digits)', type: 'text' },
      { name: 'phoneIntl', label: 'WhatsApp / call number with country code', type: 'text', required: true, hint: 'Digits only, e.g. 917398748936' },
      { name: 'email', label: 'Email', type: 'text' },
      { name: 'hours', label: 'Business hours', type: 'text' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'logoSubtitle', label: 'Logo subtitle', type: 'text', hint: 'Small text under the logo name' },
    ],
  },
  social: {
    title: 'Social media links',
    fields: [
      { name: 'instagram', label: 'Instagram URL', type: 'text', hint: 'Leave empty to hide' },
      { name: 'facebook', label: 'Facebook URL', type: 'text' },
      { name: 'linkedin', label: 'LinkedIn URL', type: 'text' },
      { name: 'youtube', label: 'YouTube URL', type: 'text' },
    ],
  },
  seo: {
    title: 'Search engine (SEO)',
    fields: [
      { name: 'title', label: 'Page title', type: 'text', required: true, hint: 'Shown in Google results and the browser tab. Aim for 50–60 characters.' },
      { name: 'description', label: 'Meta description', type: 'textarea', hint: 'Shown under the title in Google. Aim for 140–160 characters.' },
      { name: 'keywords', label: 'Keywords', type: 'textarea', hint: 'Comma separated' },
    ],
  },
  hero: {
    title: 'Home — hero section',
    fields: [
      { name: 'headlineStart', label: 'Headline — first word(s)', type: 'text' },
      { name: 'headlineAccent', label: 'Headline — gold word', type: 'text' },
      { name: 'headlineEnd', label: 'Headline — second line', type: 'text' },
      { name: 'lead', label: 'Intro paragraph', type: 'textarea' },
      { name: 'trust', label: 'Trust points (with ticks)', type: 'lines', hint: 'One per line' },
      { name: 'badges', label: 'Floating badges around the offer circle', type: 'lines', hint: 'Up to 3, one per line' },
    ],
  },
  about: {
    title: 'About section',
    fields: [
      { name: 'intro1', label: 'Introduction — paragraph 1', type: 'textarea' },
      { name: 'intro2', label: 'Introduction — paragraph 2', type: 'textarea' },
      { name: 'mission', label: 'Our mission', type: 'textarea' },
      { name: 'vision', label: 'Our vision', type: 'textarea' },
    ],
  },
  budgets: {
    title: 'Contact form — budget options',
    toForm: (arr) => ({ items: arr }),
    fromForm: (f) => f.items,
    fields: [{ name: 'items', label: 'Budget options', type: 'lines', required: true, hint: 'One option per line' }],
  },
};

// Section headings & short texts — all stored in the "texts" section, edited in groups.
const t = (name, label, type = 'text', hint) => ({ name, label, type, hint });
const PLACEHOLDER_HINT = '{discount} is replaced with the launch discount';
export const TEXT_GROUPS = [
  { title: 'About section', fields: [t('aboutTitle', 'Heading'), t('aboutAccent', 'Heading — gold part'), t('missionTitle', 'Mission card title'), t('visionTitle', 'Vision card title')] },
  {
    title: 'Services section',
    fields: [
      t('servicesEyebrow', 'Small label above heading'), t('servicesTitle', 'Heading'), t('servicesAccent', 'Heading — gold part'),
      t('servicesText', 'Intro text', 'textarea'), t('servicesCtaTitle', 'Gold card title'), t('servicesCtaText', 'Gold card text', 'textarea'),
    ],
  },
  { title: 'Projects section', fields: [t('projectsEyebrow', 'Small label above heading'), t('projectsTitle', 'Heading'), t('projectsAccent', 'Heading — gold part'), t('projectsText', 'Intro text', 'textarea')] },
  {
    title: 'Pricing section',
    fields: [
      t('pricingEyebrow', 'Small label above heading'), t('pricingTitle', 'Heading'),
      t('pricingAccentOffer', 'Gold part — when offer is on', 'text', PLACEHOLDER_HINT), t('pricingAccent', 'Gold part — when offer is off'),
      t('pricingText', 'Intro text', 'textarea'), t('pricingRibbon', 'Highlighted package ribbon'),
      t('pricingOfferNote', 'Note — offer line'), t('pricingNote', 'Note — prices', 'textarea'),
    ],
  },
  { title: 'Call-to-action banner', fields: [t('ctaTitle', 'Heading'), t('ctaAccentOffer', 'Offer text (shown when offer is on)', 'text', PLACEHOLDER_HINT), t('ctaText', 'Sub text')] },
  {
    title: 'Contact section',
    fields: [
      t('contactEyebrow', 'Small label above heading'), t('contactTitle', 'Heading'), t('contactAccent', 'Heading — gold part'),
      t('contactText', 'Intro text', 'textarea'), t('enquiryTitle', 'Enquiry box title'), t('enquiryText', 'Enquiry box text', 'textarea'),
      t('formTitle', 'Form title'), t('formButton', 'Form button text'), t('successTitle', 'Thank-you title'),
    ],
  },
  { title: 'Footer', fields: [t('footerText', 'Footer description', 'textarea')] },
];

/** Returns { fieldName: message } for missing required fields. */
export function validateFields(fields, value) {
  const errors = {};
  for (const f of fields) {
    const v = value[f.name];
    const empty = f.type === 'lines' ? !v?.length : v === undefined || v === null || String(v).trim() === '';
    if (f.required && empty) errors[f.name] = `${f.label} is required.`;
    if (f.type === 'number' && !empty) {
      if (f.min !== undefined && Number(v) < f.min) errors[f.name] = `Minimum is ${f.min}.`;
      if (f.max !== undefined && Number(v) > f.max) errors[f.name] = `Maximum is ${f.max}.`;
    }
  }
  return errors;
}
