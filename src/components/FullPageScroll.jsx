import React, { useState, useRef, useEffect, useCallback, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const sectionVariants = {
  enter: (direction) => ({
    y: direction > 0 ? '100%' : '-100%',
    opacity: 0,
  }),
  center: {
    y: '0%',
    opacity: 1,
    transition: {
      duration: 0.8,
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
  const [activeIndex, setActiveIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const cooldown = useRef(false);
  const activeRef = useRef(0);
  const touchY = useRef(0);
  const sections = React.Children.toArray(children);

  useEffect(() => {
    activeRef.current = activeIndex;
  }, [activeIndex]);

  const goTo = useCallback((newIndex, dir) => {
    if (cooldown.current) return;
    if (newIndex < 0 || newIndex >= sections.length) return;
    if (newIndex === activeRef.current) return;

    cooldown.current = true;
    setDirection(dir);

    requestAnimationFrame(() => {
      setActiveIndex(newIndex);
    });

    const cooldownTimer = setTimeout(() => {
      cooldown.current = false;
    }, 1200);

    return () => clearTimeout(cooldownTimer);
  }, [sections.length]);

  useEffect(() => {
    const handleWheel = (e) => {
      e.preventDefault();
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