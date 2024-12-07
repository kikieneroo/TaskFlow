const jwt = require('jsonwebtoken');

// Route to refresh the token
const refreshAccessToken = (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ message: 'Refresh token is required' });
    }

    // Validate the refresh token
    const query = `SELECT * FROM refresh_tokens WHERE token = ? AND expires_at > DATETIME('now')`;
    db.get(query, [refreshToken], (err, tokenRow) => {
        if (err || !tokenRow) {
            return res.status(401).json({ message: 'Invalid or expired refresh token' });
        }

        // Generate a new access token
        const accessToken = jwt.sign({ id: tokenRow.user_id }, process.env.JWT_SECRET, { expiresIn: '15m' });

        res.json({ accessToken });
    });
};

module.exports = { refreshAccessToken };
