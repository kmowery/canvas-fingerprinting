Canvas Fingerprinting
=====================

This is a small webapp to facilitate collecting `<canvas>`-based fingerprints
from many disparate users, as well as view and group the resulting images.

Quick Start
-----------

1. Install dependencies:

   > `gem install activerecord sinatra sinatra-contrib json sqlite3 thin haml facets rmagick`

2. Start Sinatra:

   > `ruby compare.rb`

3. Visit `localhost:4567`.


Data
----

Currently, index.db contains the anonymized results of our experiments on
Mechanical Turk. We collected data from 300 users for the tests
`canvas_text_arial`, `canvas_text_arial_px`, `canvas_text_webfont`,
`canvas_text_webfont_px`, `canvas_text_nonsense`, and `webgl-teapot`
experiments.

If you want an empty database, delete index.db and run `./scripts/make_db.rb`.

If you run a Mechanical Turk experiment, you'll need to reimport the data that
your workers uploaded to Amazon. Due to the large size of the PNGs, Mechanical
Turk's data export tools fail to work. As a workaround, we provide
`./scripts/import_results_html.rb`. To use this script, first navigate to the
"Approved" tab in the "Review HIT" section of the Mechanical Turk Requester
site. Next, save this page to disk as an HTML file. (You may need to do this
multiple times, due to pagination). Finally, run the import script and pass in
all the saved HTML files. When you next start the server, your MT data will be
available for viewing.


Adding a New Experiment
-----------------------

1. Create a new directory under `/static/experiments/`. Let's call ours `foo`.

2. Create the file `/static/experiments/foo/run.js`:

   ```js
   registerExperiment("foo", function(name, canvasid) {
      var canvas = document.getElementById(canvasid);

      // draw something on this canvas
      // ...

      fillForm(name, canvas);
   }
   ```

   This hooks your experiment into the client-side collection framework, which
   handles extracting pixel data, encoding, and passing the results back to the
   server. As an added bonus, this allows your experiment to coexist peacefully
   alongside other fingerprinting experiments on the same page.

3. Now, we need to tell Sinatra about the new experiment. Create
   `/static/experiments/foo/exp.rb`:

   ```ruby
   foo = Experiment.find_or_create_by_name('foo')
   foo.name = "foo"
   foo.canvas_size = {:width => 415, :height => 30}
   foo.scripts = ["/experiments/foo/run.js"]
   foo.links = []
   foo.mt = true
   foo.save
   ```

   These few lines characterize this experiment and its dependencies. Any
   elements in `scripts` will be included via `<script>` tags in the resulting
   output. `links` is similar, but requires a hash characterizing the link,
   which will be placed in the document's `<head>` (e.g. `foo.links = [
   {:href=>"http://fonts.googleapis.com/css?family=Lusitana",
   :rel=>'stylesheet', :type=>"text/css"} ]`). `mt` indicates if this experiment
   should be included in Mechanical Turk mode.

   Upon startup, the server will check for and execute code in any Ruby files
   under `/static`, so we don't need to register this experiment anywhere else.

4. Restart the Sinatra server. Your new experiment should now happily exist.

Running on Amazon Mechanical Turk
---------------------------------

Mechanical Turk mode allows you to quickly run a number of `<canvas>`
fingerprints from a single page, as well as collect alternate form data from the
Mechanical Turk worker. Any experiment whose `mt` parameter is true will be
included, although the results are not shown to the user being fingerprinted.

This mode is accessed at `http://yourserver/mt`.

### 1. Set up a Thin server

Run `$ thin --debug --rackup config.ru start -p 4567`. `config.ru` disables the
X-Frame HTTP header, which allows Mechanical Turk to frame your survey in their
worker UI.

Test your server by going to `http://yourserver:4567/mt`.

### 2. Configure Mechanical Turk

Edit the `js_hit.properties` and `js_hit.question` files in `/mt_config/`.
Refer to the Amazon Mechanical Turk documentation for the proper options.
Make sure that your server's URL is in `js_hit.question`.

Next, edit `views/mt.haml` to point to the appropriate endpoint. Uncomment the
endpoint you'd like to target: local, sandbox, or live. Local will submit
results back to your local server; sandbox allows you to test against the MT
sandbox; live is what you'll use during actual surveying.

### 3. Load your experiment into Mechanical Turk

Acquire the Mechanical Turk command line tools and run something like this:
```
$ cd ~/src/aws-mturk-clt-1.3.0/bin/
$ ./loadHITs.sh -maxhits 5 -input ~/src/canvas-fingerprinting/mt_config/js_hit.input -question ~/src/canvas-fingerprinting/mt_config/js_hit.question -question ~/src/canvas-fingerprinting/mt_config/js_hit.question  -properties mturk.properties
```

Refer to the Mechanical Turk documentation for setup and configuration of the
command line tools and for further instructions on this step.

Notes
-----
I seem to remember adding a feature to MT mode whereby the mechanical turk
worker will post their results back to me before sending them to Amazon, thus
skipping the annoying HTML import method. This _should_ be working. You'll need
to enter your server's address in `/views/mt.haml`, though. There should
probably be a switch for this.
