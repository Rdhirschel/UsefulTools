//const ytdl = require('ytdl-core');


async function convertYoutubeToMp3(url, outputFilename) {
   document.getElementById("error").textContent = "asdjfsasdf";

   try {
         
         const info = ytdl.getInfo(url);
         // Select the video format and quality
         const format = ytdl.chooseFormat(info.formats, { quality: "248" });
         // Create a write stream to save the video file
         const outputFilePath = 'audio/' + `${info.videoDetails.title}.${format.container}`;
         const outputStream = fs.createWriteStream(outputFilePath);
         // Download the video file
         ytdl.downloadFromInfo(info, { format: format }).pipe(outputStream);
         // When the download is complete, show a message
         outputStream.on('finish', () => {
            console.log(`Finished downloading: ${outputFilePath}`);
            document.getElementById("converted").src = outputFilePath;
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
   document.getElementById("error").textContent = "asdfasdf";
   convertYoutubeToMp3(yout, "test.mp3");
}
