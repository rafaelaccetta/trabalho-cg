export default
`#version 300 es
precision highp float;

uniform vec4 light_pos_a;



uniform vec4 light_amb_c_a;
uniform float light_amb_k_a;

uniform vec4 light_dif_c_a;
uniform float light_dif_k_a;

uniform vec4 light_esp_c_a;
uniform float light_esp_k_a;
uniform float light_esp_p_a;



uniform vec4 light_pos_b;

uniform vec4 light_amb_c_b;
uniform float light_amb_k_b;

uniform vec4 light_dif_c_b;
uniform float light_dif_k_b;

uniform vec4 light_esp_c_b;
uniform float light_esp_k_b;
uniform float light_esp_p_b;



uniform mat4 u_model;
uniform mat4 u_view;
uniform mat4 u_projection;

in vec4 fPosition;
in vec4 fColor;
in vec4 fNormal;

out vec4 minhaColor;

void main()
{
  mat4 modelView = u_view * u_model;

  // posição do vértice no sistema da câmera
  vec4 viewPosition = modelView * fPosition;

  // posição final do vertice  
  // normal do vértice no sistema da câmera
  vec4 viewNormal = transpose(inverse(modelView)) * fNormal;
  viewNormal = normalize(viewNormal);

  // posição da luz no sistema da câmera
  vec4 viewLightPos_a = u_view * light_pos_a;
  vec4 viewLightPos_b = u_view * light_pos_b;

  // direção da luz
  vec4 lightDir_a = normalize(viewLightPos_a - viewPosition);
  vec4 lightDir_b = normalize(viewLightPos_b - viewPosition);

  // direção da camera (camera está na origem)
  vec4 cameraDir = normalize(-viewPosition);

  // fator da componente difusa
  float fatorDif_a = max(0.0, dot(lightDir_a, viewNormal));
  float fatorDif_b = max(0.0, dot(lightDir_b, viewNormal));

  // fator da componente especular
  vec4 halfVec_a = normalize(lightDir_a + cameraDir);
  vec4 halfVec_b = normalize(lightDir_b + cameraDir);

  float fatorEsp_a = pow(max(0.0, dot(halfVec_a, viewNormal)), light_esp_p_a);
  float fatorEsp_b = pow(max(0.0, dot(halfVec_b, viewNormal)), light_esp_p_b);

  // cor final do vértice
  minhaColor = 0.4 * fColor 
              + 0.4 * (light_amb_k_a * light_amb_c_a + fatorDif_a * light_dif_k_a * light_dif_c_a + fatorEsp_a * light_esp_k_a * light_esp_c_a)
              + 0.4 * (light_amb_k_b * light_amb_c_b + fatorDif_b * light_dif_k_b * light_dif_c_b + fatorEsp_b * light_esp_k_b * light_esp_c_b);
}`