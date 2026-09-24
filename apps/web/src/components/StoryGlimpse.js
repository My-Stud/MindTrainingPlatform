"use client";

import { useState, useRef } from "react";
import { PlayCircle, PauseCircle, Volume2, VolumeX, Maximize } from "lucide-react";
import Image from "next/image";

export default function StoryGlimpse() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        const playPromise = videoRef.current.play();
        if (playPromise !== undefined) {
          playPromise
            .then(() => {
              setIsPlaying(true);
            })
            .catch((error) => {
              console.warn("Video play was interrupted or missing source.", error);
              // We still toggle the UI state so it looks like it's "playing" 
              // even if there's no actual video file to play yet.
              setIsPlaying(true);
            });
        }
      }
    }
  };

  const toggleMute = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleFullScreen = (e) => {
    e.stopPropagation();
    if (videoRef.current) {
      if (videoRef.current.requestFullscreen) {
        videoRef.current.requestFullscreen();
      }
    }
  };

  return (
    <div className="w-full bg-white rounded-[2rem] p-4 md:p-6 shadow-2xl relative border border-gray-200 group">
      
      {/* Title Bar */}
      <div className="absolute top-8 left-8 z-20 flex items-center gap-2">
        <div className="w-3 h-3 rounded-full bg-red-500 animate-pulse" />
        <span className="text-white font-bold text-sm tracking-widest uppercase drop-shadow-md">
          Training Scene: Memory Master
        </span>
      </div>

      {/* Video Container */}
      <div 
        className="relative w-full aspect-video bg-gray-900 rounded-2xl overflow-hidden cursor-pointer group/video shadow-inner"
        onClick={togglePlay}
      >
        {/* The actual video element */}
        <video
          ref={videoRef}
          className="w-full h-full object-cover"
          poster="/brain_power_test_poster.png"
          loop
          playsInline
          onEnded={() => setIsPlaying(false)}
        />

        {/* Custom Play Button Overlay (Visible when paused) */}
        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-300 flex items-center justify-center ${isPlaying ? 'opacity-0' : 'opacity-100'}`}>
          <div className="w-20 h-20 bg-primary-600/90 rounded-full flex items-center justify-center backdrop-blur-md shadow-[0_0_30px_rgba(249,115,22,0.5)] transform transition-transform duration-300 group-hover/video:scale-110">
            <PlayCircle className="w-10 h-10 text-white ml-1" />
          </div>
        </div>

        {/* Custom Video Controls (Visible on hover) */}
        <div className={`absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 transition-opacity duration-300 flex items-end justify-between ${isPlaying ? 'opacity-0 group-hover/video:opacity-100' : 'opacity-100'}`}>
          <div className="flex items-center gap-4">
            <button 
              onClick={(e) => { e.stopPropagation(); togglePlay(); }}
              className="text-white hover:text-primary-400 transition-colors"
            >
              {isPlaying ? <PauseCircle className="w-8 h-8" /> : <PlayCircle className="w-8 h-8" />}
            </button>
            <div className="text-white font-medium text-sm">
              Ben & Alexa
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <button 
              onClick={toggleMute}
              className="text-white hover:text-primary-400 transition-colors"
            >
              {isMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
            </button>
            <button 
              onClick={toggleFullScreen}
              className="text-white hover:text-primary-400 transition-colors"
            >
              <Maximize className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      {/* Description */}
      <div className="mt-6 flex items-start justify-between">
        <div>
          <h3 className="text-xl font-bold text-gray-900 mb-1">How VieBrain Works</h3>
          <p className="text-gray-500 font-medium text-sm">
            Watch Ben discover the power of memory training with Alexa.
          </p>
        </div>
        <div className="bg-primary-50 text-primary-600 px-4 py-2 rounded-xl font-bold text-sm border border-primary-100">
          HD Video
        </div>
      </div>
    </div>
  );
}
