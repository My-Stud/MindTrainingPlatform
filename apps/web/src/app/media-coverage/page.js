"use client";

import { motion } from "framer-motion";
import { Newspaper, Tv, MonitorPlay, Star, Quote, ArrowRight, Play, X } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { useState } from "react";
import CoverageMap from "@/components/CoverageMap";

export default function MediaCoveragePage() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const articles = [
    {
      title: "Revolutionizing Cognitive Education",
      publisher: "The Daily Chronicle",
      date: "Oct 12, 2023",
      image: "/images/banners/brain_neural_network.png",
      excerpt: "VieBrain is taking the educational sector by storm with its new scientifically-backed cognitive training methodologies."
    },
    {
      title: "How Mind Training is Changing Lives",
      publisher: "Tech Innovation Weekly",
      date: "Aug 05, 2023",
      image: "/images/banners/colorful_kids_learning.png",
      excerpt: "An in-depth look into how Dr. Mallick's approach to memory and focus is transforming student performance."
    },
    {
      title: "The Future of Brain Development",
      publisher: "Global Health Magazine",
      date: "Jan 22, 2024",
      image: "/images/banners/cognitive_interface.png",
      excerpt: "Exploring the neurological benefits of structured brain exercises for all age groups."
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 -mt-20 pb-20 overflow-hidden">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-slate-900 text-white min-h-[500px] md:min-h-[600px] flex flex-col justify-end pb-8 pt-40 mb-16 shadow-lg">
        {/* The new background image with adjusted opacity */}
        <div className="absolute inset-0 bg-[url('/images/media-1.jpg')] bg-cover bg-top opacity-95"></div>
        {/* Gradient overlay from bottom to top to make text readable without blocking the image */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-900/70 to-transparent"></div>
        
        <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/60 border border-slate-600 backdrop-blur-md text-slate-200 font-semibold mb-4">
              <Tv className="w-5 h-5" />
              <span>In The Spotlight</span>
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-black tracking-tight mb-4 leading-tight drop-shadow-lg">
              VieBrain in the <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-amber-400 drop-shadow-sm">Media</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-100 max-w-3xl font-medium drop-shadow-md">
              Discover how our groundbreaking approaches to cognitive development and mind training are making headlines across the nation.
            </p>
          </ScrollReveal>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Featured TV Coverage */}
        <ScrollReveal>
          <div className="mb-24">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-orange-100 text-orange-600 rounded-xl flex items-center justify-center shadow-sm">
                <MonitorPlay className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-800">Featured TV Coverage</h2>
            </div>
            
            <div className="bg-white rounded-3xl p-6 md:p-8 shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-slate-100 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-64 h-64 bg-orange-500/5 rounded-full blur-3xl -mr-20 -mt-20 transition-all duration-700 group-hover:bg-orange-500/10"></div>
              
              <div className="grid md:grid-cols-2 gap-8 items-center relative z-10">
                <div 
                  className="relative aspect-video rounded-2xl overflow-hidden cursor-pointer shadow-lg group/video"
                  onClick={() => setSelectedVideo("cgN4_VkEgME")}
                >
                  <img src="https://img.youtube.com/vi/cgN4_VkEgME/maxresdefault.jpg" alt="Dr. Atal Bihari Mallick Interview" className="w-full h-full object-cover transition-transform duration-700 group-hover/video:scale-105" />
                  <div className="absolute inset-0 bg-slate-900/30 flex items-center justify-center transition-colors group-hover/video:bg-slate-900/50">
                    <div className="w-20 h-20 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-orange-600 shadow-[0_0_30px_rgba(249,115,22,0.4)] transform transition-transform group-hover/video:scale-110">
                      <Play className="w-8 h-8 ml-2" fill="currentColor" />
                    </div>
                  </div>
                  <div className="absolute top-4 left-4 bg-red-600 text-white text-[10px] sm:text-xs font-black px-3 py-1.5 rounded-full uppercase tracking-widest shadow-md">
                    History TV18 Exclusive
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="inline-flex items-center gap-2 text-orange-600 font-bold tracking-widest uppercase text-xs bg-orange-50 px-3 py-1.5 rounded-full">
                    <Star className="w-3.5 h-3.5 fill-orange-600" /> National Broadcast
                  </div>
                  <h3 className="text-3xl font-black text-slate-800 leading-tight">Dr. Atal Bihari Mallick on History TV18</h3>
                  <p className="text-slate-600 text-lg leading-relaxed">
                    Watch our founder discuss the incredible potential of the human brain, the science behind our training methodologies, and how VieBrain is shaping the future of cognitive education on national television.
                  </p>
                  <blockquote className="border-l-4 border-orange-500 pl-5 py-3 text-slate-700 font-medium italic bg-gradient-to-r from-orange-50/80 to-transparent rounded-r-xl">
                    <Quote className="w-5 h-5 text-orange-400 mb-2" />
                    "The human mind is capable of extraordinary feats when given the right stimulus and training framework."
                  </blockquote>
                </div>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* Global Coverage Footprint Map */}
        <ScrollReveal>
          <CoverageMap />
        </ScrollReveal>

        {/* Press & News Articles */}
        <ScrollReveal>
          <div>
            <div className="flex items-center gap-4 mb-8">
              <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
                <Newspaper className="w-6 h-6" />
              </div>
              <h2 className="text-3xl font-black text-slate-800">Press & Articles</h2>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {articles.map((article, index) => (
                <div key={index} className="bg-white rounded-2xl overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-slate-100 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(16,185,129,0.1)] hover:-translate-y-2 flex flex-col group cursor-pointer">
                  <div className="relative h-56 overflow-hidden">
                    <img src={article.image} alt={article.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3.5 py-1.5 rounded-full text-xs font-black text-slate-700 shadow-sm uppercase tracking-wide">
                      {article.publisher}
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <div className="text-xs font-bold text-emerald-600 mb-3 tracking-widest uppercase">{article.date}</div>
                    <h3 className="text-xl font-black text-slate-800 mb-3 group-hover:text-emerald-600 transition-colors leading-snug">{article.title}</h3>
                    <p className="text-slate-600 mb-6 flex-1 leading-relaxed">{article.excerpt}</p>
                    <div className="inline-flex items-center gap-2 text-emerald-600 font-bold group-hover:text-emerald-700 transition-colors w-fit">
                      Read Full Article 
                      <ArrowRight className="w-4 h-4 transform transition-transform group-hover:translate-x-1" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          <div className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm transition-opacity" onClick={() => setSelectedVideo(null)}></div>
          
          <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl z-10 border border-slate-800">
            <button 
              onClick={() => setSelectedVideo(null)}
              className="absolute top-4 right-4 z-20 w-12 h-12 bg-white/10 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-all duration-300 backdrop-blur-md"
            >
              <X className="w-6 h-6" />
            </button>
            
            <div className="relative aspect-video w-full bg-black">
              <iframe
                src={`https://www.youtube.com/embed/${selectedVideo}?autoplay=1`}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                frameBorder="0"
              ></iframe>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
