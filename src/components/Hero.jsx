import { useContent } from '../content/ContentContext';
import { CallNowButton, QuoteButton, WhatsAppButton } from './ui';
import Icon from './Icon';

export default function Hero() {
  const { company: COMPANY, stats: STATS, hero } = useContent();
  const offer = COMPANY.launchDiscount > 0;
  return (
    <section id="home" className="hero" aria-labelledby="hero-title">
      <div className="hero__glow" aria-hidden="true" />
      <div className="hero__grid" aria-hidden="true" />

      <div className="container hero__inner">
        <div className="hero__copy">
          {offer && (
            <p className="offer-pill reveal">
              <span className="offer-pill__badge">LAUNCH OFFER</span>
              Flat {COMPANY.launchDiscount}% off on all packages
            </p>
          )}

          <h1 id="hero-title" className="reveal">
            {hero.headlineStart} <em className="gold-text">{hero.headlineAccent}</em>
            <br /> {hero.headlineEnd}
          </h1>

          <p className="hero__lead reveal">{hero.lead}</p>

          <div className="hero__cta reveal">
            <QuoteButton />
            <CallNowButton />
            <WhatsAppButton label="WhatsApp" variant="ghost" />
          </div>

          {hero.trust?.length > 0 && (
            <ul className="hero__trust reveal" aria-label={`Why choose ${COMPANY.name}`}>
              {hero.trust.map((t) => (
                <li key={t}><Icon name="check" size={16} /> {t}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="hero__visual reveal" aria-hidden="true">
          <div className="orbit">
            <div className="orbit__ring orbit__ring--1" />
            <div className="orbit__ring orbit__ring--2" />
            <div className="orbit__core">
              {offer ? (
                <>
                  <span>{COMPANY.launchDiscount}%</span>
                  <small>OFF</small>
                </>
              ) : (
                <span>{COMPANY.name.charAt(0)}</span>
              )}
            </div>
            {(hero.badges || []).slice(0, 3).map((b, i) => (
              <div key={b} className={`float-card float-card--${'abc'[i]}`}>
                <Icon name={['globe', 'phone', 'receipt'][i]} size={18} /> {b}
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="container">
        <dl className="stats reveal">
          {STATS.map((s) => (
            <div key={s.label} className="stats__item">
              <dt>{s.label}</dt>
              <dd className="gold-text">{s.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
