import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bus, GateLog } from '../types';
import { BusFront, Activity, Users, ShieldCheck, ArrowUpRight, ArrowDownLeft, Clock } from 'lucide-react';
import { LiveMap } from '../components/LiveMap';

export const DashboardPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [gateLogs, setGateLogs] = useState<GateLog[]>([]);
  const [stats, setStats] = useState({
    totalBuses: 5,
    activeTrips: 1,
    registeredStudents: 412,
    gateEventsToday: 18
  });

  useEffect(() => {
    const fetchData = async () => {
      const busRes = await api.getBuses();
      if (busRes.success) setBuses(busRes.buses);

      const logsRes = await api.getGateLogs();
      if (logsRes.success) setGateLogs(logsRes.logs);

      const statsRes = await api.getDashboardStats();
      if (statsRes.success) setStats(statsRes.stats);
    };
    fetchData();
  }, []);

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Page Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Transportation Command Center</h1>
          <p className="text-sm text-slate-500">Live operational telematics, gate surveillance, and fleet readiness.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-700 text-xs font-bold border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Real-Time Engine Active
          </span>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Fleet Buses</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.totalBuses}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">100% Inspected & Fit</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <BusFront className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Road Trips</div>
            <div className="text-3xl font-extrabold text-indigo-600 mt-1">{stats.activeTrips}</div>
            <div className="text-xs text-indigo-500 font-semibold mt-1">Live GPS Broadcast</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Activity className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Bus Pass Holders</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.registeredStudents}</div>
            <div className="text-xs text-slate-500 font-semibold mt-1">Across 8 Departments</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <Users className="w-6 h-6" />
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex items-center justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Gate Passes Logged</div>
            <div className="text-3xl font-extrabold text-slate-900 mt-1">{stats.gateEventsToday}</div>
            <div className="text-xs text-emerald-600 font-semibold mt-1">QR Verified Today</div>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <ShieldCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Main Grid: Live Map + Recent Gate Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map column */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-bold text-slate-900">Live Campus Telematics Map</h3>
              <p className="text-xs text-slate-500">Real-time GPS coordinates of college buses</p>
            </div>
            <span className="text-xs font-bold px-2.5 py-1 bg-indigo-50 text-indigo-700 rounded-lg border border-indigo-100">
              Coimbatore Campus Region
            </span>
          </div>

          <div className="h-[420px]">
            <LiveMap buses={buses} />
          </div>
        </div>

        {/* Gate Activity column */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-slate-900">Security Gate Log</h3>
              <Clock className="w-4 h-4 text-slate-400" />
            </div>

            <div className="divide-y divide-slate-100">
              {gateLogs.map((log) => (
                <div key={log.id} className="py-3 flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                      log.event_type === 'entry' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}
                  >
                    {log.event_type === 'entry' ? <ArrowDownLeft className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-800">{log.bus_number || 'BUS-01'}</span>
                      <span
                        className={`text-[10px] font-extrabold uppercase px-1.5 py-0.5 rounded ${
                          log.event_type === 'entry' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {log.event_type}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 truncate mt-0.5">{log.remarks}</p>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 text-center">
            <span className="text-xs text-slate-400">Main Security Gate 1 & 2 Terminals</span>
          </div>
        </div>
      </div>
    </div>
  );
};
