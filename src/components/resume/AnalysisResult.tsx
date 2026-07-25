import React, { useState } from 'react';
import { motion } from 'motion/react';
import { ResumeAnalysis, CandidateLevel, Transaction } from '../../types';
import { generatePDF } from '../../utils/pdfGenerator';
import { getScoreStyle } from '../../utils/scoreUtils';
import { useAuth } from '../../context/AuthContext';
import { PremiumModal } from '../auth/PremiumModal';
import { RazorpayPaymentModal } from '../billing/RazorpayPaymentModal';
import { InvoiceModal } from '../billing/InvoiceModal';
import {
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Target,
  Award,
  RefreshCw,
  BookmarkCheck,
  Zap,
  GraduationCap,
  Briefcase,
  FolderGit2,
  Sparkles,
  SpellCheck,
  Layout,
  BookOpen,
  XCircle,
  SearchCode,
  Download,
  Printer,
  FileSpreadsheet,
  Building2,
  UserCheck,
  Globe,
  Code2,
  ListChecks,
  MessageSquare,
  TrendingUp,
  Layers,
  ArrowRight,
  Check,
  Lock,
} from 'lucide-react';

interface AnalysisResultProps {
  analysis: ResumeAnalysis;
  onReset: () => void;
  isSaved?: boolean;
}

export const AnalysisResult: React.FC<AnalysisResultProps> = ({ analysis, onReset, isSaved }) => {
  const { user, googleAccessToken, signInWithGoogle, getOrRequestGoogleAccessToken } = useAuth();
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);
  const [isExportingSheet, setIsExportingSheet] = useState(false);
  const [sheetExportSuccess, setSheetExportSuccess] = useState(false);
  const [showSheetConfirm, setShowSheetConfirm] = useState(false);
  const [activeTab, setActiveTab] = useState<'audit' | 'wording' | 'companies' | 'growth'>('audit');

  // Modal states
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const canDownload = user?.isPremium || user?.isStudentVerified || user?.accountType === 'verified_student';

  const handleDownloadPDF = async () => {
    if (!canDownload) {
      setIsPremiumModalOpen(true);
      return;
    }

    setIsGeneratingPdf(true);
    try {
      await generatePDF(analysis);
    } catch (err) {
      console.error('PDF error:', err);
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExecuteSheetExport = async () => {
    setShowSheetConfirm(false);
    setIsExportingSheet(true);
    try {
      let token = googleAccessToken;
      if (!token) {
        token = await getOrRequestGoogleAccessToken();
      }

      if (!token) {
        throw new Error('Google token required');
      }

      const { createJobSearchTrackerSpreadsheet, appendAnalysisToGoogleSheet } = await import('../../services/googleSheets');

      const savedGSheet = localStorage.getItem(`resumeiq_gsheet_${user?.uid}`);
      let spreadsheetId = savedGSheet ? JSON.parse(savedGSheet).spreadsheetId : null;

      if (!spreadsheetId) {
        const info = await createJobSearchTrackerSpreadsheet(
          token,
          user?.displayName || user?.email || 'Candidate',
          [analysis]
        );
        localStorage.setItem(`resumeiq_gsheet_${user?.uid}`, JSON.stringify(info));
      } else {
        await appendAnalysisToGoogleSheet(token, spreadsheetId, analysis);
      }

      setSheetExportSuccess(true);
      setTimeout(() => setSheetExportSuccess(false), 4000);
    } catch (err) {
      console.error('Google Sheets Export error:', err);
      alert('Could not export to Google Sheets. Please make sure popups/permissions are allowed.');
    } finally {
      setIsExportingSheet(false);
    }
  };

  const atsScore = analysis.atsScore ?? 75;
  const formattingScore = analysis.formattingScore ?? 80;
  const grammarScore = analysis.grammarScore ?? 85;
  const skillsScore = analysis.skillsScore ?? 80;
  const projectQualityScore = analysis.projectQualityScore ?? 82;
  const internshipScore = analysis.internshipScore ?? 75;
  const certificationScore = analysis.certificationScore ?? 70;
  const readabilityScore = analysis.readabilityScore ?? 82;
  const keywordMatchScore = analysis.keywordMatchScore ?? 78;
  const professionalismScore = analysis.professionalismScore ?? 80;

  const candidateLevel: CandidateLevel = analysis.candidateLevel || 'Student';

  const detectedSkills = analysis.detectedSkills || [];
  const missingSkills = analysis.missingSkills || [];
  const missingTechnicalSkills = analysis.missingTechnicalSkills || missingSkills;
  const missingSoftSkills = analysis.missingSoftSkills || [];

  const detectedKeywords = analysis.detectedKeywords || [];
  const missingKeywords = analysis.missingKeywords || [];

  const topStrengths = analysis.topStrengths || analysis.strengths || [];
  const weaknesses = analysis.weaknesses || [];
  const missingSections = analysis.missingSections || [];
  const missingCertifications = analysis.missingCertifications || [];
  const missingProjects = analysis.missingProjects || [];

  const resumeSummary = analysis.resumeSummary || analysis.summary || '';
  const improvedResumeTips = analysis.improvedResumeTips || [];

  const betterActionVerbs = analysis.betterActionVerbs || [];
  const professionalWording = analysis.professionalWordingImprovements || [];
  const projectImprovements = analysis.projectDescriptionImprovements || [];
  const internshipImprovements = analysis.internshipDescriptionImprovements || [];
  const summaryImprovements = analysis.professionalSummaryImprovements || [];

  const suggestedRoles = analysis.suggestedRoles || ['Software Engineer', 'Full Stack Developer'];
  const recommendedSkillsToLearn = analysis.recommendedSkillsToLearn || [];
  const recommendedCertifications = analysis.recommendedCertifications || [];
  const recommendedProjectsToBuild = analysis.recommendedProjectsToBuild || [];
  const recommendedInterviewTopics = analysis.recommendedInterviewTopics || [];

  const companyAtsEstimates = analysis.companyAtsEstimates || [];

  const getScoreBadge = (score: number) => {
    const style = getScoreStyle(score);
    return (
      <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold ${style.badgeBg} ${style.badgeText} border border-gray-100`}>
        {style.label}
      </span>
    );
  };

  const scoresList = [
    { label: 'Overall ATS Score', score: atsScore, icon: Zap, color: 'text-[#2563EB]' },
    { label: 'Formatting Score', score: formattingScore, icon: Layout, color: 'text-blue-600' },
    { label: 'Grammar Score', score: grammarScore, icon: SpellCheck, color: 'text-emerald-600' },
    { label: 'Skills Score', score: skillsScore, icon: Award, color: 'text-indigo-600' },
    { label: 'Project Quality Score', score: projectQualityScore, icon: FolderGit2, color: 'text-purple-600' },
    { label: 'Internship Score', score: internshipScore, icon: Briefcase, color: 'text-amber-600' },
    { label: 'Certification Score', score: certificationScore, icon: GraduationCap, color: 'text-teal-600' },
    { label: 'Readability Score', score: readabilityScore, icon: BookOpen, color: 'text-cyan-600' },
    { label: 'Keyword Match Score', score: keywordMatchScore, icon: SearchCode, color: 'text-orange-600' },
    { label: 'Professionalism Score', score: professionalismScore, icon: UserCheck, color: 'text-rose-600' },
  ];

  const getLevelBadgeColor = (level: CandidateLevel) => {
    switch (level) {
      case 'Student':
        return 'bg-blue-50 text-[#2563EB] border-blue-200';
      case 'Fresh Graduate':
        return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'Intern':
        return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'Entry-Level Professional':
        return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'Experienced Professional':
        return 'bg-indigo-50 text-indigo-700 border-indigo-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div id="analysis-result-view" className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Bar */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs"
      >
        <div>
          <div className="flex items-center gap-2 flex-wrap mb-2">
            {/* Candidate Level Badge */}
            <span id="candidate-level-badge" className={`text-xs font-bold px-3 py-1 rounded-full border flex items-center gap-1.5 ${getLevelBadgeColor(candidateLevel)}`}>
              <GraduationCap className="w-3.5 h-3.5" /> Candidate Level: {candidateLevel}
            </span>

            {analysis.targetJobTitle && (
              <span className="text-xs font-medium px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                Target: {analysis.targetJobTitle}
              </span>
            )}
            {isSaved && (
              <span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-100">
                <BookmarkCheck className="w-3.5 h-3.5" /> Saved to History
              </span>
            )}
          </div>

          <h2 className="text-2xl font-bold text-gray-900 tracking-tight">
            {analysis.resumeTitle || 'Resume Audit Result'}
          </h2>

          {/* Social / Profile Links presence indicators */}
          <div className="flex items-center gap-4 mt-3 text-xs font-semibold">
            <span className={`flex items-center gap-1.5 ${analysis.hasGithub ? 'text-emerald-600' : 'text-gray-400'}`}>
              {analysis.hasGithub ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-gray-300" />}
              GitHub {analysis.hasGithub ? 'Found' : 'Missing'}
            </span>
            <span className={`flex items-center gap-1.5 ${analysis.hasLinkedin ? 'text-emerald-600' : 'text-gray-400'}`}>
              {analysis.hasLinkedin ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-gray-300" />}
              LinkedIn {analysis.hasLinkedin ? 'Found' : 'Missing'}
            </span>
            <span className={`flex items-center gap-1.5 ${analysis.hasPortfolio ? 'text-emerald-600' : 'text-gray-400'}`}>
              {analysis.hasPortfolio ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <XCircle className="w-3.5 h-3.5 text-gray-300" />}
              Portfolio {analysis.hasPortfolio ? 'Found' : 'Missing'}
            </span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2.5 self-start sm:self-auto">
          {/* Export to Google Sheets Button */}
          <button
            id="export-to-gsheet-btn"
            onClick={() => setShowSheetConfirm(true)}
            disabled={isExportingSheet}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-emerald-50 border border-emerald-200 hover:bg-emerald-100 font-bold text-sm text-emerald-800 transition-all cursor-pointer shadow-2xs"
            title="Export evaluation metrics directly to Google Sheets"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
            <span>{isExportingSheet ? 'Exporting...' : sheetExportSuccess ? 'Exported ✓' : 'Export to Sheets'}</span>
          </button>

          {/* Download PDF Report Button */}
          <button
            id="download-pdf-report-btn"
            onClick={handleDownloadPDF}
            disabled={isGeneratingPdf}
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm transition-all cursor-pointer shadow-xs disabled:opacity-50"
            title={canDownload ? 'Download formatted PDF report' : 'Upgrade or Verify Student to Download PDF'}
          >
            {canDownload ? <Download className="w-4 h-4" /> : <Lock className="w-4 h-4 text-amber-300" />}
            <span>{isGeneratingPdf ? 'Generating PDF...' : canDownload ? 'Download PDF Report' : 'Unlock PDF Download'}</span>
          </button>

          {/* Print Button */}
          <button
            id="print-report-btn"
            onClick={handlePrint}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 font-semibold text-sm text-gray-700 transition-all cursor-pointer shadow-2xs"
            title="Print report"
          >
            <Printer className="w-4 h-4 text-gray-500" />
            <span className="hidden md:inline">Print</span>
          </button>

          {/* Analyze Another Resume Button */}
          <button
            id="analyze-another-btn"
            onClick={onReset}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl border border-gray-200 hover:bg-gray-50 font-semibold text-sm text-gray-700 transition-all cursor-pointer shadow-2xs"
          >
            <RefreshCw className="w-4 h-4 text-gray-500" />
            <span className="hidden lg:inline">Analyze Another</span>
          </button>
        </div>
      </motion.div>

      {/* HERO SECTION: Large ATS Meter + 10 Detailed Scores */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-6 bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs"
      >
        {/* Large ATS Score Circle */}
        <div id="ats-score-circle-container" className="lg:col-span-4 flex flex-col items-center justify-center p-6 border-b lg:border-b-0 lg:border-r border-gray-100 text-center">
          <span className="text-xs font-bold uppercase tracking-wider text-gray-400 mb-4 flex items-center gap-1.5">
            <Zap className="w-4 h-4 text-[#2563EB]" />
            Overall ATS Compatibility
          </span>

          <div className="relative flex items-center justify-center">
            <svg className="w-48 h-48 transform -rotate-90">
              <circle
                cx="96"
                cy="96"
                r="80"
                stroke="#F3F4F6"
                strokeWidth="12"
                fill="transparent"
              />
              <motion.circle
                cx="96"
                cy="96"
                r="80"
                stroke="currentColor"
                strokeWidth="12"
                strokeDasharray={502.6}
                initial={{ strokeDashoffset: 502.6 }}
                animate={{ strokeDashoffset: 502.6 - (502.6 * atsScore) / 100 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                strokeLinecap="round"
                fill="transparent"
                className={atsScore >= 80 ? 'text-emerald-500' : atsScore >= 60 ? 'text-amber-500' : 'text-rose-500'}
              />
            </svg>
            <div className="absolute flex flex-col items-center justify-center text-center">
              <span className="text-4xl font-extrabold text-gray-900 tracking-tight">{atsScore}</span>
              <span className="text-xs font-semibold text-gray-400">out of 100</span>
            </div>
          </div>

          <div className="mt-5 space-y-1">
            <span className={`inline-block text-xs font-bold px-3 py-1 rounded-full ${atsScore >= 80 ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : atsScore >= 60 ? 'bg-amber-50 text-amber-700 border border-amber-200' : 'bg-rose-50 text-rose-700 border border-rose-200'}`}>
              {atsScore >= 80 ? 'Strong Placement Candidate' : atsScore >= 60 ? 'Good Potential • Needs Tuning' : 'Optimization Required'}
            </span>
            <p className="text-xs text-gray-500 max-w-xs mt-2 leading-relaxed">
              Customized evaluation tailored specifically for <strong>{candidateLevel}</strong> level requirements.
            </p>
          </div>
        </div>

        {/* 10 Detailed Metric Progress Bars */}
        <div id="progress-bars-container" className="lg:col-span-8 flex flex-col justify-center space-y-4 p-2 sm:p-4">
          <div className="flex items-center justify-between border-b border-gray-100 pb-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#2563EB]" />
              10-Point Score Breakdown
            </h3>
            <span className="text-xs text-gray-400 font-medium">Level-Aware Evaluation</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3">
            {scoresList.map((item, idx) => {
              const IconComp = item.icon;
              return (
                <div key={idx} className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-semibold text-gray-800">
                    <span className="flex items-center gap-1.5 truncate">
                      <IconComp className={`w-3.5 h-3.5 ${item.color} shrink-0`} />
                      <span className="truncate">{item.label}</span>
                    </span>
                    <div className="flex items-center gap-1.5 shrink-0">
                      {getScoreBadge(item.score)}
                      <span className="font-bold text-gray-900 w-7 text-right">{item.score}%</span>
                    </div>
                  </div>

                  <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-full rounded-full ${item.score >= 80 ? 'bg-emerald-500' : item.score >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.score}%` }}
                      transition={{ duration: 0.8, delay: 0.1 + idx * 0.05, ease: 'easeOut' }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* Resume Summary Banner */}
      {resumeSummary && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-2"
        >
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
            <Target className="w-5 h-5 text-[#2563EB]" />
            Constructive AI Executive Summary
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed font-sans">{resumeSummary}</p>
        </motion.div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center justify-start gap-2 border-b border-gray-200 overflow-x-auto pb-1 scrollbar-none">
        <button
          id="tab-audit"
          onClick={() => setActiveTab('audit')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'audit' ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <ListChecks className="w-4 h-4" />
          <span>Core Audit & Feedback</span>
        </button>

        <button
          id="tab-wording"
          onClick={() => setActiveTab('wording')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'wording' ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <MessageSquare className="w-4 h-4" />
          <span>Wording & Action Verbs</span>
        </button>

        <button
          id="tab-companies"
          onClick={() => setActiveTab('companies')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'companies' ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <Building2 className="w-4 h-4" />
          <span>Company ATS Estimates</span>
        </button>

        <button
          id="tab-growth"
          onClick={() => setActiveTab('growth')}
          className={`px-5 py-3 font-bold text-xs sm:text-sm rounded-t-xl transition-all border-b-2 whitespace-nowrap cursor-pointer flex items-center gap-2 ${activeTab === 'growth' ? 'border-[#2563EB] text-[#2563EB] bg-blue-50/50' : 'border-transparent text-gray-500 hover:text-gray-800'}`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Career & Placement Guide</span>
        </button>
      </div>

      {/* TAB 1: CORE AUDIT & FEEDBACK */}
      {activeTab === 'audit' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* STRENGTHS */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                  Top Strengths
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
                  {topStrengths.length} Found
                </span>
              </div>
              <ul className="space-y-2.5">
                {topStrengths.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>

            {/* WEAKNESSES */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-4"
            >
              <div className="flex items-center justify-between">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  Areas for Improvement
                </h3>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-700 border border-amber-100">
                  {weaknesses.length} Noted
                </span>
              </div>
              <ul className="space-y-2.5">
                {weaknesses.map((item, idx) => (
                  <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-gray-700">
                    <span className="w-2 h-2 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </motion.div>
          </div>

          {/* MISSING SECTIONS & LINKS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* MISSING SECTIONS */}
            <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Layers className="w-4 h-4 text-rose-600" />
                Missing Sections
              </h4>
              {missingSections.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {missingSections.map((sec, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-rose-50 text-rose-800 text-xs font-medium border border-rose-100">
                      + {sec}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 font-medium">All essential sections present!</p>
              )}
            </div>

            {/* MISSING TECH SKILLS */}
            <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Code2 className="w-4 h-4 text-[#2563EB]" />
                Missing Tech Skills
              </h4>
              {missingTechnicalSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {missingTechnicalSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] text-xs font-medium border border-blue-100">
                      + {sk}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 font-medium">Technical skill coverage is solid!</p>
              )}
            </div>

            {/* MISSING SOFT SKILLS */}
            <div className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xs space-y-3">
              <h4 className="text-sm font-bold text-gray-900 flex items-center gap-2">
                <Award className="w-4 h-4 text-indigo-600" />
                Missing Soft Skills
              </h4>
              {missingSoftSkills.length > 0 ? (
                <div className="flex flex-wrap gap-1.5">
                  {missingSoftSkills.map((sk, idx) => (
                    <span key={idx} className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-800 text-xs font-medium border border-indigo-100">
                      + {sk}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="text-xs text-emerald-600 font-medium">Soft skills well articulated!</p>
              )}
            </div>
          </div>

          {/* DETECTED SKILLS & KEYWORDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                Detected Technical & Soft Skills
              </h3>
              <div className="flex flex-wrap gap-1.5">
                {detectedSkills.map((sk, idx) => (
                  <span key={idx} className="px-2.5 py-1 rounded-lg bg-emerald-50 text-emerald-800 text-xs font-medium border border-emerald-100">
                    ✓ {sk}
                  </span>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <SearchCode className="w-5 h-5 text-amber-600" />
                ATS Keyword Coverage
              </h3>
              <div className="space-y-3">
                <div>
                  <span className="text-[11px] font-bold uppercase text-gray-400 block mb-1">Found Keywords</span>
                  <div className="flex flex-wrap gap-1.5">
                    {detectedKeywords.map((kw, idx) => (
                      <span key={idx} className="px-2.5 py-1 rounded-lg bg-blue-50 text-[#2563EB] text-xs font-medium border border-blue-100">
                        {kw}
                      </span>
                    ))}
                  </div>
                </div>
                {missingKeywords.length > 0 && (
                  <div>
                    <span className="text-[11px] font-bold uppercase text-gray-400 block mb-1">Missing Recommended Keywords</span>
                    <div className="flex flex-wrap gap-1.5">
                      {missingKeywords.map((kw, idx) => (
                        <span key={idx} className="px-2.5 py-1 rounded-lg bg-amber-50 text-amber-800 text-xs font-medium border border-amber-200">
                          + {kw}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ACTIONABLE IMPROVEMENT TIPS */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-[#2563EB]" />
              Actionable Resume Improvement Tips
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {improvedResumeTips.map((tip, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-lg bg-blue-100 text-[#2563EB] text-xs font-bold flex items-center justify-center shrink-0 mt-0.5">
                    {idx + 1}
                  </div>
                  <p className="text-xs font-medium text-gray-800 leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: WORDING & ACTION VERBS */}
      {activeTab === 'wording' && (
        <div className="space-y-6">
          {/* ACTION VERBS REPLACEMENTS */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-[#2563EB]" />
              Strong Action Verb Suggestions
            </h3>
            <p className="text-xs text-gray-500">
              Replace weak or generic opening verbs with high-impact engineering verbs:
            </p>

            {betterActionVerbs.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {betterActionVerbs.map((item, idx) => (
                  <div key={idx} className="p-4 rounded-2xl bg-blue-50/40 border border-blue-100/80 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="line-through text-rose-500 font-semibold">{item.weakVerbFound}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-gray-400" />
                      <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                        {item.recommendedReplacement}
                      </span>
                    </div>
                    <p className="text-[11px] text-gray-500 italic">Context: {item.context}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-emerald-600 font-medium">Excellent action verb choices throughout your bullet points!</p>
            )}
          </div>

          {/* PROFESSIONAL WORDING IMPROVEMENTS */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-indigo-600" />
              Professional Wording Revisions
            </h3>

            {professionalWording.length > 0 ? (
              <div className="space-y-4">
                {professionalWording.map((item, idx) => (
                  <div key={idx} className="p-5 rounded-2xl bg-gray-50 border border-gray-100 space-y-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      <div className="p-3 rounded-xl bg-rose-50/60 border border-rose-100 text-rose-900 space-y-1">
                        <span className="font-bold text-[10px] uppercase text-rose-600 block">Original Text</span>
                        <p className="italic">"{item.original}"</p>
                      </div>
                      <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100 text-emerald-900 space-y-1">
                        <span className="font-bold text-[10px] uppercase text-emerald-600 block">Recommended ATS Bullet</span>
                        <p className="font-medium">"{item.improved}"</p>
                      </div>
                    </div>
                    <p className="text-[11px] text-gray-500 pt-1">💡 <strong>Why:</strong> {item.explanation}</p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-gray-500">Wording tone is already clear and professional.</p>
            )}
          </div>

          {/* PROJECT & INTERNSHIP DESCRIPTION REVISIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* PROJECT IMPROVEMENTS */}
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-4">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <FolderGit2 className="w-5 h-5 text-purple-600" />
                Project Description Improvements
              </h3>
              {projectImprovements.map((p, idx) => (
                <div key={idx} className="p-4 rounded-2xl bg-purple-50/30 border border-purple-100 space-y-2 text-xs">
                  <span className="font-bold text-purple-900 block">{p.projectName}</span>
                  <p className="text-gray-600">{p.feedback}</p>
                  {p.suggestedAdditions && p.suggestedAdditions.length > 0 && (
                    <div className="pt-2">
                      <span className="font-semibold text-purple-800 block mb-1">Suggested Metric Additions:</span>
                      <ul className="list-disc pl-4 space-y-1 text-gray-700">
                        {p.suggestedAdditions.map((sa, i) => (
                          <li key={i}>{sa}</li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {/* INTERNSHIP & SUMMARY IMPROVEMENTS */}
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-6">
              <div>
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <Briefcase className="w-5 h-5 text-amber-600" />
                  Internship Description Enhancements
                </h3>
                <ul className="space-y-2 text-xs text-gray-700">
                  {internshipImprovements.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-gray-100">
                <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 mb-3">
                  <UserCheck className="w-5 h-5 text-emerald-600" />
                  Summary & Objective Revisions
                </h3>
                <ul className="space-y-2 text-xs text-gray-700">
                  {summaryImprovements.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <span>{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: COMPANY ATS ESTIMATES */}
      {activeTab === 'companies' && (
        <div className="space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-3">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2563EB]" />
              Top Company ATS Compatibility Estimates
            </h3>
            <p className="text-xs sm:text-sm text-gray-500 leading-relaxed">
              Estimated compatibility scores based on recruiter screening rules, technological requirements, and campus intake preferences across top tech product and IT services firms:
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {companyAtsEstimates.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.04 }}
                className="bg-white rounded-2xl border border-gray-100 p-5 shadow-2xs hover:shadow-md transition-all flex flex-col justify-between space-y-3"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-gray-900">{item.company}</span>
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${item.estimatedScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : item.estimatedScore >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-rose-50 text-rose-700 border-rose-200'}`}>
                      {item.matchLevel}
                    </span>
                  </div>

                  <div className="flex items-baseline gap-1 my-2">
                    <span className="text-3xl font-extrabold text-gray-900">{item.estimatedScore}</span>
                    <span className="text-xs text-gray-400 font-semibold">% Match</span>
                  </div>

                  <p className="text-[11px] text-gray-500 leading-relaxed mt-2 line-clamp-4">
                    {item.reasoning}
                  </p>
                </div>

                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden mt-3">
                  <div
                    className={`h-full rounded-full ${item.estimatedScore >= 80 ? 'bg-emerald-500' : item.estimatedScore >= 60 ? 'bg-amber-500' : 'bg-rose-500'}`}
                    style={{ width: `${item.estimatedScore}%` }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: CAREER & PLACEMENT GUIDE */}
      {activeTab === 'growth' && (
        <div className="space-y-6">
          {/* SUGGESTED ROLES */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#2563EB]" />
              Roles Suitable for Your Profile
            </h3>
            <div className="flex flex-wrap gap-2">
              {suggestedRoles.map((role, idx) => (
                <span key={idx} className="px-3.5 py-2 rounded-xl bg-blue-50 text-[#2563EB] font-bold text-xs sm:text-sm border border-blue-100 flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5" />
                  {role}
                </span>
              ))}
            </div>
          </div>

          {/* RECOMMENDED SKILLS & CERTIFICATIONS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* RECOMMENDED SKILLS TO LEARN */}
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <Code2 className="w-5 h-5 text-indigo-600" />
                Recommended Skills to Learn
              </h3>
              <div className="flex flex-wrap gap-2">
                {recommendedSkillsToLearn.map((skill, idx) => (
                  <span key={idx} className="px-3 py-1.5 rounded-xl bg-indigo-50 text-indigo-800 text-xs font-semibold border border-indigo-100">
                    + {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* RECOMMENDED CERTIFICATIONS */}
            <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-3">
              <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
                <GraduationCap className="w-5 h-5 text-emerald-600" />
                Recommended Industry Certifications
              </h3>
              <ul className="space-y-2 text-xs sm:text-sm text-gray-700">
                {recommendedCertifications.map((cert, idx) => (
                  <li key={idx} className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* RECOMMENDED PROJECTS TO BUILD */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <FolderGit2 className="w-5 h-5 text-purple-600" />
              Recommended Portfolio Projects to Build
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {recommendedProjectsToBuild.map((proj, idx) => (
                <div key={idx} className="p-5 rounded-2xl bg-purple-50/30 border border-purple-100 space-y-2">
                  <h4 className="font-bold text-sm text-purple-950 flex items-center gap-2">
                    <Code2 className="w-4 h-4 text-purple-600" />
                    {proj.title}
                  </h4>
                  <p className="text-xs text-gray-600 leading-relaxed">{proj.description}</p>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {proj.techStack?.map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-md bg-purple-100/70 text-purple-800 text-[10px] font-bold">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* RECOMMENDED INTERVIEW TOPICS */}
          <div className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-3">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              Interview Preparation Topics
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm text-gray-800">
              {recommendedInterviewTopics.map((topic, idx) => (
                <div key={idx} className="p-3 rounded-xl bg-gray-50 border border-gray-100 flex items-center gap-2.5">
                  <span className="w-2 h-2 rounded-full bg-amber-500 shrink-0" />
                  <span className="font-medium">{topic}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* POPUP MODALS FOR NON-PREMIUM USERS */}
      <PremiumModal
        isOpen={isPremiumModalOpen}
        onClose={() => setIsPremiumModalOpen(false)}
        onUpgradeClick={() => setIsRazorpayModalOpen(true)}
      />

      <RazorpayPaymentModal
        isOpen={isRazorpayModalOpen}
        onClose={() => setIsRazorpayModalOpen(false)}
        onSuccess={(tx) => {
          setSelectedTransaction(tx);
          setIsInvoiceModalOpen(true);
        }}
      />

      {selectedTransaction && (
        <InvoiceModal
          isOpen={isInvoiceModalOpen}
          onClose={() => setIsInvoiceModalOpen(false)}
          transaction={selectedTransaction}
          user={user}
        />
      )}

      {/* CONFIRMATION MODAL BEFORE WRITING TO GOOGLE WORKSPACE */}
      {showSheetConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 sm:p-8 space-y-6 shadow-2xl border border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <h3 className="text-lg font-bold text-gray-900">
                Export to Google Sheets
              </h3>
            </div>

            <p className="text-xs text-gray-600 leading-relaxed">
              Export <strong>"{analysis.resumeTitle || 'Resume Evaluation'}"</strong> (ATS Score: {atsScore}%) directly to your linked Google Sheet job search tracker.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setShowSheetConfirm(false)}
                className="px-5 py-2.5 rounded-xl border border-gray-200 text-xs font-bold text-gray-600 hover:bg-gray-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                id="confirm-export-sheet-btn"
                onClick={handleExecuteSheetExport}
                className="px-6 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-md shadow-emerald-500/20 cursor-pointer"
              >
                Confirm Export
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
