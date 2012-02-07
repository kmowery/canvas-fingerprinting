
function render(elementid, canvasjson) {
  renderdiff(elementid, canvasjson, null);
}

function renderdiff(elementid, canvasjson1, canvasjson2) {
  var canvas = document.getElementById(elementid);
  var context = canvas.getContext("2d");
  var imageData = context.getImageData(0,0, 140, 15);

  var pixels = JSON.parse(canvasjson1);
  for(p in pixels) {
    imageData.data[p] = pixels[p];
  }

  if(canvasjson2 !== null) {
    pixels = JSON.parse(canvasjson2);
    for(p in pixels) {
      imageData.data[p] = Math.abs(imageData.data[p] - pixels[p]);
    }
  }

  context.putImageData(imageData,0,0);
}

