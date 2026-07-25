import React from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  LayoutDashboard,
  Upload,
  History,
  User,
  LogOut,
  Sparkles,
  X,
  ChevronRight,
  Home,
  FileText,
  Compass,
  GraduationCap,
  CreditCard,
  FileSpreadsheet,
} from 'lucide-react';

export type DashboardTab =
  | 'overview'
  | 'upload'
  | 'cover-letter'
  | 'career-center'
  | 'student-verification'
  | 'billing'
  | 'history'
  | 'profile'
  | 'sheets-tracker';

interface SidebarProps {
  activeTab: DashboardTab;
  onSelectTab: (tab: DashboardTab) => void;
  isOpenMobile?: boolean;
  onCloseMobile?: () => void;
  onGoHome?: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  isOpenMobile = false,
  onCloseMobile,
  onGoHome,
}) => {
  const { user, logout } = useAuth();

  const navItems = [
    { id: 'overview' as DashboardTab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'upload' as DashboardTab, label: 'Upload Resume', icon: Upload },
    { id: 'cover-letter' as DashboardTab, label: 'AI Cover Letter', icon: FileText },
    { id: 'sheets-tracker' as DashboardTab, label: 'Google Sheets Tracker', icon: FileSpreadsheet },
    { id: 'career-center' as DashboardTab, label: 'Career Center', icon: Compass },
    { id: 'student-verification' as DashboardTab, label: 'Student Verification', icon: GraduationCap },
    { id: 'billing' as DashboardTab, label: 'Plans & Billing', icon: CreditCard },
    { id: 'history' as DashboardTab, label: 'Analysis History', icon: History },
    { id: 'profile' as DashboardTab, label: 'Profile & Badges', icon: User },
  ];

  return (
    <>
      {/* Mobile backdrop overlay */}
      {isOpenMobile && (
        <div
          className="fixed inset-0 bg-black/20 backdrop-blur-xs z-40 lg:hidden"
          onClick={onCloseMobile}
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-white border-r border-gray-100 flex flex-col justify-between p-6 transition-transform duration-300 ease-in-out ${
          isOpenMobile ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div className="space-y-8">
          {/* Header & Logo */}
          <div className="flex items-center justify-between">
            <button
              onClick={onGoHome}
              className="flex items-center gap-2.5 text-xl font-bold tracking-tight text-gray-900 hover:opacity-80 transition-opacity"
            >
              <div className="w-9 h-9 rounded-xl bg-[#2563EB] flex items-center justify-center text-white shadow-md shadow-blue-500/20">
                <Sparkles className="w-5 h-5" />
              </div>
              <span>Resume<span className="text-[#2563EB]">IQ</span></span>
            </button>

            {/* Mobile close button */}
            <button
              onClick={onCloseMobile}
              className="lg:hidden p-1.5 rounded-xl text-gray-400 hover:text-gray-900 hover:bg-gray-100"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Navigation items */}
          <nav className="space-y-1.5">
            <div className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">
              Menu
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  id={`sidebar-nav-${item.id}`}
                  onClick={() => {
                    onSelectTab(item.id);
                    if (onCloseMobile) onCloseMobile();
                  }}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-medium transition-all cursor-pointer ${
                    isActive
                      ? 'bg-blue-50 text-[#2563EB] font-semibold'
                      : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-[#2563EB]' : 'text-gray-400'}`} />
                    <span>{item.label}</span>
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-[#2563EB]" />}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Homepage link & Logout */}
        <div className="space-y-4 pt-6 border-t border-gray-100">
          {onGoHome && (
            <button
              id="sidebar-home-btn"
              onClick={onGoHome}
              className="w-full flex items-center gap-3 px-3.5 py-2.5 rounded-2xl text-xs font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition-colors"
            >
              <Home className="w-4 h-4 text-gray-400" />
              <span>Back to Homepage</span>
            </button>
          )}

          {/* User mini badge & Logout button */}
          <div className="bg-gray-50 rounded-2xl p-3 flex items-center justify-between border border-gray-100">
            <div className="flex items-center gap-2.5 overflow-hidden">
              {user?.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || 'User'} className="w-8 h-8 rounded-full shrink-0" />
              ) : (
                <div className="w-8 h-8 rounded-full bg-blue-100 text-[#2563EB] flex items-center justify-center font-bold text-xs shrink-0">
                  {user?.displayName?.charAt(0).toUpperCase() || user?.email?.charAt(0).toUpperCase() || 'U'}
                </div>
              )}
              <div className="truncate">
                <p className="text-xs font-semibold text-gray-900 truncate">{user?.displayName || 'Candidate'}</p>
                <p className="text-[10px] text-gray-400 truncate">{user?.email}</p>
              </div>
            </div>

            <button
              id="sidebar-logout-btn"
              onClick={() => logout()}
              title="Logout"
              className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
};
