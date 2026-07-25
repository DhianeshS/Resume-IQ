import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { Sparkles, Menu, X, LogOut, User } from 'lucide-react';

interface NavbarProps {
  onOpenAuth: (mode?: 'login' | 'signup') => void;
  activeSection?: string;
  onNavigate?: (sectionId: string) => void;
  onOpenDashboard?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onOpenAuth,
  onNavigate,
  onOpenDashboard,
}) => {
  const { user, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (id: string) => {
    setMobileMenuOpen(false);
    if (onNavigate) {
      onNavigate(id);
    } else {
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth' });
      }
    }
  };

  return (
    <nav id="app-navbar" className="w-full border-b border-gray-100 bg-white/90 backdrop-blur-md sticky top-0 z-50 transition-all duration-200">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 h-20 flex items-center justify-between">
        {/* Logo */}
        <button
          id="nav-logo-btn"
          onClick={() => handleNavClick('hero')}
          className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
            <Sparkles className="w-5 h-5" />
          </div>
          <span className="font-semibold text-gray-900">Resume<span className="text-[#2563EB]">IQ</span></span>
        </button>

        {/* Desktop Navigation Links */}
        <div className="hidden md:flex items-center gap-7 text-sm font-medium text-gray-600">
          <button
            id="nav-link-home"
            onClick={() => handleNavClick('hero')}
            className="hover:text-gray-900 transition-colors focus:outline-none cursor-pointer"
          >
            Home
          </button>
          <button
            id="nav-link-features"
            onClick={() => handleNavClick('features')}
            className="hover:text-gray-900 transition-colors focus:outline-none cursor-pointer"
          >
            Features
          </button>
          <button
            id="nav-link-how-it-works"
            onClick={() => handleNavClick('how-it-works')}
            className="hover:text-gray-900 transition-colors focus:outline-none cursor-pointer"
          >
            How It Works
          </button>
          <button
            id="nav-link-pricing"
            onClick={() => handleNavClick('pricing')}
            className="hover:text-gray-900 transition-colors focus:outline-none cursor-pointer"
          >
            Pricing
          </button>
          <button
            id="nav-link-faq"
            onClick={() => handleNavClick('faq')}
            className="hover:text-gray-900 transition-colors focus:outline-none cursor-pointer"
          >
            FAQ
          </button>
        </div>

        {/* Desktop Auth Buttons */}
        <div className="hidden md:flex items-center gap-3">
          {user ? (
            <div className="flex items-center gap-3">
              {onOpenDashboard && (
                <button
                  id="nav-dashboard-btn"
                  onClick={onOpenDashboard}
                  className="flex items-center gap-2 px-4 py-2 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs shadow-sm shadow-blue-500/20 transition-all active:scale-[0.98]"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </button>
              )}
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-gray-50 border border-gray-100 text-xs font-medium text-gray-700">
                {user.photoURL ? (
                  <img src={user.photoURL} alt={user.displayName || 'User'} className="w-5 h-5 rounded-full" />
                ) : (
                  <User className="w-4 h-4 text-gray-500" />
                )}
                <span>{user.displayName || user.email?.split('@')[0]}</span>
              </div>
              <button
                id="nav-logout-btn"
                onClick={() => logout()}
                className="flex items-center gap-1.5 text-xs font-medium text-gray-500 hover:text-gray-900 transition-colors px-3 py-2 rounded-xl hover:bg-gray-100/80"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Log Out</span>
              </button>
            </div>
          ) : (
            <>
              <button
                id="nav-login-btn"
                onClick={() => onOpenAuth('login')}
                className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-100/70 rounded-xl transition-all"
              >
                Login
              </button>
              <button
                id="nav-signup-btn"
                onClick={() => onOpenAuth('signup')}
                className="px-5 py-2.5 text-sm font-medium text-white bg-[#2563EB] hover:bg-blue-700 rounded-2xl shadow-sm shadow-blue-500/20 transition-all active:scale-[0.98]"
              >
                Sign Up
              </button>
            </>
          )}
        </div>

        {/* Mobile menu toggle */}
        <div className="md:hidden flex items-center">
          <button
            id="mobile-menu-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-gray-600 hover:text-gray-900 rounded-xl hover:bg-gray-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div id="mobile-menu-drawer" className="md:hidden bg-white border-b border-gray-100 px-6 py-6 flex flex-col gap-4 animate-in slide-in-from-top duration-200">
          <button
            id="mobile-nav-home"
            onClick={() => handleNavClick('hero')}
            className="text-left text-base font-medium text-gray-700 hover:text-gray-900 py-2"
          >
            Home
          </button>
          <button
            id="mobile-nav-features"
            onClick={() => handleNavClick('features')}
            className="text-left text-base font-medium text-gray-700 hover:text-gray-900 py-2"
          >
            Features
          </button>
          <button
            id="mobile-nav-how-it-works"
            onClick={() => handleNavClick('how-it-works')}
            className="text-left text-base font-medium text-gray-700 hover:text-gray-900 py-2"
          >
            How It Works
          </button>
          <button
            id="mobile-nav-pricing"
            onClick={() => handleNavClick('pricing')}
            className="text-left text-base font-medium text-gray-700 hover:text-gray-900 py-2"
          >
            Pricing
          </button>
          <button
            id="mobile-nav-faq"
            onClick={() => handleNavClick('faq')}
            className="text-left text-base font-medium text-gray-700 hover:text-gray-900 py-2"
          >
            FAQ
          </button>
          <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
            {user ? (
              <>
                {onOpenDashboard && (
                  <button
                    id="mobile-nav-dashboard-btn"
                    onClick={() => {
                      setMobileMenuOpen(false);
                      onOpenDashboard();
                    }}
                    className="w-full text-center py-2.5 rounded-2xl bg-[#2563EB] text-white text-sm font-semibold shadow-sm"
                  >
                    Go to My Dashboard
                  </button>
                )}
                <button
                  id="mobile-logout-btn"
                  onClick={() => {
                    logout();
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Log Out ({user.displayName || user.email})
                </button>
              </>
            ) : (
              <>
                <button
                  id="mobile-login-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('login');
                  }}
                  className="w-full text-center py-2.5 rounded-xl border border-gray-200 text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Login
                </button>
                <button
                  id="mobile-signup-btn"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAuth('signup');
                  }}
                  className="w-full text-center py-2.5 rounded-2xl bg-[#2563EB] text-white text-sm font-medium shadow-sm"
                >
                  Sign Up
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

