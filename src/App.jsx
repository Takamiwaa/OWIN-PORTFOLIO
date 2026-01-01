import Navbar from './components/Navbar';
import Home from './components/Hero';
import About from './components/About';
import Skills from './components/Skills';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Contact from './components/Contact';
import Testimonials from './components/Testimonial';
import Projects from './components/Projects';
import Experience from './components/Experience'; 

function App() {

  return (
    <>
      <Navbar />
      <Home />
      <About />
      <Skills />
      <Projects />
      <Experience /> 
      <Testimonials />
      <Contact />
      <Footer />
      <ScrollToTop />
    </>
  )
}

export default App