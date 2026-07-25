export type AccountType =
  | 'guest'
  | 'free_professional'
  | 'verified_student'
  | 'premium_professional'
  | 'student'
  | 'professional';

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  emailVerified?: boolean;
  hasSeenWelcomeModal?: boolean;
  
  // SaaS Account Tier & Student Verification
  accountType?: AccountType;
  isStudentVerified?: boolean;
  studentCollege?: string;
  studentEmail?: string;
  studentIdUrl?: string;
  verifiedAt?: string;

  // Premium Subscription
  isPremium?: boolean;
  planType?: 'monthly' | 'yearly';
  planExpiresAt?: string;
  subscribedAt?: string;

  // Gamification & Achievements
  unlockedBadges?: string[];
}

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  planType: 'monthly' | 'yearly';
  paymentMethod: string;
  razorpayPaymentId: string;
  razorpayOrderId?: string;
  invoiceNumber: string;
  status: 'SUCCESS' | 'PENDING' | 'FAILED';
  createdAt: string;
}

export interface CoverLetterRequest {
  resumeText: string;
  targetJobTitle: string;
  companyName: string;
  jobDescription?: string;
  tone?: 'Professional' | 'Energetic' | 'Executive' | 'Creative';
}

export interface CoverLetterResponse {
  coverLetterText: string;
  subjectLine: string;
  salutation: string;
  keyHighlights: string[];
  callToAction: string;
  companyName: string;
  targetJobTitle: string;
}

export type CandidateLevel =
  | 'Student'
  | 'Fresh Graduate'
  | 'Intern'
  | 'Entry-Level Professional'
  | 'Experienced Professional';

export interface CompanyAtsEstimate {
  company: string;
  logoUrl?: string;
  estimatedScore: number;
  matchLevel: 'High' | 'Moderate' | 'Low' | 'Needs Optimization';
  reasoning: string;
}

export interface BetterActionVerb {
  weakVerbFound: string;
  recommendedReplacement: string;
  context: string;
}

export interface WordingImprovement {
  original: string;
  improved: string;
  explanation: string;
}

export interface ProjectImprovement {
  projectName: string;
  feedback: string;
  suggestedAdditions: string[];
}

export interface RecommendedProject {
  title: string;
  techStack: string[];
  description: string;
}

export interface SectionAnalysis {
  score?: number;
  status: string;
  feedback: string;
  details?: string[];
}

export interface ResumeAnalysis {
  id?: string;
  userId?: string;
  resumeTitle: string;
  resumeText: string;
  targetJobTitle?: string;

  // Candidate Level
  candidateLevel: CandidateLevel;

  // 10 Detailed Scores (0-100)
  atsScore: number; // Overall ATS Score
  formattingScore: number;
  grammarScore: number;
  skillsScore: number;
  projectQualityScore: number;
  internshipScore: number;
  certificationScore: number;
  readabilityScore: number;
  keywordMatchScore: number;
  professionalismScore: number;

  // Presence & Links
  hasGithub: boolean;
  hasLinkedin: boolean;
  hasPortfolio: boolean;
  missingSections: string[];

  // Skills & Keywords
  detectedSkills: string[];
  missingSkills: string[];
  missingTechnicalSkills: string[];
  missingSoftSkills: string[];
  detectedKeywords: string[];
  missingKeywords: string[];

  // AI Feedback
  topStrengths: string[];
  weaknesses: string[];
  missingCertifications: string[];
  missingProjects: string[];

  grammarMistakes: string[];
  formattingSuggestions: string[];
  keywordSuggestions: string[];

  betterActionVerbs: BetterActionVerb[];
  professionalWordingImprovements: WordingImprovement[];
  projectDescriptionImprovements: ProjectImprovement[];
  internshipDescriptionImprovements: string[];
  professionalSummaryImprovements: string[];

  // Role & Student Career Guidance
  suggestedRoles: string[];
  recommendedSkillsToLearn: string[];
  recommendedCertifications: string[];
  recommendedProjectsToBuild: RecommendedProject[];
  recommendedInterviewTopics: string[];

  // Company-wise ATS Compatibility Estimates (Google, Microsoft, Amazon, TCS, Infosys, Accenture, Wipro, Cognizant, Capgemini, Zoho)
  companyAtsEstimates: CompanyAtsEstimate[];

  // Narrative Feedback
  experienceFeedback: string;
  projectFeedback: string;
  educationFeedback: string;
  resumeSummary: string;
  improvedResumeTips: string[];

  // Backward compatibility fields for legacy views
  overallScore?: number;
  keywordScore?: number;
  impactScore?: number;
  summary?: string;
  strengths?: string[];
  grammar?: SectionAnalysis;
  formatting?: SectionAnalysis;
  skills?: {
    technical: string[];
    soft: string[];
    all: string[];
  };
  projects?: SectionAnalysis;
  education?: SectionAnalysis;
  experience?: SectionAnalysis;
  keySkillsFound?: string[];

  createdAt: string;
}
