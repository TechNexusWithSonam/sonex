import { navigate } from './router';

// Link/format helpers. `c` is the `company` object from the content (see ContentContext).

export const telLink = (c) => `tel:+${c.phoneIntl}`;

export const mailLink = (c, subject = 'Business Enquiry') =>
  `mailto:${c.email}?subject=${encodeURIComponent(subject)}`;

export const defaultWhatsAppMessage = (c) =>
  c.launchDiscount > 0
    ? `Hi ${c.name}, I'd like to know more about your services and the ${c.launchDiscount}% launch offer.`
    : `Hi ${c.name}, I'd like to know more about your services.`;

export const whatsappLink = (c, message = defaultWhatsAppMessage(c)) =>
  `https://wa.me/${c.phoneIntl}?text=${encodeURIComponent(message)}`;

/** WhatsApp link to any Indian/international number (used in admin to reply to leads). */
export const whatsappTo = (phone, message = '') => {
  let digits = String(phone).replace(/\D/g, '');
  if (digits.length === 10) digits = `91${digits}`;
  return `https://wa.me/${digits}${message ? `?text=${encodeURIComponent(message)}` : ''}`;
};

export const formatINR = (n) =>
  new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n || 0);

/** Price after the launch discount, rounded to a "…99" price point. */
export function discounted(price, pct) {
  if (!pct) return price;
  const raw = (price * (100 - pct)) / 100;
  return raw >= 1000 ? Math.round(raw / 100) * 100 - 1 : Math.round(raw);
}

/** Opens a site page by its id (see NAV_LINKS), e.g. goToPage('contact') → /contact. */
export function goToPage(id) {
  navigate(id === 'home' ? '/' : `/${id}`);
}

/** Smoothly scrolls back to the top of the current page. */
export function scrollToTop() {
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  window.scrollTo({ top: 0, behavior: reduce ? 'auto' : 'smooth' });
}
