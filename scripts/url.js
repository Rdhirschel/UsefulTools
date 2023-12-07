const server = "..//scripts//server.js";
async function shortenURL() 
{
    const url = document.getElementById('url-input').value.trim();
    const shortUrl = document.getElementById('name-input').value.trim();

    if (url.length === 0) {
        document.getElementById('result').innerText = 'Please enter a URL';
        return;
    }

    const response = await fetch(`${server}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            originalUrl: url,
            shortUrl: shortUrl,
        }),
    });

    let result; 

    if (response.ok) {
        result = await response.json();
    } else {
        const errorMessage = await response.text();
        console.error(`Error: ${errorMessage}`);
    }
    
    if (response.ok) {
        document.getElementById('result').innerHTML = `Short URL created successfully: <a href="${baseServerUrl}/urlshortener/${shortUrl}" target="_blank">${baseServerUrl}/urlshortener/${shortUrl}</a>`;
    } else {
        document.getElementById('result').innerText = `Error: ${result.error}`;
    }
    

    if (response.ok) {
        document.getElementById('result').innerHTML = `Short URL created successfully: <a href="${baseServerUrl}/urlshortener/${shortUrl}" target="_blank">${baseServerUrl}/urlshortener/${shortUrl}</a>`;
    } else {
        document.getElementById('result').innerText = `Error: ${result.error}`;
    }
}
