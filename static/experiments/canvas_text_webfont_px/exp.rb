
canvas_text_webfont_px = Experiment.where(name: 'canvas_text_webfont_px').first_or_create
canvas_text_webfont_px.name = "canvas_text_webfont_px"
canvas_text_webfont_px.canvas_size = {:width => 415, :height => 30}
canvas_text_webfont_px.scripts = [
  "http://ajax.googleapis.com/ajax/libs/webfont/1/webfont.js",
  "/experiments/canvas_text_webfont_px/run.js"]
canvas_text_webfont_px.mt = true
canvas_text_webfont_px.save


