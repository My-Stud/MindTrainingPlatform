"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Globe, Tv } from "lucide-react";
import { useState, useEffect } from "react";

export default function CoverageMap() {
  const [activeIndex, setActiveIndex] = useState(0);

  // Using standard Colorful Google Map Tiles perfectly framed around India
  // Coordinates are perfectly mapped to Web Mercator projection so they perfectly align with the map.
  const locations = [
    { id: 1, name: "Aaj Tak", city: "New Delhi", logo: "https://www.google.com/s2/favicons?domain=aajtak.in&sz=128", top: "44.8%", left: "55.1%" },
    { id: 2, name: "Zee News", city: "Noida", logo: [
      "https://upload.wikimedia.org/wikipedia/commons/thumb/2/27/Zee_News_Logo_2025.svg/512px-Zee_News_Logo_2025.svg.png",
      "https://english.cdn.zeenews.com/static/apprun/en/images/zee-news-logo.png",
      "https://english.cdn.zeenews.com/images/logo/zeenewslogo_nav.png",
      "https://exchange4media.gumlet.io/news-photo/114979-ZeeNews.jpg",
      "https://images.livemint.com/img/2021/09/14/600x338/Zee_news_1631620953457_1631620953646.jpg",
      "https://www.google.com/s2/favicons?domain=zeenews.india.com&sz=128"
    ], top: "45.1%", left: "55.5%" },
    { id: 3, name: "History TV18", city: "Mumbai", logo: "https://www.google.com/s2/favicons?domain=historyindia.com&sz=128", top: "75.7%", left: "49.7%" },
    { id: 4, name: "Odisha TV", city: "Bhubaneswar", logo: "https://www.google.com/s2/favicons?domain=odishatv.in&sz=128", top: "72.0%", left: "66.0%" },
    { id: 5, name: "The Pioneer", city: "Lucknow", logo: "https://www.google.com/s2/favicons?domain=dailypioneer.com&sz=128", top: "50.7%", left: "59.8%" },
    { id: 6, name: "Sadhna News", city: "Bhopal", logo: "https://www.google.com/s2/favicons?domain=sadhnanews.in&sz=128", top: "62.3%", left: "55.4%" },
    { id: 7, name: "DD News", city: "New Delhi", logo: "https://www.google.com/s2/favicons?domain=ddnews.gov.in&sz=128", top: "44.5%", left: "54.8%" },
    { id: 8, name: "India News", city: "Noida", logo: "https://www.google.com/s2/favicons?domain=indianews.in&sz=128", top: "45.4%", left: "56.0%" },
    { id: 9, name: "Times of India", city: "Mumbai", logo: "https://www.google.com/s2/favicons?domain=timesofindia.indiatimes.com&sz=128", top: "76.0%", left: "49.2%" },
    { id: 10, name: "Indian Express", city: "Pune", logo: "https://www.google.com/s2/favicons?domain=indianexpress.com&sz=128", top: "77.6%", left: "50.8%" },
    { id: 11, name: "ETV", city: "Hyderabad", logo: "https://www.google.com/s2/favicons?domain=etvbharat.com&sz=128", top: "81.0%", left: "56.7%" },
    { id: 12, name: "Nandighosh TV", city: "Bhubaneswar", logo: "https://www.google.com/s2/favicons?domain=nandighoshtv.com&sz=128", top: "72.4%", left: "66.5%" },
    { id: 13, name: "Kanak News", city: "Bhubaneswar", logo: "https://www.google.com/s2/favicons?domain=kanaknews.com&sz=128", top: "71.6%", left: "65.5%" },
    { id: 14, name: "News7", city: "Bhubaneswar", logo: "https://www.google.com/s2/favicons?domain=prameyanews7.com&sz=128", top: "71.6%", left: "66.5%" },
    { id: 15, name: "News18", city: "Bhubaneswar", logo: "https://www.google.com/s2/favicons?domain=news18.com&sz=128", top: "72.4%", left: "65.5%" },
  ];

  // Rotate and zoom to a new location every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setActiveIndex((current) => (current + 1) % locations.length);
    }, 5000);
    return () => clearInterval(timer);
  }, [locations.length]);

  const activeLoc = locations[activeIndex];
  
  // Magic math to perfectly center the active location while zooming
  const zoomScale = 2.5; 
  const targetPanX = 50 - (parseFloat(activeLoc.left) * zoomScale);
  const targetPanY = 50 - (parseFloat(activeLoc.top) * zoomScale);

  // Clamp the panning so we never see the edges of the map!
  // At 2.5x scale, the translation must be between -150% and 0% to completely cover the 100% screen.
  const panX = Math.max(-150, Math.min(0, targetPanX));
  const panY = Math.max(-150, Math.min(0, targetPanY));

  return (
    <div className="mb-24 relative">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-xl flex items-center justify-center shadow-sm">
          <Globe className="w-6 h-6" />
        </div>
        <h2 className="text-3xl font-black text-slate-800">National Coverage Footprint</h2>
      </div>

      <div className="relative w-full aspect-[4/3] md:aspect-[21/9] bg-[#eef2f6] rounded-3xl overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-slate-200">
        
        {/* The Map Container - This pans and zooms around the screen! */}
        <motion.div 
          animate={{ 
            x: `${panX}%`, 
            y: `${panY}%`, 
            scale: zoomScale 
          }}
          transition={{ duration: 1.8, ease: [0.25, 0.1, 0.25, 1] }}
          className="absolute inset-0 w-full h-full origin-top-left"
        >
          {/* Extremely Colorful and Bright Map Background */}
          {/* Using a 7x3 grid of standard colorful Google Map tiles framed perfectly on India. */}
          <div className="absolute inset-0 w-full h-full grid grid-cols-7 grid-rows-3 opacity-100">
            {[12, 13, 14].map(y => (
              [19, 20, 21, 22, 23, 24, 25].map(x => (
                <img 
                  key={`${x}-${y}`}
                  src={`https://mt1.google.com/vt/lyrs=m&x=${x}&y=${y}&z=5`} 
                  className="w-full h-full object-fill" 
                  alt="" 
                />
              ))
            ))}
          </div>

          {/* The Map Markers */}
          {locations.map((loc, idx) => {
            const isActive = idx === activeIndex;
            
            return (
              <div
                key={loc.id}
                className={`absolute ${isActive ? 'z-40' : 'z-10'} -translate-x-1/2 -translate-y-1/2`}
                style={{ top: loc.top, left: loc.left }}
              >
                {/* 
                  Counter-scale the marker! 
                  Since the whole map zooms in (x2.5), we shrink the markers down by the same amount 
                  so they don't look gigantic on the screen. The active one is kept slightly larger.
                */}
                <motion.div 
                  animate={{ 
                    scale: isActive ? 1.0 / zoomScale : 0.6 / zoomScale, 
                    opacity: isActive ? 1 : 0.6 
                  }}
                  transition={{ duration: 1.2 }}
                  className="relative flex flex-col items-center justify-center origin-center"
                >
                  
                  {/* Original Logo Badge */}
                  <div 
                    className={`relative flex items-center justify-center w-14 h-14 md:w-20 md:h-20 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.9)] border-[3px] ${isActive ? 'border-white bg-white' : 'border-white/50 bg-white/80'} overflow-hidden cursor-pointer transition-colors`}
                    onClick={() => setActiveIndex(idx)}
                  >
                    <img 
                      src={Array.isArray(loc.logo) ? loc.logo[0] : loc.logo} 
                      alt={loc.name} 
                      className="w-full h-full object-contain p-2 md:p-3 relative z-10 bg-white rounded-full" 
                      referrerPolicy="no-referrer"
                      onError={(e) => {
                        if (Array.isArray(loc.logo)) {
                          let currentIdx = parseInt(e.target.dataset.fallbackIdx || "1");
                          if (currentIdx < loc.logo.length) {
                            e.target.src = loc.logo[currentIdx];
                            e.target.dataset.fallbackIdx = currentIdx + 1;
                            return;
                          }
                        }
                        e.target.style.display = 'none';
                        e.target.nextElementSibling.style.display = 'flex';
                      }}
                    />
                    {/* Fallback Icon just in case */}
                    <div className="hidden flex-col items-center justify-center text-slate-400 absolute inset-0 z-0">
                      <Tv className="w-5 h-5 md:w-8 md:h-8" />
                    </div>
                    
                    {/* Inner glowing pulse for active logo */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full shadow-[inset_0_0_30px_rgba(59,130,246,0.5)] animate-pulse pointer-events-none"></div>
                    )}
                  </div>
                  
                  {/* Pulsing radar rings emitted from the active marker */}
                  {isActive && (
                    <>
                      <div className="absolute w-28 h-28 md:w-40 md:h-40 border-2 border-blue-400 rounded-full opacity-0 animate-[ping_2s_ease-out_infinite] pointer-events-none"></div>
                      <div className="absolute w-40 h-40 md:w-56 md:h-56 border border-blue-300 rounded-full opacity-0 animate-[ping_3s_ease-out_infinite] pointer-events-none delay-500"></div>
                    </>
                  )}

                  {/* Floating Info Panel - Zooming in reveals this panel */}
                  <AnimatePresence>
                    {isActive && (
                      <motion.div 
                        initial={{ opacity: 0, y: 15, scale: 0.8 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 15, scale: 0.8 }}
                        className="absolute top-full mt-6 left-1/2 -translate-x-1/2 z-50 pointer-events-none"
                      >
                        <div className="bg-white/95 backdrop-blur-xl px-6 py-4 rounded-2xl shadow-[0_20px_60px_rgba(0,0,0,0.4)] border border-slate-200 flex flex-col items-center min-w-max">
                          <span className="text-slate-800 font-black text-xl md:text-2xl whitespace-nowrap tracking-wide drop-shadow-lg">{loc.name}</span>
                          <span className="text-blue-600 font-bold text-xs md:text-sm uppercase tracking-widest mt-1">{loc.city}</span>
                          <div className="absolute bottom-full w-0.5 h-6 bg-gradient-to-t from-blue-500 to-transparent"></div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>

                </motion.div>
              </div>
            );
          })}
        </motion.div>

        {/* Soft vignette shadow around the edges of the map container */}
        <div className="absolute inset-0 shadow-[inset_0_0_100px_rgba(2,6,23,0.5)] pointer-events-none z-20"></div>

        {/* Overlay Stats - Fixed to the screen, independent of panning map */}
        <div className="absolute bottom-6 left-6 md:bottom-8 md:left-8 bg-white/90 backdrop-blur-md border border-slate-200 p-5 rounded-2xl hidden sm:block shadow-2xl z-30">
          <div className="text-3xl md:text-4xl font-black text-blue-600 mb-1">50+</div>
          <div className="text-slate-500 font-bold text-[10px] md:text-xs uppercase tracking-widest">Media Features</div>
        </div>

      </div>
    </div>
  );
}
