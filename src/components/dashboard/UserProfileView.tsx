import React, { useState, useEffect } from 'react';
import { collection, query, onSnapshot, deleteDoc, doc, getDocs } from 'firebase/firestore';
import { updateProfile, updatePassword, deleteUser, sendPasswordResetEmail } from 'firebase/auth';
import { motion, AnimatePresence } from 'motion/react';
import { useAuth } from '../../context/AuthContext';
import { auth, db } from '../../services/firebase';
import { ResumeAnalysis } from '../../types';
import { OperationType, handleFirestoreError } from '../../utils/error';
import {
  User,
  Mail,
  Calendar,
  Award,
  BarChart2,
  FileCheck2,
  LogOut,
  KeyRound,
  Trash2,
  Edit3,
  Check,
  X,
  AlertTriangle,
  Sparkles,
  Camera,
  ShieldCheck,
  TrendingUp,
} from 'lucide-react';

export const UserProfileView: React.FC = () => {
  const { user, logout } = useAuth();
  const [analyses, setAnalyses] = useState<ResumeAnalysis[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Profile State
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [displayNameInput, setDisplayNameInput] = useState(user?.displayName || '');
  const [photoUrlInput, setPhotoUrlInput] = useState(user?.photoURL || '');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');

  // Change Password State
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [newPasswordInput, setNewPasswordInput] = useState('');
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordSuccessMsg, setPasswordSuccessMsg] = useState('');
  const [passwordErrorMsg, setPasswordErrorMsg] = useState('');

  // Delete Account State
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteErrorMsg, setDeleteErrorMsg] = useState('');

  // Sync inputs when user changes
  useEffect(() => {
    if (user) {
      setDisplayNameInput(user.displayName || '');
      setPhotoUrlInput(user.photoURL || '');
    }
  }, [user]);

  // Fetch Firestore analyses to calculate actual stats
  useEffect(() => {
    if (!user || !db) {
      setLoading(false);
      return;
    }

    const path = `users/${user.uid}/analyses`;
    try {
      const q = query(collection(db, path));
      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const items: ResumeAnalysis[] = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...(doc.data() as Omit<ResumeAnalysis, 'id'>),
          }));
          setAnalyses(items);
          setLoading(false);
        },
        (error) => {
          handleFirestoreError(error, OperationType.LIST, path);
          setLoading(false);
        }
      );

      return () => unsubscribe();
    } catch (err) {
      console.error('Error loading profile stats:', err);
      setLoading(false);
    }
  }, [user]);

  // Calculated Metrics
  const totalAnalyses = analyses.length;
  const highestScore =
    totalAnalyses > 0
      ? Math.max(...analyses.map((a) => a.atsScore ?? a.overallScore ?? 0))
      : 0;
  const averageScore =
    totalAnalyses > 0
      ? Math.round(
          analyses.reduce((acc, a) => acc + (a.atsScore ?? a.overallScore ?? 0), 0) /
            totalAnalyses
        )
      : 0;

  // Account creation date
  const accountCreatedDate = formatAccountDate(auth.currentUser?.metadata?.creationTime);

  // Save Profile Changes
  const handleSaveProfile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setIsSavingProfile(true);
    setProfileSuccessMsg('');
    try {
      await updateProfile(auth.currentUser, {
        displayName: displayNameInput.trim() || user?.displayName || 'User',
        photoURL: photoUrlInput.trim() || null,
      });
      setProfileSuccessMsg('Profile updated successfully!');
      setTimeout(() => {
        setIsEditModalOpen(false);
        setProfileSuccessMsg('');
      }, 1200);
    } catch (err) {
      console.error('Failed to update profile:', err);
      alert('Failed to update profile. Please try again.');
    } finally {
      setIsSavingProfile(false);
    }
  };

  // Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!auth.currentUser) return;

    setPasswordLoading(true);
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');

    try {
      if (newPasswordInput.trim().length < 6) {
        setPasswordErrorMsg('Password must be at least 6 characters long.');
        setPasswordLoading(false);
        return;
      }
      await updatePassword(auth.currentUser, newPasswordInput.trim());
      setPasswordSuccessMsg('Password updated successfully!');
      setNewPasswordInput('');
      setTimeout(() => {
        setIsPasswordModalOpen(false);
        setPasswordSuccessMsg('');
      }, 1500);
    } catch (err: any) {
      console.error('Password change error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setPasswordErrorMsg(
          'Security measure: Please re-login to your account before changing your password.'
        );
      } else {
        setPasswordErrorMsg(err.message || 'Failed to update password.');
      }
    } finally {
      setPasswordLoading(false);
    }
  };

  // Send Password Reset Email fallback
  const handleSendResetEmail = async () => {
    if (!user?.email || !auth) return;
    setPasswordLoading(true);
    setPasswordSuccessMsg('');
    setPasswordErrorMsg('');
    try {
      await sendPasswordResetEmail(auth, user.email);
      setPasswordSuccessMsg(`Reset email sent to ${user.email}.`);
    } catch (err: any) {
      setPasswordErrorMsg(err.message || 'Failed to send reset email.');
    } finally {
      setPasswordLoading(false);
    }
  };

  // Delete Account
  const handleDeleteAccount = async () => {
    if (!auth.currentUser || !user) return;
    if (deleteConfirmText.trim().toUpperCase() !== 'DELETE') {
      setDeleteErrorMsg('Please type DELETE to confirm.');
      return;
    }

    setIsDeleting(true);
    setDeleteErrorMsg('');

    try {
      // Clean up Firestore documents if db available
      if (db) {
        try {
          const snapshot = await getDocs(collection(db, `users/${user.uid}/analyses`));
          for (const d of snapshot.docs) {
            await deleteDoc(doc(db, `users/${user.uid}/analyses`, d.id));
          }
        } catch (e) {
          console.warn('Could not clean up user analyses documents:', e);
        }
      }

      // Delete Firebase Auth User
      await deleteUser(auth.currentUser);
    } catch (err: any) {
      console.error('Delete account error:', err);
      if (err.code === 'auth/requires-recent-login') {
        setDeleteErrorMsg('For security, please log out and log in again before deleting your account.');
      } else {
        setDeleteErrorMsg(err.message || 'Failed to delete account.');
      }
      setIsDeleting(false);
    }
  };

  return (
    <div id="user-profile-page" className="max-w-5xl mx-auto space-y-8 pb-12">
      {/* PROFILE HEADER CARD */}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-[24px] border border-gray-100 p-6 sm:p-8 shadow-xs flex flex-col md:flex-row items-center justify-between gap-6"
      >
        <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
          {/* PROFILE PICTURE */}
          <div className="relative group">
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={user.displayName || 'Profile Picture'}
                className="w-24 h-24 rounded-full object-cover border-4 border-blue-50 shadow-xs shrink-0"
              />
            ) : (
              <div className="w-24 h-24 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-bold text-3xl flex items-center justify-center border-4 border-blue-50 shadow-xs shrink-0">
                {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
              </div>
            )}
            <button
              onClick={() => setIsEditModalOpen(true)}
              className="absolute bottom-0 right-0 p-2 rounded-full bg-white text-gray-700 border border-gray-200 shadow-2xs hover:bg-gray-50 transition-colors cursor-pointer"
              title="Edit Profile Picture"
            >
              <Camera className="w-3.5 h-3.5 text-[#2563EB]" />
            </button>
          </div>

          <div className="space-y-1.5 min-w-0">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <span className="inline-flex items-center gap-1 px-3 py-0.5 rounded-full bg-blue-50 text-xs font-semibold text-[#2563EB] border border-blue-100">
                <Sparkles className="w-3 h-3" /> Candidate Account
              </span>
            </div>
            {/* NAME */}
            <h2 id="profile-display-name" className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight truncate">
              {user?.displayName || 'ResumeIQ User'}
            </h2>
            {/* EMAIL */}
            <p id="profile-email" className="text-xs sm:text-sm text-gray-500 flex items-center justify-center sm:justify-start gap-1.5 truncate">
              <Mail className="w-3.5 h-3.5 text-gray-400 shrink-0" />
              {user?.email || 'N/A'}
            </p>
          </div>
        </div>

        {/* TOP QUICK ACTION BUTTONS */}
        <div className="flex flex-wrap items-center gap-3 w-full md:w-auto justify-center md:justify-end border-t md:border-t-0 pt-4 md:pt-0 border-gray-100">
          <button
            id="edit-profile-header-btn"
            onClick={() => setIsEditModalOpen(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-gray-200 hover:bg-gray-50 text-xs font-semibold text-gray-800 transition-all shadow-2xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5 text-gray-500" />
            <span>Edit Profile</span>
          </button>
          <button
            id="logout-header-btn"
            onClick={() => logout()}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-red-50 hover:bg-red-100/80 border border-red-100 text-xs font-semibold text-red-700 transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5 text-red-600" />
            <span>Logout</span>
          </button>
        </div>
      </motion.div>

      {/* STATS OVERVIEW CARDS (TOTAL ANALYSES, HIGHEST SCORE, AVERAGE SCORE) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        {/* Total Analyses */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xs flex items-center justify-between hover:border-gray-200 transition-all"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Total Analyses
            </span>
            <span id="profile-stat-total" className="text-3xl font-extrabold text-gray-900 tracking-tight block">
              {totalAnalyses}
            </span>
            <span className="text-[11px] text-gray-500">Evaluations saved</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-[#2563EB] flex items-center justify-center shrink-0">
            <FileCheck2 className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Highest Score */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xs flex items-center justify-between hover:border-gray-200 transition-all"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Highest Score
            </span>
            <span id="profile-stat-highest" className="text-3xl font-extrabold text-emerald-600 tracking-tight block">
              {highestScore > 0 ? `${highestScore}%` : 'N/A'}
            </span>
            <span className="text-[11px] text-gray-500">Best ATS match</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
            <Award className="w-6 h-6" />
          </div>
        </motion.div>

        {/* Average Score */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white p-6 rounded-[24px] border border-gray-100 shadow-xs flex items-center justify-between hover:border-gray-200 transition-all"
        >
          <div className="space-y-1">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider block">
              Average Score
            </span>
            <span id="profile-stat-average" className="text-3xl font-extrabold text-indigo-600 tracking-tight block">
              {averageScore > 0 ? `${averageScore}%` : 'N/A'}
            </span>
            <span className="text-[11px] text-gray-500">Overall performance</span>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
            <TrendingUp className="w-6 h-6" />
          </div>
        </motion.div>
      </div>

      {/* ACCOUNT DETAILS & SECURITY SECTION */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="bg-white p-6 sm:p-8 rounded-[24px] border border-gray-100 shadow-xs space-y-6"
      >
        <div className="flex items-center justify-between border-b border-gray-100 pb-4">
          <h3 className="text-lg font-bold text-gray-900 tracking-tight flex items-center gap-2">
            <User className="w-5 h-5 text-[#2563EB]" />
            Account Information
          </h3>
          <span className="text-xs text-gray-400 font-medium">Personal Details</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Display Name */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-gray-500" />
              Display Name
            </span>
            <p className="text-sm font-bold text-gray-900 truncate">
              {user?.displayName || 'Candidate Name'}
            </p>
          </div>

          {/* Email Address */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5 text-gray-500" />
              Email Address
            </span>
            <p className="text-sm font-bold text-gray-900 truncate">{user?.email || 'N/A'}</p>
          </div>

          {/* Account Created Date */}
          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-100 space-y-1 sm:col-span-2 lg:col-span-1">
            <span className="text-xs font-semibold text-gray-400 uppercase tracking-wider flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-gray-500" />
              Account Created
            </span>
            <p id="profile-account-created" className="text-sm font-bold text-gray-900 truncate">
              {accountCreatedDate}
            </p>
          </div>
        </div>

        {/* MANAGEMENT BUTTONS GRID */}
        <div className="pt-6 border-t border-gray-100 space-y-3">
          <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
            Account Management Actions
          </h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {/* BUTTON 1: Edit Profile */}
            <button
              id="edit-profile-btn"
              onClick={() => setIsEditModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <Edit3 className="w-4 h-4 text-[#2563EB]" />
              <span>Edit Profile</span>
            </button>

            {/* BUTTON 2: Change Password */}
            <button
              id="change-password-btn"
              onClick={() => setIsPasswordModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gray-50 hover:bg-gray-100 border border-gray-200 text-gray-800 text-xs font-bold transition-all cursor-pointer shadow-2xs"
            >
              <KeyRound className="w-4 h-4 text-purple-600" />
              <span>Change Password</span>
            </button>

            {/* BUTTON 3: Delete Account */}
            <button
              id="delete-account-btn"
              onClick={() => setIsDeleteModalOpen(true)}
              className="inline-flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-rose-50 hover:bg-rose-100/80 border border-rose-200/60 text-rose-700 text-xs font-bold transition-all cursor-pointer"
            >
              <Trash2 className="w-4 h-4 text-rose-600" />
              <span>Delete Account</span>
            </button>

            {/* BUTTON 4: Logout */}
            <button
              id="logout-btn"
              onClick={() => logout()}
              className="inline-flex items-center justify-center gap-2 p-3.5 rounded-2xl bg-gray-900 hover:bg-gray-800 text-white text-xs font-bold transition-all cursor-pointer shadow-xs"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* EDIT PROFILE MODAL */}
      <AnimatePresence>
        {isEditModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] border border-gray-100 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Edit3 className="w-5 h-5 text-[#2563EB]" />
                  Edit Profile Information
                </h3>
                <button
                  onClick={() => setIsEditModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {profileSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{profileSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleSaveProfile} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Display Name</label>
                  <input
                    id="edit-profile-name-input"
                    type="text"
                    value={displayNameInput}
                    onChange={(e) => setDisplayNameInput(e.target.value)}
                    required
                    placeholder="Enter your full name"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">Profile Picture URL (Optional)</label>
                  <input
                    id="edit-profile-photourl-input"
                    type="url"
                    value={photoUrlInput}
                    onChange={(e) => setPhotoUrlInput(e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#2563EB]/20 focus:border-[#2563EB]"
                  />
                  <p className="text-[11px] text-gray-400">Provide an image URL to customize your avatar icon.</p>
                </div>

                <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    type="button"
                    onClick={() => setIsEditModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    id="save-profile-btn"
                    type="submit"
                    disabled={isSavingProfile}
                    className="px-5 py-2 rounded-xl bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {isSavingProfile ? 'Saving...' : 'Save Profile'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* CHANGE PASSWORD MODAL */}
      <AnimatePresence>
        {isPasswordModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] border border-gray-100 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <KeyRound className="w-5 h-5 text-purple-600" />
                  Change Password
                </h3>
                <button
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {passwordSuccessMsg && (
                <div className="p-3 bg-emerald-50 text-emerald-700 border border-emerald-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  <span>{passwordSuccessMsg}</span>
                </div>
              )}

              {passwordErrorMsg && (
                <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-semibold flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{passwordErrorMsg}</span>
                </div>
              )}

              <form onSubmit={handleChangePassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-700 block">New Password</label>
                  <input
                    id="new-password-input"
                    type="password"
                    value={newPasswordInput}
                    onChange={(e) => setNewPasswordInput(e.target.value)}
                    placeholder="Enter at least 6 characters"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-900 focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-600"
                  />
                </div>

                <div className="pt-2 flex flex-col gap-2">
                  <button
                    id="submit-change-password-btn"
                    type="submit"
                    disabled={passwordLoading || !newPasswordInput}
                    className="w-full py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white text-xs font-semibold transition-colors disabled:opacity-50 cursor-pointer"
                  >
                    {passwordLoading ? 'Updating...' : 'Update Password Directly'}
                  </button>

                  <div className="relative my-2 text-center">
                    <span className="text-[11px] text-gray-400 bg-white px-2">or</span>
                  </div>

                  <button
                    type="button"
                    onClick={handleSendResetEmail}
                    disabled={passwordLoading}
                    className="w-full py-2.5 rounded-xl bg-gray-100 hover:bg-gray-200 text-gray-800 text-xs font-semibold transition-colors cursor-pointer"
                  >
                    Send Reset Link to Email ({user?.email})
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DELETE ACCOUNT CONFIRMATION MODAL */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/40 backdrop-blur-xs">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-white rounded-[24px] border border-rose-100 p-6 sm:p-8 max-w-md w-full shadow-2xl space-y-6"
            >
              <div className="flex items-center justify-between border-b border-gray-100 pb-4">
                <h3 className="text-lg font-bold text-rose-700 flex items-center gap-2">
                  <AlertTriangle className="w-5 h-5 text-rose-600" />
                  Delete Account
                </h3>
                <button
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <div className="space-y-3">
                <p className="text-xs text-gray-700 leading-relaxed">
                  This action is <strong className="text-rose-600 font-bold">permanent</strong> and cannot be undone. All your saved resume analyses, scores, and profile history will be permanently deleted.
                </p>

                {deleteErrorMsg && (
                  <div className="p-3 bg-rose-50 text-rose-700 border border-rose-100 rounded-xl text-xs font-semibold">
                    {deleteErrorMsg}
                  </div>
                )}

                <div className="space-y-1.5 pt-2">
                  <label className="text-xs font-bold text-gray-700 block">
                    Type <span className="text-rose-600 font-extrabold">DELETE</span> to confirm:
                  </label>
                  <input
                    id="delete-confirm-input"
                    type="text"
                    value={deleteConfirmText}
                    onChange={(e) => setDeleteConfirmText(e.target.value)}
                    placeholder="DELETE"
                    className="w-full px-4 py-2.5 bg-gray-50 border border-rose-200 rounded-xl text-xs font-bold text-rose-900 focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-gray-100">
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-gray-200 text-xs font-semibold text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  id="confirm-delete-account-btn"
                  onClick={handleDeleteAccount}
                  disabled={isDeleting || deleteConfirmText.trim().toUpperCase() !== 'DELETE'}
                  className="px-5 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors disabled:opacity-50 cursor-pointer"
                >
                  {isDeleting ? 'Deleting...' : 'Permanently Delete Account'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// Helper function to format creation time cleanly
function formatAccountDate(dateStr?: string) {
  if (!dateStr) {
    return new Date().toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  }
  try {
    return new Date(dateStr).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
