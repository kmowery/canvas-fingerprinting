
// data should be an array with pixel data in it
function fillForm(data) {
  var nonzero = {};
  for(var i = 0; i < data.length; i++) {
    if(data[i] !== 0) {
      nonzero[i] = data[i];
    }
  }
  var pixels = document.getElementById("pixels");
  pixels.innerHTML = JSON.stringify(nonzero).replace(/,\"/gi, ', \"');

  var fi = document.getElementById("forminput");
  fi.value = JSON.stringify(nonzero).replace(/,\"/gi, ', \"');

  //debugging fluff
  var x = 0;
  x = x + 1;
}
