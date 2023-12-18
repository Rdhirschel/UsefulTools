const ServerUrl = 'https://toolzz.vercel.app';

async function speakText() {
    let userText = document.getElementById('saying').value;
    const response = await fetch(`${ServerUrl}/api/speak`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            textInput: userText
        }),
    });

    if (response.ok) 
    {
        const result = await response.json();
    } 
    else {
        const errorMessage = await response.error();
        alert("HTTP-Error: " + response.errorMessage);    
    }
    // let ttsResult = document.getElementById('ttsResult');
    // ttsResult.src = url;
    // ttsResult.parentElement.load();
}