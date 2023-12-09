const ServerUrl = 'https://toolzz.vercel.app';

async function shortenURL() 
{
    const url = document.getElementById('url-input').value.trim();
    let shortUrl = document.getElementById('name-input').value.trim();

    if (url.length === 0) {
        document.getElementById('result').value = 'Please enter a URL';
        return;
    }

    const response = await fetch(`${ServerUrl}/api/redir`, {
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

    if (response.ok) 
    {
        result = await response.json();
    } else {
        const errorMessage = await response.text();
        console.error(`Error: ${errorMessage}`);
    }
    if (response.ok) 
    {
        shortUrl = result.shortUrl;
        document.getElementById('result').value = `<a href="${ServerUrl}/api/shorten?shortUrl=${shortUrl}" target="_blank">${ServerUrl}/api/shorten?shortUrl=${shortUrl}</a>`; 
    }
    else {
        document.getElementById('result').value = `Error: ${result.error}`;
    }
}

document.getElementById('copyButton').addEventListener('click', function() {
    const shortUrlDisplay = document.getElementById('shortUrlDisplay');
    shortUrlDisplay.select();
    document.execCommand('copy');
});