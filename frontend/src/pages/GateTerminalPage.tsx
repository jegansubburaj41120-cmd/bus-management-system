import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { GateLog } from '../types';
import { ScanLine, ArrowDownLeft, ArrowUpRight, CheckCircle2, ShieldCheck, BusFront } from 'lucide-react';

export const GateTerminalPage: React.FC = () => {
  const [logs, setLogs] = useState<GateLog[]>([]);
  const [selectedBus, setSelectedBus] = useState('BUS-01');
  const [eventType, setEventType] = useState<'entry' | 'exit'>('entry');
  const [odometer, setOdometer] = useState('42850');
  const [remarks, setRemarks] = useState('Scheduled arrival from Route 01 trip');
  const [isSuccessMessage, setIsSuccessMessage] = useState<string | null>(null);

  const fetchLogs = async () => {
    const res = await api.getGateLogs();
    if (res.success) setLogs(res.logs);
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleGateAction = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await api.logGateScan({
      bus_number: selectedBus,
      event_type: eventType,
      odometer_km: parseInt(odometer, 10),
      remarks: remarks
    });

    if (res.success) {
      setIsSuccessMessage(`✅ Bus ${selectedBus} ${eventType.toUpperCase()} recorded successfully!`);
      setTimeout(() => setIsSuccessMessage(null), 4000);
      fetchLogs();
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Main Gate Security Terminal</h1>
          <p className="text-sm text-slate-500">QR scanning, optical verification, and automated entry/exit gate logbook.</p>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4" /> Gate Terminal #01 Online
          </span>
        </div>
      </div>

      {isSuccessMessage && (
        <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl text-sm font-bold flex items-center gap-2">
          <CheckCircle2 className="w-5 h-5 text-emerald-600" />
          {isSuccessMessage}
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Verification Card */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <ScanLine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900">Vehicle Log Event</h3>
              <p className="text-xs text-slate-500">Fast gate check-in / check-out</p>
            </div>
          </div>

          <form onSubmit={handleGateAction} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Select Fleet Bus
              </label>
              <select
                value={selectedBus}
                onChange={(e) => setSelectedBus(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="BUS-01">BUS-01 (TN 38 BG 4501 - Route 01)</option>
                <option value="BUS-02">BUS-02 (TN 38 BG 4502 - Route 02)</option>
                <option value="BUS-03">BUS-03 (TN 38 BG 4503 - Route 03)</option>
                <option value="BUS-04">BUS-04 (TN 38 BG 4504 - Route 04)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Gate Event Type
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  type="button"
                  onClick={() => setEventType('entry')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    eventType === 'entry'
                      ? 'bg-emerald-600 text-white border-emerald-600 shadow-md shadow-emerald-600/30'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ArrowDownLeft className="w-4 h-4" /> Mark Entry (IN)
                </button>
                <button
                  type="button"
                  onClick={() => setEventType('exit')}
                  className={`py-2.5 px-3 rounded-xl text-xs font-bold flex items-center justify-center gap-2 border transition-all ${
                    eventType === 'exit'
                      ? 'bg-amber-600 text-white border-amber-600 shadow-md shadow-amber-600/30'
                      : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" /> Mark Exit (OUT)
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Odometer Reading (KM)
              </label>
              <input
                type="number"
                value={odometer}
                onChange={(e) => setOdometer(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500 font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Log Remarks / Destination
              </label>
              <input
                type="text"
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-extrabold rounded-xl shadow-lg shadow-indigo-600/30 transition-all flex items-center justify-center gap-2"
            >
              <CheckCircle2 className="w-4 h-4" /> Confirm & Log Gate Verification
            </button>
          </form>
        </div>

        {/* Gate History Log */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-extrabold text-slate-900">Today's Gate Movement Feed</h3>
            <span className="text-xs text-slate-400 font-medium">Auto-synced</span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="p-3 rounded-l-xl">Bus</th>
                  <th className="p-3">Direction</th>
                  <th className="p-3">Odometer</th>
                  <th className="p-3">Remarks</th>
                  <th className="p-3">Security Officer</th>
                  <th className="p-3 rounded-r-xl">Timestamp</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 font-medium text-slate-700">
                {logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50/80">
                    <td className="p-3 font-bold text-slate-900 flex items-center gap-2">
                      <BusFront className="w-4 h-4 text-indigo-600" />
                      {log.bus_number || 'BUS-01'}
                    </td>
                    <td className="p-3">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                          log.event_type === 'entry' ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {log.event_type}
                      </span>
                    </td>
                    <td className="p-3 font-mono">{log.odometer_km || '—'} km</td>
                    <td className="p-3 text-slate-600 max-w-xs truncate">{log.remarks}</td>
                    <td className="p-3 text-slate-500">{log.watchman_name || 'Kandasamy K.'}</td>
                    <td className="p-3 text-slate-400 font-mono">
                      {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
