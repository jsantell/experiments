uniform float delta;

#pragma glslify: when_lt = require(glsl-conditionals/when_lt)

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(tPosition, uv).xyz;
  vec4 tmpVel = texture2D(tVelocity, uv);
  vec3 vel = tmpVel.xyz;
  float mass = tmpVel.w;

  pos += vel * (delta / 1000.0) * mass;

  pos *= when_lt(length(pos), 2.5);

  gl_FragColor = vec4(pos, 1.0);
}
