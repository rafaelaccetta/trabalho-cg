export default class Camera {
  constructor(gl) {
    // Posição da camera
    this.eye = vec3.fromValues(50.0, 50.0, 50.0);
    this.at  = vec3.fromValues(0.0, 0.0, 0.0);
    this.up  = vec3.fromValues(0.0, 1.0, 0.0);

    // Parâmetros da projeção
    this.fovy = Math.PI / 2;
    this.aspect = gl.canvas.width / gl.canvas.height;

    this.left = -100.0;
    this.right = 100.0;
    this.top = 100.0;
    this.bottom = -100.0;

    this.near = 0.0;
    this.far = 100.0;

    // Matrizes View e Projection
    this.view = mat4.create();
    this.proj = mat4.create();

    this.angle = 0.0;

    this.rotate = true;
    
  }

  changeMode() {
    this.rotate = this.rotate ? false : true;
  }

  getView() {
    return this.view;
  }

  getProj() {
    return this.proj;
  }

  updateViewMatrix() {
    mat4.identity( this.view );
    mat4.lookAt(this.view, this.eye, this.at, this.up);

    if (this.rotate) {
      this.angle += 0.01;
    } else {
      this.angle = 0.0;
    };

    mat4.rotateY(this.view, this.view, this.angle);
  
  }

  updateProjectionMatrix(type = '') {
    mat4.identity( this.proj );

    if (this.rotate) {
      mat4.perspective(this.proj, this.fovy, this.aspect, this.near, this.far);
    } else {
      mat4.ortho(this.proj, this.left * 1024/768, this.right * 1024/768, this.bottom , this.top, this.near, this.far);
    }
  }


  updateCam() {
    this.updateViewMatrix();
    this.updateProjectionMatrix();
  }
}