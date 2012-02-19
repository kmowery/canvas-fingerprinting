
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
  //context.font = "'Lusitana', serif;"
  context.font = "notevenafont;"
  context.textBaseline = "top";
  context.fillText("The lazy brown fox &c.",11, 1);

  fillForm(canvas);
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

