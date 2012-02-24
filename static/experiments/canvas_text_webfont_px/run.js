
function supportsCanvas() {
  return !!document.createElement('canvas').getContext;
}
function supportsCanvasText() {
  var c = document.createElement('canvas');
  return c.getContext && typeof c.getContext('2d').fillText == 'function';
}

registerExperiment("canvas_text_webfont_px", function(name, canvasid) {
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

  WebFont.load({
    google: {
              families: ['Sirin+Stencil::latin']
    },

    fontactive: function(fontFamily, fontDescription) {
      if(fontFamily === 'Sirin Stencil') {
        var context = canvas.getContext("2d");
        context.font = "15px 'Sirin Stencil'";
        context.textBaseline = "top";
        context.fillText("How quickly daft jumping zebras vex. (Also, punctuation: &/c.)", 2, 2);
        fillForm(name, canvas);
      }
    },
    fontinactive: function(fontFamily, fontDescription) {
      if(fontFamily === 'Sirin Stencil') {
        var context = canvas.getContext("2d");
        context.font = "15px 'Sirin Stencil'";
        context.textBaseline = "top";
        context.fillText("How quickly daft jumping zebras vex. (Also, punctuation: &/c.)", 2, 2);
        fillForm(name, canvas);
      }
    }
  });
});


