import React from 'react';
import { NavLink } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  LayoutDashboard,
  Navigation,
  Gauge,
  ScanLine,
  UserCheck,
  QrCode,
  BusFront,
  LogOut,
  MapPin
} from 'lucide-react';

export const Sidebar: React.FC = () => {
  const { user, logout } = useAuth();
  if (!user) return null;

  const getNavLinks = () => {
    switch (user.role) {
      case 'admin':
        return [
          { to: '/', label: 'Overview Dashboard', icon: LayoutDashboard },
          { to: '/tracking', label: 'Live Telematics Map', icon: Navigation },
          { to: '/fleet', label: 'Fleet & Routes', icon: BusFront },
          { to: '/gate-terminal', label: 'Gate In/Out Log', icon: ScanLine },
          { to: '/roll-call', label: 'Boarding Manifest', icon: UserCheck },
          { to: '/driver-cockpit', label: 'Driver Simulator', icon: Gauge },
          { to: '/my-pass', label: 'Student Pass View', icon: QrCode },
        ];
      case 'driver':
        return [
          { to: '/driver-cockpit', label: 'Driver Cockpit', icon: Gauge },
          { to: '/tracking', label: 'Active Route Map', icon: Navigation },
          { to: '/roll-call', label: 'Passenger Manifest', icon: UserCheck },
        ];
      case 'mentor':
        return [
          { to: '/roll-call', label: 'Boarding Roll Call', icon: UserCheck },
          { to: '/tracking', label: 'Live Bus Tracking', icon: Navigation },
          { to: '/', label: 'Fleet Status', icon: LayoutDashboard },
        ];
      case 'watchman':
        return [
          { to: '/gate-terminal', label: 'Gate Security Terminal', icon: ScanLine },
          { to: '/tracking', label: 'Live Campus Fleet', icon: Navigation },
        ];
      case 'student':
        return [
          { to: '/my-pass', label: 'My Digital Bus Pass', icon: QrCode },
          { to: '/tracking', label: 'Track My Bus & ETA', icon: Navigation },
        ];
      default:
        return [{ to: '/', label: 'Dashboard', icon: LayoutDashboard }];
    }
  };

  const navItems = getNavLinks();

  return (
    <aside className="w-64 bg-slate-900 text-slate-300 flex flex-col justify-between h-[calc(100vh-61px)] sticky top-[61px] border-r border-slate-800 shrink-0">
      <div className="p-4 space-y-6">
        <div>
          <div className="text-[11px] uppercase font-bold tracking-wider text-slate-400 px-3 mb-2">
            Navigation Menu
          </div>
          <nav className="space-y-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                      isActive
                        ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                        : 'text-slate-400 hover:text-white hover:bg-slate-800'
                    }`
                  }
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Live Fleet Quick Status */}
        <div className="bg-slate-800/80 rounded-xl p-3.5 border border-slate-700/60">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-slate-300">Campus Gateway</span>
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Gate QR telemetry synced. 5 buses in network.
          </p>
        </div>
      </div>

      <div className="p-4 border-t border-slate-800">
        <button
          onClick={logout}
          className="flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded-xl w-full transition-colors"
        >
          <LogOut className="w-4 h-4" />
          <span>Sign Out</span>
        </button>
      </div>
    </aside>
  );
};
