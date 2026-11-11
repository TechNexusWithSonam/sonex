import { useContent, useTexts } from '../content/ContentContext';
import { SectionHeading, Button } from './ui';
import Icon from './Icon';
import { formatINR, discounted, whatsappLink, scrollToSection } from '../utils/links';

export default function Pricing() {
  const { plans: PLANS, company: COMPANY } = useContent();
  const pct = COMPANY.launchDiscount;
  const t = useTexts();
  return (
    <section id="pricing" className="section section--dark" aria-labelledby="pricing-title">
      <div className="container">
        <SectionHeading
          id="pricing-title"
          eyebrow={t('pricingEyebrow')}
          title={t('pricingTitle')}
          accent={pct > 0 ? t('pricingAccentOffer') : t('pricingAccent')}
          text={t('pricingText')}
        />

        <div className="pricing">
          {PLANS.map((plan, i) => {
            const now = discounted(plan.price, pct);
            return (
              <article
                key={`${plan.name}-${i}`}
                className={`plan reveal ${plan.featured ? 'plan--featured' : ''}`}
                style={{ '--d': `${i * 80}ms` }}
                aria-label={`${plan.name} plan`}
              >
                {plan.featured && <span className="plan__ribbon">{t('pricingRibbon')}</span>}
                <h3>{plan.name}</h3>
                <p className="plan__for">{plan.for}</p>

                <div className="plan__price">
                  {plan.from && <span className="plan__from">Starting at</span>}
                  {pct > 0 && (
                    <span className="plan__old">
                      <span className="sr-only">Regular price </span>
                      {formatINR(plan.price)}
                    </span>
                  )}
                  <span className="plan__now">
                    {pct > 0 && <span className="sr-only">Launch price </span>}
                    {formatINR(now)}
                  </span>
                  {pct > 0 && <span className="plan__save">Save {formatINR(plan.price - now)}</span>}
                </div>

                <ul className="plan__features">
                  {(plan.features || []).map((f) => (
                    <li key={f}><Icon name="check" size={16} /> {f}</li>
                  ))}
                </ul>

                <div className="plan__actions">
                  <Button variant={plan.featured ? 'gold' : 'outline'} onClick={() => scrollToSection('contact')}>
                    Get a Free Quote
                  </Button>
                  <a
                    className="plan__wa"
                    href={whatsappLink(COMPANY, `Hi ${COMPANY.name}, I'm interested in the ${plan.name} package${pct > 0 ? ` with the ${pct}% launch offer` : ''}.`)}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    or ask on WhatsApp
                  </a>
                </div>
              </article>
            );
          })}
        </div>

        <p className="pricing__note reveal">
          * {pct > 0 && `${t('pricingOfferNote')} `}{t('pricingNote')}
        </p>
      </div>
    </section>
  );
}
