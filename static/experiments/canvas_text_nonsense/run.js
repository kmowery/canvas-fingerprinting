
function supportsCanvas() {
  return !!document.createElement('canvas').getContext;
}
function supportsCanvasText() {
  var c = document.createElement('canvas');
  return c.getContext && typeof c.getContext('2d').fillText == 'function';
}

function draw(canvas) {
  var context = canvas.getContext("2d");
  context.font = "not even a font spec in the slightest";
  context.textBaseline = "top";
  context.fillText("How quickly daft jumping zebras vex. (Also, punctuation: &/c.)", 2, 2);
}

registerExperiment("canvas_text_nonsense", function(name, canvasid) {
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
  }

  draw(canvas);
  fillForm(name, canvas);
});


