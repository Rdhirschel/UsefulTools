const ytdl = require('ytdl-core'); 
const ffmpeg = require('fluent-ffmpeg');
const ffmpegPath = require('ffmpeg-static');
const os = require('os');
const path = require('path');

ffmpeg.setFfmpegPath(ffmpegPath);

module.exports = async (req, res) => {
    let { youtubeUrl } = req.body;
    const tempDir = os.tmpdir();

    if (!youtubeUrl || !ytdl.validateURL(youtubeUrl)) {
      return res.status(400).json({ error: 'Invalid or missing YouTube URL in the request body' });
    }

    let mp3Url = await convertYoutubeToMp3(youtubeUrl, tempDir);

    return res.status(201).json({ message: 'MP3 URL created successfully', mp3Url: mp3Url });
  
};


async function convertYoutubeToMp3(url, tempDir) {
  return new Promise((resolve, reject) => {
    const stream = ytdl(url, { quality: 'highestaudio' });
    const output = path.join(tempDir, `${Date.now()}.mp3`);

    ffmpeg(stream).audioBitrate(128).save(output).on('end', () => resolve(output)).on('error', reject);
  });
}

