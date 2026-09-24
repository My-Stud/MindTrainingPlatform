import { ShoppingCart, Star, Clock, BookOpen, ShieldCheck } from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

export const metadata = {
  title: "Fundamental Programs | VieBrain",
  description: "Browse our catalog of fundamental mind training programs.",
};

const MOCK_PROGRAMS = [
  {
    id: 1,
    title: "Memory Mastery Essentials",
    description: "Unlock the secrets to photographic memory and never forget a detail again. Perfect for students and professionals.",
    price: 9,
    originalPrice: 999,
    rating: 4.8,
    reviews: 124,
    duration: "4 Weeks",
    lessons: 24,
    image: "/images/banners/screen-222.PNG", 
    badge: "Best Seller"
  },
  {
    id: 2,
    title: "Focus & Concentration Pro",
    description: "Eliminate distractions and achieve deep work states on command. Train your brain to focus like a laser.",
    price: 9,
    originalPrice: 999,
    rating: 4.9,
    reviews: 89,
    duration: "6 Weeks",
    lessons: 32,
    image: "/images/banners/screen-222.PNG",
    badge: "New"
  },
  {
    id: 3,
    title: "Cognitive Speed Reading",
    description: "Read up to 3x faster while actually improving your comprehension and retention of complex materials.",
    price: 9,
    originalPrice: 999,
    rating: 4.7,
    reviews: 210,
    duration: "3 Weeks",
    lessons: 18,
    image: "/images/banners/screen-222.PNG",
    badge: null
  },
  {
    id: 4,
    title: "Logic & Problem Solving",
    description: "Develop structural thinking to tackle complex problems efficiently. Great for coders and analysts.",
    price: 9,
    originalPrice: 999,
    rating: 4.9,
    reviews: 56,
    duration: "8 Weeks",
    lessons: 40,
    image: "/images/banners/screen-222.PNG",
    badge: "Premium"
  },
  {
    id: 5,
    title: "Emotional Intelligence Core",
    description: "Master your emotions and improve your interpersonal relationships through guided neurological exercises.",
    price: 9,
    originalPrice: 999,
    rating: 4.6,
    reviews: 178,
    duration: "5 Weeks",
    lessons: 20,
    image: "/images/banners/screen-222.PNG",
    badge: null
  },
  {
    id: 6,
    title: "Brain Health & Nutrition",
    description: "A comprehensive guide to feeding your mind for optimal performance and longevity.",
    price: 9,
    originalPrice: 999,
    rating: 4.8,
    reviews: 342,
    duration: "2 Weeks",
    lessons: 12,
    image: "/images/banners/screen-222.PNG",
    badge: "Essential"
  }
];

export default function FundamentalProgramsPage() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-32">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ScrollReveal>
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight drop-shadow-sm">
              Fundamental <span className="text-orange-500">Programs</span>
            </h1>
            <p className="text-lg text-slate-600 font-medium leading-relaxed">
              Browse our premium collection of foundational mind training courses. 
              Invest in your cognitive potential today.
            </p>
          </div>
        </ScrollReveal>
      </div>

      {/* Catalog Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {MOCK_PROGRAMS.map((program, index) => (
            <ScrollReveal key={program.id} delay={index * 100}>
              <div className="bg-white rounded-3xl overflow-hidden shadow-[0_8px_30px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 border border-slate-100 group flex flex-col h-full cursor-pointer">
                
                {/* Image Container */}
                <div className="relative h-56 bg-slate-100 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-orange-400/80 to-rose-500/80 group-hover:scale-105 transition-transform duration-500 mix-blend-multiply"></div>
                  <div className="absolute inset-0 flex items-center justify-center text-white/40">
                    <BookOpen className="w-24 h-24" />
                  </div>
                  
                  {program.badge && (
                    <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-1.5 rounded-full text-xs font-black text-orange-600 shadow-sm uppercase tracking-wider">
                      {program.badge}
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-grow">
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-xl font-bold text-slate-900 leading-tight group-hover:text-orange-600 transition-colors">
                      {program.title}
                    </h3>
                  </div>

                  <div className="flex items-center gap-2 mb-4">
                    <div className="bg-[#388e3c] text-white flex items-center gap-1 px-1.5 py-0.5 rounded text-[0.85rem] font-bold">
                      {program.rating} <Star className="w-3.5 h-3.5 fill-current" />
                    </div>
                    <span className="text-sm text-gray-500 font-medium">({program.reviews})</span>
                  </div>

                  <p className="text-slate-600 text-sm mb-6 flex-grow line-clamp-3 leading-relaxed">
                    {program.description}
                  </p>

                  <div className="flex items-center gap-5 text-sm font-bold text-slate-500 mb-6 bg-slate-50 p-3 rounded-2xl">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-orange-500" />
                      {program.duration}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                    <div className="flex items-center gap-2">
                      <ShieldCheck className="w-4 h-4 text-emerald-500" />
                      {program.lessons} Lessons
                    </div>
                  </div>

                  {/* Footer / eCommerce Action */}
                  <div className="pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="text-xl font-semibold text-gray-900 leading-none">₹{program.price}</span>
                        {program.originalPrice && (
                          <span className="text-[0.95rem] text-gray-500 line-through">₹{program.originalPrice}</span>
                        )}
                        {program.originalPrice && (
                          <span className="text-[0.9rem] font-bold text-emerald-600">
                            {Math.round(((program.originalPrice - program.price) / program.originalPrice) * 100)}% off
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5">
                        <span className="text-xs font-medium text-pink-700">Only few left</span>
                      </div>
                    </div>
                    <button className="bg-orange-500 hover:bg-orange-600 text-white px-5 py-3 rounded-xl font-bold flex items-center gap-2 transition-colors shadow-sm shadow-orange-500/20 active:scale-95">
                      <ShoppingCart className="w-4 h-4" />
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
        </div>
      </div>
    </div>
  );
}
