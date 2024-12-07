const db = require('../database');

const createTask = (req, res) => {
    const { title, description, status, assigned_to } = req.body;
    const created_by = req.user.id; // Provided by the authentication middleware

    const query = `
        INSERT INTO tasks (title, description, status, assigned_to, created_by)
        VALUES (?, ?, ?, ?, ?)
    `;

    db.run(query, [title, description, status, assigned_to, created_by], function (err) {
        if (err) {
            res.status(500).json({ message: 'Task creation failed', error: err });
        } else {
            res.status(201).json({ message: 'Task created successfully', id: this.lastID });
        }
    });
};

const getTasks = (req, res) => {
    const userId = req.userId; // Retrieved from the authentication middleware
    const userRole = req.user.role; // Retrieved from the authentication middleware

    let query;
    let params = [];

    if (userRole === 'admin') {
        // Admin can view all tasks
        query = `
            SELECT t.*, u.name AS assigned_to_name
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.id
        `;
    } else {
        // Regular users can only view tasks assigned to them
        query = `
            SELECT t.*, u.name AS assigned_to_name
            FROM tasks t
            LEFT JOIN users u ON t.assigned_to = u.id
            WHERE t.assigned_to = ?
        `;
        params = [userId];
    }

    db.all(query, params, (err, tasks) => {
        if (err) {
            res.status(500).json({ message: 'Error retrieving tasks', error: err });
        } else {
            res.json(tasks);
        }
    });
};

// const updateTask = (req, res) => {
//     const { title, description, status, assigned_to, progress_note } = req.body;
//     const { id } = req.params;

//     const query = `
//         UPDATE tasks
//         SET title = ?, description = ?, status = ?, assigned_to = ?, progress_note = ?
//         WHERE id = ?
//     `;

//     db.run(query, [title, description, status, assigned_to, progress_note, id], function (err) {
//         if (err) {
//             res.status(500).json({ message: 'Failed to update task', error: err });
//         } else {
//             res.json({ message: 'Task updated successfully' });
//         }
//     });
// };


const updateTask = (req, res) => {
    const { title, description, status, assigned_to, progress_note } = req.body;
    const { id } = req.params;

    if (!id) {
        return res.status(400).json({ message: 'Task ID is required' });
    }

    const fields = [];
    const values = [];

    if (title) {
        fields.push('title = ?');
        values.push(title);
    }
    if (description) {
        fields.push('description = ?');
        values.push(description);
    }
    if (status) {
        fields.push('status = ?');
        values.push(status);
    }
    if (assigned_to) {
        fields.push('assigned_to = ?');
        values.push(assigned_to);
    }
    if (progress_note) {
        fields.push('progress_note = ?');
        values.push(progress_note);
    }

    if (fields.length === 0) {
        return res.status(400).json({ message: 'No fields provided to update' });
    }

    const query = `UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`;
    values.push(id);

    db.run(query, values, function (err) {
        if (err) {
            console.error('Database error:', err); // Log for debugging
            res.status(500).json({ message: 'Failed to update task' });
        } else if (this.changes === 0) {
            res.status(404).json({ message: 'Task not found' });
        } else {
            res.json({ message: 'Task updated successfully' });
        }
    });
};



const deleteTask = (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM tasks WHERE id = ?`;

    db.run(query, [id], function (err) {
        if (err) {
            res.status(500).json({ message: 'Failed to delete task', error: err });
        } else {
            res.json({ message: 'Task deleted successfully' });
        }
    });
};

// // Complete a task (with gamification logic)
// const completeTask = (req, res) => {
//     const { taskId } = req.body;
//     const userId = req.user.id; // Provided by authentication middleware

//     db.serialize(() => {
//         // Mark the task as completed
//         db.run(
//             `UPDATE tasks SET status = 'Completed' WHERE id = ? AND assigned_to = ?`,
//             [taskId, userId],
//             function (err) {
//                 if (err) {
//                     return res.status(500).json({ message: 'Error completing task.', error: err });
//                 }

//                 // Increment user points
//                 db.run(
//                     `UPDATE points SET points = points + 10 WHERE userId = ?`,
//                     [userId],
//                     function (err) {
//                         if (err) {
//                             return res.status(500).json({ message: 'Error updating points.', error: err });
//                         }

//                         // Check if a badge should be awarded
//                         db.get(
//                             `SELECT points FROM points WHERE userId = ?`,
//                             [userId],
//                             (err, row) => {
//                                 if (err) {
//                                     return res.status(500).json({ message: 'Error fetching points.', error: err });
//                                 }

//                                 if (row.points >= 50) {
//                                     db.run(
//                                         `INSERT INTO badges (userId, badge) VALUES (?, 'Task Master') ON CONFLICT DO NOTHING`,
//                                         [userId],
//                                         function (err) {
//                                             if (err) {
//                                                 return res
//                                                     .status(500)
//                                                     .json({ message: 'Error awarding badge.', error: err });
//                                             }
//                                             res.json({
//                                                 message: 'Task completed, points and badge updated!',
//                                             });
//                                         }
//                                     );
//                                 } else {
//                                     res.json({ message: 'Task completed, points updated!' });
//                                 }
//                             }
//                         );
//                     }
//                 );
//             }
//         );
//     });
// };

// // Get leaderboard (top 10 users by points)
// const getLeaderboard = (req, res) => {
//     db.all(
//         `SELECT u.name, p.points 
//          FROM users u
//          JOIN points p ON u.id = p.userId
//          ORDER BY p.points DESC
//          LIMIT 10`,
//         [],
//         (err, rows) => {
//             if (err) {
//                 res.status(500).json({ message: 'Error retrieving leaderboard.', error: err });
//             } else {
//                 res.json(rows);
//             }
//         }
//     );
// };

module.exports = { 
    createTask,
    getTasks,
    updateTask,
    deleteTask,
    // completeTask,
    // getLeaderboard,
};

