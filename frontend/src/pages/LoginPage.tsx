import React, { useState } from 'react';
import { useAuth, DEMO_USERS } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  Bus,
  Shield,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  Gauge,
  ScanLine,
  GraduationCap,
  ArrowRight,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Sparkles
} from 'lucide-react';
import { UserRole } from '../types';

interface ModuleConfig {
  role: UserRole;
  title: string;
  badge: string;
  tagline: string;
  icon: React.ElementType;
  primaryColor: string;
  activeBorder: string;
  activeBg: string;
  badgeBg: string;
  accentBtn: string;
  destination: string;
}

const MODULES: ModuleConfig[] = [
  {
    role: 'admin',
    title: 'Transport Admin',
    badge: 'Operations Command',
    tagline: 'Fleet oversight, routes dispatch, telematics & live command center',
    icon: Shield,
    primaryColor: 'text-indigo-400',
    activeBorder: 'border-indigo-500 shadow-indigo-500/20',
    activeBg: 'bg-indigo-950/60',
    badgeBg: 'bg-indigo-500/20 text-indigo-300 border-indigo-500/40',
    accentBtn: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-600/30',
    destination: '/'
  },
  {
    role: 'mentor',
    title: 'Bus Mentor',
    badge: 'Faculty In-Charge',
    tagline: 'Student boarding manifest, student care, roll call & attendance',
    icon: UserCheck,
    primaryColor: 'text-purple-400',
    activeBorder: 'border-purple-500 shadow-purple-500/20',
    activeBg: 'bg-purple-950/60',
    badgeBg: 'bg-purple-500/20 text-purple-300 border-purple-500/40',
    accentBtn: 'bg-purple-600 hover:bg-purple-500 shadow-purple-600/30',
    destination: '/roll-call'
  },
  {
    role: 'driver',
    title: 'Commercial Driver',
    badge: 'Fleet Cockpit',
    tagline: 'Cockpit telemetry, live GPS simulator, speedometer & route waypoints',
    icon: Gauge,
    primaryColor: 'text-amber-400',
    activeBorder: 'border-amber-500 shadow-amber-500/20',
    activeBg: 'bg-amber-950/60',
    badgeBg: 'bg-amber-500/20 text-amber-300 border-amber-500/40',
    accentBtn: 'bg-amber-600 hover:bg-amber-500 shadow-amber-600/30',
    destination: '/driver-cockpit'
  },
  {
    role: 'watchman',
    title: 'Gate Security',
    badge: 'Campus Gate Terminal',
    tagline: 'Instant QR gate scanning, entry/exit logs & odometer validation',
    icon: ScanLine,
    primaryColor: 'text-emerald-400',
    activeBorder: 'border-emerald-500 shadow-emerald-500/20',
    activeBg: 'bg-emerald-950/60',
    badgeBg: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40',
    accentBtn: 'bg-emerald-600 hover:bg-emerald-500 shadow-emerald-600/30',
    destination: '/gate-terminal'
  },
  {
    role: 'student',
    title: 'Student Pass',
    badge: 'Student Transit Pass',
    tagline: 'Digital verified pass, QR transit badge, live bus distance & ETA',
    icon: GraduationCap,
    primaryColor: 'text-cyan-400',
    activeBorder: 'border-cyan-500 shadow-cyan-500/20',
    activeBg: 'bg-cyan-950/60',
    badgeBg: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/40',
    accentBtn: 'bg-cyan-600 hover:bg-cyan-500 shadow-cyan-600/30',
    destination: '/my-pass'
  }
];

export const LoginPage: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState<UserRole>('admin');
  const [email, setEmail] = useState(DEMO_USERS.admin.user.email);
  const [password, setPassword] = useState(DEMO_USERS.admin.defaultPassword);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const activeModule = MODULES.find((m) => m.role === selectedRole) || MODULES[0];

  const handleModuleSelect = (role: UserRole) => {
    setSelectedRole(role);
    setErrorMessage(null);
    const demoInfo = DEMO_USERS[role];
    if (demoInfo) {
      setEmail(demoInfo.user.email);
      setPassword(demoInfo.defaultPassword);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setLoading(true);

    const result = await login(email, password, selectedRole);
    setLoading(false);

    if (result.success) {
      navigate(activeModule.destination);
    } else {
      setErrorMessage(
        result.message || 'Authentication failed. Please verify credentials and selected module.'
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 sm:p-6 relative overflow-hidden selection:bg-indigo-500 selection:text-white">
      {/* Background Ambient Glows */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-indigo-600/10 blur-[130px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-600/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="w-full max-w-4xl relative z-10 space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-300 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>CampusTransit Enterprise Security Gateway</span>
          </div>

          <div className="flex items-center justify-center gap-3 pt-1">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-500 flex items-center justify-center text-white shadow-xl shadow-indigo-500/25">
              <Bus className="w-6 h-6" />
            </div>
            <div className="text-left">
              <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">CampusTransit</h1>
              <p className="text-xs text-slate-400">Smart College Transportation & Real-Time Telematics System</p>
            </div>
          </div>
        </div>

        {/* Step 1: Module Selector Banner */}
        <div className="space-y-3">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-indigo-400" />
              <span className="text-xs font-bold uppercase tracking-wider text-slate-300">
                Step 1: Select Login Module / Portal
              </span>
            </div>
            <span className="text-[11px] text-slate-400">
              Role-Based Access Control (RBAC) Enforced
            </span>
          </div>

          {/* Module Selector Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5">
            {MODULES.map((mod) => {
              const Icon = mod.icon;
              const isSelected = mod.role === selectedRole;
              return (
                <button
                  key={mod.role}
                  type="button"
                  onClick={() => handleModuleSelect(mod.role)}
                  className={`relative p-3.5 rounded-2xl border text-left transition-all flex flex-col justify-between ${
                    isSelected
                      ? `${mod.activeBg} ${mod.activeBorder} shadow-lg ring-2 ring-indigo-400/30 scale-[1.02]`
                      : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-800/60 hover:border-slate-700 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between w-full mb-2">
                    <div
                      className={`w-9 h-9 rounded-xl flex items-center justify-center transition-all ${
                        isSelected ? 'bg-white/10 text-white' : 'bg-slate-800 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    {isSelected && (
                      <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    )}
                  </div>

                  <div>
                    <div
                      className={`text-xs font-extrabold tracking-tight ${
                        isSelected ? 'text-white' : 'text-slate-300'
                      }`}
                    >
                      {mod.title}
                    </div>
                    <div className="text-[10px] text-slate-400 leading-tight mt-0.5 line-clamp-1">
                      {mod.badge}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Step 2: Authentication Credentials Card */}
        <div className="bg-slate-900/90 backdrop-blur-xl p-6 sm:p-8 rounded-3xl border border-slate-800 shadow-2xl space-y-6">
          {/* Active Portal Banner */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center border ${activeModule.badgeBg}`}
              >
                <activeModule.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-base font-extrabold text-white">
                    {activeModule.title} Portal
                  </h2>
                  <span
                    className={`text-[10px] uppercase font-bold px-2 py-0.5 rounded-full border ${activeModule.badgeBg}`}
                  >
                    {activeModule.badge}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-0.5">{activeModule.tagline}</p>
              </div>
            </div>

            <div className="flex items-center gap-2 self-start sm:self-center">
              <span className="text-[11px] text-slate-400 flex items-center gap-1.5 bg-slate-950 px-3 py-1 rounded-xl border border-slate-800">
                <Lock className="w-3 h-3 text-emerald-400" />
                <span>Protected Role Session</span>
              </span>
            </div>
          </div>

          {/* Security Alert Banner on Error */}
          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-500/50 text-rose-200 text-xs flex items-start gap-3 shadow-lg shadow-rose-950/40 animate-shake">
              <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <div className="font-extrabold text-rose-300 uppercase tracking-wide">
                  Security Verification Error
                </div>
                <div className="text-rose-200 leading-relaxed">{errorMessage}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5 flex items-center gap-1.5">
                <Mail className="w-3.5 h-3.5 text-slate-400" />
                <span>Authorized Campus Email</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setErrorMessage(null);
                }}
                required
                placeholder="e.g. your.name@nprcolleges.org"
                className="w-full px-4 py-3 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
              />
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-slate-400" />
                  <span>Password</span>
                </label>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setErrorMessage(null);
                  }}
                  required
                  placeholder="Enter your security password"
                  className="w-full px-4 py-3 pr-11 bg-slate-950/80 border border-slate-800 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200 p-1"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Security Verification Notice */}
            <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 text-[11px] text-slate-400 flex items-center gap-2">
              <Shield className="w-4 h-4 text-indigo-400 shrink-0" />
              <span>
                Attempting to log into <strong className="text-slate-200">{activeModule.title}</strong> module.
                The server will verify that this account holds valid {activeModule.role.toUpperCase()} privileges.
              </span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-3.5 ${activeModule.accentBtn} text-white font-extrabold text-sm rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {loading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Verifying Credentials & Module Privileges...</span>
                </>
              ) : (
                <>
                  <span>Authenticate & Enter {activeModule.title}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Pre-fill Pill for Easy Evaluation */}
          <div className="pt-3 border-t border-slate-800/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-slate-400">
            <div className="flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>
                Demo Account: <strong className="text-slate-200">{DEMO_USERS[selectedRole].user.email}</strong>
              </span>
            </div>
            <button
              type="button"
              onClick={() => {
                const demoInfo = DEMO_USERS[selectedRole];
                setEmail(demoInfo.user.email);
                setPassword(demoInfo.defaultPassword);
                setErrorMessage(null);
              }}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline self-start sm:self-auto"
            >
              Reset to Demo Credentials
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
