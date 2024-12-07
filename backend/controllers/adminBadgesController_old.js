const db = require('../database');

const updateAdminBadges = (adminId, newBadge) => {
    db.serialize(() => {
        db.run(
            `
            UPDATE admin_badges
            SET badges = badges || ',' || ?, milestones_reached = milestones_reached + 1
            WHERE admin_id = ?;
            `,
            [newBadge, adminId],
            (err) => {
                if (err) {
                    console.error('Error updating admin badges:', err.message);
                }
            }
        );
    });
};

module.exports = { updateAdminBadges };
