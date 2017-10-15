uniform float time;
uniform sampler2D sprite;

varying vec3 vPosition;

#pragma glslify: map = require(glsl-map)
#pragma glslify: hsv2rgb = require(glsl-hsv2rgb)
#pragma glslify: hsl2rgb = require(glsl-hsl2rgb) 

void main() {
  vec4 tex = texture2D(sprite, gl_PointCoord);
  float l = length(vPosition);
  float t = clamp(-1.0, 1.0, sin(time * 0.0005));
  vec3 hsv = hsl2rgb(map(t+l, -1.0, 3.0, 0.3, 0.7), 0.8, 0.5);
  //hsv.r = map(abs(vPosition.y), 0.0, 3.0, 0.0, 1.0);
  //hsv.b = map(abs(vPosition.z), 0.0, 3.0, 0.0, 1.0);
  //vec3 hsv = vec3(1.0 - l, abs(vPosition.y / 1.5), t);
//  hsv.g = max(abs(vPosition.y), abs(1.0)) / 2.0;
  gl_FragColor = vec4(hsv, tex.a*0.2);
}
