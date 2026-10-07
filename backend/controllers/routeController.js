const pool = require('../config/db');

exports.getAllRoutes = async (req, res) => {
  try {
    const [routes] = await pool.query('SELECT * FROM routes ORDER BY id ASC');

    for (let r of routes) {
      const [stops] = await pool.query(
        'SELECT * FROM route_stops WHERE route_id = ? ORDER BY stop_order ASC',
        [r.id]
      );
      r.stops = stops;
    }

    return res.json({ success: true, routes });
  } catch (error) {
    console.error('Get routes error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch routes.' });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const { id } = req.params;
    const [routes] = await pool.query('SELECT * FROM routes WHERE id = ?', [id]);

    if (routes.length === 0) {
      return res.status(404).json({ success: false, message: 'Route not found.' });
    }

    const route = routes[0];
    const [stops] = await pool.query(
      'SELECT * FROM route_stops WHERE route_id = ? ORDER BY stop_order ASC',
      [id]
    );
    route.stops = stops;

    return res.json({ success: true, route });
  } catch (error) {
    console.error('Get route error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch route.' });
  }
};

exports.createRoute = async (req, res) => {
  const connection = await pool.getConnection();
  try {
    await connection.beginTransaction();
    const { route_number, route_name, start_point, destination, total_distance_km, estimated_duration_mins, stops } = req.body;

    const [routeResult] = await connection.execute(`
      INSERT INTO routes (route_number, route_name, start_point, destination, total_distance_km, estimated_duration_mins)
      VALUES (?, ?, ?, ?, ?, ?)
    `, [route_number, route_name, start_point, destination, total_distance_km || 0, estimated_duration_mins || 45]);

    const routeId = routeResult.insertId;

    if (Array.isArray(stops) && stops.length > 0) {
      for (let i = 0; i < stops.length; i++) {
        const s = stops[i];
        await connection.execute(`
          INSERT INTO route_stops (route_id, stop_name, stop_order, latitude, longitude, morning_pickup_time, evening_drop_time, fare)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `, [routeId, s.stop_name, i + 1, s.latitude, s.longitude, s.morning_pickup_time || '07:30:00', s.evening_drop_time || '17:30:00', s.fare || 0]);
      }
    }

    await connection.commit();
    return res.status(201).json({ success: true, message: 'Route created successfully', routeId });
  } catch (error) {
    await connection.rollback();
    console.error('Create route error:', error);
    return res.status(500).json({ success: false, message: 'Failed to create route.' });
  } finally {
    connection.release();
  }
};
