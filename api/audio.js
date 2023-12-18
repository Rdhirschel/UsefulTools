const express = require('express');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');
const ffmpeg = require('fluent-ffmpeg');

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

app.post('/api/audio', async (req, res) => {
  try {
    const mongoClient = await connectToDatabase();
    const db = mongoClient.db('ConversionTool');
    if (!db) {
      console.error('Error connecting to the database');
      return res.status(447);
    }
    const collection = db.collection('audioFiles');
    if (!collection) {
      console.error('Error connecting to the database collection');
      return res.status(446);
    }

    const { textInput, inputFilePath, outputFormat } = req.body;

    if (!textInput) {
      console.error('Text invalid or missing!');
      return res.status(400).json({ error: 'Missing textInput in the request body' });
    }

    // Check if the audio file already exists
    const existingFile = await collection.findOne({ text: textInput });

    if (existingFile) {
      console.log('File already exists in the database, downloading');
      res.download(existingFile.path);
      return res.status(200).json({ message: 'File already exists in the database, downloading' });
    }

    const outputFilePath = ServerUrl + '/audio/' + textInput + '.' + outputFormat;

    const process = new ffmpeg(inputFilePath);
    process.then((audio) => {
      audio
        .setAudioFormat(outputFormat)
        .save(outputFilePath, (error) => {
          if (error) {
            console.error('Error:', error);
            return res.status(449).json({ error: 'Server error' });
          }
          // Save the audio file in the database
          collection.insertOne({ text: textInput, path: outputFilePath });
          res.download(outputFilePath);
          return res.status(201).json({ message: 'Audio file converted successfully', path: outputFilePath });
        });

    }).catch((error) => {
      console.error('Error:', error);
      return res.status(449).json({ error: 'Server error' });
    });

  } catch (error) {
    console.error('Error connecting to the database:', error);
    res.status(448).json({ error: error });
  }
  
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
