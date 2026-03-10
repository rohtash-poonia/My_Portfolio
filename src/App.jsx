import React, { lazy, Suspense, useState, useEffect } from "react";
import IntroScreen from "./components/Intro";
import Nav from "./components/Nav";
import Cursor from "./components/Cursor";
import FullPageScroll from "./components/FullPageScroll";

// Lazy imports - Same hi rahenge
const Home = lazy(() => import("./sections/Home"));
const About = lazy(() => import("./sections/About"));
const Skill = lazy(() => import("./sections/Skill"));
const Project = lazy(() => import("./sections/Project"));
const Experience = lazy(() => import("./sections/Experience"));
const Testimonial = lazy(() => import("./sections/Testimonial"));
const Contact = lazy(() => import("./sections/Contact"));

export default function App() {
  const [showIntro, setShowIntro] = useState(true);
  
  // Mobile check optimization - Isko dynamic rakhte hain taaki mobile load aur kam ho
  const [isDesktop, setIsDesktop] = useState(window.innerWidth > 1024);

  useEffect(() => {
    const handleResize = () => setIsDesktop(window.innerWidth > 1024);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="relative text-white bg-black min-h-screen">
      {showIntro && <IntroScreen onFinish={() => setShowIntro(false)} />}

      {!showIntro && (
        <>
          {/* Desktop specific components ko condition mein rakha taaki mobile lag na ho */}
          {isDesktop && <Cursor isDesktop={isDesktop} />}
          
          <Nav />

          <Suspense 
            fallback={
              <div className="h-screen flex items-center justify-center bg-[#050505] text-white">
                <div className="flex flex-col items-center gap-4">
                  <div className="w-12 h-12 border-4 border-t-pink-500 border-gray-800 rounded-full animate-spin"></div>
                  <p className="text-sm tracking-widest animate-pulse">SYNCING UNIVERSE...</p>
                </div>
              </div>
            }
          >
            <FullPageScroll>
              {/* Har section tabhi load hoga jab user wahan pahuchega */}
              <Home />
              <About />
              <Skill />
              <Project />
              <Experience />
              <Testimonial />
              <Contact /> 
            </FullPageScroll>
          </Suspense>
        </>
      )}
    </div>
  );
}