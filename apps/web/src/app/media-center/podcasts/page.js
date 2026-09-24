"use client";

import { useState } from "react";
import { Play, X, Headphones, Mic, Radio, Volume2 } from "lucide-react";
import Image from "next/image";

export default function PodcastsPage() {
  const [selectedPodcast, setSelectedPodcast] = useState(null);

  const podcasts = [
    {
      id: 1,
      title: "Ama Atithi - Kanak News",
      category: "News Interview",
      duration: "49 min",
      videoUrl: "/podcasts/Ama Atithi ｜ In Conversation With Memory Trainer, Neurobic Expert Dr Atal Bihari Mallick｜ Kanak News [-GIVkqUP81w].mp4"
    },
    {
      id: 2,
      title: "O1 Chatshow Ep 2",
      category: "Chatshow",
      duration: "75 min",
      videoUrl: "/podcasts/Dr. Atal Bihari Mallick O1 Chatshow Ep 2 Seg 1 [6o3qDCDtxFI].mp4"
    },
    {
      id: 3,
      title: "Motivational Lecture No. 43",
      category: "Lecture",
      duration: "148 min",
      videoUrl: "/podcasts/Motivational Lecture No.43.by Dr. Atal Bihari Mallick, Inventor, Author and Brain Trick Trainer [gMQEpCzFTdQ].mp4"
    },
    {
      id: 4,
      title: "Pranam Odisha Guest",
      category: "TV Appearance",
      duration: "181 min",
      videoUrl: "/podcasts/Today's Guest In Pranam Odisha： Author, International Psychologist Dr. Atal Bihari Mallick [Kdy9PtTrrn8].mp4"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-16">
      
      {/* Banner Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-16">
        <div className="relative w-full h-[250px] md:h-[350px] rounded-[2rem] overflow-hidden shadow-2xl">
          <Image 
            src="/images/banners/dr_atal_bihari_mallick.png" 
            alt="Podcast Banner" 
            fill
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/80 via-emerald-900/50 to-orange-900/60 flex items-center">
            <div className="px-8 md:px-16 w-full text-center md:text-left">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/20 backdrop-blur-md text-white font-semibold mb-4 border border-white/30">
                <Radio className="w-5 h-5 text-orange-400 animate-pulse" />
                Now Streaming
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-xl mb-4">
                Podcast <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-400 to-orange-300">Archive</span>
              </h1>
              <p className="text-emerald-50 text-lg max-w-xl hidden md:block">
                Listen to expert interviews, inspirational lectures, and deep dives into the science of neurobics with Dr. Atal Bihari Mallick.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {podcasts.map((podcast, index) => (
            <div 
              key={podcast.id} 
              onClick={() => setSelectedPodcast(podcast)}
              className="group relative bg-white rounded-3xl p-6 flex flex-col sm:flex-row items-center gap-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-slate-100 cursor-pointer overflow-hidden"
            >
              {/* Background Decoration */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-50 to-emerald-50 rounded-bl-full -z-10 group-hover:scale-110 transition-transform duration-500"></div>
              
              {/* Audio Art / Play Button */}
              <div className="relative w-full sm:w-40 h-40 shrink-0 rounded-2xl bg-gradient-to-br from-emerald-600 to-emerald-800 shadow-inner flex flex-col items-center justify-center overflow-hidden">
                {/* Simulated Audio Wave */}
                <div className="absolute inset-0 flex items-center justify-center gap-1 opacity-20 group-hover:opacity-40 transition-opacity">
                  {[...Array(7)].map((_, i) => (
                    <div key={i} className={`w-2 bg-white rounded-full ${index % 2 === 0 ? 'animate-pulse' : 'animate-bounce'}`} style={{ height: `${Math.random() * 40 + 20}%`, animationDelay: `${i * 0.1}s` }}></div>
                  ))}
                </div>
                
                <div className="w-16 h-16 rounded-full bg-white text-emerald-600 flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white transition-all duration-300 z-10">
                  <Play className="w-6 h-6 ml-1" fill="currentColor" />
                </div>
                
                <div className="absolute bottom-3 right-3 text-white/80 flex items-center gap-1 text-xs font-bold">
                  <Volume2 className="w-3 h-3" /> {podcast.duration}
                </div>
              </div>
              
              {/* Text Content */}
              <div className="flex-1 text-center sm:text-left">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-100 text-orange-600 text-xs font-black uppercase tracking-wider mb-3">
                  <Mic className="w-3.5 h-3.5" />
                  {podcast.category}
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-slate-800 leading-tight mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                  {podcast.title}
                </h3>
                <p className="text-slate-500 text-sm font-medium">
                  Tap to play this exclusive episode.
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      {selectedPodcast && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/95 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedPodcast(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-4xl bg-black rounded-3xl overflow-hidden shadow-2xl z-10 flex flex-col animate-in fade-in zoom-in duration-300 border border-slate-800">
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setSelectedPodcast(null)}
                className="w-10 h-10 bg-white/10 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-all backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative w-full bg-black flex items-center justify-center">
              <video 
                src={selectedPodcast.videoUrl}
                controls
                autoPlay
                className="w-full max-h-[60vh] outline-none"
              >
                Your browser does not support the video tag.
              </video>
            </div>
            
            <div className="bg-white p-6 md:p-8 flex items-center gap-6 border-t-4 border-orange-500">
              <div className="hidden sm:flex w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl items-center justify-center shrink-0">
                <Headphones className="w-8 h-8" />
              </div>
              <div>
                <div className="text-sm font-bold text-emerald-600 uppercase tracking-widest mb-1 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  {selectedPodcast.category}
                </div>
                <h2 className="text-2xl md:text-3xl font-black text-slate-800">
                  {selectedPodcast.title}
                </h2>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
