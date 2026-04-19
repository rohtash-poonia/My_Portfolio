import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation, useNavigate } from 'react-router-dom';

const sectionVariants = {
  enter: (direction) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: (direction) => ({
    y: direction > 0 ? '-100%' : '100%',
    opacity: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1],
    },
  }),
};

export default function FullPageScroll({ children }) {
  const sections = React.Children.toArray(children);
  const location = useLocation();
  const navigate = useNavigate();

  // Mapping of paths to indices
  const paths = [
    "/",
    "/about",
    "/skills",
    "/projects",
    "/experience",
    "/testimonials",
    "/contact"
  ];

  // Helper to find index from path
  const getIndexFromPath = useCallback((pathname) => {
    if (pathname === "/") return 0;
    const idx = paths.indexOf(pathname);
    return idx === -1 ? 0 : idx;
  }, []);

  const [activeIndex, setActiveIndex] = useState(() => getIndexFromPath(location.pathname));
  const [direction, setDirection] = useState(1);
  const cooldown = useRef(false);
  const activeRef = useRef(activeIndex);
  const touchY = useRef(0);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  const goTo = useCallback((newIndex, dir) => {
    if (cooldown.current) return;
    if (newIndex < 0 || newIndex >= sections.length) return;
    if (newIndex === activeRef.current) return;

    cooldown.current = true;
    setDirection(dir);

    // Update URL - This will trigger the useEffect below to update activeIndex
    navigate(paths[newIndex]);

    const cooldownTimer = setTimeout(() => {
      cooldown.current = false;
    }, 1000); // 1s cooldown is usually enough with 0.6s animation

    return () => clearTimeout(cooldownTimer);
  }, [sections.length, navigate]);

  // Sync state with URL changes
  useEffect(() => {
    const newIdx = getIndexFromPath(location.pathname);
    if (newIdx !== activeRef.current) {
      const dir = newIdx > activeRef.current ? 1 : -1;
      setDirection(dir);
      setActiveIndex(newIdx);
    }
  }, [location.pathname, getIndexFromPath]);

  // Expose goTo globally for components that might not use Link
  useEffect(() => {
    window.__fullPageGoTo = (index) => {
      const dir = index > activeRef.current ? 1 : -1;
      goTo(index, dir);
    };
    return () => { delete window.__fullPageGoTo; };
  }, [goTo]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
      
      // Fast rejection: check cooldown and threshold immediately
      if (cooldown.current) return;
      if (Math.abs(e.deltaY) < 40) return; // Sensitivity threshold (ignore small jitters)

      const idx = activeRef.current;
      if (e.deltaY > 0 && idx < sections.length - 1) goTo(idx + 1, 1);
      else if (e.deltaY < 0 && idx > 0) goTo(idx - 1, -1);
    };
    window.addEventListener('wheel', handleWheel, { passive: false });
    return () => window.removeEventListener('wheel', handleWheel);
  }, [goTo, sections.length]);

  useEffect(() => {
    const handleKey = (e) => {
      const idx = activeRef.current;
      if (e.key === 'ArrowDown' || e.key === 'PageDown') { e.preventDefault(); goTo(idx + 1, 1); }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') { e.preventDefault(); goTo(idx - 1, -1); }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [goTo]);

  return (
    <div
      onTouchStart={(e) => { touchY.current = e.touches[0].clientY; }}
      onTouchEnd={(e) => {
        const diff = touchY.current - e.changedTouches[0].clientY;
        if (Math.abs(diff) < 60) return;
        const idx = activeRef.current;
        if (diff > 0) goTo(idx + 1, 1);
        else goTo(idx - 1, -1);
      }}
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        background: '#050505',
      }}
    >
      <AnimatePresence initial={false} mode="popLayout" custom={direction}>
        <motion.div
          key={activeIndex}
          custom={direction}
          variants={sectionVariants}
          initial="enter"
          animate="center"
          exit="exit"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            willChange: 'transform, opacity',
          }}
        >
          {/* 🔥 LOAD CONTROL: Sirf active section hi render hogi */}
          {/* Suspense fallback ensures light-weight loading */}
          <Suspense fallback={<div style={{background: '#050505', height: '100%'}} />}>
            {sections[activeIndex]}
          </Suspense>
        </motion.div>
      </AnimatePresence>

      {/* Scroll Hint */}
      {activeIndex === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2 }}
          style={{
            position: 'fixed',
            bottom: '30px',
            left: '50%',
            transform: 'translateX(-50%)',
            zIndex: 100,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '8px',
          }}
        >
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.5, repeat: Infinity }}
            style={{
              width: '22px',
              height: '36px',
              borderRadius: '12px',
              border: '2px solid #444',
              display: 'flex',
              justifyContent: 'center',
              paddingTop: '6px',
            }}
          >
            <motion.div
              animate={{ y: [0, 10, 0], opacity: [1, 0.3, 1] }}
              transition={{ duration: 1.5, repeat: Infinity }}
              style={{
                width: '4px',
                height: '8px',
                borderRadius: '4px',
                background: '#00f5a0',
              }}
            />
          </motion.div>
          <span style={{ color: '#444', fontSize: '0.7rem', letterSpacing: '2px' }}>
            SCROLL
          </span>
        </motion.div>
      )}
    </div>
  );
}