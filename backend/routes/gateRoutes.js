const express = require('express');
const router = express.Router();
const gateController = require('../controllers/gateController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/logs', authMiddleware(), gateController.getGateLogs);
router.post('/scan', authMiddleware(['admin', 'watchman']), gateController.logGateEvent);

module.exports = router;
