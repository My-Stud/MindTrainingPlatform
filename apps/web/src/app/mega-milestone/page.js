"use client";

import { Trophy, Star, Target, Crown, Award, Leaf } from "lucide-react";
import ScrollReveal from "@/components/ScrollReveal";
import { motion } from "framer-motion";

const milestones = [
  {
    year: "2000",
    title: "The Foundation",
    description: "VieBrain was established with a mission to revolutionize cognitive training and unlock the true potential of the human mind.",
    icon: Star,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-100",
    text: "text-blue-500",
    theme: "blue",
    videoId: "iDLAaKw_5Uk",
    startAt: 0
  },
  {
    year: "2018",
    title: "National Recognition",
    description: "Featured on national television for our groundbreaking 'School for Future Einsteins' program and cognitive achievements.",
    icon: Target,
    color: "from-emerald-500 to-teal-500",
    bg: "bg-emerald-100",
    text: "text-emerald-500",
    theme: "emerald",
    videoId: "cgN4_VkEgME",
    startAt: 60
  },
  {
    year: "2020",
    title: "Digital Expansion",
    description: "Launched our comprehensive online platform, reaching students across the globe with advanced interactive training.",
    icon: Crown,
    color: "from-orange-500 to-amber-500",
    bg: "bg-orange-100",
    text: "text-orange-500",
    theme: "orange",
    videoId: "wH7wYNZ7ZLc",
    startAt: 0
  },
  {
    year: "2023",
    title: "Global Excellence",
    description: "Received the prestigious Global Excellence Award for continuous innovation in educational methodology and mind training.",
    icon: Award,
    color: "from-purple-500 to-pink-500",
    bg: "bg-purple-100",
    text: "text-purple-500",
    theme: "purple",
    videoId: "Kdy9PtTrrn8",
    startAt: 77
  },
  {
    year: "2024",
    title: "LIVE TEST OF GENIUS",
    description: "A live demonstration of extraordinary cognitive abilities and advanced mind training outcomes.",
    icon: Trophy,
    color: "from-blue-500 to-cyan-500",
    bg: "bg-blue-100",
    text: "text-blue-500",
    theme: "blue",
    videoId: "lAyEAy-jfBo",
    startAt: 0
  }
];

const themeStyles = {
  blue: {
    branchBorder: "border-blue-400",
    branchShadow: "drop-shadow-[0_0_8px_rgba(59,130,246,0.8)]",
    leafColor: "text-blue-500",
    leafFill: "fill-blue-200",
    leafShadow: "drop-shadow-[0_0_5px_rgba(59,130,246,0.8)]",
    cardBorder: "border-blue-100",
    cardHoverBg: "hover:bg-blue-50/50",
    cardHoverShadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]",
    videoBorder: "border-blue-200/50",
    videoHoverShadow: "hover:shadow-[0_0_30px_rgba(59,130,246,0.4)]",
    nodeShadow: "shadow-[0_0_15px_rgba(59,130,246,0.2)]",
    smallLeafFill: "fill-blue-400"
  },
  emerald: {
    branchBorder: "border-emerald-400",
    branchShadow: "drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]",
    leafColor: "text-emerald-500",
    leafFill: "fill-emerald-200",
    leafShadow: "drop-shadow-[0_0_5px_rgba(16,185,129,0.8)]",
    cardBorder: "border-emerald-100",
    cardHoverBg: "hover:bg-emerald-50/50",
    cardHoverShadow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.3)]",
    videoBorder: "border-emerald-200/50",
    videoHoverShadow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.4)]",
    nodeShadow: "shadow-[0_0_15px_rgba(16,185,129,0.2)]",
    smallLeafFill: "fill-emerald-400"
  },
  orange: {
    branchBorder: "border-orange-400",
    branchShadow: "drop-shadow-[0_0_8px_rgba(249,115,22,0.8)]",
    leafColor: "text-orange-500",
    leafFill: "fill-orange-200",
    leafShadow: "drop-shadow-[0_0_5px_rgba(249,115,22,0.8)]",
    cardBorder: "border-orange-100",
    cardHoverBg: "hover:bg-orange-50/50",
    cardHoverShadow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.3)]",
    videoBorder: "border-orange-200/50",
    videoHoverShadow: "hover:shadow-[0_0_30px_rgba(249,115,22,0.4)]",
    nodeShadow: "shadow-[0_0_15px_rgba(249,115,22,0.2)]",
    smallLeafFill: "fill-orange-400"
  },
  purple: {
    branchBorder: "border-purple-400",
    branchShadow: "drop-shadow-[0_0_8px_rgba(168,85,247,0.8)]",
    leafColor: "text-purple-500",
    leafFill: "fill-purple-200",
    leafShadow: "drop-shadow-[0_0_5px_rgba(168,85,247,0.8)]",
    cardBorder: "border-purple-100",
    cardHoverBg: "hover:bg-purple-50/50",
    cardHoverShadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.3)]",
    videoBorder: "border-purple-200/50",
    videoHoverShadow: "hover:shadow-[0_0_30px_rgba(168,85,247,0.4)]",
    nodeShadow: "shadow-[0_0_15px_rgba(168,85,247,0.2)]",
    smallLeafFill: "fill-purple-400"
  }
};

export default function MegaMilestonePage() {
  return (
    <div className="min-h-screen bg-slate-50 pt-12 pb-24 overflow-hidden">
      {/* Header Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20 text-center space-y-6">
        <ScrollReveal>
          <motion.div 
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 150 }}
            className="inline-flex items-center justify-center w-20 h-20 bg-orange-100 rounded-full mb-6 text-orange-500 shadow-sm border border-orange-200"
          >
            <Trophy className="w-10 h-10" />
          </motion.div>
          <h1 className="text-4xl md:text-6xl font-black text-gray-900 tracking-tight">
            Mega <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-amber-500">Milestone</span>
          </h1>
          <p className="text-lg md:text-xl text-slate-600 max-w-3xl mx-auto font-medium mt-6">
            Witness the incredible journey of VieBrain. Explore our curated collection of extraordinary cognitive milestones achieved through dedication and advanced mind training.
          </p>
        </ScrollReveal>
      </div>

      {/* Animated Digital Tree */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative">
        {/* Center Trunk */}
        <div className="absolute left-4 md:left-1/2 top-0 bottom-0 w-2 md:w-3 bg-gradient-to-b from-blue-500 via-emerald-400 to-purple-500 transform md:-translate-x-1/2 rounded-full shadow-[0_0_20px_rgba(16,185,129,0.3)] z-0"></div>

        <div className="space-y-12 md:space-y-32">
          {milestones.map((milestone, index) => {
            const Icon = milestone.icon;
            const isEven = index % 2 === 0;
            const tStyle = themeStyles[milestone.theme];

            return (
              <div key={index} className={`relative flex flex-col md:flex-row items-center w-full ${isEven ? '' : 'md:flex-row-reverse'}`}>
                
                {/* Branches */}
                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`hidden md:block absolute right-[50%] top-[50%] w-[4rem] h-[60px] border-b-[4px] border-l-[4px] ${tStyle.branchBorder} rounded-bl-[30px] ${tStyle.branchShadow} origin-right z-10`}
                >
                   <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="absolute -top-3 -left-[14px]"
                   >
                      <Leaf className={`w-6 h-6 ${tStyle.leafColor} ${tStyle.leafFill} transform -rotate-45 ${tStyle.leafShadow}`} />
                   </motion.div>
                </motion.div>

                <motion.div 
                  initial={{ scaleX: 0, opacity: 0 }}
                  whileInView={{ scaleX: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className={`hidden md:block absolute left-[50%] top-[50%] w-[4rem] h-[60px] border-b-[4px] border-r-[4px] ${tStyle.branchBorder} rounded-br-[30px] ${tStyle.branchShadow} origin-left z-10`}
                >
                   <motion.div
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.6 }}
                      className="absolute -top-3 -right-[14px]"
                   >
                      <Leaf className={`w-6 h-6 ${tStyle.leafColor} ${tStyle.leafFill} transform rotate-45 ${tStyle.leafShadow}`} />
                   </motion.div>
                </motion.div>

                {/* Timeline Node (Fruit) */}
                <motion.div 
                  initial={{ scale: 0, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
                  className={`absolute left-4 md:left-1/2 w-16 h-16 rounded-full border-4 border-white ${tStyle.nodeShadow} flex items-center justify-center z-30 transform -translate-x-[28px] md:-translate-x-1/2 ${milestone.bg} ${milestone.text}`}
                >
                  <Icon className="w-8 h-8" />
                  <Leaf className={`absolute -top-2 -right-2 w-4 h-4 ${tStyle.leafColor} ${tStyle.smallLeafFill} transform rotate-12`} />
                  <Leaf className={`absolute -bottom-2 -left-2 w-4 h-4 ${tStyle.leafColor} ${tStyle.smallLeafFill} transform -rotate-[160deg]`} />
                </motion.div>

                {/* Content Card */}
                <div className={`w-full md:w-1/2 pl-16 md:pl-0 ${isEven ? 'md:pr-16 md:text-right' : 'md:pl-16'} relative z-20`}>
                  <motion.div
                    initial={{ opacity: 0, x: isEven ? -50 : 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
                    whileHover={{ y: -5, scale: 1.02 }}
                    className={`bg-white p-6 md:p-8 rounded-2xl shadow-xl border ${tStyle.cardBorder} ${tStyle.cardHoverShadow} transition-all duration-300 relative group overflow-hidden ${tStyle.cardHoverBg}`}
                  >
                    <span className={`inline-block px-4 py-1 rounded-full text-sm font-bold mb-4 bg-gradient-to-r ${milestone.color} text-white shadow-md transition-all duration-300`}>
                      {milestone.year}
                    </span>
                    <h3 className="text-2xl font-black text-gray-900 mb-3 transition-colors duration-300">
                      {milestone.title}
                    </h3>
                    <p className="text-slate-600 font-medium leading-relaxed transition-colors duration-300">
                      {milestone.description}
                    </p>
                  </motion.div>
                </div>

                {/* Video Chunk */}
                {milestone.videoId && (
                  <div className={`w-full md:w-1/2 mt-8 md:mt-0 pl-16 md:pl-0 ${isEven ? 'md:pl-16' : 'md:pr-16'} relative z-20`}>
                    <motion.div
                      initial={{ opacity: 0, x: isEven ? 50 : -50 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true, margin: "-50px" }}
                      transition={{ duration: 0.6, delay: 0.3, ease: "easeOut" }}
                      whileHover={{ scale: 1.02 }}
                      className={`relative aspect-video rounded-2xl overflow-hidden shadow-[0_0_15px_rgba(0,0,0,0.2)] ${tStyle.videoHoverShadow} transition-shadow duration-300 border-2 ${tStyle.videoBorder} bg-black group z-20`}
                    >
                      <iframe
                        className="absolute top-0 left-0 w-full h-full pointer-events-none opacity-80 group-hover:opacity-100 transition-opacity duration-500"
                        src={`https://www.youtube.com/embed/${milestone.videoId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${milestone.videoId}&start=${milestone.startAt}&end=${milestone.startAt + 5}`}
                        title={milestone.title}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                      ></iframe>
                    </motion.div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
