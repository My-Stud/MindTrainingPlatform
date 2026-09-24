"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Maximize2, Minimize2, RefreshCw, ExternalLink } from "lucide-react";

export default function IntegratedAdminPage() {
  const [adminUrl, setAdminUrl] = useState("http://localhost:5173");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const customUrl = process.env.NEXT_PUBLIC_ADMIN_PANEL_URL || "http://localhost:5173";
      setAdminUrl(customUrl);
    }
  }, []);

  return (
    <div className={`w-full flex flex-col bg-[#141211] transition-all ${isFullscreen ? "fixed inset-0 z-50 h-screen" : "h-screen"}`}>
      {/* Top Floating Control Bar */}
      <div className="bg-[#1a1715] border-b border-[#2a2420] px-4 py-2 flex items-center justify-between z-20 shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/games"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#241f1c] hover:bg-[#2f2925] text-slate-300 hover:text-white text-xs font-semibold border border-[#38302b] transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Game Portal</span>
          </Link>
          <div className="flex items-center gap-2">
            <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-bold text-slate-200">MySQL Game Admin Panel</span>
            <span className="hidden sm:inline-block text-[10px] font-mono px-2 py-0.5 rounded bg-[#241f1c] text-amber-400/90 border border-[#38302b]">
              All Games Auto-Synced
            </span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setReloadKey((k) => k + 1)}
            className="p-1.5 rounded-lg bg-[#241f1c] hover:bg-[#2f2925] text-slate-400 hover:text-slate-200 border border-[#38302b] transition-colors"
            title="Reload Admin Panel"
          >
            <RefreshCw className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#241f1c] hover:bg-[#2f2925] text-slate-300 hover:text-white text-xs font-medium border border-[#38302b] transition-colors"
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen View"}
          >
            {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" /> : <Maximize2 className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline">{isFullscreen ? "Collapse" : "Fullscreen"}</span>
          </button>

          <a
            href={adminUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-[#e35d33]/15 hover:bg-[#e35d33]/25 text-[#f47c55] hover:text-white text-xs font-semibold border border-[#e35d33]/30 transition-colors"
            title="Open in standalone tab"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">New Tab</span>
          </a>
        </div>
      </div>

      {/* Embedded High-Fidelity Original React Admin Panel */}
      <div className="flex-1 w-full relative bg-[#141211] overflow-hidden">
        <iframe
          key={reloadKey}
          src={adminUrl}
          className="w-full h-full border-none bg-[#141211]"
          title="MySQL Game Admin Panel"
          allow="clipboard-read; clipboard-write"
        />
      </div>
    </div>
  );
}
