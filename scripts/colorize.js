let setPic = document.getElementById("uploaded-image");
let prevPic = document.getElementById("preview-image");
let inputPic = document.getElementById("input-file");

var canvas = document.createElement("canvas");
var ctx = canvas.getContext("2d", {willReadFrequently: false});

var originalPixels = null;
var currentPixels = null;

function getPixels(img)
{
    canvas.width = img.width;
    canvas.height = img.height;

    ctx.drawImage(img, 0, 0, img.naturalWidth, img.naturalHeight, 0, 0, img.width, img.height);
    originalPixels = ctx.getImageData(0, 0, img.width, img.height);
    currentPixels = ctx.getImageData(0, 0, img.width, img.height);

    // img.onload = null;
}

inputPic.onchange = function(){
    setPic.src = URL.createObjectURL(inputPic.files[0]);
    prevPic.src = URL.createObjectURL(inputPic.files[0]);
    getPixels(prevPic);
}


function HexToRGB(Hex)
{
    var Long = parseInt(Hex.replace(/^#/, ""), 16);
    return {
        R: (Long >>> 16) & 0xff,
        G: (Long >>> 8) & 0xff,
        B: Long & 0xff
    };
}

function RGBToHSL(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    const l = Math.max(r, g, b);
    const s = l - Math.min(r, g, b);
    const h = s
      ? l === r
        ? (g - b) / s
        : l === g
        ? 2 + (b - r) / s
        : 4 + (r - g) / s
      : 0;
    return [
      60 * h < 0 ? 60 * h + 360 : 60 * h,
      100 * (s ? (l <= 0.5 ? s / (2 * l - s) : s / (2 - (2 * l - s))) : 0),
      (100 * (2 * l - s)) / 2,
    ];
}


function HSLToRGB(h, s, l) {
    s /= 100;
    l /= 100;
    const k = n => (n + h / 30) % 12;
    const a = s * Math.min(l, 1 - l);
    const f = n =>
      l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
    return [255 * f(0), 255 * f(8), 255 * f(4)];
}

function changeColor()
{
    if(!originalPixels) return; // Check if image has loaded
    var newColor = HexToRGB(document.getElementById("color").value);
    var newColorHSL = RGBToHSL(newColor.R, newColor.G, newColor.B);

    for(var I = 0, L = originalPixels.data.length; I < L; I += 4)
    {
        if(currentPixels.data[I + 3] > 0)
        {
            var currHSL = RGBToHSL(originalPixels.data[I], originalPixels.data[I+1], originalPixels.data[I+2]);

            var currColor = HSLToRGB(newColorHSL[0], newColorHSL[1], currHSL[2]);

            currentPixels.data[I] = currColor[0];
            currentPixels.data[I + 1] = currColor[1];
            currentPixels.data[I + 2] = currColor[2];
        }
    }

    ctx.putImageData(currentPixels, 0, 0);
    prevPic.src = canvas.toDataURL("image/png");
}

function undoChangeColor()
{
    // if(originalPixels) return; // Check if image has loaded
    // for(var I = 0, L = originalPixels.data.length; I < L; I += 4)
    // {
    //     if(currentPixels.data[I + 3] > 0)
    //     {
    //         currentPixels.data[I] = originalPixels.data[I];
    //         currentPixels.data[I + 1] = originalPixels.data[I+1];
    //         currentPixels.data[I + 2] = originalPixels.data[I+2];
    //     }
    // }

    prevPic.src = setPic.src;
}

document.getElementById('download-btn').addEventListener('click', function() {
    var image = document.getElementById('preview-image');
    var link = document.createElement('a');
    link.href = image.src;
    link.download = 'download.png';
    link.click();
});