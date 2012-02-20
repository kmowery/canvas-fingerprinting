
function supportsCanvas() {
  return !!document.createElement('canvas').getContext;
}
function supportsCanvasText() {
  var c = document.createElement('canvas');
  return c.getContext && typeof c.getContext('2d').fillText == 'function';
}

function draw(canvas) {
  var context = canvas.getContext("2d");
  context.fillRect(1,0, 2, 2);

  //context.font = "bold 12px sans-serif";
  context.font = "'Lusitana', serif;"
  context.textBaseline = "top";
  context.fillText("The lazy brown fox &c.",11, 1);
}

registerExperiment("dev", function(name, canvasid) {
  if(!supportsCanvas()) {
    experimentFailed("no canvas support");
    return false;
  }
  if(!supportsCanvasText()) {
    experimentFailed("no canvas text support");
    return false;
  }

  var canvas = document.getElementById(canvasi);
  if(canvas === null) {
    canvas = document.createElement("canvas");
  }

  draw(canvas);

  fillForm(name, canvas);
});


