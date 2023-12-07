const express = require('express');
const http = require('http');
const fs = require('fs');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const WebSocket = require('ws');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

const port = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(cors());

app.options('*', cors());

app.post('/createFile', (req, res) => {
    const { filePath, content } = req.body;

    if (!filePath || !content) {
        return res.status(400).json({ error: 'Missing filePath or content in the request body' });
    }

    const fullPath = path.resolve(__dirname, 'public', filePath);
    console.log('Full Path:', fullPath);

    try {
        fs.writeFileSync(fullPath, content);
        res.status(200).json({ message: 'File created successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }

    // Notify connected clients about the file creation
    wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify({ event: 'fileCreated', filePath }));
        }
    });
});

// Serve static files from the 'public' directory
app.use(express.static('public'));

// WebSocket connection handling
wss.on('connection', (ws) => {
    console.log('WebSocket connection established');

    // Handle messages from clients if needed
    ws.on('message', (message) => {
        console.log('Received message:', message);
    });
});

server.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
