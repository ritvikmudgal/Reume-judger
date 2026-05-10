'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  MessageSquare, 
  ListChecks, 
  Lightbulb, 
  Rocket,
  ArrowLeft,
  Download,
  Share2,
  AlertCircle
} from 'lucide-react';

interface ResultsDashboardProps {
  data: any;
  onBack: () => void;
}

const ResultsDashboard = ({ data, onBack }: ResultsDashboardProps) => {
  const handleShare = () => {
    navigator.clipboard.writeText(window.location.href);
    alert("Link copied to clipboard! (Share feature coming soon)");
  };

  const handleDownload = () => {
    window.print();
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="max-w-6xl mx-auto p-6 pb-20"
    >
      {/* Error State View */}
      {data.error && (
        <div className="bg-red-500/10 border border-red-500/20 p-8 rounded-3xl backdrop-blur-xl text-center mb-10">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Analysis Interrupted</h2>
          <p className="text-slate-400 mb-6 max-w-md mx-auto">
            {data.details?.includes('quota') 
              ? "Your Gemini API quota has been reached. Please wait a few minutes or check your Google AI Studio plan." 
              : data.details || "An unexpected error occurred during the roast."}
          </p>
          <button 
            onClick={onBack}
            className="px-6 py-2 bg-slate-900 dark:bg-white/10 hover:bg-slate-800 dark:hover:bg-white/20 text-white rounded-xl transition-all font-medium"
          >
            Return to Home
          </button>
        </div>
      )}

      {/* Header Actions */}
      <div className="flex justify-between items-center mb-10 pt-10 no-print">
        <button 
          onClick={onBack}
          className="flex items-center gap-2 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors font-medium"
        >
          <ArrowLeft className="w-4 h-4" />
          Home
        </button>
        <div className="flex gap-4">
          <button 
            onClick={handleShare}
            className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-white/5 border border-slate-200 dark:border-white/10 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-white/10 transition-all"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
          <button 
            onClick={handleDownload}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-xl text-white shadow-lg shadow-cyan-500/20 hover:opacity-90 transition-all"
          >
            <Download className="w-4 h-4" />
            Download PDF
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT COLUMN: Main Score & Roast (Lg: 7 columns) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* ATS SCORE SECTION */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-500/20 rounded-2xl flex items-center justify-center">
                  <Trophy className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-slate-900 dark:text-white">ATS Score</h2>
                  <p className="text-slate-500 dark:text-slate-400 text-sm">Overall employability rating</p>
                </div>
              </div>
              <div className="text-right">
                <span className={`text-sm font-bold px-3 py-1 rounded-full ${
                  data.resume_strength === 'Strong' ? 'bg-green-500/20 text-green-400' :
                  data.resume_strength === 'Average' ? 'bg-yellow-500/20 text-yellow-400' :
                  'bg-red-500/20 text-red-400'
                }`}>
                  {data.resume_strength}
                </span>
              </div>
            </div>

            <div className="flex flex-col md:flex-row items-center gap-10">
              <div className="relative w-40 h-40">
                <svg className="w-full h-full" viewBox="0 0 100 100">
                  <circle 
                    className="text-white/5 stroke-current" 
                    strokeWidth="8" 
                    fill="transparent" 
                    r="40" cx="50" cy="50" 
                  />
                  <motion.circle 
                    className="text-cyan-600 dark:text-cyan-500 stroke-current" 
                    strokeWidth="8" 
                    strokeLinecap="round" 
                    fill="transparent" 
                    r="40" cx="50" cy="50" 
                    initial={{ strokeDasharray: "0 251.2" }}
                    animate={{ strokeDasharray: `${(data.ats_score || 0) * 2.512} 251.2` }}
                    transition={{ duration: 2, ease: "easeOut" }}
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold text-slate-900 dark:text-white">{data.ats_score || 0}%</span>
                </div>
              </div>

              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 w-full">
                {[
                  { label: "Keyword Match", score: data.keyword_match_score || 0, color: "bg-cyan-500" },
                  { label: "Formatting", score: data.format_score || 0, color: "bg-purple-500" },
                  { label: "Experience", score: data.experience_score || 0, color: "bg-pink-500" },
                  { label: "Skills Match", score: Math.round(((data.ats_score || 0) + (data.keyword_match_score || 0)) / 2), color: "bg-blue-500" }
                ].map((stat) => (
                  <div key={stat.label} className="bg-slate-50 dark:bg-white/5 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                    <p className="text-xs text-slate-500 dark:text-slate-400 mb-2">{stat.label}</p>
                    <div className="flex items-center gap-3">
                      <div className="h-1.5 flex-1 bg-slate-200 dark:bg-white/10 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }}
                          animate={{ width: `${stat.score}%` }}
                          transition={{ duration: 1.5, delay: 0.5 }}
                          className={`h-full ${stat.color}`}
                        />
                      </div>
                      <span className="text-sm font-bold text-slate-900 dark:text-white">{stat.score}%</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* ROAST SECTION */}
          <motion.div variants={itemVariants} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-orange-500 to-red-600 rounded-3xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
            <div className="relative bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl overflow-hidden">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-12 h-12 bg-orange-500/20 rounded-2xl flex items-center justify-center">
                  <Flame className="w-6 h-6 text-orange-500" />
                </div>
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">The Roast</h2>
              </div>
              <div className="relative">
                <p className="text-xl font-medium text-slate-800 dark:text-slate-200 leading-relaxed italic">
                  "{data.roast}"
                </p>
                <div className="absolute -top-4 -left-4 text-6xl text-slate-900/10 dark:text-white/5 font-serif">"</div>
              </div>
            </div>
          </motion.div>

          {/* RECRUITER REACTION SECTION */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 bg-purple-500/20 rounded-2xl flex items-center justify-center">
                <MessageSquare className="w-6 h-6 text-purple-400" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Recruiter Reaction</h2>
            </div>
            <div className="bg-slate-100 dark:bg-white/5 p-6 rounded-2xl border border-slate-200 dark:border-white/5 border-l-4 border-l-purple-500">
              <p className="text-slate-600 dark:text-slate-300 italic mb-4">"The internal monologue of a recruiter reading this..."</p>
              <p className="text-lg text-slate-900 dark:text-white font-medium">{data.recruiter_reaction}</p>
            </div>
            <p className="mt-6 text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
              <span className="font-bold text-slate-800 dark:text-slate-300 uppercase tracking-wider text-[10px] mr-2">Summary Feedback:</span>
              {data.summary_feedback}
            </p>
          </motion.div>

        </div>

        {/* RIGHT COLUMN: Skills & Improvements (Lg: 5 columns) */}
        <div className="lg:col-span-5 space-y-8">
          
          {/* SKILLS + KEYWORDS */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-green-500/20 rounded-xl flex items-center justify-center">
                <ListChecks className="w-5 h-5 text-green-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Detected Skills</h3>
            </div>
            <div className="flex flex-wrap gap-2 mb-8">
              {(data.strong_points || []).map((skill: string) => (
                <span key={skill} className="px-3 py-1 bg-green-500/10 border border-green-500/20 rounded-full text-xs text-green-400 font-medium">
                  {skill}
                </span>
              ))}
            </div>

            <div className="flex items-center gap-3 mb-4">
              <h3 className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-widest">Missing Keywords</h3>
            </div>
            <div className="flex flex-wrap gap-2">
              {(data.missing_skills || []).map((skill: string) => (
                <span key={skill} className="px-3 py-1 bg-red-500/10 border border-red-500/20 rounded-full text-xs text-red-400 font-medium">
                  {skill}
                </span>
              ))}
            </div>
          </motion.div>

          {/* IMPROVEMENT SECTION */}
          <motion.div variants={itemVariants} className="bg-white/5 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-yellow-500/20 rounded-xl flex items-center justify-center">
                <Lightbulb className="w-5 h-5 text-yellow-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">How to fix this</h3>
            </div>
            <div className="space-y-4">
              {(data.improvements || []).map((tip: string, i: number) => (
                <div key={i} className="flex gap-3 items-start">
                  <div className="w-5 h-5 bg-yellow-500/20 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                    <span className="text-[10px] font-bold text-yellow-400">{i+1}</span>
                  </div>
                  <p className="text-sm text-slate-300 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* PROJECT RECOMMENDATIONS */}
          <motion.div variants={itemVariants} className="bg-gradient-to-br from-cyan-500/10 to-purple-600/10 border border-white/10 p-8 rounded-3xl backdrop-blur-xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-cyan-500/20 rounded-xl flex items-center justify-center">
                <Rocket className="w-5 h-5 text-cyan-400" />
              </div>
              <h3 className="text-xl font-bold text-slate-900 dark:text-white">Power-up Projects</h3>
            </div>
            <div className="space-y-4">
              {(data.recommended_projects || []).map((project: string, i: number) => (
                <div key={i} className="p-4 bg-slate-50 dark:bg-white/5 border border-slate-100 dark:border-white/5 rounded-2xl hover:bg-slate-100 dark:hover:bg-white/10 transition-colors cursor-default">
                  <p className="text-sm text-slate-800 dark:text-slate-200 font-medium">{project}</p>
                </div>
              ))}
            </div>
          </motion.div>

        </div>

      </div>
    </motion.div>
  );
};

export default ResultsDashboard;
