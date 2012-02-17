
// TODO: deal with active texture somehow?
function Texture(imageURL, textureCoords) {
  this.gltexture = gl.createTexture();

  this.textureCoords = textureCoords;
  this.textureCoordsBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.textureCoordsBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(this.textureCoords),
                gl.STATIC_DRAW);

  var texture = this;

  this.image = new Image();
  this.image.onload = function() {
    gl.bindTexture(gl.TEXTURE_2D, texture.gltexture);
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE,
                  texture.image);

    // Use nearest for now to try to force antialiasing to do a thing
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    //gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //gl.generateMipmap(gl.TEXTURE_2D);

    gl.bindTexture(gl.TEXTURE_2D, null);

    draw();
  }
  this.image.src = imageURL;
}

function VisibleObject( vertices, indices, texture, location, rotation ) {
  this.vertices = vertices;
  this.indices = indices;
  this.numVertices = vertices.length / 3;

  this.vertexVectors = [];
  for(var i = 0; i < vertices.length; i = i + 3) {
    var v = vec3.create(this.vertices.slice(i, i+3));
    this.vertexVectors.push(v);
  }

  if(texture) {
    this.texture = texture;
  }

  this.makeNormals();

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(this.vertices),
                gl.STATIC_DRAW);

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indices),
                gl.STATIC_DRAW);

  this.normalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.normals), gl.STATIC_DRAW);


  this.location = location || [0,0,0];
  this.rotation = rotation || [0,0,0];
}

VisibleObject.prototype.makeNormals = function() {
  this.normals = [];

  for(var p = 0; p < this.numVertices; p += 1) {
    // For each vertex:
    //   1. find a place where it is used in the indexBuffer
    //   2. Generate a normal by crossing those vectors
    var loc = this.indices.indexOf(p);
    var triplet = Math.floor(loc/3)*3;

    var vertices = this.indices.slice(triplet, triplet+3);

    // rotate the vector such that p is the first element
    while(vertices[0] !== p) {
      vertices.push(vertices.shift());
    }

    // Now do cross-products, using vertices[0]+[1] and vertices[0]+[2]
    var v0 = this.vertexVectors[vertices[0]];
    var v1 = this.vertexVectors[vertices[1]];
    var v2 = this.vertexVectors[vertices[2]];

    var d0 = vec3.create();
    vec3.subtract(v1, v0, d0);
    var d1 = vec3.create();
    vec3.subtract(v2, v0, d1);

    var cross = vec3.create();
    vec3.cross(d0, d1, cross);
    vec3.normalize(cross);

    this.normals.push(cross[0]);
    this.normals.push(cross[1]);
    this.normals.push(cross[2]);
  }
}

VisibleObject.prototype.draw = function(perspective) {
  pushMVMatrix();

  mat4.translate(mvMatrix, this.location);

  if(this.rotation !== null) {
    mat4.rotateX(mvMatrix, this.rotation[0], mvMatrix);
    mat4.rotateY(mvMatrix, this.rotation[1], mvMatrix);
    mat4.rotateZ(mvMatrix, this.rotation[2], mvMatrix);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexPosition,
                         3,
                         gl.FLOAT,
                         false,
                         0,0);

  if(this.texture) {
    gl.bindBuffer(gl.ARRAY_BUFFER, this.texture.textureCoordsBuffer);
    gl.vertexAttribPointer(shaderProgram.textureCoord,
        2, gl.FLOAT, false, 0, 0);

    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, this.texture.gltexture);
    gl.uniform1i(shaderProgram.samplerUniform, 0);
  }

  gl.bindBuffer(gl.ARRAY_BUFFER, this.normalBuffer);
  gl.vertexAttribPointer(shaderProgram.vertexNormal, 3, gl.FLOAT, false, 0, 0);


  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, perspective);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);

  // magic. I might have known what this did once while I was taking graphics...
  var normalMatrix =  mat3.create();
  mat4.toInverseMat3(mvMatrix, normalMatrix);
  mat3.transpose(normalMatrix);
  gl.uniformMatrix3fv(shaderProgram.nMatrixUniform, false, normalMatrix);

  gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

  popMVMatrix();
}

