const express = require('express');
const router = express.Router();
const tripController = require('../controllers/tripController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/active', tripController.getActiveTrips);
router.post('/start', authMiddleware(['admin', 'driver']), tripController.startTrip);
router.put('/:id/progress', authMiddleware(['admin', 'driver']), tripController.updateTripProgress);
router.put('/:id/end', authMiddleware(['admin', 'driver']), tripController.endTrip);

module.exports = router;
