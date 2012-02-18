function setPixelAt(data, n) {
  var loc = Math.floor(parseInt(n) / 4) * 4;

  data[ loc ] = 0;
  data[ loc +1 ] = 0;
  data[ loc +2 ] = 0;
  data[ loc +3 ] = 255;

  return data;
}

// c1 and c2 should be an array of
// [HTMLCanvasElement, CanvasRenderingContext2D, ImageData]
function diff(c1, c2) {
  if(c1 == null || c2 == null) {
    return;
  }

  var canvas = document.createElement("canvas");
  canvas.setAttribute('width', c1["canvas"].width);
  canvas.setAttribute('height', c1["canvas"].height);
  var context = canvas.getContext("2d");
  var imageData = context.getImageData(0,0, canvas.width, canvas.height);
  var data = imageData.data;

  // Go backwards to allow for alpha disabling
  for(var i = data.length-1; i > 0; i = i - 1) {
    var one = c1.imageData.data[i];
    var two = c2.imageData.data[i];

    imageData.data[i] = Math.abs(one-two);
    if(one !== two) {
      // turn off alpha for this pixel
      var loc = Math.floor(parseInt(i) / 4) * 4;
      imageData.data[loc+3] = 255;
    }
  }

  context.putImageData(imageData,0,0);
  return canvas;
}

function diffmap(c1, c2) {
  if(c1 == null || c2 == null) {
    return;
  }
  var canvas = document.createElement("canvas");
  canvas.setAttribute('width', c1["canvas"].width);
  canvas.setAttribute('height', c1["canvas"].height);
  var context = canvas.getContext("2d");
  var imageData = context.getImageData(0,0, canvas.width, canvas.height);

  for(var i = 0; i < imageData.data.length; i = i + 1) {
    var one = c1.imageData.data[i];
    var two = c2.imageData.data[i];
    if(one !== two) {
      imageData.data = setPixelAt(imageData.data, i);
    }
  }

  context.putImageData(imageData,0,0);
  return canvas;
}

