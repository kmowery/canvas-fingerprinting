
// data should be an array with pixel data in it
function fillForm(canvas) {
  var base64png = canvas.toDataURL("image/png");

  var pixels = document.getElementById("pixels");
  pixels.innerHTML = base64png;

  var png = document.getElementById("png");
  png.value = base64png;
}

function fillFormById(id) {
  fillForm(document.getElementById(id));
}

