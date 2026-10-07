const pool = require('../config/db');

exports.getMyBusPass = async (req, res) => {
  try {
    const student_id = req.user.id;

    const [passes] = await pool.query(`
      SELECT sp.*,
             u.name AS student_name, u.email AS student_email, u.register_number, u.department,
             b.bus_number, b.registration_number, b.model AS bus_model, b.status AS bus_status,
             b.last_lat, b.last_lng, b.current_speed,
             r.route_number, r.route_name, r.start_point, r.destination,
             rs.stop_name, rs.morning_pickup_time, rs.evening_drop_time, rs.latitude AS stop_lat, rs.longitude AS stop_lng,
             d.name AS driver_name, d.phone AS driver_phone,
             m.name AS mentor_name, m.phone AS mentor_phone
      FROM student_passes sp
      JOIN users u ON sp.student_id = u.id
      JOIN buses b ON sp.bus_id = b.id
      JOIN routes r ON sp.route_id = r.id
      JOIN route_stops rs ON sp.stop_id = rs.id
      LEFT JOIN users d ON b.driver_id = d.id
      LEFT JOIN users m ON b.mentor_id = m.id
      WHERE sp.student_id = ?
    `, [student_id]);

    if (passes.length === 0) {
      return res.status(404).json({ success: false, message: 'No active bus pass assigned.' });
    }

    return res.json({ success: true, pass: passes[0] });
  } catch (error) {
    console.error('Get my bus pass error:', error);
    return res.status(500).json({ success: false, message: 'Failed to retrieve bus pass.' });
  }
};
