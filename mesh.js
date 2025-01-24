import vertShaderSrc from './phong.vert.js';
import fragShaderSrc from './phong.frag.js';

import Shader from './shader.js';
import { HalfEdgeDS } from './half-edge.js';

export default class Mesh {
  constructor(delta) {
    // model data structure
    this.heds = new HalfEdgeDS();

    // Matriz de modelagem
    this.angle = 0;
    this.delta = delta;
    this.model = mat4.create();

    // Shader program
    this.vertShd = null;
    this.fragShd = null;
    this.program = null;

    // Data location
    this.vaoLoc = -1;
    this.indicesLoc = -1;

    this.uModelLoc = -1;
    this.uViewLoc = -1;
    this.uProjectionLoc = -1;


    this.vertex_count = 0;

    this.center_x = 0.0;
    this.center_y = 0.0;
    this.center_z = 0.0;

    this.min_x = 0.0;
    this.max_x = 0.0;
    
  }

  async loadMeshV4() { //ADAPTAR PARA O MODELO
    const resp = await fetch("bunny.obj");
    const text = await resp.text();

    const coords = [];
    const indices = [];
    const normals = [];

    const lines = text.split('\n')

    //O modelo tem vertices, normais e triangulos. Acho que não precisa das normais, mas se precisar altero depois.
    for (let i = 3; i < lines.length; i++) {
      const data = lines[i].trim().split(/\s+/)
      if (data[0] == "v"){

        this.vertex_count += 1;

        let x = parseFloat(data[1]);
        let y = parseFloat(data[2]);
        let z = parseFloat(data[3]);

        this.min_x = this.min_x < x ? this.min_x : x;
        this.max_x = this.max_x > x ? this.max_x : x;

        this.center_x += x;
        this.center_y += y;
        this.center_z += z;

        coords.push(x, y, z, 1.0)

      } else if (data[0] == "vn"){
        normals.push(
          parseFloat(data[1]),
          parseFloat(data[2]),
          parseFloat(data[3])
        )
      }

      else if (data[0] == "f"){
        indices.push(
          parseInt(data[1]) - 1,
          parseInt(data[2]) - 1,
          parseInt(data[3]) - 1)
      }
    }

    this.center_x = this.center_x / this.vertex_count;
    this.center_y = this.center_y / this.vertex_count;
    this.center_z = this.center_z / this.vertex_count;

    console.log(coords, normals, indices);
    this.heds.build(coords, normals, indices);
  }

  createShader(gl) {
    this.vertShd = Shader.createShader(gl, gl.VERTEX_SHADER, vertShaderSrc);
    this.fragShd = Shader.createShader(gl, gl.FRAGMENT_SHADER, fragShaderSrc);
    this.program = Shader.createProgram(gl, this.vertShd, this.fragShd);

    gl.useProgram(this.program);
  }

  createUniforms(gl) {
    this.uModelLoc = gl.getUniformLocation(this.program, "u_model");
    this.uViewLoc = gl.getUniformLocation(this.program, "u_view");
    this.uProjectionLoc = gl.getUniformLocation(this.program, "u_projection");
  }

  createVAO(gl) {

    const vbos = this.heds.getVBOs();
    console.log(vbos);

    var coordsAttributeLocation = gl.getAttribLocation(this.program, "position");
    const coordsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[0]));

    var colorsAttributeLocation = gl.getAttribLocation(this.program, "color");
    const colorsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[1]));

    var normalsAttributeLocation = gl.getAttribLocation(this.program, "normal");
    const normalsBuffer = Shader.createBuffer(gl, gl.ARRAY_BUFFER, new Float32Array(vbos[2]));

    this.vaoLoc = Shader.createVAO(gl,
      coordsAttributeLocation, coordsBuffer, 
      colorsAttributeLocation, colorsBuffer, 
      normalsAttributeLocation, normalsBuffer);

    this.indicesLoc = Shader.createBuffer(gl, gl.ELEMENT_ARRAY_BUFFER, new Uint32Array(vbos[3]));
  }  

  init(gl, light) {
    this.createShader(gl);
    this.createUniforms(gl);
    this.createVAO(gl);

    light.createUniforms(gl, this.program);
  }

  updateModelMatrix() { //ADAPTAR PARA A CENA
    //this.angle += 0.005;

    mat4.identity( this.model );
    mat4.translate(this.model, this.model, [this.delta, 0, 0]);
  
    //mat4.rotateY(this.model, this.model, this.angle);

    mat4.translate(this.model, this.model, [-this.center_x, -this.center_y, -this.center_z]);

    let height = this.max_x - this.min_x;
    let scale = 50.0 / height
    mat4.scale(this.model, this.model, [scale, scale, scale]);
    
  }

  draw(gl, cam, light) {
    // faces orientadas no sentido anti-horário
    gl.frontFace(gl.CCW);

    // face culling
    gl.enable(gl.CULL_FACE);
    gl.cullFace(gl.BACK);

    gl.useProgram(this.program);

    // updates the model transformations
    this.updateModelMatrix();

    const model = this.model;
    const view = cam.getView();
    const proj = cam.getProj();
    
    gl.uniformMatrix4fv(this.uModelLoc, false, model);
    gl.uniformMatrix4fv(this.uViewLoc, false, view);
    gl.uniformMatrix4fv(this.uProjectionLoc, false, proj);

    gl.bindVertexArray(this.vaoLoc);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesLoc);

    gl.drawElements(gl.TRIANGLES, this.heds.faces.length * 3, gl.UNSIGNED_INT, 0);

    gl.disable(gl.CULL_FACE);
  }
}