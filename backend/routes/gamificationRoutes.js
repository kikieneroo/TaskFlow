const express = require('express');
const router = express.Router();
const gamificationController = require('../controllers/gamificationController');
const { authenticateToken } = require('../middleware/authMiddleware');

// Secure routes with authentication
router.get('/leaderboard', authenticateToken, gamificationController.getLeaderboard);
router.post('/update-points', authenticateToken, gamificationController.updatePoints);
router.get('/points-history', authenticateToken, gamificationController.getPointsHistory);
router.post('/update-leaderboard', authenticateToken, gamificationController.updateLeaderboard);

module.exports = router;
