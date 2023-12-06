const folderPath = 'short';
const localStorageKey = 'saves';
const serverUrl = window.location.origin + '/createFile';

function updateLocalStorage(linkName, url) 
{
    let data = {};

    const storedData = localStorage.getItem(localStorageKey);
    if (storedData) {
        data = JSON.parse(storedData);
    }

    data[linkName] = url;
    localStorage.setItem(localStorageKey, JSON.stringify(data));
}

async function createHtmlPage(url, linkName) 
{
    const sanitizedLinkName = linkName.replace(/[^a-zA-Z0-9]/g, '_');

    const htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <meta http-equiv="refresh" content="0; url=${url}">
            <script>window.location.href = "${url}";</script>
        </head>
        <body>
            Redirecting...
        </body>
        </html>
    `;

    // Send a request to the server to create the HTML file
    await fetch(serverUrl, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            filePath: `${folderPath}/${sanitizedLinkName}.html`,
            content: htmlContent,
        }),
    });
}

function urlExists(url) 
{
    try {
        new URL(url);
        return true;
    } catch (error) {
        return false;
    }
}

async function shortenURL() {
    const url = document.getElementById('url-input').value.trim();
    const linkName = document.getElementById('name-input').value.trim();

    if (url.length === 0) {
        document.getElementById('result').innerText = '';
        return;
    } else if (!urlExists(url)) {
        document.getElementById('result').innerText = 'Please enter a valid URL';
        return;
    }

    const storedData = localStorage.getItem(localStorageKey);
    const data = storedData ? JSON.parse(storedData) : {};

    if (data[linkName]) {
        document.getElementById('result').innerText = `Link already exists. HTML Page: ${getHtmlPageLink(linkName)}`;
        return;
    }

    updateLocalStorage(linkName, url);
    await createHtmlPage(url, linkName);
    document.getElementById('result').innerHTML = `Link shortened successfully. HTML Page: ${getHtmlPageLink(linkName)}`; 
}

function getHtmlPageLink(linkName) {
    // Create a link to view the HTML page on the server
    return `<a href="${serverUrl}/${folderPath}/${linkName}.html" target="_blank">${folderPath}/${linkName}.html</a>`;
}
