#!/usr/bin/env ruby -w -rubygems

require 'active_record'

ActiveRecord::Base.establish_connection({:adapter=>'sqlite3',:database=>'index.db',:pool=>5,:timeout=>5000})

class Experiment < ActiveRecord::Base
  has_many :canvas
end

class Canvas < ActiveRecord::Base
  belongs_to :experiment
end

class Create < ActiveRecord::Migration
  def up
    create_table :experiments do |t|
      t.string :name
    end

    create_table :canvas do |t|
      t.integer :experiment_id
      t.string :platform
      t.string :canvas_json
    end
  end

  def down
    drop_table :canvas
  end
end

