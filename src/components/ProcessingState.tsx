'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Loader2 } from 'lucide-react';

const loadingTexts = [
  "Scanning recruiter red flags...",
  "Checking ATS survivability...",
  "Generating professional emotional damage...",
  "Analyzing employability patterns...",
  "Consulting the hiring gods...",
  "Measuring your career audacity...",
  "Polishing the roast burner...",
  "Calculating salary expectation vs. reality..."
];

const ProcessingState = () => {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % loadingTexts.length);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center p-12 text-center">
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        className="mb-8"
      >
        <Loader2 className="w-16 h-16 text-cyan-500" />
      </motion.div>
      
      <div className="h-8 mb-4">
        <AnimatePresence mode="wait">
          <motion.p
            key={index}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-xl font-medium text-slate-200"
          >
            {loadingTexts[index]}
          </motion.p>
        </AnimatePresence>
      </div>
      
      <p className="text-slate-500 text-sm">
        This takes about 10-15 seconds. High quality roasts require patience.
      </p>
      
      {/* Decorative progress bar */}
      <div className="w-64 h-1.5 bg-white/5 rounded-full mt-8 overflow-hidden">
        <motion.div
          initial={{ width: "0%" }}
          animate={{ width: "100%" }}
          transition={{ duration: 15, ease: "easeInOut" }}
          className="h-full bg-gradient-to-r from-cyan-500 to-purple-600"
        />
      </div>
    </div>
  );
};

export default ProcessingState;
