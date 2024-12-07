const db = require('../database');

const updateLeaderboard = (userId, username, pointsEarned) => {
    db.serialize(() => {
        db.run(
            `
            INSERT INTO leaderboard (user_id, username, points)
            VALUES (?, ?, ?)
            ON CONFLICT(user_id)
            DO UPDATE SET points = points + ?;
            `,
            [userId, username, pointsEarned, pointsEarned],
            (err) => {
                if (err) {
                    console.error('Error updating leaderboard:', err.message);
                }
            }
        );
    });
};

module.exports = { updateLeaderboard };
