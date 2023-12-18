const { exec } = require('child_process');
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

        console.log('the text is', textInput);


        if(!textInput) 
        {
            console.error('Text invalid or missing!');
            return res.status(400).json({ error: 'Missing textInput in the request body' });
        }

        // Check if the audio file already exists
        const existingFile = await collection.findOne({ text: textInput });
        if (existingFile) {
          console.log('File already exists in the database, downloading');
            return res.download(existingFile.path);
        }

        const path = `audio/${textInput.replace(/\s+/g, '_')}.mp3`;
        exec(`espeak -w ${path} "${textInput}"`, (error) => {
            if (error) {
                console.error('Error:', error, 'oopsie1');
                return res.status(449).json({ error: 'Server error 1' });
            }
            // Save the audio file in the database
            collection.insertOne({ text: textInput, path: path });
            return res.download(path);

        });
    } catch (error) {
        console.error('Error:', error, 'oopsie2');
        res.status(448).json({ error: 'Server error 2' });
    }
};
