const ServerUrl = 'https://toolzz.vercel.app';

async function convertAudio() {
    const formatSelect = document.getElementById('formatSelect');
    const outputFormat = formatSelect.value;

    const response = await fetch(`${ServerUrl}/api/audio`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            textInput: document.getElementById('fileInput').title,
            inputFilePath: document.getElementById('fileInput'),
            outputFormat: outputFormat,
        }),
    });

    if(response.ok)
    {

    } else
    {
        const errorMessage = await response.text();
        alert( `Error ${response.status}: ${errorMessage.text}`);
    }
}

