
canvas_text_nonsense = Experiment.find_or_create_by_name('canvas_text_nonsense')
canvas_text_nonsense.name = "canvas_text_nonsense"
canvas_text_nonsense.canvas_size = {:width => 415, :height => 30}
canvas_text_nonsense.scripts = [
  "/experiments/canvas_text_nonsense/run.js"]
canvas_text_nonsense.links = []
canvas_text_nonsense.mt = true
canvas_text_nonsense.save


