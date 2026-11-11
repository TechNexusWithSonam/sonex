import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { useTexts } from '../content/ContentContext';
import { SectionHeading } from './ui';
import Icon from './Icon';

const STAR = 'M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6-4.9-4.6 6.6-.8L12 2.5Z';

export function Stars({ rating, size = 18 }) {
  return (
    <span className="stars" role="img" aria-label={`Rated ${rating} out of 5`}>
      {[1, 2, 3, 4, 5].map((n) => (
        <svg key={n} width={size} height={size} viewBox="0 0 24 24" aria-hidden="true" focusable="false" className={n <= rating ? 'is-on' : ''}>
          <path d={STAR} />
        </svg>
      ))}
    </span>
  );
}

const initials = (name) =>
  String(name || '?').trim().split(/\s+/).filter((w) => /^\p{L}/u.test(w)).slice(0, 2).map((w) => w[0].toUpperCase()).join('') || '?';

export function Avatar({ name, image, size = 56 }) {
  const [failed, setFailed] = useState(false);
  useEffect(() => setFailed(false), [image]);
  const style = { width: size, height: size, fontSize: size * 0.38 };
  if (image && !failed) {
    return <img className="avatar" src={image} alt="" width={size} height={size} loading="lazy" decoding="async" style={style} onError={() => setFailed(true)} />;
  }
  return <span className="avatar avatar--initials" style={style} aria-hidden="true">{initials(name)}</span>;
}

/** Long reviews are clamped with a "Read more" toggle, which only appears when the text actually overflows. */
function Review({ text }) {
  const ref = useRef(null);
  const [open, setOpen] = useState(false);
  const [clamped, setClamped] = useState(false);
  useLayoutEffect(() => {
    const el = ref.current;
    const check = () => !open && setClamped(el.scrollHeight - el.clientHeight > 2);
    check();
    const ro = new ResizeObserver(check);
    ro.observe(el);
    return () => ro.disconnect();
  }, [text, open]);
  return (
    <>
      <blockquote className="t-card__quote">
        <p ref={ref} className={open ? '' : 't-card__clamp'}>{text}</p>
      </blockquote>
      {(clamped || open) && (
        <button type="button" className="t-card__more" aria-expanded={open} onClick={() => setOpen((o) => !o)}>
          {open ? 'Show less' : 'Read more'}
        </button>
      )}
    </>
  );
}

/** Active testimonials: inlined by the server in production, fetched from the API in development. */
function useTestimonials() {
  const inlined = typeof window !== 'undefined' && Array.isArray(window.__SONEX_TESTIMONIALS__) ? window.__SONEX_TESTIMONIALS__ : null;
  const [items, setItems] = useState(inlined || []);
  useEffect(() => {
    if (inlined) return;
    const ctrl = new AbortController();
    fetch('/api/testimonials', { signal: ctrl.signal, cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : []))
      .then((d) => setItems(Array.isArray(d) ? d : []))
      .catch(() => {});
    return () => ctrl.abort();
  }, [inlined]);
  return items;
}

export default function Testimonials() {
  const items = useTestimonials();
  const t = useTexts();
  const section = useRef(null);
  const track = useRef(null);
  const [nav, setNav] = useState({ prev: false, next: false });

  // The page-wide reveal observer runs once on load; items fetched later are revealed here.
  useEffect(() => {
    const els = section.current?.querySelectorAll('.reveal:not(.is-visible)');
    if (!els?.length) return;
    if (!('IntersectionObserver' in window)) return els.forEach((el) => el.classList.add('is-visible'));
    const io = new IntersectionObserver((entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    }), { threshold: 0.12 });
    els.forEach((el) => io.observe(el));
    return () => io.disconnect();
  }, [items.length]);

  // Arrow buttons are shown only when the cards overflow the track.
  useEffect(() => {
    const el = track.current;
    if (!el) return;
    const update = () => setNav({ prev: el.scrollLeft > 4, next: el.scrollLeft + el.clientWidth < el.scrollWidth - 4 });
    update();
    el.addEventListener('scroll', update, { passive: true });
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => { el.removeEventListener('scroll', update); ro.disconnect(); };
  }, [items.length]);

  if (!items.length) return null;

  const scrollBy = (dir) => {
    const el = track.current;
    const card = el.querySelector('.t-slide');
    const step = card ? card.getBoundingClientRect().width + parseFloat(getComputedStyle(el).columnGap || 0) : el.clientWidth;
    el.scrollBy({ left: dir * step, behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' });
  };

  const avg = items.reduce((s, i) => s + i.rating, 0) / items.length;
  const showNav = nav.prev || nav.next;

  return (
    <section id="testimonials" ref={section} className="section testimonials" aria-labelledby="testimonials-title">
      <div className="container">
        <SectionHeading
          id="testimonials-title"
          eyebrow={t('testimonialsEyebrow')}
          title={t('testimonialsTitle')}
          accent={t('testimonialsAccent')}
          text={t('testimonialsText')}
        />

        <div className="t-summary reveal">
          <Stars rating={Math.round(avg)} size={20} />
          <span>
            <strong>{avg.toFixed(1)}</strong> average from {items.length} {items.length === 1 ? 'review' : 'reviews'}
          </span>
        </div>

        <div className={`t-carousel ${items.length < 3 ? 't-carousel--few' : ''}`}>
          <ul ref={track} className="t-track" aria-label="Customer testimonials" tabIndex={showNav ? 0 : undefined}>
            {items.map((item) => (
              <li key={item.id} className="t-slide">
                <figure className="t-card">
                  <span className="t-card__mark" aria-hidden="true">“</span>
                  <Stars rating={item.rating} />
                  <Review text={item.review} />
                  <figcaption className="t-card__by">
                    <Avatar name={item.name} image={item.image} />
                    <span>
                      <strong>{item.name}</strong>
                      {(item.designation || item.company) && <small>{[item.designation, item.company].filter(Boolean).join(', ')}</small>}
                    </span>
                  </figcaption>
                </figure>
              </li>
            ))}
          </ul>

          {showNav && (
            <div className="t-nav">
              <button type="button" className="t-nav__btn t-nav__btn--prev" onClick={() => scrollBy(-1)} disabled={!nav.prev} aria-label="Previous testimonials">
                <Icon name="arrow" size={20} />
              </button>
              <button type="button" className="t-nav__btn" onClick={() => scrollBy(1)} disabled={!nav.next} aria-label="Next testimonials">
                <Icon name="arrow" size={20} />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
