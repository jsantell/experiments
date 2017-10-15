uniform float size;
uniform sampler2D tPosition;
uniform sampler2D tVelocity;
varying vec3 vPosition;

void main() {
  vec3 pos = texture2D(tPosition, uv).xyz;
  vPosition = pos;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
  gl_PointSize = size;
}
