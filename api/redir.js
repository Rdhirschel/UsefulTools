const { MongoClient } = require('mongodb');

let mongoClient;

async function connectToDatabase() {
  if (mongoClient) {
    return mongoClient;
  } else {
    const password = process.env.MONGODB_PASSWORD;
    mongoClient = new MongoClient(`mongodb+srv://rdhirschel:${password}@cluster0.gt6bp.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    return mongoClient;
  }
}

module.exports = async (req, res) => {
  try {
    const mongoClient = await connectToDatabase();
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
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};