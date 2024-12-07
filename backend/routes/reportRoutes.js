const express = require('express');
const { generateTaskReport, generateAIInsights, exportReports } = require('../controllers/reportController');
const authenticateToken = require('../middleware/authMiddleware');

const router = express.Router();

// // Route to fetch task reports
// router.get('/tasks', authenticateToken, async (req, res, next) => {
//     try {
//         await generateTaskReport(req, res, next);
//     } catch (error) {
//         next(error);  // Pass errors to the global error handler
//     }
// });

// // Route to fetch AI-based insights
// router.get('/insights', authenticateToken, async (req, res, next) => {
//     try {
//         await generateAIInsights(req, res, next);
//     } catch (error) {
//         next(error);
//     }
// });

// // Route to export reports
// router.get('/export', authenticateToken, async (req, res, next) => {
//     try {
//         await exportReports(req, res, next);
//     } catch (error) {
//         next(error);
//     }
// });

module.exports = router;
