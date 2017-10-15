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

  float mod = sin(time * 0.001);
  vel += -pos * 20.0 * snoise3(pos*mod+1.0);//vec3(time/100000.0));//-pos * 10.5 * snoise3(pos);
  //vel += -pos * 2.0 * pnoise3(vel, vec3(time/100000.0));//-pos * 10.5 * snoise3(pos);
  // vel= (vel + gravity) * mass;
  if (length(tmpPos) > max) {
    vel = (center - pos) * 0.7;
  }
  gl_FragColor = vec4(vel, mass);
}
