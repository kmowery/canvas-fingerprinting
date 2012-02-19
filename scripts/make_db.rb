#!/usr/bin/env ruby -w -rubygems

require 'model.rb'

c = Create.new
c.up

a = AddPNG.new
a.up

links = AddLinks.new
links.up

