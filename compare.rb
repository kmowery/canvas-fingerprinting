#!/usr/bin/env ruby -rubygems
require 'rubygems'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'haml'
require 'facets/hash/except'

require 'model.rb'
require 'experiments.rb'

# gem install activerecord sinatra sinatra-contrib json sqlite3 thin haml facets

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

get '/exp/:experiment/?' do |experiment|
  @exp = Experiment.where(:name => experiment).first

  # We're performing the experiment. Link in the appropriate scripts.
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

  # Policy: we store one sample per user-agent and title combination.
  @result = Canvas.where(:useragent => env["HTTP_USER_AGENT"],
                         :experiment_id => @exp.id,
                         :title => params["title"]).first

  puts "Creating new canvas" if @result.nil?
  @result = Canvas.create() if @result.nil?

  @result.experiment_id = @exp.id
  @result.useragent = env["HTTP_USER_AGENT"]
  @result.title = params["title"]
  @result.pixels = params["pixels"]
  @result.png = params["png"]
  @result.save

  redirect link_to(:result, @exp, @result)
end

get '/exp/:experiment/results/:id' do |experiment, id|
  # get the response, display it
  @exp = Experiment.where(:name => experiment).first

  # Policy: we store one sample per user-agent.
  # When and if we discover a collision here, we'll revisit.
  @result = Canvas.where(:id => id, :experiment_id => @exp.id).first

  redirect link_to(:results, @exp) and return if @result.nil?

  haml :result
end

delete '/exp/:experiment/results/:id' do |experiment, id|
  # get the response, display it
  @exp = Experiment.where(:name => experiment).first
  Canvas.delete_all(:id => id, :experiment_id => @exp.id)

  puts "OMG A DELETE"
  [200, "Yeah okay"]
end

get '/exp/:experiment/results/:id/json' do |experiment, id|
  @exp = Experiment.where(:name => experiment).first
  @result = Canvas.where(:id => id, :experiment_id => @exp.id).first
  body @result.pixels
end

get '/exp/:experiment/compare/:id' do |experiment, id|
  # get the response, display it
  @exp = Experiment.where(:name => experiment).first

  # Policy: we store one sample per user-agent.
  # When and if we discover a collision here, we'll revisit.
  @result = Canvas.where(:id => id, :experiment_id => @exp.id).first
  redirect link_to(:results, @exp) and return if @result.nil?

  @results = Canvas.where(:experiment_id => @exp.id)

  haml :diff
end


get '/mt' do
  @experiments = Experiment.where(:mt => true)

  @scripts = @experiments.reduce([]) do |array, exp|
    array | exp.scripts
  end


  haml :mt
end

post '/mt' do
  params.each do |p|
    puts p
  end
  redirect '/mt'
end

