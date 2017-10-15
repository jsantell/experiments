uniform float time;

#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 
#pragma glslify: pnoise3 = require(glsl-noise/periodic/3d) 
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 

void main() {
  vec3 gravity = vec3(0.0, -0.0981, 0.0);
  vec3 center = vec3(0.0);

  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(tPosition, uv);
  vec3 pos = tmpPos.xyz;
  vec4 tmpVel = texture2D(tVelocity, uv);
  vec3 vel = tmpVel.xyz;
  float mass = tmpVel.w;

  float max = 1.5;
  // decay
  vel *= 0.9;

  float mod = sin(time * 0.0001);
  vel += -pos * 5.0 * snoise3(pos*mod+5.0);
  if (length(pos) > max) {
    vel = (center - pos) * 0.05;
  }
  gl_FragColor = vec4(vel, mass);
}
