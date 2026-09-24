import { Users, BookOpen, Target, Sparkles, Heart, Globe, Award, ShieldCheck, Zap, Activity, Quote, Brain } from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";

export const metadata = {
  title: "About Us | VieBrain Mind Training",
  description: "Learn about the mission, vision, and team behind VieBrain, the premier mind training institute.",
};

export default function AboutPage() {

  return (
    <div className="min-h-screen bg-background pb-20">
      {/* Hero Image Banner */}
      <div className="w-full mb-8">
        <ScrollReveal>
          <div className="relative w-full overflow-hidden bg-black flex items-center justify-center shadow-xl">
            <img 
              src="/images/banners/screen-222.PNG" 
              alt="India News Coverage - Genius Child" 
              className="w-full h-auto max-h-[85vh] object-contain opacity-90"
            />
          </div>
        </ScrollReveal>
      </div>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <ScrollReveal className="text-center space-y-8 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm shadow-sm border border-emerald-100">
            <Sparkles className="w-4 h-4" />
            <span>Our Mission & Vision</span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-orange-500 tracking-tight leading-tight">
            Pioneering the Future of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-teal-400">
              Cognitive Wellness
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-slate-600 font-medium leading-relaxed">
            We believe that everyone deserves the opportunity to unlock their mind's true potential.
          </p>
        </ScrollReveal>
      </div>

      {/* Our Story Section */}
      <section id="story" className="scroll-mt-32 bg-white border-y border-gray-100 py-24">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-stretch">
            <ScrollReveal className="space-y-8">
              <div className="flex flex-col items-start gap-4">
                <h2 className="text-orange-500 font-black tracking-[0.2em] uppercase text-sm drop-shadow-sm">— Our Story —</h2>
                <h3 className="text-4xl md:text-5xl font-black text-orange-500 tracking-tight">How VieBrain Began</h3>
              </div>
              <p className="text-lg text-slate-600 leading-relaxed font-medium">
                VieBrain's journey began with the groundbreaking work of Dr. Atal Bihari Mallick, a pioneer in memory training and Psycho Neurobics. Driven by the vision to unlock the subconscious mind's true potential, our foundation is built upon decades of intensive research into cognitive enhancement. As highlighted in publications like <strong className="text-gray-900">The New Indian Express</strong>, our innovative methods have revolutionized how students learn, retain information, and harness their mental energy.
              </p>
              <p className="text-lg text-slate-600 leading-relaxed font-medium pt-2">
                Moving beyond traditional rote learning, we introduced the innovative <strong className="text-gray-900">Number To Image (NTI)</strong> convert system and the unique <strong className="text-gray-900">Matho-technique</strong>. These proprietary methods have empowered countless children to perform rapid mental calculations, leading many to set national records. Furthermore, our research culminated in the co-invention of a groundbreaking <strong className="text-gray-900">Neurobic Machine</strong>—capable of detecting alpha and beta brain states. This technological leap, recognized in the India Book of Records, allows us to bring scientifically backed, elite cognitive training out of clinical settings and make it accessible to everyone.
              </p>
              
              <div className="relative w-full rounded-2xl overflow-hidden shadow-lg border border-gray-100 my-6">
                <img 
                  src="/images/banners/paper-img-1.png" 
                  alt="The New Indian Express - The memory powerhouse" 
                  className="w-full h-auto object-cover"
                />
              </div>

              <div className="flex items-center gap-4 pt-4">
                <div className="flex -space-x-4">
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold">20+</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-primary-100 flex items-center justify-center text-primary-600 font-bold">PhDs</div>
                  <div className="w-12 h-12 rounded-full border-2 border-white bg-orange-100 flex items-center justify-center text-orange-600 font-bold z-10"><Award className="w-5 h-5"/></div>
                </div>
                <span className="text-sm font-bold text-gray-500 uppercase tracking-wider">Years of combined research</span>
              </div>
            </ScrollReveal>
            <div className="flex flex-col gap-12 h-full">
              <ScrollReveal delay={0.2} className="relative">
                <div className="absolute inset-0 bg-gradient-to-tr from-emerald-200 to-primary-200 rounded-[3rem] transform rotate-3 scale-105 opacity-50 blur-lg"></div>
                <div className="relative bg-white hover:bg-emerald-900 transition-colors duration-500 rounded-[3rem] p-8 shadow-2xl border-4 border-emerald-700 aspect-square flex flex-col justify-center items-center text-center space-y-6 group cursor-default">
                  <Globe className="w-24 h-24 text-emerald-500 group-hover:text-emerald-400 group-hover:drop-shadow-[0_0_20px_rgba(52,211,153,0.8)] transition-all duration-500" />
                  <h4 className="text-2xl font-black text-gray-900 group-hover:text-emerald-300 transition-colors duration-500">Global Impact</h4>
                  <p className="text-slate-600 font-medium leading-relaxed group-hover:text-orange-400 transition-colors duration-500">We've reached over 100,000 learners across 50+ countries, transforming lives through scientifically backed cognitive enhancement.</p>
                </div>
              </ScrollReveal>

              <ScrollReveal delay={0.4} className="flex-1 bg-gradient-to-br from-orange-50 to-amber-50 rounded-[2.5rem] p-8 border border-orange-100 shadow-xl relative overflow-hidden group hover:shadow-2xl transition-shadow duration-500 flex flex-col">
                <div className="absolute -top-6 -right-6 opacity-5 group-hover:scale-110 transition-transform duration-700">
                  <Award className="w-48 h-48 text-orange-600" />
                </div>
                <div className="relative z-10 flex flex-col h-full">
                  <div className="space-y-5">
                    <h4 className="text-2xl font-black text-orange-600 leading-snug">VieBrain – 26 Years of Excellence <br/>(2000–2026)</h4>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      For 26 years, VieBrain has been empowering young minds through innovative brain development programs, helping students unlock their true potential. Since 2000, the institute has nurtured thousands of talented students, many of whom have achieved national and international recognition for their outstanding accomplishments.
                    </p>
                    <p className="text-slate-700 font-medium leading-relaxed">
                      With a strong commitment to excellence, creativity, and lifelong learning, VieBrain continues to inspire the next generation of achievers.
                    </p>
                  </div>
                  
                  <div className="flex-1 w-full min-h-[140px] max-h-[250px] py-6">
                    <img 
                      src="/images/banners/jumping_kids_success.png" 
                      alt="Happy successful children jumping" 
                      className="w-full h-full object-cover rounded-2xl shadow-sm border border-orange-200/50"
                    />
                  </div>

                  <div className="pt-4 border-t border-orange-200/50 mt-auto">
                    <p className="text-lg font-black text-gray-900 italic tracking-wide text-center">
                      "Creating World Achievers Since 2000."
                    </p>
                  </div>
                </div>
              </ScrollReveal>
            </div>
          </div>
        </div>
      </section>


      {/* Values Section */}
      <section className="bg-foreground text-white py-24 mt-12 rounded-t-[4rem]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <ScrollReveal className="text-center space-y-12">
            <h3 className="text-4xl font-black tracking-tight">Our Core Values</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-gray-800/50 p-8 rounded-[2rem] border border-gray-700 hover:bg-gray-800 transition-colors">
                <Target className="w-12 h-12 text-emerald-400 mb-6 mx-auto" />
                <h4 className="text-xl font-bold mb-4">Scientific Rigor</h4>
                <p className="text-gray-400 font-medium">Every exercise and assessment on our platform is backed by peer-reviewed research.</p>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-[2rem] border border-gray-700 hover:bg-gray-800 transition-colors">
                <Heart className="w-12 h-12 text-orange-400 mb-6 mx-auto" />
                <h4 className="text-xl font-bold mb-4">Accessibility</h4>
                <p className="text-gray-400 font-medium">We design our tools to be inclusive, intuitive, and accessible to learners of all ages.</p>
              </div>
              <div className="bg-gray-800/50 p-8 rounded-[2rem] border border-gray-700 hover:bg-gray-800 transition-colors">
                <ShieldCheck className="w-12 h-12 text-primary-400 mb-6 mx-auto" />
                <h4 className="text-xl font-bold mb-4">Data Integrity</h4>
                <p className="text-gray-400 font-medium">Your cognitive data is fiercely protected with enterprise-grade security and privacy protocols.</p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
