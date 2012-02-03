#!/usr/bin/env ruby
require 'sinatra'
require 'sinatra/reloader' if development?

require 'model.rb'

set :public_folder, File.dirname(__FILE__) + '/static'

get '/' do
  'Hello world! oh no robot hurray cool robot things so many'
end

get '/create' do
  c = Canvas.create(:experiment => "dev", :platform => "OSX", :canvas_json => "[1,2,3]")
  c.platform
end

