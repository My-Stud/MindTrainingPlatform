"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Award, Trophy, Star, X, RotateCcw } from "lucide-react";
import Image from "next/image";
import { rotateImageAction } from "../actions";

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } }
};

export default function AchievementsClient({ achievements }) {
  const [selectedImage, setSelectedImage] = useState(null);
  const [rotation, setRotation] = useState(0);
  const [isSaving, setIsSaving] = useState(false);

  // Reset rotation when a new image is selected
  useEffect(() => {
    setRotation(0);
  }, [selectedImage]);

  // Close lightbox on escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setSelectedImage(null);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16 text-center">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
          className="inline-flex items-center justify-center w-20 h-20 bg-emerald-100 rounded-full mb-6 text-emerald-600 shadow-sm border border-emerald-200"
        >
          <Award className="w-10 h-10" />
        </motion.div>
        
        <motion.h1 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight mb-6"
        >
          Our <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-500">Achievements</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium"
        >
          Celebrating a legacy of excellence. Explore our curated collection of certificates and awards, showcasing our dedication to revolutionizing cognitive training.
        </motion.p>
      </div>

      {/* Gallery Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        <div className="absolute top-0 left-0 w-64 h-64 bg-emerald-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob pointer-events-none"></div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-teal-300 rounded-full mix-blend-multiply filter blur-[128px] opacity-20 animate-blob animation-delay-2000 pointer-events-none"></div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 relative z-10"
        >
          {achievements.map((achievement) => (
            <motion.div 
              key={achievement.id}
              variants={itemVariants}
              whileHover={{ y: -8, scale: 1.02 }}
              onClick={() => setSelectedImage(achievement)}
              className="group relative aspect-[4/3] rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 bg-white border border-slate-200 cursor-pointer"
            >
              <div className="absolute inset-0 bg-emerald-900/0 group-hover:bg-emerald-900/10 transition-colors duration-300 z-10"></div>
              
              <Image 
                src={achievement.src}
                alt={achievement.alt}
                fill
                className="object-contain p-2 transform group-hover:scale-105 transition-transform duration-500"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              
              {/* Hover Badge */}
              <div className="absolute top-4 right-4 z-20 opacity-0 group-hover:opacity-100 transform translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                <div className="bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg text-emerald-600">
                  <Star className="w-5 h-5 fill-current" />
                </div>
              </div>

              {/* Certificate Number overlay */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-20">
                <p className="text-white font-bold tracking-wide flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-yellow-400" />
                  Certificate #{achievement.id}
                </p>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </div>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 md:p-8 cursor-pointer"
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="relative w-full max-w-5xl h-[80vh] bg-transparent rounded-2xl overflow-hidden cursor-default flex flex-col items-center justify-center"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Toolbar */}
              <div className="absolute top-4 right-4 z-50 flex gap-3">
                {rotation !== 0 && (
                  <button 
                    onClick={async (e) => {
                      e.stopPropagation();
                      setIsSaving(true);
                      await rotateImageAction(selectedImage.src, rotation);
                      setRotation(0);
                      setIsSaving(false);
                      window.location.reload();
                    }}
                    disabled={isSaving}
                    className="bg-emerald-600 hover:bg-emerald-500 p-2 px-4 rounded-full shadow-lg transition-colors text-white font-bold text-sm flex items-center justify-center disabled:opacity-50"
                  >
                    {isSaving ? "Saving..." : "Save"}
                  </button>
                )}
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    setRotation(r => r - 90);
                  }}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors text-white flex items-center justify-center"
                  title="Rotate Left"
                >
                  <RotateCcw className="w-6 h-6" />
                </button>
                <button 
                  onClick={() => setSelectedImage(null)}
                  className="bg-white/10 hover:bg-white/20 p-2 rounded-full backdrop-blur-md transition-colors text-white flex items-center justify-center"
                  title="Close"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>
              
              {/* Image Container */}
              <motion.div 
                animate={{ rotate: rotation }}
                transition={{ type: "spring", damping: 20, stiffness: 200 }}
                className="relative w-full h-full flex items-center justify-center"
              >
                <Image 
                  src={selectedImage.src}
                  alt={selectedImage.alt}
                  fill
                  className="object-contain"
                  sizes="100vw"
                  priority
                />
              </motion.div>
              
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-black/90 via-black/50 to-transparent text-white pointer-events-none">
                <h3 className="text-2xl font-bold flex items-center gap-3">
                  <Award className="w-7 h-7 text-emerald-400" />
                  Certificate #{selectedImage.id}
                </h3>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
