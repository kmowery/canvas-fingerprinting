#!/usr/bin/env ruby

require_relative '../model.rb'

c = Create.new
c.up

a = AddPNG.new
a.up

links = AddLinks.new
links.up

require_relative '../experiments.rb'

