#!/usr/bin/env ruby

require 'rubygems'
require 'active_record'
require 'json'

ActiveRecord::Base.establish_connection({:adapter=>'sqlite3',:database=>'index.db',:pool=>50,:timeout=>5000})

ActiveRecord::Base.include_root_in_json = false

class Experiment < ActiveRecord::Base
  has_many :canvas

  serialize :canvas_size, Hash
  serialize :scripts, Array
  serialize :links, Array
end

class Sample < ActiveRecord::Base
  has_many :canvas

  def browser
    return "Chrome " + $1 + " (WOW64)" if /WOW64/ =~ useragent and /Chrome\/([0-9\.]+)/ =~ useragent
    return "Chrome " + $1 if /Chrome\/([0-9\.]+)/ =~ useragent
    return "Firefox " + $1 + " (WOW64)" if /WOW64/ =~ useragent and /Firefox\/([0-9\.]+)/ =~ useragent
    return "Firefox " + $1 if /Firefox\/([0-9\.]+)/ =~ useragent

    # Safari needs to come after Chrome and Firefox
    return "Safari " + $1 if /Safari/ =~ useragent and /Version\/([0-9\.]+)/ =~ useragent

    return nil
  end

  def os
    return "Windows XP" if /Windows NT 5.1/ =~ useragent
    return "Windows Vista" if /Windows NT 6.0/ =~ useragent
    return "Windows 7" if /Windows NT 6.1/ =~ useragent

    return "Linux" if /Linux/ =~ useragent

    return "OSX 10.7.3" if /Mac OS X 10_7_3/ =~ useragent
    return "OSX 10.7.2" if /Mac OS X 10_7_2/ =~ useragent
    return "OSX 10.7.1" if /Mac OS X 10_7_1/ =~ useragent
    return "OSX 10.7.0" if /Mac OS X 10_7_0/ =~ useragent
    return nil
  end

  def title
    return browser + " " + os
  end
end

class Canvas < ActiveRecord::Base
  belongs_to :experiment
  belongs_to :sample

  def to_json(*a)
    {
      'id' => id,
      'useragent' => useragent,
      'title' => title,
      'pixels' => pixels,
      'png' => png
    }.to_json(*a)
  end

  def useragent
    return sample.useragent
  end

  def userinput
    return sample.userinput
  end

  def title
    return sample.title
  end
end

# Two choices for storing image data:
#   put JSON, extracted from a canvas data array, into pixels
#   put a Base64 encoded png, pulled from a canvas, into png
class Create < ActiveRecord::Migration
  def up
    create_table :experiments do |t|
      t.string :name
      t.string :scripts
      t.string :links
      t.string :canvas_size
      t.boolean :mt
    end

    create_table :samples do |t|
      t.string :useragent
      t.string :userinput
    end

    create_table :canvas do |t|
      t.integer :experiment_id
      t.integer :sample_id
      t.string :pixels
      t.string :png
    end
  end

  def down
    begin
      drop_table :experiments
    rescue
      puts "table 'experiments' doesn't exist"
    end
    begin
      drop_table :samples
    rescue
      puts "table 'samples' doesn't exist"
    end
    begin
      drop_table :canvas
    rescue
      puts "table 'canvas' doesn't exist"
    end
  end
end

