const pool = require('../config/db');

exports.getDashboardStats = async (req, res) => {
  try {
    const [busCount] = await pool.query('SELECT COUNT(*) AS total FROM buses');
    const [activeTrips] = await pool.query("SELECT COUNT(*) AS total FROM trips WHERE status = 'in_progress'");
    const [studentCount] = await pool.query("SELECT COUNT(*) AS total FROM users WHERE role = 'student'");
    const [gateEventsToday] = await pool.query("SELECT COUNT(*) AS total FROM gate_logs WHERE DATE(timestamp) = CURDATE()");

    const [busStatusDist] = await pool.query(`
      SELECT status, COUNT(*) as count FROM buses GROUP BY status
    `);

    const [recentGateLogs] = await pool.query(`
      SELECT g.*, b.bus_number, u.name as watchman_name
      FROM gate_logs g
      JOIN buses b ON g.bus_id = b.id
      LEFT JOIN users u ON g.watchman_id = u.id
      ORDER BY g.timestamp DESC
      LIMIT 6
    `);

    return res.json({
      success: true,
      stats: {
        totalBuses: busCount[0].total,
        activeTrips: activeTrips[0].total,
        registeredStudents: studentCount[0].total,
        gateEventsToday: gateEventsToday[0].total,
        busStatusDistribution: busStatusDist,
        recentGateLogs
      }
    });
  } catch (error) {
    console.error('Analytics stats error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch dashboard stats.' });
  }
};
