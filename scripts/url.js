
// function generateShortURL() 
// {
//     var url = document.getElementById('url-input').value;
//     let hashkey =  Math.random().toString(36).substr(2, 5);
//     var shortURL = window.location.origin + hash
//     document.getElementById('result').innerHTML = "Your short URL is: <a href='" + url + "'>" + shortURL + "</a>";

//     var redirectURL = window.location.origin + "/redirect.html";
//     var redirectPage = document.createElement('html');
//     redirectPage.innerHTML = "<head><meta http-equiv='refresh' content='0; url=" + url + "'></head><body></body>";
//     document.body.appendChild(redirectPage);
// }

function idToShortURL(n) 
{
    let map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let shorturl = [];

    while (n) {
        shorturl.push(map[n % 62]);
        n = Math.floor(n / 62);
    }

    shorturl.reverse();

    return shorturl.join("");
}

function shortURLtoID(shortURL) 
{
    let id = 0;

    for (let i = 0; i < shortURL.length; i++) {
        if ("a" <= shortURL[i] && shortURL[i] <= "z")
            id = id * 62 + shortURL[i].charCodeAt(0) - "a".charCodeAt(0);
        if ("A" <= shortURL[i] && shortURL[i] <= "Z")
            id = id * 62 + shortURL[i].charCodeAt(0) - "A".charCodeAt(0) + 26;
        if ("0" <= shortURL[i] && shortURL[i] <= "9")
            id = id * 62 + shortURL[i].charCodeAt(0) - "0".charCodeAt(0) + 52;
    }
    return id;
}

function urlExists(url) {
    var http = new XMLHttpRequest();
    http.open("HEAD", url, false);
    http.send();
    return http.status != 404;
}

function generateShortURL() 
{
    let url = document.getElementById("url-input").value;
    if (url == "") {
        document.getElementById("result").textContent = "";
        return;
    }
    if (!urlExists(url)) {
        document.getElementById("result").textContent = "URL does not exist";
        return;
    }
    let shorturl = idToShortURL(url);
    document.getElementById("result").textContent = shorturl;
}

function idToShortURL(n) 
{ 

	let map = "abcdefghijklmnopqrstuvwxyzABCDEF"
	"GHIJKLMNOPQRSTUVWXYZ0123456789"; 

	let shorturl = []; 

	while (n) 
	{ 

		shorturl.push(map[n % 62]); 
		n = Math.floor(n / 62); 
	} 

	shorturl.reverse(); 

	return shorturl.join(""); 
} 

function shortURLtoID(shortURL) { 
	let id = 0; 

	for (let i = 0; i < shortURL.length; i++) { 
		if ('a' <= shortURL[i] && shortURL[i] <= 'z') 
			id = id * 62 + shortURL[i].charCodeAt(0) - 'a'.charCodeAt(0); 
		if ('A' <= shortURL[i] && shortURL[i] <= 'Z') 
			id = id * 62 + shortURL[i].charCodeAt(0) - 'A'.charCodeAt(0) + 26; 
		if ('0' <= shortURL[i] && shortURL[i] <= '9') 
			id = id * 62 + shortURL[i].charCodeAt(0) - '0'.charCodeAt(0) + 52; 
	} 
	return id; 
} 
function urlExists(url) {
    return new Promise((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('HEAD', url);
        xhr.onload = () => {
            resolve(xhr.status >= 200 && xhr.status < 400);
        };
        xhr.onerror = () => {
            resolve(false);
        };
        xhr.send();
    });
}

// function generateShortURL() {
//     let url = document.getElementById("url-input").value;
//     if (url == "") {
//         document.getElementById("result").textContent = "";
//         return;
//     }
//     urlExists(url).then((exists) => {
//         if (exists) {
//             // URL exists
//             // Generate short URL logic here
//             document.getElementById("result").textContent = "Short URL generated";
//         } else {
//             // URL doesn't exist
//             document.getElementById("result").textContent = "URL does not exist";
//         }
//     });
// }

function generateShortURL() {
    let url = document.getElementById("url-input").value;
    if (url == "") {
        document.getElementById("result").textContent = "";
        return;
    }
    urlExists(url).then((exists) => {
        if (exists) {
            // URL exists
            // Generate short URL logic here
            document.getElementById("result").textContent = "Short URL generated";
        } else {
            // URL doesn't exist
            document.getElementById("result").textContent = "URL does not exist";
        }
    });

    return;
}
