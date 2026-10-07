import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Gauge, Play, Square, AlertTriangle, Compass, MapPin, Radio, CheckCircle } from 'lucide-react';

export const DriverCockpitPage: React.FC = () => {
  const [isTripActive, setIsTripActive] = useState(true);
  const [speed, setSpeed] = useState(42);
  const [currentWaypoint, setCurrentWaypoint] = useState(3);
  const [gpsSimActive, setGpsSimActive] = useState(false);

  // Simulated GPS waypoints along Coimbatore route
  const waypoints = [
    { name: 'Gandhipuram Central Stand', lat: 11.0168, lng: 76.9558 },
    { name: 'Lakshmi Mills Junction', lat: 11.0112, lng: 76.9744 },
    { name: 'Peelamedu / Hope College', lat: 11.0264, lng: 77.0125 },
    { name: 'KMCH / Sitra Roundabout', lat: 11.0385, lng: 77.0422 },
    { name: 'NPR College Main Gate', lat: 11.0501, lng: 77.0789 }
  ];

  useEffect(() => {
    let interval: any;
    if (gpsSimActive && isTripActive) {
      interval = setInterval(() => {
        setCurrentWaypoint((prev) => {
          const next = (prev + 1) % waypoints.length;
          const wp = waypoints[next];
          api.updateTripProgress(1, {
            latitude: wp.lat,
            longitude: wp.lng,
            speed: Math.floor(35 + Math.random() * 15),
            delay_minutes: 2
          });
          setSpeed(Math.floor(35 + Math.random() * 15));
          return next;
        });
      }, 4000);
    }
    return () => clearInterval(interval);
  }, [gpsSimActive, isTripActive]);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Commercial Driver Cockpit</h1>
          <p className="text-sm text-slate-500">Trip telemetry controls, road safety alerts, and GPS broadcaster.</p>
        </div>

        <div className="flex items-center gap-3">
          {isTripActive ? (
            <button
              onClick={() => setIsTripActive(false)}
              className="flex items-center gap-2 px-4 py-2 bg-rose-600 hover:bg-rose-700 text-white rounded-xl text-sm font-bold shadow-md shadow-rose-600/30 transition-all"
            >
              <Square className="w-4 h-4 fill-current" />
              End Current Trip
            </button>
          ) : (
            <button
              onClick={() => setIsTripActive(true)}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-sm font-bold shadow-md shadow-emerald-600/30 transition-all"
            >
              <Play className="w-4 h-4 fill-current" />
              Start Morning Trip
            </button>
          )}
        </div>
      </div>

      {/* Cockpit Gauge Cluster */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Speedometer card */}
        <div className="bg-slate-900 text-white p-6 rounded-3xl border border-slate-800 shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Speed Telemetry</span>
            <Radio className="w-4 h-4 text-emerald-400 animate-pulse" />
          </div>

          <div className="text-center py-6">
            <div className="text-6xl font-black tracking-tight font-mono text-indigo-400">{isTripActive ? speed : 0}</div>
            <span className="text-xs font-bold text-slate-400 tracking-wider">KILOMETERS PER HOUR</span>
          </div>

          <div className="flex justify-between items-center text-xs text-slate-400 border-t border-slate-800 pt-3">
            <span>Speed Limit: 50 km/h</span>
            <span className="text-emerald-400 font-bold">In Safe Bounds</span>
          </div>
        </div>

        {/* Active Bus & Route Status */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Active Assignment</div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">BUS-01 (Route 01)</h3>
            <p className="text-xs text-slate-500 mt-0.5">Gandhipuram Central ➔ NPR College Campus</p>
          </div>

          <div className="space-y-3 my-4">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Approaching Stop:</span>
              <span className="font-bold text-slate-900">{waypoints[currentWaypoint].name}</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-500">Schedule Status:</span>
              <span className="font-bold text-emerald-600">On Time (+2 min delay)</span>
            </div>
          </div>

          <button
            onClick={() => setGpsSimActive(!gpsSimActive)}
            className={`w-full py-2.5 rounded-xl text-xs font-bold transition-all border ${
              gpsSimActive
                ? 'bg-amber-500/10 text-amber-700 border-amber-300'
                : 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            {gpsSimActive ? '🛑 Pause GPS Waypoint Simulation' : '🚀 Start Live Waypoint Simulation'}
          </button>
        </div>

        {/* Emergency SOS & Safety */}
        <div className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm flex flex-col justify-between">
          <div>
            <div className="text-xs font-bold text-slate-400 uppercase tracking-wider">Safety & Distress</div>
            <h3 className="text-xl font-extrabold text-slate-900 mt-1">Road Incident Protocol</h3>
            <p className="text-xs text-slate-500 mt-0.5">Broadcast one-touch incident alerts to campus security.</p>
          </div>

          <div className="space-y-2 my-4">
            <button
              onClick={() => alert('Road Traffic Delay alert dispatched to all students and Transport Officer.')}
              className="w-full py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-all"
            >
              ⚠️ Report Traffic Congestion
            </button>
            <button
              onClick={() => alert('SOS Distress Signal sent to NPR Security Command & Local Authorities!')}
              className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-bold rounded-xl transition-all"
            >
              🚨 Dispatch Emergency SOS
            </button>
          </div>

          <div className="text-[11px] text-slate-400 text-center">
            GPS Beacon updates every 4 seconds
          </div>
        </div>
      </div>
    </div>
  );
};
