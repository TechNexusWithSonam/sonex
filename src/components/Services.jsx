import { useContent, useTexts } from '../content/ContentContext';
import { SectionHeading, QuoteButton, WhatsAppButton } from './ui';
import Icon from './Icon';
import { whatsappLink } from '../utils/links';

export default function Services() {
  const { services: SERVICES, company } = useContent();
  const t = useTexts();
  return (
    <section id="services" className="section section--dark" aria-labelledby="services-title">
      <div className="container">
        <SectionHeading
          id="services-title"
          eyebrow={t('servicesEyebrow')}
          title={t('servicesTitle')}
          accent={t('servicesAccent')}
          text={t('servicesText')}
        />

        <div className="services">
          {SERVICES.map((s, i) => (
            <article key={s.title} className="service-card reveal" style={{ '--d': `${(i % 3) * 80}ms` }}>
              <span className="icon-badge"><Icon name={s.icon} /></span>
              <h3>{s.title}</h3>
              <p>{s.text}</p>
              <ul>
                {(s.points || []).map((p) => (
                  <li key={p}><Icon name="check" size={14} /> {p}</li>
                ))}
              </ul>
              <a
                className="service-card__link"
                href={whatsappLink(company, `Hi ${company.name}, I'm interested in ${s.title}. Please share details.`)}
                target="_blank"
                rel="noopener noreferrer"
              >
                Enquire now <Icon name="arrow" size={16} />
                <span className="sr-only">about {s.title} on WhatsApp</span>
              </a>
            </article>
          ))}

          <article className="service-card service-card--cta reveal">
            <h3>{t('servicesCtaTitle')}</h3>
            <p>{t('servicesCtaText')}</p>
            <div className="service-card__actions">
              <QuoteButton />
              <WhatsAppButton label="Chat" variant="outline" />
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}
