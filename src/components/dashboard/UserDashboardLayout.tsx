import React, { useState, useEffect } from 'react';
import { Sidebar, DashboardTab } from './Sidebar';
import { DashboardOverview } from './DashboardOverview';
import { UserProfileView } from './UserProfileView';
import { StudentVerificationView } from './StudentVerificationView';
import { CareerCenterView } from './CareerCenterView';
import { CoverLetterView } from './CoverLetterView';
import { GoogleSheetsView } from './GoogleSheetsView';
import { BillingView } from './BillingView';
import { PremiumModal } from '../auth/PremiumModal';
import { RazorpayPaymentModal } from '../billing/RazorpayPaymentModal';
import { InvoiceModal } from '../billing/InvoiceModal';
import { ResumeUploader } from '../resume/ResumeUploader';
import { ResumeHistory } from '../resume/ResumeHistory';
import { AnalysisResult } from '../resume/AnalysisResult';
import { analyzeResume } from '../../services/api';
import { ResumeAnalysis, Transaction } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { db } from '../../services/firebase';
import { collection, addDoc, getDocs, query, orderBy, limit } from 'firebase/firestore';
import { handleFirestoreError, OperationType } from '../../utils/error';
import { Menu, Sparkles } from 'lucide-react';

interface UserDashboardLayoutProps {
  onGoToLandingPage?: () => void;
}

export const UserDashboardLayout: React.FC<UserDashboardLayoutProps> = ({ onGoToLandingPage }) => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Active evaluation state inside dashboard uploader
  const [isLoading, setIsLoading] = useState(false);
  const [activeAnalysis, setActiveAnalysis] = useState<ResumeAnalysis | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [recentAnalyses, setRecentAnalyses] = useState<ResumeAnalysis[]>([]);

  // Modal dialog states
  const [isPremiumModalOpen, setIsPremiumModalOpen] = useState(false);
  const [isRazorpayModalOpen, setIsRazorpayModalOpen] = useState(false);
  const [isInvoiceModalOpen, setIsInvoiceModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  useEffect(() => {
    const fetchRecentAnalyses = async () => {
      if (!user || !db) return;
      try {
        const path = `users/${user.uid}/analyses`;
        const snap = await getDocs(collection(db, path));
        const list: ResumeAnalysis[] = [];
        snap.forEach((doc) => {
          list.push({ id: doc.id, ...doc.data() } as ResumeAnalysis);
        });
        list.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        setRecentAnalyses(list);
      } catch (e) {
        console.warn('Failed to fetch recent analyses for dashboard:', e);
      }
    };

    fetchRecentAnalyses();
  }, [user, activeAnalysis]);

  const handleAnalyze = async (resumeText: string, targetJobTitle: string, jobDescription: string) => {
    setIsLoading(true);
    setIsSaved(false);
    try {
      const result = await analyzeResume(resumeText, jobDescription);
      result.resumeTitle = targetJobTitle || result.resumeTitle || 'Resume Evaluation';

      if (user && db) {
        try {
          const path = `users/${user.uid}/analyses`;
          const payload = {
            userId: user.uid,
            resumeTitle: result.resumeTitle,
            resumeText,
            targetJobTitle: targetJobTitle || '',

            candidateLevel: result.candidateLevel || 'Student',
            atsScore: result.atsScore ?? result.overallScore ?? 75,
            formattingScore: result.formattingScore ?? 80,
            grammarScore: result.grammarScore ?? 85,
            skillsScore: result.skillsScore ?? 80,
            projectQualityScore: result.projectQualityScore ?? 82,
            internshipScore: result.internshipScore ?? 75,
            certificationScore: result.certificationScore ?? 70,
            readabilityScore: result.readabilityScore ?? 82,
            keywordMatchScore: result.keywordMatchScore ?? 78,
            professionalismScore: result.professionalismScore ?? 80,

            hasGithub: result.hasGithub ?? false,
            hasLinkedin: result.hasLinkedin ?? false,
            hasPortfolio: result.hasPortfolio ?? false,
            missingSections: result.missingSections || [],

            detectedSkills: result.detectedSkills || result.keySkillsFound || [],
            missingSkills: result.missingSkills || [],
            missingTechnicalSkills: result.missingTechnicalSkills || [],
            missingSoftSkills: result.missingSoftSkills || [],
            detectedKeywords: result.detectedKeywords || [],
            missingKeywords: result.missingKeywords || [],

            topStrengths: result.topStrengths || result.strengths || [],
            weaknesses: result.weaknesses || [],
            missingCertifications: result.missingCertifications || [],
            missingProjects: result.missingProjects || [],

            grammarMistakes: result.grammarMistakes || [],
            formattingSuggestions: result.formattingSuggestions || [],
            keywordSuggestions: result.keywordSuggestions || [],

            betterActionVerbs: result.betterActionVerbs || [],
            professionalWordingImprovements: result.professionalWordingImprovements || [],
            projectDescriptionImprovements: result.projectDescriptionImprovements || [],
            internshipDescriptionImprovements: result.internshipDescriptionImprovements || [],
            professionalSummaryImprovements: result.professionalSummaryImprovements || [],

            suggestedRoles: result.suggestedRoles || [],
            recommendedSkillsToLearn: result.recommendedSkillsToLearn || [],
            recommendedCertifications: result.recommendedCertifications || [],
            recommendedProjectsToBuild: result.recommendedProjectsToBuild || [],
            recommendedInterviewTopics: result.recommendedInterviewTopics || [],

            companyAtsEstimates: result.companyAtsEstimates || [],

            experienceFeedback: result.experienceFeedback || '',
            projectFeedback: result.projectFeedback || '',
            educationFeedback: result.educationFeedback || '',
            resumeSummary: result.resumeSummary || result.summary || '',
            improvedResumeTips: result.improvedResumeTips || [],

            overallScore: result.atsScore ?? result.overallScore ?? 75,
            keywordScore: result.keywordMatchScore ?? 78,
            impactScore: result.readabilityScore ?? 82,
            summary: result.resumeSummary || result.summary || '',
            strengths: result.topStrengths || result.strengths || [],
            keySkillsFound: result.detectedSkills || result.keySkillsFound || [],

            createdAt: new Date().toISOString(),
          };
          const docRef = await addDoc(collection(db, path), payload);
          result.id = docRef.id;
          setIsSaved(true);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, `users/${user.uid}/analyses`);
        }
      }

      setActiveAnalysis(result);
    } catch (error) {
      console.error('Analysis error:', error);
      alert('Analysis failed. Please verify your resume text and try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelectHistoryItem = (item: ResumeAnalysis) => {
    setActiveAnalysis(item);
    setIsSaved(true);
    setActiveTab('upload');
  };

  return (
    <div className="min-h-screen bg-gray-50/50 flex flex-col lg:flex-row text-gray-900 font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
        }}
        isOpenMobile={mobileMenuOpen}
        onCloseMobile={() => setMobileMenuOpen(false)}
        onGoHome={onGoToLandingPage}
      />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header for Mobile & Quick Status */}
        <header className="bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-between sticky top-0 z-30 lg:static">
          <div className="flex items-center gap-3">
            <button
              id="mobile-sidebar-toggle-btn"
              onClick={() => setMobileMenuOpen(true)}
              className="lg:hidden p-2 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700"
            >
              <Menu className="w-5 h-5" />
            </button>
            <h1 className="text-xl font-bold text-gray-900 capitalize tracking-tight">
              {activeTab === 'overview' && 'Dashboard Overview'}
              {activeTab === 'upload' && 'Upload Resume & Evaluation'}
              {activeTab === 'cover-letter' && 'AI Cover Letter Generator'}
              {activeTab === 'sheets-tracker' && 'Google Sheets ATS & Application Tracker'}
              {activeTab === 'career-center' && 'Career Center & Roadmaps'}
              {activeTab === 'student-verification' && 'Student Verification Portal'}
              {activeTab === 'billing' && 'Plans & Billing Management'}
              {activeTab === 'history' && 'Saved Resume Evaluations'}
              {activeTab === 'profile' && 'User Profile & Badges'}
            </h1>
          </div>

          <div className="flex items-center gap-3">
            {onGoToLandingPage && (
              <button
                onClick={onGoToLandingPage}
                className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer"
              >
                <span>Homepage</span>
              </button>
            )}
            <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563EB] font-bold text-xs flex items-center justify-center">
              {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
            </div>
          </div>
        </header>

        {/* Dynamic Content */}
        <main className="flex-1 p-6 sm:p-8 max-w-7xl mx-auto w-full">
          {activeTab === 'overview' && (
            <DashboardOverview
              recentAnalyses={recentAnalyses}
              onNavigateTab={(tab) => setActiveTab(tab as DashboardTab)}
              onSelectAnalysis={handleSelectHistoryItem}
              onRequireUpgrade={() => setIsPremiumModalOpen(true)}
            />
          )}

          {activeTab === 'upload' && (
            <div className="space-y-6">
              {activeAnalysis ? (
                <AnalysisResult
                  analysis={activeAnalysis}
                  onReset={() => setActiveAnalysis(null)}
                  isSaved={isSaved}
                />
              ) : (
                <div className="max-w-4xl mx-auto">
                  <ResumeUploader onAnalyze={handleAnalyze} isLoading={isLoading} />
                </div>
              )}
            </div>
          )}

          {activeTab === 'cover-letter' && (
            <CoverLetterView onRequireUpgrade={() => setIsPremiumModalOpen(true)} />
          )}

          {activeTab === 'sheets-tracker' && (
            <GoogleSheetsView recentAnalyses={recentAnalyses} />
          )}

          {activeTab === 'career-center' && <CareerCenterView />}

          {activeTab === 'student-verification' && <StudentVerificationView />}

          {activeTab === 'billing' && (
            <BillingView
              onOpenUpgradeModal={() => setIsRazorpayModalOpen(true)}
              onOpenInvoiceModal={(tx) => {
                setSelectedTransaction(tx);
                setIsInvoiceModalOpen(true);
              }}
              onGoToStudentVerification={() => setActiveTab('student-verification')}
            />
          )}

          {activeTab === 'history' && (
            <div className="space-y-6">
              <ResumeHistory onSelectAnalysis={handleSelectHistoryItem} />
            </div>
          )}

          {activeTab === 'profile' && <UserProfileView />}
        </main>
      </div>

      {/* POPUP MODALS */}
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
    </div>
  );
};

