"use client"

import { useState } from "react"
import { signIn } from "next-auth/react"
import { motion, AnimatePresence } from "framer-motion"
import { Brain, ArrowRight, Mail, Sparkles, Lock, User, GraduationCap } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"

export default function SignIn() {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState("signin") // "signin" or "signup"
  
  // Shared state
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState("")
  
  // Sign-in specific state
  const [loginMethod, setLoginMethod] = useState("password") // "password" or "magic_link"
  const [isSuccess, setIsSuccess] = useState(false)
  
  // Sign-up specific state
  const [name, setName] = useState("")
  const [studentClass, setStudentClass] = useState("")
  const [customClass, setCustomClass] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")

  const handleSignIn = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    try {
      if (loginMethod === "magic_link") {
        const result = await signIn("email", {
          email,
          redirect: false,
          callbackUrl: "/dashboard",
        })

        if (result?.error) {
          setError("Failed to send login link. Please try again.")
        } else {
          setIsSuccess(true)
        }
      } else {
        const result = await signIn("credentials", {
          identifier: email,
          password,
          redirect: false,
        })

        if (result?.error) {
          setError("Invalid email or password.")
        } else {
          router.push("/dashboard")
          router.refresh()
        }
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    setError("")

    if (password !== confirmPassword) {
      setError("Passwords do not match")
      setIsLoading(false)
      return
    }
    
    if (!studentClass) {
      setError("Please select a class")
      setIsLoading(false)
      return
    }

    let finalClass = studentClass
    if (studentClass === "Govt. Exams" || studentClass === "Others") {
      if (!customClass) {
        setError(`Please specify your ${studentClass === "Govt. Exams" ? "exam name" : "class/exam"}`)
        setIsLoading(false)
        return
      }
      finalClass = studentClass === "Govt. Exams" ? `Govt. Exams - ${customClass}` : customClass
    }

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, studentClass: finalClass }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || "Failed to create account")
        setIsLoading(false)
        return
      }

      // Automatically sign them in after registration
      const result = await signIn("credentials", {
        identifier: email,
        password,
        redirect: false,
      })

      if (result?.error) {
        setError("Account created, but failed to automatically log in. Please try signing in.")
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    } catch (err) {
      setError("An unexpected error occurred.")
    } finally {
      setIsLoading(false)
    }
  }

  const CLASSES = [
    "Nursery", "LKG", "UKG", 
    ...Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`), 
    "NEET", "JEE", "Govt. Exams", "Others"
  ]

  return (
    <div className="min-h-screen bg-gray-50 text-slate-900 flex items-center justify-center relative overflow-hidden px-4 py-12">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-[128px]" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-teal-500/10 rounded-full blur-[128px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md relative z-10"
      >
        <Link href="/" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-900 mb-6 transition-colors">
          <ArrowRight className="w-4 h-4 rotate-180" />
          <span className="text-sm font-medium">Back to Home</span>
        </Link>

        <div className="bg-white border border-gray-100 rounded-3xl p-8 shadow-xl relative overflow-hidden">
          
          <div className="flex flex-col items-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-2xl flex items-center justify-center mb-4 shadow-lg shadow-emerald-500/30">
              <Brain className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-slate-900 to-slate-600 text-center mb-2">
              {activeTab === "signin" ? "Welcome Back" : "Create Account"}
            </h1>
            <p className="text-slate-500 text-center text-sm">
              {activeTab === "signin" ? "Sign in to continue your journey." : "Join VieBrain to start training your mind."}
            </p>
          </div>
          
          {/* Tabs */}
          <div className="flex p-1 bg-slate-100 rounded-xl mb-6">
             <button 
                onClick={() => { setActiveTab("signin"); setError(""); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === "signin" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
             >
                Sign In
             </button>
             <button 
                onClick={() => { setActiveTab("signup"); setError(""); }}
                className={`flex-1 py-2 text-sm font-semibold rounded-lg transition-colors ${activeTab === "signup" ? "bg-white text-emerald-600 shadow-sm" : "text-slate-500 hover:text-slate-700"}`}
             >
                Create Account
             </button>
          </div>

          {activeTab === "signin" && isSuccess && loginMethod === "magic_link" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-green-50 border border-green-100 rounded-2xl p-6 text-center"
            >
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Sparkles className="w-6 h-6 text-green-500" />
              </div>
              <h3 className="text-green-700 font-medium mb-2">Check your inbox!</h3>
              <p className="text-green-600 text-sm">
                We've sent a magic link to <span className="text-green-800 font-medium">{email}</span>. Click the link to sign in instantly.
              </p>
            </motion.div>
          ) : (
            <form onSubmit={activeTab === "signin" ? handleSignIn : handleSignUp} className="space-y-4">
              
              {/* Sign Up Fields */}
              <AnimatePresence>
                {activeTab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-4 overflow-hidden"
                  >
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-slate-700 mb-1">
                        Display Name
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <User className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                          id="name"
                          type="text"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required={activeTab === "signup"}
                          placeholder="Your Name"
                          className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="class" className="block text-sm font-medium text-slate-700 mb-1">
                        Select Class
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <GraduationCap className="w-5 h-5 text-slate-400" />
                        </div>
                        <select
                          id="class"
                          value={studentClass}
                          onChange={(e) => setStudentClass(e.target.value)}
                          required={activeTab === "signup"}
                          className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-3 pl-12 pr-4 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300 appearance-none"
                        >
                          <option value="" disabled>Select your class...</option>
                          {CLASSES.map(cls => (
                             <option key={cls} value={cls}>{cls}</option>
                          ))}
                        </select>
                        <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                           <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                        </div>
                      </div>
                    </div>

                    <AnimatePresence>
                      {(studentClass === "Govt. Exams" || studentClass === "Others") && (
                        <motion.div
                          initial={{ opacity: 0, height: 0, marginTop: 0 }}
                          animate={{ opacity: 1, height: "auto", marginTop: 16 }}
                          exit={{ opacity: 0, height: 0, marginTop: 0 }}
                          className="overflow-hidden"
                        >
                          <label htmlFor="customClass" className="block text-sm font-medium text-slate-700 mb-1">
                            {studentClass === "Govt. Exams" ? "Exam Name" : "Please Specify"}
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                              <GraduationCap className="w-5 h-5 text-slate-400" />
                            </div>
                            <input
                              id="customClass"
                              type="text"
                              value={customClass}
                              onChange={(e) => setCustomClass(e.target.value)}
                              required={activeTab === "signup" && (studentClass === "Govt. Exams" || studentClass === "Others")}
                              placeholder={studentClass === "Govt. Exams" ? "e.g., UPSC, SSC, Banking" : "e.g., College, Professional"}
                              className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                            />
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Shared Fields */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-1">
                  {activeTab === "signin" ? "Email or Username" : "Email Address"}
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <Mail className="w-5 h-5 text-slate-400" />
                  </div>
                  <input
                    id="email"
                    type={activeTab === "signin" ? "text" : "email"}
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder={activeTab === "signin" ? "Email or Username" : "you@example.com"}
                    className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                  />
                </div>
              </div>

              <AnimatePresence>
                {(activeTab === "signup" || loginMethod === "password") && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden space-y-4"
                  >
                    <div>
                      <label htmlFor="password" className="block text-sm font-medium text-slate-700 mb-1">
                        Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                          id="password"
                          type="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          required={activeTab === "signup" || loginMethod === "password"}
                          placeholder="••••••••"
                          className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
              
              <AnimatePresence>
                {activeTab === "signup" && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div>
                      <label htmlFor="confirmPassword" className="block text-sm font-medium text-slate-700 mb-1">
                        Confirm Password
                      </label>
                      <div className="relative">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                          <Lock className="w-5 h-5 text-slate-400" />
                        </div>
                        <input
                          id="confirmPassword"
                          type="password"
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required={activeTab === "signup"}
                          placeholder="••••••••"
                          className="w-full bg-white border border-gray-200 shadow-sm rounded-xl py-3 pl-12 pr-4 text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all duration-300"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 border border-red-100 py-2 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full relative group overflow-hidden rounded-xl bg-slate-900 text-white font-semibold py-3 mt-2 transition-all duration-300 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:hover:scale-100 shadow-md"
              >
                <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-emerald-400 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <span className="relative z-10 flex items-center justify-center gap-2">
                  {isLoading 
                    ? "Processing..." 
                    : activeTab === "signup"
                      ? "Create Account"
                      : loginMethod === "password" 
                        ? "Sign In" 
                        : "Send Magic Link"}
                  {!isLoading && <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />}
                </span>
              </button>

              {activeTab === "signin" && (
                <>
                  <div className="relative flex items-center py-2">
                    <div className="flex-grow border-t border-gray-200"></div>
                    <span className="flex-shrink-0 mx-4 text-slate-400 text-xs">OR</span>
                    <div className="flex-grow border-t border-gray-200"></div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setLoginMethod(loginMethod === "password" ? "magic_link" : "password");
                      setError("");
                    }}
                    className="w-full py-3 rounded-xl border border-gray-200 text-slate-600 font-medium hover:bg-gray-50 transition-colors duration-300"
                  >
                    {loginMethod === "password" ? "Sign in with Magic Link" : "Sign in with Password"}
                  </button>
                </>
              )}
            </form>
          )}
          
          <div className="mt-6 text-center">
            <p className="text-xs text-slate-400">
              By continuing, you agree to our Terms of Service and Privacy Policy.
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  )
}
