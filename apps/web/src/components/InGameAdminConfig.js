"use client";

import { useState, useEffect } from "react";
import { Settings2, Check, RefreshCw, AlertCircle, Database, Globe, X, ExternalLink } from "lucide-react";
import { getApiBaseValue, getSlugValue, setApiBase, setSlug } from "@/api/questions";

export default function InGameAdminConfig({ defaultSlug = "cricket", onQuestionsReload }) {
  const [isVisible, setIsVisible] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [apiBase, setApiBaseInput] = useState("");
  const [slug, setSlugInput] = useState("");
  const [status, setStatus] = useState({ state: "idle", message: "" });
  const [sampleQuestions, setSampleQuestions] = useState(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      const params = new URLSearchParams(window.location.search);
      setIsVisible(params.get("admin") === "1" || params.get("debug") === "1");
    }
    setApiBaseInput(getApiBaseValue());
    setSlugInput(getSlugValue(defaultSlug));
  }, [defaultSlug, isOpen]);

  if (!isVisible) {
    return null;
  }

  const testAndSave = async (e) => {
    if (e) e.preventDefault();
    setStatus({ state: "testing", message: "Connecting to MySQL Admin Panel..." });

    try {
      const cleanApi = (apiBase || "https://my-sql-admin-panel.onrender.com").replace(/\/+$/, "");
      const cleanSlug = (slug || defaultSlug).trim();

      const res = await fetch(`${cleanApi}/api/public/projects/${cleanSlug}/session?limit=3`, {
        headers: { Accept: "application/json" },
      });

      if (!res.ok) {
        throw new Error(`Admin replied with status ${res.status}`);
      }

      const data = await res.json();
      if (!data.questions || data.questions.length === 0) {
        throw new Error(`Connected, but project "${cleanSlug}" has 0 questions.`);
      }

      // Save to localStorage
      setApiBase(cleanApi);
      setSlug(cleanSlug);

      setStatus({
        state: "success",
        message: `✔ Connected! Project "${data.project?.name || cleanSlug}" loaded with ${data.totalAvailable || data.questions.length} questions available.`,
      });
      setSampleQuestions(data.questions);

      if (onQuestionsReload) {
        onQuestionsReload(cleanSlug);
      }
    } catch (err) {
      setStatus({
        state: "error",
        message: `✘ Connection failed: ${err.message}`,
      });
      setSampleQuestions(null);
    }
  };

  const currentUrlWithParams = typeof window !== "undefined"
    ? `${window.location.origin}${window.location.pathname}?slug=${slug || defaultSlug}&api=${encodeURIComponent(apiBase || "https://my-sql-admin-panel.onrender.com")}`
    : "";

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={() => setIsOpen(true)}
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-slate-900 text-white text-xs font-semibold backdrop-blur shadow-lg border border-slate-700/50 transition-all hover:scale-105 z-30"
        title="In-Game Admin & Question Settings"
      >
        <Database className="w-3.5 h-3.5 text-emerald-400" />
        <span>MySQL Admin Config</span>
      </button>

      {/* Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl w-full max-w-lg overflow-hidden text-slate-200">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Database className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-white leading-none">In-Game MySQL Config</h3>
                  <p className="text-xs text-slate-400 mt-0.5">Live self-service questions connection</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <form onSubmit={testAndSave} className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Project Slug (e.g. cricket, math-quiz, country-shooter)
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlugInput(e.target.value)}
                  placeholder={defaultSlug}
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Matches the project slug created inside your MySQL Admin Panel.
                </p>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Admin Panel API Base URL
                </label>
                <input
                  type="text"
                  value={apiBase}
                  onChange={(e) => setApiBaseInput(e.target.value)}
                  placeholder="https://my-sql-admin-panel.onrender.com"
                  className="w-full px-3.5 py-2.5 bg-slate-950 border border-slate-700 rounded-xl text-sm text-white focus:outline-none focus:border-emerald-500 transition-colors"
                />
                <p className="text-[11px] text-slate-500 mt-1">
                  Default: <code className="text-emerald-400">https://my-sql-admin-panel.onrender.com</code> or local <code className="text-emerald-400">http://localhost:5000</code>
                </p>
              </div>

              {/* Status Message */}
              {status.message && (
                <div
                  className={`p-3 rounded-xl text-xs font-medium border flex items-start gap-2 ${
                    status.state === "success"
                      ? "bg-emerald-950/40 text-emerald-300 border-emerald-800"
                      : status.state === "error"
                      ? "bg-rose-950/40 text-rose-300 border-rose-800"
                      : "bg-blue-950/40 text-blue-300 border-blue-800"
                  }`}
                >
                  {status.state === "success" && <Check className="w-4 h-4 shrink-0 text-emerald-400 mt-0.5" />}
                  {status.state === "error" && <AlertCircle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />}
                  {status.state === "testing" && <RefreshCw className="w-4 h-4 shrink-0 text-blue-400 animate-spin mt-0.5" />}
                  <div>{status.message}</div>
                </div>
              )}

              {/* Sample preview if connected */}
              {sampleQuestions && sampleQuestions.length > 0 && (
                <div className="bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs space-y-1.5">
                  <div className="font-semibold text-slate-300">Live Sample Question:</div>
                  <div className="text-emerald-300">Q: {sampleQuestions[0].field1}</div>
                  <div className="text-slate-400 text-[11px]">
                    Answer: {sampleQuestions[0].correctAnswer} | Options: {sampleQuestions[0].optionA}, {sampleQuestions[0].optionB}...
                  </div>
                </div>
              )}

              {/* Shareable URL */}
              <div className="pt-2 border-t border-slate-800">
                <div className="text-[11px] text-slate-400 mb-1 font-semibold">
                  Shareable / Direct URL Parameter (Self-Service):
                </div>
                <div className="p-2 bg-slate-950 rounded-lg text-[11px] font-mono text-slate-300 break-all select-all border border-slate-800">
                  {currentUrlWithParams}
                </div>
              </div>

              {/* Footer buttons */}
              <div className="flex items-center justify-end gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-2 text-xs font-semibold rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  Close
                </button>
                <button
                  type="submit"
                  disabled={status.state === "testing"}
                  className="px-4 py-2 text-xs font-bold rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/30 transition-all flex items-center gap-1.5 disabled:opacity-50"
                >
                  {status.state === "testing" ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Testing...</span>
                    </>
                  ) : (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Save & Apply Live</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
