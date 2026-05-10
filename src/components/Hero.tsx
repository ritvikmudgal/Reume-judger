'use client';

import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, FileText, CheckCircle2, AlertCircle, BarChart3, ArrowRight } from 'lucide-react';
import { BackgroundGradientAnimation } from './ui/background-gradient-animation';
import Switch from './ui/star-wars-toggle-switch';
import ClickSpark from './ui/click-spark';
import { useTheme } from 'next-themes';
import RoleSelector from './RoleSelector';
import ProcessingState from './ProcessingState';
import ResultsDashboard from './ResultsDashboard';

const Hero = () => {
  const { theme } = useTheme();
  const [role, setRole] = useState('Frontend Developer');
  const [file, setFile] = useState<File | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Keep-alive ping for Render backend (prevents sleeping)
  React.useEffect(() => {
    const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
    const pingBackend = async () => {
      try {
        await fetch(BACKEND_URL);
      } catch (e) {
        console.log("Keep-alive ping failed (Backend might be sleeping or starting up)");
      }
    };
    
    // Ping every 2 minutes
    const interval = setInterval(pingBackend, 2 * 60 * 1000);
    pingBackend(); // Initial ping
    
    return () => clearInterval(interval);
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setError(null);
    }
  };

  const handleAnalyze = async () => {
    if (!file) {
      setError("Please upload a resume first.");
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('role', role);

    try {
      const BACKEND_URL = process.env.NEXT_PUBLIC_BACKEND_URL || 'http://localhost:8000';
      console.log("Connecting to backend at:", BACKEND_URL);
      const response = await fetch(`${BACKEND_URL}/analyze`, {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        let errorMessage = 'Failed to analyze resume. Make sure backend is running.';
        try {
          const errorData = await response.json();
          if (errorData.detail) errorMessage = `Backend Error: ${errorData.detail}`;
        } catch (e) {
          // ignore JSON parsing errors if the response is not JSON
        }
        throw new Error(errorMessage);
      }

      const data = await response.json();
      setResult(data);
    } catch (err: any) {
      setError(err.message || "Something went wrong.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Define colors based on theme
  const colors = theme === 'dark' ? {} : {
    firstColor: '167, 243, 208', // Mint
    secondColor: '192, 132, 252', // Purple
    thirdColor: '186, 230, 253', // Light Blue
    fourthColor: '251, 207, 232', // Light Pink
    fifthColor: '209, 250, 229', // Lighter Mint
    pointerColor: '192, 132, 252',
  };

  return (
    <ClickSpark 
      sparkColor={theme === 'dark' ? '#fff' : '#de7d2f'}
      sparkSize={10}
      sparkRadius={20}
      sparkCount={10}
      duration={500}
    >
      <div className="relative min-h-screen w-full flex flex-col items-center justify-start overflow-y-auto transition-colors duration-500 bg-white dark:bg-black">
        {/* Floating Toggle at Top Right */}
        <div className="absolute top-10 right-10 z-50">
          <Switch />
        </div>

        <BackgroundGradientAnimation
          containerClassName="absolute inset-0 z-0"
          className="z-10"
          {...colors}
        >
          <div className="container mx-auto px-6 relative z-20 py-20">
            
            <AnimatePresence mode="wait">
              {result ? (
                <ResultsDashboard key="results" data={result} onBack={() => setResult(null)} />
              ) : isAnalyzing ? (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 1.1 }}
                >
                  <ProcessingState />
                </motion.div>
              ) : (
                <motion.div 
                  key="landing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col lg:flex-row items-center justify-between gap-12"
                >
                  {/* LEFT SIDE: Content & Upload */}
                  <div className="flex-1 text-left max-w-2xl">
                    <h1 className="text-6xl md:text-8xl font-bold bg-clip-text text-transparent bg-gradient-to-b from-slate-900 to-slate-500 dark:from-white dark:to-slate-400 mb-6">
                      Resume Judge
                    </h1>
                    <p className="text-lg text-slate-600 dark:text-slate-300 mb-10 leading-relaxed max-w-xl">
                      AI-powered resume analysis that performs deep ATS checks, predicts recruiter reactions, and gives you a meme-style roast that actually helps you get hired.
                    </p>

                    <div className="space-y-4 mb-8">
                      <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">1. Choose your target role</p>
                      <RoleSelector selectedRole={role} onRoleChange={setRole} />
                    </div>

                    <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-4">2. Upload & Roast</p>
                    
                    {/* UPLOAD BOX */}
                    <motion.div 
                      whileHover={{ scale: 1.01 }}
                      className="relative group cursor-pointer"
                    >
                      <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        className="hidden" 
                        accept=".pdf,.docx"
                      />
                      <div className="absolute -inset-0.5 bg-gradient-to-r from-cyan-500 to-purple-600 rounded-2xl blur opacity-20 dark:opacity-30 group-hover:opacity-40 dark:group-hover:opacity-60 transition duration-500"></div>
                      <div 
                        onClick={() => fileInputRef.current?.click()}
                        className="relative bg-white/60 dark:bg-black/40 backdrop-blur-xl border border-slate-200 dark:border-white/10 p-8 rounded-2xl flex flex-col items-center justify-center border-dashed border-2 hover:border-cyan-500/50 transition-all shadow-xl shadow-slate-200/50 dark:shadow-none"
                      >
                        <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-4 group-hover:bg-cyan-500/10 transition-colors">
                          <Upload className={`w-8 h-8 ${file ? 'text-green-500' : 'text-cyan-600 dark:text-cyan-400'} group-hover:scale-110 transition-transform`} />
                        </div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2">
                          {file ? file.name : "Drop your resume here"}
                        </h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm text-center font-medium">
                          {file ? "File selected. Ready to roast?" : "Supports PDF & DOCX. Your data stays private."}
                        </p>
                      </div>
                    </motion.div>

                    {error && (
                      <p className="text-red-500 text-sm mt-4 font-medium flex items-center gap-2">
                        <AlertCircle className="w-4 h-4" /> {error}
                      </p>
                    )}

                    <button
                      onClick={handleAnalyze}
                      disabled={!file}
                      className={`mt-8 w-full py-4 rounded-2xl font-bold text-white flex items-center justify-center gap-2 transition-all ${
                        file 
                          ? 'bg-gradient-to-r from-cyan-500 to-purple-600 shadow-xl shadow-cyan-500/20 hover:scale-[1.02] active:scale-[0.98]' 
                          : 'bg-slate-200 dark:bg-white/5 text-slate-400 cursor-not-allowed'
                      }`}
                    >
                      Roast My Resume <ArrowRight className="w-5 h-5" />
                    </button>
                  </div>

                  {/* RIGHT SIDE: ATS Dashboard Card (Static preview) */}
                  <div className="flex-1 relative perspective-1000 hidden lg:block">
                    {/* (Original Dashboard Card logic remains same) */}
                    <motion.div
                      animate={{ y: [0, -20, 0], rotate: [0, 1, 0] }}
                      transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
                      className="w-full max-w-md bg-white/80 dark:bg-black/40 backdrop-blur-2xl border border-slate-200 dark:border-white/10 rounded-3xl overflow-hidden shadow-2xl relative"
                    >
                      {/* ... (Existing card content) */}
                      <div className="p-6 border-b border-slate-100 dark:border-white/10 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-cyan-500/10 dark:bg-cyan-500/20 rounded-lg flex items-center justify-center">
                            <BarChart3 className="w-6 h-6 text-cyan-600 dark:text-cyan-400" />
                          </div>
                          <div>
                            <h4 className="text-slate-900 dark:text-white font-bold">Live Analysis</h4>
                            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Real-time Recruiter Feedback</p>
                          </div>
                        </div>
                      </div>
                      <div className="p-8 flex flex-col items-center justify-center space-y-6 text-center">
                        <div className="w-20 h-20 bg-cyan-500/10 rounded-full flex items-center justify-center">
                          <FileText className="w-10 h-10 text-cyan-500" />
                        </div>
                        <div>
                          <h4 className="text-lg font-bold text-slate-900 dark:text-white">Upload your resume</h4>
                          <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">To unlock deep ATS analytics and your professional roast.</p>
                        </div>
                        <div className="w-full space-y-3">
                          <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-2/3 bg-cyan-500 animate-pulse"></div>
                          </div>
                          <div className="h-2 w-full bg-slate-100 dark:bg-white/5 rounded-full overflow-hidden">
                            <div className="h-full w-1/2 bg-purple-500 animate-pulse"></div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] border border-cyan-500/5 dark:border-cyan-500/10 rounded-full -z-10 animate-pulse"></div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

          </div>
        </BackgroundGradientAnimation>
      </div>
    </ClickSpark>
  );
};

export default Hero;
