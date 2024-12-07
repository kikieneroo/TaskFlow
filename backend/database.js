const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const db = new sqlite3.Database(process.env.DATABASE_PATH, (err) => {
    if (err) {
        console.error('Error connecting to database:', err);
    } else {
        console.log('Connected to SQLite database.');
    }
});

module.exports = db;

db.serialize(() => {
    // Users Table
    db.run(`
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT UNIQUE NOT NULL,
            password TEXT NOT NULL,
            role TEXT NOT NULL,
            access_token TEXT,
            refresh_token TEXT
        )
    `);

    // Tasks Table
    db.run(`
        CREATE TABLE IF NOT EXISTS tasks (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            title TEXT NOT NULL,
            description TEXT,
            status TEXT NOT NULL,
            progress_note TEXT,
            assigned_to INTEGER,
            created_by INTEGER,
            FOREIGN KEY (assigned_to) REFERENCES users (id),
            FOREIGN KEY (created_by) REFERENCES users (id)
        )
    `);

    // Refresh Tokens Table
    db.run(`
        CREATE TABLE IF NOT EXISTS refresh_tokens (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            token TEXT NOT NULL,
            user_id INTEGER,
            expires_at DATETIME,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // User Points Table
    db.run(`
        CREATE TABLE IF NOT EXISTS user_points (
            user_id INTEGER PRIMARY KEY, 
            points INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            achievements TEXT,
            FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Admin Badges Table
    db.run(`
        CREATE TABLE IF NOT EXISTS admin_badges (
            admin_id INTEGER PRIMARY KEY,
            badges TEXT,
            milestones_reached INTEGER DEFAULT 0,
            FOREIGN KEY (admin_id) REFERENCES users (id)
        )
    `);

    db.run(`
        CREATE TABLE IF NOT EXISTS badges (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        badge_name TEXT NOT NULL,
        description TEXT,
        awarded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Leaderboard Table
    db.run(`
        CREATE TABLE IF NOT EXISTS leaderboard (
            id INTEGER PRIMARY KEY AUTOINCREMENT, 
            user_id INTEGER UNIQUE, -- Ensures uniqueness for user_id but not a primary key
            username TEXT,
            total_points INTEGER DEFAULT 0,
            level INTEGER DEFAULT 1,
            badges TEXT DEFAULT '[]', -- Stores badges as a serialized JSON array
            achievements TEXT DEFAULT '[]' -- Stores unlocked achievements as a serialized JSON array
        )
    `);
    
    // Point History Table
    db.run(`
        CREATE TABLE IF NOT EXISTS points_history (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER NOT NULL,
        action TEXT NOT NULL, -- Description of the action (e.g., "Task Completed")
        points_earned INTEGER NOT NULL,
        task_id INTEGER, -- ID of the completed task (optional)
        task_title TEXT, -- Title of the completed task (optional)
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES leaderboard (user_id)
        )
    `);


    // Points Table
    db.run(`
        CREATE TABLE IF NOT EXISTS points (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER,
            task_id INTEGER,
            points_earned INTEGER NOT NULL,
            activity TEXT NOT NULL,
            timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES users (id),
            FOREIGN KEY (task_id) REFERENCES tasks (id)
        )
    `);

    // Achievements Table
    db.run(`
        CREATE TABLE IF NOT EXISTS achievements (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        user_id INTEGER,
        achievement_name TEXT NOT NULL,
        description TEXT,
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users (id)
        )
    `);

    // Gamification Settings Table
    db.run(`
        CREATE TABLE IF NOT EXISTS gamification_settings (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        key TEXT NOT NULL UNIQUE,
        value TEXT NOT NULL
        )
    `);

    
});
