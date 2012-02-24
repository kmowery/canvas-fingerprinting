#!/usr/bin/env ruby

require 'rubygems'
require 'nokogiri'
require 'pp'

require_relative '../model.rb'

if ARGV.length == 0 then
  puts "I need a filename"
  exit
end

html = Nokogiri::HTML(open(ARGV[0]))

rows = []

#entries = html.css('div#header').each {|x|
#entries = html.xpath('//span[starts-with(@id, "long_answer")]').each {|x|
html.css('span[id^="answer_long"]').each {|span|
  # Why is there a <dl>? I don't know.
  dl = span.children[0]

  row = {}
  dl.css("dt").each {|c|
    row[c.inner_html.gsub(":","")] = c.next_sibling.next_sibling.inner_html
  }

  s = Sample.new
  s.useragent = row["useragent"]
  s.userinput = row["input"]
  s.webglrenderer = row["renderer"]
  s.webglversion = row["webglversion"]
  s.webglvendor = row["webglvendor"]
  s.save

  pp row if /Safari/ =~ s.browser

  puts "Browser unclear: " + s.useragent if s.browser.nil?
  puts "OS unclear: " + s.useragent if s.os.nil?

  row.keys.select{ |k|  k =~ /exp-/ }.sort.each do |experiment_name|
    exp = Experiment.where(:name => experiment_name.gsub("exp-","")).first
    c     = Canvas.new

    c    .experiment_id = exp.id
    c    .sample_id = s.id
    c    .png = row[experiment_name]
    c.save
  end
}

