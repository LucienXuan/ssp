const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
const session = require('express-session');
const bcrypt = require('bcryptjs');
const express = require('express'); 
const db = require('../database'); 
const app = express(); 
const PORT = 3000; 
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));

app.set('view engine', 'ejs'); 
app.set('views', './views');
app.use(express.urlencoded({ extended: true })); 

// RBAC Middleware - Role-Based Access Control

// Level 1: Must be logged in (Allows Admin, Editor, and Viewer)
function requireAuth(req, res, next) {
    if (req.session.loggedIn) next();
    else res.redirect('/');
}

// Level 2: Edit Permission (Allows Admin and Editor)
function canEdit(req, res, next) {
    if (req.session.loggedIn && (req.session.role === 'admin' || req.session.role === 'editor')) {
        next();
    } else {
        res.redirect('/dashboard');
    }
}

// Level 3: Add & Delete Permissions (Allows Admin ONLY)
function canAddDelete(req, res, next) {
    if (req.session.loggedIn && req.session.role === 'admin') {
        next();
    } else {
        res.redirect('/dashboard');
    }
}

// Gateway Route (With Reverse Bouncer)
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        return res.redirect('/dashboard'); // Skip login if already logged in!
    }
    res.render('index');
});
// Process Login
app.post('/login', (req, res) => {
    const { username, password } = req.body;
    db.get('SELECT * FROM users WHERE username = ?', [username], (err, user) => {
        if (err) return console.error(err.message);
        if (user && bcrypt.compareSync(password, user.password)) {
            req.session.loggedIn = true;
            req.session.username = user.username;
            req.session.role = user.role; // Store the RBAC role
            res.redirect('/dashboard');
        } else {
            res.render('index', { error: 'Invalid username or password!' });
        }
    });
});
// Logout Route
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

app.get('/dashboard', requireAuth, (req, res) => {
    db.all('SELECT * FROM students', [], (err, rows) => {
        if (err) return console.error(err.message);
        res.render('dashboard', {
            students: rows,
            role: req.session.role,
            username: req.session.username
        });
    });
}); 

app.post('/submit', canAddDelete, (req, res) => {
    const submittedName = req.body.studentName;
    const submittedEmail = req.body.studentEmail;
    const submittedProgram = req.body.studentProgram;
    const submittedPhone = req.body.studentPhone; 

    db.run('INSERT INTO students (name, email, program, phone) VALUES (?, ?, ?, ?)', [submittedName, 
    submittedEmail, submittedProgram, submittedPhone], (err) => { 
    if (err) { 
        return console.error(err.message); 
    } 
    console.log(`[SYSTEM] '${req.session.username}' registered a new student: ${submittedName}`);
    res.redirect('/dashboard'); 
    }); 
}); 

app.post('/delete/:id', canAddDelete, (req, res) => {
    const studentId = req.params.id;

    db.run('DELETE FROM students WHERE id = ?', [studentId], (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log(`[SYSTEM] '${req.session.username}' deleted student ID: ${studentId}`);
    res.redirect('/dashboard');
    });
});

app.get('/edit/:id', canEdit, (req, res) => {
    const studentId = req.params.id;

    db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, row) => {
        if (err) return console.error(err.message);
        // DEFENSIVE CHECK: Does this student actually exist in the database?
        if (!row) {
            return res.redirect('/dashboard');
        }
        res.render('edit', {
            student: row,
            role: req.session.role,
            username: req.session.username
        });
    });
});

app.post('/edit/:id', canEdit, (req, res) => {
    const studentId = req.params.id;
    const updatedName = req.body.studentName;
    const updatedEmail = req.body.studentEmail;
    const updatedProgram = req.body.studentProgram;
    const updatedPhone = req.body.studentPhone;

    db.run('UPDATE students SET name = ?, email = ?, program = ?, phone = ? WHERE id = ?', [updatedName, updatedEmail, updatedProgram, updatedPhone, studentId], (err) => {
    if (err) {
        return console.error(err.message);
    }
    console.log(`[SYSTEM] '${req.session.username}' updated the record for student ID: ${studentId}`);
    res.redirect('/dashboard');
    });
});

// Catch-all route for unknown URLs
app.use((req, res) => {
    res.redirect('/dashboard');
});

app.listen(PORT, () => { 
console.log(`Server is successfully running on port ${PORT}`); 
});