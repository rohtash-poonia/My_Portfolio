import React, { useState } from "react";
import { motion } from "framer-motion";

export default function TestimonialsPage() {
  const testimonials = [
    {
      quote: "The attention to detail and innovative features have completely transformed our workflow. This is exactly what we've been looking for.",
      name: "Sarah Chen",
      designation: "Product Manager at TechFlow",
      src: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=3560&auto=format&fit=crop",
    },
    {
      quote: "Implementation was seamless and the results exceeded our expectations. The platform's flexibility is remarkable.",
      name: "Michael Rodriguez",
      designation: "CTO at InnovateSphere",
      src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote: "This solution has significantly improved our team's productivity. The intuitive interface makes complex tasks simple.",
      name: "Emily Watson",
      designation: "Operations Director at CloudScale",
      src: "https://images.unsplash.com/photo-1623582854588-d60de57fa33f?q=80&w=3540&auto=format&fit=crop",
    },
    {
      quote: "Outstanding support and robust features. It's rare to find a product that delivers on all its promises.",
      name: "James Kim",
      designation: "Engineering Lead at DataPro",
      src: "https://images.unsplash.com/photo-1636041293178-808a6762ab39?q=80&w=3464&auto=format&fit=crop",
    },
    {
      quote: "The scalability and performance have been game-changing for our organization. Highly recommend to any growing business.",
      name: "Lisa Thompson",
      designation: "VP of Technology at FutureNet",
      src: "https://images.unsplash.com/photo-1624561172888-ac93c696e10c?q=80&w=2592&auto=format&fit=crop",
    },
  ];

  const [index, setIndex] = useState(0);

  const nextSlide = () => setIndex((prev) => (prev + 1) % testimonials.length);
  const prevSlide = () => setIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);

  return (
    <>
      <style>
        {`
          .testimonials-wrapper {
            min-height: 100vh;
            width: 100%;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            /* Contact Page wala Background */
            background: radial-gradient(ellipse at bottom, #1B2735 0%, #090A0F 100%);
            position: relative;
            overflow: hidden;
            font-family: 'Segoe UI', sans-serif;
          }

          .stars-container {
            position: absolute;
            inset: 0;
            pointer-events: none;
            z-index: 0;
          }

          .star {
            position: absolute;
            background: white;
            border-radius: 50%;
            animation: twinkle var(--duration) infinite ease-in-out;
          }

          @keyframes twinkle {
            0%, 100% { opacity: 0.3; transform: scale(1); }
            50% { opacity: 1; transform: scale(1.2); }
          }
        `}
      </style>

      <section className="testimonials-wrapper px-6 py-12">
        {/* Twinkling Stars logic from Contact page */}
        <div className="stars-container">
          {[...Array(30)].map((_, i) => (
            <div
              key={i}
              className="star"
              style={{
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                width: `${Math.random() * 3}px`,
                height: `${Math.random() * 3}px`,
                "--duration": `${2 + Math.random() * 3}s`,
              }}
            />
          ))}
        </div>

        <h2 className="text-4xl font-bold text-white text-center mb-12 z-10" style={{ background: 'linear-gradient(to right, #38bdf8, #fff)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
          What People Say
        </h2>

        <div className="relative w-full max-w-4xl h-96 flex items-center justify-center z-10">
          {testimonials.map((t, i) => {
            let offset = i - index;
            if (offset < -Math.floor(testimonials.length / 2)) offset += testimonials.length;
            if (offset > Math.floor(testimonials.length / 2)) offset -= testimonials.length;

            let scale = offset === 0 ? 1 : 0.8;
            let x = offset * 120;
            let opacity = offset === 0 ? 1 : 0.4;
            let zIndex = 10 - Math.abs(offset);

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.8, x: 0 }}
                animate={{ opacity, scale, x, zIndex }}
                transition={{ type: "spring", stiffness: 120, damping: 20 }}
                className="absolute w-80 md:w-96 bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 text-white shadow-2xl flex flex-col items-center"
              >
                <p className="text-lg mb-6 italic text-center text-gray-200">"{t.quote}"</p>
                <img
                  src={t.src}
                  alt={t.name}
                  className="w-20 h-20 rounded-full mb-4 ring-2 ring-sky-400/50 object-cover"
                />
                <h3 className="font-semibold text-xl text-sky-300">{t.name}</h3>
                <p className="text-gray-400 text-sm">{t.designation}</p>
              </motion.div>
            );
          })}
        </div>

        {/* Navigation Buttons */}
        <div className="flex justify-between mt-12 w-48 mx-auto z-10">
          <button
            onClick={prevSlide}
            className="px-6 py-2 bg-white/10 border border-white/20 text-white rounded-full hover:bg-sky-500/50 transition-all duration-300 backdrop-blur-md"
          >
            Prev
          </button>
          <button
            onClick={nextSlide}
            className="px-6 py-2 bg-sky-500/80 text-black font-bold rounded-full hover:bg-white transition-all duration-300"
          >
            Next
          </button>
        </div>
      </section>
    </>
  );
}