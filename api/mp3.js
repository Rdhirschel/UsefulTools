const ytdl = require('ytdl-core'); 
const ffmpeg = require('fluent-ffmpeg');


module.exports = async (req, res) => {
  try {
    let { youtubeUrl } = req.body;

    if (!youtubeUrl || !ytdl.validateURL(youtubeUrl)) {
      return res.status(400).json({ error: 'Invalid or missing YouTube URL in the request body' });
    }

    let mp3Url = await convertYoutubeToMp3(youtubeUrl); 

    return res.status(201).json({ message: 'MP3 URL created successfully', mp3Url: mp3Url });
  } 
  
  catch (error) 
  {
    console.error('Error:', error);
    return res.status(500).json({ error: 'Server error' });
  }
};


async function convertYoutubeToMp3(url) {
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, { quality: 'highestaudio' });
    const output = `./${Date.now()}.mp3`;

    ffmpeg(stream)
      .audioBitrate(128)
      .save(output)
      .on('end', () => resolve(output))
      .on('error', reject);
  });
}
