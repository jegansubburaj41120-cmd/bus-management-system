-- CampusTransit: Smart College Bus Management Database Schema (MySQL)

CREATE TABLE IF NOT EXISTS users (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(150) NOT NULL,
  email VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  role ENUM('admin', 'mentor', 'driver', 'watchman', 'student') NOT NULL DEFAULT 'student',
  phone VARCHAR(20),
  department VARCHAR(100),
  register_number VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS routes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_number VARCHAR(50) NOT NULL UNIQUE,
  route_name VARCHAR(150) NOT NULL,
  start_point VARCHAR(150) NOT NULL,
  destination VARCHAR(150) NOT NULL,
  total_distance_km DECIMAL(6,2) DEFAULT 0.00,
  estimated_duration_mins INT DEFAULT 45,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS route_stops (
  id INT AUTO_INCREMENT PRIMARY KEY,
  route_id INT NOT NULL,
  stop_name VARCHAR(150) NOT NULL,
  stop_order INT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  morning_pickup_time TIME NOT NULL,
  evening_drop_time TIME NOT NULL,
  fare DECIMAL(8,2) DEFAULT 0.00,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS buses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_number VARCHAR(50) NOT NULL UNIQUE,
  registration_number VARCHAR(50) NOT NULL UNIQUE,
  capacity INT NOT NULL DEFAULT 50,
  model VARCHAR(100) DEFAULT 'Tata Starbus Ultra',
  status ENUM('in_campus', 'on_trip', 'maintenance', 'idle') DEFAULT 'in_campus',
  route_id INT NULL,
  driver_id INT NULL,
  mentor_id INT NULL,
  qr_code VARCHAR(255) NULL,
  last_lat DECIMAL(10,8) DEFAULT 11.0168,
  last_lng DECIMAL(11,8) DEFAULT 76.9558,
  current_speed INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE SET NULL,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL,
  FOREIGN KEY (mentor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS trips (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_id INT NOT NULL,
  driver_id INT NOT NULL,
  route_id INT NOT NULL,
  trip_type ENUM('morning_pickup', 'evening_drop', 'special') DEFAULT 'morning_pickup',
  status ENUM('scheduled', 'in_progress', 'completed', 'cancelled') DEFAULT 'scheduled',
  start_time DATETIME NULL,
  end_time DATETIME NULL,
  current_lat DECIMAL(10, 8) NULL,
  current_lng DECIMAL(11, 8) NULL,
  current_speed INT DEFAULT 0,
  next_stop_id INT NULL,
  delay_minutes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (next_stop_id) REFERENCES route_stops(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS bus_telemetry (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NULL,
  bus_id INT NOT NULL,
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  speed INT DEFAULT 0,
  heading INT DEFAULT 0,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS gate_logs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  bus_id INT NOT NULL,
  event_type ENUM('entry', 'exit') NOT NULL,
  timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  watchman_id INT NULL,
  odometer_km INT DEFAULT 0,
  remarks VARCHAR(255) NULL,
  verification_mode ENUM('qr_scan', 'manual') DEFAULT 'qr_scan',
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  FOREIGN KEY (watchman_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS student_passes (
  id INT AUTO_INCREMENT PRIMARY KEY,
  student_id INT NOT NULL,
  bus_id INT NOT NULL,
  route_id INT NOT NULL,
  stop_id INT NOT NULL,
  pass_number VARCHAR(50) UNIQUE NOT NULL,
  qr_token VARCHAR(255) NOT NULL,
  validity_start DATE NOT NULL,
  validity_end DATE NOT NULL,
  status ENUM('active', 'expired', 'suspended') DEFAULT 'active',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (bus_id) REFERENCES buses(id) ON DELETE CASCADE,
  FOREIGN KEY (route_id) REFERENCES routes(id) ON DELETE CASCADE,
  FOREIGN KEY (stop_id) REFERENCES route_stops(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS student_attendance (
  id INT AUTO_INCREMENT PRIMARY KEY,
  trip_id INT NOT NULL,
  student_id INT NOT NULL,
  stop_id INT NOT NULL,
  check_in_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  status ENUM('boarded', 'absent', 'dropped_off') DEFAULT 'boarded',
  scanned_by_mentor_id INT NULL,
  FOREIGN KEY (trip_id) REFERENCES trips(id) ON DELETE CASCADE,
  FOREIGN KEY (student_id) REFERENCES users(id) ON DELETE CASCADE,
  FOREIGN KEY (stop_id) REFERENCES route_stops(id) ON DELETE CASCADE,
  FOREIGN KEY (scanned_by_mentor_id) REFERENCES users(id) ON DELETE SET NULL
);

CREATE TABLE IF NOT EXISTS notifications (
  id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NULL,
  title VARCHAR(200) NOT NULL,
  message TEXT NOT NULL,
  type ENUM('info', 'alert', 'warning', 'success') DEFAULT 'info',
  is_read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
);
