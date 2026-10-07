import { Bus, Route, Trip, GateLog, StudentPass, User } from '../types';

const API_BASE = '/api';

const getHeaders = () => {
  const token = localStorage.getItem('transit_auth_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
};

export const api = {
  // Auth
  login: async (email: string, password: string, role?: string) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      return await res.json();
    } catch (e) {
      console.warn('Backend offline, using demo fallback:', e);
      return { success: false, message: 'Could not connect to backend server.' };
    }
  },

  getProfile: async () => {
    const res = await fetch(`${API_BASE}/auth/profile`, { headers: getHeaders() });
    return await res.json();
  },

  // Fleet
  getBuses: async (): Promise<{ success: boolean; buses: Bus[] }> => {
    try {
      const res = await fetch(`${API_BASE}/buses`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      // Fallback
      return {
        success: true,
        buses: [
          {
            id: 1,
            bus_number: 'BUS-01',
            registration_number: 'TN 38 BG 4501',
            capacity: 52,
            model: 'Tata Ultra 9/12 AC',
            status: 'on_trip',
            route_id: 1,
            route_number: 'R-01',
            route_name: 'Gandhipuram to College Campus',
            driver_name: 'Saravanan M.',
            driver_phone: '+91 9842100003',
            mentor_name: 'Prof. Pandi',
            mentor_phone: '+91 9842100002',
            last_lat: 11.0264,
            last_lng: 77.0125,
            current_speed: 42
          },
          {
            id: 2,
            bus_number: 'BUS-02',
            registration_number: 'TN 38 BG 4502',
            capacity: 52,
            model: 'Ashok Leyland Sunshine',
            status: 'in_campus',
            route_id: 2,
            route_number: 'R-02',
            route_name: 'Singanallur to College Campus',
            driver_name: 'Vignesh P.',
            driver_phone: '+91 9842100007',
            mentor_name: 'Prof. Anitha',
            mentor_phone: '+91 9842100009',
            last_lat: 11.0501,
            last_lng: 77.0789,
            current_speed: 0
          },
          {
            id: 3,
            bus_number: 'BUS-03',
            registration_number: 'TN 38 BG 4503',
            capacity: 48,
            model: 'Eicher Skyline Pro',
            status: 'maintenance',
            route_id: 3,
            route_number: 'R-03',
            route_name: 'Thudiyalur to College Campus',
            driver_name: 'Murugan K.',
            driver_phone: '+91 9842100010',
            last_lat: 11.0501,
            last_lng: 77.0789,
            current_speed: 0
          }
        ]
      };
    }
  },

  // Routes
  getRoutes: async (): Promise<{ success: boolean; routes: Route[] }> => {
    try {
      const res = await fetch(`${API_BASE}/routes`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return {
        success: true,
        routes: [
          {
            id: 1,
            route_number: 'R-01',
            route_name: 'Gandhipuram to College Campus',
            start_point: 'Gandhipuram Central Bus Stand',
            destination: 'NPR College Campus',
            total_distance_km: 26.5,
            estimated_duration_mins: 50,
            is_active: true,
            stops: [
              { id: 1, route_id: 1, stop_name: 'Gandhipuram Bus Stand', stop_order: 1, latitude: 11.0168, longitude: 76.9558, morning_pickup_time: '07:15:00', evening_drop_time: '17:45:00' },
              { id: 2, route_id: 1, stop_name: 'Lakshmi Mills Junction', stop_order: 2, latitude: 11.0112, longitude: 76.9744, morning_pickup_time: '07:25:00', evening_drop_time: '17:35:00' },
              { id: 3, route_id: 1, stop_name: 'Peelamedu / Hope College', stop_order: 3, latitude: 11.0264, longitude: 77.0125, morning_pickup_time: '07:38:00', evening_drop_time: '17:20:00' },
              { id: 4, route_id: 1, stop_name: 'KMCH / Sitra Roundabout', stop_order: 4, latitude: 11.0385, longitude: 77.0422, morning_pickup_time: '07:50:00', evening_drop_time: '17:08:00' },
              { id: 5, route_id: 1, stop_name: 'NPR College Campus Main Gate', stop_order: 5, latitude: 11.0501, longitude: 77.0789, morning_pickup_time: '08:15:00', evening_drop_time: '16:45:00' }
            ]
          }
        ]
      };
    }
  },

  // Trips
  getActiveTrips: async (): Promise<{ success: boolean; trips: Trip[] }> => {
    try {
      const res = await fetch(`${API_BASE}/trips/active`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return {
        success: true,
        trips: [
          {
            id: 1,
            bus_id: 1,
            bus_number: 'BUS-01',
            registration_number: 'TN 38 BG 4501',
            driver_id: 3,
            driver_name: 'Saravanan M.',
            route_id: 1,
            route_name: 'Gandhipuram to College Campus',
            trip_type: 'morning_pickup',
            status: 'in_progress',
            start_time: new Date(Date.now() - 25 * 60000).toISOString(),
            current_lat: 11.0264,
            current_lng: 77.0125,
            current_speed: 42,
            next_stop_name: 'Peelamedu / Hope College',
            delay_minutes: 2
          }
        ]
      };
    }
  },

  updateTripProgress: async (tripId: number, data: { latitude: number; longitude: number; speed: number; next_stop_id?: number; delay_minutes?: number }) => {
    try {
      const res = await fetch(`${API_BASE}/trips/${tripId}/progress`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify(data)
      });
      return await res.json();
    } catch {
      return { success: true };
    }
  },

  // Gate
  getGateLogs: async (): Promise<{ success: boolean; logs: GateLog[] }> => {
    try {
      const res = await fetch(`${API_BASE}/gate/logs`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return {
        success: true,
        logs: [
          {
            id: 1,
            bus_id: 1,
            bus_number: 'BUS-01',
            event_type: 'exit',
            timestamp: new Date(Date.now() - 45 * 60000).toISOString(),
            watchman_name: 'Kandasamy K.',
            odometer_km: 42810,
            remarks: 'Departed for Morning Route 01 Pickup',
            verification_mode: 'qr_scan'
          },
          {
            id: 2,
            bus_id: 2,
            bus_number: 'BUS-02',
            event_type: 'entry',
            timestamp: new Date(Date.now() - 110 * 60000).toISOString(),
            watchman_name: 'Kandasamy K.',
            odometer_km: 31200,
            remarks: 'Arrived from Campus Maintenance Yard',
            verification_mode: 'qr_scan'
          }
        ]
      };
    }
  },

  logGateScan: async (payload: { bus_number: string; event_type: 'entry' | 'exit'; odometer_km?: number; remarks?: string }) => {
    try {
      const res = await fetch(`${API_BASE}/gate/scan`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(payload)
      });
      return await res.json();
    } catch {
      return { success: true, message: `Gate ${payload.event_type.toUpperCase()} recorded (Demo mode)` };
    }
  },

  // Student Pass
  getMyBusPass: async (): Promise<{ success: boolean; pass: StudentPass }> => {
    try {
      const res = await fetch(`${API_BASE}/student/my-pass`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return {
        success: true,
        pass: {
          id: 1,
          student_id: 5,
          student_name: 'Sabari Nathan',
          student_email: 'sabari.mca@nprcolleges.org',
          register_number: '24MCA108',
          department: 'Master of Computer Applications',
          bus_id: 1,
          bus_number: 'BUS-01',
          registration_number: 'TN 38 BG 4501',
          bus_model: 'Tata Ultra 9/12 AC',
          bus_status: 'on_trip',
          last_lat: 11.0264,
          last_lng: 77.0125,
          current_speed: 38,
          route_id: 1,
          route_number: 'R-01',
          route_name: 'Gandhipuram to College Campus',
          start_point: 'Gandhipuram Central Bus Stand',
          destination: 'NPR College Campus',
          stop_id: 3,
          stop_name: 'Peelamedu / Hope College',
          morning_pickup_time: '07:38 AM',
          evening_drop_time: '05:20 PM',
          stop_lat: 11.0264,
          stop_lng: 77.0125,
          driver_name: 'Saravanan M.',
          driver_phone: '+91 9842100003',
          mentor_name: 'Prof. Pandi',
          mentor_phone: '+91 9842100002',
          pass_number: 'PASS-2026-MCA-108',
          qr_token: 'PASS-TOKEN-SABARI-24MCA108',
          validity_start: '2026-06-01',
          validity_end: '2027-05-31',
          status: 'active'
        }
      };
    }
  },

  // Analytics
  getDashboardStats: async () => {
    try {
      const res = await fetch(`${API_BASE}/analytics/dashboard`, { headers: getHeaders() });
      if (!res.ok) throw new Error('API error');
      return await res.json();
    } catch {
      return {
        success: true,
        stats: {
          totalBuses: 5,
          activeTrips: 1,
          registeredStudents: 412,
          gateEventsToday: 18,
          busStatusDistribution: [
            { status: 'on_trip', count: 1 },
            { status: 'in_campus', count: 3 },
            { status: 'maintenance', count: 1 }
          ]
        }
      };
    }
  }
};
