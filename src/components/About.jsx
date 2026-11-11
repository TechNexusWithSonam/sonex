import { SectionHeading } from './ui';
import Icon from './Icon';
import { useContent, useTexts } from '../content/ContentContext';

export default function About() {
  const { about, company, values: VALUES } = useContent();
  const t = useTexts();
  return (
    <section id="about" className="section" aria-labelledby="about-title">
      <div className="container about">
        <div className="about__intro">
          <SectionHeading
            id="about-title"
            align="left"
            eyebrow={`About ${company.name}`}
            title={t('aboutTitle')}
            accent={t('aboutAccent')}
          />
          <div className="reveal">
            {about.intro1 && <p>{about.intro1}</p>}
            {about.intro2 && <p>{about.intro2}</p>}
          </div>
        </div>

        <div className="about__cards">
          <article className="mv-card reveal">
            <span className="icon-badge"><Icon name="target" /></span>
            <h3>{t('missionTitle')}</h3>
            <p>{about.mission}</p>
          </article>
          <article className="mv-card mv-card--dark reveal">
            <span className="icon-badge"><Icon name="eye" /></span>
            <h3>{t('visionTitle')}</h3>
            <p>{about.vision}</p>
          </article>
        </div>

        {VALUES.length > 0 && (
        <ul className="values">
          {VALUES.map((v) => (
            <li key={v.title} className="values__item reveal">
              <Icon name={v.icon} />
              <div>
                <h3>{v.title}</h3>
                <p>{v.text}</p>
              </div>
            </li>
          ))}
        </ul>
        )}
      </div>
    </section>
  );
}
