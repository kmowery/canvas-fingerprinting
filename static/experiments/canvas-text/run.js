
function supportsCanvas() {
  return !!document.createElement('canvas').getContext;
}
function supportsCanvasText() {
  var c = document.createElement('canvas');
  return c.getContext && typeof c.getContext('2d').fillText == 'function';
}

function draw() {
  var canvas = document.getElementById("scratch");
  var context = canvas.getContext("2d");
  context.fillRect(1,0, 2, 2);

  //context.font = "bold 12px sans-serif";
  context.font = "'Lusitana', serif;"
  context.textBaseline = "top";
  context.fillText("The lazy brown fox &c.",11, 1);

  var platformImageData = context.getImageData(0,0,140,15);
  var nonzero = {};
  for(var i in platformImageData.data) {
    if(platformImageData.data[i] !== 0) {
      nonzero[i] = platformImageData.data[i];
    }
  }
  var pixels = document.getElementById("pixels");
  pixels.innerHTML = JSON.stringify(nonzero).replace(/,\"/gi, ', \"');

  var fi = $('#forminput');
  fi.val(JSON.stringify(nonzero).replace(/,\"/gi, ', \"'));

  //var comparisons = document.getElementById("comparisons");
  //var samples = getSamples();
  //for(name in samples) {
  //  // Add a <p> and a <canvas>
  //  var title = document.createElement("p");
  //  title.innerHTML = name;

  //  var c = document.createElement("canvas");
  //  c.width = 140;
  //  c.height = 15;
  //  var cc = c.getContext("2d");
  //  var imageData = cc.getImageData(0,0,140,15);

  //  for(var i = 0; i < platformImageData.data.length; i++) {
  //    imageData.data[i] = platformImageData.data[i];

  //    if(i in samples[name]) {
  //      imageData.data[i] = Math.abs(imageData.data[i] -
  //          samples[name][i]);
  //    }
  //  }

  //  cc.putImageData(imageData, 0, 0);

  //  comparisons.appendChild(title);
  //  comparisons.appendChild(c);
  //}
}

$(document).ready(function() {
    if(!supportsCanvas()) {
      alert("No canvas support");
    }
    if(!supportsCanvasText()) {
      alert("No canvas text");
    }

    draw();
});

