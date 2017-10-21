uniform float uTime;
uniform float uDelta;
uniform vec2 uResolution;

#pragma glslify: hsl2rgb = require(glsl-hsl2rgb)

void main() {
  vec2 st = gl_FragCoord.xy / uResolution.xy;
  float hue = cos(st.y) + sin(uTime * 0.0001);
  vec3 rgb = vec3(
    (sin((uTime * 0.001) + 0.1) + 1.0) / 2.0, 
    (sin((uTime * 0.001) + 0.2) + 1.0) / 2.0,
    (sin((uTime * 0.001) + 0.8) + 1.0) / 2.0
  );
  gl_FragColor = vec4(rgb, 1.0);
}
