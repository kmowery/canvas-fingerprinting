
function render(elementid, pixels) {
  renderdiff(elementid, pixels, null);
}

function renderdiff(elementid, pixels1, pixels2) {
  var canvas = document.getElementById(elementid);
  var context = canvas.getContext("2d");
  var imageData = context.getImageData(0,0, 140, 15);

  for(p in pixels1) {
    imageData.data[p] = pixels1[p];
  }

  if(pixels2 !== null) {
    for(p in pixels2) {
      imageData.data[p] = Math.abs(imageData.data[p] - pixels2[p]);
    }
  }

  context.putImageData(imageData,0,0);
}

