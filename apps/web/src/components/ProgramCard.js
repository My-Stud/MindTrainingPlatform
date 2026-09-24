"use client";

import { useState } from "react";
import { ChevronDown, CheckCircle2, TrendingUp } from "lucide-react";

export default function ProgramCard({ 
  animationClass, 
  gradientHover, 
  shadowHover, 
  imageSrc, 
  imageAlt, 
  title, 
  subtitle, 
  titleColorClass, 
  overlayColor,
  details 
}) {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className={`${animationClass} group relative rounded-[2rem] p-[2px] overflow-hidden hover:-translate-y-2 transition-transform duration-500 shadow-[0_8px_30px_rgba(0,0,0,0.04)] ${shadowHover} bg-white/40`}>
      {/* Animated Gradient Border on Hover */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientHover} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      
      {/* Glassmorphism Inner Content */}
      <div className="relative min-h-[420px] bg-white/60 backdrop-blur-xl rounded-[calc(2rem-2px)] flex flex-col overflow-hidden">
        <div className="absolute inset-0 w-1/2 bg-gradient-to-r from-transparent via-white/60 to-transparent -translate-x-[150%] skew-x-[-20deg] group-hover:animate-[shimmer_1.5s_ease-in-out_infinite] pointer-events-none z-20" />

        <div className="w-full h-[250px] shrink-0 relative overflow-hidden">
          <div className={`absolute inset-0 ${overlayColor} transition-colors duration-500 z-10 mix-blend-overlay`}></div>
          <img src={imageSrc} alt={imageAlt} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
        </div>
        
        <div className="w-full flex-1 p-6 flex flex-col items-center text-center relative z-10 bg-white/40">
          <div className="mb-4">
            <h4 className="text-2xl font-black text-slate-800 mb-1 tracking-tight">{title}</h4>
            <p className="text-slate-600 font-bold text-sm">{subtitle}</p>
          </div>
          
          <div 
            className={`w-full overflow-hidden transition-all duration-500 ease-in-out ${isExpanded ? 'max-h-[800px] opacity-100 mb-6' : 'max-h-0 opacity-0 mb-0'}`}
          >
            <div className="text-left pt-4 border-t border-slate-200/50 mt-2 space-y-5">
              
              <p className="text-sm text-slate-600 font-medium leading-relaxed italic">
                "{details.description}"
              </p>

              <div className="space-y-3">
                <h5 className="text-xs font-bold uppercase tracking-wider text-slate-400">Core Focus</h5>
                {details.features.map((feature, index) => (
                  <div key={index} className="flex gap-3">
                    <CheckCircle2 className={`w-5 h-5 shrink-0 ${titleColorClass}`} />
                    <div>
                      <h6 className="text-sm font-bold text-slate-800">{feature.title}</h6>
                      <p className="text-xs text-slate-500 font-medium">{feature.desc}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white/70 backdrop-blur-sm rounded-xl p-3 border border-slate-100/50 flex items-center gap-4">
                <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-white shadow-sm border border-slate-100 ${titleColorClass}`}>
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <div className={`text-xl font-black ${titleColorClass}`}>{details.metric.value}</div>
                  <div className="text-xs font-bold text-slate-500 uppercase tracking-wide">{details.metric.label}</div>
                </div>
              </div>

            </div>
          </div>

          <div className="mt-auto pt-2">
            <button 
              onClick={() => setIsExpanded(!isExpanded)}
              className={`inline-flex items-center gap-2 font-bold transition-colors group/btn bg-white/50 hover:bg-white/80 px-5 py-2.5 rounded-xl border shadow-sm ${titleColorClass} border-current/20 hover:border-current/40`}
            >
              {isExpanded ? 'Show Less' : 'Learn More'}
              <ChevronDown className={`w-4 h-4 transform transition-transform duration-300 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
