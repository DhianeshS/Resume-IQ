import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, ArrowRight, CheckCircle2, ShieldCheck, Zap, X } from 'lucide-react';

interface WelcomeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onStartUpload: () => void;
}

export const WelcomeModal: React.FC<WelcomeModalProps> = ({ isOpen, onClose, onStartUpload }) => {
  const { user, markWelcomeModalSeen } = useAuth();

  if (!isOpen) return null;

  const handleStart = () => {
    markWelcomeModalSeen().catch(() => {});
    onClose();
    onStartUpload();
  };

  const handleDismiss = () => {
    markWelcomeModalSeen().catch(() => {});
    onClose();
  };

  return (
    <AnimatePresence>
      <div
        id="welcome-modal-backdrop"
        onClick={(e) => {
          if (e.target === e.currentTarget) handleDismiss();
        }}
        className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-[28px] max-w-lg w-full p-8 sm:p-10 shadow-2xl border border-blue-100 text-center space-y-6 relative overflow-hidden"
        >
          {/* Close X Button */}
          <button
            id="close-welcome-modal-x"
            onClick={handleDismiss}
            className="absolute top-5 right-5 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors cursor-pointer z-10"
            aria-label="Close welcome modal"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Subtle Accent Glow Background */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-64 h-32 bg-blue-500/10 blur-[60px] rounded-full pointer-events-none" />

          {/* Icon Badge */}
          <div className="w-16 h-16 rounded-2xl bg-[#2563EB] text-white mx-auto flex items-center justify-center shadow-lg shadow-blue-500/25 relative">
            <Sparkles className="w-8 h-8" />
          </div>

          {/* Header Copy */}
          <div className="space-y-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 text-xs font-bold text-[#2563EB] border border-blue-100">
              <CheckCircle2 className="w-3.5 h-3.5" /> First-Time Setup
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Welcome to ResumeIQ, {user?.displayName || 'Candidate'}!
            </h2>
            <p className="text-sm text-gray-500 leading-relaxed font-normal pt-1">
              Upload your first resume to receive an AI-powered ATS analysis and personalized improvement suggestions.
            </p>
          </div>

          {/* Quick Features List */}
          <div className="bg-gray-50/80 rounded-2xl p-4 border border-gray-100 text-xs text-gray-600 text-left space-y-2.5">
            <div className="flex items-center gap-2.5">
              <Zap className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Instant sub-second ATS compatibility scoring & breakdown</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Target job title matching & missing keyword recommendations</span>
            </div>
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-4 h-4 text-purple-600 shrink-0" />
              <span>Personalized career, project, & skill guidance based on candidate level</span>
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-3 pt-2">
            <button
              id="welcome-upload-first-btn"
              onClick={handleStart}
              className="w-full py-4 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.98] cursor-pointer"
            >
              <span>Upload Your First Resume</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            <button
              id="welcome-skip-btn"
              onClick={handleDismiss}
              className="w-full py-2.5 text-xs font-semibold text-gray-500 hover:text-gray-900 transition-colors cursor-pointer"
            >
              Explore Dashboard First
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
