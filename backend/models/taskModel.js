const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database connection
const dbPath = path.resolve(__dirname, '../database/taskflow.db');
const db = new sqlite3.Database(dbPath);

// Fetch all tasks
const getTasks = () => {
    return new Promise((resolve, reject) => {
        const query = 'SELECT * FROM tasks';
        db.all(query, [], (err, rows) => {
            if (err) {
                reject(err);
            } else {
                resolve(rows);
            }
        });
    });
};

// Export methods
module.exports = { getTasks };
