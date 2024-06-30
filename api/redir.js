const { MongoClient } = require('mongodb');

let mongoClient;
const password = process.env.MONGODB_PASSWORD;

async function connectToDatabase() {
  if (mongoClient) {
    return mongoClient;
  } else {
    mongoClient = new MongoClient(`mongodb+srv://rdhirschel:${password}@cluster0.gt6bpjp.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    return mongoClient;
  }
}

module.exports = async (req, res) => {
  try {
    const mongoClient = await connectToDatabase();
    let { originalUrl, shortUrl } = req.body;

    if (!originalUrl) {
      return res.status(400).json({ error: 'Missing originalUrl or shortUrl in the request body' });
    }

    let existingMapping;
    const urlMapping = await mongoClient.db('urlshortener').collection('urlMappings').findOne({ original: originalUrl});
    if (urlMapping) {
      return res.status(200).json({ message: 'Short URL already exists', shortUrl: urlMapping.short });
    }
    if (!shortUrl) 
    {
      do 
      {
        shortUrl = Math.random().toString(36).substr(2, 6); //Generate a random string as id
        existingMapping = await mongoClient.db('urlshortener').collection('urlMappings').findOne({ short: shortUrl });
      } while (existingMapping);
    } 
    
    else 
    {
      existingMapping = await mongoClient.db('urlshortener').collection('urlMappings').findOne({ short: shortUrl });
      if (existingMapping) 
      {
        return res.status(409).json({ error: 'Short URL already exists' });
      }
    }

    await mongoClient.db('urlshortener').collection('urlMappings').insertOne({ original: originalUrl, short: shortUrl });
    return res.status(201).json({ message: 'Short URL created successfully', shortUrl: shortUrl });
  } 
  
  catch (error) 
  {
    console.error('Error connecting to the database:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};