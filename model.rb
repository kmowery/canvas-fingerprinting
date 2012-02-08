#!/usr/bin/env ruby -w -rubygems

require 'active_record'
require 'json'

ActiveRecord::Base.establish_connection({:adapter=>'sqlite3',:database=>'index.db',:pool=>50,:timeout=>5000})

class Experiment < ActiveRecord::Base
  has_many :canvas

  serialize :scripts, Array
end

class Canvas < ActiveRecord::Base
  belongs_to :experiment

  def to_json(*a)
    {
      'json_class'      => self.class.name,
      'data'            => [ id, useragent, title, canvas_json ]
    }.to_json(*a)
  end
end

class Create < ActiveRecord::Migration
  def up
    create_table :experiments do |t|
      t.string :name
      t.string :scripts
    end

    create_table :canvas do |t|
      t.integer :experiment_id
      t.string :useragent
      t.string :title
      t.string :canvas_json
    end
  end

  def down
    begin
      drop_table :experiments
    rescue
      puts "table 'experiments' doesn't exist"
    end
    begin
      drop_table :canvas
    rescue
      puts "table 'canvas' doesn't exist"
    end
  end
end

