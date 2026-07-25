import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { X, Sparkles, CheckCircle2, AlertCircle, Mail, Lock, ArrowLeft, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup' | 'forgot';
  noticeMessage?: string | null;
}

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  initialMode = 'login',
  noticeMessage,
}) => {
  const { signInWithGoogle, loginWithEmail, signUpWithEmail, resetPassword, continueAsGuest } = useAuth();
  
  const [mode, setMode] = useState<'login' | 'signup' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setResetSent(false);
    setEmail('');
    setPassword('');
    setConfirmPassword('');
  }, [initialMode, isOpen]);

  if (!isOpen) return null;

  const validateForm = () => {
    setError(null);
    if (!email.trim() || !/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address.');
      return false;
    }

    if (mode === 'login') {
      if (!password) {
        setError('Please enter your password.');
        return false;
      }
    }

    if (mode === 'signup') {
      if (!password || password.length < 6) {
        setError('Password must be at least 6 characters long.');
        return false;
      }
      if (password !== confirmPassword) {
        setError('Passwords do not match.');
        return false;
      }
    }

    return true;
  };

  const getFirebaseErrorMessage = (errCode?: string, rawMessage?: string) => {
    switch (errCode) {
      case 'auth/operation-not-allowed':
      case 'auth/unauthorized-domain':
      case 'auth/configuration-not-found':
        return 'Authentication service encountered a domain configuration limit. Click "Continue as Guest" below to enter immediately.';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Sign-in window was closed before completing. Please try again when ready.';
      case 'auth/popup-blocked':
        return 'Sign-in popup was blocked by browser. Please enable popups for this site.';
      case 'auth/user-not-found':
        return 'No account registered with this email. Please click "Create Account" below to sign up.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Invalid email or password. Check your password or click "Create Account" below.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Click "Log In" to access your account.';
      case 'auth/weak-password':
        return 'Password should be at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Access temporarily blocked due to many failed attempts. Try again later.';
      default:
        if (rawMessage && !rawMessage.includes('Firebase:')) {
          return rawMessage;
        }
        return 'Unable to authenticate. You can try creating an account or click "Continue as Demo Guest".';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      if (mode === 'login') {
        await loginWithEmail(email, password);
        onClose();
      } else if (mode === 'signup') {
        await signUpWithEmail(email, password);
        onClose();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err: any) {
      console.error(err);
      setError(getFirebaseErrorMessage(err?.code, err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      onClose();
    } catch (err: any) {
      console.error(err);
      setError(getFirebaseErrorMessage(err?.code, err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-modal-overlay" className="fixed inset-0 z-50 bg-black/30 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div id="auth-modal-content" className="bg-white rounded-[24px] max-w-md w-full p-8 shadow-2xl border border-gray-100 relative max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          id="auth-modal-close-btn"
          onClick={onClose}
          className="absolute top-6 right-6 text-gray-400 hover:text-gray-900 transition-colors p-1 rounded-full hover:bg-gray-100"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Back button for Forgot Password */}
        {mode === 'forgot' && (
          <button
            id="auth-forgot-back-btn"
            onClick={() => {
              setMode('login');
              setError(null);
              setResetSent(false);
            }}
            className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-4 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Login</span>
          </button>
        )}

        {/* Header */}
        <div className="text-center space-y-2 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white mx-auto flex items-center justify-center shadow-md shadow-blue-500/20 mb-3">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl font-bold text-gray-900 tracking-tight">
            {mode === 'login' && 'Welcome Back'}
            {mode === 'signup' && 'Create Your Account'}
            {mode === 'forgot' && 'Reset Password'}
          </h3>
          <p className="text-sm text-gray-500">
            {mode === 'login' && 'Log in to save and access your resume evaluation reports.'}
            {mode === 'signup' && 'Sign up to store history and generate unlimited AI insights.'}
            {mode === 'forgot' && "Enter your account email and we'll send password reset instructions."}
          </p>
        </div>

        {/* Notice Message Alert for redirects */}
        {noticeMessage && (
          <div className="mb-6 p-3.5 rounded-2xl bg-blue-50 border border-blue-100 text-xs font-medium text-[#2563EB] flex items-start gap-2.5 animate-in fade-in duration-150">
            <Sparkles className="w-4 h-4 shrink-0 mt-0.5 text-[#2563EB]" />
            <span className="leading-relaxed">{noticeMessage}</span>
          </div>
        )}

        {/* Error Message Alert */}
        {error && (
          <div className="mb-6 p-3.5 rounded-2xl bg-red-50 border border-red-100 text-xs text-red-600 flex flex-col gap-2 animate-in fade-in duration-150">
            <div className="flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
              <span className="leading-relaxed font-medium text-left">{error}</span>
            </div>
            {mode === 'login' && (
              <div className="flex items-center gap-3 pt-1 pl-6 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMode('signup');
                    setError(null);
                  }}
                  className="font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Create new account →
                </button>
                <span className="text-gray-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    continueAsGuest();
                    onClose();
                  }}
                  className="font-semibold text-gray-700 hover:underline cursor-pointer"
                >
                  Continue as Guest
                </button>
              </div>
            )}
            {mode === 'signup' && (
              <div className="flex items-center gap-3 pt-1 pl-6 text-xs">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                  }}
                  className="font-semibold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Log in instead →
                </button>
                <span className="text-gray-300">•</span>
                <button
                  type="button"
                  onClick={() => {
                    continueAsGuest();
                    onClose();
                  }}
                  className="font-semibold text-gray-700 hover:underline cursor-pointer"
                >
                  Continue as Guest
                </button>
              </div>
            )}
          </div>
        )}

        {/* Reset Password Success Screen */}
        {mode === 'forgot' && resetSent ? (
          <div className="space-y-6 text-center py-4">
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 space-y-1">
              <div className="font-semibold text-sm">Password Reset Link Sent</div>
              <p>Check <strong>{email}</strong> for instructions to reset your password.</p>
            </div>
            <button
              onClick={() => {
                setMode('login');
                setResetSent(false);
              }}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm shadow-sm transition-all"
            >
              Return to Login
            </button>
          </div>
        ) : (
          /* Form Body */
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Email Field */}
            <div className="space-y-1.5">
              <label htmlFor="auth-email-input" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  id="auth-email-input"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@company.com"
                  className="w-full rounded-2xl border border-gray-200 pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                />
              </div>
            </div>

            {/* Password Field (for Login and Signup) */}
            {mode !== 'forgot' && (
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label htmlFor="auth-password-input" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Password
                  </label>
                  {mode === 'login' && (
                    <button
                      type="button"
                      onClick={() => {
                        setMode('forgot');
                        setError(null);
                      }}
                      className="text-xs font-semibold text-[#2563EB] hover:underline"
                    >
                      Forgot Password?
                    </button>
                  )}
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-password-input"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-gray-200 pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Confirm Password Field (Signup only) */}
            {mode === 'signup' && (
              <div className="space-y-1.5">
                <label htmlFor="auth-confirm-password-input" className="block text-xs font-semibold text-gray-700 uppercase tracking-wider">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-confirm-password-input"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full rounded-2xl border border-gray-200 pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all"
                  />
                </div>
              </div>
            )}

            {/* Submit Primary Action Button */}
            <button
              id="auth-submit-btn"
              type="submit"
              disabled={loading}
              className="w-full py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Processing...</span>
                </>
              ) : (
                <span>
                  {mode === 'login' && 'Log In'}
                  {mode === 'signup' && 'Create Account'}
                  {mode === 'forgot' && 'Send Reset Email'}
                </span>
              )}
            </button>

            {/* Google Sign In (for Login & Register) */}
            {mode !== 'forgot' && (
              <>
                <div className="relative my-6 text-center">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-gray-100" />
                  </div>
                  <span className="relative bg-white px-3 text-xs text-gray-400 uppercase tracking-wider font-medium">
                    Or continue with
                  </span>
                </div>

                <button
                  id="google-signin-btn"
                  type="button"
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-medium text-sm flex items-center justify-center gap-3 shadow-sm transition-all active:scale-[0.99] disabled:opacity-50"
                >
                  <svg className="w-5 h-5" viewBox="0 0 24 24">
                    <path
                      fill="#4285F4"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="#34A853"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="#FBBC05"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                    />
                    <path
                      fill="#EA4335"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                    />
                  </svg>
                  <span>Google</span>
                </button>

                <button
                  id="guest-signin-btn"
                  type="button"
                  onClick={() => {
                    continueAsGuest();
                    onClose();
                  }}
                  className="w-full py-2.5 px-4 rounded-2xl bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                >
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Continue as Demo Guest</span>
                </button>
              </>
            )}
          </form>
        )}

        {/* Footer mode toggle links */}
        <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500 space-y-3">
          {mode === 'login' && (
            <p>
              Don't have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('signup');
                  setError(null);
                }}
                className="font-bold text-[#2563EB] hover:underline"
              >
                Sign Up
              </button>
            </p>
          )}

          {mode === 'signup' && (
            <p>
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                }}
                className="font-bold text-[#2563EB] hover:underline"
              >
                Log In
              </button>
            </p>
          )}

          <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px] pt-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Secure Firebase Authentication</span>
          </div>
        </div>
      </div>
    </div>
  );
};


