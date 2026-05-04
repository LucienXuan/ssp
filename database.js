const bcrypt = require('bcryptjs');

const sqlite3 = require('sqlite3').verbose();

function initializeDatabase() {
    const db = new sqlite3.Database('./school.db', (err) => {
        if (err) {
            console.error("Database connection error:", err.message);
            return;
        }
        console.log('Connected to the SQLite database.');
        db.serialize(() => {
            // Create Students Table
            db.run(`CREATE TABLE IF NOT EXISTS students (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                name TEXT,
                email TEXT,
                program TEXT,
                phone TEXT
            )`);
            // Create Users Table for Authentication
            db.run(`CREATE TABLE IF NOT EXISTS users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT UNIQUE,
                password TEXT,
                role TEXT
            )`);
            // Inject 3 different users with 3 different roles (Password is 'pass123')
            const passHash = bcrypt.hashSync('pass123', 10);
            db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('admin', ?, 'admin')`, [passHash]);
            db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('editor', ?, 'editor')`, [passHash]);
            db.run(`INSERT OR IGNORE INTO users (username, password, role) VALUES ('viewer', ?, 'viewer')`, [passHash]);
        });
    });
    return db;
}

const db = initializeDatabase();
module.exports = db;