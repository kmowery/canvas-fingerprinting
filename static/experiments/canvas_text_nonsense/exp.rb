
canvas_text_nonsense = Experiment.where(name: 'canvas_text_nonsense').first_or_create
canvas_text_nonsense.name = "canvas_text_nonsense"
canvas_text_nonsense.canvas_size = {:width => 415, :height => 30}
canvas_text_nonsense.scripts = [
  "/experiments/canvas_text_nonsense/run.js"]
canvas_text_nonsense.links = []
canvas_text_nonsense.mt = true
canvas_text_nonsense.save


