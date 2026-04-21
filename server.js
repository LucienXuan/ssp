const express = require('express'); 
const db = require('./database'); 
const app = express(); 
const PORT = 3000; 

app.set('view engine', 'ejs'); 
app.use(express.urlencoded({ extended: true })); 

app.get('/', (req, res) => { 
db.all('SELECT * FROM students', [], (err, rows) => { 
if (err) { 
return console.error(err.message); 
} 
res.render('index', { students: rows }); 
}); 
}); 

app.post('/submit', (req, res) => { 
const submittedName = req.body.studentName; 
const submittedEmail = req.body.studentEmail; 
const submittedProgram = req.body.studentProgram; 
const submittedPhone = req.body.studentPhone; 

db.run('INSERT INTO students (name, email, program, phone) VALUES (?, ?, ?, ?)', [submittedName, 
submittedEmail, submittedProgram, submittedPhone], (err) => { 
if (err) { 
return console.error(err.message); 
} 
res.redirect('/'); 
}); 
}); 

app.post('/delete/:id', (req, res) => {
const studentId = req.params.id;

db.run('DELETE FROM students WHERE id = ?', [studentId], (err) => {
if (err) {
return console.error(err.message);
}
res.redirect('/');
});
});

app.get('/edit/:id', (req, res) => {
const studentId = req.params.id;

db.get('SELECT * FROM students WHERE id = ?', [studentId], (err, row) => {
if (err) {
return console.error(err.message);
}
res.render('edit', { student: row });
});
});

app.post('/edit/:id', (req, res) => {
const studentId = req.params.id;
const updatedName = req.body.studentName;
const updatedEmail = req.body.studentEmail;
const updatedProgram = req.body.studentProgram;
const updatedPhone = req.body.studentPhone;

db.run('UPDATE students SET name = ?, email = ?, program = ?, phone = ? WHERE id = ?', [updatedName, updatedEmail, updatedProgram, updatedPhone, studentId], (err) => {
if (err) {
return console.error(err.message);
}
res.redirect('/');
});
});

app.listen(PORT, () => { 
console.log(`Server is successfully running on port ${PORT}`); 
});