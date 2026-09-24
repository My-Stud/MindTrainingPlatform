"use client";

import Link from "next/link";
import Image from "next/image";
import { Brain, Flame, Activity, Sparkles } from "lucide-react";
import { Swiper, SwiperSlide } from 'swiper/react';
import { Autoplay, EffectFade, Pagination } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/effect-fade';
import 'swiper/css/pagination';

const slides = [
  {
    id: 1,
    title: "Develop Brain Power |Early",
    description: "Engaging and vibrant brain training lessons designed specifically for kids. Build cognitive foundations with interactive fun!",
    image: "/images/banners/realistic_kids_learning.png",
    button: { text: "Kids Zone", href: "/games", icon: <Brain className="w-5 h-5 mr-2" /> },
    streak: null
  },
  {
    id: 2,
    title: "",
    description: "",
    image: "/images/banners/dr_atal_bihari_mallick.png",
    button: null,
    streak: null
  },
  {
    id: 3,
    title: "",
    description: "",
    image: "/images/banners/screen-2.jpeg",
    button: null,
    streak: null
  },
  {
    id: 4,
    title: "Track Your |Cognitive Edge",
    description: "Unlock advanced analytics to see exactly how your mental agility is improving over time.",
    image: "/images/banners/cognitive_interface.png",
    button: { text: "View Dashboard", href: "/games", icon: <Activity className="w-5 h-5 mr-2" /> },
    streak: null
  },
  {
    id: 5,
    title: "",
    description: "",
    image: "/images/banners/screen-3.png",
    button: null,
    streak: null
  },
  {
    id: 6,
    title: "",
    description: "",
    image: "/images/banners/screen-5.png",
    button: null,
    streak: null
  },
  {
    id: 7,
    title: "",
    description: "",
    image: "/images/banners/screen-6.png",
    button: null,
    streak: null
  }
];

export default function BannerSlider() {
  return (
    <div className="relative w-full overflow-hidden shadow-2xl group h-[240px] sm:h-[240px] sm:h-[500px] md:h-[600px] bg-slate-50">
      <Swiper
        spaceBetween={0}
        effect={'fade'}
        fadeEffect={{ crossFade: true }}
        pagination={{
          clickable: true,
        }}
        autoplay={{
          delay: 4000,
          disableOnInteraction: false,
        }}
        loop={true}
        modules={[Autoplay, EffectFade, Pagination]}
        className="w-full h-full"
      >
        {slides.map((slide, index) => (
          <SwiperSlide key={slide.id}>
            {({ isActive }) => (
              <div className="w-full h-full relative">
                {/* Background Image with Ken Burns Effect */}
                <div className="absolute inset-0 w-full h-full overflow-hidden">
                  <Image
                    src={slide.image}
                    alt={slide.title}
                    fill
                    className={`object-cover object-center transition-transform duration-[6000ms] ease-out ${
                      isActive ? "scale-110" : "scale-100"
                    }`}
                    priority={index === 0}
                  />
                  {/* Refined Glass Overlay */}
                  <div className={`absolute inset-0 bg-gradient-to-r from-white/90 via-white/20 to-transparent mix-blend-normal pointer-events-none ${(slide.title || slide.description) ? "" : "hidden sm:block"}`} />
                </div>

                {/* Content with Slide-up Effect */}
                <div 
                  className={`relative z-20 flex flex-col justify-end h-full p-4 sm:p-8 md:p-12 pb-6 sm:pb-16 md:pb-20 w-full max-w-3xl transition-all duration-1000 ease-out transform ${
                    isActive ? "translate-y-0 opacity-100 delay-300" : "translate-y-8 opacity-0"
                  }`}
                >
                  {slide.title && (
                    <h1 className="text-2xl sm:text-5xl font-extrabold tracking-tight mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 drop-shadow-lg pb-1">
                      {slide.title.includes("|") ? (
                        <>
                          {slide.title.split("|")[0]}<span>{slide.title.split("|")[1]}</span>
                        </>
                      ) : (
                        slide.title
                      )}
                    </h1>
                  )}
                  {slide.description && (
                    <p className="text-orange-500 text-sm sm:text-lg hidden sm:block max-w-xl font-medium mb-8 leading-relaxed drop-shadow-sm">
                      {slide.description}
                    </p>
                  )}

                  <div className="flex flex-col sm:flex-row items-center gap-4 w-full md:w-auto">
                    {slide.button && (
                      <Link
                        href={slide.button.href}
                        className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2 sm:px-8 sm:py-4 text-sm sm:text-base rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white hover:from-emerald-700 hover:to-teal-700 font-extrabold transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1"
                      >
                        {slide.button.icon}
                        {slide.button.text}
                      </Link>
                    )}

                    {slide.streak && (
                      <div className="w-full sm:w-auto flex items-center justify-center gap-2 px-3 py-2 sm:px-6 sm:py-4 text-sm sm:text-base rounded-xl bg-white/70 border border-emerald-100 text-slate-800 backdrop-blur-md font-bold shadow-sm">
                        <Flame className="w-5 h-5 text-orange-500 drop-shadow-sm" />
                        <span>{slide.streak} Day Streak</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </SwiperSlide>
        ))}
      </Swiper>

      <style dangerouslySetInnerHTML={{__html: `
        .swiper-pagination-bullet {
          width: 12px;
          height: 12px;
          background: rgba(255, 255, 255, 0.8) !important;
          opacity: 1 !important;
          transition: all 0.3s !important;
        }
        .swiper-pagination-bullet-active {
          background: #10b981 !important; /* emerald-500 */
          width: 32px !important;
          border-radius: 8px !important;
        }
      `}} />
    </div>
  );
}



