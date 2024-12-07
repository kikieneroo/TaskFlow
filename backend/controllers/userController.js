const db = require('../database');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Helper to generate a refresh token
const generateRefreshToken = (userId) => {
    const refreshToken = require('crypto').randomBytes(40).toString('hex'); // Secure random token
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 7); // Refresh token valid for 7 days

    const query = `INSERT INTO refresh_tokens (token, user_id, expires_at) VALUES (?, ?, ?)`;
    db.run(query, [refreshToken, userId, expiresAt], (err) => {
        if (err) {
            console.error("Error saving refresh token:", err.message);
        }
    });

    return refreshToken;
};

// Register user
const registerUser = (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
    db.run(query, [name, email, hashedPassword, role], function (err) {
        if (err) {
            res.status(500).json({ message: 'Registration failed', error: err });
        } else {
            res.status(201).json({ message: 'User registered successfully', id: this.lastID });
        }
    });
};

// Login function with access and refresh tokens
const loginUser = (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;

    db.get(query, [email], async (err, user) => {
        if (err) {
            console.error('Error querying User:', err.message);
            return res.status(500).json({ error: 'Failed to login' });
        }

        if (!user) {
            return res.status(404).json({ error: 'Email not found' });
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate tokens
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '15m' } // Access token valid for 15 minutes
        );

        const refreshToken = generateRefreshToken(user.id);

        res.status(200).json({
            message: 'Login successful',
            accessToken,
            refreshToken,
        });
    });
};

module.exports = { registerUser, loginUser, generateRefreshToken};
