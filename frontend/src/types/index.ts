export type UserRole = 'admin' | 'mentor' | 'driver' | 'watchman' | 'student';

export interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  department?: string;
  register_number?: string;
}

export interface RouteStop {
  id: number;
  route_id: number;
  stop_name: string;
  stop_order: number;
  latitude: number;
  longitude: number;
  morning_pickup_time: string;
  evening_drop_time: string;
  fare?: number;
}

export interface Route {
  id: number;
  route_number: string;
  route_name: string;
  start_point: string;
  destination: string;
  total_distance_km: number;
  estimated_duration_mins: number;
  is_active: boolean;
  stops?: RouteStop[];
}

export interface Bus {
  id: number;
  bus_number: string;
  registration_number: string;
  capacity: number;
  model: string;
  status: 'in_campus' | 'on_trip' | 'maintenance' | 'idle';
  route_id?: number | null;
  driver_id?: number | null;
  mentor_id?: number | null;
  qr_code?: string;
  last_lat?: number;
  last_lng?: number;
  current_speed?: number;
  route_number?: string;
  route_name?: string;
  driver_name?: string;
  driver_phone?: string;
  mentor_name?: string;
  mentor_phone?: string;
}

export interface Trip {
  id: number;
  bus_id: number;
  driver_id: number;
  route_id: number;
  trip_type: 'morning_pickup' | 'evening_drop' | 'special';
  status: 'scheduled' | 'in_progress' | 'completed' | 'cancelled';
  start_time: string;
  current_lat?: number;
  current_lng?: number;
  current_speed?: number;
  next_stop_id?: number;
  delay_minutes?: number;
  bus_number?: string;
  registration_number?: string;
  route_name?: string;
  driver_name?: string;
  next_stop_name?: string;
}

export interface GateLog {
  id: number;
  bus_id: number;
  bus_number?: string;
  registration_number?: string;
  event_type: 'entry' | 'exit';
  timestamp: string;
  watchman_id?: number;
  watchman_name?: string;
  odometer_km?: number;
  remarks?: string;
  verification_mode: 'qr_scan' | 'manual';
}

export interface StudentPass {
  id: number;
  student_id: number;
  student_name: string;
  student_email: string;
  register_number: string;
  department: string;
  bus_id: number;
  bus_number: string;
  registration_number: string;
  bus_model: string;
  bus_status: string;
  last_lat: number;
  last_lng: number;
  current_speed: number;
  route_id: number;
  route_number: string;
  route_name: string;
  start_point: string;
  destination: string;
  stop_id: number;
  stop_name: string;
  morning_pickup_time: string;
  evening_drop_time: string;
  stop_lat: number;
  stop_lng: number;
  driver_name: string;
  driver_phone: string;
  mentor_name: string;
  mentor_phone: string;
  pass_number: string;
  qr_token: string;
  validity_start: string;
  validity_end: string;
  status: 'active' | 'expired' | 'suspended';
}
