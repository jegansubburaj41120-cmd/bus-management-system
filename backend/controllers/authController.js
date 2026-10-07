const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../config/db');

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required.' });
    }

    const [users] = await pool.query(
      'SELECT id, name, email, password, role, phone, department, register_number FROM users WHERE email = ?',
      [email]
    );

    if (users.length === 0) {
      return res.status(401).json({ success: false, message: 'Invalid credentials. User account not found.' });
    }

    const user = users[0];
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password. Authentication failed.' });
    }

    // Role Security Enforcement
    if (role && user.role !== role) {
      const roleDisplayNames = {
        admin: 'Transport Admin',
        mentor: 'Bus Mentor',
        driver: 'Bus Driver',
        watchman: 'Gate Security',
        student: 'Student'
      };
      return res.status(403).json({
        success: false,
        message: `Security Access Denied: This account is registered as '${roleDisplayNames[user.role] || user.role}'. It is not authorized to access the '${roleDisplayNames[role] || role}' portal.`
      });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role, name: user.name },
      process.env.JWT_SECRET || 'super_secret_bus_management_jwt_token_2026_xyz',
      { expiresIn: process.env.JWT_EXPIRES_IN || '7d' }
    );

    const { password: _, ...userData } = user;
    return res.json({
      success: true,
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error during login.' });
  }
};

exports.getProfile = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, department, register_number, created_at FROM users WHERE id = ?',
      [req.user.id]
    );

    if (users.length === 0) {
      return res.status(404).json({ success: false, message: 'User not found.' });
    }

    return res.json({ success: true, user: users[0] });
  } catch (error) {
    console.error('Profile error:', error);
    return res.status(500).json({ success: false, message: 'Internal server error.' });
  }
};

exports.getAllUsers = async (req, res) => {
  try {
    const [users] = await pool.query(
      'SELECT id, name, email, role, phone, department, register_number, created_at FROM users ORDER BY id ASC'
    );
    return res.json({ success: true, users });
  } catch (error) {
    console.error('Get all users error:', error);
    return res.status(500).json({ success: false, message: 'Failed to fetch users.' });
  }
};
