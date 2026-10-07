const pool = require('../config/db');

exports.getManifestForTrip = async (req, res) => {
  try {
    const { bus_id, trip_id } = req.query;

    const [students] = await pool.query(`
      SELECT sp.id AS pass_id, sp.pass_number, sp.qr_token,
             u.id AS student_id, u.name, u.email, u.phone, u.register_number, u.department,
             rs.id AS stop_id, rs.stop_name, rs.stop_order, rs.morning_pickup_time,
             sa.status AS attendance_status, sa.check_in_time
      FROM student_passes sp
      JOIN users u ON sp.student_id = u.id
      JOIN route_stops rs ON sp.stop_id = rs.id
      LEFT JOIN student_attendance sa ON (sa.student_id = u.id AND sa.trip_id = ?)
      WHERE sp.bus_id = ? AND sp.status = 'active'
      ORDER BY rs.stop_order ASC, u.name ASC
    `, [trip_id || 0, bus_id || 1]);

    return res.json({ success: true, students });
  } catch (error) {
    console.error('Get manifest error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch boarding manifest.' });
  }
};

exports.markStudentBoarding = async (req, res) => {
  try {
    const { trip_id, student_id, stop_id, status } = req.body;
    const mentor_id = req.user?.id || null;

    await pool.execute(`
      INSERT INTO student_attendance (trip_id, student_id, stop_id, status, scanned_by_mentor_id, check_in_time)
      VALUES (?, ?, ?, ?, ?, NOW())
      ON DUPLICATE KEY UPDATE status = VALUES(status), check_in_time = NOW()
    `, [trip_id, student_id, stop_id, status || 'boarded', mentor_id]);

    return res.json({ success: true, message: 'Boarding status updated.' });
  } catch (error) {
    console.error('Mark attendance error:', error);
    return res.status(500).json({ success: false, message: 'Failed to record attendance.' });
  }
};
