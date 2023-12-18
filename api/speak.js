const { exec } = require('child_process');
const fs = require('fs').promises;
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
        const db = mongoClient.db('textToSpeech');
        const collection = db.collection('audioFiles');

        let { textInput } = req.query.body;

        // Check if the audio file already exists
        const existingFile = await collection.findOne({ text: textInput });
        if (existingFile) {
            return res.download(existingFile.path);
        }

        const path = `audioFiles/${textInput.replace(/\s+/g, '_')}.mp3`;
        exec(`espeak -w ${path} "${textInput}"`, (error) => {
            if (error) {
                console.error('Error:', error, 'oopsie1');
                return res.status(500).json({ error: 'Server error' });
            }
            // Save the audio file in the database
            collection.insertOne({ text: textInput, path: path });
            res.download(path);

        });
    } catch (error) {
        console.error('Error:', error, 'oopsie2');
        res.status(500).json({ error: 'Server error' });
    }
};
