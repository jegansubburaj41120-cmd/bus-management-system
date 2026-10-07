import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Bus, Route } from '../types';
import { LiveMap } from '../components/LiveMap';
import { MapPin, Navigation, Compass, AlertCircle, Phone, User, CheckCircle2 } from 'lucide-react';

export const LiveTrackingPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [selectedBus, setSelectedBus] = useState<Bus | null>(null);

  useEffect(() => {
    const load = async () => {
      const busRes = await api.getBuses();
      if (busRes.success) {
        setBuses(busRes.buses);
        setSelectedBus(busRes.buses[0] || null);
      }
      const routeRes = await api.getRoutes();
      if (routeRes.success) setRoutes(routeRes.routes);
    };
    load();
  }, []);

  const activeRoute = routes.find((r) => r.id === selectedBus?.route_id) || routes[0];

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">Real-Time Fleet Telematics</h1>
          <p className="text-sm text-slate-500">Live GPS tracking and stop-by-stop passenger arrival projections.</p>
        </div>

        {/* Bus Selector */}
        <div className="flex items-center gap-2">
          {buses.map((bus) => (
            <button
              key={bus.id}
              onClick={() => setSelectedBus(bus)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                selectedBus?.id === bus.id
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/30'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span>{bus.bus_number}</span>
              <span
                className={`w-2 h-2 rounded-full ${
                  bus.status === 'on_trip' ? 'bg-emerald-400 animate-pulse' : 'bg-slate-300'
                }`}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Map View */}
        <div className="lg:col-span-2 h-[560px] bg-white rounded-2xl border border-slate-200/80 p-2 shadow-sm">
          <LiveMap
            buses={buses}
            stops={activeRoute?.stops || []}
            selectedBusId={selectedBus?.id}
            onSelectBus={(b) => setSelectedBus(b)}
          />
        </div>

        {/* Selected Bus Detail Card */}
        {selectedBus && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-5 shadow-sm space-y-5">
            <div className="flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider">Fleet Asset</span>
                <h3 className="text-xl font-extrabold text-slate-900">{selectedBus.bus_number}</h3>
                <span className="text-xs text-slate-400 font-mono">{selectedBus.registration_number}</span>
              </div>
              <span
                className={`px-2.5 py-1 rounded-full text-xs font-extrabold uppercase ${
                  selectedBus.status === 'on_trip'
                    ? 'bg-emerald-100 text-emerald-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {selectedBus.status.replace('_', ' ')}
              </span>
            </div>

            {/* Telematics Metrics */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Live Speed</div>
                <div className="text-lg font-black text-slate-800 mt-0.5">{selectedBus.current_speed || 0} km/h</div>
              </div>
              <div className="bg-slate-50 p-3 rounded-xl border border-slate-100">
                <div className="text-[11px] font-bold text-slate-400 uppercase">Current Capacity</div>
                <div className="text-lg font-black text-slate-800 mt-0.5">38 / {selectedBus.capacity} Seats</div>
              </div>
            </div>

            {/* Driver & Mentor Details */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs">
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Driver:</span>
                <span className="font-bold text-slate-800">{selectedBus.driver_name || 'Saravanan M.'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5"><Phone className="w-3.5 h-3.5" /> Contact:</span>
                <span className="font-bold text-indigo-600">{selectedBus.driver_phone || '+91 9842100003'}</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span className="text-slate-500 flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5" /> Bus Mentor:</span>
                <span className="font-bold text-slate-800">{selectedBus.mentor_name || 'Prof. Pandi'}</span>
              </div>
            </div>

            {/* Route Stops Sequence */}
            <div className="pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-3">
                Route Stops ({activeRoute?.stops?.length || 0})
              </h4>
              <div className="space-y-2.5 max-h-48 overflow-y-auto pr-1">
                {activeRoute?.stops?.map((stop, idx) => (
                  <div key={stop.id} className="flex items-start gap-2.5 text-xs">
                    <div className="w-5 h-5 rounded-full bg-indigo-50 text-indigo-700 font-bold flex items-center justify-center shrink-0 text-[11px]">
                      {idx + 1}
                    </div>
                    <div className="flex-1">
                      <div className="font-semibold text-slate-800">{stop.stop_name}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Pickup: {stop.morning_pickup_time}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
