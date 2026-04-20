const sqlite3 = require('sqlite3').verbose();

function initializeDatabase() {
    const db = new sqlite3.Database('./school.db', (err) => {
        if (err) {
            console.error("Database connection error:", err.message);
            return;
        }
        console.log('Connected to the SQLite database.');
        db.run(`CREATE TABLE IF NOT EXISTS students (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT,
            email TEXT,
            program TEXT,
            phone TEXT
        )`, (err) => {
            if (err) {
                console.error("Table creation error:", err.message);
            } else {
                console.log("Students table ready.");
                // Add program column if it doesn't exist
                db.run(`ALTER TABLE students ADD COLUMN program TEXT`, (alterErr) => {
                    if (alterErr && !alterErr.message.includes('duplicate column')) {
                        console.error("Error adding program column:", alterErr.message);
                    }
                });
                // Add phone column if it doesn't exist
                db.run(`ALTER TABLE students ADD COLUMN phone TEXT`, (alterErr) => {
                    if (alterErr && !alterErr.message.includes('duplicate column')) {
                        console.error("Error adding phone column:", alterErr.message);
                    }
                });
            }
        });
    });
    return db;
}

const db = initializeDatabase();
module.exports = db;