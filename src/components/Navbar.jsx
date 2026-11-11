import { useEffect, useState } from 'react';
import { NAV_LINKS } from '../data/site';
import { useCompany } from '../content/ContentContext';
import { telLink } from '../utils/links';
import { linkClick, usePathname } from '../utils/router';
import Icon from './Icon';

/** The menu item for a URL — "/projects/stockpilot" belongs to Projects. */
const activeId = (path) =>
  NAV_LINKS.find((l) => l.path !== '/' && (path === l.path || path.startsWith(`${l.path}/`)))?.id ?? (path === '/' ? 'home' : null);

export function Logo() {
  const COMPANY = useCompany();
  return (
    <span className="logo">
      <span className="logo__mark" aria-hidden="true">{COMPANY.name.charAt(0)}</span>
      <span className="logo__text">
        {COMPANY.name}
        {COMPANY.logoSubtitle && <small>{COMPANY.logoSubtitle}</small>}
      </span>
    </span>
  );
}

export default function Navbar() {
  const COMPANY = useCompany();
  const tel = telLink(COMPANY);
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const active = activeId(usePathname());

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  const go = (e) => {
    setOpen(false);
    linkClick(e);
  };

  return (
    <header className={`nav ${scrolled ? 'nav--scrolled' : ''}`}>
      <div className="container nav__inner">
        <a href="/" onClick={go} aria-label={`${COMPANY.fullName} — home`}>
          <Logo />
        </a>

        <nav id="primary-nav" className={`nav__menu ${open ? 'is-open' : ''}`} aria-label="Primary">
          <ul>
            {NAV_LINKS.map((l) => (
              <li key={l.id}>
                <a
                  href={l.path}
                  onClick={go}
                  className={active === l.id ? 'is-active' : ''}
                  aria-current={active === l.id ? 'page' : undefined}
                >
                  {l.label}
                </a>
              </li>
            ))}
          </ul>
          <div className="nav__mobile-cta">
            <a className="btn btn--outline" href={tel}>
              <Icon name="call" size={18} /> Call {COMPANY.phoneDisplay}
            </a>
            <a className="btn btn--gold" href="/contact" onClick={go}>
              Get a Free Quote
            </a>
          </div>
        </nav>

        <div className="nav__actions">
          <a className="nav__call" href={tel} aria-label={`Call ${COMPANY.phoneDisplay}`}>
            <Icon name="call" size={18} />
            <span>{COMPANY.phoneDisplay}</span>
          </a>
          <a className="btn btn--gold btn--sm nav__quote" href="/contact" onClick={go}>
            Free Quote
          </a>
          <button
            className="nav__toggle"
            type="button"
            aria-expanded={open}
            aria-controls="primary-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
          >
            <Icon name={open ? 'close' : 'menu'} size={24} />
          </button>
        </div>
      </div>
    </header>
  );
}
