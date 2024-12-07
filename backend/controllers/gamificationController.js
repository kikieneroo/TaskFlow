const db = require('../database'); // Import SQLite instance

// // Function to update points and leaderboard
// const updatePoints = async (req, res) => {
//     const { user_id, action, points_earned, task_id, task_title, timestamp } = req.body;

//     if (!user_id) {
//         return res.status(400).json({ message: 'user_id is required' });
//     }

//     try {
//         // Step 1: Insert points history
//         await db.run(`
//             INSERT INTO points_history (user_id, action, points_earned, task_id, task_title, timestamp)
//             VALUES (?, ?, ?, ?, ?, ?)
//         `, [user_id, action, points_earned, task_id, task_title, timestamp]);

//         // Step 2: Update or insert into leaderboard
//         const existingUser = await db.get(`SELECT username FROM leaderboard WHERE user_id = ?`, [user_id]);
//         console.log('Existing User in Leaderboard:', existingUser);

//         if (existingUser) {
//             await db.run(`
//                 UPDATE leaderboard SET total_points = total_points + ?
//                 WHERE user_id = ?
//             `, [points_earned, user_id]);
//         } else {
//             // Fetch the username from the `users` table
//             const user_name = await getUserNameFromUserId(user_id);
//             console.log('Fetched Username:', user_name);

//             if (!user_name) {
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             const level = 1; // Default starting level
//             const badges = ''; // No badges initially
//             const achievements = ''; // No achievements initially

//             await db.run(`
//                 INSERT INTO leaderboard (user_id, username, total_points, level, badges, achievements)
//                 VALUES (?, ?, ?, ?, ?, ?)
//             `, [user_id, user_name, points_earned, level, badges, achievements]);
//         }

//         res.status(200).json({ message: 'Points updated successfully' });
//     } catch (err) {
//         console.error('Error updating points:', err);
//         res.status(500).json({ message: 'Error updating points', error: err });
//     }
// };



// const updatePoints = async (req, res) => {
//     const { user_id, action, points_earned, task_id, task_title, timestamp } = req.body;

//     if (!user_id) {
//         console.log('Missing user_id in request:', req.body);
//         return res.status(400).json({ message: 'user_id is required' });
//     }

//     try {
//         // Step 1: Insert points history
//         await db.run(`
//             INSERT INTO points_history (user_id, action, points_earned, task_id, task_title, timestamp)
//             VALUES (?, ?, ?, ?, ?, ?)
//         `, [user_id, action, points_earned, task_id, task_title, timestamp]);

//         // Step 2: Update or insert into leaderboard
//         const existingUser = await db.get(`SELECT username FROM leaderboard WHERE user_id = ?`, [user_id]);
//         console.log('Existing User in Leaderboard:', existingUser);

//         if (!existingUser || !existingUser.username) {
//             const user = await db.get(`SELECT name FROM users WHERE id = ?`, [user_id]);
//             console.log('Result from users table:', user);

//             const user_name = user ? user.name : null;
//             if (!user_name) {
//                 console.log('User not found for user_id:', user_id);
//                 return res.status(404).json({ message: 'User not found' });
//             }

//             const level = 1;
//             const badges = '';
//             const achievements = '';

//             await db.run(`
//                 INSERT INTO leaderboard (user_id, username, total_points, level, badges, achievements)
//                 VALUES (?, ?, ?, ?, ?, ?)
//             `, [user_id, user_name, points_earned, level, badges, achievements]);
//         } else {
//             await db.run(`
//                 UPDATE leaderboard SET total_points = total_points + ?
//                 WHERE user_id = ?
//             `, [points_earned, user_id]);
//         }

//         res.status(200).json({ message: 'Points updated successfully' });
//     } catch (err) {
//         console.error('Error updating points:', err);
//         res.status(500).json({ message: 'Error updating points', error: err });
//     }
// };



const updatePoints = async (req, res) => {
    const { user_id, action, points_earned, task_id, task_title, timestamp } = req.body;

    try {
        // Insert into points_history table
        await db.run(
            `INSERT INTO points_history (user_id, action, points_earned, task_id, task_title, timestamp)
            VALUES (?, ?, ?, ?, ?, ?)`,
            [user_id, action, points_earned, task_id, task_title, timestamp]
        );
        
        res.status(200).json({ message: 'Points history updated successfully!' });
    } catch (err) {
        console.error('Error inserting points history:', err);
        res.status(500).json({ message: 'Error inserting points history', error: err.message });
    }
};


const updateLeaderboard = async (req, res) => {
    const { points_earned, task_id, task_title, timestamp } = req.body;
    user_id=3


    //MANUAL INSERTION
    // await db.run(
    //     `INSERT INTO leaderboard (user_id, username, total_points, level, badges, achievements)
    //     VALUES (?, ?, ?, ?, ?, ?)`,
    //     [3, 'Mark', points_earned, 1, '', '']
    // );


    try {
        // Check if user exists in the leaderboard
        const leaderboardEntry = await db.get('SELECT * FROM leaderboard WHERE user_id = ?', [user_id]);

        if (leaderboardEntry) {
            // Update existing leaderboard entry
            await db.run(
                `UPDATE leaderboard SET total_points = total_points + ? WHERE user_id = ?`,
                [points_earned, user_id]
            );
        } else {
            // Insert a new leaderboard entry
            const user = await db.get('SELECT name FROM users WHERE id = ?', [user_id]);

            if (!user) {
                return res.status(404).json({ message: 'User not found' });
            }

            await db.run(
                `INSERT INTO leaderboard (user_id, username, total_points, level, badges, achievements)
                VALUES (?, ?, ?, ?, ?, ?)`,
                [user_id, 'Mark', points_earned, 1, '', '']         //***** Manually */
            );
        }

        res.status(200).json({ message: 'Leaderboard updated successfully!' });
    } catch (err) {
        console.error('Error updating leaderboard:', err);
        res.status(500).json({ message: 'Error updating leaderboard', error: err.message });
    }
};


// Function to fetch leaderboard
const getLeaderboard = async (req, res) => {
    try {
        const leaderboard = await db.all(`
            SELECT user_id, username, total_points, level, badges, achievements
            FROM leaderboard
            ORDER BY total_points DESC
        `);

        res.status(200).json(leaderboard);
    } catch (err) {
        console.error(error);
        res.status(500).json({ message: 'Error fetching leaderboard', error: err });
    }
};


// Function to fetch Points History
const getPointsHistory = async (req, res) => {
    try {
        const pointsHistory = await db.all(`
            SELECT user_id, action, points_earned, task_id, task_title, timestamp
            FROM points_history
            ORDER BY id DESC
        `);

        res.status(200).json(pointsHistory);
    } catch (err) {
        res.status(500).json({ message: 'Error fetching Point History', error: err });
    }
};

// Helper function to retrieve the name of the user from the database
const getUserNameFromUserId = async (user_id) => {
    try {
        const user = await db.get(`SELECT name FROM users WHERE id = ?`, [user_id]);
        return user ? user.name : null;
    } catch (error) {
        console.error('Error retrieving username:', error);
        throw error;
    }
};


module.exports = { updatePoints, getLeaderboard, getUserNameFromUserId, getPointsHistory, updateLeaderboard };
