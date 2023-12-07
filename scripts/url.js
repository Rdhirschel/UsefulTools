const serverUrl = '';

async function shortenURL() {
    const url = document.getElementById('url-input').value.trim();
    const shortUrl = document.getElementById('short-url-input').value.trim();

    if (url.length === 0) {
        document.getElementById('result').innerText = 'Please enter a URL';
        return;
    }

    // Use window.location.origin as the base URL
    const baseServerUrl = serverUrl ? `${window.location.origin}/${serverUrl}` : window.location.origin;

    const response = await fetch(`${baseServerUrl}/urlshortener`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            originalUrl: url,
            shortUrl: shortUrl,
        }),
    });

    const result = await response.json();

    if (response.ok) {
        document.getElementById('result').innerHTML = `Short URL created successfully: <a href="${baseServerUrl}/urlshortener/${shortUrl}" target="_blank">${baseServerUrl}/urlshortener/${shortUrl}</a>`;
    } else {
        document.getElementById('result').innerText = `Error: ${result.error}`;
    }
}
