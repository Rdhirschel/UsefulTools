const { MongoClient } = require('mongodb');

let mongoClient;

async function connectToDatabase() 
{
  if (mongoClient) 
  {
    return mongoClient;
  } 
  
  else 
  {
    const password = process.env.MONGODB_PASSWORD;
    mongoClient = new MongoClient(`mongodb+srv://rdhirschel:${password}@cluster0.gt6bpjp.mongodb.net/`, { useNewUrlParser: true, useUnifiedTopology: true });
    //await mongoClient.connect();
    return mongoClient;
  }
}

module.exports = async (req, res) => {
  try {
    const mongoClient = await connectToDatabase();
    const { shortUrl } = req.query;

    const urlMapping = await mongoClient.db('urlshortener').collection('urlMappings').findOne({ short: shortUrl });

    if (urlMapping) {
      return res.redirect(urlMapping.original);
    } else {
      return res.status(404).json({ error: 'Short URL not found' });
    }
  } catch (error) {
    console.error('Error connecting to the database:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};