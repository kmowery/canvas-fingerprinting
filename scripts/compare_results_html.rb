#!/usr/bin/env ruby

require 'rubygems'
require 'nokogiri'
require 'pp'

require_relative '../model.rb'

if ARGV.length == 0 then
  puts "I need a filename"
  exit
end


ARGV.each {|filename|
  html = Nokogiri::HTML(open(filename))

  rows = []

  #entries = html.css('div#header').each {|x|
  #entries = html.xpath('//span[starts-with(@id, "long_answer")]').each {|x|
  html.css('tr').each {|row|

    row.css('span[id^="answer_long"]').each {|span|

      # If we find an answer in this row, check for links that are IDs
      userid = row.css("a").first.children.first.to_s.strip
      assignmentid = (/'.*'.*'(.*)'/.match row.css("a").first.attribute("onclick")).captures[0]


      # Why is there a <dl>? I don't know.
      dl = span.children[0]

      row = {}
      dl.css("dt").each {|c|
        row[c.inner_html.gsub(":","")] = c.next_sibling.next_sibling.inner_html
      }

      s = Sample.where(:userid => userid).first

      next if s.nil?

      pp "Duplicate: #{s.userid}"

      row.keys.select{ |k|  k =~ /exp-/ }.sort.each do |experiment_name|
        exp = Experiment.where(:name => experiment_name.gsub("exp-","")).first

        c = Canvas.where(:experiment_id => exp.id, :sample_id => s.id).first

        #pp "Clear" if c.png == row[experiment_name]
        if c.png != row[experiment_name] then
          pp "HERE WE GO"
        end
      end
    }
  }
}

