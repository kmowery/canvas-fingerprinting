#!/usr/bin/env ruby -rubygems
require 'rubygems'
require 'sinatra'
require 'sinatra/reloader' if development?
require 'haml'
require 'facets/hash/except'
require 'pp'
require 'RMagick'
require 'base64'

require_relative 'model.rb'
require_relative 'experiments.rb'

# gem install activerecord sinatra sinatra-contrib json sqlite3 thin haml facets
#   rmagick

set :public_folder, File.dirname(__FILE__) + '/static'

# Turn off the X-Frame header to allow for mturk
set :protection, :except => :frame_options
enable :sessions

enable :logging
set :dump_errors, true

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
    when :groups
      return "/exp/#{exp[:name]}/groups/"
    end
  end
end

get '/' do
  @experiments = Experiment.all
  @experiments.sort_by! {|exp| exp.name}
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

  sample = Sample.new
  sample.useragent = env["HTTP_USER_AGENT"]
  sample.userinput = params["title"]
  sample.save

  @result.experiment_id = @exp.id
  @result.sample_id = sample.id
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
  #
  @result = Canvas.where(:id => id, :experiment_id => @exp.id).first
  redirect link_to(:results, @exp) and return if @result.nil?

  # There's no need to display the diff against every element. Use our group-by
  # methodology to only show diffs that matter
  @results = Canvas.where(:experiment_id => @exp.id)
  # We can't use Array's default group_by due to the behavior of Hash key
  # comparison and RMagick Image .eql? . Write our own!
  #
  #@groups = @results.group_by {|x| x.image}.values
  @groups = @results.group_by_equality {|x| x.image}

  @groups.map! { |array| array.sort_by {|x| x.sample.graphics_card} }
  @groups.sort_by! {|group| group[0].sample.browser + group[0].sample.graphics_card}

  haml :diff
end

get '/groups/?' do
  @exps = Experiment.all
  @samples = Sample.all

  ## Not the right sort of grouping
  @groups = @samples.group_by {|sample| sample.canvas.sort {|c| c.experiment_id}.map{|c| c.png}}.values

  puts @groups.length

  haml :all_groups
end

get '/exp/:experiment/groups/?' do |experiment|
  @exp = Experiment.where(:name => experiment).first
  @results = Canvas.find_all_by_experiment_id(@exp.id)
  # Broken for images
  #@groups = @results.group_by {|x| x.png}.values
  @groups = @results.group_by_equality {|x| x.image}

  # Sort each group by graphics card
  @groups.map! { |array| array.sort_by {|x| x.sample.graphics_card} }

  # Sort groups by first browser
  @groups.sort_by! {|group| group[0].sample.browser + group[0].sample.graphics_card}

  haml :result_groups
end


get '/mt' do
  @experiments = Experiment.where(:mt => true)

  @scripts = @experiments.reduce([]) do |array, exp|
    array | exp.scripts
  end
  @scripts = @scripts | ["/barrier.js"]

  haml :mt
end

post '/mt' do
  # TODO: add some sort of verification
  sample = Sample.new
  sample.useragent = params["useragent"]
  sample.userinput = params["input"]
  sample.webglvendor = params["webglvendor"]
  sample.webglversion = params["webglversion"]
  sample.webglrenderer = params["renderer"]

  sample.assignmentid = params["assignmentId"]
  sample.save

  params.select {|p| /exp-/ =~ p}.each_key do |p|
    exp = Experiment.where(:name => p.gsub("exp-","")).first
    c = Canvas.new

    c.experiment_id = exp.id
    c.sample_id = sample.id
    c.png = params[p]

    c.save
  end
  redirect '/mt'
end

