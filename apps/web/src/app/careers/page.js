"use client";

import { Rocket, Brain, Heart, Zap, ArrowRight, Briefcase } from "lucide-react";
import Image from "next/image";

export default function CareersPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      
      {/* Banner Image below navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative w-full h-[250px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg">
          <Image 
            src="/images/banners/brain_neural_network.png" 
            alt="Brain Neural Network Banner" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 to-orange-900/60 flex items-center justify-center">
             <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                Join Our <span className="text-orange-400">Mission</span>
             </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            We're building the future of cognitive training. If you're passionate about unlocking human potential, we'd love to have you on our team.
          </p>
        </div>

        {/* Core Values / Why Join Us */}
        <div className="mb-20">
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-10">Why VieBrain?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300 border-t-4 border-t-emerald-500">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Brain className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Impactful Work</h3>
              <p className="text-slate-600 leading-relaxed">
                Help individuals of all ages enhance their cognitive abilities and reach their true potential through scientifically designed exercises.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300 border-t-4 border-t-orange-500">
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6">
                <Heart className="w-6 h-6 text-orange-500" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Inclusive Culture</h3>
              <p className="text-slate-600 leading-relaxed">
                We foster a supportive and collaborative environment where every voice is heard and diverse perspectives are celebrated.
              </p>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300 border-t-4 border-t-emerald-500">
              <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6">
                <Zap className="w-6 h-6 text-emerald-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 mb-3">Continuous Growth</h3>
              <p className="text-slate-600 leading-relaxed">
                Just as we train minds, we invest in the professional and personal development of our team members.
              </p>
            </div>

          </div>
        </div>

        {/* Open Positions Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden p-8 md:p-12">
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 mb-10">
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">Open Positions</h2>
              <p className="text-slate-600">Discover your next career move with us.</p>
            </div>
            <div className="hidden md:block p-4 bg-orange-50 rounded-full">
              <Briefcase className="w-8 h-8 text-orange-500" />
            </div>
          </div>

          <div className="space-y-6">
            
            {/* Empty State / General Application */}
            <div className="text-center py-12 bg-slate-50 rounded-2xl border border-dashed border-slate-300">
              <Rocket className="w-12 h-12 text-slate-400 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-slate-900 mb-2">No open positions right now</h3>
              <p className="text-slate-600 max-w-md mx-auto mb-6">
                We're always looking for talented individuals. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <a 
                href="mailto:careers@viebrain.com" 
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-semibold py-3 px-6 rounded-full transition-colors shadow-md"
              >
                Send Resume <ArrowRight className="w-4 h-4" />
              </a>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
}
