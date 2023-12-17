var ytdl = require(['ytdl-core'], function (ytdl) {
   ytdl = ytdl;
});
var ffmpeg = require(['fluent-ffmpeg'], function (ffmpeg) {
   ffmpeg = ffmpeg;
});
var fs = require(['fs'], function (fs) {
   fs = fs;
});

async function convertYoutubeToMp3(url, outputFilename) {
   try {
      require(['ytdl-core', 'fluent-ffmpeg', 'fs'], function (ytdl, ffmpeg, fs) {
         const info = ytdl.getInfo(url);
         // Select the video format and quality
         const format = ytdl.chooseFormat(info.formats, { quality: "248" });
         // Create a write stream to save the video file
         const outputFilePath = `${info.videoDetails.title}.${format.container}`;
         const outputStream = fs.createWriteStream(outputFilePath);
         // Download the video file
         ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);
         // When the download is complete, show a message
         outputStream.on('finish', () => {
            console.log(`Finished downloading: ${outputFilePath}`);
         });
      });

   } catch (err) {
      console.error(err);
   }
}

function validateAndSubmit()
{
   var yout = document.getElementById("url").value;
   if (yout == null || yout == "") {
      alert("Please Enter the Youtube Video URL");
      return;
   }
   convertYoutubeToMp3(yout, document.getElementById("output").value);
}
