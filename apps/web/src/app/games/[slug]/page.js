"use client";

import { useState, useEffect, use, useRef } from "react";
import Link from "next/link";
import { ArrowLeft, Maximize } from "lucide-react";
import InGameAdminConfig from "@/components/InGameAdminConfig";
import { getApiBaseValue } from "@/api/questions";

export default function DynamicGamePage({ params }) {
  const unwrappedParams = typeof params?.then === 'function' ? use(params) : params;
  const slug = unwrappedParams?.slug || "cricket";
  const [iframeSrc, setIframeSrc] = useState("");
  const [title, setTitle] = useState(slug.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase()));
  const [key, setKey] = useState(0);
  const iframeRef = useRef(null);
  const [viewportHeight, setViewportHeight] = useState(0);

  useEffect(() => {
    const updateHeight = () => setViewportHeight(window.innerHeight);
    updateHeight();
    window.addEventListener('resize', updateHeight);
    return () => window.removeEventListener('resize', updateHeight);
  }, []);


  useEffect(() => {
    const api = getApiBaseValue();
    
    // Check if a dedicated static game exists for this slug
    fetch(`/games-static/${slug}/index.html`, { method: 'HEAD' })
      .then(res => {
        const cacheBuster = `&t=${Date.now()}`;
        if (res.ok) {
          setIframeSrc(`/games-static/${slug}/index.html?api=${encodeURIComponent(api)}&slug=${encodeURIComponent(slug)}${cacheBuster}`);
        } else {
          // Default to the Trivia Smash 3D engine connected to this project slug
          setIframeSrc(`/games-static/trivia-smash/index.html?api=${encodeURIComponent(api)}&slug=${encodeURIComponent(slug)}${cacheBuster}`);
        }
      })
      .catch(() => {
        const cacheBuster = `&t=${Date.now()}`;
        setIframeSrc(`/games-static/trivia-smash/index.html?api=${encodeURIComponent(api)}&slug=${encodeURIComponent(slug)}${cacheBuster}`);
      });

    // Also fetch project name from admin API if available
    fetch(`${api.replace(/\/+$/, '')}/api/public/projects/${slug}/session`)
      .then(r => r.json())
      .then(data => {
        if (data?.project?.name) {
          setTitle(data.project.name);
        }
      })
      .catch(() => {});
  }, [slug, key]);

  const handleFullscreen = () => {
    if (iframeRef.current) {
      if (iframeRef.current.requestFullscreen) {
        iframeRef.current.requestFullscreen();
      } else if (iframeRef.current.webkitRequestFullscreen) {
        iframeRef.current.webkitRequestFullscreen();
      } else if (iframeRef.current.msRequestFullscreen) {
        iframeRef.current.msRequestFullscreen();
      }
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 w-full flex flex-col min-h-0 sm:min-h-[800px]" style={{ height: viewportHeight > 0 ? `${viewportHeight - 80}px` : 'calc(100vh - 80px)' }}>
      <div className="flex items-center justify-between px-3 sm:px-0 py-2 sm:mb-4 shrink-0 bg-white sm:bg-transparent z-10">
        <Link href="/games" className="inline-flex items-center text-text-muted hover:text-primary-600 font-medium transition-colors text-sm sm:text-base">
          <ArrowLeft className="w-4 h-4 sm:w-5 sm:h-5 mr-1 sm:mr-2" />
          <span className="hidden sm:inline">Back</span>
        </Link>
        <div className="flex flex-1 items-center justify-end gap-2 sm:gap-3 ml-2">
          <h1 className="text-base sm:text-2xl font-bold text-foreground text-right leading-tight break-words">{title}</h1>
          <button onClick={handleFullscreen} className="sm:hidden text-gray-500 hover:text-gray-900 p-1 rounded-md bg-gray-100 hover:bg-gray-200" title="Full Screen">
            <Maximize className="w-4 h-4" />
          </button>
          <InGameAdminConfig
            defaultSlug={slug}
            onQuestionsReload={() => setKey((k) => k + 1)}
          />
        </div>
      </div>
      <div className="w-full flex-1 sm:rounded-3xl overflow-hidden sm:shadow-2xl sm:border border-gray-100 relative group">
        <div className="absolute inset-0 bg-gray-50 animate-pulse -z-10 flex flex-col items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500 mb-4"></div>
          <p className="text-gray-500 font-medium">Booting game engine...</p>
        </div>
        {iframeSrc && <iframe
          ref={iframeRef}
          key={key}
          src={iframeSrc}
          className="absolute inset-0 w-full h-full border-none bg-white z-10"
          title={title}
          allow="fullscreen"
        />}
        <div className="hidden sm:block absolute bottom-6 right-6 z-20 opacity-90 hover:opacity-100 transition-opacity duration-300">
          <button
            onClick={handleFullscreen}
            className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl shadow-xl flex items-center gap-2 font-bold transition-transform transform hover:scale-105 active:scale-95"
            title="Click to view full game (Press ESC to exit)"
          >
            <Maximize className="w-5 h-5" />
            Full Screen
          </button>
        </div>
      </div>
    </div>
  );
}

