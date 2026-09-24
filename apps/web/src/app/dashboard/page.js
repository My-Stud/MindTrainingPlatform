"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { Brain, Activity, Zap, Target, Star, Clock, Gamepad2, ArrowRight, Flame, Trophy, TrendingUp } from "lucide-react";
import Link from "next/link";

export default function Dashboard() {
  const { data: session } = useSession();
  const userName = session?.user?.name || session?.user?.email?.split('@')[0] || "Explorer";

  const [dashboardData, setDashboardData] = useState({ notifications: [], assignedExams: [] });
  const [isLoadingData, setIsLoadingData] = useState(true);
  
  useEffect(() => {
    if (session) {
      fetch("/api/user/dashboard-data")
        .then(res => res.json())
        .then(data => {
          if (!data.error) {
            setDashboardData(data)
          }
        })
        .finally(() => setIsLoadingData(false))
    }
  }, [session])

  // Mock Data
  const user = {
    name: userName,
    streak: 12,
    brainPoints: 4500,
  };

  const cognitiveScores = [
    { name: "Memory", score: 85, color: "text-emerald-500", bg: "bg-emerald-100", bar: "bg-emerald-500" },
    { name: "Focus", score: 72, color: "text-orange-500", bg: "bg-orange-100", bar: "bg-orange-500" },
    { name: "Speed", score: 90, color: "text-blue-500", bg: "bg-blue-100", bar: "bg-blue-500" },
    { name: "Logic", score: 65, color: "text-violet-500", bg: "bg-violet-100", bar: "bg-violet-500" },
    { name: "Flexibility", score: 78, color: "text-pink-500", bg: "bg-pink-100", bar: "bg-pink-500" },
  ];

  const recentActivity = [
    { id: 1, name: "Memory Matrix", score: "95%", time: "2 hours ago", icon: Brain, type: "game" },
    { id: 2, name: "Speed Match", score: "88%", time: "Yesterday", icon: Zap, type: "game" },
    { id: 3, name: "Focus Mastery", score: "Lesson 4", time: "2 days ago", icon: Target, type: "course" },
  ];

  const recommended = [
    { id: 1, name: "Logic Puzzles", desc: "Boost your lowest score", icon: Activity, colorClass: "text-violet-500", bgClass: "bg-violet-100" },
    { id: 2, name: "Daily Teaser", desc: "Maintain your streak!", icon: Flame, colorClass: "text-orange-500", bgClass: "bg-orange-100" },
  ];

  return (
    <div className="min-h-screen bg-slate-50 pb-20 pt-8">
      {/* Header Banner */}
      <div className="bg-emerald-700 text-white py-16 px-4 sm:px-6 lg:px-8 relative overflow-hidden rounded-3xl mx-4 sm:mx-6 lg:mx-8 mb-8 shadow-xl shadow-emerald-900/20">
        <div className="absolute top-0 right-0 opacity-10 pointer-events-none">
          <Brain className="w-96 h-96 -mt-20 -mr-20" />
        </div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col md:flex-row items-center justify-between gap-6"
          >
            <div>
              <h1 className="text-4xl md:text-5xl font-black mb-2 tracking-tight">
                Welcome back, {user.name}! 👋
              </h1>
              <p className="text-emerald-100 text-lg">
                Ready to elevate your mind today?
              </p>
            </div>
            
            <div className="flex gap-4">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center min-w-[120px]">
                <div className="flex items-center gap-2 text-orange-400 mb-1">
                  <Flame className="w-6 h-6 fill-orange-400" />
                  <span className="text-2xl font-bold text-white">{user.streak}</span>
                </div>
                <span className="text-emerald-50 text-sm font-medium">Day Streak</span>
              </div>
              
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 flex flex-col items-center min-w-[120px]">
                <div className="flex items-center gap-2 text-yellow-400 mb-1">
                  <Star className="w-6 h-6 fill-yellow-400" />
                  <span className="text-2xl font-bold text-white">{user.brainPoints}</span>
                </div>
                <span className="text-emerald-50 text-sm font-medium">Brain Points</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-20">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Left Column (Cognitive Profile) */}
          <div className="lg:col-span-2 space-y-8">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-3xl p-6 sm:p-8 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <div className="flex items-center justify-between mb-8">
                <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-3">
                  <Brain className="w-7 h-7 text-emerald-500" />
                  Your Cognitive Profile
                </h2>
                <button className="text-emerald-600 hover:text-emerald-700 text-sm font-bold flex items-center gap-1 transition-colors">
                  Detailed Report <ArrowRight className="w-4 h-4" />
                </button>
              </div>
              
              <div className="space-y-6">
                {cognitiveScores.map((stat, idx) => (
                  <div key={idx}>
                    <div className="flex justify-between text-sm font-bold mb-2">
                      <span className="text-slate-700">{stat.name}</span>
                      <span className={stat.color}>{stat.score}%</span>
                    </div>
                    <div className={`h-3 w-full ${stat.bg} rounded-full overflow-hidden`}>
                      <motion.div 
                        initial={{ width: 0 }}
                        animate={{ width: `${stat.score}%` }}
                        transition={{ duration: 1, delay: 0.2 + idx * 0.1 }}
                        className={`h-full ${stat.bar} rounded-full`}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Recommended Section */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <h3 className="text-xl font-bold text-slate-800 mb-4 flex items-center gap-2 px-2">
                <TrendingUp className="w-6 h-6 text-orange-500" />
                Recommended for You
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {recommended.map((item, idx) => {
                  const Icon = item.icon;
                  return (
                    <Link href="/games" key={idx} className="group bg-white rounded-2xl p-5 border border-slate-200 hover:border-orange-300 hover:shadow-lg hover:shadow-orange-100 transition-all">
                      <div className="flex items-center gap-4">
                        <div className={`w-12 h-12 rounded-xl ${item.bgClass} ${item.colorClass} flex items-center justify-center group-hover:scale-110 transition-transform`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <div>
                          <h4 className="font-bold text-slate-800">{item.name}</h4>
                          <p className="text-sm text-slate-500">{item.desc}</p>
                        </div>
                      </div>
                    </Link>
                  )
                })}
              </div>
            </motion.div>
          </div>

          {/* Right Column (Sidebar) */}
          <div className="space-y-8">
            {/* Notifications & Exams */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-emerald-100 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-50 rounded-bl-full -z-0" />
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2 relative z-10">
                <Target className="w-6 h-6 text-emerald-500" />
                Game Alert
              </h3>
              
              <div className="space-y-3 relative z-10">
                {isLoadingData ? (
                   <p className="text-sm text-slate-500">Loading alerts...</p>
                ) : (
                  <>
                    {dashboardData.notifications.length === 0 && dashboardData.assignedExams.length === 0 && (
                      <p className="text-sm text-slate-500 italic">No new notifications.</p>
                    )}
                    
                    {dashboardData.assignedExams.map(exam => (
                      <div key={`exam-${exam.id}`} className="bg-emerald-50 border border-emerald-100 rounded-xl p-3">
                         <h4 className="font-bold text-emerald-900 text-sm">{exam.questionSet.name}</h4>
                         <p className="text-xs text-emerald-700 mt-1">
                           Scheduled: {new Date(exam.scheduledFor).toLocaleString()}
                         </p>
                      </div>
                    ))}

                    {dashboardData.notifications.map(notif => (
                      <div key={notif.id} className="bg-sky-50 border border-sky-200 rounded-xl p-3 mb-2 last:mb-0 shadow-sm flex flex-col gap-2">
                         <div className="flex gap-2 items-center overflow-hidden">
                           <div className="w-2 h-2 rounded-full bg-sky-500 shrink-0 animate-pulse shadow-[0_0_8px_rgba(14,165,233,0.8)]" />
                           {/* Using marquee for a simple, robust horizontal scroll effect */}
                           <marquee scrollamount="4" className="text-sm font-bold text-sky-900 whitespace-nowrap">{notif.message}</marquee>
                         </div>
                         {notif.message.includes('Country Shooter') && (
                           <Link href="/games/country-shooter" className="self-end bg-gradient-to-r from-sky-400 to-blue-500 hover:from-sky-500 hover:to-blue-600 text-white text-xs font-bold py-1.5 px-4 rounded-lg transition-colors flex items-center gap-1 shadow-sm">
                             Play Now <ArrowRight className="w-3 h-3" />
                           </Link>
                         )}
                      </div>
                    ))}
                  </>
                )}
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100"
            >
              <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-500" />
                Recent Activity
              </h3>
              
              <div className="space-y-4">
                {recentActivity.map((activity, idx) => {
                  const Icon = activity.icon;
                  return (
                    <div key={idx} className="flex items-center gap-4 p-3 rounded-2xl hover:bg-slate-50 transition-colors">
                      <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-600 shrink-0">
                        <Icon className="w-5 h-5" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-800 truncate">{activity.name}</h4>
                        <p className="text-xs text-slate-500">{activity.time}</p>
                      </div>
                      <div className="font-black text-emerald-600">
                        {activity.score}
                      </div>
                    </div>
                  )
                })}
              </div>
              
              <Link href="/profile" className="mt-6 block text-center text-sm font-bold text-slate-500 hover:text-emerald-600 transition-colors">
                View Full History
              </Link>
            </motion.div>

            {/* Badges Preview */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-gradient-to-br from-indigo-600 to-violet-700 rounded-3xl p-6 text-white shadow-xl shadow-indigo-200 relative overflow-hidden"
            >
              <h3 className="text-xl font-bold mb-6 flex items-center gap-2 relative z-10">
                <Trophy className="w-6 h-6 text-yellow-400" />
                Latest Achievements
              </h3>
              <div className="flex gap-4 relative z-10">
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-yellow-400/20 border-2 border-yellow-400 flex items-center justify-center">
                    <Flame className="w-7 h-7 text-yellow-400" />
                  </div>
                  <span className="text-xs font-bold text-indigo-100">10 Day Streak</span>
                </div>
                <div className="flex flex-col items-center gap-2">
                  <div className="w-14 h-14 rounded-full bg-emerald-400/20 border-2 border-emerald-400 flex items-center justify-center">
                    <Brain className="w-7 h-7 text-emerald-400" />
                  </div>
                  <span className="text-xs font-bold text-indigo-100">Memory Pro</span>
                </div>
              </div>
            </motion.div>

          </div>

        </div>
      </div>
    </div>
  );
}
