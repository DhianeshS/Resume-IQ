import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { CoverLetterResponse } from '../../types';
import {
  FileText,
  Sparkles,
  Copy,
  Check,
  Download,
  Building2,
  Briefcase,
  Layers,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react';

interface CoverLetterViewProps {
  onRequireUpgrade: () => void;
}

export const CoverLetterView: React.FC<CoverLetterViewProps> = ({ onRequireUpgrade }) => {
  const { user } = useAuth();

  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  const [resumeText, setResumeText] = useState('');
  const [tone, setTone] = useState<'Professional' | 'Energetic' | 'Executive' | 'Creative'>('Professional');

  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<CoverLetterResponse | null>(null);
  const [copied, setCopied] = useState(false);

  const canDownload = user?.isPremium || user?.isStudentVerified || user?.accountType === 'verified_student';

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!targetJobTitle.trim() || !companyName.trim()) {
      alert('Please enter Target Job Title and Company Name');
      return;
    }

    setIsGenerating(true);
    setResult(null);

    try {
      const res = await fetch('/api/generate-cover-letter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetJobTitle,
          companyName,
          jobDescription,
          resumeText,
          tone,
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to generate cover letter');
      }

      const data: CoverLetterResponse = await res.json();
      setResult(data);
    } catch (err) {
      console.error(err);
      alert('Error generating cover letter. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleCopy = () => {
    if (!result) return;
    const fullText = `${result.subjectLine}\n\n${result.salutation}\n\n${result.coverLetterText}\n\n${result.callToAction}`;
    navigator.clipboard.writeText(fullText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadText = () => {
    if (!canDownload) {
      onRequireUpgrade();
      return;
    }
    if (!result) return;

    const fullText = `${result.subjectLine}\n\n${result.salutation}\n\n${result.coverLetterText}\n\nKey Highlights:\n${result.keyHighlights.map((h) => '• ' + h).join('\n')}\n\n${result.callToAction}`;
    const blob = new Blob([fullText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Cover_Letter_${result.companyName}_${result.targetJobTitle}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-8 max-w-6xl mx-auto pb-12">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-2"
      >
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100 flex items-center gap-1.5">
            <FileText className="w-4 h-4" /> AI Career Tool
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          AI Cover Letter Generator
        </h2>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          Instantly generate tailored, ATS-friendly cover letters aligned with specific company roles, technical job requirements, and your preferred professional tone.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* INPUT FORM */}
        <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-5">
          <h3 className="text-base font-bold text-gray-900 flex items-center gap-2 border-b border-gray-100 pb-3">
            <Sparkles className="w-5 h-5 text-[#2563EB]" />
            Application Details
          </h3>

          <form onSubmit={handleGenerate} className="space-y-4 text-xs">
            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Target Role / Job Title <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Briefcase className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Software Engineer, React Developer"
                  value={targetJobTitle}
                  onChange={(e) => setTargetJobTitle(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Company Name <span className="text-rose-500">*</span>
              </label>
              <div className="relative">
                <Building2 className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Google, Microsoft, TCS, Startup Inc."
                  value={companyName}
                  onChange={(e) => setCompanyName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Tone & Voice Style
              </label>
              <select
                value={tone}
                onChange={(e: any) => setTone(e.target.value)}
                className="w-full px-4 py-2.5 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none font-medium"
              >
                <option value="Professional">Professional & Confident</option>
                <option value="Energetic">Energetic & Enthusiastic</option>
                <option value="Executive">Executive & Strategic</option>
                <option value="Creative">Creative & Modern</option>
              </select>
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Job Description / Key Requirements (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Paste job description bullet points to match key tech stack..."
                value={jobDescription}
                onChange={(e) => setJobDescription(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <div>
              <label className="block font-bold text-gray-700 uppercase tracking-wider mb-1">
                Your Resume Text / Highlights (Optional)
              </label>
              <textarea
                rows={3}
                placeholder="Paste key achievements from your resume..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
                className="w-full p-3 rounded-xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            <button
              id="generate-cover-letter-btn"
              type="submit"
              disabled={isGenerating}
              className="w-full py-3.5 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isGenerating ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Drafting Cover Letter...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Generate AI Cover Letter</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* PREVIEW & RESULT */}
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs flex flex-col justify-between space-y-6 min-h-[480px]">
          {result ? (
            <div className="space-y-5">
              {/* Header Actions */}
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <div>
                  <span className="text-[10px] font-bold uppercase text-[#2563EB] bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-100">
                    Generated Cover Letter
                  </span>
                  <h4 className="font-bold text-base text-gray-900 mt-1">
                    {result.targetJobTitle} @ {result.companyName}
                  </h4>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={handleCopy}
                    className="p-2.5 rounded-xl border border-gray-200 hover:bg-gray-50 text-gray-700 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-gray-500" />}
                    <span>{copied ? 'Copied' : 'Copy'}</span>
                  </button>

                  <button
                    onClick={handleDownloadText}
                    className="p-2.5 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <Download className="w-4 h-4" />
                    <span>Download</span>
                  </button>
                </div>
              </div>

              {/* Subject & Salutation */}
              <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 text-xs">
                <p className="font-bold text-gray-900">Subject: {result.subjectLine}</p>
                <p className="font-semibold text-gray-700">{result.salutation}</p>
              </div>

              {/* Letter Body */}
              <div className="text-xs sm:text-sm text-gray-800 leading-relaxed space-y-3 whitespace-pre-line font-sans">
                {result.coverLetterText}
              </div>

              {/* Highlights */}
              <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 text-xs space-y-2">
                <span className="font-bold text-blue-950 block">Key Career Highlights:</span>
                <ul className="space-y-1 text-gray-700 list-disc pl-4">
                  {result.keyHighlights.map((h, i) => (
                    <li key={i}>{h}</li>
                  ))}
                </ul>
              </div>

              {/* Closing */}
              <p className="text-xs font-semibold text-gray-700 pt-2 border-t border-gray-100">
                {result.callToAction}
              </p>
            </div>
          ) : (
            <div className="my-auto text-center py-12 space-y-3">
              <div className="w-16 h-16 rounded-3xl bg-blue-50 text-[#2563EB] flex items-center justify-center mx-auto">
                <FileText className="w-8 h-8" />
              </div>
              <h4 className="font-bold text-base text-gray-900">Ready to Draft Your Cover Letter</h4>
              <p className="text-xs text-gray-500 max-w-sm mx-auto">
                Fill in your target job title and company name to let AI generate a customized executive cover letter in seconds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
