import React from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { Bus, ShieldCheck, LogOut, ShieldAlert } from 'lucide-react';
import { UserRole } from '../types';

export const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const roleLabels: Record<UserRole, { label: string; badge: string; color: string; border: string }> = {
    admin: { label: 'Transport Admin Portal', badge: 'Admin', color: 'bg-rose-50 text-rose-700', border: 'border-rose-200' },
    mentor: { label: 'Bus Mentor Portal', badge: 'Faculty', color: 'bg-purple-50 text-purple-700', border: 'border-purple-200' },
    driver: { label: 'Driver Cockpit', badge: 'Driver', color: 'bg-amber-50 text-amber-700', border: 'border-amber-200' },
    watchman: { label: 'Security Gate Terminal', badge: 'Security', color: 'bg-emerald-50 text-emerald-700', border: 'border-emerald-200' },
    student: { label: 'Student Pass Portal', badge: 'Student', color: 'bg-indigo-50 text-indigo-700', border: 'border-indigo-200' }
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-slate-200 shadow-sm">
      <div className="flex items-center justify-between px-4 sm:px-6 py-3">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-indigo-500 flex items-center justify-center text-white shadow-md shadow-indigo-200">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-extrabold text-slate-900 tracking-tight text-lg">CampusTransit</span>
              <span className="text-[10px] uppercase font-bold tracking-widest bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-full border border-indigo-200/60">
                SECURE
              </span>
            </div>
            <p className="text-xs text-slate-500 hidden sm:block">Smart Bus Fleet & Real-Time Telematics</p>
          </div>
        </div>

        {/* User Info & Secure Session Control */}
        {user && (
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Authenticated Role Tag */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl border bg-slate-50 border-slate-200 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-slate-500 font-medium">Active Module:</span>
              <span className="font-bold text-slate-800">{roleLabels[user.role]?.label || user.role}</span>
            </div>

            {/* User Profile */}
            <div className="flex items-center gap-3 pl-3 border-l border-slate-200">
              <div className="text-right hidden sm:block">
                <div className="text-xs font-bold text-slate-800">{user.name}</div>
                <span
                  className={`inline-block text-[10px] font-bold px-2 py-0.5 rounded-md border ${
                    roleLabels[user.role]?.color
                  } ${roleLabels[user.role]?.border}`}
                >
                  {roleLabels[user.role]?.badge || user.role}
                </span>
              </div>

              <div className="w-9 h-9 rounded-full bg-indigo-100 border border-indigo-200 flex items-center justify-center font-bold text-indigo-700 text-sm shadow-sm">
                {user.name ? user.name.charAt(0) : 'U'}
              </div>

              {/* Secure Module Switch / Sign Out Button */}
              <button
                onClick={handleLogout}
                title="Switch Module / Sign Out"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold text-slate-600 hover:text-rose-600 bg-slate-100 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 transition-all ml-1 shadow-sm"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Change Module</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};
