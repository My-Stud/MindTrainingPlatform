"use client"

import { motion } from "framer-motion"
import { Mail, ArrowRight, Sparkles } from "lucide-react"
import Link from "next/link"

export default function VerifyRequest() {
  return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center relative overflow-hidden px-4">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-indigo-500/20 rounded-full blur-[128px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <div className="bg-white/[0.03] border border-white/[0.05] rounded-3xl p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden text-center">
          {/* Glassmorphism shine effect */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />
          
          <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-8 shadow-lg shadow-green-500/30">
            <Mail className="w-10 h-10 text-white" />
          </div>
          
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-white/70 mb-4">
            Check your inbox
          </h1>
          
          <p className="text-white/70 text-base mb-8 leading-relaxed">
            A sign in link has been sent to your email address. 
            Click the link in the email to sign in instantly.
          </p>

          <div className="bg-white/5 border border-white/10 rounded-2xl p-6 text-sm text-white/60 mb-8 flex items-start gap-3 text-left">
            <Sparkles className="w-5 h-5 text-purple-400 shrink-0 mt-0.5" />
            <p>
              If you don't see it in your inbox, make sure to check your spam folder or promotions tab.
            </p>
          </div>

          <Link 
            href="/"
            className="inline-flex items-center justify-center gap-2 text-white font-medium hover:text-purple-400 transition-colors w-full bg-white/5 hover:bg-white/10 py-3 rounded-xl border border-white/10"
          >
            <ArrowRight className="w-4 h-4 rotate-180" />
            Back to Home
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
