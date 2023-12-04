const express = require('express');
const app = express();
const port = 3000;

let urlMap = {};

app.use(express.json());

app.post('/shorten', (req, res) => {
    const url = req.body.url;
    const id = generateUniqueId();
    urlMap[id] = url;
    res.send({ id });
});

app.get('/:id', (req, res) => {
    const url = urlMap[req.params.id];
    if (url) {
        res.redirect(url);
    } else {
        res.status(404).send('URL not found');
    }
});

app.listen(port, () => {
    console.log(`URL shortener listening at http://localhost:${port}`);
});

function generateUniqueId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const length = 5;
    let uniqueId = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        uniqueId += characters.charAt(randomIndex);
    }

    return uniqueId;
}