const express = require('express');
const { exec } = require('child_process');
const { MongoClient } = require('mongodb');
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const os = require('os');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

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
    if(!mongoClient)
    {
      console.error('Error connecting to the database');
      return res.status(447);
    }
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

    let { textInput, inputFilePath, outputFormat } = req.body;

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

    const tempDir = os.tmpdir();

    // const outputFilePath = '../audio/' + textInput + '.' + outputFormat;
    const outputFilePath = path.join(tempDir, textInput + '.' + outputFormat);

    ffmpeg('../audio/translate_tts.mp3')
    .toFormat(outputFormat)
    .on('error', (err) => {
      console.log('Oh uh: ' + err.message);
      return res.status(400).json({ error: err.message });
    })
    .on('progress', (progress) => {
      console.log(progress.targetSize + ' KB converted');
    })
    .on('end', () => {
        console.log('Conversion finished. May download.');
    })
    .save(outputFilePath);

    res.download(outputFilePath);

    await collection.insertOne({ text: textInput, path: outputFilePath });

    return res.status(201).json({ message: 'File created successfully', path: outputFilePath });

  } catch (error) {
    console.error('Error connecting to the database: ${error}');
    res.status(448).json({ error: error });
  }

});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
