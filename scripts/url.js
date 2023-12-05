// Import necessary modules
const { createHash } = require('crypto');
const fs = require('fs');
const path = require('path');

// Define the folder and file paths
const folderPath = 'short';
const jsonFilePath = path.join(folderPath, 'saves.json');

function updateJson(url, linkName) 
{
    let data = {};

    if (fs.existsSync(jsonFilePath)) 
    {
        const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
        data = JSON.parse(jsonData);
    }

    data[linkName] = url;
    fs.writeFileSync(jsonFilePath, JSON.stringify(data, null, 2));
}

function createHtmlPage(url, linkName) 
{
    const sanitizedLinkName = linkName.replace(/[^a-zA-Z0-9]/g, '_');

    const html = `
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

    const fileName = `${sanitizedLinkName}.html`;
    const filePath = path.join(folderPath, fileName);

    fs.writeFileSync(filePath, html);
}

function shortenURL() {
    const url = document.getElementById('url-input').value.trim();
    const linkName = document.getElementById('name-input').value.trim();

    if (linkName.length === 0) {
        document.getElementById('result').innerText = 'Please enter a valid link name.';
        return;
    }

    // Check if the link name already exists in saves.json
    const jsonData = fs.readFileSync(jsonFilePath, 'utf8');
    const data = JSON.parse(jsonData);

    if (data[linkName]) {
        // If the link name already exists, display the existing URL to the user
        document.getElementById('result').innerText = `Link name already exists. URL: ${data[linkName]}`;
        return;
    }

    // Update saves.json with the link name
    updateJson(url, linkName);
    createHtmlPage(url, linkName);

    document.getElementById('result').innerText = `Link shortened successfully. Name: ${linkName}`;
}
