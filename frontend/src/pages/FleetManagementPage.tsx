import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bus, Route } from '../types';
import { BusFront, Route as RouteIcon, Plus, CheckCircle2, AlertCircle } from 'lucide-react';

export const FleetManagementPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [activeTab, setActiveTab] = useState<'buses' | 'routes'>('buses');

  useEffect(() => {
    const load = async () => {
      const b = await api.getBuses();
      if (b.success) setBuses(b.buses);

      const r = await api.getRoutes();
      if (r.success) setRoutes(r.routes);
    };
    load();
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Fleet & Route Architecture</h1>
          <p className="text-sm text-slate-500">Manage college buses, seating capacities, driver rosters, and stop coordinates.</p>
        </div>

        {/* Tab selector */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('buses')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'buses' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BusFront className="w-4 h-4" /> Bus Fleet ({buses.length})
          </button>
          <button
            onClick={() => setActiveTab('routes')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-2 ${
              activeTab === 'routes' ? 'bg-white text-indigo-700 shadow-sm' : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <RouteIcon className="w-4 h-4" /> Transit Routes ({routes.length})
          </button>
        </div>
      </div>

      {activeTab === 'buses' ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {buses.map((bus) => (
            <div key={bus.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{bus.model}</span>
                <span
                  className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase ${
                    bus.status === 'on_trip'
                      ? 'bg-emerald-100 text-emerald-800'
                      : bus.status === 'in_campus'
                      ? 'bg-indigo-100 text-indigo-800'
                      : 'bg-amber-100 text-amber-800'
                  }`}
                >
                  {bus.status.replace('_', ' ')}
                </span>
              </div>

              <div>
                <h3 className="text-xl font-extrabold text-slate-900">{bus.bus_number}</h3>
                <span className="text-xs text-slate-400 font-mono">{bus.registration_number}</span>
              </div>

              <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
                <div className="flex justify-between">
                  <span className="text-slate-500">Route Assigned:</span>
                  <span className="font-bold text-slate-800">{bus.route_name || 'Route 01'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Capacity:</span>
                  <span className="font-bold text-slate-800">{bus.capacity} Seats</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Driver:</span>
                  <span className="font-bold text-slate-800">{bus.driver_name || 'Saravanan M.'}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="space-y-6">
          {routes.map((r) => (
            <div key={r.id} className="bg-white p-6 rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">{r.route_number}</span>
                  <h3 className="text-lg font-extrabold text-slate-900">{r.route_name}</h3>
                  <p className="text-xs text-slate-500">{r.start_point} ➔ {r.destination}</p>
                </div>
                <div className="text-right">
                  <span className="text-xs font-bold text-slate-700">{r.total_distance_km} km</span>
                  <div className="text-[11px] text-slate-400">~{r.estimated_duration_mins} mins</div>
                </div>
              </div>

              {/* Stops sequence */}
              <div className="pt-3 border-t border-slate-100">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">Bus Stops & Schedules</h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  {r.stops?.map((s, idx) => (
                    <div key={s.id} className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                      <div className="font-bold text-slate-900">#{idx + 1} {s.stop_name}</div>
                      <div className="text-[10px] text-slate-500 mt-1 font-mono">
                        Pickup: {s.morning_pickup_time} | Drop: {s.evening_drop_time}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
