const express = require('express');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(cors()); 

app.options('*', cors()); 

app.post('/createFile', (req, res) => {
    const { filePath, content } = req.body;

    if (!filePath || !content) {
        return res.status(400).json({ error: 'Missing filePath or content in the request body' });
    }

    try {
        // Create the file
        fs.writeFileSync(filePath, content);
        res.status(200).json({ message: 'File created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
