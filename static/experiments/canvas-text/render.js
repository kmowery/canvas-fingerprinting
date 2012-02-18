
/* render currently broken */
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


function setPixelAt(data, n) {
  var loc = Math.floor(parseInt(n) / 4) * 4;

  data[ loc ] = 0;
  data[ loc +1 ] = 0;
  data[ loc +2 ] = 0;
  data[ loc +3 ] = 255;

  return data;
}

/* render currently broken */
function renderdiffmap(elementid, pixels1, pixels2) {
  var canvas = document.getElementById(elementid);
  var context = canvas.getContext("2d");
  var imageData = context.getImageData(0,0, canvas.width, canvas.height);

  for(var p in pixels1) {
    if( !(p in pixels2) || (pixels1[p] !== pixels2[p])) {
      imageData.data = setPixelAt(imageData.data, p);
    }
  }

  for(var p in pixels2) {
    if( !(p in pixels1) || (pixels1[p] !== pixels2[p])) {
      imageData.data= setPixelAt(imageData.data, p);
    }
  }

  context.putImageData(imageData,0,0);
}

function renderPNG(attachmentid, png) {
  var i = new Image();
  i.src = png;

  var attach = document.getElementById(attachmentid);
  attach.appendChild(i);
}

// takes a base64 png and returns a canvas, properly sized, with the image
// inside it
function pngToCanvas(png64) {
  var i = new Image();
  i.src = png64;
  var c = document.createElement("canvas");
  c.width = i.width;
  c.height = i.height;
  var ctx = c.getContext('2d');
  ctx.drawImage(i, 0, 0);

  var imageData = ctx.getImageData(0,0, c.width, c.height);

  return {"canvas": c, "context": ctx, "imageData": imageData}
}

function diffPNG(attachmentnode, png1, png2) {
  if(png1 == null || png2 == null) {
    return;
  }
  var c1 = pngToCanvas(png1);
  var c2 = pngToCanvas(png2);

  var canvas = document.createElement("canvas");
  canvas.width = c1["canvas"].width;
  canvas.height = c1["canvas"].height;
  var context = canvas.getContext("2d");
  var imageData = context.getImageData(0,0, 250, 250);

  for(var i = 0; i < imageData.length; i = i + 1) {
    imageData[i] = Math.abs( c1["imageData"][i] - c2["imagedata"][i] );
  }

  context.putImageData(imageData,0,0);
  attachmentnode.appendChild(canvas);
}

function diffmapPNG(attachmentnode, png1, png2) {
  if(png1 == null || png2 == null) {
    return;
  }
  var c1 = pngToCanvas(png1);
  var c2 = pngToCanvas(png2);

  var c2 = pngToCanvas(png2);
  var canvas = document.createElement("canvas");
  canvas.width = c1.width;
  canvas.height = c1.height;
  var context = canvas.getContext("2d");
  var imageData = context.getImageData(0,0, canvas.width, canvas.height);

  for(var i = 0; i < imageData.length; i = i + 1) {
    if(imageData1[i] !== imageData2[i]) {
    if( c1["imageData"][i] !== c2["imagedata"][i] ) {
      setPixelAt(imageData, i);
    }
  }

  context.putImageData(imageData,0,0);
  attachmentnode.appendChild(c1);
}

