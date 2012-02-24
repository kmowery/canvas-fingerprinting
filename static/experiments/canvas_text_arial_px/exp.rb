
canvas_text_arial_px = Experiment.find_or_create_by_name('canvas_text_arial_px')
canvas_text_arial_px.name = "canvas_text_arial_px"
canvas_text_arial_px.canvas_size = {:width => 415, :height => 30}
canvas_text_arial_px.scripts = [
  "/experiments/canvas_text_arial_px/run.js"]
canvas_text_arial_px.links = []
canvas_text_arial_px.mt = true
canvas_text_arial_px.save


