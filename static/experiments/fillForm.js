
// data should be an array with pixel data in it
function fillForm(experiment, canvas) {
  var base64png = canvas.toDataURL("image/png");

  var pixels = document.getElementById("pixels");
  pixels.innerHTML = base64png;

  var form = document.getElementById("exp-"+experiment);
  if(form === null) {
    // Get the png field from the standard form.
    form = document.getElementById("png");
  }

  form.value = base64png;
}

function fillFormById(id) {
  fillForm(document.getElementById(id));
}

