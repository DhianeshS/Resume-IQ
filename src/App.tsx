import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { AuthModal } from './components/auth/AuthModal';
import { AuthPage } from './components/auth/AuthPage';
import { WelcomeModal } from './components/auth/WelcomeModal';
import { UserDashboardLayout } from './components/dashboard/UserDashboardLayout';
import {
  CallToActionSection,
  HowItWorksSection,
  TestimonialsSection,
  PricingSection,
  FAQSection,
} from './components/landing/LandingSections';
import {
  Sparkles,
  BarChart3,
  Search,
  CheckCircle,
  Cpu,
  TrendingUp,
  ArrowRight,
  Shield,
  Zap,
  Check,
  Send,
  AlertTriangle,
} from 'lucide-react';

/**
 * Main application component handling view switching, resume evaluations,
 * and SaaS landing page layout with motion animations and accessibility standards.
 */
function MainApp() {
  const { user, sendVerificationEmail } = useAuth();
  const [viewMode, setViewMode] = useState<'landing' | 'dashboard' | 'login' | 'register' | 'forgot'>('landing');
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [authNotice, setAuthNotice] = useState<string | null>(null);
  const [welcomeModalOpen, setWelcomeModalOpen] = useState(false);
  const [verificationSent, setVerificationSent] = useState(false);
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Automatically switch to dashboard upon login
  useEffect(() => {
    if (user) {
      setViewMode('dashboard');
    }
  }, [user]);

  // Check if first time user needs welcome modal
  useEffect(() => {
    if (user && user.hasSeenWelcomeModal === false) {
      setWelcomeModalOpen(true);
    } else {
      setWelcomeModalOpen(false);
    }
  }, [user]);

  const handleOpenAuth = (mode: 'login' | 'signup' = 'login', notice?: string) => {
    if (mode === 'signup') {
      setViewMode('register');
    } else {
      setViewMode('login');
    }
    setAuthMode(mode);
    setAuthNotice(notice || null);
    setAuthModalOpen(true);
  };

  const handleOpenDashboardProtected = () => {
    if (!user) {
      handleOpenAuth('login', 'Please sign in to analyze your resume and access your personalized dashboard.');
      return;
    }
    setViewMode('dashboard');
  };

  const handleResendVerification = async () => {
    try {
      await sendVerificationEmail();
      setVerificationSent(true);
      setTimeout(() => setVerificationSent(false), 5000);
    } catch (e) {
      console.error('Error sending email verification:', e);
    }
  };

  const scrollToSection = (sectionId: string) => {
    if (viewMode !== 'landing') {
      setViewMode('landing');
      setTimeout(() => {
        const el = document.getElementById(sectionId);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
      return;
    }
    const el = document.getElementById(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  if (user && viewMode === 'dashboard') {
    return (
      <>
        <UserDashboardLayout onGoToLandingPage={() => setViewMode('landing')} />
        {/* Welcome Modal for First Time Users */}
        <WelcomeModal
          isOpen={welcomeModalOpen}
          onClose={() => setWelcomeModalOpen(false)}
          onStartUpload={() => setViewMode('dashboard')}
        />
      </>
    );
  }

  // Standalone Auth Page View
  if (!user && (viewMode === 'login' || viewMode === 'register' || viewMode === 'forgot')) {
    return (
      <div className="min-h-screen bg-white text-gray-900 font-sans antialiased flex flex-col justify-between selection:bg-blue-100 selection:text-[#2563EB]">
        <Navbar
          onOpenAuth={(mode) => setViewMode(mode === 'signup' ? 'register' : 'login')}
          onNavigate={scrollToSection}
          onOpenDashboard={handleOpenDashboardProtected}
        />
        <main className="flex-1 flex items-center justify-center">
          <AuthPage
            initialMode={viewMode}
            onSuccess={() => setViewMode('dashboard')}
            onGoHome={() => setViewMode('landing')}
          />
        </main>
        <Footer />
      </div>
    );
  }

  const features = [
    {
      icon: <BarChart3 className="w-6 h-6 text-[#2563EB]" />,
      title: 'ATS Score',
      description: 'Instant automated rating from 0 to 100 assessing layout, readability, and compatibility with corporate ATS filters.',
    },
    {
      icon: <Search className="w-6 h-6 text-[#2563EB]" />,
      title: 'Keyword Analysis',
      description: 'Pinpoints missing industry-specific keywords and phrase density required to match targeted job descriptions.',
    },
    {
      icon: <CheckCircle className="w-6 h-6 text-[#2563EB]" />,
      title: 'Grammar Check',
      description: 'Evaluates structural formatting, consistency in action verbs, bullet phrasing, and professional presentation.',
    },
    {
      icon: <Cpu className="w-6 h-6 text-[#2563EB]" />,
      title: 'Skills Detection',
      description: 'Automatically categorizes technical skills, soft competencies, and tools extracted directly from your resume text.',
    },
    {
      icon: <TrendingUp className="w-6 h-6 text-[#2563EB]" />,
      title: 'Resume Improvement',
      description: 'Generates prioritized, step-by-step actionable suggestions to quantify impact and boost recruiter callback rates.',
    },
  ];

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans antialiased selection:bg-blue-100 selection:text-[#2563EB]">
      {/* Navigation */}
      <Navbar
        onOpenAuth={(mode) => handleOpenAuth(mode)}
        onNavigate={scrollToSection}
        onOpenDashboard={handleOpenDashboardProtected}
      />

      {/* Email Verification Banner */}
      {user && user.emailVerified === false && (
        <div className="bg-amber-50 border-b border-amber-100 px-6 py-2.5 text-xs text-amber-800 flex items-center justify-between gap-4 max-w-7xl mx-auto">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
            <span>
              Your email (<strong>{user.email}</strong>) is not verified yet. Please check your inbox for the verification link.
            </span>
          </div>
          <button
            onClick={handleResendVerification}
            disabled={verificationSent}
            className="px-3 py-1 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-lg font-bold text-[11px] shrink-0 transition-colors cursor-pointer"
          >
            {verificationSent ? 'Link Sent!' : 'Resend Verification Email'}
          </button>
        </div>
      )}

      {/* Main Content Area */}
      <main>
        {/* HERO SECTION */}
        <section id="hero" className="relative pt-20 pb-24 md:pt-32 md:pb-36 px-6 sm:px-8 max-w-7xl mx-auto text-center overflow-hidden">
          {/* Minimalist Background Aura */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-blue-50/60 blur-[120px] -z-10 rounded-full pointer-events-none" />

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Eyebrow badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-50 border border-blue-100 text-xs font-bold text-[#2563EB] shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI-POWERED RESUME ANALYZER</span>
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-gray-900 max-w-4xl mx-auto leading-[1.08]">
              Improve Your Resume <br className="hidden sm:inline" />
              <span className="text-[#2563EB]">with AI</span>
            </h1>

            {/* Subheading */}
            <p className="text-lg sm:text-xl text-gray-500 max-w-2xl mx-auto font-normal leading-relaxed">
              Upload your resume and receive an ATS score, keyword analysis, and personalized suggestions powered by AI.
            </p>

            {/* CTA Buttons */}
            <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                id="hero-upload-resume-btn"
                onClick={() => {
                  if (!user) {
                    handleOpenAuth('login', 'Please sign in to analyze your resume and access your personalized dashboard.');
                  } else {
                    setViewMode('dashboard');
                  }
                }}
                aria-label="Upload resume now"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-base shadow-lg shadow-blue-500/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <span>Upload Resume</span>
                <ArrowRight className="w-4 h-4" />
              </button>
              <button
                id="hero-learn-more-btn"
                onClick={() => scrollToSection('features')}
                aria-label="Learn more about core features"
                className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-base transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-gray-300"
              >
                Learn More
              </button>
            </div>
          </motion.div>

          {/* Minimal Trust Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="mt-16 pt-10 border-t border-gray-100 flex flex-wrap items-center justify-center gap-8 text-xs font-semibold text-gray-400"
          >
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-gray-400" />
              <span>100% Private & Encrypted</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-gray-400" />
              <span>Instant Gemini AI Processing</span>
            </div>
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-gray-400" />
              <span>No Credit Card Required</span>
            </div>
          </motion.div>
        </section>

        {/* HOW IT WORKS SECTION */}
        <HowItWorksSection />

        {/* CALL TO ACTION CARD SECTION (Replaces Resume Evaluation section on public page) */}
        <CallToActionSection onOpenAuth={handleOpenAuth} />

        {/* FEATURE CARDS SECTION */}
        <section id="features" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-16 space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Core Capabilities</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900">
              Everything You Need for ATS Success
            </h2>
            <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
              Designed with precision to eliminate resume rejection and position you as a top candidate.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feat, idx) => (
              <motion.div
                key={idx}
                id={`feature-card-${idx}`}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.08 }}
                className="bg-white rounded-[24px] border border-gray-100 p-8 shadow-xs hover:shadow-md hover:border-gray-200 transition-all duration-300 flex flex-col justify-between space-y-4"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center shrink-0">
                    {feat.icon}
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
                    <span className="text-[#2563EB]">✔</span>
                    {feat.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
                    {feat.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ABOUT SECTION */}
        <section id="about" className="py-24 px-6 sm:px-8 max-w-7xl mx-auto border-t border-gray-100">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">About ResumeIQ</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-gray-900 leading-tight">
                Empowering Candidates with Data-Driven Clarity
              </h2>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                ResumeIQ was created to bridge the gap between job seekers and corporate Applicant Tracking Systems (ATS). Most resumes are filtered out before reaching a human recruiter due to minor formatting mismatches or missing industry keywords.
              </p>
              <p className="text-gray-500 text-sm sm:text-base leading-relaxed">
                Using Google Gemini's advanced intelligence models, ResumeIQ parses your resume like a veteran recruiter, highlighting structural issues, keyword gaps, and actionable bullet-point revisions.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 15 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="bg-gray-50/70 rounded-[24px] p-8 sm:p-10 border border-gray-100 space-y-6"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#2563EB] text-white flex items-center justify-center font-bold">
                  IQ
                </div>
                <div>
                  <h3 className="text-sm font-bold text-gray-900">Built for Modern Job Seekers</h3>
                  <p className="text-xs text-gray-500">Minimalist • Fast • Precise</p>
                </div>
              </div>
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-gray-600">
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
                  <span>Sub-second AI feedback turnarounds</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
                  <span>Secure Firebase account cloud storage</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-[#2563EB] shrink-0" />
                  <span>Tailored feedback against target job titles</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

        {/* TESTIMONIALS SECTION */}
        <TestimonialsSection />

        {/* PRICING SECTION */}
        <PricingSection onOpenAuth={handleOpenAuth} />

        {/* FAQ SECTION */}
        <FAQSection />

        {/* CONTACT SECTION */}
        <section id="contact" className="py-24 px-6 sm:px-8 max-w-5xl mx-auto border-t border-gray-100">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-2xl mx-auto mb-12 space-y-3"
          >
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Get in Touch</span>
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900">
              Have Questions or Feedback?
            </h2>
            <p className="text-gray-500 text-sm sm:text-base">
              Send us a message and our team will get back to you promptly.
            </p>
          </motion.div>

          <div className="bg-white rounded-[24px] border border-gray-100 p-8 sm:p-10 shadow-xs">
            {contactSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 mx-auto flex items-center justify-center">
                  <Check className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-gray-900">Message Sent Successfully</h3>
                <p className="text-xs sm:text-sm text-gray-500">Thank you for reaching out to ResumeIQ. We will respond shortly.</p>
                <button
                  onClick={() => setContactSubmitted(false)}
                  className="mt-4 text-xs font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  setContactSubmitted(true);
                }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="contact-name" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Your Name</label>
                    <input
                      id="contact-name"
                      required
                      type="text"
                      placeholder="Jane Doe"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="contact-email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Email Address</label>
                    <input
                      id="contact-email"
                      required
                      type="email"
                      placeholder="jane@example.com"
                      className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label htmlFor="contact-message" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">Message</label>
                  <textarea
                    id="contact-message"
                    required
                    rows={4}
                    placeholder="How can we help you?"
                    className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>
                <button
                  id="contact-submit-btn"
                  type="submit"
                  className="w-full py-3.5 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-xs transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4" />
                  <span>Send Message</span>
                </button>
              </form>
            )}
          </div>
        </section>
      </main>

      {/* Footer */}
      <Footer />

      {/* Auth Modal */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => {
          setAuthModalOpen(false);
          setAuthNotice(null);
        }}
        initialMode={authMode}
        noticeMessage={authNotice}
      />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainApp />
    </AuthProvider>
  );
}
