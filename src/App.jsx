import { useEffect } from 'react';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import ProjectDetail from './components/ProjectDetail';
import Pricing from './components/Pricing';
import Testimonials from './components/Testimonials';
import Contact from './components/Contact';
import PageHero from './components/PageHero';
import Footer, { CtaBand, FloatingActions } from './components/Footer';
import { useContent } from './content/ContentContext';
import { useReveal } from './hooks/useReveal';
import { usePathname } from './utils/router';

/**
 * Every page of the site. Each has its own URL; `title` is the banner + browser-tab title
 * (the home page uses the SEO title from the admin) and `intro` is the banner text.
 */
const PAGES = {
  '/': {
    render: () => (
      <>
        <Hero />
        <Services />
        <Projects />
        <Testimonials />
        <CtaBand />
      </>
    ),
  },
  '/about': {
    title: 'About Us',
    intro: 'Who we are, what we believe in and how we work with every client.',
    render: () => (
      <>
        <About />
        <Testimonials />
        <CtaBand />
      </>
    ),
  },
  '/services': {
    title: 'Services',
    intro: 'Websites, apps and business software — everything you need to take your business digital.',
    render: () => (
      <>
        <Services />
        <CtaBand />
      </>
    ),
  },
  '/projects': {
    title: 'Projects',
    intro: 'Products we design and build — open any project to see the full case study.',
    render: () => (
      <>
        <Projects />
        <CtaBand />
      </>
    ),
  },
  '/pricing': {
    title: 'Pricing',
    intro: 'Transparent starting prices with a free consultation and a fixed quote.',
    render: () => (
      <>
        <Pricing />
        <CtaBand />
      </>
    ),
  },
  '/contact': {
    title: 'Contact Us',
    intro: 'Tell us what you need — we usually reply within a few hours.',
    render: () => <Contact />,
  },
};

function NotFound() {
  return (
    <>
      <PageHero title="Page not found" text="The page you are looking for does not exist or has moved." />
      <CtaBand />
    </>
  );
}

/** Sets the browser-tab title for a page; the home page uses the SEO title from the admin. */
function usePageTitle(title) {
  const { seo, company } = useContent();
  useEffect(() => {
    if (title === null) return; // project pages set their own title
    document.title = title ? `${title} | ${company.fullName}` : seo.title;
  }, [title, seo.title, company.fullName]);
}

export default function App() {
  const rawPath = usePathname();
  const path = rawPath.length > 1 ? rawPath.replace(/\/+$/, '') : rawPath;
  const projectSlug = path.match(/^\/projects\/([^/]+)$/)?.[1];
  const page = PAGES[path];
  useReveal(path);
  usePageTitle(projectSlug ? null : page ? page.title || '' : 'Page not found');

  // Every new page starts at the top (or at #id when a link points to one).
  useEffect(() => {
    const id = decodeURIComponent(window.location.hash.slice(1));
    const el = id && document.getElementById(id);
    if (el) el.scrollIntoView({ block: 'start' });
    else window.scrollTo(0, 0);
  }, [path]);

  let content;
  if (projectSlug) content = <ProjectDetail slug={decodeURIComponent(projectSlug)} />;
  else if (page) {
    content = (
      <>
        {page.title && <PageHero title={page.title} text={page.intro} />}
        {page.render()}
      </>
    );
  } else content = <NotFound />;

  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      {/* Keyed by path so each page mounts fresh (filters reset, animations replay). */}
      <main id="main" key={path}>
        {content}
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
