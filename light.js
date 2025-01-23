export default class Light { //ADAPTAR PARA 2 FONTES DE LUZ
  constructor() {
    this.pos_a = vec4.fromValues(2.0, 2.0, 2.0, 1.0);

    this.amb_c_a = vec4.fromValues(2.0, 2.0, 0.0, 1.0);
    this.amb_k_a = 0.1;

    this.dif_c_a = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.dif_k_a = 0.1;

    this.esp_c_a = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.esp_k_a = 0.8;
    this.esp_p_a = 5.0;

    this.pos_b = vec4.fromValues(2.0, 2.0, 2.0, 1.0);

    this.amb_c_b = vec4.fromValues(2.0, 2.0, 10.0, 1.0);
    this.amb_k_b = 0.4;

    this.dif_c_b = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.dif_k_b = 0.5;

    this.esp_c_b = vec4.fromValues(1.0, 1.0, 1.0, 1.0);
    this.esp_k_b = 0.4;
    this.esp_p_b = 5.0;
  }

  createUniforms(gl, program){
    const posLoc_a = gl.getUniformLocation(program, "light_pos_a");
    gl.uniform4fv(posLoc_a, this.pos_a);

    const ambCLoc_a = gl.getUniformLocation(program, "light_amb_c_a");
    gl.uniform4fv(ambCLoc_a, this.amb_c_a);
    const ambKLoc_a = gl.getUniformLocation(program, "light_amb_k_a")
    gl.uniform1f(ambKLoc_a, this.amb_k_a);

    const difCLoc_a = gl.getUniformLocation(program, "light_dif_c_a");
    gl.uniform4fv(difCLoc_a, this.dif_c_a);
    const difKLoc_a = gl.getUniformLocation(program, "light_dif_k_a")
    gl.uniform1f(difKLoc_a, this.dif_k_a);

    const espCLoc_a = gl.getUniformLocation(program, "light_esp_c_a");
    gl.uniform4fv(espCLoc_a, this.pos_a);
    const espKLoc_a = gl.getUniformLocation(program, "light_esp_k_a")
    gl.uniform1f(espKLoc_a, this.esp_k_a);
    const espPLoc_a = gl.getUniformLocation(program, "light_esp_p_a")
    gl.uniform1f(espPLoc_a, this.esp_p_a);



    const posLoc_b = gl.getUniformLocation(program, "light_pos_b");
    gl.uniform4fv(posLoc_b, this.pos_b);

    const ambCLoc_b = gl.getUniformLocation(program, "light_bmb_c_b");
    gl.uniform4fv(ambCLoc_b, this.amb_c_b);
    const ambKLoc_b = gl.getUniformLocation(program, "light_bmb_k_b")
    gl.uniform1f(ambKLoc_b, this.amb_k_b);

    const difCLoc_b = gl.getUniformLocation(program, "light_dif_c_b");
    gl.uniform4fv(difCLoc_b, this.dif_c_b);
    const difKLoc_b = gl.getUniformLocation(program, "light_dif_k_b")
    gl.uniform1f(difKLoc_b, this.dif_k_b);

    const espCLoc_b = gl.getUniformLocation(program, "light_esp_c_b");
    gl.uniform4fv(espCLoc_b, this.pos_b);
    const espKLoc_b = gl.getUniformLocation(program, "light_esp_k_b")
    gl.uniform1f(espKLoc_b, this.esp_k_b);
    const espPLoc_b = gl.getUniformLocation(program, "light_esp_p_b")
    gl.uniform1f(espPLoc_b, this.esp_p_b);
  }

  updateLight() {
    // TODO: Change light position
  }
}