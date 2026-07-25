import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  Lock,
  ShieldCheck,
  CheckCircle2,
  FileText,
  Zap,
  Star,
  ChevronDown,
  UserPlus,
  LogIn,
  Check,
} from 'lucide-react';

interface CallToActionSectionProps {
  onOpenAuth: (mode?: 'login' | 'signup', notice?: string) => void;
}

export const CallToActionSection: React.FC<CallToActionSectionProps> = ({ onOpenAuth }) => {
  return (
    <section id="cta-section" className="py-16 px-6 sm:px-8 max-w-5xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.4 }}
        className="relative bg-gradient-to-br from-blue-600 via-[#2563EB] to-indigo-700 rounded-[32px] p-8 sm:p-12 text-white shadow-2xl shadow-blue-500/20 text-center overflow-hidden border border-blue-400/30 space-y-6"
      >
        {/* Subtle Background Glow Aura */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 blur-[100px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-blue-300/10 blur-[80px] rounded-full pointer-events-none" />

        {/* Security Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/10 border border-white/20 text-xs font-bold text-blue-100 backdrop-blur-md shadow-xs">
          <Lock className="w-3.5 h-3.5 text-blue-200" />
          <span>AUTHENTICATED ACCESS ONLY</span>
        </div>

        {/* Title */}
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight max-w-2xl mx-auto leading-tight">
          Ready to Analyze Your Resume?
        </h2>

        {/* Description */}
        <p className="text-blue-100 text-sm sm:text-base md:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
          Sign in to securely upload your resume and receive an AI-powered ATS analysis, personalized feedback, and career recommendations.
        </p>

        {/* Buttons */}
        <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
          <button
            id="cta-sign-in-btn"
            onClick={() => onOpenAuth('login', 'Please sign in to analyze your resume and access your personalized dashboard.')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white text-[#2563EB] font-bold text-sm sm:text-base hover:bg-blue-50 shadow-lg shadow-black/10 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/50"
          >
            <LogIn className="w-4 h-4" />
            <span>Sign In</span>
          </button>

          <button
            id="cta-create-account-btn"
            onClick={() => onOpenAuth('signup', 'Please sign in to analyze your resume and access your personalized dashboard.')}
            className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-blue-700/60 hover:bg-blue-700 text-white font-bold text-sm sm:text-base border border-white/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-white/30"
          >
            <UserPlus className="w-4 h-4" />
            <span>Create Account</span>
          </button>
        </div>

        {/* Security & Feature Highlights */}
        <div className="pt-6 border-t border-white/15 flex flex-wrap items-center justify-center gap-6 text-xs text-blue-100/90 font-medium">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-200" />
            <span>Encrypted Cloud Storage</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-blue-200" />
            <span>Instant ATS Scoring</span>
          </div>
          <div className="flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-blue-200" />
            <span>Target Job Matching</span>
          </div>
        </div>
      </motion.div>
    </section>
  );
};

export const HowItWorksSection: React.FC = () => {
  const steps = [
    {
      num: '01',
      title: 'Sign In & Upload',
      desc: 'Create a free account or log in, then drag & drop your resume (PDF or TXT) or paste raw text.',
      icon: <FileText className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      num: '02',
      title: 'AI ATS Evaluation',
      desc: 'Our Gemini AI engine analyzes formatting, keyword density, grammar, and alignment with target job titles.',
      icon: <Zap className="w-6 h-6 text-[#2563EB]" />,
    },
    {
      num: '03',
      title: 'Actionable Insights',
      desc: 'Review your ATS score breakdown, missing keywords, and tailored recommendations to stand out to recruiters.',
      icon: <Sparkles className="w-6 h-6 text-[#2563EB]" />,
    },
  ];

  return (
    <section id="how-it-works" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16 space-y-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Simple 3-Step Process</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          How ResumeIQ Works
        </h2>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          Transform your resume into an ATS-optimized candidate profile in under a minute.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
        {steps.map((st, idx) => (
          <motion.div
            key={idx}
            id={`step-card-${idx}`}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-xs hover:shadow-md hover:border-gray-200 transition-all space-y-4 relative"
          >
            <div className="flex items-center justify-between">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                {st.icon}
              </div>
              <span className="text-2xl font-black text-gray-200 tracking-tight">{st.num}</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 tracking-tight">{st.title}</h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">{st.desc}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const TestimonialsSection: React.FC = () => {
  const testimonials = [
    {
      name: 'Sarah Chen',
      role: 'Senior Software Engineer',
      company: 'TechCorp',
      score: '92 ATS Score',
      text: 'ResumeIQ flagged 12 missing technical keywords in my backend developer resume. After making the recommended changes, I landed 4 interview callbacks within a week!',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Marcus Vance',
      role: 'Product Manager',
      company: 'GrowthScale',
      score: '88 ATS Score',
      text: 'The job description keyword matching feature is unbelievable. It highlighted exactly where my bullet points lacked quantified metrics.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    },
    {
      name: 'Elena Rostova',
      role: 'Data Scientist',
      company: 'Analytics AI',
      score: '95 ATS Score',
      text: 'The placement readiness score gave me complete confidence before submitting my application to Fortune 500 companies.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    },
  ];

  return (
    <section id="testimonials" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-gray-100 bg-gray-50/50 rounded-[32px] my-12">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16 space-y-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">User Success Stories</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          Trusted by Top Candidates
        </h2>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          See how job seekers unlocked higher callback rates with AI-driven resume optimization.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {testimonials.map((tm, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.1 }}
            className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-xs hover:border-gray-200 transition-all space-y-4 flex flex-col justify-between"
          >
            <div className="space-y-3">
              <div className="flex items-center gap-1 text-amber-400">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-amber-400" />
                ))}
              </div>
              <p className="text-xs sm:text-sm text-gray-600 leading-relaxed italic">
                "{tm.text}"
              </p>
            </div>

            <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img src={tm.avatar} alt={tm.name} className="w-10 h-10 rounded-full object-cover" />
                <div>
                  <h4 className="text-xs font-bold text-gray-900">{tm.name}</h4>
                  <p className="text-[11px] text-gray-400">{tm.role} • {tm.company}</p>
                </div>
              </div>
              <span className="px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-bold border border-emerald-100">
                {tm.score}
              </span>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export const FAQSection: React.FC = () => {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const faqs = [
    {
      q: 'Why do I need to sign in to analyze my resume?',
      a: 'Signing in allows us to securely encrypt and store your resume evaluations in your private account dashboard, enabling you to track your score improvements, access previous reports, and compare different versions over time.',
    },
    {
      q: 'How does Gemini AI calculate the ATS score?',
      a: 'Our AI model parses your resume against corporate Applicant Tracking System standards, examining structural readability, bullet point action verbs, grammar precision, and keyword match density against targeted job descriptions.',
    },
    {
      q: 'Is my resume data kept private and secure?',
      a: 'Yes. Your uploaded documents and resume content are stored securely within your private Firestore user profile. We never sell or publicly share candidate data.',
    },
    {
      q: 'Can I test my resume against specific job descriptions?',
      a: 'Absolutely! Inside your Dashboard, you can paste any target job description alongside your resume text to receive a tailored keyword gap analysis.',
    },
    {
      q: 'What file formats are supported for resume upload?',
      a: 'We support PDF files, plain text files (.txt), and direct text copying & pasting.',
    },
  ];

  return (
    <section id="faq" className="py-24 px-6 sm:px-8 max-w-4xl mx-auto border-t border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16 space-y-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Got Questions?</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          Frequently Asked Questions
        </h2>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          Learn how ResumeIQ helps you optimize your resume and land more interviews.
        </p>
      </motion.div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openIdx === idx;
          return (
            <div
              key={idx}
              className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-xs transition-all"
            >
              <button
                id={`faq-btn-${idx}`}
                onClick={() => setOpenIdx(isOpen ? null : idx)}
                className="w-full px-6 py-4 text-left flex items-center justify-between gap-4 font-bold text-sm text-gray-900 hover:bg-gray-50/80 transition-colors cursor-pointer"
              >
                <span>{faq.q}</span>
                <ChevronDown className={`w-4 h-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="px-6 pb-5 text-xs sm:text-sm text-gray-500 leading-relaxed border-t border-gray-50 pt-3"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export const PricingSection: React.FC<{ onOpenAuth: (mode?: 'login' | 'signup', notice?: string) => void }> = ({ onOpenAuth }) => {
  return (
    <section id="pricing" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-gray-100">
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="text-center max-w-2xl mx-auto mb-16 space-y-3"
      >
        <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">100% Free Forever</span>
        <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
          Simple, Transparent Access
        </h2>
        <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
          Create an account to unlock unlimited ATS scans, keyword matching, and placement readiness tracking.
        </p>
      </motion.div>

      <div className="max-w-lg mx-auto bg-white rounded-[28px] border-2 border-[#2563EB] p-8 sm:p-10 shadow-xl shadow-blue-500/10 space-y-6 relative overflow-hidden">
        {/* Top Right Member Access Badge */}
        <div className="absolute top-0 right-0 bg-[#2563EB] text-white text-[11px] font-black uppercase tracking-wider px-5 py-2 rounded-bl-2xl rounded-tr-[26px]">
          FREE MEMBER ACCESS
        </div>

        {/* Card Header & Price */}
        <div className="space-y-3 pt-2">
          <h3 className="text-2xl sm:text-3xl font-black text-gray-900 tracking-tight">Candidate Starter</h3>
          <div className="flex items-baseline gap-2">
            <span className="text-5xl sm:text-6xl font-black text-gray-900 tracking-tight">$0</span>
            <span className="text-sm sm:text-base font-bold text-gray-400">/ forever free</span>
          </div>
          <p className="text-xs sm:text-sm text-gray-500 font-medium">Includes all core Gemini AI ATS analysis tools.</p>
        </div>

        {/* Features Checklist */}
        <div className="space-y-4 pt-2 text-xs sm:text-sm font-semibold text-gray-800">
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] text-[#2563EB] flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Unlimited AI Resume Scans & ATS Scoring</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] text-[#2563EB] flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Target Job Description Keyword Matching</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] text-[#2563EB] flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Placement & Internship Readiness Indicators</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-5 h-5 rounded-full border-2 border-[#2563EB] text-[#2563EB] flex items-center justify-center shrink-0">
              <Check className="w-3 h-3 stroke-[3]" />
            </div>
            <span>Encrypted Cloud History Storage</span>
          </div>
        </div>

        {/* Action Button */}
        <button
          id="pricing-get-started-btn"
          onClick={() => onOpenAuth('signup', 'Please sign in to analyze your resume and access your personalized dashboard.')}
          className="w-full py-4 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-extrabold text-base shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] cursor-pointer"
        >
          Get Started Now
        </button>
      </div>
    </section>
  );
};
