const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (request, response) => {
    response.send('<h1>Hello There!</h1> <br>Welcome to the real world!');
});

app.listen(PORT, () => {
    console.log (`Server is sucessfully running on port ${PORT}`);
});

//server should be stopped if any changes wish to make, but nodemon 
//allows real time changes
// click Ctrl+C to stop the server