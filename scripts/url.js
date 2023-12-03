const form = document.getElementById("form");
const linkInput = document.getElementById("link");
const parent = document.getElementById("parent");

form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const originalLink = linkInput.value;
    const apiUrl = `https://tinyurl.com/api-create.php?url=${originalLink}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.text();
        console.log(data);
        let link = document.createElement("li");
        link.className = "output";
        link.innerHTML = `<a href="${data}" target="_blank">${data} </a>`;
        parent.prepend(link);
    } catch(e) {
        console.error(e);
    }
});