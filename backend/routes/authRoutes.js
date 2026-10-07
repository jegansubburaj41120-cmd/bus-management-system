const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/login', authController.login);
router.get('/profile', authMiddleware(), authController.getProfile);
router.get('/users', authMiddleware(['admin']), authController.getAllUsers);

module.exports = router;
