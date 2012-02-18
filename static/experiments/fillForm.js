
// data should be an array with pixel data in it
function fillForm(canvas) {
  //var nonzero = {};
  //for(var i = 0; i < data.length; i++) {
  //  if(data[i] !== 0) {
  //    nonzero[i] = data[i];
  //  }
  //}
  //pixels.innerHTML = JSON.stringify(nonzero).replace(/,\"/gi, ', \"');

  var base64png = canvas.toDataURL("image/png");

  var pixels = document.getElementById("pixels");
  pixels.innerHTML = base64png;

  var png = document.getElementById("png");
  png.value = base64png;

  //var fi = document.getElementById("forminput");
  //fi.value = JSON.stringify(nonzero).replace(/,\"/gi, ', \"');
}
