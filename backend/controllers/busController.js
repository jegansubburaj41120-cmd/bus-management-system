const pool = require('../config/db');

exports.getAllBuses = async (req, res) => {
  try {
    const [buses] = await pool.query(`
      SELECT b.*, 
             r.route_number, r.route_name,
             d.name AS driver_name, d.phone AS driver_phone,
             m.name AS mentor_name, m.phone AS mentor_phone
      FROM buses b
      LEFT JOIN routes r ON b.route_id = r.id
      LEFT JOIN users d ON b.driver_id = d.id
      LEFT JOIN users m ON b.mentor_id = m.id
      ORDER BY b.bus_number ASC
    `);
    return res.json({ success: true, buses });
  } catch (error) {
    console.error('Get buses error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch buses.' });
  }
};

exports.getBusById = async (req, res) => {
  try {
    const { id } = req.params;
    const [buses] = await pool.query(`
      SELECT b.*, 
             r.route_number, r.route_name, r.start_point, r.destination,
             d.name AS driver_name, d.phone AS driver_phone,
             m.name AS mentor_name, m.phone AS mentor_phone
      FROM buses b
      LEFT JOIN routes r ON b.route_id = r.id
      LEFT JOIN users d ON b.driver_id = d.id
      LEFT JOIN users m ON b.mentor_id = m.id
      WHERE b.id = ?
    `, [id]);

    if (buses.length === 0) {
      return res.status(404).json({ success: false, message: 'Bus not found.' });
    }

    return res.json({ success: true, bus: buses[0] });
  } catch (error) {
    console.error('Get bus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch bus.' });
  }
};

exports.createBus = async (req, res) => {
  try {
    const { bus_number, registration_number, capacity, model, route_id, driver_id, mentor_id } = req.body;
    const qr_code = `QR-${bus_number.toUpperCase().replace(/\s+/g, '-')}-NPR`;

    const [result] = await pool.execute(`
      INSERT INTO buses (bus_number, registration_number, capacity, model, route_id, driver_id, mentor_id, qr_code)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `, [bus_number, registration_number, capacity || 50, model || 'Tata Starbus', route_id || null, driver_id || null, mentor_id || null, qr_code]);

    return res.status(201).json({ success: true, message: 'Bus registered successfully', busId: result.insertId });
  } catch (error) {
    console.error('Create bus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to register bus.' });
  }
};

exports.updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { bus_number, registration_number, capacity, model, status, route_id, driver_id, mentor_id } = req.body;

    await pool.execute(`
      UPDATE buses 
      SET bus_number = COALESCE(?, bus_number),
          registration_number = COALESCE(?, registration_number),
          capacity = COALESCE(?, capacity),
          model = COALESCE(?, model),
          status = COALESCE(?, status),
          route_id = ?,
          driver_id = ?,
          mentor_id = ?
      WHERE id = ?
    `, [bus_number, registration_number, capacity, model, status, route_id || null, driver_id || null, mentor_id || null, id]);

    return res.json({ success: true, message: 'Bus updated successfully' });
  } catch (error) {
    console.error('Update bus error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update bus.' });
  }
};

exports.updateLiveLocation = async (req, res) => {
  try {
    const { id } = req.params;
    const { latitude, longitude, speed, heading, trip_id } = req.body;

    await pool.execute(`
      UPDATE buses 
      SET last_lat = ?, last_lng = ?, current_speed = ?
      WHERE id = ?
    `, [latitude, longitude, speed || 0, id]);

    await pool.execute(`
      INSERT INTO bus_telemetry (bus_id, trip_id, latitude, longitude, speed, heading)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [id, trip_id || null, latitude, longitude, speed || 0, heading || 0]);

    return res.json({ success: true, message: 'Location updated.' });
  } catch (error) {
    console.error('Update location error:', error);
    return res.status(500).json({ success: false, message: 'Failed to update location.' });
  }
};
