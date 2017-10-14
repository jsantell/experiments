import { WebGLRenderer, PerspectiveCamera, Scene } from 'three';

export default class App {
  constructor() {
    this.renderer = new WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    document.body.appendChild(this.renderer.domElement);

    this.scene = new Scene();

    this.camera = new PerspectiveCamera(60, this.getAspect(), 0.1, 100);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    this.init();

    this.onTick = this.onTick.bind(this);
    requestAnimationFrame(this.onTick);
  }

  onTick() {
    const t = performance.now();
    this.update(t);
    requestAnimationFrame(this.onTick);
    this.render(t);
  }

  getAspect() {
    return window.innerWidth / window.innerHeight;
  }

  onResize() {
    this.camera.aspect = this.getAspect();
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
