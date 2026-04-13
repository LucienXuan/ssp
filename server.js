const express = require('express');
const app = express();
const PORT = 3000;

app.get('/', (request, response)=>{
    response.send('<h1>Welcome to MILA University!</h1><p>This is something.</p>');
});

app.get('/about', (request, response)=>{
    response.send('<h1>MILA University is a university in Malaysia.</h1><p>MILA University is located in Nilai, Negeri Sembilan.</p>');
});

app.get('/contact', (request, response)=>{
    response.send('<h1>Contact Page</h1><p>Please contact Mr. Adam for any inquiries at adam@milaedu.</p>');
});

app.listen(PORT, ()=> {
    console.log(`Server is successfully running on port ${PORT}`);
});