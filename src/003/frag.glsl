uniform vec3 fgColor;
uniform vec3 bgColor;

varying vec2 vUv;

#pragma glslify: when_gt = require(glsl-conditionals/when_gt)

void main() {
  float limit = 0.1;
  vec3 color = fgColor;

  float isTiled = 0.0;
  isTiled += when_gt(limit, vUv.x);
  isTiled += when_gt(limit, vUv.y);
  isTiled += when_gt(vUv.x, 1.0 - limit);
  isTiled += when_gt(vUv.y, 1.0 - limit);

  color = (step(1.0, isTiled) * bgColor) + ((1.0 - step(1.0, isTiled)) * fgColor);
  gl_FragColor = vec4(color, 1.0);
}
