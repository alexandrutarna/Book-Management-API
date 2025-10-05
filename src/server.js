const express = require('express');

const app = express();

// the port the server will listen on, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;


app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Book Management API' });
});

app.post('/', (req, res) => {
    res.json({ message: 'Data received', data: req.body });
    console.log('Received:', req.body);
    res.json({
        message: 'got the message',
        data: req.body
    })
});

// start the server and listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
