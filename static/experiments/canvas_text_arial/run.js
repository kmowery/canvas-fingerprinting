
function supportsCanvas() {
  return !!document.createElement('canvas').getContext;
}
function supportsCanvasText() {
  var c = document.createElement('canvas');
  return c.getContext && typeof c.getContext('2d').fillText == 'function';
}

registerExperiment("canvas_text_arial", function(name, canvasid) {
  if(!supportsCanvas()) {
    experimentFailed("no canvas support");
    return false;
  }
  if(!supportsCanvasText()) {
    experimentFailed("no canvas text support");
    return false;
  }

  var canvas = document.getElementById(canvasid);
  if(canvas === null) {
    canvas = document.createElement("canvas");
    canvas.setAttribute("width", 415);
    canvas.setAttribute("height", 30);
  }

  var context = canvas.getContext("2d");
  context.font = "18pt Arial";
  context.textBaseline = "top";
  context.fillText("How quickly daft jumping zebras vex. (Also, punctuation: &/c.)", 2, 2);

  fillForm(name, canvas);
});


