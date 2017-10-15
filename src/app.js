import { WebGLRenderer, PerspectiveCamera, Scene } from 'three';
import Stats from 'stats.js';

export default class App {
  constructor() {
    if (window.location.search) {
      const params = window.location.search.substr(1).split('&');
      for (let param of params) {
        let [prop, value] = param.split('=');
        if (prop === 'debug') {
          this.stats = new Stats();
          this.stats.showPanel(0);
          document.body.appendChild(this.stats.dom);
        }
      }
    }
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

    this._lastTick = 0;
    this.onTick = this.onTick.bind(this);
    requestAnimationFrame(this.onTick);
  }

  onTick() {
    const t = performance.now();
    const delta = performance.now() - this._lastTick;
    if (this.stats) {
      this.stats.begin();
    }
    this.update(t, delta);
    this.render(t, delta);
    if (this.stats) {
      this.stats.end();
    }
    this._lastTick = t;
    requestAnimationFrame(this.onTick);
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
