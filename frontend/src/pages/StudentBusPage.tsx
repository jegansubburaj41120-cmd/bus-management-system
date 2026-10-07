import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { StudentPass } from '../types';
import { QRCodeSVG } from 'qrcode.react';
import { Bus, MapPin, Clock, Shield, Phone, User, CheckCircle2, AlertCircle } from 'lucide-react';

export const StudentBusPage: React.FC = () => {
  const [pass, setPass] = useState<StudentPass | null>(null);

  useEffect(() => {
    const loadPass = async () => {
      const res = await api.getMyBusPass();
      if (res.success) setPass(res.pass);
    };
    loadPass();
  }, []);

  if (!pass) return null;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">My Digital Bus Pass & Live ETA</h1>
          <p className="text-sm text-slate-500">Official college transportation credential and real-time arrival monitor.</p>
        </div>
        <span className="px-3.5 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-200 flex items-center gap-1.5">
          <CheckCircle2 className="w-4 h-4" /> Academic Year 2026-27 Active
        </span>
      </div>

      {/* Dynamic ETA Banner */}
      <div className="bg-gradient-to-r from-indigo-900 via-indigo-800 to-indigo-950 text-white p-6 rounded-3xl shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-1 text-center md:text-left">
          <span className="text-xs font-bold text-indigo-300 uppercase tracking-widest">Live Dynamic ETA</span>
          <h3 className="text-3xl font-extrabold tracking-tight">Arriving in ~8 Minutes</h3>
          <p className="text-xs text-indigo-200">
            Bus 01 is 2.8 km away • Approaching Peelamedu / Hope College Stop
          </p>
        </div>

        <div className="flex items-center gap-3 bg-white/10 backdrop-blur px-5 py-3 rounded-2xl border border-white/10">
          <div className="text-right">
            <div className="text-xs font-bold text-indigo-200">Morning Pickup</div>
            <div className="text-xl font-black font-mono">{pass.morning_pickup_time}</div>
          </div>
          <div className="w-10 h-10 rounded-xl bg-indigo-500/30 flex items-center justify-center">
            <Clock className="w-5 h-5 text-indigo-300" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Digital Bus Pass Card with QR */}
        <div className="md:col-span-1 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col items-center justify-between text-center">
          <div className="w-full">
            <div className="flex items-center justify-between w-full mb-4">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">Digital Pass</span>
              <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                VERIFIED
              </span>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-2xl inline-block shadow-inner mb-4">
              <QRCodeSVG value={pass.qr_token} size={150} level="H" />
            </div>

            <h4 className="font-extrabold text-slate-900 text-base">{pass.student_name}</h4>
            <p className="text-xs text-slate-500 font-mono mt-0.5">{pass.register_number}</p>
            <p className="text-xs text-indigo-600 font-bold mt-1">{pass.department}</p>
          </div>

          <div className="w-full pt-4 border-t border-slate-100 text-[11px] text-slate-400 font-mono">
            {pass.pass_number}
          </div>
        </div>

        {/* Bus & Driver Contact Info */}
        <div className="md:col-span-2 bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-5">
          <div>
            <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Assigned Fleet</span>
            <h3 className="text-xl font-extrabold text-slate-900">{pass.bus_number} ({pass.registration_number})</h3>
            <p className="text-xs text-slate-500 mt-0.5">{pass.route_name}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Assigned Boarding Stop</div>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-indigo-600" />
                {pass.stop_name}
              </div>
            </div>

            <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-100">
              <div className="text-[10px] font-bold text-slate-400 uppercase">Evening Campus Return</div>
              <div className="text-sm font-bold text-slate-900 mt-1 flex items-center gap-1.5">
                <Clock className="w-4 h-4 text-emerald-600" />
                {pass.evening_drop_time} Departure
              </div>
            </div>
          </div>

          <div className="pt-2 border-t border-slate-100 space-y-3">
            <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">Duty Officers</h4>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center font-bold text-slate-700 text-xs">
                  {pass.driver_name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{pass.driver_name}</div>
                  <div className="text-[10px] text-slate-400">Assigned Driver</div>
                </div>
              </div>
              <a
                href={`tel:${pass.driver_phone}`}
                className="px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Call Driver
              </a>
            </div>

            <div className="flex items-center justify-between p-3 bg-slate-50 rounded-xl">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                  {pass.mentor_name.charAt(0)}
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-900">{pass.mentor_name}</div>
                  <div className="text-[10px] text-slate-400">Faculty Bus Mentor</div>
                </div>
              </div>
              <a
                href={`tel:${pass.mentor_phone}`}
                className="px-3 py-1.5 bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-bold rounded-lg transition-all flex items-center gap-1.5"
              >
                <Phone className="w-3.5 h-3.5" /> Contact Mentor
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
