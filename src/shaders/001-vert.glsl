uniform float size;
uniform sampler2D tPosition;
uniform sampler2D tVelocity;
varying vec3 vPosition;

void main() {
  vec4 vel = texture2D(tVelocity, uv);
  vec4 posTemp = texture2D(tPosition, uv);
  vec3 pos = posTemp.xyz;
  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = size;
}
