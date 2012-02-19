require 'model.rb'

gl_pointcoord = Experiment.find_or_create_by_name('conformance-gl-pointcoord')
gl_pointcoord.name = "conformance-gl-pointcoord"
gl_pointcoord.canvas_size = {:width => 256, :height => 256}
gl_pointcoord.scripts = [
  "/webgl-debug.js",
  "/conformance-support/js-test-pre.js",
  "/conformance-support/webgl-test.js",
  "/conformance-support/webgl-test-utils.js",

  {:id=>"vshader", :type=>"x-shader/x-vertex", :content=>
    "attribute vec4 vPosition;
    uniform float uPointSize;
    void main()
    {
      gl_PointSize = uPointSize;
      gl_Position = vPosition;
    }"},


  {:id=>"fshader", :type=>"x-shader/x-fragment", :content=>
    "precision mediump float;
    void main()
    {
      gl_FragColor = vec4(
        gl_PointCoord.x,
        gl_PointCoord.y,
        0,
        1);
    }"},

  {:type=>"text/javascript", :content=> <<END
  var gl;
  var canvas;
  var width;
  var height;
  $(document).ready(function() {
    if (window.initNonKhronosFramework) {
      window.initNonKhronosFramework(false);
    }

    // NOTE: I'm not 100% confident in this test. I think it is correct.

    wtu = WebGLTestUtils;
    gl = initWebGL("scratch", "vshader", "fshader", [ "vPosition"], [ 0, 0, 0, 1 ], 1);
    shouldBeNonNull("gl");
    shouldBe("gl.getError()", "gl.NO_ERROR");

    canvas = gl.canvas;
    width = canvas.width;
    height = canvas.height;
    shouldBe("width", "height");

    var maxPointSize = gl.getParameter(gl.ALIASED_POINT_SIZE_RANGE)[1];
    shouldBeTrue("maxPointSize >= 1");
    shouldBeTrue("maxPointSize % 1 == 0");

    maxPointSize = Math.min(maxPointSize, 64);
    var pointWidth = maxPointSize / width;
    var pointStep = Math.floor(maxPointSize / 4);
    var pointStep = Math.max(1, pointStep);

    var program = gl.program;
    var pointSizeLoc = gl.getUniformLocation(program, "uPointSize");
    gl.uniform1f(pointSizeLoc, maxPointSize);

    var pixelOffset = (maxPointSize % 2) ? (1 / width) : 0;
    var vertexObject = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexObject);
    gl.bufferData(
        gl.ARRAY_BUFFER,
        new Float32Array(
          [-0.5 + pixelOffset, -0.5 + pixelOffset,
            0.5 + pixelOffset, -0.5 + pixelOffset,
           -0.5 + pixelOffset,  0.5 + pixelOffset,
            0.5 + pixelOffset,  0.5 + pixelOffset]),
        gl.STATIC_DRAW);
    gl.enableVertexAttribArray(0);
    gl.vertexAttribPointer(0, 2, gl.FLOAT, false, 0, 0);

    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.drawArrays(gl.POINTS, 0, 4);
    shouldBe("gl.getError()", "gl.NO_ERROR");

    fillFormById("scratch");
  });
END
    },

]
gl_pointcoord.save

