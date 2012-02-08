#!/usr/bin/env ruby -rubygems
require 'rubygems'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'haml'

require 'model.rb'
require 'experiments.rb'

set :public_folder, File.dirname(__FILE__) + '/static'
enable :sessions

helpers do
  def jsonify(json)
    "JSON.parse('" + json.gsub("'", "\'") + "')"
  end

  def link_to(where, exp, result = nil)
    case where
    when :exp
      return "/exp/#{exp[:name]}"
    when :results
      return "/exp/#{exp[:name]}/results/"
    when :result
      return "/exp/#{exp[:name]}/results/#{result[:id]}"
    when :diff
      return "/exp/#{exp[:name]}/compare/#{result[:id]}"
    end
  end
end



get '/' do
  @experiments = Experiment.all
  haml :list_experiments
end

before '/exp/:experiment*' do |experiment, trash|
  if @exp = Experiment.where(:name => experiment).count == 0
    halt 404, "Invalid experiment"
  end
end

get '/exp/:experiment' do |experiment|
  @exp = Experiment.where(:name => experiment).first
  @scripts = @exp.scripts

  haml :experiment
end

get '/exp/:experiment/results/?' do |experiment|
  @exp = Experiment.where(:name => experiment).first
  @results = Canvas.where(:experiment_id => @exp.id)

  haml :list_results
end


post '/exp/:experiment/results' do |experiment|
  @exp = Experiment.where(:name => experiment).first

  # Policy: we store one sample per user-agent.
  # When and if we discover a collision here, we'll revisit.
  @result = Canvas.where(:useragent => env["HTTP_USER_AGENT"],
                         :experiment_id => @exp.id).first

  puts "Creating new canvas" if @result.nil?
  @result = Canvas.create() if @result.nil?

  @result.experiment_id = @exp.id
  @result.useragent = env["HTTP_USER_AGENT"]
  @result.title = params["title"]
  @result.canvas_json = params["pixels"]
  @result.save

  redirect link_to(:result, @exp, @result)
  #redirect "/exp/#{experiment}/results/#{@result.id}"

  puts
  puts @result
  puts @exp.id
  puts params["title"]
end

get '/exp/:experiment/results/:id' do |experiment, id|
  # get the response, display it
  @exp = Experiment.where(:name => experiment).first

  # Policy: we store one sample per user-agent.
  # When and if we discover a collision here, we'll revisit.
  @result = Canvas.where(:id => id, :experiment_id => @exp.id).first

  haml :result
end

get '/exp/:experiment/results/:id/json' do |experiment, id|
  @exp = Experiment.where(:name => experiment).first
  @result = Canvas.where(:id => id, :experiment_id => @exp.id).first
  body @result.canvas_json
end

get '/exp/:experiment/compare/:id' do |experiment, id|
  # get the response, display it
  @exp = Experiment.where(:name => experiment).first

  # Policy: we store one sample per user-agent.
  # When and if we discover a collision here, we'll revisit.
  @result = Canvas.where(:id => id, :experiment_id => @exp.id).first
  @results = Canvas.where(:experiment_id => @exp.id)

  haml :diff
end

