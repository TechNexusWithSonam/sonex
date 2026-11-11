import { useMemo, useState } from 'react';
import { useContent, useTexts } from '../content/ContentContext';
import { SectionHeading } from './ui';

/** Lightweight CSS mockup instead of heavy screenshots — keeps the page fast. */
function Mockup({ kind, accent }) {
  const style = { '--a1': accent[0], '--a2': accent[1] };
  if (kind === 'mobile') {
    return (
      <div className="mock mock--mobile" style={style} aria-hidden="true">
        <div className="mock__phone">
          <span className="mock__bar" />
          <span className="mock__hero" />
          <span className="mock__row" />
          <span className="mock__row mock__row--short" />
          <span className="mock__chips"><i /><i /><i /></span>
        </div>
      </div>
    );
  }
  return (
    <div className={`mock mock--${kind}`} style={style} aria-hidden="true">
      <div className="mock__browser">
        <span className="mock__dots"><i /><i /><i /></span>
        <div className="mock__body">
          {kind === 'dashboard' ? (
            <>
              <span className="mock__side" />
              <span className="mock__kpis"><i /><i /><i /></span>
              <span className="mock__chart">{[40, 65, 50, 80, 60, 95, 75].map((h, i) => <i key={i} style={{ height: `${h}%` }} />)}</span>
            </>
          ) : (
            <>
              <span className="mock__hero" />
              <span className="mock__grid">{Array.from({ length: kind === 'store' ? 4 : 3 }, (_, i) => <i key={i} />)}</span>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default function Projects() {
  const { projects: PROJECTS } = useContent();
  const t = useTexts();
  const categories = useMemo(() => ['All', ...new Set(PROJECTS.map((p) => p.category).filter(Boolean))], [PROJECTS]);
  const [filter, setFilter] = useState('All');
  const list = filter === 'All' ? PROJECTS : PROJECTS.filter((p) => p.category === filter);

  return (
    <section id="projects" className="section" aria-labelledby="projects-title">
      <div className="container">
        <SectionHeading
          id="projects-title"
          eyebrow={t('projectsEyebrow')}
          title={t('projectsTitle')}
          accent={t('projectsAccent')}
          text={t('projectsText')}
        />

        <div className="filters reveal" role="group" aria-label="Filter projects by category">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              className={`chip ${filter === c ? 'is-active' : ''}`}
              aria-pressed={filter === c}
              onClick={() => setFilter(c)}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="projects" aria-live="polite">
          {list.map((p, i) => (
            <article key={`${p.title}-${i}`} className="project-card">
              <Mockup kind={p.kind || 'site'} accent={p.accent?.length === 2 ? p.accent : ['#d4a845', '#3b2a0a']} />
              <div className="project-card__body">
                <span className="project-card__cat">{p.category}</span>
                <h3>{p.title}</h3>
                <p>{p.text}</p>
                <ul className="tags" aria-label="Technologies">
                  {(p.tags || []).map((t) => <li key={t}>{t}</li>)}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
