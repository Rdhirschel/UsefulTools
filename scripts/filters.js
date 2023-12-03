let setPic = document.getElementById("uploaded-image");
let inputPic = document.getElementById("input-file");

inputPic.onchange = function(){
  setPic.src = URL.createObjectURL(inputPic.files[0]);
}