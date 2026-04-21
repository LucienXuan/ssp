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
            email TEXT
        )`, (err) => {
            if (err) {
                console.error("Table creation error:", err.message);
            } else {
                console.log("Students table ready.");
            }
        });
    });
    return db;
}

const db = initializeDatabase();
module.exports = db;