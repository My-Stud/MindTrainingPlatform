"use client";

import { MapPin, Phone, Mail, Clock, MessageCircle } from "lucide-react";
import Image from "next/image";

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-12">
      
      {/* Banner Image below navigation */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-12">
        <div className="relative w-full h-[250px] md:h-[400px] rounded-3xl overflow-hidden shadow-lg">
          <Image 
            src="/images/banners/cognitive_interface.png" 
            alt="Cognitive Interface Banner" 
            fill
            className="object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-900/70 to-orange-900/60 flex items-center justify-center">
             <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight drop-shadow-md">
                Get in <span className="text-orange-400">Touch</span>
             </h1>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-4 mb-16">
          <p className="max-w-2xl mx-auto text-lg text-slate-600">
            Have questions about our cognitive training programs? We're here to help you elevate your mind. Reach out to us through any of the channels below.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          {/* Address Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300 group border-t-4 border-t-emerald-500">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
              <MapPin className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Visit Us</h3>
            <p className="text-slate-600 leading-relaxed">
              11A, 2ND FLOOR, STATION SQUARE, MASTER CANTEEN,<br />
              BHUBANESWAR-751001. ODISHA.
            </p>
          </div>

          {/* Contact Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300 group border-t-4 border-t-orange-500">
            <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-orange-500 transition-colors duration-300">
              <Phone className="w-6 h-6 text-orange-500 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Call or WhatsApp</h3>
            <div className="space-y-3">
              <a href="tel:+919583075319" className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors">
                <Phone className="w-4 h-4" />
                <span>+91- 9583075319</span>
              </a>
              <a href="https://wa.me/919583075319" className="flex items-center gap-2 text-slate-600 hover:text-orange-500 transition-colors" target="_blank" rel="noopener noreferrer">
                <MessageCircle className="w-4 h-4" />
                <span>+91- 9583075319</span>
              </a>
            </div>
          </div>

          {/* Email Card */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 hover:shadow-md transition-shadow duration-300 group border-t-4 border-t-emerald-500">
            <div className="w-12 h-12 bg-emerald-100 rounded-xl flex items-center justify-center mb-6 group-hover:bg-emerald-600 transition-colors duration-300">
              <Mail className="w-6 h-6 text-emerald-600 group-hover:text-white transition-colors duration-300" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-3">Email Us</h3>
            <a href="mailto:support@viebrain.com" className="text-slate-600 hover:text-emerald-600 transition-colors flex items-center gap-2">
              <Mail className="w-4 h-4" />
              <span>support@viebrain.com</span>
            </a>
            <p className="text-sm text-slate-500 mt-4">
              We typically respond within 24 hours during business days.
            </p>
          </div>

        </div>

        {/* Form Section */}
        <div className="mt-16 bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden flex flex-col md:flex-row">
          <div className="bg-gradient-to-br from-emerald-600 to-emerald-800 p-10 md:w-2/5 text-white flex flex-col justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-4">Send us a message</h2>
              <p className="text-emerald-100 leading-relaxed mb-8">
                Fill out the form and our team will get back to you within 24 hours. Let's elevate your mind together!
              </p>
            </div>
            <div className="space-y-4 text-emerald-100">
              <div className="flex items-center gap-3">
                <Clock className="w-5 h-5 text-orange-300" />
                <span>Mon-Fri: 9:00 AM - 6:00 PM</span>
              </div>
            </div>
          </div>
          <div className="p-10 md:w-3/5">
            <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">First Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="John" />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Last Name</label>
                  <input type="text" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="Doe" />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Email Address</label>
                <input type="email" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-all" placeholder="john@example.com" />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium text-slate-700">Message</label>
                <textarea rows="4" className="w-full px-4 py-3 rounded-lg border border-slate-200 focus:ring-2 focus:ring-orange-500 focus:border-orange-500 outline-none transition-all" placeholder="How can we help you?"></textarea>
              </div>
              <button className="w-full bg-orange-500 hover:bg-orange-600 text-white font-bold py-3 px-6 rounded-lg transition-colors shadow-md">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
