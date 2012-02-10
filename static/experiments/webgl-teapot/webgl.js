

var gl;
var shaderProgram;

function setupShaders() {
  shaderProgram = gl.createProgram();

  for(var i in vertex_shaders) {
    var shader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(shader, vertex_shaders[i]);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    gl.attachShader(shaderProgram, shader);
  }
  for(var shader in fragment_shaders) {
    var shader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(shader, fragment_shaders[i]);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(shader));
      return null;
    }

    gl.attachShader(shaderProgram, shader);
  }
  gl.linkProgram(shaderProgram);

  if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
    alert("Could not initialise shaders");
  }

  gl.validateProgram(shaderProgram);
  if (!gl.getProgramParameter(shaderProgram, gl.VALIDATE_STATUS))
  {
    alert("Error during program validation:\n" + gl.getProgramInfoLog(shaderProgram));return;
  }

  gl.useProgram(shaderProgram);
}

function drawSolid(perspectiveM, buffer, position, rotate) {
  var mv = mat4.create();
  mat4.identity(mv);

  if(position !== null) {
    mat4.translate(mv, position);
  }
  if(rotate !== null) {
    mat4.rotateX(mv, rotate[0], mv);
    mat4.rotateY(mv, rotate[1], mv);
    mat4.rotateZ(mv, rotate[2], mv);
  }

  var vertexPosition = gl.getAttribLocation(shaderProgram, "aVertexPosition");
  gl.enableVertexAttribArray(vertexPosition);

  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.vertexAttribPointer(vertexPosition,
      3, // size of vertices
      gl.FLOAT, false, 0, 0);

  gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uPMatrix"), false, perspectiveM);
  gl.uniformMatrix4fv(gl.getUniformLocation(shaderProgram, "uMVMatrix"), false, mv);

  gl.drawArrays(gl.TRIANGLES, 0, buffer.length);
}


$(document).ready(function() {
  $("#scratch").width(250);
  $("#scratch").height(250);

  gl = WebGLDebugUtils.makeDebugContext(
    document.getElementById("scratch").getContext("experimental-webgl"));

  if(!gl) {
    alert("No webgl");
    return;
  }


  gl.viewportWidth = 250;
  gl.viewportHeight = 250;


  setupShaders();

  var b = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, b);
  var vertices = [
    0.0,  1.0,  0.0,
    -1.0, -1.0,  0.0,
    1.0, -1.0,  0.0
      ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
  b.length = vertices.length/3;


  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.enable(gl.DEPTH_TEST);

  gl.viewport(0, 0, gl.viewportWidth, gl.viewportHeight);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  var pMatrix = mat4.create();
  mat4.perspective(45, gl.viewportWidth / gl.viewportHeight, 0.1, 100.0, pMatrix);

  drawSolid(pMatrix, b, [0,0,-5], [Math.PI/4, Math.PI/4, Math.PI/4]);
});

