"use client";

import { useState, useEffect } from "react";
import { Brain } from "lucide-react";
import { motion } from "framer-motion";

export default function AnimatedBrain() {
  const [particles, setParticles] = useState([]);

  const brainParts = [
    "Hippocampus",
    "Amygdala",
    "Prefrontal Cortex",
    "Thalamus",
    "Hypothalamus",
    "Basal Ganglia",
    "Cerebellum"
  ];

  useEffect(() => {
    // Generate random particle values only on the client to avoid SSR hydration mismatch
    const generatedParticles = [...Array(15)].map(() => ({
      initialX: Math.random() * 300 - 150,
      initialY: Math.random() * 300 - 150,
      animateX: Math.random() * 300 - 150,
      animateY: Math.random() * 300 - 150,
      duration: Math.random() * 5 + 5,
      delay: Math.random() * 2,
    }));
    setParticles(generatedParticles);
  }, []);

  return (
    <div className="relative w-full aspect-square max-w-lg mx-auto flex items-center justify-center pointer-events-none">
      {/* Background Glow */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div 
          animate={{ 
            scale: [1, 1.1, 1],
            opacity: [0.3, 0.6, 0.3]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="w-[80%] h-[80%] bg-gradient-to-tr from-emerald-200/40 via-primary-200/40 to-orange-200/40 rounded-full blur-3xl"
        />
      </div>

      {/* Floating Particles (Neural Network Nodes) */}
      {particles.map((p, i) => (
        <motion.div
          key={i}
          initial={{ 
            x: p.initialX, 
            y: p.initialY,
            opacity: 0
          }}
          animate={{ 
            x: p.animateX,
            y: p.animateY,
            opacity: [0, 1, 0]
          }}
          transition={{ 
            duration: p.duration, 
            repeat: Infinity, 
            ease: "linear",
            delay: p.delay
          }}
          className="absolute w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]"
        />
      ))}

      {/* Rotating Neural Lines */}
      <motion.svg 
        animate={{ rotate: 360 }}
        transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
        className="absolute inset-0 w-full h-full opacity-20" 
        viewBox="0 0 100 100"
      >
        <circle cx="50" cy="50" r="40" stroke="currentColor" className="text-primary-500" strokeWidth="0.5" fill="none" strokeDasharray="4 4" />
        <circle cx="50" cy="50" r="30" stroke="currentColor" className="text-emerald-500" strokeWidth="0.5" fill="none" strokeDasharray="2 2" />
        <path d="M10,50 L90,50 M50,10 L50,90 M20,20 L80,80 M20,80 L80,20" stroke="currentColor" className="text-orange-400" strokeWidth="0.2" />
      </motion.svg>

      {/* Brain Part Labels coming from center */}
      {brainParts.map((part, index) => {
        const angle = (index / brainParts.length) * 360 - 90; // Start at top
        const angleRad = (angle * Math.PI) / 180;
        const radius = 160; // Distance to travel
        const targetX = Math.cos(angleRad) * radius;
        const targetY = Math.sin(angleRad) * radius;
        
        // Stagger the emission
        const duration = 7; // Total time for one cycle
        const delay = index * (duration / brainParts.length);

        return (
          <motion.div
            key={part}
            className="absolute top-1/2 left-1/2 z-20 flex items-center justify-center pointer-events-none"
            initial={{ x: "-50%", y: "-50%", opacity: 0, scale: 0 }}
            animate={{ 
              x: [`-50%`, `calc(-50% + ${targetX * 0.4}px)`, `calc(-50% + ${targetX}px)`, `calc(-50% + ${targetX * 1.1}px)`],
              y: [`-50%`, `calc(-50% + ${targetY * 0.4}px)`, `calc(-50% + ${targetY}px)`, `calc(-50% + ${targetY * 1.1}px)`],
              opacity: [0, 1, 1, 0],
              scale: [0.5, 1, 1, 0.8]
            }}
            transition={{
              duration: duration,
              repeat: Infinity,
              ease: "easeOut",
              delay: delay,
              times: [0, 0.2, 0.8, 1]
            }}
          >
            <span className="text-[10px] sm:text-xs md:text-sm font-bold text-emerald-700 bg-white/90 backdrop-blur-md px-3 py-1.5 rounded-full shadow-[0_4px_10px_rgba(0,0,0,0.1)] border border-emerald-100/50 whitespace-nowrap">
              {part}
            </span>
          </motion.div>
        );
      })}

      {/* Center Brain Element */}
      <motion.div 
        animate={{ y: [-10, 10, -10] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="relative z-10 w-48 h-48 md:w-64 md:h-64 bg-white/80 backdrop-blur-xl rounded-full border-4 border-white shadow-[0_20px_50px_rgba(0,0,0,0.1)] flex items-center justify-center"
      >
        {/* Pulsing rings */}
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
          className="absolute inset-0 rounded-full border-2 border-emerald-400"
        />
        <motion.div 
          animate={{ scale: [1, 1.5], opacity: [0.5, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 1 }}
          className="absolute inset-0 rounded-full border-2 border-primary-400"
        />

        <Brain className="w-24 h-24 md:w-32 md:h-32 text-emerald-500 drop-shadow-md" />
      </motion.div>
    </div>
  );
}
