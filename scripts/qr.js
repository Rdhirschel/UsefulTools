function GenerateQRCode() {
    let url = document.getElementById("input").value;
    let qrcodeElement = document.getElementById("result");
    if (url == null || url == "") {
        qrcodeElement.innerHTML = "Please enter a URL";
        return;
    }
    qrcodeElement.innerHTML = "";
    var qrcode = new QRCode(qrcodeElement, {
        text: url,
        width: 400,
        height: 400,
        colorDark: "#000000",
        colorLight: "#ffffff",
        correctLevel: QRCode.CorrectLevel.H
    });
}

function downloadQRCode() 
{
    let canvas = document.querySelector('#result canvas');
    let img = canvas.toDataURL("image/png").replace("image/png", "image/octet-stream");
    let link = document.createElement('a');
    link.download = 'QRCode.png';
    link.href = img;
    link.click();
}