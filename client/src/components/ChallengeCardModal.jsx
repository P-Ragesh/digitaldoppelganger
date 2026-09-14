import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Award, FileText, User, GraduationCap, Calendar, CheckCircle2 } from 'lucide-react';

export default function ChallengeCardModal({ isOpen, onClose, assignment, participant }) {
  if (!isOpen || !assignment) return null;

  const topic = assignment.topic || assignment;
  const pName = participant?.name || assignment.participant?.name || 'Participant';
  const pCollege = participant?.college || assignment.participant?.college || 'College';
  const dateStr = assignment.assignedAt ? new Date(assignment.assignedAt).toLocaleString('en-US', {
    dateStyle: 'medium',
    timeStyle: 'short'
  }) : new Date().toLocaleString();

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
        
        <motion.div
          initial={{ scale: 0.8, opacity: 0, y: 40 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.8, opacity: 0, y: 40 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="relative max-w-lg w-full paper-card rounded-2xl p-8 sm:p-10 text-slate-900 shadow-2xl border-4 border-amber-200/80 my-8"
        >
          {/* Decorative Corner Seals */}
          <div className="absolute top-4 left-4 w-6 h-6 border-t-2 border-l-2 border-amber-800/40" />
          <div className="absolute top-4 right-4 w-6 h-6 border-t-2 border-r-2 border-amber-800/40" />
          <div className="absolute bottom-4 left-4 w-6 h-6 border-b-2 border-l-2 border-amber-800/40" />
          <div className="absolute bottom-4 right-4 w-6 h-6 border-b-2 border-r-2 border-amber-800/40" />

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-slate-900/10 hover:bg-slate-900/20 text-slate-800 flex items-center justify-center transition-colors"
            title="Close Card"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Document Header */}
          <div className="text-center pb-6 border-b-2 border-amber-900/20">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-md bg-amber-900/10 text-amber-900 font-mono text-xs font-semibold uppercase tracking-widest mb-2">
              <Award className="w-4 h-4 text-amber-700" />
              <span>Official Event Document</span>
            </div>
            
            <h2 className="font-serif font-black text-3xl tracking-widest text-slate-900 uppercase font-['Cinzel',serif]">
              DOPPELGANGER
            </h2>
            <p className="text-xs font-mono tracking-wider text-amber-900/70 uppercase font-semibold mt-1">
              CHALLENGE ASSIGNMENT CERTIFICATE
            </p>
          </div>

          {/* Topic Assignment Highlight */}
          <div className="my-6 p-5 rounded-xl bg-amber-900/5 border border-amber-900/15 text-center shadow-inner">
            <span className="text-[11px] font-mono font-bold tracking-widest text-amber-800 uppercase block mb-1">
              ASSIGNED TOPIC
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-purple-950 tracking-tight leading-tight">
              {topic.topicName}
            </h3>
          </div>

          {/* Requirements Section */}
          <div className="mb-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-amber-900 uppercase tracking-wider mb-2">
              <FileText className="w-4 h-4 text-amber-700" />
              <span>CHALLENGE REQUIREMENTS</span>
            </div>
            <p className="text-sm text-slate-800 leading-relaxed font-sans bg-white/60 p-4 rounded-lg border border-amber-900/10 shadow-sm">
              {topic.requirements}
            </p>
          </div>

          {/* Participant Information Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-4 border-t border-b border-amber-900/15 text-xs">
            
            <div className="flex items-start gap-2.5">
              <User className="w-4 h-4 text-amber-800 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono text-amber-900/60 uppercase block">Participant</span>
                <span className="font-bold text-slate-900 text-sm">{pName}</span>
              </div>
            </div>

            <div className="flex items-start gap-2.5">
              <GraduationCap className="w-4 h-4 text-amber-800 mt-0.5" />
              <div>
                <span className="text-[10px] font-mono text-amber-900/60 uppercase block">College</span>
                <span className="font-bold text-slate-900 text-sm">{pCollege}</span>
              </div>
            </div>

            <div className="sm:col-span-2 flex items-center gap-2 pt-2 text-[11px] font-mono text-amber-900/80">
              <Calendar className="w-3.5 h-3.5 text-amber-700" />
              <span>Assigned On: {dateStr}</span>
            </div>

          </div>

          {/* Verification Watermark Footer */}
          <div className="mt-6 flex items-center justify-between text-xs text-amber-900/70 pt-2 font-mono">
            <div className="flex items-center gap-1 text-emerald-800 font-semibold">
              <CheckCircle2 className="w-4 h-4" />
              <span>STATUS: LOCKED & PERSISTED</span>
            </div>
            <button
              onClick={onClose}
              className="px-5 py-2 rounded-lg bg-amber-900 text-amber-50 hover:bg-amber-950 font-bold transition-colors shadow-md"
            >
              CLOSE
            </button>
          </div>

        </motion.div>

      </div>
    </AnimatePresence>
  );
}
