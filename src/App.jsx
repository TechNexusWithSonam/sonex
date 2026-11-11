import Navbar from './components/Navbar';
import Hero from './components/Hero';
import About from './components/About';
import Services from './components/Services';
import Projects from './components/Projects';
import Pricing from './components/Pricing';
import Contact from './components/Contact';
import Footer, { CtaBand, FloatingActions } from './components/Footer';
import { useReveal } from './hooks/useReveal';

export default function App() {
  useReveal();
  return (
    <>
      <a className="skip-link" href="#main">Skip to content</a>
      <Navbar />
      <main id="main">
        <Hero />
        <About />
        <Services />
        <Projects />
        <Pricing />
        <CtaBand />
        <Contact />
      </main>
      <Footer />
      <FloatingActions />
    </>
  );
}
