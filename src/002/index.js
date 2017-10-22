import { EllipseCurve, SplineCurve, Color, LineBasicMaterial, Line, Path, AdditiveBlending, Object3D } from 'three';
import ThreeApp from '../ThreeApp';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';

const count = 400;
const points = 100;
class Experiment002 extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x111111);
    this.curves = [];

    for (let i = 0; i < count; i++) {
      const curve = new EllipseCurve(0, 0, 2, 2, 0, 2 * Math.PI, false, 0);
      const path = new Path(curve.getPoints(points));
      const geo = path.createPointsGeometry(points);
      const c = (i / count) * 360 / 1.9;
      const mat = new LineBasicMaterial({
        color: new Color(`hsl(${c}, 100%, 50%)`),
        transparent: true,
        depthWrite: false,
        blending: AdditiveBlending,
        opacity: 0.4,
      });
      const line = new Line(geo, mat);
      this.curves.push(line);
      this.scene.add(line);
    }

    this.camera.position.set(0, 0, 5);

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.pivot);

    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      zoomBlurStrength: 0.05,
      applyZoomBlur: true,
      blurAmount: 0.2,
    });
  }

  update(t, delta) {
    for (let i = 0; i < count; i++) {
      const curve = this.curves[i];
      const pct = i / count;
      const scale = ((Math.sin(t * 0.0001 + (pct*Math.PI*2)) + 1) / 2);
      curve.scale.set(scale, scale, scale);
      curve.rotation.z = t * 0.00001 + (pct*2);
      curve.rotation.y = t * 0.001 + (pct*Math.PI*2);
      curve.rotation.x = (t * 0.001 + (pct*Math.PI*2)) + Math.PI/2;
    }
    this.pivot.rotation.y = -t * 0.001;
  }

  render() {
    this.renderer.clearColor();
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment002();
