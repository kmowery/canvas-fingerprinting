
# Run this:
#  $ thin --debug --rackup config.ru start -p 4567 -l log.txt -d

require 'rack'
require 'logger'

#logger = Rack::CommonLogger.new("log.txt")
#use Rack::CommonLogger, logger

require 'thin'
Thin::Logging.trace = :log


require 'sinatra'

set :environment, :production

# Turn off the X-Frame header to allow for mturk
set :protection, :except => :frame_options
enable :sessions

enable :logging
set :dump_errors, true

require File.expand_path("compare.rb")

run Sinatra::Application

