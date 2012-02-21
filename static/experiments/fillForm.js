
// Make a test harness for running experiments
var experiments = {}
function registerExperiment(name, f) {
  experiments[name] = f;
}

function runExperiment(name, canvasid) {
  if(name in experiments) {
    experiments[name](name, canvasid);
  }
}


// data should be an array with pixel data in it
function fillForm(experiment, canvas) {
  var base64png = canvas.toDataURL("image/png");

  var pixels = document.getElementById("pixels");
  if(pixels !== null) {
    pixels.innerHTML = base64png;
  }

  var form = document.getElementById("exp-"+experiment);
  if(form === null) {
    // Get the png field from the standard form.
    form = document.getElementById("png");
  }

  form.value = base64png;

  if((typeof mtBarrier) !== "undefined") {
    mtBarrier.notify(experiment);
  }
}

function experimentDied(experiment, reason) {
  var pixels = document.getElementById("pixels");
  if(pixels !== null) {
    pixels.innerHTML = reason;
  }

  var form = document.getElementById("exp-"+experiment);
  if(form === null) {
    // Get the png field from the standard form.
    form = document.getElementById("png");
  }

  form.value = reason;

  if((typeof mtBarrier) !== "undefined") {
    mtBarrier.notify(experiment);
  }
}

function fillFormById(id) {
  fillForm(document.getElementById(id));
}

