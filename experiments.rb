#!/usr/bin/env ruby -w -rubygems
require 'model.rb'

require 'find'

# Includes any ruby files under ./static .
# Use these to define experiments.
Find.find("./static") do |path|
  require path if path =~ /.*\.rb/
end


dev = Experiment.find_or_create_by_name('dev')
dev.name = "dev"
dev.canvas_size = {:width => 150, :height => 15}
dev.scripts = ["/experiments/canvas-text/run.js"]
dev.links = [ {:href=>"http://fonts.googleapis.com/css?family=Lusitana", :rel=>'stylesheet', :type=>"text/css"} ]
dev.mt = true
dev.save

webgl_teapot = Experiment.find_or_create_by_name('webgl-teapot')
webgl_teapot.name = "webgl-teapot"
webgl_teapot.canvas_size = {:width => 250, :height => 250}
webgl_teapot.scripts = [
  "/gl-matrix-min-1.2.3.js",
  "/webgl-debug.js",
  "/experiments/webgl-teapot/webgl.js",
  "/experiments/webgl-teapot/shaders.js",
  "/experiments/webgl-teapot/objects.js",
]
webgl_teapot.mt = true
webgl_teapot.save

