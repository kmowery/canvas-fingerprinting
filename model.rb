#!/usr/bin/env ruby

require 'active_record'

ActiveRecord::Base.establish_connection({:adapter=>'sqlite3',:database=>'index.db',:pool=>5,:timeout=>5000})

class Canvas < ActiveRecord::Base
end

class Create < ActiveRecord::Migration
  def up
    create_table :canvas do |t|
      t.string :experiment
      t.string :platform
      t.string :canvas_json
    end
  end

  def down
    drop_table :canvas
  end
end

