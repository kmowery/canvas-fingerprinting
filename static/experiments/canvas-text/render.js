
function render(elementid, pixels) {
  renderdiff(elementid, pixels, null);
}

function renderdiff(elementid, pixels1, pixels2) {
  var canvas = document.getElementById(elementid);
  var context = canvas.getContext("2d");
  var imageData = context.getImageData(0,0, canvas.width, canvas.height);

  for(var p in pixels1) {
    imageData.data[p] = pixels1[p];
  }

  if(pixels2 !== null) {
    for(var p in pixels2) {
      var tmp = pixels2[p];
      var tmp2 = imageData.data[p];
      imageData.data[p] = Math.abs(imageData.data[p] - pixels2[p]);
    }
  }

  context.putImageData(imageData,0,0);
}

