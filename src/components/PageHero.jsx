import { linkClick } from '../utils/router';

/** Dark banner at the top of every inner page: page title + breadcrumb. */
export default function PageHero({ title, text }) {
  return (
    <header className="page-hero">
      <div className="page-hero__glow" aria-hidden="true" />
      <div className="container page-hero__inner">
        <nav className="crumbs" aria-label="Breadcrumb">
          <a href="/" onClick={linkClick}>Home</a>
          <span aria-hidden="true">/</span>
          <span aria-current="page">{title}</span>
        </nav>
        <h1>{title}</h1>
        {text && <p>{text}</p>}
      </div>
    </header>
  );
}
