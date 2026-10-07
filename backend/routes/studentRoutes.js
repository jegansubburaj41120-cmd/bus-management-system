const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/my-pass', authMiddleware(['student', 'admin']), studentController.getMyBusPass);

module.exports = router;
