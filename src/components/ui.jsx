import Icon, { WhatsAppIcon } from './Icon';
import { telLink, whatsappLink, scrollToSection } from '../utils/links';
import { useCompany } from '../content/ContentContext';

/** Shared button. Renders <a> when href is given, otherwise <button>. */
export function Button({ variant = 'gold', href, children, className = '', ...rest }) {
  const cls = `btn btn--${variant} ${className}`.trim();
  if (href) {
    const external = href.startsWith('http');
    return (
      <a className={cls} href={href} {...(external ? { target: '_blank', rel: 'noopener noreferrer' } : {})} {...rest}>
        {children}
      </a>
    );
  }
  return (
    <button className={cls} type="button" {...rest}>
      {children}
    </button>
  );
}

export function CallNowButton({ variant = 'outline', label = 'Call Now' }) {
  const c = useCompany();
  return (
    <Button variant={variant} href={telLink(c)} aria-label={`Call ${c.name} now`}>
      <Icon name="call" size={18} /> {label}
    </Button>
  );
}

export const QuoteButton = ({ variant = 'gold', label = 'Get a Free Quote' }) => (
  <Button variant={variant} onClick={() => scrollToSection('contact')}>
    {label} <Icon name="arrow" size={18} />
  </Button>
);

export function WhatsAppButton({ message, label = 'WhatsApp Us', variant = 'whatsapp' }) {
  const c = useCompany();
  return (
    <Button variant={variant} href={whatsappLink(c, message)} aria-label="Enquire on WhatsApp (opens in new tab)">
      <WhatsAppIcon size={18} /> {label}
    </Button>
  );
}

export function SectionHeading({ eyebrow, title, accent, text, align = 'center', id }) {
  return (
    <header className={`section-head section-head--${align} reveal`}>
      <span className="eyebrow">{eyebrow}</span>
      <h2 id={id}>
        {title} {accent && <em className="gold-text">{accent}</em>}
      </h2>
      {text && <p>{text}</p>}
    </header>
  );
}
