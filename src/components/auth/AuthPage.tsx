import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import {
  Sparkles,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertCircle,
  CheckCircle2,
  ArrowLeft,
  Loader2,
  ShieldCheck,
  UserCheck,
  KeyRound,
  UserPlus,
  LogIn,
} from 'lucide-react';

interface AuthPageProps {
  initialMode?: 'login' | 'register' | 'forgot';
  onSuccess?: () => void;
  onGoHome?: () => void;
}

export const AuthPage: React.FC<AuthPageProps> = ({
  initialMode = 'login',
  onSuccess,
  onGoHome,
}) => {
  const { signInWithGoogle, loginWithEmail, signUpWithEmail, resetPassword, continueAsGuest } = useAuth();

  const [mode, setMode] = useState<'login' | 'register' | 'forgot'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<{ email?: string; password?: string; confirmPassword?: string }>({});
  const [resetSent, setResetSent] = useState(false);

  useEffect(() => {
    setMode(initialMode);
    setError(null);
    setFieldErrors({});
    setResetSent(false);
  }, [initialMode]);

  const validateForm = () => {
    const errors: { email?: string; password?: string; confirmPassword?: string } = {};
    setError(null);

    if (!email.trim()) {
      errors.email = 'Email address is required.';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address (e.g. name@domain.com).';
    }

    if (mode === 'login') {
      if (!password) {
        errors.password = 'Password is required.';
      }
    }

    if (mode === 'register') {
      if (!password) {
        errors.password = 'Password is required.';
      } else if (password.length < 6) {
        errors.password = 'Password must be at least 6 characters long.';
      }

      if (!confirmPassword) {
        errors.confirmPassword = 'Please confirm your password.';
      } else if (password !== confirmPassword) {
        errors.confirmPassword = 'Passwords do not match.';
      }
    }

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const parseFirebaseError = (errCode?: string, rawMessage?: string) => {
    switch (errCode) {
      case 'auth/user-not-found':
        return 'No account found with this email. Please check your spelling or register a new account.';
      case 'auth/wrong-password':
      case 'auth/invalid-credential':
        return 'Incorrect email or password. Please verify your credentials or reset your password.';
      case 'auth/email-already-in-use':
        return 'An account with this email already exists. Please log in instead.';
      case 'auth/weak-password':
        return 'Password is too weak. Choose a stronger password with at least 6 characters.';
      case 'auth/invalid-email':
        return 'Please enter a valid email address.';
      case 'auth/too-many-requests':
        return 'Too many failed login attempts. Access temporarily locked for security. Try again in a few minutes.';
      case 'auth/popup-closed-by-user':
      case 'auth/cancelled-popup-request':
        return 'Google Sign-In popup was closed before completing.';
      case 'auth/popup-blocked':
        return 'Google Sign-In popup was blocked by your browser settings. Please allow popups.';
      default:
        if (rawMessage && !rawMessage.includes('Firebase:')) {
          return rawMessage;
        }
        return 'Unable to complete authentication. Check your details or continue as demo guest.';
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
        if (onSuccess) onSuccess();
      } else if (mode === 'register') {
        await signUpWithEmail(email, password);
        if (onSuccess) onSuccess();
      } else if (mode === 'forgot') {
        await resetPassword(email);
        setResetSent(true);
      }
    } catch (err: any) {
      console.error('Auth error:', err);
      setError(parseFirebaseError(err?.code, err?.message));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
      if (onSuccess) onSuccess();
    } catch (err: any) {
      console.error('Google Sign In Error:', err);
      setError(parseFirebaseError(err?.code, err?.message));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div id="auth-page-container" className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-gray-50/50 to-white">
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="w-full max-w-md"
      >
        {/* Navigation back home if provided */}
        {onGoHome && (
          <button
            id="auth-page-go-home-btn"
            onClick={onGoHome}
            className="inline-flex items-center gap-2 text-xs font-semibold text-gray-500 hover:text-gray-900 mb-6 transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </button>
        )}

        {/* Minimalist Container Card */}
        <div className="bg-white rounded-[24px] border border-gray-100 p-8 sm:p-10 shadow-xl shadow-gray-200/50 relative overflow-hidden">
          {/* Header */}
          <div className="text-center space-y-3 mb-8">
            <div className="w-12 h-12 rounded-2xl bg-[#2563EB] text-white mx-auto flex items-center justify-center shadow-md shadow-blue-500/20">
              <Sparkles className="w-6 h-6" />
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              {mode === 'login' && 'Welcome Back'}
              {mode === 'register' && 'Create Your Account'}
              {mode === 'forgot' && 'Reset Password'}
            </h1>
            
            <p className="text-xs sm:text-sm text-gray-500 max-w-xs mx-auto leading-relaxed">
              {mode === 'login' && 'Log in to access your saved resume evaluations and ATS insights.'}
              {mode === 'register' && 'Sign up to store history and generate unlimited AI insights.'}
              {mode === 'forgot' && "Enter your registered email address to receive password reset instructions."}
            </p>

            {/* View Switching Tabs for Page Mode */}
            <div className="pt-2 flex items-center justify-center gap-2">
              <button
                id="auth-page-tab-login"
                type="button"
                onClick={() => {
                  setMode('login');
                  setError(null);
                  setFieldErrors({});
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  mode === 'login'
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-100'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Log In
              </button>
              <button
                id="auth-page-tab-register"
                type="button"
                onClick={() => {
                  setMode('register');
                  setError(null);
                  setFieldErrors({});
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  mode === 'register'
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-100'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Register
              </button>
              <button
                id="auth-page-tab-forgot"
                type="button"
                onClick={() => {
                  setMode('forgot');
                  setError(null);
                  setFieldErrors({});
                }}
                className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all cursor-pointer ${
                  mode === 'forgot'
                    ? 'bg-blue-50 text-[#2563EB] border border-blue-100'
                    : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                Forgot Password
              </button>
            </div>
          </div>

          {/* General Error Banner */}
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-2xl bg-red-50 border border-red-100 text-xs text-red-600 space-y-2"
            >
              <div className="flex items-start gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-500" />
                <span className="leading-relaxed font-medium">{error}</span>
              </div>
            </motion.div>
          )}

          {/* Success Reset Confirmation */}
          {mode === 'forgot' && resetSent ? (
            <div className="space-y-6 text-center py-4">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-xs text-emerald-800 space-y-1.5">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 mx-auto mb-1" />
                <div className="font-bold text-sm">Reset Link Sent Successfully</div>
                <p>We've sent password reset instructions to <strong>{email}</strong>. Check your inbox.</p>
              </div>
              <button
                id="auth-reset-return-btn"
                onClick={() => {
                  setMode('login');
                  setResetSent(false);
                }}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all cursor-pointer"
              >
                Return to Login Page
              </button>
            </div>
          ) : (
            /* Main Form */
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Email Address */}
              <div className="space-y-1.5">
                <label htmlFor="auth-page-email" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    id="auth-page-email"
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      if (fieldErrors.email) setFieldErrors({ ...fieldErrors, email: undefined });
                    }}
                    placeholder="name@company.com"
                    className={`w-full rounded-2xl border ${
                      fieldErrors.email ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-white'
                    } pl-11 pr-4 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all`}
                  />
                </div>
                {fieldErrors.email && (
                  <p className="text-[11px] text-red-500 font-medium pl-1">{fieldErrors.email}</p>
                )}
              </div>

              {/* Password */}
              {mode !== 'forgot' && (
                <div className="space-y-1.5">
                  <div className="flex items-center justify-between">
                    <label htmlFor="auth-page-password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                      Password
                    </label>
                    {mode === 'login' && (
                      <button
                        type="button"
                        onClick={() => {
                          setMode('forgot');
                          setError(null);
                        }}
                        className="text-xs font-bold text-[#2563EB] hover:underline cursor-pointer"
                      >
                        Forgot Password?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-page-password"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (fieldErrors.password) setFieldErrors({ ...fieldErrors, password: undefined });
                      }}
                      placeholder="••••••••"
                      className={`w-full rounded-2xl border ${
                        fieldErrors.password ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-white'
                      } pl-11 pr-11 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.password && (
                    <p className="text-[11px] text-red-500 font-medium pl-1">{fieldErrors.password}</p>
                  )}
                </div>
              )}

              {/* Confirm Password (Register Page) */}
              {mode === 'register' && (
                <div className="space-y-1.5">
                  <label htmlFor="auth-page-confirm-password" className="block text-xs font-bold text-gray-700 uppercase tracking-wider">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
                    <input
                      id="auth-page-confirm-password"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => {
                        setConfirmPassword(e.target.value);
                        if (fieldErrors.confirmPassword) setFieldErrors({ ...fieldErrors, confirmPassword: undefined });
                      }}
                      placeholder="••••••••"
                      className={`w-full rounded-2xl border ${
                        fieldErrors.confirmPassword ? 'border-red-300 bg-red-50/30' : 'border-gray-200 bg-white'
                      } pl-11 pr-11 py-3 text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB] transition-all`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 focus:outline-none cursor-pointer"
                    >
                      {showConfirmPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                  {fieldErrors.confirmPassword && (
                    <p className="text-[11px] text-red-500 font-medium pl-1">{fieldErrors.confirmPassword}</p>
                  )}
                </div>
              )}

              {/* Submit Button */}
              <button
                id="auth-page-submit-btn"
                type="submit"
                disabled={loading}
                className="w-full py-3.5 px-4 rounded-2xl bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-sm shadow-md shadow-blue-500/20 flex items-center justify-center gap-2 transition-all active:scale-[0.99] disabled:opacity-60 cursor-pointer pt-3 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <span className="flex items-center gap-2">
                    {mode === 'login' && <LogIn className="w-4 h-4" />}
                    {mode === 'register' && <UserPlus className="w-4 h-4" />}
                    {mode === 'forgot' && <KeyRound className="w-4 h-4" />}
                    <span>
                      {mode === 'login' && 'Log In'}
                      {mode === 'register' && 'Create Account'}
                      {mode === 'forgot' && 'Send Reset Link'}
                    </span>
                  </span>
                )}
              </button>

              {/* Divider & Google Sign In */}
              {mode !== 'forgot' && (
                <>
                  <div className="relative my-6 text-center">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-gray-100" />
                    </div>
                    <span className="relative bg-white px-3 text-xs text-gray-400 uppercase tracking-wider font-semibold">
                      Or Continue With
                    </span>
                  </div>

                  <button
                    id="auth-page-google-btn"
                    type="button"
                    onClick={handleGoogleSignIn}
                    disabled={loading}
                    className="w-full py-3 px-4 rounded-2xl border border-gray-200 bg-white hover:bg-gray-50 text-gray-800 font-semibold text-sm flex items-center justify-center gap-3 shadow-xs transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
                  >
                    <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
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
                    <span>Sign in with Google</span>
                  </button>

                  <button
                    id="auth-page-guest-btn"
                    type="button"
                    onClick={() => {
                      continueAsGuest();
                      if (onSuccess) onSuccess();
                    }}
                    className="w-full py-2.5 px-4 rounded-2xl bg-gray-50 hover:bg-gray-100 text-gray-700 font-semibold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer mt-2"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                    <span>Continue as Demo Guest</span>
                  </button>
                </>
              )}
            </form>
          )}

          {/* Footer mode links */}
          <div className="mt-8 pt-6 border-t border-gray-100 text-center text-xs text-gray-500 space-y-3">
            {mode === 'login' && (
              <p>
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setError(null);
                    setFieldErrors({});
                  }}
                  className="font-extrabold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Register Now
                </button>
              </p>
            )}

            {mode === 'register' && (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setFieldErrors({});
                  }}
                  className="font-extrabold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Log In
                </button>
              </p>
            )}

            {mode === 'forgot' && (
              <p>
                Remembered your password?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setError(null);
                    setFieldErrors({});
                  }}
                  className="font-extrabold text-[#2563EB] hover:underline cursor-pointer"
                >
                  Back to Log In
                </button>
              </p>
            )}

            <div className="flex items-center justify-center gap-1.5 text-gray-400 text-[11px] pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
              <span>Firebase Authentication Protected</span>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
