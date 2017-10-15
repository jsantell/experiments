#define delta ( 1.0 / 60.0 )
#pragma glslify: snoise3 = require(glsl-noise/simplex/3d) 
#pragma glslify: cnoise3 = require(glsl-noise/classic/3d) 
#
void main() {
  vec2 uv = gl_FragCoord.xy / resolution.xy;
  vec4 tmpPos = texture2D(tPosition, uv);
  vec3 pos = tmpPos.xyz;
  vec4 tmpVel = texture2D(tVelocity, uv );
  vec3 vel = tmpVel.xyz;
  float mass = tmpVel.w;

  if ( mass == 0.0 ) {
    vel = vec3( 0.0 );
  }

  pos += vel * delta;

  if (length(pos) > 2.5) {
    pos = vec3(0.0);
  }

  gl_FragColor = vec4(pos, 1.0);
}
