import { useEffect } from 'react';
import { useContent, useTexts } from '../content/ContentContext';
import { projectSlug } from '../data/site';
import { linkClick, projectPath } from '../utils/router';
import { whatsappLink } from '../utils/links';
import { CtaBand } from './Footer';
import { Mockup } from './Projects';
import { Button, CallNowButton } from './ui';
import Icon, { WhatsAppIcon } from './Icon';

/** "1,200+ | Product variants" → { value, label } */
const parseHighlight = (line) => {
  const [value, ...rest] = String(line).split('|');
  return { value: value.trim(), label: rest.join('|').trim() };
};

function usePageMeta(title, description) {
  const { seo } = useContent();
  useEffect(() => {
    if (!title) return undefined;
    const meta = document.head.querySelector('meta[name="description"]');
    document.title = title;
    if (meta && description) meta.setAttribute('content', description);
    return () => {
      document.title = seo.title;
      if (meta) meta.setAttribute('content', seo.description);
    };
  }, [title, description, seo]);
}

function NotFound() {
  usePageMeta('Project not found', '');
  return (
    <section className="pd-hero pd-hero--empty">
      <div className="container">
        <span className="eyebrow">Portfolio</span>
        <h1>Project not found</h1>
        <p>This project may have been renamed or removed.</p>
        <Button variant="gold" href="/projects" onClick={linkClick}>
          See all projects <Icon name="arrow" size={18} />
        </Button>
      </div>
    </section>
  );
}

export default function ProjectDetail({ slug }) {
  const { projects, company } = useContent();
  const t = useTexts();
  const index = projects.findIndex((p) => projectSlug(p) === slug);
  const p = projects[index];
  usePageMeta(
    p ? `${p.title} — ${p.category} case study | ${company.fullName}` : '',
    p ? p.text : ''
  );
  if (!p) return <NotFound />;

  const accent = p.accent?.length === 2 ? p.accent : ['#d4a845', '#3b2a0a'];
  const photos = [p.cover, ...(p.gallery || [])].filter(Boolean);
  const highlights = (p.highlights || []).map(parseHighlight).filter((h) => h.value);
  const meta = [
    ['Industry', p.industry],
    ['Platform', p.platform],
    ['Timeline', p.timeline],
    ['Year', p.year],
  ].filter(([, v]) => v);
  const prev = projects[(index - 1 + projects.length) % projects.length];
  const next = projects[(index + 1) % projects.length];
  const related = projects
    .filter((x) => x !== p)
    .sort((a, b) => (b.category === p.category) - (a.category === p.category))
    .slice(0, 3);
  const enquiry = `Hi ${company.name}, I saw your “${p.title}” project. I'd like something similar for my business.`;
  const note = t('projectNote');

  return (
    <article className="pd" aria-labelledby="pd-title">
      {/* ---------- Hero ---------- */}
      <header className="pd-hero" style={{ '--a1': accent[0], '--a2': accent[1] }}>
        {p.cover && <img className="pd-hero__bg" src={p.cover} alt="" fetchpriority="high" />}
        <div className="container pd-hero__inner">
          <div className="pd-hero__copy">
            <nav className="crumbs" aria-label="Breadcrumb">
              <a href="/" onClick={linkClick}>Home</a>
              <span aria-hidden="true">/</span>
              <a href="/projects" onClick={linkClick}>Projects</a>
              <span aria-hidden="true">/</span>
              <span aria-current="page">{p.title}</span>
            </nav>
            <span className="eyebrow">{p.category} · Case study</span>
            <h1 id="pd-title">{p.title}</h1>
            <p className="pd-hero__lead">{p.text}</p>
            <div className="pd-hero__cta">
              <Button variant="gold" href={whatsappLink(company, enquiry)}>
                <WhatsAppIcon size={18} /> Build something similar
              </Button>
              <CallNowButton variant="ghost" />
              {p.liveUrl && /^https?:\/\//.test(p.liveUrl) && (
                <Button variant="outline" href={p.liveUrl}>
                  View live demo <Icon name="arrow" size={18} />
                </Button>
              )}
            </div>
            {meta.length > 0 && (
              <dl className="pd-meta">
                {meta.map(([k, v]) => (
                  <div key={k}>
                    <dt>{k}</dt>
                    <dd>{v}</dd>
                  </div>
                ))}
              </dl>
            )}
          </div>
          <div className="pd-hero__visual">
            <Mockup kind={p.kind || 'site'} accent={accent} className="mock--lg" />
          </div>
        </div>
      </header>

      {/* ---------- Key numbers ---------- */}
      {highlights.length > 0 && (
        <section className="pd-numbers" aria-label="Project highlights">
          <dl className="container pd-numbers__grid">
            {highlights.map((h) => (
              <div key={h.value + h.label} className="reveal">
                <dt>{h.label}</dt>
                <dd className="gold-text">{h.value}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {/* ---------- Story ---------- */}
      {(p.overview || p.challenge || p.solution) && (
        <section className="section pd-story" aria-labelledby="pd-overview">
          <div className="container pd-story__grid">
            <div className="pd-story__intro reveal">
              <span className="eyebrow">Overview</span>
              <h2 id="pd-overview">About the project</h2>
              {p.overview && <p>{p.overview}</p>}
            </div>
            <div className="pd-story__cards">
              {p.challenge && (
                <div className="pd-card reveal">
                  <span className="icon-badge"><Icon name="target" /></span>
                  <h3>The challenge</h3>
                  <p>{p.challenge}</p>
                </div>
              )}
              {p.solution && (
                <div className="pd-card pd-card--dark reveal">
                  <span className="icon-badge"><Icon name="spark" /></span>
                  <h3>Our solution</h3>
                  <p>{p.solution}</p>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---------- Gallery ---------- */}
      {photos.length > 0 && (
        <section className="pd-gallery" aria-label="Project images">
          <div className={`container pd-gallery__grid pd-gallery__grid--${Math.min(photos.length, 3)}`}>
            {photos.slice(0, 3).map((src, i) => (
              <figure key={src} className="reveal">
                <img src={src} alt={`${p.title} — image ${i + 1}`} loading="lazy" decoding="async" />
              </figure>
            ))}
          </div>
        </section>
      )}

      {/* ---------- Features + sidebar ---------- */}
      <section className="section pd-details" aria-labelledby="pd-features">
        <div className="container pd-details__grid">
          <div>
            <span className="eyebrow">What it does</span>
            <h2 id="pd-features">Key features</h2>
            {p.features?.length > 0 ? (
              <ul className="pd-features">
                {p.features.map((f) => (
                  <li key={f} className="reveal">
                    <Icon name="check" size={18} /> <span>{f}</span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="pd-muted">{p.text}</p>
            )}
          </div>

          <aside className="pd-aside">
            {p.tags?.length > 0 && (
              <div className="pd-aside__box">
                <h3>Tech stack</h3>
                <ul className="tags">
                  {p.tags.map((tag) => <li key={tag}>{tag}</li>)}
                </ul>
              </div>
            )}
            {p.deliverables?.length > 0 && (
              <div className="pd-aside__box">
                <h3>What we delivered</h3>
                <ul className="pd-deliverables">
                  {p.deliverables.map((d) => (
                    <li key={d}><Icon name="check" size={16} /> {d}</li>
                  ))}
                </ul>
              </div>
            )}
            <div className="pd-aside__box pd-aside__box--cta">
              <h3>Want a {p.category ? p.category.toLowerCase() : 'project'} like this?</h3>
              <p>Free consultation and a fixed quote — usually within 24 hours.</p>
              <Button variant="gold" href={whatsappLink(company, enquiry)}>
                <WhatsAppIcon size={18} /> Chat on WhatsApp
              </Button>
              <a className="pd-aside__link" href="/contact" onClick={linkClick}>
                or send an enquiry <Icon name="arrow" size={16} />
              </a>
            </div>
            {note && <p className="pd-note">{note}</p>}
          </aside>
        </div>
      </section>

      {/* ---------- Prev / next ---------- */}
      {projects.length > 1 && (
        <nav className="pd-pager container" aria-label="More projects">
          <a href={projectPath(projectSlug(prev))} onClick={linkClick} className="pd-pager__link">
            <small>← Previous</small>
            <strong>{prev.title}</strong>
          </a>
          <a href={projectPath(projectSlug(next))} onClick={linkClick} className="pd-pager__link pd-pager__link--next">
            <small>Next →</small>
            <strong>{next.title}</strong>
          </a>
        </nav>
      )}

      {/* ---------- Related ---------- */}
      {related.length > 0 && (
        <section className="section pd-related" aria-labelledby="pd-related">
          <div className="container">
            <div className="pd-related__head">
              <h2 id="pd-related">More of our work</h2>
              <a href="/projects" onClick={linkClick}>All projects <Icon name="arrow" size={16} /></a>
            </div>
            <div className="projects">
              {related.map((r) => (
                <article key={r.title} className="project-card">
                  {r.cover ? (
                    <div className="project-card__media">
                      <img src={r.cover} alt="" loading="lazy" decoding="async" width="640" height="420" />
                    </div>
                  ) : (
                    <Mockup kind={r.kind || 'site'} accent={r.accent?.length === 2 ? r.accent : accent} />
                  )}
                  <div className="project-card__body">
                    <span className="project-card__cat">{r.category}</span>
                    <h3>
                      <a href={projectPath(projectSlug(r))} onClick={linkClick} className="project-card__link">{r.title}</a>
                    </h3>
                    <p>{r.text}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
      )}

      <CtaBand />
    </article>
  );
}
