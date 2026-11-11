import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/site';
import { useContent, useCompany, useTexts } from '../content/ContentContext';
import { Logo } from './Navbar';
import Icon, { WhatsAppIcon } from './Icon';
import { telLink, mailLink, whatsappLink, scrollToTop } from '../utils/links';
import { linkClick } from '../utils/router';
import { CallNowButton, QuoteButton } from './ui';

export function CtaBand() {
  const c = useCompany();
  const t = useTexts();
  return (
    <section className="cta-band" aria-labelledby="cta-title">
      <div className="container cta-band__inner reveal">
        <div>
          <h2 id="cta-title">
            {t('ctaTitle')}{' '}
            {c.launchDiscount > 0 && <em className="gold-text">{t('ctaAccentOffer')}</em>}
          </h2>
          <p>{t('ctaText')}</p>
        </div>
        <div className="cta-band__actions">
          <QuoteButton />
          <CallNowButton />
        </div>
      </div>
    </section>
  );
}

export function FloatingActions() {
  const c = useCompany();
  const [show, setShow] = useState(false);
  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 500);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <div className="fab">
      <button
        type="button"
        className={`fab__btn fab__btn--top ${show ? 'is-shown' : ''}`}
        onClick={scrollToTop}
        aria-label="Back to top"
        tabIndex={show ? 0 : -1}
      >
        <Icon name="up" />
      </button>
      <a className="fab__btn fab__btn--call" href={telLink(c)} aria-label="Call now">
        <Icon name="call" />
      </a>
      <a className="fab__btn fab__btn--wa" href={whatsappLink(c)} target="_blank" rel="noopener noreferrer" aria-label="Chat on WhatsApp">
        <WhatsAppIcon size={26} />
      </a>
    </div>
  );
}

export default function Footer() {
  const { company: c, services } = useContent();
  const t = useTexts();
  const socials = [
    ["Instagram", c.instagram],
    ["Facebook", c.facebook],
    ["LinkedIn", c.linkedin],
    ["YouTube", c.youtube],
  ].filter(([, url]) => /^https?:\/\//.test(url || ""));
  return (
    <footer className="footer">
      <div className="container footer__grid">
        <div className="footer__brand">
          <Logo />
          <p>{c.tagline} {t('footerText')}</p>
          {socials.length > 0 && (
            <ul className="footer__social" aria-label="Social media">
              {socials.map(([label, url]) => (
                <li key={label}><a href={url} target="_blank" rel="noopener noreferrer">{label}</a></li>
              ))}
            </ul>
          )}
        </div>
        <nav aria-label="Footer">
          <h3>Company</h3>
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.id}><a href={l.path} onClick={linkClick}>{l.label}</a></li>
            ))}
          </ul>
        </nav>
        <div>
          <h3>Services</h3>
          <ul>
            {services.slice(0, 6).map((s) => (
              <li key={s.title}><a href="/services" onClick={linkClick}>{s.title}</a></li>
            ))}
          </ul>
        </div>
        <div>
          <h3>Get in touch</h3>
          <ul className="footer__contact">
            <li><Icon name="call" size={16} /> <a href={telLink(c)}>{c.phoneDisplay}</a></li>
            <li><WhatsAppIcon size={16} /> <a href={whatsappLink(c)} target="_blank" rel="noopener noreferrer">WhatsApp enquiry</a></li>
            {c.email && <li><Icon name="mail" size={16} /> <a href={mailLink(c)}>{c.email}</a></li>}
          </ul>
        </div>
      </div>
      <div className="container footer__bottom">
        <p>© {new Date().getFullYear()} {c.fullName}. All rights reserved.</p>
        <p className="gold-text">{c.tagline}</p>
      </div>
    </footer>
  );
}
