"use client";

import { useState } from "react";
import { HelpCircle, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import ScrollReveal from "../../components/ScrollReveal";
import Link from "next/link";

const faqs = [
  {
    question: "What is Viebrain?",
    answer: "Viebrain is a training center that helps children enhance their memory skills, general knowledge, and learning confidence using proven and fun memory techniques."
  },
  {
    question: "What age group do you train?",
    answer: "We train children from 2.5 years and above. Programs are designed based on the age, learning level, and comfort of each student."
  },
  {
    question: "How will memory training help my child?",
    answer: "Memory training helps children:\n• Remember faster during exams\n• Improve focus and concentration\n• Boost self-confidence and participation\n• Gain strong GK and academic knowledge\n• Perform better in school & competitions"
  },
  {
    question: "Do you offer online classes?",
    answer: "Yes! We provide both online and offline classes so children from anywhere can join our programs."
  },
  {
    question: "Are sessions conducted individually or in groups?",
    answer: "We offer:\n• One-to-one personalized sessions\n• Small group sessions\nBased on what is best for the child’s learning pace."
  },
  {
    question: "What programs do you offer?",
    answer: "Our training covers:\n• Countries & Capitals\n• World Map Pointing\n• World Flags\n• General Knowledge\n• Great Personalities\n• Memory Competitions & World Record Coaching\n• And many more exciting topics!"
  },
  {
    question: "Will my child receive certificates?",
    answer: "Yes! Children receive certificates for their achievements and participation in events, competitions, and record activities."
  },
  {
    question: "Do your students participate in world record events?",
    answer: "Absolutely! Many of our students have achieved national and world records in memory-based performances — and more are on the way!"
  },
  {
    question: "How are parents involved in the learning process?",
    answer: "We encourage parents to support children at home and stay updated with their progress through regular feedback sessions."
  },
  {
    question: "How can I enroll my child?",
    answer: "It’s simple!\n• Call: 9583075319\n• WhatsApp: +91 9583075319\n• Or visit our Contact page and send us a quick message."
  },
  {
    question: "Is a demo class available?",
    answer: "Yes! We provide trial/demo sessions so you can understand how our methods work before joining."
  },
  {
    question: "How long is the course duration?",
    answer: "Training duration depends on the selected program and student learning speed. We offer both short-term and long-term modules."
  },
  {
    question: "What makes Improve Memory Institute different?",
    answer: "Our Unique Advantages:\n• Kids-centered & fun learning environment\n• Proven memory techniques\n• Personalized training\n• Academic + Knowledge Growth\n• Track record of world record holders"
  }
];

function FAQItem({ faq, isOpen, onClick }) {
  return (
    <div className={`border-b border-gray-100 last:border-0 transition-all duration-300 ${isOpen ? 'bg-emerald-50/50' : 'hover:bg-gray-50'}`}>
      <button
        className="w-full py-6 px-6 md:px-8 flex items-center justify-between gap-6 text-left focus:outline-none"
        onClick={onClick}
      >
        <span className={`text-lg font-bold transition-colors duration-300 ${isOpen ? 'text-emerald-700' : 'text-slate-800'}`}>
          {faq.question}
        </span>
        <div className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 ${isOpen ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-gray-400'}`}>
          {isOpen ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
        </div>
      </button>
      <div 
        className={`overflow-hidden transition-all duration-500 ease-in-out ${isOpen ? 'max-h-[800px] opacity-100' : 'max-h-0 opacity-0'}`}
      >
        <div className="px-6 md:px-8 pb-8">
          <div className="text-gray-600 font-medium leading-relaxed space-y-2 whitespace-pre-wrap">
            {faq.answer}
          </div>
        </div>
      </div>
    </div>
  );
}

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <div className="min-h-screen bg-background pt-32 pb-24 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-600/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* Header Section */}
        <ScrollReveal className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-emerald-50 text-emerald-600 font-bold text-sm shadow-sm border border-emerald-100 mx-auto">
            <HelpCircle className="w-4 h-4" />
            <span>Got Questions?</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            Frequently Asked <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">Questions</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto font-medium leading-relaxed">
            Everything you need to know about our memory training programs, methodology, and how we help children achieve their full potential.
          </p>
        </ScrollReveal>

        {/* FAQ Accordion */}
        <ScrollReveal delay={0.2} className="bg-white rounded-[2rem] shadow-xl border border-gray-100 overflow-hidden">
          <div className="divide-y divide-gray-100">
            {faqs.map((faq, index) => (
              <FAQItem 
                key={index} 
                faq={faq} 
                isOpen={index === openIndex} 
                onClick={() => setOpenIndex(index === openIndex ? -1 : index)} 
              />
            ))}
          </div>
        </ScrollReveal>

        {/* Still Have Questions CTA */}
        <ScrollReveal delay={0.4} className="mt-12 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] p-10 md:p-14 text-center text-white shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/20 rounded-full blur-[80px]" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px]" />
          
          <div className="relative z-10 space-y-6">
            <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mx-auto backdrop-blur-sm border border-white/20 mb-6">
              <MessageCircle className="w-8 h-8 text-emerald-400" />
            </div>
            <h2 className="text-3xl font-black">Still have questions?</h2>
            <p className="text-slate-300 font-medium text-lg max-w-xl mx-auto">
              Can't find the answer you're looking for? Please chat to our friendly team.
            </p>
            <div className="pt-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg hover:shadow-emerald-500/30 hover:-translate-y-1"
              >
                Get in Touch
              </Link>
            </div>
          </div>
        </ScrollReveal>

      </div>
    </div>
  );
}
