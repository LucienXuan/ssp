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
app.listen(PORT, () => { 
console.log(`Server is successfully running on port ${PORT}`); 
});