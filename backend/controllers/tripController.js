const pool = require('../config/db');

exports.getActiveTrips = async (req, res) => {
  try {
    const [trips] = await pool.query(`
      SELECT t.*, 
             b.bus_number, b.registration_number, b.model,
             r.route_number, r.route_name, r.start_point, r.destination,
             d.name AS driver_name, d.phone AS driver_phone,
             ns.stop_name AS next_stop_name
      FROM trips t
      JOIN buses b ON t.bus_id = b.id
      JOIN routes r ON t.route_id = r.id
      JOIN users d ON t.driver_id = d.id
      LEFT JOIN route_stops ns ON t.next_stop_id = ns.id
      WHERE t.status = 'in_progress'
      ORDER BY t.start_time DESC
    `);
    return res.json({ success: true, trips });
  } catch (error) {
    console.error('Get active trips error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch active trips.' });
  }
};

exports.startTrip = async (req, res) => {
  try {
    const { bus_id, route_id, trip_type } = req.body;
    const driver_id = req.user.id;

    // Get first stop for next_stop_id
    const [stops] = await pool.query(
      'SELECT id, latitude, longitude FROM route_stops WHERE route_id = ? ORDER BY stop_order ASC LIMIT 1',
      [route_id]
    );

    const firstStop = stops[0] || {};

    const [result] = await pool.execute(`
      INSERT INTO trips (bus_id, driver_id, route_id, trip_type, status, start_time, current_lat, current_lng, next_stop_id)
      VALUES (?, ?, ?, ?, 'in_progress', NOW(), ?, ?, ?)
    `, [bus_id, driver_id, route_id, trip_type || 'morning_pickup', firstStop.latitude || 11.0168, firstStop.longitude || 76.9558, firstStop.id || null]);

    await pool.execute("UPDATE buses SET status = 'on_trip' WHERE id = ?", [bus_id]);

    return res.status(201).json({
      success: true,
      message: 'Trip started successfully',
      tripId: result.insertId
    });
  } catch (error) {
    console.error('Start trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to start trip.' });
  }
};

exports.updateTripProgress = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, speed, next_stop_id, delay_minutes } = req.body;

    await pool.execute(`
      UPDATE trips
      SET current_lat = ?, current_lng = ?, current_speed = ?, next_stop_id = ?, delay_minutes = ?
      WHERE id = ?
    `, [latitude, longitude, speed || 0, next_stop_id || null, delay_minutes || 0, id]);

    // Also update bus last known position
    const [trip] = await pool.query('SELECT bus_id FROM trips WHERE id = ?', [id]);
    if (trip.length > 0) {
      await pool.execute(`
        UPDATE buses SET last_lat = ?, last_lng = ?, current_speed = ? WHERE id = ?
      `, [latitude, longitude, speed || 0, trip[0].bus_id]);
    }

    return res.json({ success: true, message: 'Trip progress synced.' });
  } catch (error) {
    console.error('Update trip progress error:', error);
    return res.status(500).json({ success: false, message: 'Failed to sync trip progress.' });
  }
};

exports.endTrip = async (req, res) => {
  try {
    const { id } = req.params;
    const [trip] = await pool.query('SELECT bus_id FROM trips WHERE id = ?', [id]);

    await pool.execute(`
      UPDATE trips SET status = 'completed', end_time = NOW() WHERE id = ?
    `, [id]);

    if (trip.length > 0) {
      await pool.execute("UPDATE buses SET status = 'in_campus', current_speed = 0 WHERE id = ?", [trip[0].bus_id]);
    }

    return res.json({ success: true, message: 'Trip completed successfully.' });
  } catch (error) {
    console.error('End trip error:', error);
    return res.status(500).json({ success: false, message: 'Failed to complete trip.' });
  }
};
