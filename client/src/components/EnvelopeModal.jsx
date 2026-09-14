import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, Sparkles, Lock } from 'lucide-react';

export default function EnvelopeModal({ isOpen, onOpenChallenge, topicName }) {
  const [isOpenAnimation, setIsOpenAnimation] = useState(false);

  if (!isOpen) return null;

  const handleEnvelopeClick = () => {
    setIsOpenAnimation(true);
    setTimeout(() => {
      onOpenChallenge();
      setIsOpenAnimation(false);
    }, 900);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
        
        <motion.div
          initial={{ scale: 0.7, opacity: 0, y: 30 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.7, opacity: 0, y: -30 }}
          transition={{ type: "spring", stiffness: 260, damping: 20 }}
          className="relative max-w-md w-full glass-panel-glow rounded-3xl p-8 text-center flex flex-col items-center shadow-[0_0_60px_rgba(0,240,255,0.3)] border border-cyan-400/40"
        >
          {/* Subtle Ambient Rays */}
          <div className="absolute inset-0 rounded-3xl bg-gradient-to-b from-cyan-500/10 via-purple-500/10 to-transparent pointer-events-none" />

          <div className="relative z-10 flex flex-col items-center">
            
            {/* Header Badge */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-cyan-950/80 border border-cyan-400/40 text-cyan-300 text-xs font-mono mb-6 shadow-inner">
              <Sparkles className="w-3.5 h-3.5 text-yellow-300 animate-spin" />
              <span>CHALLENGE SELECTED</span>
            </div>

            {/* Interactive Envelope Graphic */}
            <motion.div
              animate={isOpenAnimation ? { scale: 1.1, rotateY: 180, opacity: 0.5 } : { y: [0, -8, 0] }}
              transition={isOpenAnimation ? { duration: 0.8 } : { repeat: Infinity, duration: 3, ease: "easeInOut" }}
              onClick={handleEnvelopeClick}
              className="cursor-pointer group relative my-4 flex items-center justify-center"
            >
              {/* Glowing ring behind envelope */}
              <div className="absolute w-36 h-36 rounded-full bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 blur-xl opacity-50 group-hover:opacity-80 transition-opacity" />

              {/* Envelope Body */}
              <div className="relative w-44 h-32 rounded-2xl bg-gradient-to-tr from-slate-900 via-slate-800 to-slate-900 border-2 border-cyan-400/60 shadow-2xl flex flex-col items-center justify-center group-hover:border-cyan-300 transition-all duration-300 group-hover:scale-105">
                <Mail className="w-14 h-14 text-cyan-300 drop-shadow-[0_0_12px_rgba(0,240,255,0.8)] group-hover:rotate-6 transition-transform" />
                <div className="absolute top-2 right-2">
                  <Lock className="w-4 h-4 text-purple-400" />
                </div>
              </div>
            </motion.div>

            {/* Heading & Instructions */}
            <h3 className="font-display font-extrabold text-2xl text-slate-100 mt-4 tracking-wide">
              YOUR TOPIC IS READY
            </h3>
            
            <p className="text-sm text-slate-400 mt-2 max-w-xs leading-relaxed">
              Your unique event challenge has been sealed and securely recorded.
            </p>

            {/* Open Button */}
            <button
              onClick={handleEnvelopeClick}
              className="mt-8 px-8 py-3.5 rounded-2xl font-display font-bold text-base bg-gradient-to-r from-cyan-500 via-purple-600 to-pink-500 text-white shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40 hover:scale-105 transition-all duration-200 active:scale-95 border border-white/20"
            >
              OPEN YOUR CHALLENGE
            </button>

          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
