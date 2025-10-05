const express = require('express');

const app = express();

// the port the server will listen on, defaulting to 3000 if not specified in environment variables
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.json({ message: 'Welcome to the Book Management API' });
});

// start the server and listen for requests on the specified port
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
