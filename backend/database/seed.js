const path = require('path');
const bcrypt = require('bcryptjs');
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const initializeDatabase = require('./initDb');

dotenv.config({ path: path.join(__dirname, '../.env') });

async function seedDatabase() {
  console.log('🌱 Starting Database Seeding Process for CampusTransit...');

  await initializeDatabase();

  const connection = await mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || 'root',
    database: process.env.DB_NAME || 'bus_management_db',
    port: parseInt(process.env.DB_PORT || '3306', 10)
  });

  try {
    const salt = await bcrypt.genSalt(10);
    const defaultPassword = await bcrypt.hash('password123', salt);

    // 1. Seed Users
    console.log('Creating demo users (Admin, Mentor, Driver, Watchman, Student)...');
    const users = [
      ['Transport Officer (Admin)', 'admin@nprcolleges.org', defaultPassword, 'admin', '+91 9842100001', 'Transport Office', 'ADMIN-01'],
      ['Prof. Pandi (Bus Mentor)', 'mentor.pandi@nprcolleges.org', defaultPassword, 'mentor', '+91 9842100002', 'Computer Applications', 'FAC-102'],
      ['Saravanan M. (Senior Driver)', 'driver.saravanan@nprcolleges.org', defaultPassword, 'driver', '+91 9842100003', 'Transport Services', 'DRV-001'],
      ['Kandasamy K. (Main Gate Watchman)', 'watchman.kandasamy@nprcolleges.org', defaultPassword, 'watchman', '+91 9842100004', 'Campus Security', 'SEC-005'],
      ['Sabari Nathan (Student - MCA)', 'sabari.mca@nprcolleges.org', defaultPassword, 'student', '+91 9842100005', 'MCA Department', '24MCA108'],
      ['Divya R. (Student - CSE)', 'divya.cse@nprcolleges.org', defaultPassword, 'student', '+91 9842100006', 'CSE Department', '24CSE042'],
      ['Vignesh P. (Driver - Bus 07)', 'driver.vignesh@nprcolleges.org', defaultPassword, 'driver', '+91 9842100007', 'Transport Services', 'DRV-002']
    ];

    for (const u of users) {
      await connection.execute(`
        INSERT INTO users (name, email, password, role, phone, department, register_number)
        VALUES (?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), role = VALUES(role), phone = VALUES(phone)
      `, u);
    }

    // Get User IDs
    const [adminRow] = await connection.query("SELECT id FROM users WHERE email = 'admin@nprcolleges.org'");
    const [mentorRow] = await connection.query("SELECT id FROM users WHERE email = 'mentor.pandi@nprcolleges.org'");
    const [driverRow] = await connection.query("SELECT id FROM users WHERE email = 'driver.saravanan@nprcolleges.org'");
    const [watchmanRow] = await connection.query("SELECT id FROM users WHERE email = 'watchman.kandasamy@nprcolleges.org'");
    const [studentRow] = await connection.query("SELECT id FROM users WHERE email = 'sabari.mca@nprcolleges.org'");

    // 2. Seed Routes
    console.log('Seeding Routes & Bus Stops...');
    await connection.execute(`
      INSERT INTO routes (id, route_number, route_name, start_point, destination, total_distance_km, estimated_duration_mins, is_active)
      VALUES 
      (1, 'R-01', 'Gandhipuram to College Campus', 'Gandhipuram Central Bus Stand', 'NPR College Campus', 26.50, 50, TRUE),
      (2, 'R-02', 'Singanallur to College Campus', 'Singanallur Junction', 'NPR College Campus', 22.00, 42, TRUE),
      (3, 'R-03', 'Thudiyalur to College Campus', 'Thudiyalur Bus Stop', 'NPR College Campus', 31.00, 58, TRUE)
      ON DUPLICATE KEY UPDATE route_name = VALUES(route_name)
    `);

    // Route Stops for Route 1
    await connection.execute(`
      INSERT INTO route_stops (id, route_id, stop_name, stop_order, latitude, longitude, morning_pickup_time, evening_drop_time, fare)
      VALUES
      (1, 1, 'Gandhipuram Bus Stand', 1, 11.0168, 76.9558, '07:15:00', '17:45:00', 0.00),
      (2, 1, 'Lakshmi Mills Junction', 2, 11.0112, 76.9744, '07:25:00', '17:35:00', 0.00),
      (3, 1, 'Peelamedu / Hope College', 3, 11.0264, 77.0125, '07:38:00', '17:20:00', 0.00),
      (4, 1, 'KMCH / Sitra Roundabout', 4, 11.0385, 77.0422, '07:50:00', '17:08:00', 0.00),
      (5, 1, 'NPR College Campus Main Gate', 5, 11.0501, 77.0789, '08:15:00', '16:45:00', 0.00)
      ON DUPLICATE KEY UPDATE stop_name = VALUES(stop_name)
    `);

    // 3. Seed Buses
    console.log('Seeding College Bus Fleet...');
    await connection.execute(`
      INSERT INTO buses (id, bus_number, registration_number, capacity, model, status, route_id, driver_id, mentor_id, qr_code, last_lat, last_lng, current_speed)
      VALUES
      (1, 'BUS-01', 'TN 38 BG 4501', 52, 'Tata Ultra 9/12 AC', 'on_trip', 1, ?, ?, 'QR-BUS-01-NPR', 11.0264, 77.0125, 38),
      (2, 'BUS-02', 'TN 38 BG 4502', 52, 'Ashok Leyland Sunshine', 'in_campus', 2, NULL, NULL, 'QR-BUS-02-NPR', 11.0501, 77.0789, 0),
      (3, 'BUS-03', 'TN 38 BG 4503', 48, 'Eicher Skyline Pro', 'maintenance', 3, NULL, NULL, 'QR-BUS-03-NPR', 11.0501, 77.0789, 0)
      ON DUPLICATE KEY UPDATE bus_number = VALUES(bus_number), status = VALUES(status)
    `, [driverRow[0]?.id || 3, mentorRow[0]?.id || 2]);

    // 4. Seed Live Trip
    console.log('Seeding Active Trip...');
    await connection.execute(`
      INSERT INTO trips (id, bus_id, driver_id, route_id, trip_type, status, start_time, current_lat, current_lng, current_speed, next_stop_id, delay_minutes)
      VALUES
      (1, 1, ?, 1, 'morning_pickup', 'in_progress', NOW() - INTERVAL 25 MINUTE, 11.0264, 77.0125, 38, 3, 2)
      ON DUPLICATE KEY UPDATE status = VALUES(status), current_lat = VALUES(current_lat)
    `, [driverRow[0]?.id || 3]);

    // 5. Seed Student Bus Pass
    console.log('Seeding Student Digital Bus Pass...');
    if (studentRow.length > 0) {
      await connection.execute(`
        INSERT INTO student_passes (id, student_id, bus_id, route_id, stop_id, pass_number, qr_token, validity_start, validity_end, status)
        VALUES
        (1, ?, 1, 1, 3, 'PASS-2026-MCA-108', 'PASS-TOKEN-SABARI-24MCA108', '2026-06-01', '2027-05-31', 'active')
        ON DUPLICATE KEY UPDATE status = VALUES(status)
      `, [studentRow[0].id]);
    }

    // 6. Seed Gate Logs
    console.log('Seeding Gate Security Logs...');
    await connection.execute(`
      INSERT INTO gate_logs (bus_id, event_type, timestamp, watchman_id, odometer_km, remarks, verification_mode)
      VALUES
      (1, 'exit', NOW() - INTERVAL 45 MINUTE, ?, 42810, 'Departed for Morning Route 01 Pickup', 'qr_scan'),
      (2, 'entry', NOW() - INTERVAL 120 MINUTE, ?, 31200, 'Arrived from Workshop Inspection', 'qr_scan')
    `, [watchmanRow[0]?.id || 4, watchmanRow[0]?.id || 4]);

    // 7. Seed Notifications
    console.log('Seeding System Notifications...');
    await connection.execute(`
      INSERT INTO notifications (user_id, title, message, type)
      VALUES
      (NULL, 'Fleet System Online', 'All GPS tracking services and gate terminal listeners active.', 'info'),
      (NULL, 'Bus 01 Route 1 Status', 'Bus 01 is approaching Stop 3 (Peelamedu / Hope College) - Delay ~2 mins due to traffic.', 'warning')
    `);

    console.log('✅ Database Seeded Successfully with realistic campus transit data!');
  } catch (error) {
    console.error('❌ Error during seeding:', error);
    throw error;
  } finally {
    await connection.end();
  }
}

if (require.main === module) {
  seedDatabase()
    .then(() => process.exit(0))
    .catch(() => process.exit(1));
}

module.exports = seedDatabase;
