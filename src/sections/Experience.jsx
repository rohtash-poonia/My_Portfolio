import React from "react";
import Background from "../components/background";
import { motion } from "framer-motion";

const experiences = [
  {
    id: 1,
    role: "B.Tech - Computer Science And Engineering",
    company: "Samrat Ashok Technological Institute",
    period: "May 2023 - Mar 2027",
  },
  {
    id: 2,
    role: "Joint Entrance Examination",
    company: "National Testing Agency",
    period: "Feb-2022",
  },
  {
    id: 3,
    role: "Higher Secondary Education",
    company: "Maa Sharda Vidyalaya",
    period: "Mar 2021 - Apr 2022",
  },
];

export default function Experience() {
  return (
    <section
      id="experience"
      className="relative w-full min-h-screen overflow-hidden bg-black text-white flex flex-col items-center px-6 py-12"
      style={{ transform: "translateZ(0)" }} // GPU trigger
    >
      {/* 🔥 Home-style Background */}
      <Background />

      <h2 className="text-4xl font-bold mb-12 text-center z-10 relative">
        My Education
      </h2>

      <div className="relative w-full max-w-5xl z-10">
        {/* Vertical Line */}
        <div className="absolute left-1/2 transform -translate-x-1/2 top-0 bottom-0 w-1 bg-gray-800 rounded-full" />

        {experiences.map((exp, idx) => {
          const isLeft = idx % 2 !== 0;

          return (
            <div key={exp.id} className="relative w-full mb-24">
              {/* Sticky Card */}
              <motion.div
                className={`w-1/2 p-6 rounded-2xl border border-white/20
                  bg-gradient-to-br from-white/10 via-white/5 to-white/10
                  backdrop-blur-[16px] shadow-lg sticky top-1/4
                  ${isLeft ? "ml-0" : "ml-auto"}
                `}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.5 }}
                transition={{ duration: 0.6, delay: idx * 0.3, type: "spring", stiffness: 70, damping: 20 }}
              >
                <h3 className="text-xl font-semibold mb-1">{exp.role}</h3>
                <p className="text-blue-300 mb-1">{exp.company}</p>
                <p className="text-blue-400 text-sm">{exp.period}</p>
              </motion.div>

              {/* Circle on line */}
              <div className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-red-500 rounded-full border-2 border-white animate-pulse" />
            </div>
          );
        })}
      </div>
    </section>
  );
}