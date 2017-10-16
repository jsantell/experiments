uniform float delta;

void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec3 pos = texture2D(tPosition, uv).xyz;
  vec4 tmpVel = texture2D(tVelocity, uv);
  vec3 vel = tmpVel.xyz;
  float mass = tmpVel.w;

  if (mass == 0.0) {
    vel = vec3(0.0);
  }

  pos += vel * (delta / 1000.0) * mass;

  if (length(pos) > 2.5) {
    pos = vec3(0.0);
  }

  gl_FragColor = vec4(pos, 1.0);
}
