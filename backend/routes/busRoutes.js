const express = require('express');
const router = express.Router();
const busController = require('../controllers/busController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', busController.getAllBuses);
router.get('/:id', busController.getBusById);
router.post('/', authMiddleware(['admin']), busController.createBus);
router.put('/:id', authMiddleware(['admin']), busController.updateBus);
router.post('/:id/location', authMiddleware(['admin', 'driver']), busController.updateLiveLocation);

module.exports = router;
