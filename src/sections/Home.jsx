import React, { useMemo, useEffect, useState } from "react";
import Background from "../components/background";
import { motion } from "framer-motion";
import { FaGithub, FaLinkedin } from "react-icons/fa6";
import Hero from "../components/Hero.jsx";
import clickSoundFile from "../components/multi-pop.mp3"; // ✅ import MP3

const socials = [
  {
    Icon: FaLinkedin,
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/sajal-vishwakarma-b2008b27b/",
  },
  {
    Icon: FaGithub,
    label: "GitHub",
    href: "https://github.com/Sajalvishwa",
  },
];

const glowVariants = {
  initial: { scale: 1, y: 0, filter: "drop-shadow(0px 0px 0px rgba(255,255,255,0))" },
  hover: {
    scale: 1.2,
    y: -3,
    filter: "drop-shadow(0 0 8px rgba(255,255,255,0.9)) drop-shadow(0 0 18px rgba(255,255,255,0.7))",
    transition: { type: "spring", stiffness: 250, damping: 20 },
  },
  tap: { scale: 0.95, y: 0 },
};

export default function Home() {
  const roles = useMemo(
    () => ["Mern Stack Developer", "Software Developer", "React Developer"],
    []
  );

  const [index, setIndex] = useState(0);
  const [subIndex, setSubIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);

  // ---------------- TYPEWRITER SMOOTH ----------------
  useEffect(() => {
    const current = roles[index];
    const timeout = setTimeout(() => {
      if (!deleting && subIndex < current.length) {
        setSubIndex((v) => v + 1);
      } else if (!deleting && subIndex === current.length) {
        setTimeout(() => setDeleting(true), 800);
      } else if (deleting && subIndex > 0) {
        setSubIndex((v) => v - 1);
      } else if (deleting && subIndex === 0) {
        setDeleting(false);
        setIndex((p) => (p + 1) % roles.length);
      }
    }, deleting ? 70 : 100);

    return () => clearTimeout(timeout);
  }, [subIndex, index, deleting, roles]);

  // ----------- AUDIO FOR CLICKS -------------
  const clickSound = new Audio(clickSoundFile);

  const handleClickSound = () => {
    clickSound.play();
  };

  return (
    <section id="home" className="relative min-h-screen overflow-hidden">
      <Background />

      <div className="relative z-10 min-h-screen flex items-center">
        <div className="w-full max-w-7xl mx-auto px-6 flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* LEFT SIDE CONTENT */}
          <div className="flex-1 text-left">

            {/* Role Typewriter */}
            <motion.div
              className="text-3xl sm:text-4xl font-semibold text-white"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, ease: "easeInOut" }}
            >
              {roles[index].substring(0, subIndex)}
              <span className="inline-block w-[2px] ml-2 bg-white h-[2.5rem] animate-pulse align-middle"></span>
            </motion.div>

            {/* Main Heading */}
            <motion.h1
              className="mt-4 text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 1.2, ease: "easeInOut" }}
            >
              <span className="animated-gradient-text">Hello I'm </span>
              <span className="text-pink-400 hover:text-pink-500 transition-colors duration-300 whitespace-nowrap">
                Sajal Vishwakarma
              </span>
            </motion.h1>

            {/* Description */}
            <motion.p
              className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-xl"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 1, ease: "easeInOut" }}
            >
              I turn complex ideas into seamless, high-impact web experiences —
              building modern, scalable, and lightning-fast applications that make
              a difference.
            </motion.p>

            {/* Button + Social Icons */}
            <motion.div
              className="mt-10 flex flex-wrap items-center gap-6"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8, duration: 1, ease: "easeInOut" }}
            >
              {/* Resume Button */}
              <a
                href="/resume.pdf"
                download
                onClick={handleClickSound} // ✅ play sound on click
                className="inline-block px-8 py-3 rounded-full text-lg font-semibold text-white
                bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600
                hover:scale-105 hover:shadow-lg hover:shadow-white/40
                transition-all duration-300 ease-in-out"
              >
                My Resume
              </a>

              {/* Social Icons */}
              <div className="flex gap-5 text-2xl md:text-3xl">
                {socials.map(({ Icon, label, href }) => (
                  <motion.a
                    key={label}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    onClick={handleClickSound} // ✅ play sound when social icon clicked
                    variants={glowVariants}
                    initial="initial"
                    whileHover="hover"
                    whileTap="tap"
                    className="text-gray-300 hover:text-white transition-all duration-300 ease-in-out"
                  >
                    <Icon />
                  </motion.a>
                ))}
              </div>
            </motion.div>
          </div>

          {/* RIGHT SIDE HERO COMPONENT */}
          <div className="flex-1 flex justify-center lg:justify-end min-h-[500px]">
            <Hero className="w-full h-full" />
          </div>
        </div>
      </div>
    </section>
  );
}