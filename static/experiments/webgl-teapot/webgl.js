
// We cant' use global variables, since things might break if we include
// multiplc experiment scripts.
// Instead, we'll pass around a this object.


// Make a new experiment!
function WebGLTeapot(name, canvasid) {
  this.name = name;
  this.canvasid = canvasid;

  this.canvas = document.getElementById(canvasid);
  if(this.canvas === null) {
    this.canvas = document.createElement("canvas");
  }


  this.mvMatrix = mat4.create();
  this.mvMatrixStack = [];

  this.vertex_shaders = webgl_teapot_vertex_shaders();
  this.fragment_shaders = webgl_teapot_fragment_shaders();

  var that = this;
  this.drawBarrier = new Barrier(
      function() {
        that.draw();
      }
      );
  this.drawBarrier.register("setup");
}

WebGLTeapot.prototype.setupShaders = function () {
  var gl = this.gl;
  this.shaderProgram = gl.createProgram();
  var shaderProgram = this.shaderProgram;

  for(var i in this.vertex_shaders) {
    var shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, this.vertex_shaders[i]);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      experimentDied(this.name, "Shader did not compile: " + gl.getShaderInfoLog(shader));
      return false;
    }

    gl.attachShader(shaderProgram, shader);
  }
  for(var shader in this.fragment_shaders) {
    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, this.fragment_shaders[i]);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      experimentDied(this.name, "Shader did not compile: " + gl.getShaderInfoLog(shader));
      return false;
    }

    gl.attachShader(shaderProgram, shader);
  }
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    experimentDied(this.name, "could not initialize shaders");
    return false;
  }

  gl.validateProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS))
  {
    experimentDied("shaders did not validate:\n" + gl.getProgramInfoLog(shaderProgram));
    return false;
  }

  shaderProgram.vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(shaderProgram.vertexPosition);

  shaderProgram.vertexNormal = gl.getAttribLocation(shaderProgram, "aVertexNormal");
  gl.enableVertexAttribArray(shaderProgram.vertexNormal);

  shaderProgram.textureCoord = gl.getAttribLocation(shaderProgram, "aTextureCoord");
  gl.enableVertexAttribArray(shaderProgram.textureCoord);

  shaderProgram.pMatrixUniform = gl.getUniformLocation(shaderProgram, "uPMatrix");
  shaderProgram.mvMatrixUniform = gl.getUniformLocation(shaderProgram, "uMVMatrix");
  shaderProgram.samplerUniform = gl.getUniformLocation(shaderProgram, "uSampler");

  shaderProgram.nMatrixUniform = gl.getUniformLocation(shaderProgram, "uNMatrix");
  shaderProgram.ambientColorUniform = gl.getUniformLocation(shaderProgram, "uAmbientColor");
  shaderProgram.lightingDirectionUniform = gl.getUniformLocation(shaderProgram, "uLightingDirection");
  shaderProgram.directionalColorUniform = gl.getUniformLocation(shaderProgram, "uDirectionalColor");

  gl.useProgram(shaderProgram);
  return true;
}

WebGLTeapot.prototype.pushMVMatrix = function() {
  var copy = mat4.create();
  mat4.set(this.mvMatrix, copy);
  this.mvMatrixStack.push(copy);
}

WebGLTeapot.prototype.popMVMatrix = function () {
  this.mvMatrix = this.mvMatrixStack.pop();
}


WebGLTeapot.prototype.draw = function () {
  var gl = this.gl;
  var shaderProgram = this.shaderProgram;

  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var pMatrix = mat4.create();
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight,
                   0.1, 100.0, pMatrix);

  mat4.identity(this.mvMatrix);

  gl.validateProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS))
  {
    experimentDied(this.name, "Shader program did not validate:" +
                   + gl.getProgramInfoLog(shaderProgram));
    return;
  }


  for(var obj in this.objects) {
    this.objects[obj].draw(pMatrix);
  }

  // How to read pixels:
  //var buf = new Uint8Array(250*250*4);
  //gl.readPixels(0, 0, 250, 250, gl.RGBA, gl.UNSIGNED_BYTE, buf);
  //fillForm(buf);

  // Why do this here? because it needs to be re-done after we draw with the
  // texture
  fillForm(this.name, this.canvas);
}

WebGLTeapot.prototype.run = function () {
  this.canvas.width = 250;
  this.canvas.height = 250;

  this.gl = this.canvas.getContext("experimental-webgl",
          {preserveDrawingBuffer: true, antialias: true})
  //gl = document.getElementById("canvas").getContext("experimental-webgl",
  //        {preserveDrawingBuffer: true, antialias: false})

  if(!this.gl) {
    experimentDied(this.name, "no webgl");
    return;
  }

  //gl = WebGLDebugUtils.makeDebugContext(gl);

  this.gl.viewportWidth = 250;
  this.gl.viewportHeight = 250;

  if(!this.setupShaders()) {
    // shaders failed. bail.
    return;
  }

  var gl = this.gl;
  var shaderProgram = this.shaderProgram;


  var points = [];
  var textureCoords = [];
  var torender = [];

  var maxrows = 10;
  var maxcols = 10;

  for(var rows = 0; rows <= maxrows; rows = rows + 1) {
    for(var cols = 0; cols <= maxcols; cols = cols + 1) {
      var x = (rows / maxrows)*6 - 3;
      var y = (cols / maxcols)*6 - 3;

      var z = (Math.pow(y,2) / 2) - (Math.pow(x,2) / 3);
      //var z = 0;

      points.push(x);
      points.push(y);
      points.push(z);

      textureCoords.push( rows/maxrows );

      var offset = 5192/8192;
      textureCoords.push( (1-offset) + (cols/maxcols)*offset );
    }
  }

  for(var rows = 0; rows < maxrows; rows = rows +1) {
    for(var cols = 0; cols < maxcols; cols = cols +1) {
      var p1 = cols + (rows * (maxcols+1));
      var p2 = cols + (rows * (maxcols+1))+1;
      var p3 = cols + ((rows+1) * (maxcols+1));
      var p4 = cols + ((rows+1) * (maxcols+1))+1;

      // Use this odd order for normal generation
      torender.push(p1);
      torender.push(p3);
      torender.push(p2);

      torender.push(p2);
      torender.push(p3);
      torender.push(p4);
    }
  }

  this.objects = [new VisibleObject(
      this,
      points,
      torender,

    new Texture(this, "/images/ISO_12233-reschart-512x512.png",
      textureCoords),

    [0,0,-10],
    [0,0,0]
    //[0,Math.PI/2,0]
    )];

  // Abstract lights out into draw somewhere
  gl.uniform3f(shaderProgram.ambientColorUniform, 0.1, 0.1, 0.1);
  var lightDirection = vec3.create( [2, 4, 9.0] );
  vec3.normalize(lightDirection);
  gl.uniform3fv(shaderProgram.lightingDirectionUniform, lightDirection);
  gl.uniform3f(shaderProgram.directionalColorUniform, 0.8, 0.8, 0);


  //objects = [new VisibleObject( [
  //  0.0,  1.0,  0.0,
  //  -1.0, -1.0,  0.0,
  //  1.0, -1.0,  0.0],

  //  [0,1,2],

  //  //null,
  //  new Texture( "/images/ISO_12233-reschart-square-small.png",
  //    [0.0, 0.0,
  //    1.0, 0.0,
  //    0.0, 1.0]),

  //  [0,0,-5],
  //  [Math.PI/4, Math.PI/4, Math.PI/4]
  //  )];

  this.drawBarrier.notify("setup");
  //this.draw();

  //var renderer = gl.getParameter(gl.RENDERER);
  //var vendor = gl.getParameter(gl.VENDOR);
  //var version = gl.getParameter(gl.VERSION);

  //var x = document.createElement("p");
  //x.innerHTML = "Renderer:" + renderer + " vendor: " + vendor + " version: " + version;
  //document.getElementById("info").appendChild(x);
}


registerExperiment("webgl-teapot", function(name, canvasid) {
  exp = new WebGLTeapot(name, canvasid);
  exp.run();
});

