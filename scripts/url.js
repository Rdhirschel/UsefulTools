const ServerUrl = 'https://toolzz.vercel.app';

// Offline function that checks if the syntax of the url is correct via creating a new URL object
function checkURL(url) 
{
    try 
    {
        new URL(url);
        return true;
    } 
    catch (error) 
    {
        return false;
    }
}

async function shortenURL() 
{
    const url = document.getElementById('url-input').value.trim();
    let shortUrl = document.getElementById('name-input').value.trim();

    if (url.length === 0) {
        document.getElementById('result').value = 'Please enter a URL';
        return;
    }
    if (!checkURL(url)) {
        document.getElementById('result').value = 'Please enter a valid URL';
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

    if (response.ok) 
    {
        const result = await response.json();
        shortUrl = result.shortUrl;
        document.getElementById('result').value = `${ServerUrl}/api/shorten?shortUrl=${shortUrl}`; 
    } 
    else 
    {
        const errorMessage = await response.text();
        document.getElementById("result").value = errorMessage;
    }
}

document.getElementById('copyButton').addEventListener('click', function() {
    const result = document.getElementById('result');
    result.select();
    document.execCommand('copy');
});