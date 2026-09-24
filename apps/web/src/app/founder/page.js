import { BookOpen, Zap, Activity, Quote, Brain } from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

export const metadata = {
  title: "Dr. Atal Bihari Mallick's Profile | VieBrain Mind Training",
  description: "Learn about Dr. Atal Bihari Mallick, memory trainer, neurobic expert, and founder of VieBrain.",
};

export default function FounderPage() {
  return (
    <div className="min-h-screen bg-background pt-32 pb-20">
      {/* Hero Image Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <ScrollReveal>
          <div className="relative w-full aspect-video md:aspect-[21/9] rounded-3xl overflow-hidden shadow-2xl border border-gray-100 bg-gray-900 flex items-center justify-center">
            <img 
              src="/images/banners/screen-4.png" 
              alt="Dr. Atal Bihari Mallick" 
              className="w-full h-full object-cover opacity-90"
            />
          </div>
        </ScrollReveal>
      </div>

      {/* Meet Our Founder Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <ScrollReveal className="text-center space-y-6 mb-16">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-primary-500 font-black tracking-[0.2em] uppercase text-sm drop-shadow-sm">— Meet Our Founder —</h2>
            <h1 className="text-5xl md:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-400 tracking-tight">The Brain Behind VieBrain</h1>
          </div>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            VieBrain is the culmination of decades of research by Dr. Atal Bihari Mallick, a pioneer in neurobics and memory training.
          </p>
        </ScrollReveal>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          
          {/* Founder Profile Card */}
          <div className="lg:col-span-5">
            <ScrollReveal className="bg-white rounded-[2.5rem] p-8 border border-gray-100 shadow-2xl hover:shadow-[0_20px_60px_rgba(0,0,0,0.08)] transition-all duration-500 relative overflow-hidden group">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary-100 rounded-bl-full opacity-50 transition-transform group-hover:scale-125"></div>
              
              <div className="relative w-full aspect-[4/5] rounded-[1.5rem] overflow-hidden mb-8 border border-gray-100 bg-gray-50 flex items-center justify-center">
                {/* Profile Image */}
                <img src="/images/banners/viebrain-img.jpg" alt="Dr. Atal Bihari Mallick" className="w-full h-full object-cover" />
              </div>
              
              <div className="relative z-10 text-center space-y-4">
                <h4 className="text-3xl font-black text-gray-900">Dr. Atal Bihari Mallick</h4>
                <p className="text-emerald-600 font-bold uppercase tracking-wide text-sm">Memory Trainer & Neurobic Expert</p>
                <div className="flex flex-wrap justify-center gap-2 mt-4">
                  <span className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-bold">PhD in Psycho Neurobics</span>
                  <span className="bg-orange-50 text-orange-600 px-3 py-1 rounded-full text-xs font-bold border border-orange-100">India Book of Records</span>
                </div>
              </div>
            </ScrollReveal>
          </div>

          {/* Founder Details & Highlights */}
          <div className="lg:col-span-7 space-y-8">
            <ScrollReveal delay={0.1}>
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-3xl p-8 border border-emerald-100 relative">
                <Quote className="absolute top-4 right-6 w-12 h-12 text-emerald-200/50 transform rotate-180" />
                <p className="text-xl text-emerald-900 italic font-medium leading-relaxed relative z-10">
                  "When someone thinks deeply, it is not the conscious state of mind but the subconscious one that plays the main role in manifestation. In fact, the decisions we make in life are a direct manifestation of what our subconscious mind is programmed to bring."
                </p>
              </div>
            </ScrollReveal>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Innovator */}
              <ScrollReveal delay={0.2} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition-transform group">
                <div className="w-12 h-12 rounded-2xl bg-orange-50 text-orange-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6" />
                </div>
                <h5 className="text-lg font-black text-gray-900 mb-3">The Innovator</h5>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  Creator of the <strong className="text-gray-900">Number To Image (NTI)</strong> convert system and the unique <strong className="text-gray-900">Matho-technique</strong>, helping children make national records in rapid calculations.
                </p>
              </ScrollReveal>

              {/* Inventor */}
              <ScrollReveal delay={0.3} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition-transform group">
                <div className="w-12 h-12 rounded-2xl bg-primary-50 text-primary-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Activity className="w-6 h-6" />
                </div>
                <h5 className="text-lg font-black text-gray-900 mb-3">The Inventor</h5>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  Co-inventor of a groundbreaking <strong className="text-gray-900">Neurobic Machine</strong> capable of detecting alpha and beta brain states, earning him a feature in the India Book of Records.
                </p>
              </ScrollReveal>

              {/* Author */}
              <ScrollReveal delay={0.4} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition-transform group">
                <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <BookOpen className="w-6 h-6" />
                </div>
                <h5 className="text-lg font-black text-gray-900 mb-3">The Author</h5>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  Renowned author of <strong className="text-gray-900">Master Memory</strong> and <strong className="text-gray-900">Golden Success</strong>, guiding students on how to harness mental energy into immense memory power.
                </p>
              </ScrollReveal>

              {/* Scholar */}
              <ScrollReveal delay={0.5} className="bg-white p-6 rounded-3xl border border-gray-100 shadow-lg hover:-translate-y-1 transition-transform group">
                <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-500 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                  <Brain className="w-6 h-6" />
                </div>
                <h5 className="text-lg font-black text-gray-900 mb-3">The Scholar</h5>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  Holds a PG in Psycho Neurobics from Tamil Nadu Physical Education & Sports University, and a PhD from Yoga-Samskrutham University, Florida.
                </p>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
