import { Brain, Target, Zap, Users, Lightbulb, TrendingUp, ArrowRight, Activity, ShieldCheck, Gamepad2, Flame, Trophy, Clock, Sparkles, Calendar, Video, Star, Play, CheckCircle2 } from "lucide-react";
import Link from "next/link";
import BannerSlider from "../components/BannerSlider";
import ScrollReveal from "../components/ScrollReveal";
import MegaMilestoneGlimpse from "../components/MegaMilestoneGlimpse";
import AnimatedBrain from "../components/AnimatedBrain";
import ProgramCard from "../components/ProgramCard";

export default function HomePage() {
  const features = [
    {
      icon: <Brain className="w-6 h-6 text-blue-400" />,
      title: "Cognitive Development",
      stats: ["Memory", "Learning Speed", "Retention"],
      metric: "95% Improvement",
      color: "from-blue-500/20 to-transparent",
      metricColor: "text-blue-700",
      metricBg: "bg-blue-50 border-blue-100",
    },
    {
      icon: <Target className="w-6 h-6 text-emerald-400" />,
      title: "Focus & Attention",
      stats: ["Concentration", "Productivity", "Clarity"],
      metric: "3x Better Focus",
      color: "from-emerald-500/20 to-transparent",
      metricColor: "text-emerald-700",
      metricBg: "bg-emerald-50 border-emerald-100",
    },
    {
      icon: <Zap className="w-6 h-6 text-yellow-400" />,
      title: "Mental Agility",
      stats: ["Quick Thinking", "Problem Solving", "Decision Making"],
      metric: "2x Faster Processing",
      color: "from-yellow-500/20 to-transparent",
      metricColor: "text-yellow-700",
      metricBg: "bg-yellow-50 border-yellow-100",
    },
  ];

  const audience = [
    {
      title: "Students",
      icon: <Lightbulb className="w-8 h-8 text-orange-500 transition-colors group-hover:text-white" />,
      description: "Accelerate academic performance by enhancing working memory retention, sustaining deep focus during intensive study sessions, and developing rapid information processing capabilities.",
      themeClasses: "hover:border-orange-200 hover:shadow-orange-500/10",
      iconBg: "bg-orange-50 group-hover:bg-orange-500",
    },
    {
      title: "Professionals",
      icon: <TrendingUp className="w-8 h-8 text-emerald-500 transition-colors group-hover:text-white" />,
      description: "Maintain cognitive dominance in high-stakes environments. Optimize executive function for decisive leadership, rapid problem solving, and sustained peak productivity.",
      themeClasses: "hover:border-emerald-200 hover:shadow-emerald-500/10",
      iconBg: "bg-emerald-50 group-hover:bg-emerald-500",
    },
    {
      title: "Seniors",
      icon: <Activity className="w-8 h-8 text-purple-500 transition-colors group-hover:text-white" />,
      description: "Preserve and fortify neuroplasticity. Proactively combat age-related cognitive decline through targeted stimulation that promotes a resilient, active, and engaged mind.",
      themeClasses: "hover:border-purple-200 hover:shadow-purple-500/10",
      iconBg: "bg-purple-50 group-hover:bg-purple-500",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* 1. Top Section: Playing Scene + Dashboard (Original Emerald Green Theme) */}
      <div className="relative bg-gradient-to-b from-emerald-700 via-emerald-800 to-emerald-900 pb-24 overflow-hidden rounded-b-[3rem] sm:rounded-b-[5rem] shadow-2xl">
        {/* Abstract Background Glows */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-teal-400/20 rounded-full blur-[120px] pointer-events-none" />

        {/* Dashboard Welcome Section (Full Width) */}
        <section className="w-full relative z-10 mb-16">
          <BannerSlider />
        </section>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16 relative z-10">
          {/* Dashboard Grid Section */}
          <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Cognitive Profile */}
            <ScrollReveal>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Activity className="w-6 h-6 text-emerald-400" />
                Your Cognitive Profile
              </h2>
              <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-200 shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.15)] transition-all duration-500 h-[calc(100%-3rem)] flex flex-col justify-between group">
                
                <div className="space-y-6 flex-grow">
                  {/* Skill 1 */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-800">Memory</span>
                      <span className="text-sm font-bold text-primary-600">85%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-primary-400 to-primary-600 h-3 rounded-full transform origin-left transition-transform duration-1000 group-hover:scale-x-105" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                  {/* Skill 2 */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-800">Focus</span>
                      <span className="text-sm font-bold text-emerald-500">72%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-3 rounded-full transform origin-left transition-transform duration-1000 delay-75 group-hover:scale-x-105" style={{ width: '72%' }}></div>
                    </div>
                  </div>
                  {/* Skill 3 */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-800">Agility</span>
                      <span className="text-sm font-bold text-yellow-500">90%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-yellow-400 to-yellow-500 h-3 rounded-full transform origin-left transition-transform duration-1000 delay-150 group-hover:scale-x-105" style={{ width: '90%' }}></div>
                    </div>
                  </div>
                  {/* Skill 4 */}
                  <div>
                    <div className="flex justify-between items-end mb-2">
                      <span className="font-bold text-gray-800">Problem Solving</span>
                      <span className="text-sm font-bold text-purple-500">65%</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
                      <div className="bg-gradient-to-r from-purple-400 to-purple-500 h-3 rounded-full transform origin-left transition-transform duration-1000 delay-200 group-hover:scale-x-105" style={{ width: '65%' }}></div>
                    </div>
                  </div>
                </div>

                <div className="mt-8 pt-6 border-t border-gray-100 flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 font-medium">Overall Growth</p>
                    <p className="text-xl font-black text-emerald-600">+12% this week</p>
                  </div>
                  <div className="w-12 h-12 bg-emerald-50 rounded-full flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                    <TrendingUp className="w-6 h-6 text-emerald-500" />
                  </div>
                </div>

              </div>
            </ScrollReveal>

            {/* Upcoming Masterclasses */}
            <ScrollReveal delay={0.2}>
              <h2 className="text-xl font-bold mb-6 flex items-center gap-2 text-white">
                <Video className="w-6 h-6 text-blue-400" />
                Live Masterclasses
              </h2>
              <div className="bg-white rounded-[2rem] p-6 md:p-8 border border-gray-200 shadow-xl hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 h-[calc(100%-3rem)] flex flex-col justify-between group">
                
                <div className="space-y-4 flex-grow">
                  
                  {/* Masterclass 1 */}
                  <div className="p-5 rounded-2xl bg-blue-50 border border-blue-100 hover:bg-blue-100 transition-colors group/class cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-blue-200 rounded-bl-full opacity-50 transition-transform group-hover/class:scale-125"></div>
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <span className="text-xs font-bold text-blue-600 uppercase tracking-wider mb-2 block">Tomorrow, 10:00 AM</span>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">Advanced Memory Techniques</h3>
                        <p className="text-sm font-medium text-gray-600 flex items-center gap-2 mt-2">
                          <img className="w-5 h-5 rounded-full border border-white bg-white shadow-sm" src="https://api.dicebear.com/7.x/micah/svg?seed=Sarah" alt="Dr. Sarah" />
                          Dr. Sarah Jenkins
                        </p>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-white text-blue-600 shadow-sm flex items-center justify-center group-hover/class:bg-blue-600 group-hover/class:text-white transition-colors shrink-0">
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                  {/* Masterclass 2 */}
                  <div className="p-5 rounded-2xl bg-indigo-50 border border-indigo-100 hover:bg-indigo-100 transition-colors group/class cursor-pointer relative overflow-hidden shadow-sm hover:shadow-md">
                    <div className="absolute top-0 right-0 w-16 h-16 bg-indigo-200 rounded-bl-full opacity-50 transition-transform group-hover/class:scale-125"></div>
                    <div className="flex items-start justify-between relative z-10">
                      <div>
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider mb-2 block">Friday, 2:00 PM</span>
                        <h3 className="text-lg font-bold text-gray-900 mb-1 leading-snug">Speed Reading Fundamentals</h3>
                        <p className="text-sm font-medium text-gray-600 flex items-center gap-2 mt-2">
                          <img className="w-5 h-5 rounded-full border border-white bg-white shadow-sm" src="https://api.dicebear.com/7.x/micah/svg?seed=James" alt="Prof. James" />
                          Prof. James Cole
                        </p>
                      </div>
                      <button className="w-10 h-10 rounded-full bg-white text-indigo-600 shadow-sm flex items-center justify-center group-hover/class:bg-indigo-600 group-hover/class:text-white transition-colors shrink-0">
                        <Calendar className="w-5 h-5" />
                      </button>
                    </div>
                  </div>

                </div>

                <div className="mt-8 pt-6 border-t border-gray-100">
                  <Link href="#" className="w-full text-center text-sm font-bold text-blue-600 hover:text-blue-700 transition-colors flex items-center justify-center gap-2">
                    View full schedule <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>

              </div>
            </ScrollReveal>
          </div>
        </div>
      </div>

      {/* 2. Main Content Section (Light Theme Integration) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 space-y-32">
        
        {/* Hero Section */}
        <ScrollReveal id="overview" className="relative scroll-mt-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            
            {/* Left: Animated Brain Graphic */}
            <div className="order-2 lg:order-1">
              <AnimatedBrain />
            </div>

            {/* Right: Content Split */}
            <div className="order-1 lg:order-2 space-y-8 text-center lg:text-left">
              <div className="flex flex-col items-center lg:items-start gap-4">
                <h2 className="text-orange-500 font-black tracking-[0.2em] uppercase text-sm drop-shadow-sm">— Overview —</h2>
                <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary-50 text-primary-600 font-bold text-sm shadow-sm border border-primary-100">
                  <ShieldCheck className="w-4 h-4" />
                  <span>The Premier Mind Training Institute</span>
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-emerald-600 tracking-tight leading-tight">
                Unlock Your Brain's <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-500 via-primary-600 to-orange-400">
                  True Potential
                </span>
              </h1>
              
              <div className="space-y-6">
                <p className="text-[1.1rem] md:text-xl text-slate-700 leading-relaxed font-medium">
                  VieBrain is a revolutionary mind training institute dedicated to enhancing cognitive skills across all age groups through engaging, <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-1 rounded-lg shadow-sm border border-emerald-100">scientifically-designed exercises</span>.
                </p>
                <p className="text-[1.1rem] md:text-xl text-slate-700 leading-relaxed font-medium">
                  Our <span className="text-primary-700 font-bold bg-primary-50 px-2 py-1 rounded-lg shadow-sm border border-primary-100">personalized learning algorithms</span> adapt to your unique brain patterns, ensuring you receive the optimal challenge.
                </p>
                <p className="text-[1.1rem] md:text-xl text-slate-700 leading-relaxed font-medium">
                  Embark on a journey of continuous <span className="text-orange-600 font-bold bg-orange-50 px-2 py-1 rounded-lg shadow-sm border border-orange-100">cognitive growth</span> and mental empowerment.
                </p>
              </div>

              <div className="pt-4 flex justify-center lg:justify-start">
                <Link
                  href="/games"
                  className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1"
                >
                  <Gamepad2 className="w-6 h-6 text-white" />
                  Start Training
                </Link>
              </div>
            </div>
          </div>
        </ScrollReveal>

        {/* What We Do - Stunning Cards */}
        <section id="features" className="scroll-mt-24 space-y-12 pt-8">
          <div className="flex flex-col items-center gap-4">
            <h2 className="text-orange-500 font-black tracking-[0.2em] uppercase text-sm drop-shadow-sm">— Features —</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {features.map((feature, index) => (
            <ScrollReveal
              key={index}
              delay={index * 0.15}
              className="relative p-6 bg-surface rounded-[1.5rem] border border-gray-100 shadow-lg hover:shadow-xl hover:-translate-y-2 transition-all duration-500 overflow-hidden group flex flex-col"
            >
              {/* Card Gradient Background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${feature.color} opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none`} />
              
              <div className="relative z-10 flex flex-col flex-grow">
                <div className="bg-gray-900 w-14 h-14 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500 shadow-md border border-gray-800">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-black text-foreground mb-4">{feature.title}</h3>
                
                <div className="flex-grow flex flex-col justify-between">
                  <ul className="space-y-2 mb-6">
                    {feature.stats.map((stat, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-700 font-bold text-sm">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        {stat}
                      </li>
                    ))}
                  </ul>
                  <div className={`inline-flex items-center justify-center w-full py-3 rounded-lg font-black text-base ${feature.metricBg} ${feature.metricColor} border shadow-sm group-hover:scale-[1.02] transition-transform duration-300`}>
                    {feature.metric}
                  </div>
                </div>
              </div>
            </ScrollReveal>
          ))}
          </div>
        </section>

        {/* Programs For Everyone - Premium Glassmorphism Cards */}
        <section className="space-y-16 pt-16 border-t border-gray-100 relative">
          <style dangerouslySetInnerHTML={{__html: `
            @keyframes floating {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-12px); }
            }
            @keyframes shimmer {
              0% { transform: translateX(-150%) skewX(-20deg); }
              100% { transform: translateX(200%) skewX(-20deg); }
            }
            .animate-floating-0 { animation: floating 6s ease-in-out infinite; }
            .animate-floating-1 { animation: floating 6s ease-in-out infinite 1.5s; }
            .animate-floating-2 { animation: floating 6s ease-in-out infinite 3s; }
          `}} />
          <ScrollReveal className="text-center space-y-4">
            <h2 className="text-emerald-500 font-black tracking-[0.2em] uppercase text-sm drop-shadow-sm">— Who Benefits? —</h2>
            <h3 className="text-4xl md:text-5xl font-black text-slate-800 tracking-tight">Programs For Everyone</h3>
          </ScrollReveal>

          <ScrollReveal className="relative max-w-6xl mx-auto px-4 sm:px-6">
            {/* Background ambient glow to enhance glassmorphism */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[500px] bg-gradient-to-r from-orange-100 via-emerald-100 to-primary-100 rounded-full blur-[100px] opacity-50 pointer-events-none -z-10"></div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10 pt-4 items-start">
              
              {/* Card 1: Students */}
              <ProgramCard 
                animationClass="animate-floating-0"
                gradientHover="from-orange-400 via-orange-100"
                shadowHover="hover:shadow-[0_20px_40px_rgba(249,115,22,0.15)]"
                imageSrc="/images/student.png"
                imageAlt="Student reading"
                title="Students"
                subtitle="Better Learning"
                titleColorClass="text-orange-600"
                overlayColor="bg-orange-400/20 group-hover:bg-orange-400/0"
                details={{
                  description: "Tailored cognitive exercises designed to optimize study habits, enhance information retention, and reduce academic burnout.",
                  features: [
                    { title: "Speed Reading", desc: "Process text 3x faster" },
                    { title: "Laser Focus", desc: "Maintain attention for hours" },
                    { title: "Memory Mastery", desc: "Recall complex theories easily" }
                  ],
                  metric: { value: "A+", label: "Average Grade Increase" }
                }}
              />

              {/* Card 2: Professionals */}
              <ProgramCard 
                animationClass="animate-floating-1"
                gradientHover="from-emerald-400 via-emerald-100"
                shadowHover="hover:shadow-[0_20px_40px_rgba(16,185,129,0.15)]"
                imageSrc="/images/professional.png"
                imageAlt="Professional working"
                title="Professionals"
                subtitle="Peak Productivity"
                titleColorClass="text-emerald-600"
                overlayColor="bg-emerald-400/20 group-hover:bg-emerald-400/0"
                details={{
                  description: "High-performance mental conditioning for corporate leaders, creatives, and entrepreneurs looking to achieve their peak state.",
                  features: [
                    { title: "Strategic Thinking", desc: "Solve complex problems" },
                    { title: "Stress Resilience", desc: "Stay calm under pressure" },
                    { title: "Flow State", desc: "Enter deep work on command" }
                  ],
                  metric: { value: "3.5h", label: "Extra Productive Time" }
                }}
              />

              {/* Card 3: Seniors */}
              <ProgramCard 
                animationClass="animate-floating-2"
                gradientHover="from-primary-400 via-primary-100"
                shadowHover="hover:shadow-[0_20px_40px_rgba(99,102,241,0.15)]"
                imageSrc="/images/senior.png"
                imageAlt="Senior solving puzzle"
                title="Seniors"
                subtitle="Cognitive Wellness"
                titleColorClass="text-primary-600"
                overlayColor="bg-primary-400/20 group-hover:bg-primary-400/0"
                details={{
                  description: "Gentle yet effective neuro-stimulating games to preserve mental agility, protect memory, and maintain an independent lifestyle.",
                  features: [
                    { title: "Memory Preservation", desc: "Keep facts at your fingertips" },
                    { title: "Cognitive Agility", desc: "Adapt to new situations" },
                    { title: "Mental Sharpness", desc: "Engage fully in conversations" }
                  ],
                  metric: { value: "-45%", label: "Cognitive Decline Risk" }
                }}
              />

            </div>
          </ScrollReveal>
        </section>

        {/* Mega Milestone Glimpse Section */}
        <MegaMilestoneGlimpse />

        {/* Testimonials Section */}
        <section id="testimonials" className="scroll-mt-24 space-y-16">
          <ScrollReveal className="text-center space-y-6">
            <div className="flex justify-center mb-4">
              <div className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-100 to-orange-50 px-4 py-2 rounded-full border border-orange-200 shadow-sm">
                <ShieldCheck className="w-5 h-5 text-orange-600" />
                <span className="text-orange-800 font-bold text-sm tracking-wide uppercase">26 Years of Excellence</span>
              </div>
            </div>
            <div className="flex flex-col items-center gap-4">
              <h2 className="text-orange-500 font-black tracking-[0.2em] uppercase text-sm drop-shadow-sm">— Testimonials —</h2>
              <h3 className="text-4xl md:text-5xl font-black text-foreground tracking-tight">Success Stories</h3>
            </div>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
              Hear from our community of lifelong learners who have transformed their cognitive abilities and unlocked their true potential.
            </p>
          </ScrollReveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                quote: "My memory improved dramatically within weeks.",
                metrics: [
                  { label: "Recall", value: "+95%" },
                  { label: "Focus", value: "+89%" }
                ],
                name: "Rahul Sharma",
                role: "School Student",
                emoji: "👦",
                roleEmoji: "🎓",
                theme: {
                  quote: "text-emerald-100",
                  bg: "bg-emerald-100",
                  border: "border-emerald-200",
                  icon: "text-emerald-500",
                  text: "text-emerald-600"
                }
              },
              {
                quote: "My decision-making speed is faster than ever.",
                metrics: [
                  { label: "Agility", value: "+110%" },
                  { label: "Clarity", value: "+85%" }
                ],
                name: "Priya Patel",
                role: "Corporate Executive",
                emoji: "👩‍💼",
                roleEmoji: "💼",
                theme: {
                  quote: "text-blue-100",
                  bg: "bg-blue-100",
                  border: "border-blue-200",
                  icon: "text-blue-500",
                  text: "text-blue-600"
                }
              },
              {
                quote: "I feel mentally sharper and more energetic.",
                metrics: [
                  { label: "Retention", value: "+92%" },
                  { label: "Alertness", value: "+88%" }
                ],
                name: "Anil Gupta",
                role: "Retired Professor",
                emoji: "👴",
                roleEmoji: "📚",
                theme: {
                  quote: "text-orange-100",
                  bg: "bg-orange-100",
                  border: "border-orange-200",
                  icon: "text-orange-500",
                  text: "text-orange-600"
                }
              }
            ].map((testimonial, index) => (
              <ScrollReveal key={index} delay={index * 0.15} className="relative flex flex-col p-8 bg-white rounded-[2rem] border border-gray-100 shadow-xl hover:shadow-2xl transition-all duration-300 h-full group">
                <div className={`text-6xl ${testimonial.theme.quote} font-serif leading-none mb-2 absolute top-6 right-8 group-hover:scale-110 transition-transform`}>❝</div>
                <p className="text-2xl font-black text-slate-800 leading-snug mb-8 relative z-10 flex-grow">
                  "{testimonial.quote}"
                </p>
                <div className={`-mx-8 px-8 py-6 mb-8 ${testimonial.theme.bg} border-y ${testimonial.theme.border} space-y-3`}>
                  {testimonial.metrics.map((metric, i) => (
                    <div key={i} className="flex items-center gap-3 text-slate-700 font-bold">
                      <CheckCircle2 className={`w-5 h-5 ${testimonial.theme.icon} shrink-0`} />
                      <span>{metric.label} <span className={testimonial.theme.text}>{metric.value}</span></span>
                    </div>
                  ))}
                </div>

                <div className="flex flex-col gap-1 border-t border-gray-100 pt-6">
                  <div className="flex items-center gap-3 font-black text-slate-900 text-lg">
                    <span className="text-2xl">{testimonial.emoji}</span>
                    <h4>{testimonial.name}</h4>
                  </div>
                  <div className="flex items-center gap-3 text-slate-500 font-bold">
                    <span className="text-2xl">{testimonial.roleEmoji}</span>
                    <span>{testimonial.role}</span>
                  </div>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </section>

        {/* CTA Section */}
        <ScrollReveal className="text-center space-y-10 bg-gradient-to-br from-primary-50 to-surface border border-primary-100 rounded-[3rem] p-12 md:p-20 shadow-xl relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-64 h-64 bg-primary-200/50 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-accent-200/50 rounded-full blur-[80px] group-hover:scale-150 transition-transform duration-700 delay-100" />
          
          <div className="relative z-10">
            <h2 className="text-4xl md:text-5xl font-black text-foreground mb-6">Ready to Forge a Stronger Mind?</h2>
            <p className="text-xl text-text-muted mb-10 max-w-2xl mx-auto">Join thousands of students who are already improving their cognitive skills with VieBrain.</p>
            <Link
              href="/games"
              className="inline-flex items-center gap-3 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-2xl font-bold text-lg transition-all shadow-[0_0_40px_rgba(16,185,129,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.6)] ring-4 ring-emerald-500/30 hover:-translate-y-1"
            >
              <Gamepad2 className="w-6 h-6 text-emerald-100 animate-pulse" />
              Explore Our Games
            </Link>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
