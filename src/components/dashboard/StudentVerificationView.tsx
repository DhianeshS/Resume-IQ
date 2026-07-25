import React, { useState } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import {
  GraduationCap,
  CheckCircle2,
  Mail,
  Upload,
  ShieldCheck,
  Building2,
  Sparkles,
  Award,
  Check,
  ArrowRight,
} from 'lucide-react';

export const StudentVerificationView: React.FC = () => {
  const { user, verifyStudent } = useAuth();

  const [activeTab, setActiveTab] = useState<'email' | 'idcard'>('email');
  const [collegeName, setCollegeName] = useState(user?.studentCollege || '');
  const [collegeEmail, setCollegeEmail] = useState(user?.studentEmail || '');
  const [idCardFile, setIdCardFile] = useState<File | null>(null);
  const [idCardPreview, setIdCardPreview] = useState<string | null>(user?.studentIdUrl || null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState(false);

  const handleIdCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setIdCardFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setIdCardPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!collegeName.trim()) {
      alert('Please enter your college or university name');
      return;
    }

    setIsSubmitting(true);
    try {
      await verifyStudent({
        collegeName,
        studentEmail: collegeEmail,
        idCardUrl: idCardPreview || undefined,
      });
      setIsSubmitting(false);
      setSuccessMsg(true);
    } catch (err) {
      console.error(err);
      setIsSubmitting(false);
    }
  };

  const isVerified = user?.isStudentVerified || user?.accountType === 'verified_student';

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Banner */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-6"
      >
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-blue-50 text-[#2563EB] text-xs font-bold border border-blue-100 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4" /> Student Support Initiative
            </span>
            {isVerified && (
              <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" /> VERIFIED STUDENT
              </span>
            )}
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Student Verification Portal
          </h2>
          <p className="text-sm text-gray-600 max-w-2xl leading-relaxed">
            Verify your active student status to unlock <strong>100% Free Premium Access</strong> — including unlimited ATS resume reports, AI cover letters, and career roadmaps with no credit card needed!
          </p>
        </div>

        {isVerified && (
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 text-xs space-y-1 shrink-0">
            <span className="font-bold flex items-center gap-1.5 text-emerald-800">
              <ShieldCheck className="w-4 h-4 text-emerald-600" /> Active Free Student Pass
            </span>
            <p className="text-emerald-700 font-medium">Institution: {user.studentCollege}</p>
            <p className="text-emerald-600 text-[11px]">Badge: 🏅 Internship Champion</p>
          </div>
        )}
      </motion.div>

      {/* Success Notification */}
      {successMsg && (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="p-6 rounded-[24px] bg-emerald-500 text-white shadow-xl flex items-center justify-between gap-4"
        >
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold">Student Verification Successful! 🎉</h3>
              <p className="text-xs text-emerald-100">
                All Premium features, PDF downloads, and AI Cover Letter generators are now completely unlocked for free.
              </p>
            </div>
          </div>
          <button
            onClick={() => setSuccessMsg(false)}
            className="px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs cursor-pointer hover:bg-emerald-50"
          >
            Awesome!
          </button>
        </motion.div>
      )}

      {/* Verification Card Form */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-6">
          <div className="flex items-center justify-between border-b border-gray-100 pb-4">
            <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-[#2563EB]" />
              Institutional Verification
            </h3>
            <span className="text-xs text-gray-400 font-medium">Fast Approval</span>
          </div>

          {/* TAB CHOICE */}
          <div className="grid grid-cols-2 gap-2 bg-gray-100 p-1.5 rounded-2xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setActiveTab('email')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'email' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Mail className="w-4 h-4" />
              <span>College Email</span>
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('idcard')}
              className={`py-2.5 rounded-xl transition-all cursor-pointer flex items-center justify-center gap-2 ${activeTab === 'idcard' ? 'bg-white text-[#2563EB] shadow-xs' : 'text-gray-600 hover:text-gray-900'}`}
            >
              <Upload className="w-4 h-4" />
              <span>Upload Student ID</span>
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* College Name */}
            <div>
              <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                College / University Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Stanford University, IIT Bombay, MIT"
                value={collegeName}
                onChange={(e) => setCollegeName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
              />
            </div>

            {activeTab === 'email' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Institutional Student Email Address (.edu / .ac.in / college domain)
                </label>
                <input
                  type="email"
                  placeholder="e.g. candidate@university.edu or alex@iitb.ac.in"
                  value={collegeEmail}
                  onChange={(e) => setCollegeEmail(e.target.value)}
                  className="w-full px-4 py-3 rounded-2xl border border-gray-200 text-xs text-gray-900 focus:ring-2 focus:ring-blue-500 outline-none"
                />
              </div>
            )}

            {activeTab === 'idcard' && (
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Upload Valid Student ID Card Photo
                </label>
                <div className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-2xl p-6 text-center bg-gray-50/50 transition-colors cursor-pointer relative">
                  <input
                    type="file"
                    accept="image/*,.pdf"
                    onChange={handleIdCardChange}
                    className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                  />
                  {idCardPreview ? (
                    <div className="space-y-2">
                      <img
                        src={idCardPreview}
                        alt="Student ID Preview"
                        className="max-h-36 mx-auto rounded-xl border border-gray-200 shadow-2xs object-cover"
                      />
                      <span className="text-xs text-emerald-600 font-bold flex items-center justify-center gap-1">
                        <Check className="w-4 h-4" /> Student ID Card Attached
                      </span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <Upload className="w-8 h-8 text-gray-400 mx-auto" />
                      <p className="text-xs font-bold text-gray-700">Click or drag & drop student ID card</p>
                      <p className="text-[11px] text-gray-400">JPG, PNG, or PDF formats allowed</p>
                    </div>
                  )}
                </div>
              </div>
            )}

            <button
              id="submit-student-verification-btn"
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 px-6 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-lg shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
            >
              {isSubmitting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <GraduationCap className="w-5 h-5" />
                  <span>Verify Student Status & Unlock Free Premium</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* Benefits Sidebar */}
        <div className="lg:col-span-5 space-y-6">
          <div className="bg-white p-6 sm:p-8 rounded-[28px] border border-gray-100 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-gray-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Free Verified Student Benefits
            </h3>
            <div className="space-y-3 text-xs text-gray-700">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-emerald-50/50 border border-emerald-100">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-emerald-950 block">100% Free Access</span>
                  <p className="text-gray-600 text-[11px]">Zero fee, zero subscriptions, no credit card required.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-blue-50/50 border border-blue-100">
                <CheckCircle2 className="w-4 h-4 text-[#2563EB] shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-blue-950 block">Unlimited Downloads</span>
                  <p className="text-gray-600 text-[11px]">Download formatted ATS PDF reports for all job applications.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-purple-50/50 border border-purple-100">
                <CheckCircle2 className="w-4 h-4 text-purple-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-purple-950 block">AI Cover Letter Generator</span>
                  <p className="text-gray-600 text-[11px]">Generate customized cover letters for campus placement drives.</p>
                </div>
              </div>

              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-amber-50/50 border border-amber-100">
                <CheckCircle2 className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-amber-950 block">Achievement Badge</span>
                  <p className="text-gray-600 text-[11px]">Unlocks the 🏅 Internship Champion badge in your profile.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
