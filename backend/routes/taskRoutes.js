const express = require('express');
const { createTask, getTasks, updateTask, deleteTask, completeTask, getLeaderboard} = require('../controllers/taskController');
const { authenticateToken } = require('../middleware/authMiddleware');
const { refreshAccessToken } = require('../controllers/authController');
const router = express.Router();

//const { authenticateUser } = require('../middleware/authMiddleware'); // Ensure user is authenticated
const db = require('../database'); // Import your database connection

router.post('/create', authenticateToken, createTask);
router.get('/', authenticateToken, getTasks);
router.put('/:id', authenticateToken, updateTask);
router.delete('/:id', authenticateToken, deleteTask);
router.post('/refresh-token', refreshAccessToken);

// router.post('/complete', authenticateToken, completeTask);
// router.get('/leaderboard', authenticateToken, getLeaderboard);


// router.get('/tasks/:userId', authenticateToken, getTasksForUser);   // Get tasks assigned to the logged-in user

// Create a new task
// router.post('/create', authenticateToken, (req, res) => {
//     const { title, description, status, assignedTo, dueDate, created_by} = req.body;

//     if (!title || !description || !status || !assignedTo || !dueDate || !created_by ) {
//         return res.status(400).json({ error: 'All fields are required' });
//     }

//     const query = `INSERT INTO tasks (title, description, status, assigned_to, due_date, created_by) VALUES (?, ?, ?, ?, ?, ?)`;

//     db.run(query, [title, description, status, assignedTo, dueDate, created_by], function (err) {
//         if (err) {
//             console.error('Error inserting task into database:', err.message);
//             return res.status(500).json({ error: 'Failed to create task' });
//         }

//         res.status(201).json({ message: 'Task created successfully!', 
//             taskId: this.lastID,
//             task: { id: this.lastID, title, description, assignedTo, status } 
//         });
//     });
// });

// // Route to get tasks for the logged-in user
// router.get('/', authenticateToken, (req, res) => {
//     const userId = req.userId; // Extract user ID from the token
//     //const userId = localStorage.getItem('userId'); // Retrieve from localStorage

//     // Query to fetch tasks assigned to the user
//     const query = `SELECT * FROM tasks WHERE assigned_to = ?`;
//     db.all(
//         `SELECT * FROM tasks WHERE assigned_to = ?`,
//         [userId],
//         (err, rows) => {
//         if (err) {
//             console.error('Database error:', err.message);
//             return res.status(500).json({ error: 'Database error' });
//         }

//         if (rows.length === 0) {
//             return res.status(404).json({ message: 'No tasks found for this user' });
//         }

//         res.status(200).json({ tasks: rows });
//     });
// });


// router.put('/tasks/:taskId', authenticateToken, async (req, res) => {
//     const { taskId } = req.params;
//     const { title, status, progress_note, task_id } = req.body;
//     const userId = req.user.id; // Assuming user ID is decoded from the token

//     try {
//         // Fetch the existing task to compare status
//         const existingTask = await db.get(`SELECT status FROM tasks WHERE id = ?`, [taskId]);
//         if (!existingTask) {
//             return res.status(404).json({ message: 'Task not found' });
//         }

//         // Update the task in the database
//         await db.run(
//             `UPDATE tasks SET title = ?, status = ?, progress_note = ? WHERE id = ?`,
//             [title, status, progress_note, taskId]
//         );

//         // If the status is changed to "Completed", call updatePoints
//         if (existingTask.status !== "Completed" && status === "Completed") {
//             const pointsEarned = 10; // Example points logic for completing a task
//             const timestamp = new Date().toISOString();

//             // Call the updatePoints logic
//             await db.run(`
//                 INSERT INTO points_history (user_id, action, points_earned, task_id, task_title, timestamp)
//                 VALUES (?, ?, ?, ?, ?, ?)
//             `, [userId, "Task Completed", pointsEarned, taskId, title, timestamp]);

//             const leaderboardEntry = await db.get(
//                 `SELECT * FROM leaderboard WHERE user_id = ?`,
//                 [userId]
//             );

//             if (leaderboardEntry) {
//                 // Update leaderboard points
//                 await db.run(
//                     `UPDATE leaderboard SET total_points = total_points + ? WHERE user_id = ?`,
//                     [pointsEarned, userId]
//                 );
//             } else {
//                 // Insert new leaderboard entry
//                 const username = await getUserNameFromUserId(userId);
//                 const level = 1; // Default level
//                 const badges = '';
//                 const achievements = '';

//                 await db.run(`
//                     INSERT INTO leaderboard (user_id, username, total_points, level, badges, achievements)
//                     VALUES (?, ?, ?, ?, ?, ?)
//                 `, [userId, username, pointsEarned, level, badges, achievements]);
//             }
//         }

//         res.status(200).json({ message: 'Task updated successfully' });
//     } catch (error) {
//         console.error('Error updating task:', error);
//         res.status(500).json({ message: 'Error updating task', error });
//     }
// });

module.exports = router;
