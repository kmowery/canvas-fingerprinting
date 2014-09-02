
canvas_text_webfont = Experiment.where(name: 'canvas_text_webfont').first_or_create
canvas_text_webfont.name = "canvas_text_webfont"
canvas_text_webfont.canvas_size = {:width => 415, :height => 30}
canvas_text_webfont.scripts = [
  "http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",
  "/experiments/canvas_text_webfont/run.js"]
canvas_text_webfont.mt = true
canvas_text_webfont.save


