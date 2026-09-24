"use client";

import Link from "next/link";
import { Trophy, Play } from "lucide-react";
import { motion } from "framer-motion";
import ScrollReveal from "./ScrollReveal";

const thumbnails = [
  "https://img.youtube.com/vi/cgN4_VkEgME/hqdefault.jpg",
  "https://img.youtube.com/vi/wH7wYNZ7ZLc/hqdefault.jpg",
  "https://img.youtube.com/vi/Kdy9PtTrrn8/hqdefault.jpg",
  "https://img.youtube.com/vi/cgN4_VkEgME/hqdefault.jpg",
  "https://img.youtube.com/vi/wH7wYNZ7ZLc/hqdefault.jpg",
  "https://img.youtube.com/vi/Kdy9PtTrrn8/hqdefault.jpg",
  "https://img.youtube.com/vi/cgN4_VkEgME/hqdefault.jpg",
  "https://img.youtube.com/vi/wH7wYNZ7ZLc/hqdefault.jpg",
  "https://img.youtube.com/vi/Kdy9PtTrrn8/hqdefault.jpg",
  "https://img.youtube.com/vi/cgN4_VkEgME/hqdefault.jpg",
  "https://img.youtube.com/vi/wH7wYNZ7ZLc/hqdefault.jpg",
  "https://img.youtube.com/vi/Kdy9PtTrrn8/hqdefault.jpg",
];

export default function MegaMilestoneGlimpse() {
  return (
    <ScrollReveal className="relative w-full rounded-[3rem] overflow-hidden group cursor-pointer border border-gray-100 shadow-2xl mt-32 mb-16">
      <Link href="/mega-milestone" className="block w-full h-full relative">
        {/* Background Image */}
        <div className="absolute inset-0 bg-emerald-100 transition-colors duration-500 group-hover:bg-emerald-200" />
        
        {/* Content */}
        <div className="relative z-10 p-6 md:p-10 flex flex-col xl:flex-row items-center gap-8 overflow-hidden w-full">
          <div className="w-full xl:w-[25%] flex-shrink-0 relative z-20">
            <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full bg-orange-500/20 text-orange-400 font-bold text-sm border border-orange-500/30 mb-6 backdrop-blur-md">
              <Trophy className="w-4 h-4" />
              <span>Featured Collection</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-emerald-700 mb-6 leading-tight">
              Witness Our <br/>
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-500">
                Mega Milestones
              </span>
            </h2>
            <p className="text-base text-gray-600 font-medium leading-relaxed">
              Watch real-world demonstrations of advanced mind training in action. Explore our curated video collection showcasing extraordinary cognitive capabilities achieved by our students.
            </p>
          </div>
          
          {/* Animated Thumbnails Marquee */}
          <div className="relative w-full xl:w-[75%] h-40 sm:h-48 overflow-hidden rounded-2xl flex items-center">
            {/* Left and Right Fade overlays for seamless effect */}
            <div className="absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-emerald-100 to-transparent z-10 pointer-events-none rounded-l-2xl group-hover:from-emerald-200 transition-colors duration-500"></div>
            <div className="absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-emerald-100 to-transparent z-10 pointer-events-none rounded-r-2xl group-hover:from-emerald-200 transition-colors duration-500"></div>
            
            <motion.div 
              className="flex gap-4 absolute left-0"
              animate={{ x: [0, -720] }}
              transition={{ repeat: Infinity, ease: "linear", duration: 8 }}
            >
              {thumbnails.map((src, i) => (
                <div key={i} className="relative w-56 h-36 sm:h-40 rounded-2xl overflow-hidden flex-shrink-0 shadow-xl border border-gray-200 group-hover:border-orange-500/60 transition-colors duration-500">
                  <img src={src} alt="thumbnail" className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-900/40">
                    <div className="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center group-hover:bg-orange-500 transition-colors duration-500 shadow-xl group-hover:scale-110">
                      <Play className="w-6 h-6 text-white ml-1" fill="currentColor" />
                    </div>
                  </div>
                </div>
              ))}
            </motion.div>
          </div>

        </div>
      </Link>
    </ScrollReveal>
  );
}
