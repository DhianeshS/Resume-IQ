import React, { useState, useRef } from 'react';
import mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import {
  Upload,
  FileText,
  Sparkles,
  AlertCircle,
  ArrowRight,
  Check,
  X,
  Trash2,
  FileType,
  Clock,
  HardDrive,
  RefreshCw,
} from 'lucide-react';

// Configure pdfjs worker
try {
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;
} catch (e) {
  console.warn('pdfjs worker init warning:', e);
}

interface ResumeUploaderProps {
  onAnalyze: (resumeText: string, targetJobTitle: string, jobDescription: string) => Promise<void>;
  isLoading: boolean;
}

interface UploadedFileInfo {
  name: string;
  size: string;
  uploadTime: string;
  type: 'pdf' | 'docx' | 'txt' | 'other';
  rawFile: File;
}

const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const SAMPLE_RESUMES = [
  {
    label: 'Software Engineer',
    title: 'Senior Frontend Developer',
    text: `Alex Morgan
Senior Software Engineer
San Francisco, CA | alex.morgan@email.com | (555) 019-2834 | linkedin.com/in/alexmorgan

SUMMARY
Dedicated Software Engineer with 6+ years of experience building scalable web applications with React, TypeScript, and Node.js. Proven track record of improving site performance by 40% and leading engineering teams.

EXPERIENCE
Senior Software Engineer | TechCorp Inc.
Jan 2022 – Present | San Francisco, CA
- Architected and delivered high-performance web dashboard using React 18, TypeScript, and Tailwind CSS serving 500k monthly active users.
- Reduced initial bundle load time by 45% using code splitting, memoization, and server-side rendering optimizations.
- Mentored 4 junior developers and conducted 50+ code reviews ensuring strict TypeScript type safety standards.

Software Engineer | DevWorks Studio
Jun 2018 – Dec 2021 | Austin, TX
- Developed RESTful APIs using Node.js, Express, and PostgreSQL supporting mobile and web platforms.
- Integrated automated CI/CD pipelines using GitHub Actions, reducing deployment errors by 30%.
- Collaborated with product designers to implement responsive, accessible UI components adhering to WCAG 2.1 AA guidelines.

SKILLS
- Languages: JavaScript (ES6+), TypeScript, HTML5, CSS3/Tailwind
- Frameworks & Libraries: React, Next.js, Node.js, Express, Redux Toolkit
- Tools & Databases: Git, GraphQL, REST APIs, PostgreSQL, Docker, Jest

EDUCATION
B.S. in Computer Science | University of Texas at Austin (2014 – 2018)`,
  },
  {
    label: 'Product Manager',
    title: 'Senior Product Manager',
    text: `Jordan Smith
Senior Product Manager
New York, NY | jordan.smith@email.com | (555) 839-1029

SUMMARY
Strategic Product Manager with 5+ years driving SaaS product growth from vision to launch. Expert in user research, data analytics, and agile roadmap execution.

EXPERIENCE
Lead Product Manager | CloudScale Solutions
Mar 2021 – Present
- Owned end-to-end strategy for enterprise collaboration suite, growing ARR by 35% in 18 months.
- Conducted 60+ customer interviews to define core user personas and prioritize roadmap backlog.
- Partnered with engineering and UX teams to launch 12 major features on schedule.

SKILLS
Agile/Scrum, Product Strategy, User Research, SQL, Mixpanel, Figma, JIRA, Roadmap Prioritization`,
  },
];

export const ResumeUploader: React.FC<ResumeUploaderProps> = ({ onAnalyze, isLoading }) => {
  const [activeTab, setActiveTab] = useState<'upload' | 'paste'>('upload');
  const [resumeText, setResumeText] = useState('');
  const [targetJobTitle, setTargetJobTitle] = useState('');
  const [jobDescription, setJobDescription] = useState('');
  
  // Drag and drop / File upload state
  const [dragActive, setDragActive] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [fileInfo, setFileInfo] = useState<UploadedFileInfo | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(2)} MB`;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const extractTextFromDocx = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value || '';
  };

  const extractTextFromPdf = async (file: File): Promise<string> => {
    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = pdfjsLib.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let fullText = '';
    for (let i = 1; i <= pdf.numPages; i++) {
      const page = await pdf.getPage(i);
      const tokenized = await page.getTextContent();
      const pageText = tokenized.items.map((item: any) => item.str).join(' ');
      fullText += pageText + '\n';
    }
    return fullText;
  };

  const processFile = async (file: File) => {
    setError(null);

    // 1. Validate file size (max 5MB)
    if (file.size > MAX_FILE_SIZE_BYTES) {
      setError(`File size exceeds maximum limit of 5 MB (${formatFileSize(file.size)}). Please upload a smaller file.`);
      return;
    }

    const fileExt = file.name.split('.').pop()?.toLowerCase() || '';
    let fileTypeCategory: 'pdf' | 'docx' | 'txt' | 'other' = 'other';
    if (fileExt === 'pdf') fileTypeCategory = 'pdf';
    else if (fileExt === 'docx' || fileExt === 'doc') fileTypeCategory = 'docx';
    else if (['txt', 'md', 'rtf'].includes(fileExt)) fileTypeCategory = 'txt';

    // 2. Start simulated smooth progress
    setUploadProgress(15);
    const nowTime = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    try {
      let extractedText = '';

      setUploadProgress(40);

      if (fileExt === 'docx') {
        extractedText = await extractTextFromDocx(file);
      } else if (fileExt === 'pdf') {
        try {
          extractedText = await extractTextFromPdf(file);
        } catch (pdfErr) {
          console.warn('PDF JS extraction fallback:', pdfErr);
          // Fallback to basic text reader
          const reader = new FileReader();
          extractedText = await new Promise((resolve) => {
            reader.onload = (ev) => resolve((ev.target?.result as string) || '');
            reader.readAsText(file);
          });
        }
      } else {
        const reader = new FileReader();
        extractedText = await new Promise((resolve, reject) => {
          reader.onload = (ev) => resolve((ev.target?.result as string) || '');
          reader.onerror = () => reject(new Error('Failed to read file'));
          reader.readAsText(file);
        });
      }

      setUploadProgress(85);

      if (!extractedText || extractedText.trim().length === 0) {
        throw new Error('Could not extract readable text from this file. Please paste text directly or try another file.');
      }

      // Complete progress
      setTimeout(() => {
        setUploadProgress(100);
        setTimeout(() => {
          setUploadProgress(null);
          setResumeText(extractedText);
          setFileInfo({
            name: file.name,
            size: formatFileSize(file.size),
            uploadTime: nowTime,
            type: fileTypeCategory,
            rawFile: file,
          });
        }, 200);
      }, 200);
    } catch (err: any) {
      console.error('File reading error:', err);
      setUploadProgress(null);
      setError(err?.message || 'Error parsing file. Please try pasting your resume text directly.');
    }
  };

  const handleRemoveFile = () => {
    setFileInfo(null);
    setResumeText('');
    setError(null);
    setUploadProgress(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const loadSample = (sample: typeof SAMPLE_RESUMES[0]) => {
    setResumeText(sample.text);
    setTargetJobTitle(sample.title);
    setFileInfo({
      name: `${sample.label.toLowerCase().replace(/\s+/g, '_')}_resume.pdf`,
      size: '1.2 MB',
      uploadTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: 'pdf',
      rawFile: new File([sample.text], 'sample_resume.pdf'),
    });
    setError(null);
    setActiveTab('upload');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!resumeText.trim()) {
      setError('Please upload a resume file or paste your resume text to analyze.');
      return;
    }
    setError(null);
    await onAnalyze(resumeText, targetJobTitle, jobDescription);
  };

  return (
    <div id="resume-uploader-card" className="bg-white rounded-[24px] border border-gray-100 p-8 sm:p-10 shadow-xl shadow-gray-200/40 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-6 border-b border-gray-100">
        <div>
          <h2 className="text-xl font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <span>Resume Evaluation</span>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-blue-50 text-[#2563EB]">PDF & DOCX</span>
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Upload your resume or paste text to receive instant ATS scoring, keyword alignment, and recruiter insights.
          </p>
        </div>

        {/* Mode Toggle */}
        <div className="flex bg-gray-100 p-1 rounded-xl self-stretch sm:self-auto shrink-0">
          <button
            id="tab-upload-btn"
            type="button"
            onClick={() => setActiveTab('upload')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'upload' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Upload File
          </button>
          <button
            id="tab-paste-btn"
            type="button"
            onClick={() => setActiveTab('paste')}
            className={`flex-1 sm:flex-none px-4 py-1.5 text-xs font-semibold rounded-lg transition-all ${
              activeTab === 'paste' ? 'bg-white text-gray-900 shadow-sm' : 'text-gray-500 hover:text-gray-900'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Sample Resume quick picks */}
        <div className="flex items-center justify-between flex-wrap gap-2 text-xs text-gray-500">
          <span>Need a test file? Try a pre-loaded sample:</span>
          <div className="flex gap-2">
            {SAMPLE_RESUMES.map((sample, idx) => (
              <button
                key={idx}
                id={`sample-resume-btn-${idx}`}
                type="button"
                onClick={() => loadSample(sample)}
                className="px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] hover:bg-blue-100 font-medium transition-colors"
              >
                + {sample.label}
              </button>
            ))}
          </div>
        </div>

        {/* UPLOAD FILE TAB */}
        {activeTab === 'upload' && (
          <div className="space-y-4">
            {/* Hidden Input */}
            <input
              ref={fileInputRef}
              id="file-input"
              type="file"
              accept=".pdf,.docx,.doc,.txt,.md,.rtf"
              onChange={handleFileChange}
              className="hidden"
            />

            {/* Upload Progress Bar */}
            {uploadProgress !== null && (
              <div className="p-6 rounded-[20px] bg-blue-50/50 border border-blue-100 space-y-3 animate-in fade-in">
                <div className="flex items-center justify-between text-xs font-semibold text-[#2563EB]">
                  <span className="flex items-center gap-2">
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>Processing & Extracting Resume Content...</span>
                  </span>
                  <span>{uploadProgress}%</span>
                </div>
                <div className="w-full h-2 rounded-full bg-blue-100 overflow-hidden">
                  <div
                    className="h-full bg-[#2563EB] transition-all duration-200 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}

            {/* File Dropzone or Upload Preview Card */}
            {!fileInfo ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`border-2 border-dashed rounded-[20px] p-8 sm:p-10 text-center transition-all ${
                  dragActive
                    ? 'border-[#2563EB] bg-blue-50/60 scale-[1.005]'
                    : 'border-gray-200 hover:border-blue-300 bg-gray-50/40 hover:bg-white'
                }`}
              >
                <div className="space-y-4 max-w-md mx-auto">
                  <div className="w-14 h-14 rounded-2xl bg-blue-50 text-[#2563EB] mx-auto flex items-center justify-center shadow-sm">
                    <Upload className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-gray-900">
                      Drag & drop your resume here
                    </h3>
                    <p className="text-xs text-gray-500 mt-1">
                      Supports PDF, DOCX, DOC or TXT up to <span className="font-semibold text-gray-700">5 MB</span>
                    </p>
                  </div>

                  <div className="pt-2">
                    <button
                      id="browse-files-btn"
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="px-6 py-3 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/15 transition-all cursor-pointer inline-flex items-center gap-2"
                    >
                      <FileType className="w-4 h-4" />
                      <span>Browse Files</span>
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              /* FILE PREVIEW CARD */
              <div
                id="file-preview-card"
                className="p-6 rounded-[20px] bg-white border border-blue-100 shadow-sm space-y-4 animate-in fade-in"
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3.5 min-w-0">
                    <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0 font-bold text-xs uppercase shadow-2xs">
                      {fileInfo.type}
                    </div>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-gray-900 truncate">
                        {fileInfo.name}
                      </h4>
                      <div className="flex items-center gap-3 text-xs text-gray-400 mt-1">
                        <span className="flex items-center gap-1">
                          <HardDrive className="w-3 h-3" />
                          {fileInfo.size}
                        </span>
                        <span>•</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Uploaded at {fileInfo.uploadTime}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Remove File Button */}
                  <button
                    id="remove-file-btn"
                    type="button"
                    onClick={handleRemoveFile}
                    className="p-2 rounded-xl text-gray-400 hover:text-red-600 hover:bg-red-50 transition-colors shrink-0"
                    title="Remove file"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>

                {/* Text snippet preview */}
                <div className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 text-xs text-gray-600 space-y-1">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-gray-400 uppercase tracking-wider">
                    <span>Parsed Content Snippet</span>
                    <span>{resumeText.length} Characters</span>
                  </div>
                  <p className="line-clamp-2 font-mono text-[11px] text-gray-700 leading-relaxed">
                    {resumeText}
                  </p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* PASTE TEXT TAB */}
        {activeTab === 'paste' && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label htmlFor="resume-text-input" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Resume Content *
              </label>
              {resumeText && (
                <span className="text-xs text-gray-400 font-mono">{resumeText.length} characters</span>
              )}
            </div>
            <textarea
              id="resume-text-input"
              rows={8}
              value={resumeText}
              onChange={(e) => setResumeText(e.target.value)}
              placeholder="Paste full resume text (Summary, Work Experience, Skills, Education)..."
              className="w-full rounded-2xl border border-gray-200 p-4 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all resize-y font-sans"
            />
          </div>
        )}

        {/* Optional Job Matching Input Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
          <div className="space-y-2">
            <label htmlFor="target-job-title-input" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Target Job Title <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="target-job-title-input"
              type="text"
              value={targetJobTitle}
              onChange={(e) => setTargetJobTitle(e.target.value)}
              placeholder="e.g. Senior Frontend Engineer"
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="job-description-input" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
              Target Job Description <span className="text-gray-400 font-normal">(Optional)</span>
            </label>
            <input
              id="job-description-input"
              type="text"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              placeholder="Paste job posting details or required keywords..."
              className="w-full rounded-xl border border-gray-200 px-4 py-3 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
            />
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <div className="p-4 rounded-xl bg-red-50 border border-red-100 flex items-center gap-3 text-xs text-red-600 animate-in fade-in">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {/* Primary CTA Submit Button */}
        <button
          id="analyze-resume-btn"
          type="submit"
          disabled={isLoading || uploadProgress !== null}
          className="w-full py-4 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-base shadow-lg shadow-blue-500/20 flex items-center justify-center gap-3 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer"
        >
          {isLoading ? (
            <>
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              <span>Analyzing Resume with AI Intelligence...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-5 h-5" />
              <span>Analyze Resume</span>
              <ArrowRight className="w-5 h-5 ml-1" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};



