const pool = require('../config/db');

exports.logGateEvent = async (req, res) => {
  try {
    const { bus_id, bus_number, event_type, odometer_km, remarks, verification_mode } = req.body;
    const watchman_id = req.user?.id || null;

    let targetBusId = bus_id;
    if (!targetBusId && bus_number) {
      const [bus] = await pool.query('SELECT id FROM buses WHERE bus_number = ? OR registration_number = ?', [bus_number, bus_number]);
      if (bus.length > 0) targetBusId = bus[0].id;
    }

    if (!targetBusId) {
      return res.status(404).json({ success: false, message: 'Bus could not be identified.' });
    }

    const [result] = await pool.execute(`
      INSERT INTO gate_logs (bus_id, event_type, watchman_id, odometer_km, remarks, verification_mode)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [targetBusId, event_type, watchman_id, odometer_km || 0, remarks || `Gate ${event_type.toUpperCase()} recorded`, verification_mode || 'qr_scan']);

    // Update bus status based on gate event
    const newStatus = event_type === 'entry' ? 'in_campus' : 'on_trip';
    await pool.execute('UPDATE buses SET status = ? WHERE id = ?', [newStatus, targetBusId]);

    return res.status(201).json({
      success: true,
      message: `Bus ${event_type.toUpperCase()} logged successfully!`,
      logId: result.insertId
    });
  } catch (error) {
    console.error('Log gate event error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record gate event.' });
  }
};

exports.getGateLogs = async (req, res) => {
  try {
    const [logs] = await pool.query(`
      SELECT g.*, 
             b.bus_number, b.registration_number, b.model,
             u.name AS watchman_name
      FROM gate_logs g
      JOIN buses b ON g.bus_id = b.id
      LEFT JOIN users u ON g.watchman_id = u.id
      ORDER BY g.timestamp DESC
      LIMIT 100
    `);
    return res.json({ success: true, logs });
  } catch (error) {
    console.error('Get gate logs error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch gate logs.' });
  }
};
