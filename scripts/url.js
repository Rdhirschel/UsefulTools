folderrPath = './short';
const localStorageKey = './short/saves.json';
const serverUrl = `ws://${window.location.host}`;
const socket = new WebSocket(serverUrl);

socket.addEventListener('open', (event) => {
    console.log('WebSocket connection opened:', event);
});

socket.addEventListener('message', (event) => {
    const data = JSON.parse(event.data);

    if (data.event === 'fileCreated') {
        console.log(`File created: ${data.filePath}`);
    }
});

socket.addEventListener('close', (event) => {
    console.log('WebSocket connection closed:', event);
});

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
    await fetch("./short", {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ${process.env.ACCESS_KEY}',
        },
        body: JSON.stringify({
            filePath: `${folderPath}/${sanitizedLinkName}.html`,
            content: htmlContent,
        }),
    });
}

function urlExists(url) 
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

async function shortenURL() {
    const url = document.getElementById('url-input').value.trim();
    const linkName = document.getElementById('name-input').value.trim();

    if (url.length === 0) 
    {
        document.getElementById('result').innerText = '';
        return;
    } 
    else if (!urlExists(url)) 
    {
        document.getElementById('result').innerText = 'Please enter a valid URL';
        return;
    }

    const storedData = localStorage.getItem(localStorageKey);
    const data = storedData ? JSON.parse(storedData) : {};

    if (data[linkName] == url) 
    {
        document.getElementById('result').innerText = `Link already exists. HTML Page: ${getHtmlPageLink(linkName)}`;
        return;
    }

    updateLocalStorage(linkName, url);
    await createHtmlPage(url, linkName);
    document.getElementById('result').innerHTML = `Link shortened successfully. HTML Page: ${getHtmlPageLink(linkName)}`; 
}

function getHtmlPageLink(linkName) 
{
    return `<a href="${window.location.origin}/short/${linkName}.html" target="_blank">short/${linkName}.html</a>`;
}
