
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
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);

    gl.bindTexture(gl.TEXTURE_2D, null);

    draw();
  }
  this.image.src = imageURL;
}

function VisibleObject( vertices, indices, texture, location, rotation ) {
  this.vertices = vertices;
  this.indices = indices;

  if(texture) {
    this.texture = texture;
  }

  this.vertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER,
                new Float32Array(this.vertices),
                gl.STATIC_DRAW);
  this.numVertices = vertices.length / 3;

  this.indexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);
  gl.bufferData(gl.ELEMENT_ARRAY_BUFFER,
                new Uint16Array(indices),
                gl.STATIC_DRAW);

  this.location = location || [0,0,0];
  this.rotation = rotation || [0,0,0];
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


  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indexBuffer);

  gl.uniformMatrix4fv(shaderProgram.pMatrixUniform, false, perspective);
  gl.uniformMatrix4fv(shaderProgram.mvMatrixUniform, false, mvMatrix);
  //gl.uniform1i(shaderProgram.useTexture,false);

  gl.drawElements(gl.TRIANGLES, this.indices.length, gl.UNSIGNED_SHORT, 0);

  popMVMatrix();
}

