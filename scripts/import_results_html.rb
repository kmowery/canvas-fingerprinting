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
  #puts dl.children.length
  #puts dl.children[0].class
  #puts dl.children[0].name

  row = {}
  dl.css("dt").each {|c|
    #puts "Inner html: " + c.inner_html if c.name == "dt"
    #puts "dd: " + c.next_sibling.next_sibling.name
    row[c.inner_html.gsub(":","")] = c.next_sibling.next_sibling.inner_html
  }

  #puts row["useragent"]
  #puts row["exp-canvas_text_nonsense"]

  #pp row.keys
  #pp row.keys.select{ |k|  k =~ /exp-canvas_text_nonsense/ }

  #pp row["exp-canvas_text_nonsense"]

  #row.keys.select{ |k|  k =~ /exp-canvas_text_nonsense/ }.each do |experiment_name|
  row.keys.select{ |k|  k =~ /exp-/ }.each do |experiment_name|
    #exp = Experiment.where(:name => experiment_name.gsub("exp-","")).first
    #c     = Canvas.new

    #c    .experiment_id = exp.id
    #c    .useragent = row["useragent"]
    #c    .png = row[experiment_name]
    #c    .title = ""
    #c.save
  end

  puts row["input"]


  #span.search('dt', 'dd').each {|dt|
  #  pp dt
  #}
  #pp x['id']

  #rows.push(row)
}

