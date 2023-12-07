const express = require('express');
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json()); 
const port = process.env.PORT || 3000;
const password = process.env.MONGODB_PASSWORD;

// Connect to MongoDB
const mongoClient = new MongoClient(`mongodb+srv://rdhirschel:${password}@cluster0.gt6bpjp.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

async function connectToDatabase() {
    try {
        await mongoClient.connect();
        console.log('Connected to the database');
    } catch (error) {
        console.error('Error connecting to the database:', error);
    }
}

connectToDatabase();

// Endpoint to handle URL redirection
app.get('/urlshortener/:shortUrl', async (req, res) => {
    const { shortUrl } = req.params;

    const urlMapping = await mongoClient.db('urlshortener').collection('urlMappings').findOne({ short: shortUrl });

    if (urlMapping) 
    {
        return res.redirect(urlMapping.original);
    } 
    else 
    {
        return res.status(404).json({ error: 'Short URL not found' });
    }
});

// Endpoint to create a short URL
app.post('/shorten', async (req, res) => {
    const { originalUrl, shortUrl } = req.body; // Extract data from the JSON body

    if (!originalUrl || !shortUrl) {
        return res.status(400).json({ error: 'Missing originalUrl or shortUrl in the request body' });
    }

    // Check if short URL already exists
    const existingMapping = await mongoClient.db('urlshortener').collection('urlMappings').findOne({ short: shortUrl });

    if (existingMapping) {
        return res.status(409).json({ error: 'Short URL already exists' });
    }

    // Insert new URL mapping
    await mongoClient.db('urlshortener').collection('urlMappings').insertOne({ original: originalUrl, short: shortUrl });

    return res.status(201).json({ message: 'Short URL created successfully' });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
