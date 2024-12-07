const { getTasks } = require('../models/taskModel');
const pdf = require('pdfkit');
const fs = require('fs');

// // Generate Task Reports
// const generateTaskReport = async (req, res, next) => {
//     try {
//         const tasks = await getTasks(); // Fetch tasks from DB
//         const completedTasks = tasks.filter(task => task.status === 'completed').length;
//         const inProgressTasks = tasks.filter(task => task.status === 'in-progress').length;

//         res.json({ totalTasks: tasks.length, completedTasks, inProgressTasks });
//     } catch (error) {
//         next(error);  // Pass the error to the next middleware
//     }
// };

// // Generate AI-Based Insights
// const generateAIInsights = async (req, res, next) => {
//     try {
//         const tasks = await getTasks();
//         const overdueTasks = tasks.filter(task => new Date(task.dueDate) < new Date());

//         res.json({
//             insights: `You have ${overdueTasks.length} overdue tasks. Consider prioritizing them.`,
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// // Export Reports to PDF
// const exportReports = async (req, res, next) => {
//     try {
//         const tasks = await getTasks();

//         // Generate PDF
//         const doc = new pdf();
//         const fileName = 'report.pdf';
//         const writeStream = fs.createWriteStream(fileName);

//         doc.pipe(writeStream);
//         doc.fontSize(16).text('Task Report', { align: 'center' });
//         doc.text(`Total Tasks: ${tasks.length}`);
//         tasks.forEach((task, idx) => doc.text(`${idx + 1}. ${task.title} - ${task.status}`));
//         doc.end();

//         writeStream.on('finish', () => {
//             res.download(fileName, () => fs.unlinkSync(fileName));
//         });
//     } catch (error) {
//         next(error);
//     }
// };

// controllers/reportController.js
const generateTaskReport = async (req, res) => {
    // function code...
};

const generateAIInsights = async (req, res) => {
    // function code...
};

const exportReports = async (req, res) => {
    // function code...
};

module.exports = {
    generateTaskReport,
    generateAIInsights,
    exportReports,
  };
