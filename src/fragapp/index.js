import { PlaneGeometry, Mesh, ShaderMaterial } from 'three';
import ThreeApp from '../ThreeApp';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';

class Experiment002 extends ThreeApp {
  init() {
    this.material = new ShaderMaterial({
      uniforms: {
        uTime: { value: performance.now() },
        uResolution: { value: [window.innerWidth, window.innerHeight] },
        uDelta: { value: 0 },
      },
      fragmentShader,
      vertexShader,
    });
    this.geometry = new PlaneGeometry(2, 2);
    this.mesh = new Mesh(this.geometry, this.material);
    this.scene.add(this.mesh);

    this.camera.position.set(0, 0, 1);
  }

  update(t, delta) {
    this.material.uniforms.uTime.value = t;
    this.material.uniforms.uDelta.value = delta;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  onResize() {
    super.onResize();
    this.material.uniforms.uResolution.value = [window.innerWidth, window.innerHeight];
  }
}

export default new Experiment002();
