const ServerUrl = 'https://toolzz.vercel.app';

function CheckIfValidYoutubeUrl(url)  
{
      var regExp = /^(http(s)?:\/\/)?((w){3}.)?youtu(be|.be)?(\.com)?\/.+/;
      var match = url.match(regExp);
      if (match) {
         return true;
      }
      return false;
}

async function validateAndSubmit()
{
   var url = document.getElementById("url").value;

   if (url == null || url == "" || !CheckIfValidYoutubeUrl(url)) {
      alert("Please Enter the Youtube Video URL");
      return;
   }

   //make request to server
   const response = await fetch(`${ServerUrl}/api/mp3`, {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
      },
      body: JSON.stringify({
          youtubeUrl: url,
      }),
   });

   if (response.ok) 
   {
      const result = await response.json();
      document.getElementById('result').value = result.mp3Url;
   } 
   else 
   {
      const errorMessage = await response.text();
      document.getElementById('result').value = `Error: ${errorMessage.text}`;
   }
}

function download() 
{
   //download file
   
}