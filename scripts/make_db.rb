#!/usr/bin/env ruby -w -rubygems

require 'model.rb'

c = Create.new
c.up

a = AddPNG.new
a.up

links = AddList.new
links.up

