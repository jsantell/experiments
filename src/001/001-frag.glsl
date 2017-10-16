uniform float time;
uniform sampler2D sprite;

varying vec3 vPosition;

#pragma glslify: map = require(glsl-map)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  vec4 tex = texture2D(sprite, gl_PointCoord);
  float l = length(vPosition);
  float t = clamp(-1.0, 1.0, sin(time * 0.0005));
  vec3 hsl = hsl2rgb(map(t+l, -1.0, 3.0, 0.3, 0.7), 0.8, 0.5);
  gl_FragColor = vec4(hsl, tex.a*0.2);
}
