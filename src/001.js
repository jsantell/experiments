import { Mesh, MeshBasicMaterial, CubeGeometry } from 'three';
import App from './app';

class Experiment001 extends App {
  init() {
    this.mesh = new Mesh(new CubeGeometry(1,1,1), new MeshBasicMaterial({ color: 0xff0077 }));
    this.mesh.position.set(0, 0, 0);
    this.scene.add(this.mesh);
    this.camera.position.set(0, 0, 5);
  }

  update(t) {
    this.mesh.rotation.y = t * 0.0001;
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment001();
