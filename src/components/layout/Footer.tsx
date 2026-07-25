import React from 'react';
import { Sparkles, ArrowUp } from 'lucide-react';

export const Footer: React.FC = () => {
  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer id="app-footer" className="w-full border-t border-gray-100 bg-white py-16 mt-20">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 pb-12 border-b border-gray-100">
          {/* Brand Info */}
          <div className="md:col-span-1 space-y-4">
            <div className="flex items-center gap-2 text-lg font-bold tracking-tight text-gray-900">
              <div className="w-8 h-8 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
                <Sparkles className="w-4 h-4" />
              </div>
              <span>Resume<span className="text-[#2563EB]">IQ</span></span>
            </div>
            <p className="text-sm text-gray-500 leading-relaxed">
              Empowering job seekers with instant, AI-driven resume evaluation, ATS optimization, and actionable feedback.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Product</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#features" className="hover:text-gray-900 transition-colors">ATS Scoring</a></li>
              <li><a href="#features" className="hover:text-gray-900 transition-colors">Keyword Optimization</a></li>
              <li><a href="#features" className="hover:text-gray-900 transition-colors">Grammar Inspection</a></li>
              <li><a href="#features" className="hover:text-gray-900 transition-colors">Skills Detection</a></li>
            </ul>
          </div>

          {/* Resources */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Resources</h4>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#about" className="hover:text-gray-900 transition-colors">About ResumeIQ</a></li>
              <li><a href="#about" className="hover:text-gray-900 transition-colors">Career Advice</a></li>
              <li><a href="#contact" className="hover:text-gray-900 transition-colors">Contact Support</a></li>
              <li><a href="#privacy" className="hover:text-gray-900 transition-colors">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-xs font-semibold text-gray-900 uppercase tracking-wider">Contact</h4>
            <p className="text-sm text-gray-600">Have questions or feedback? We'd love to hear from you.</p>
            <a href="mailto:support@resumeiq.ai" className="inline-block text-sm font-medium text-[#2563EB] hover:underline">
              support@resumeiq.ai
            </a>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-gray-500">
          <p>© {new Date().getFullYear()} ResumeIQ. Built with precision and clarity.</p>
          <button
            id="footer-back-to-top"
            onClick={scrollToTop}
            className="flex items-center gap-1.5 text-gray-500 hover:text-gray-900 transition-colors py-1 px-3 rounded-full hover:bg-gray-100"
          >
            <span>Back to top</span>
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
};

