import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, CheckCircle2, Zap, X, ShieldCheck } from 'lucide-react';

interface PremiumModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
}

export const PremiumModal: React.FC<PremiumModalProps> = ({ isOpen, onClose, onUpgradeClick }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="bg-white rounded-[28px] max-w-lg w-full p-8 border border-gray-100 shadow-2xl relative overflow-hidden text-gray-900"
        >
          {/* Subtle background glow */}
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-blue-500/10 rounded-full blur-2xl pointer-events-none" />

          {/* Close button */}
          <button
            id="close-premium-modal-btn"
            onClick={onClose}
            className="absolute top-6 right-6 p-2 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Premium Badge & Icon */}
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                Premium Membership Required
              </span>
              <h3 className="text-2xl font-bold text-gray-900 tracking-tight mt-0.5">
                Unlock Premium
              </h3>
            </div>
          </div>

          {/* Prompt Description */}
          <p className="text-sm text-gray-600 leading-relaxed mb-6">
            Upgrade to Premium and enjoy unlimited resume downloads, AI resume rewriting, detailed ATS reports, cover letter generation, career recommendations, and priority AI processing.
          </p>

          {/* Key Features List */}
          <div className="space-y-2.5 mb-8 bg-gray-50/80 p-5 rounded-2xl border border-gray-100 text-xs">
            <div className="flex items-center gap-2.5 text-gray-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Unlimited Formatted Resume PDF & Report Downloads</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Unlimited AI Resume Rewrites & Bullet Optimizations</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Personalized AI Cover Letter Generator</span>
            </div>
            <div className="flex items-center gap-2.5 text-gray-800 font-medium">
              <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0" />
              <span>Priority AI Processing & Career Roadmap Guidance</span>
            </div>
            <div className="flex items-center gap-2.5 text-emerald-700 font-semibold pt-1 border-t border-gray-200/60">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Students verify for FREE with College Email / Student ID!</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <button
              id="premium-modal-upgrade-btn"
              onClick={() => {
                onClose();
                onUpgradeClick();
              }}
              className="w-full sm:flex-1 py-3.5 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer active:scale-[0.98]"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upgrade Now</span>
            </button>
            <button
              id="premium-modal-maybe-later-btn"
              onClick={onClose}
              className="w-full sm:w-auto py-3.5 px-6 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-bold text-sm transition-colors cursor-pointer"
            >
              Maybe Later
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
