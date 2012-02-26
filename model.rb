#!/usr/bin/env ruby

require 'rubygems'
require 'active_record'
require 'json'

ActiveRecord::Base.establish_connection({:adapter=>'sqlite3',:database=>'index.db',:pool=>50,:timeout=>5000})

ActiveRecord::Base.include_root_in_json = false

class Experiment < ActiveRecord::Base
  has_many :canvas, :class_name => "Canvas"

  serialize :canvas_size, Hash
  serialize :scripts, Array
  serialize :links, Array
end

class Sample < ActiveRecord::Base
  has_many :canvas, :class_name => "Canvas"

  def browser
    return "Chrome " + $1 + " (WOW64)" if /WOW64/ =~ useragent and /Chrome\/([0-9\.]+)/ =~ useragent
    return "Chrome " + $1 if /Chrome\/([0-9\.]+)/ =~ useragent
    return "Firefox " + $1 + " (WOW64)" if /WOW64/ =~ useragent and /Firefox\/([0-9\.]+)/ =~ useragent
    return "Firefox " + $1 if /Firefox\/([0-9\.]+)/ =~ useragent

    # Safari needs to come after Chrome and Firefox
    return "Safari " + $1 if /Safari/ =~ useragent and /Version\/([0-9\.]+)/ =~ useragent

    return "Opera " + $1 if /Opera\/([0-9\.]+)/ =~ useragent

    return "UNKNOWN"
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
    return "OSX 10.6.8" if /Mac OS X 10_6_8/ =~ useragent
    return "UNKNOWN"
  end

  def graphics_card
    device_id = ""
    device_id = " (Device #{$1.strip})" if /Device ID\r?\n([^\n]*?)\n/m =~ userinput
    device_id = " (Device #{$1.strip})" if /Device ID(.*)Adapter RAM/m =~ userinput
    device_id = " (Device #{$1.strip})" if /szDeviceId(.*)/ =~ userinput

    # Firefox
    if /Adapter Description\r?\n([^\n]*?)\n/m =~ userinput then
      return $1.strip + device_id
    end
    return $1.strip + device_id if /Adapter Description(.*?)Vendor ID/ =~ userinput
    return $1.strip + device_id if /Karten-Beschreibung(.*?)Vendor-ID/m =~ userinput
    return $1.strip + device_id if /Description de la carte(.*?)ID du vendeur/m =~ userinput

    # Google Chrome
    return $1.strip + device_id if /szDescription(.*)/ =~ userinput
    return $1.strip + device_id if /GL_RENDERER(.*)/ =~ userinput and $1.length > 0

    return webglrenderer if /Safari/ =~ browser

    return "UNKNOWN"
  end

  def title
    return "(#{graphics_card}) (#{browser}) (#{os})"
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

  def image
    begin
      @image ||= Magick::Image.from_blob(Base64.urlsafe_decode64(png.split(",")[-1]))[0]
    rescue ArgumentError => ae
      @image = Magick::Image.new(1, 1) { self.background_color = 'black' }
    end
    return @image
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
      t.string :webglvendor
      t.string :webglversion
      t.string :webglrenderer
      t.string :assignmentid
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

# I hate monkey-patching.
# But this is idiomatic.
class Array
  def group_by_equality()
    groups = []
    each {|r|
      other = groups.each {|g|
        one = yield g[0]
        two = yield r
        if one == two then

          # Custom
          if g[0].png != r.png then
            p "#{g[0].sample.browser} #{r.sample.browser} different"
          end

          g.push(r)
          break
        end
      }
      if ! other.nil? then
        groups.push( [r] )
      end
    }
    return groups
  end
end


