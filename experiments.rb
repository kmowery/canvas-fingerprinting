#!/usr/bin/env ruby -w -rubygems
require 'model.rb'

dev = Experiment.find_or_create_by_name('dev')
dev.name = "dev"
dev.scripts = ["/experiments/canvas-text/run.js"]
dev.save

webgl_teapot = Experiment.find_or_create_by_name('webgl-teapot')
webgl_teapot.name = "webgl-teapot"
webgl_teapot.scripts = ["/experiments/webgl-teapot/webgl.js"]
webgl_teapot.save

