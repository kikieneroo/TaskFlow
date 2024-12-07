const express = require('express');
const { registerUser, loginUser, generateRefreshToken } = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const bcrypt = require('bcryptjs');
const sqlite3 = require('sqlite3').verbose();
const jwt = require('jsonwebtoken');
const router = express.Router();

const db = new sqlite3.Database(process.env.DATABASE_PATH);

// Register Route
router.post('/register', (req, res) => {
    const { name, email, password, role } = req.body;
    const hashedPassword = bcrypt.hashSync(password, 10);

    if (!name || !email || !password || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    // Check if the user already exists
    const checkQuery = `SELECT * FROM users WHERE email = ?`;
    db.get(checkQuery, [email], (err, user) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }

        if (user) {
            return res.status(400).json({ message: 'User already registered' });
        }

        // Insert the new user
        const query = `INSERT INTO users (name, email, password, role) VALUES (?, ?, ?, ?)`;
        db.run(query, [name, email, hashedPassword, role], function (err) {
            if (err) {
                console.error('Error inserting into database:', err.message);
                return res.status(500).json({ error: 'Failed to register user' });
            }
            res.status(201).json({ message: 'User registered successfully!', userId: this.lastID });
        });
    });
});

// Login Route
// Login Route
router.post('/login', (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }

    const query = `SELECT * FROM users WHERE email = ?`;
    db.get(query, [email], async (err, user) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Database error' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Validate the password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(400).json({ error: 'Invalid password' });
        }

        // Generate access and refresh tokens
        const accessToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '60m' }
        );

        const refreshToken = jwt.sign(
            { id: user.id, role: user.role },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '7d' }
        );

        // Save tokens to the database
        const updateQuery = `UPDATE users SET access_token = ?, refresh_token = ? WHERE id = ?`;
        db.run(updateQuery, [accessToken, refreshToken, user.id], (updateErr) => {
            if (updateErr) {
                console.error('Error saving tokens:', updateErr.message);
                return res.status(500).json({ error: 'Failed to save tokens' });
            }

            // Send the tokens, role, and user ID in the response
            res.status(200).json({
                message: 'Login successful',
                accessToken: accessToken,
                refreshToken: refreshToken,
                role: user.role,
                userId: user.id // Include user ID
            });
        });
    });
});



//Access Token Revocation
//When a user logs out, invalidate the access token by removing it from the database or marking it as revoked.
router.post('/logout', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }

    const query = `UPDATE users SET access_token = NULL WHERE refresh_token = ?`;
    db.run(query, [refreshToken], (err) => {
        if (err) {
            console.error('Error during logout:', err.message);
            return res.status(500).json({ error: 'Failed to log out' });
        }

        res.status(200).json({ message: 'Logged out successfully' });
    });
});


//Using the Refresh TokenEndpoint to Issue a New Access Token Create a /token 
//route where a user can send their refresh token to get a new access token:

router.post('/token', (req, res) => {
    const { refreshToken } = req.body;

    if (!refreshToken) {
        return res.status(400).json({ error: 'Refresh token is required' });
    }

    // Verify if the refresh token exists in the database
    const query = `SELECT * FROM users WHERE refresh_token = ?`;
    db.get(query, [refreshToken], (err, user) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Internal server error' });
        }

        if (!user) {
            return res.status(403).json({ error: 'Invalid refresh token' });
        }

        // Verify the token
        jwt.verify(refreshToken, process.env.JWT_SECRET, (verifyErr, decoded) => {
            if (verifyErr) {
                return res.status(403).json({ error: 'Invalid refresh token' });
            }

            // Generate a new access token
            const accessToken = jwt.sign(
                { id: user.id, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '1h' }
            );

            res.status(200).json({
                accessToken: accessToken
            });
        });
    });
});


// Get All Users (Admin Only)
router.get('/users', authenticateToken, authorizeRole('admin'), (req, res) => {
    const query = `SELECT id, name, email, role FROM users`;

    db.all(query, [], (err, rows) => {
        if (err) {
            console.error('Error fetching users:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve users' });
        }

        res.status(200).json({ users: rows });
    });
});

// Update User (Admin Only)
router.put('/users/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const { id } = req.params;
    const { name, email, role } = req.body;

    if (!name || !email || !role) {
        return res.status(400).json({ error: 'All fields are required' });
    }

    const query = `UPDATE users SET name = ?, email = ?, role = ? WHERE id = ?`;
    db.run(query, [name, email, role, id], function (err) {
        if (err) {
            console.error('Error updating user:', err.message);
            return res.status(500).json({ error: 'Failed to update user' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User updated successfully' });
    });
});

router.delete('/users/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const { id } = req.params;

    const query = `DELETE FROM users WHERE id = ?`;
    db.run(query, [id], function (err) {
        if (err) {
            console.error('Error deleting user:', err.message);
            return res.status(500).json({ error: 'Failed to delete user' });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ message: 'User deleted successfully' });
    });
});

// Get Single User (Admin Only)
router.get('/users/:id', authenticateToken, authorizeRole('admin'), (req, res) => {
    const { id } = req.params;

    const query = `SELECT id, name, email, role FROM users WHERE id = ?`;
    db.get(query, [id], (err, user) => {
        if (err) {
            console.error('Error fetching user:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve user' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    });
});

// Example Protected Route for Regular Users
router.get('/profile', authenticateToken, (req, res) => {
    const query = `SELECT id, name, email, role FROM users WHERE id = ?`;

    db.get(query, [req.user.id], (err, user) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ error: 'Failed to retrieve user profile' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json({ user });
    });
});


module.exports = router;
