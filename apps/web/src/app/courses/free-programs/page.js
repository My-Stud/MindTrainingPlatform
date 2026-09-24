"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Brain, LockKeyhole, PlayCircle, EyeOff, ShieldCheck, Maximize } from "lucide-react";
import Link from "next/link";

export default function FreePrograms() {
  // Mock logged-in state (set to true for demo, but can be toggled to test the gate)
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [isFocused, setIsFocused] = useState(true);
  const [isScreenshotAttempt, setIsScreenshotAttempt] = useState(false);

  // Security measure: blur when window loses focus to deter screenshots
  useEffect(() => {
    const handleFocus = () => setIsFocused(true);
    const handleBlur = () => setIsFocused(false);
    
    // Deterrent for keyboard screenshot shortcuts
    const handleKeyDown = (e) => {
      const isMac = navigator.platform.toUpperCase().indexOf('MAC') >= 0;
      // PrintScreen key, or Cmd+Shift+3, Cmd+Shift+4, Cmd+Shift+5 on Mac, or Windows+Shift+S
      if (
        e.key === "PrintScreen" ||
        (isMac && e.metaKey && e.shiftKey && ["3", "4", "5"].includes(e.key)) ||
        (e.metaKey && e.shiftKey && e.key.toLowerCase() === "s") ||
        (e.ctrlKey && e.key === "p")
      ) {
        setIsScreenshotAttempt(true);
        // Clear clipboard just in case
        navigator.clipboard.writeText("").catch(() => {});
        setTimeout(() => setIsScreenshotAttempt(false), 3000); // Hide for 3 seconds
      }
    };

    // Windows often only fires keyup for the PrintScreen key
    const handleKeyUp = (e) => {
      if (e.key === "PrintScreen") {
        setIsScreenshotAttempt(true);
        // Overwrite clipboard to prevent pasting the screenshot
        navigator.clipboard.writeText("Screenshots are disabled for this content.").catch(() => {});
        setTimeout(() => setIsScreenshotAttempt(false), 3000);
      }
    };

    window.addEventListener("focus", handleFocus);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("focus", handleFocus);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, []);

  const videos = [
    { id: 1, src: "/videos/1.mp4", title: "Free Program 1: Brain Warmup", duration: "5:30" },
    { id: 2, src: "/videos/2.mp4", title: "Free Program 2: Memory Basics", duration: "8:15" },
    { id: 3, src: "/videos/3.mp4", title: "Free Program 3: Focus Fundamentals", duration: "10:45" },
  ];

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white p-8 rounded-3xl shadow-xl shadow-slate-200/50 max-w-md w-full text-center border border-slate-100"
        >
          <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <LockKeyhole className="w-10 h-10 text-orange-500" />
          </div>
          <h1 className="text-2xl font-black text-slate-800 mb-2">Members Only</h1>
          <p className="text-slate-600 mb-8">
            Please sign in to access our free training programs and elevate your mind today.
          </p>
          <div className="flex flex-col gap-3">
            <button 
              onClick={() => setIsLoggedIn(true)} // Mock login action
              className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold transition-colors"
            >
              Sign In (Demo)
            </button>
            <Link href="/" className="text-emerald-600 font-bold hover:underline">
              Return Home
            </Link>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-emerald-700 to-teal-800 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mb-12 shadow-xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Brain className="w-96 h-96 -mt-20 -mr-20" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }} 
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6 text-center md:text-left"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tight">
                Free Training Programs
              </h1>
              <p className="text-emerald-100 text-lg max-w-2xl">
                Kickstart your cognitive journey with these complimentary exercises. Exclusively for our members.
              </p>
            </div>
            
            <div className="flex flex-col items-center gap-3">
               <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-4 py-2 rounded-full border border-white/20 text-sm font-bold">
                 <ShieldCheck className="w-4 h-4 text-emerald-300" />
                 Secure Viewing
               </div>
               {/* Mock Logout button for testing the gate */}
               <button 
                 onClick={() => setIsLoggedIn(false)}
                 className="text-emerald-100 hover:text-white text-xs font-bold underline"
               >
                 Test Sign Out
               </button>
            </div>
          </motion.div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {videos.map((video, idx) => (
            <motion.div 
              key={video.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white rounded-3xl overflow-hidden shadow-lg shadow-slate-200/50 border border-slate-100 flex flex-col group"
            >
              {/* Video Player Container */}
              <div 
                className={`relative aspect-video bg-black select-none transition-opacity duration-75 ${isScreenshotAttempt ? 'opacity-0' : 'opacity-100'}`}
                onContextMenu={(e) => e.preventDefault()} // Security: Disable right-click
                style={{ WebkitUserSelect: 'none', userSelect: 'none', WebkitTouchCallout: 'none' }} // Disable selection
                onDragStart={(e) => e.preventDefault()} // Disable dragging the video element
              >
                {/* Custom Fullscreen Button */}
                <button
                  onClick={(e) => {
                    const container = e.currentTarget.parentElement;
                    if (!document.fullscreenElement) {
                      if (container.requestFullscreen) {
                        container.requestFullscreen().catch(err => console.log(err));
                      } else if (container.webkitRequestFullscreen) {
                        container.webkitRequestFullscreen();
                      }
                    } else {
                      if (document.exitFullscreen) {
                        document.exitFullscreen().catch(err => console.log(err));
                      } else if (document.webkitExitFullscreen) {
                        document.webkitExitFullscreen();
                      }
                    }
                  }}
                  className="absolute top-3 right-3 z-30 p-2 bg-black/40 hover:bg-black/70 text-white rounded-lg backdrop-blur-md transition-all shadow-lg border border-white/10 opacity-0 group-hover:opacity-100 focus:opacity-100"
                  title="Toggle Fullscreen"
                >
                  <Maximize className="w-5 h-5" />
                </button>

                {/* Dynamic Watermark Overlay */}
                <div className="absolute inset-0 z-10 pointer-events-none flex items-center justify-center overflow-hidden opacity-30 mix-blend-overlay">
                  <motion.div 
                    animate={{ 
                      x: [-50, 50, -50],
                      y: [-20, 20, -20],
                      rotate: [-5, 5, -5]
                    }}
                    transition={{ repeat: Infinity, duration: 15, ease: "linear" }}
                    className="text-white font-black text-lg md:text-2xl whitespace-nowrap drop-shadow-lg"
                  >
                    alex@example.com - DO NOT SHARE
                  </motion.div>
                </div>

                {/* Security Overlay for blur */}
                {!isFocused && (
                  <div className="absolute inset-0 z-20 bg-slate-900/80 backdrop-blur-md flex flex-col items-center justify-center text-white p-4 text-center">
                    <EyeOff className="w-12 h-12 mb-2 text-white/50" />
                    <p className="font-bold">Playback Paused</p>
                    <p className="text-sm text-white/70">Click on window to resume</p>
                  </div>
                )}
                
                <video 
                  controls 
                  controlsList="nodownload nofullscreen" // Security: Disable native download and fullscreen
                  disablePictureInPicture // Security: Disable PiP
                  className={`w-full h-full object-contain transition-all duration-300 ${!isFocused ? 'blur-md opacity-50' : ''}`}
                >
                  <source src={video.src} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              </div>

              {/* Video Info */}
              <div className="p-6 flex flex-col flex-grow">
                <div className="flex items-start justify-between gap-4 mb-4">
                  <h3 className="text-xl font-bold text-slate-800 line-clamp-2 group-hover:text-emerald-600 transition-colors">
                    {video.title}
                  </h3>
                </div>
                <div className="mt-auto flex items-center justify-between text-sm font-bold text-slate-500">
                  <span className="flex items-center gap-1.5 bg-slate-100 px-3 py-1 rounded-full">
                    <PlayCircle className="w-4 h-4 text-emerald-600" />
                    {video.duration}
                  </span>
                  <span className="text-xs text-slate-400">Members Only</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
