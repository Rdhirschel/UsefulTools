function urlToShortURL(url) {
    let id = 0;
    const map = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    
    for (let i = 0; i < url.length; i++) {
        id = (id * 256 + url.charCodeAt(i)) % 62;
    }
    

    let shortURL = "";
    while (id > 0) {
        shortURL = map[id % 62] + shortURL;
        id = Math.floor(id / 62);
    }
    
    // Generate at least 6-7 characters
    while (shortURL.length < 6) {
        shortURL = map[Math.floor(Math.random() * 62)] + shortURL;
    }
    
    return shortURL;
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
    var urlPattern = new RegExp('^(https?:\\/\\/)?'+ '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|'+ '((\\d{1,3}\\.){3}\\d{1,3}))'+ '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ '(\\?[;&a-z\\d%_.~+=-]*)?'+ '(\\#[-a-z\\d_]*)?$','i'); 
    return urlPattern.test(url);
}

function generateShortURL() {
    let url = document.getElementById("url-input").value;
    if (url == "") 
    {
        document.getElementById("result").textContent = "";
        return;
    }
    if (urlExists(url)) 
    {
        // URL exists
        let shorturl = urlToShortURL(url);
        document.getElementById("result").textContent = shorturl;
    } else 
    {
        // URL doesn't exist
        document.getElementById("result").textContent = "URL does not exist";
    }
}
