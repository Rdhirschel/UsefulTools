const { exec } = require('child_process');
const fs = require('fs').promises;
const { MongoClient } = require('mongodb');

let mongoClient;
const password = process.env.MONGODB_PASSWORD;
async function connectToDatabase() 
{
  if (mongoClient) 
  {
    return mongoClient;
  } 
  
  else 
  {
    mongoClient = new MongoClient(`mongodb+srv://rdhirschel:${password}@cluster0.gt6bpjp.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    return mongoClient;
  }
}

module.exports = async (req, res) => {
    try {
        const mongoClient = await connectToDatabase();
        const db = mongoClient.db('textToSpeech');
        const collection = db.collection('audioFiles');

        let {text} = req.query.body;

        // Check if the audio file already exists
        const existingFile = await collection.findOne({ text: text });
        if (existingFile) {
            return res.download(existingFile.path);
        }

        const path = `audioFiles/${text.replace(/\s+/g, '_')}.mp3`;
        exec(`espeak -w ${path} "${text}"`, (error) => {
            if (error) {
                console.error('Error:', error);
                return res.status(500).json({ error: 'Server error' });
            }
            // Save the audio file in the database
            collection.insertOne({ text: text, path: path });
            res.download(path);

        });
    } catch (error) {
        console.error('Error:', error);
        res.status(500).json({ error: 'Server error' });
    }
};
