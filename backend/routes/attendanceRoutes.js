const express = require('express');
const router = express.Router();
const attendanceController = require('../controllers/attendanceController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/manifest', authMiddleware(['admin', 'mentor', 'driver']), attendanceController.getManifestForTrip);
router.post('/mark', authMiddleware(['admin', 'mentor']), attendanceController.markStudentBoarding);

module.exports = router;
