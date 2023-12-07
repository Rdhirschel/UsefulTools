const { MongoClient } = require('mongodb');

const password = process.env.MONGODB_PASSWORD;
const mongoClient = new MongoClient(`mongodb+srv://rdhirschel:${password}@cluster0.gt6bpjp.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });

module.exports = async (req, res) => {
    try {
        await mongoClient.connect();

        if (req.method === 'GET') 
        {
            const { shortUrl } = req.query;

            const urlMapping = await mongoClient.db('urlshortener').collection('urlMappings').findOne({ short: shortUrl });

            if (urlMapping) {
                return res.redirect(urlMapping.original);
            } else {
                return res.status(404).json({ error: 'Short URL not found' });
            }
        } 
        
        else if (req.method === 'POST') 
        {
            const { originalUrl, shortUrl } = req.body;

            if (!originalUrl || !shortUrl) {
                return res.status(400).json({ error: 'Missing originalUrl or shortUrl in the request body' });
            }

            const existingMapping = await mongoClient.db('urlshortener').collection('urlMappings').findOne({ short: shortUrl });

            if (existingMapping) {
                return res.status(409).json({ error: 'Short URL already exists' });
            }

            await mongoClient.db('urlshortener').collection('urlMappings').insertOne({ original: originalUrl, short: shortUrl });

            return res.status(201).json({ message: 'Short URL created successfully' });
        } 
        
        else 
        {
            res.status(405).send('Method Not Allowed');
        }
    } 
    catch (error) {
        console.error('Error connecting to the database:', error);
        return res.status(500).json({ error: 'Server error' });
    } finally {
        await mongoClient.close();
    }
};