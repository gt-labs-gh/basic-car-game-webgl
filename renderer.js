// renderer.js
// Owns WebGL2 setup: shaders, buffers, and a drawRect() API.

export function createRenderer(canvas) {
  /** @type {WebGL2RenderingContext} */
  const gl = canvas.getContext("webgl2", { antialias: true });
  if (!gl) throw new Error("WebGL2 not supported");

  // ---------- Resize handling ----------
  function resizeToDisplaySize() {
    const dpr = Math.max(1, window.devicePixelRatio || 1);
    const displayWidth = Math.floor(canvas.clientWidth * dpr);
    const displayHeight = Math.floor(canvas.clientHeight * dpr);

    if (canvas.width !== displayWidth || canvas.height !== displayHeight) {
      canvas.width = displayWidth;
      canvas.height = displayHeight;
      gl.viewport(0, 0, canvas.width, canvas.height);
    }
  }

  // ---------- Shaders ----------
  const vsSource = `#version 300 es
  in vec2 a_pos;
  uniform vec2 u_translate;
  uniform vec2 u_scale;

  void main() {
    vec2 p = a_pos * u_scale + u_translate;
    gl_Position = vec4(p, 0.0, 1.0);
  }
  `;

  const fsSource = `#version 300 es
  precision highp float;
  uniform vec4 u_color;
  out vec4 outColor;

  void main() {
    outColor = u_color;
  }
  `;

  function createShader(type, source) {
    const sh = gl.createShader(type);
    gl.shaderSource(sh, source);
    gl.compileShader(sh);

    if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
      const info = gl.getShaderInfoLog(sh);
      gl.deleteShader(sh);
      throw new Error("Shader compile failed: " + info);
    }
    return sh;
  }

  function createProgram(vsSrc, fsSrc) {
    const vs = createShader(gl.VERTEX_SHADER, vsSrc);
    const fs = createShader(gl.FRAGMENT_SHADER, fsSrc);

    const prog = gl.createProgram();
    gl.attachShader(prog, vs);
    gl.attachShader(prog, fs);
    gl.linkProgram(prog);

    gl.deleteShader(vs);
    gl.deleteShader(fs);

    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) {
      const info = gl.getProgramInfoLog(prog);
      gl.deleteProgram(prog);
      throw new Error("Program link failed: " + info);
    }
    return prog;
  }

  const program = createProgram(vsSource, fsSource);
  gl.useProgram(program);

  // Locations
  const locPos = gl.getAttribLocation(program, "a_pos");
  const locTranslate = gl.getUniformLocation(program, "u_translate");
  const locScale = gl.getUniformLocation(program, "u_scale");
  const locColor = gl.getUniformLocation(program, "u_color");

  // ---------- Geometry: one unit quad ----------
  const quadVerts = new Float32Array([
    -0.5, -0.5,
    +0.5, -0.5,
    -0.5, +0.5,
    -0.5, +0.5,
    +0.5, -0.5,
    +0.5, +0.5,
  ]);

  const vao = gl.createVertexArray();
  gl.bindVertexArray(vao);

  const vbo = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, vbo);
  gl.bufferData(gl.ARRAY_BUFFER, quadVerts, gl.STATIC_DRAW);

  gl.enableVertexAttribArray(locPos);
  gl.vertexAttribPointer(locPos, 2, gl.FLOAT, false, 0, 0);

  gl.bindVertexArray(null);

  // ---------- Public drawing API ----------
  function clear(r, g, b, a) {
    gl.clearColor(r, g, b, a);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  /**
   * Draw a rectangle in clip space:
   * x,y,w,h are in -1..+1 units
   * color is [r,g,b,a] each 0..1
   */
  function drawRect({ x, y, w, h, color }) {
    gl.uniform2f(locTranslate, x, y);
    gl.uniform2f(locScale, w, h);
    gl.uniform4f(locColor, color[0], color[1], color[2], color[3]);

    gl.bindVertexArray(vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    gl.bindVertexArray(null);
  }

  return {
    gl,
    resizeToDisplaySize,
    clear,
    drawRect,
  };
}
