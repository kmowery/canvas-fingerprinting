#!/usr/bin/env ruby -rubygems
require 'rubygems'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'haml'

require 'model.rb'
require 'experiments.rb'

set :public_folder, File.dirname(__FILE__) + '/static'

get '/' do
  'Hello world! oh no robot hurray cool robot things so many'
end

get '/create' do
  c = Canvas.create(:experiment => "dev", :platform => "OSX", :canvas_json => "[1,2,3]")
  c.platform
end

get '/exp/:experiment' do |experiment|
  @exp = Experiment.where(:name => experiment).first

  if @exp.nil?
    body "Invalid experiment"
    status 404
    return
  end

  @scripts = @exp.scripts
  @onload = @exp.onload

  haml :experiment
end

post '/exp/:experiment/results' do |experiment|
  # store the response
  # redirect to id page
  puts params[:pixels]

  redirect "/exp/#{experiment}/results/0"

end

get '/exp/:experiment/results/:id' do |experiment, id|
  # get the response, display it
  id
end

