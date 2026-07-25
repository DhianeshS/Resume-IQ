import React, { useState } from 'react';
import { motion } from 'motion/react';
import {
  BookOpen,
  Code2,
  GraduationCap,
  Briefcase,
  ChevronDown,
  ChevronUp,
  Sparkles,
  ExternalLink,
  Github,
  Linkedin,
  Globe,
  Compass,
  ListChecks,
} from 'lucide-react';

export const CareerCenterView: React.FC = () => {
  const [expandedFaq, setExpandedFaq] = useState<number | null>(0);

  const recommendedSkills = [
    { name: 'React.js & Next.js 14', category: 'Frontend', demand: 'Very High', status: 'In Progress' },
    { name: 'TypeScript & Node.js ESM', category: 'Full Stack', demand: 'Crucial', status: 'Recommended' },
    { name: 'PostgreSQL & Drizzle ORM', category: 'Database', demand: 'High', status: 'Recommended' },
    { name: 'Docker & Kubernetes Fundamentals', category: 'DevOps', demand: 'High', status: 'Recommended' },
    { name: 'System Design & Scalability', category: 'Architecture', demand: 'High', status: 'Advanced' },
    { name: 'Gemini & AI SDK Integration', category: 'AI / LLM', demand: 'Trending', status: 'Essential' },
  ];

  const certifications = [
    { name: 'AWS Certified Solutions Architect – Associate', provider: 'Amazon Web Services', duration: '3 months', badge: 'Cloud' },
    { name: 'Google Cloud Associate Cloud Engineer', provider: 'Google Cloud', duration: '2 months', badge: 'Cloud & AI' },
    { name: 'Meta Front-End Developer Professional Certificate', provider: 'Meta / Coursera', duration: '1.5 months', badge: 'Web Tech' },
    { name: 'Oracle Certified Professional: Java SE Developer', provider: 'Oracle', duration: '2 months', badge: 'Core CS' },
  ];

  const interviewQuestions = [
    {
      q: 'How do you optimize React component re-renders in a large application?',
      type: 'Technical Frontend',
      answer:
        'Use React.memo for pure presentation components, React.useCallback for passing event callbacks to child components, and React.useMemo for expensive calculations. Structure state locally so dynamic changes don’t trigger top-level root tree re-renders.',
    },
    {
      q: 'Explain the difference between SQL indexing (B-Tree) vs Full-Text Search.',
      type: 'Database Architecture',
      answer:
        'B-Tree indexes optimize exact matches and range queries (WHERE age > 25). Full-Text Search parses text into tokens, stems words, and uses inverted indexes to score term frequency and relevance (TF-IDF).',
    },
    {
      q: 'Describe a situation where a project failed to meet a deadline. How did you handle it?',
      type: 'Behavioral (STAR Method)',
      answer:
        'Structure your answer using STAR: Situation (unforeseen API dependency bottleneck), Task (shipping core MVP), Action (re-prioritized non-critical features with stakeholders & communicated transparently), Result (delivered stable release on revised timeline with 100% test coverage).',
    },
    {
      q: 'How does Gemini API streaming work with Express backend proxies?',
      type: 'AI Integration',
      answer:
        'Using server-sent events (SSE) or chunked HTTP transfer-encoding, the backend listens to Gemini generateContentStream and pipes response tokens directly to the client readable stream without keeping the connection pending.',
    },
  ];

  const codingPlatforms = [
    { name: 'LeetCode', url: 'https://leetcode.com', desc: 'Solve Top 150 Interview Questions (Array, Dynamic Programming, Graphs)', color: 'bg-amber-50 text-amber-800' },
    { name: 'HackerRank', url: 'https://hackerrank.com', desc: 'Get certified in Problem Solving, SQL & Data Structures', color: 'bg-emerald-50 text-emerald-800' },
    { name: 'GeeksforGeeks', url: 'https://geeksforgeeks.org', desc: 'Core CS subjects: OS, DBMS, Computer Networks & System Design', color: 'bg-blue-50 text-blue-800' },
    { name: 'CodeChef', url: 'https://codechef.com', desc: 'Participate in Starters & Long Challenges to boost competitive rating', color: 'bg-purple-50 text-purple-800' },
  ];

  const roadmapSteps = [
    { step: 1, title: 'Build Solid Core Fundamentals', desc: 'Data Structures, Algorithms, OOPs, DBMS, OS & Networking' },
    { step: 2, title: 'Master Production Stack', desc: 'TypeScript, React 18, Node.js, Express, PostgreSQL & Tailwind CSS' },
    { step: 3, title: 'Build 2-3 High-Impact Projects', desc: 'Real-time apps, payment processing, OAuth authentication & Gemini AI integrations' },
    { step: 4, title: 'Optimize Resume & Online Profiles', desc: 'ATS Score 85+, clean GitHub commits, polished LinkedIn bio & portfolio site' },
    { step: 5, title: 'Mock Interviews & Campus Drives', desc: 'LeetCode 150+, System Design basics, STAR behavioral preparation' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-2"
      >
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100 flex items-center gap-1.5">
            <Compass className="w-4 h-4" /> Career Guidance Engine
          </span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
          Career Center & Skill Roadmap
        </h2>
        <p className="text-sm text-gray-600 max-w-3xl leading-relaxed">
          Access curated tech stack recommendations, top industry certifications, AI interview preparation guides, and profile optimization strategies to ace your upcoming campus placement drives and tech interviews.
        </p>
      </motion.div>

      {/* ROADMAP SECTION */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-6">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[#2563EB]" />
          5-Step Placement Preparation Roadmap
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 relative">
          {roadmapSteps.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-2 relative">
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] text-white font-bold text-xs flex items-center justify-center shadow-md shadow-blue-500/20">
                {item.step}
              </div>
              <h4 className="font-bold text-xs text-gray-900">{item.title}</h4>
              <p className="text-[11px] text-gray-500 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* TWO COLUMN GRID: SKILLS & CERTIFICATIONS */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* SKILLS TO MASTER */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-indigo-600" />
            In-Demand Tech Stack Matrix
          </h3>
          <div className="space-y-3">
            {recommendedSkills.map((sk, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-gray-50 border border-gray-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-gray-900 block">{sk.name}</span>
                  <span className="text-gray-400 font-medium">{sk.category}</span>
                </div>
                <div className="text-right">
                  <span className="px-2.5 py-1 rounded-full bg-blue-50 text-[#2563EB] font-bold text-[10px] border border-blue-100">
                    Demand: {sk.demand}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* TOP CERTIFICATIONS */}
        <div className="lg:col-span-6 bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-4">
          <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            Recommended Industry Certifications
          </h3>
          <div className="space-y-3">
            {certifications.map((c, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-emerald-50/40 border border-emerald-100 flex items-center justify-between text-xs">
                <div>
                  <span className="font-bold text-emerald-950 block">{c.name}</span>
                  <span className="text-emerald-700 font-medium">{c.provider} • Est. {c.duration}</span>
                </div>
                <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                  {c.badge}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CODING PLATFORMS GRID */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <BookOpen className="w-5 h-5 text-amber-600" />
          Top Coding & Practice Platforms
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {codingPlatforms.map((p, idx) => (
            <a
              key={idx}
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="p-5 rounded-2xl border border-gray-100 hover:border-blue-500 hover:shadow-md transition-all group block space-y-2"
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm text-gray-900 group-hover:text-[#2563EB]">{p.name}</span>
                <ExternalLink className="w-4 h-4 text-gray-400 group-hover:text-[#2563EB]" />
              </div>
              <p className="text-xs text-gray-500 leading-relaxed">{p.desc}</p>
            </a>
          ))}
        </div>
      </div>

      {/* AI INTERVIEW PREPARATION ACCORDION */}
      <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-4">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
          <Briefcase className="w-5 h-5 text-purple-600" />
          AI Interview Preparation & Ideal Answers
        </h3>

        <div className="space-y-3">
          {interviewQuestions.map((iq, idx) => (
            <div key={idx} className="border border-gray-200 rounded-2xl overflow-hidden transition-all">
              <button
                onClick={() => setExpandedFaq(expandedFaq === idx ? null : idx)}
                className="w-full text-left p-4 sm:p-5 flex items-center justify-between bg-gray-50/50 hover:bg-gray-100/50 transition-colors cursor-pointer"
              >
                <div>
                  <span className="text-[10px] font-bold uppercase text-purple-600 bg-purple-50 px-2 py-0.5 rounded-md border border-purple-100 mr-2">
                    {iq.type}
                  </span>
                  <span className="font-bold text-xs sm:text-sm text-gray-900">{iq.q}</span>
                </div>
                {expandedFaq === idx ? (
                  <ChevronUp className="w-5 h-5 text-gray-400 shrink-0" />
                ) : (
                  <ChevronDown className="w-5 h-5 text-gray-400 shrink-0" />
                )}
              </button>

              {expandedFaq === idx && (
                <div className="p-5 bg-white border-t border-gray-100 text-xs text-gray-700 space-y-2 leading-relaxed">
                  <span className="font-bold text-purple-900 block uppercase text-[10px]">Model Recruiter Answer Guide:</span>
                  <p>{iq.answer}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* PROFILE OPTIMIZATION CHECKLISTS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Github className="w-4 h-4 text-gray-900" />
            GitHub Profile Optimization
          </h4>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <ListChecks className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Pinned repositories with live deployment links & clean README.md badges.</span>
            </li>
            <li className="flex items-start gap-2">
              <ListChecks className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Consistent green commit graph over 6+ months.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Linkedin className="w-4 h-4 text-[#0A66C2]" />
            LinkedIn Profile Checklist
          </h4>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <ListChecks className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Target Role Headline (e.g. "Software Engineer @ Student | Full Stack | React & Node").</span>
            </li>
            <li className="flex items-start gap-2">
              <ListChecks className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>500+ Connections & active posts summarizing completed projects.</span>
            </li>
          </ul>
        </div>

        <div className="bg-white p-6 rounded-[28px] border border-gray-100 shadow-xs space-y-3">
          <h4 className="font-bold text-sm text-gray-900 flex items-center gap-2">
            <Globe className="w-4 h-4 text-[#2563EB]" />
            Portfolio Website Checklist
          </h4>
          <ul className="space-y-2 text-xs text-gray-600">
            <li className="flex items-start gap-2">
              <ListChecks className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Fast page load under 1s, mobile responsive & clean typography.</span>
            </li>
            <li className="flex items-start gap-2">
              <ListChecks className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span>Direct contact form & downloadable resume PDF button.</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};
