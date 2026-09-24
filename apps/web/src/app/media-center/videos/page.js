"use client";

import { useState } from "react";
import { Play, X } from "lucide-react";

export default function VideosPage() {
  const [selectedVideo, setSelectedVideo] = useState(null);

  const filenames = [
    "KYRGSTAN.mp4","MALDIVES.mp4","NEPAL.mp4","North korea.mp4","OMAN.mp4","PAKISTAN.mp4","PALAU.mp4",
    "QATAR.mp4","SAUDI.mp4","SINGAPORE.mp4","SRILANKA.mp4","SYRIA.mp4","South korea.mp4","TAIWAN.mp4",
    "TAJIKSTAN.mp4","THAILAND.mp4","TURKEY.mp4","TURKIMENISTAN.mp4","UNITED ARAB EMIRATES.mp4",
    "VIETNAM.mp4","YEMEN.mp4","armenia-1.mp4","azerbaijan-1.mp4","bahrain-1.mp4","bangladesh-1.mp4",
    "bhutan-1.mp4","brunei-1.mp4","cambodia-1.mp4","china-1.mp4","indonesia-1.mp4","iran.mp4",
    "israil.mp4","japan.mp4","jordan.mp4","kazakhstan.mp4","kuwait.mp4","laos_2.mp4","lebanon.mp4",
    "malaysia.mp4","mongolia.mp4","myanmar.mp4"
  ];

  const videos = filenames.map((filename, index) => {
    // Format the title nicely from the filename (e.g. 'North korea.mp4' -> 'North Korea', 'armenia-1.mp4' -> 'Armenia')
    let title = filename.replace(/\.mp4$/i, '').replace(/[-_]\d+$/, '');
    title = title.split(/[ _-]/).map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
    
    return {
      id: index + 1,
      title: title,
      duration: "New",
      category: "Asia",
      poster: "https://images.unsplash.com/photo-1588681664899-f142ff2dc9b1?w=800&q=80",
      videoUrl: `https://Viebrain-Videos.b-cdn.net/ASIA/${filename}`
    };
  });

  return (
    <div className="min-h-screen bg-slate-50 pt-28 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight mb-4">Video Library</h1>
          <p className="text-slate-600 font-medium max-w-2xl mx-auto">
            Watch our collection of expert talks, student testimonials, and scientifically-designed training modules.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {videos.map((video) => (
            <div 
              key={video.id} 
              onClick={() => setSelectedVideo(video)}
              className="group relative rounded-2xl overflow-hidden bg-white shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-slate-100 transition-all duration-500 hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)] hover:-translate-y-2 cursor-pointer"
            >
              {/* Thumbnail Container */}
              <div className="relative aspect-video overflow-hidden">
                <video 
                  src={video.videoUrl + "#t=0.5"} 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 pointer-events-none"
                  preload="metadata"
                  muted
                  playsInline
                />
                <div className="absolute inset-0 bg-slate-900/20 group-hover:bg-slate-900/40 transition-colors duration-500 flex items-center justify-center">
                  <div className="w-16 h-16 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-lg group-hover:scale-110 group-hover:bg-orange-500 group-hover:text-white text-orange-500 transition-all duration-300">
                    <Play className="w-6 h-6 ml-1" fill="currentColor" />
                  </div>
                </div>
                
                {/* Duration Badge */}
                <div className="absolute bottom-3 right-3 bg-slate-900/80 backdrop-blur-md px-2.5 py-1 rounded-lg text-white text-xs font-bold tracking-wide">
                  {video.duration}
                </div>
              </div>
              
              {/* Content Details */}
              <div className="p-5">
                <div className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">
                  {video.category}
                </div>
                <h3 className="text-lg font-bold text-slate-800 leading-tight group-hover:text-orange-600 transition-colors">
                  {video.title}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Video Modal Overlay */}
      {selectedVideo && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 md:p-12">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/90 backdrop-blur-sm transition-opacity"
            onClick={() => setSelectedVideo(null)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative w-full max-w-5xl bg-black rounded-2xl overflow-hidden shadow-2xl z-10 flex flex-col">
            <div className="absolute top-4 right-4 z-20">
              <button 
                onClick={() => setSelectedVideo(null)}
                className="w-10 h-10 bg-black/50 hover:bg-orange-500 text-white rounded-full flex items-center justify-center transition-colors backdrop-blur-md"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="relative aspect-video w-full bg-black">
              {selectedVideo.videoUrl.includes('youtube') || selectedVideo.videoUrl.includes('embed') ? (
                <iframe
                  src={selectedVideo.videoUrl}
                  className="w-full h-full"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  frameBorder="0"
                ></iframe>
              ) : (
                <video 
                  src={selectedVideo.videoUrl} 
                  className="w-full h-full" 
                  controls 
                  autoPlay 
                />
              )}
            </div>
            
            <div className="bg-white p-5 md:p-6">
              <div className="text-sm font-bold text-orange-500 uppercase tracking-wider mb-1">
                {selectedVideo.category}
              </div>
              <h2 className="text-2xl font-black text-slate-800">
                {selectedVideo.title}
              </h2>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}