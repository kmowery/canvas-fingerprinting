
var vertex_shaders = [
"attribute vec3 aVertexPosition;" +
"uniform mat4 uMVMatrix;" +
"uniform mat4 uPMatrix;" +
"void main(void) {" +
  "gl_Position = uPMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);" +
"}",

]

var fragment_shaders = [
"precision mediump float;" +
"void main(void) {" +
   "gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);" +
"}",

]

