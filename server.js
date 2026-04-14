const express = require('express');
const app = express();
const PORT = 3000;

app.set('view engine', 'ejs');
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.render('index');
});

app.post('/submit', (req, res) => {
  const submittedName = req.body.studentName;
  const submittedEmail = req.body.studentEmail;
  const submittedID = req.body.studentID;
  const submittedProgram = req.body.program;

  res.render('success', {
    name: submittedName,
    email: submittedEmail,
    studentID: submittedID,
    program: submittedProgram
  });
});

app.listen(PORT, () => {
  console.log(`Server is successfully running on port ${PORT}`);
});