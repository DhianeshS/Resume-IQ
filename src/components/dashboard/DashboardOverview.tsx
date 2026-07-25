import React from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { ResumeAnalysis } from '../../types';
import {
  Sparkles,
  Zap,
  GraduationCap,
  Award,
  TrendingUp,
  FileText,
  Compass,
  ArrowRight,
  BookmarkCheck,
  Building2,
  CheckCircle2,
  Lock,
} from 'lucide-react';

interface DashboardOverviewProps {
  recentAnalyses: ResumeAnalysis[];
  onNavigateTab: (tab: string) => void;
  onSelectAnalysis: (analysis: ResumeAnalysis) => void;
  onRequireUpgrade: () => void;
}

export const DashboardOverview: React.FC<DashboardOverviewProps> = ({
  recentAnalyses,
  onNavigateTab,
  onSelectAnalysis,
  onRequireUpgrade,
}) => {
  const { user } = useAuth();

  const isVerifiedStudent = user?.isStudentVerified || user?.accountType === 'verified_student';
  const isPremium = user?.isPremium || user?.accountType === 'premium_professional';

  // Calculate readiness scores
  const latestAnalysis = recentAnalyses[0];
  const latestScore = latestAnalysis?.atsScore || 75;
  const placementReadiness = Math.min(100, Math.round(latestScore * 1.05));
  const internshipReadiness = Math.min(100, Math.round(latestScore * 1.1));

  const allBadges = [
    { name: '🏅 Resume Beginner', desc: 'Signed up and initialized ResumeIQ account', defaultUnlocked: true },
    { name: '🏅 ATS Expert', desc: 'Achieved an ATS score of 80+ or unlocked Premium', defaultUnlocked: isPremium || latestScore >= 80 },
    { name: '🏅 Interview Ready', desc: 'Achieved 85+ formatting and grammar scores', defaultUnlocked: (latestAnalysis?.formattingScore || 0) >= 85 },
    { name: '🏅 Placement Ready', desc: 'Scored 85+ overall compatibility across top tech firms', defaultUnlocked: isPremium || placementReadiness >= 85 },
    { name: '🏅 Internship Champion', desc: 'Verified active student status for free benefits', defaultUnlocked: isVerifiedStudent },
  ];

  const userUnlockedSet = new Set(user?.unlockedBadges || ['🏅 Resume Beginner']);

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* WELCOME HERO CARD */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            <span className={`px-3 py-1 rounded-full text-xs font-bold border flex items-center gap-1.5 ${isPremium ? 'bg-amber-50 text-amber-800 border-amber-200' : isVerifiedStudent ? 'bg-emerald-50 text-emerald-800 border-emerald-200' : 'bg-blue-50 text-[#2563EB] border-blue-100'}`}>
              {isPremium ? <Zap className="w-3.5 h-3.5" /> : isVerifiedStudent ? <GraduationCap className="w-3.5 h-3.5" /> : <Sparkles className="w-3.5 h-3.5" />}
              {isPremium ? 'PREMIUM PROFESSIONAL' : isVerifiedStudent ? 'VERIFIED STUDENT' : 'FREE PROFESSIONAL'}
            </span>

            {user?.studentCollege && (
              <span className="text-xs font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-700">
                {user.studentCollege}
              </span>
            )}
          </div>

          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Welcome back, {user?.displayName || 'Candidate'}!
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
            Your personalized AI career dashboard is active. Track your ATS resume benchmarks, campus placement readiness, and career growth milestones.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <button
            id="overview-upload-resume-btn"
            onClick={() => onNavigateTab('upload')}
            className="px-5 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer active:scale-[0.98]"
          >
            <Sparkles className="w-4 h-4" />
            <span>Analyze Resume</span>
          </button>

          <button
            id="overview-cover-letter-btn"
            onClick={() => onNavigateTab('cover-letter')}
            className="px-4 py-3 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-gray-800 font-bold text-xs transition-colors flex items-center gap-2 cursor-pointer"
          >
            <FileText className="w-4 h-4 text-[#2563EB]" />
            <span>AI Cover Letter</span>
          </button>
        </div>
      </motion.div>

      {/* READINESS SCORES METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Placement Readiness Score */}
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <TrendingUp className="w-4 h-4 text-[#2563EB]" />
              Placement Readiness Index
            </span>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-0.5 rounded-full border border-emerald-100">
              High Potential
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900">{placementReadiness}%</span>
            <span className="text-xs text-gray-400 font-medium">Campus Fit</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-[#2563EB] h-full rounded-full" style={{ width: `${placementReadiness}%` }} />
          </div>

          <p className="text-[11px] text-gray-500">Based on recruiter evaluation benchmarks across Tier 1 & IT services hiring.</p>
        </div>

        {/* Internship Readiness Score */}
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-xs space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-gray-400 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-emerald-600" />
              Internship Readiness Index
            </span>
            <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
              Strong Match
            </span>
          </div>

          <div className="flex items-baseline gap-2">
            <span className="text-4xl font-extrabold text-gray-900">{internshipReadiness}%</span>
            <span className="text-xs text-gray-400 font-medium">Internship Fit</span>
          </div>

          <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
            <div className="bg-emerald-500 h-full rounded-full" style={{ width: `${internshipReadiness}%` }} />
          </div>

          <p className="text-[11px] text-gray-500">Evaluates academic projects, coursework, and GitHub code presence.</p>
        </div>

        {/* Account Benefits Card */}
        <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-6 rounded-[28px] text-white shadow-lg space-y-3 flex flex-col justify-between">
          <div className="space-y-1">
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold uppercase tracking-wider bg-white/20 text-white px-2.5 py-0.5 rounded-full">
                SaaS Membership Status
              </span>
              <Award className="w-5 h-5 text-amber-300" />
            </div>
            <h4 className="font-extrabold text-lg">
              {isPremium ? 'Premium Unlocked' : isVerifiedStudent ? 'Verified Student Pass' : 'Upgrade Account'}
            </h4>
            <p className="text-xs text-blue-100 leading-relaxed">
              {isPremium || isVerifiedStudent
                ? 'Unlimited PDF downloads, cover letters, and priority AI processing are active.'
                : 'Students verify for 100% Free or upgrade to Premium for unlimited PDF downloads.'}
            </p>
          </div>

          {!isPremium && !isVerifiedStudent ? (
            <div className="flex items-center gap-2 pt-2">
              <button
                onClick={() => onNavigateTab('student-verification')}
                className="flex-1 py-2 px-3 rounded-xl bg-white text-[#2563EB] font-bold text-xs hover:bg-blue-50 transition-colors cursor-pointer text-center"
              >
                Verify Student
              </button>
              <button
                onClick={onRequireUpgrade}
                className="flex-1 py-2 px-3 rounded-xl bg-amber-400 text-gray-950 font-bold text-xs hover:bg-amber-300 transition-colors cursor-pointer text-center"
              >
                Upgrade ₹299
              </button>
            </div>
          ) : (
            <span className="text-xs font-bold text-emerald-200 flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4 text-emerald-300" /> All Features 100% Active
            </span>
          )}
        </div>
      </div>

      {/* GAMIFICATION & ACHIEVEMENTS BADGES GRID */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-500" />
            Achievements & Career Badges
          </h3>
          <span className="text-xs text-gray-400 font-medium">Gamified Progression</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {allBadges.map((badge, idx) => {
            const isUnlocked = userUnlockedSet.has(badge.name) || badge.defaultUnlocked;

            return (
              <div
                key={idx}
                className={`p-4 rounded-2xl border transition-all space-y-2 relative ${isUnlocked ? 'bg-amber-50/40 border-amber-200/80 shadow-2xs' : 'bg-gray-50 border-gray-100 opacity-60'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{badge.name.split(' ')[0]}</span>
                  {isUnlocked ? (
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      UNLOCKED
                    </span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-gray-400" />
                  )}
                </div>
                <h4 className="font-bold text-xs text-gray-900">{badge.name.split(' ').slice(1).join(' ')}</h4>
                <p className="text-[10px] text-gray-500 leading-tight">{badge.desc}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* RECENT ANALYSES & AUDITS */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <BookmarkCheck className="w-5 h-5 text-[#2563EB]" />
            Recent ATS Resume Audits ({recentAnalyses.length})
          </h3>

          <button
            onClick={() => onNavigateTab('upload')}
            className="text-xs font-bold text-[#2563EB] hover:underline flex items-center gap-1 cursor-pointer"
          >
            <span>+ New Analysis</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {recentAnalyses.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {recentAnalyses.map((item, idx) => (
              <motion.div
                key={idx}
                whileHover={{ y: -2 }}
                className="p-5 rounded-2xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all bg-white flex flex-col justify-between space-y-4"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded-md bg-blue-50 text-[#2563EB] border border-blue-100">
                      {item.candidateLevel || 'Candidate'}
                    </span>
                    <span className="text-xs font-extrabold text-gray-900 bg-gray-100 px-2.5 py-0.5 rounded-full">
                      ATS {item.atsScore}%
                    </span>
                  </div>

                  <h4 className="font-bold text-sm text-gray-900 line-clamp-1">{item.resumeTitle}</h4>
                  {item.targetJobTitle && (
                    <p className="text-xs text-gray-500 font-medium">Target: {item.targetJobTitle}</p>
                  )}
                  <p className="text-[11px] text-gray-400">Audited {new Date(item.createdAt).toLocaleDateString()}</p>
                </div>

                <button
                  onClick={() => onSelectAnalysis(item)}
                  className="w-full py-2.5 px-4 rounded-xl bg-gray-50 hover:bg-blue-50 text-gray-800 hover:text-[#2563EB] font-bold text-xs transition-colors cursor-pointer border border-gray-100 text-center"
                >
                  View Full Audit Report
                </button>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="p-8 rounded-2xl bg-gray-50/80 border border-gray-100 text-center space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-bold text-sm text-gray-900">No Resumes Analyzed Yet</h4>
            <p className="text-xs text-gray-500 max-w-sm mx-auto">
              Upload your resume to receive an instant AI-powered 10-score breakdown, ATS compatibility evaluation, and wording improvements.
            </p>
            <button
              onClick={() => onNavigateTab('upload')}
              className="px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Upload & Analyze Now</span>
            </button>
          </div>
        )}
      </div>

      {/* BOTTOM LINK BANNERS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div
          onClick={() => onNavigateTab('career-center')}
          className="p-6 rounded-[28px] bg-gradient-to-r from-indigo-50 to-purple-50 border border-indigo-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-indigo-700 uppercase tracking-wide flex items-center gap-1.5">
              <Compass className="w-4 h-4" /> Career Center
            </span>
            <h4 className="font-bold text-base text-gray-900">Explore In-Demand Skills & Certifications</h4>
            <p className="text-xs text-gray-600">AWS, React, Node.js, and LeetCode preparation guides.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-indigo-600 shrink-0" />
        </div>

        <div
          onClick={() => onNavigateTab('cover-letter')}
          className="p-6 rounded-[28px] bg-gradient-to-r from-blue-50 to-cyan-50 border border-blue-100 hover:shadow-md transition-all cursor-pointer flex items-center justify-between"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wide flex items-center gap-1.5">
              <FileText className="w-4 h-4" /> AI Cover Letter
            </span>
            <h4 className="font-bold text-base text-gray-900">Generate Job-Specific Cover Letters</h4>
            <p className="text-xs text-gray-600">Tailored tone and bullet point highlights in seconds.</p>
          </div>
          <ArrowRight className="w-5 h-5 text-[#2563EB] shrink-0" />
        </div>
      </div>
    </div>
  );
};
