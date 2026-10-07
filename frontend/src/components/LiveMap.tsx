import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { Bus, RouteStop } from '../types';

interface LiveMapProps {
  buses: Bus[];
  stops?: RouteStop[];
  selectedBusId?: number | null;
  onSelectBus?: (bus: Bus) => void;
  center?: [number, number];
  zoom?: number;
}

export const LiveMap: React.FC<LiveMapProps> = ({
  buses,
  stops = [],
  selectedBusId,
  onSelectBus,
  center = [11.0280, 77.0280],
  zoom = 13
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersRef = useRef<{ [key: string]: any }>({});

  useEffect(() => {
    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      const map = L.map(mapContainerRef.current).setView(center, zoom);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors',
        maxZoom: 19,
      }).addTo(map);

      mapInstanceRef.current = map;
    }

    const map = mapInstanceRef.current;

    // Clear old markers
    Object.values(markersRef.current).forEach((m: any) => map.removeLayer(m));
    markersRef.current = {};

    // Custom Bus Icon
    const createBusIcon = (status: string, isSelected: boolean) => {
      const color = status === 'on_trip' ? '#4f46e5' : status === 'in_campus' ? '#10b981' : '#f59e0b';
      return L.divIcon({
        className: 'custom-bus-pin',
        html: `
          <div style="
            background: ${color};
            width: ${isSelected ? '38px' : '32px'};
            height: ${isSelected ? '38px' : '32px'};
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            box-shadow: 0 4px 12px rgba(0,0,0,0.3);
            border: 3px solid white;
            font-size: 16px;
            font-weight: bold;
            transition: all 0.3s ease;
          ">
            🚌
          </div>
        `,
        iconSize: [32, 32],
        iconAnchor: [16, 16]
      });
    };

    // Custom Stop Icon
    const stopIcon = L.divIcon({
      className: 'custom-stop-pin',
      html: `
        <div style="
          background: #0f172a;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 3px solid #6366f1;
          box-shadow: 0 2px 6px rgba(0,0,0,0.2);
        "></div>
      `,
      iconSize: [16, 16],
      iconAnchor: [8, 8]
    });

    // Render Stops & Route Polyline
    if (stops.length > 0) {
      const latlngs: [number, number][] = [];
      stops.forEach((stop) => {
        const marker = L.marker([stop.latitude, stop.longitude], { icon: stopIcon })
          .addTo(map)
          .bindPopup(`<b>Stop #${stop.stop_order}: ${stop.stop_name}</b><br/>Pickup: ${stop.morning_pickup_time}`);
        markersRef.current[`stop_${stop.id}`] = marker;
        latlngs.push([stop.latitude, stop.longitude]);
      });

      if (latlngs.length > 1) {
        const polyline = L.polyline(latlngs, { color: '#6366f1', weight: 4, opacity: 0.8, dashArray: '6, 8' }).addTo(map);
        markersRef.current['route_polyline'] = polyline;
      }
    }

    // Render Buses
    buses.forEach((bus) => {
      const lat = bus.last_lat || 11.0264;
      const lng = bus.last_lng || 77.0125;
      const isSelected = bus.id === selectedBusId;

      const marker = L.marker([lat, lng], {
        icon: createBusIcon(bus.status, isSelected)
      }).addTo(map);

      marker.bindPopup(`
        <div style="font-family: sans-serif; font-size: 13px;">
          <h4 style="margin: 0 0 4px; font-weight: bold; color: #1e293b;">${bus.bus_number} (${bus.registration_number})</h4>
          <div><b>Status:</b> ${bus.status.toUpperCase()}</div>
          <div><b>Route:</b> ${bus.route_name || 'Route 01'}</div>
          <div><b>Speed:</b> ${bus.current_speed || 0} km/h</div>
          <div><b>Driver:</b> ${bus.driver_name || 'Assigned'}</div>
        </div>
      `);

      marker.on('click', () => {
        if (onSelectBus) onSelectBus(bus);
      });

      markersRef.current[`bus_${bus.id}`] = marker;
    });
  }, [buses, stops, selectedBusId]);

  return (
    <div className="relative w-full h-full min-h-[400px] rounded-2xl overflow-hidden shadow-inner border border-slate-200">
      <div ref={mapContainerRef} className="w-full h-full min-h-[400px]" />
    </div>
  );
};
