const express = require('express');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');

const app = express();
const port = process.env.PORT || 3000;
let mongoClient;
const password = process.env.MONGODB_PASSWORD;
const ServerUrl = 'https://toolzz.vercel.app';

async function connectToDatabase() {
  if (mongoClient) {
    return mongoClient;
  } else {
    mongoClient = new MongoClient(`mongodb+srv://rdhirschel:${password}@cluster0.gt6bpjp.mongodb.net/?retryWrites=true&w=majority`, { useNewUrlParser: true, useUnifiedTopology: true });
    await mongoClient.connect();
    return mongoClient;
  }
}
app.use(express.json());

app.post('/api/speak', async (req, res) => {
  try {
    const mongoClient = await connectToDatabase();
    const db = mongoClient.db('textToSpeech');
    if (!db) {
      console.error('Error connecting to the database');
      return res.status(447);
    }
    const collection = db.collection('audioFiles');
    if (!collection) {
      console.error('Error connecting to the database collection');
      return res.status(446);
    }

    const { textInput } = req.body;

    if (!textInput) {
      console.error('Text invalid or missing!');
      return res.status(400).json({ error: 'Missing textInput in the request body' });
    }
    
    console.log('the text is', textInput);

    // Check if the audio file already exists
    const existingFile = await collection.findOne({ text: textInput });

    if (existingFile) {
      console.log('File already exists in the database, downloading');
      res.download(existingFile.path);
      return res.status(200).json({ message: 'File already exists in the database, downloading' });
    }

    const path = ServerUrl + '/audio/';
    exec(`espeak --path="${path}" "${textInput}"`, (error) => {
      if (error) {
        console.error('Error:', error, 'oopsie1');
        return res.status(449).json({ error: 'Server error 1' });
      }
      // Save the audio file in the database
      collection.insertOne({ text: textInput, path: path });
      res.download(path);
      return res.status(201).json({ message: 'Audio file created successfully', path: path });
    });
  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(448).json({ error: error });
  }
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
