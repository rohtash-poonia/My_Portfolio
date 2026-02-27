import Nav from "./components/Nav";
import Cursor from "./components/Cursor";

import Home from "./sections/Home";
import About from "./sections/About";
import Skill from "./sections/Skill";
import Project from "./sections/Project";
import Experience from "./sections/Experience";
import Testimonial from "./sections/Testimonial";
import Contact from "./sections/Contact";
import Footer from "./sections/Footer";

export default function App() {
  const isDesktop = true;

  return (
    <div className="relative text-white">
      <Cursor isDesktop={isDesktop} />
      <Nav />
      <Home />
      <About />
      <Skill />
      <Project />
      <Experience />
      <Testimonial />
      <Contact />
      <Footer />
    </div>
  );
}