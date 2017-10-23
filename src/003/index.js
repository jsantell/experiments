import { Vector3, Color, Mesh, ShaderMaterial, MeshBasicMaterial, BoxGeometry, AdditiveBlending, Object3D } from 'three';
import { Tween, Easing, update as tweenUpdate } from 'tween';
import ThreeApp from '../ThreeApp';
import fragmentShader from './frag.glsl';
import vertexShader from './vert.glsl';
import WAGNER from '@alex_toudic/wagner';
import VignettePass from '@alex_toudic/wagner/src/passes/vignette/VignettePass';

const ROTATION_DELAY = 100;
const ROTATION_SPEED = 800;
const DIMENSIONS = 3;
const CUBE_SCALE = 1.0;
const CUBE_DISTANCE_SCALE = 1.0;
const EASING = Easing.Back.Out;
const BG_COLOR = 0x333333;

// Randomly return val1 or val2
const or = (val1, val2) => Math.random() > 0.5 ? val1 : val2;
// Pass in an axis ('x', 'y', 'z') and return a different axis
const getDifferentAxis = axis => axis === 'x' ? or('y', 'z') :
                                 axis === 'y' ? or('x', 'z') : or('y', 'x');
const getRandomAxis = () => ['x', 'y', 'z'][Math.floor(Math.random() * 3)];

class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(BG_COLOR);
    this.curves = [];

    this.cubeGroup = new Object3D();
    this.rotationHelper = new Object3D();
    this.cubeGroup.add(this.rotationHelper);
    this.scene.add(this.cubeGroup);
    this.material = new ShaderMaterial({
      vertexShader,
      fragmentShader,
      uniforms: {
        fgColor: { value: new Color(0xffffff) },
        bgColor: { value: new Color(BG_COLOR) },
      },
    });

    this.createCubes();

    this.pivot = new Object3D();
    this.scene.add(this.pivot);
    this.camera.lookAt(new Vector3());
    this.pivot.add(this.camera);
    this.camera.position.set(4, 4, 4);

    this.lastRotation = 0;
    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new VignettePass(0.9, 1.0);
  }

  createCubes() {
    this.cubes = [];

    /**
     *  Store cubes in plane, row, columns, below
     *  is a face
     *
     *  z,y,x
     *
     *  0,0,0  0,0,1  0,0,2
     *  0,1,0  0,1,1  0,1,2
     *  0,2,0  0,2,1  0,2,2
     *
     */
    const solid = this.material;
    const transparent = new MeshBasicMaterial({ opacity: 0, transparent: true });
    const last = DIMENSIONS - 1;
    for (let z = 0; z < DIMENSIONS; z++) {
      const plane = this.cubes[z] = [];
      for (let y = 0; y < DIMENSIONS; y++) {
        const row = plane[y] = [];
        for (let x = 0; x < DIMENSIONS; x++) {
          let cube = new Mesh(new BoxGeometry(CUBE_SCALE, CUBE_SCALE, CUBE_SCALE), [
            x === last ? solid : transparent, // bot right
            x === 0 ? solid : transparent, // back left
            y === last ? solid : transparent, // top
            y === 0 ? solid : transparent, // bottom
            z === last ? solid : transparent, // bot left
            z === 0 ? solid : transparent, // back right
          ]);
          row[x] = cube;
          this.cubeGroup.add(cube);

          const half = DIMENSIONS % 2 === 0 ? (DIMENSIONS / 2) -0.5 : Math.floor(DIMENSIONS / 2);
          cube.position.set(
            ((x ) - half) * CUBE_DISTANCE_SCALE,
            ((y ) - half) * CUBE_DISTANCE_SCALE,
            ((z ) - half) * CUBE_DISTANCE_SCALE
          );
        }
      }
    }
  }

  getCubesBySlice(axis, index) {
    // I'm sure there's a better way for this
    const cubes = [];
    for (let z = 0; z < DIMENSIONS; z++) {
      for (let y = 0; y < DIMENSIONS; y++) {
        for (let x = 0; x < DIMENSIONS; x++) {
          const r = axis === 'z' ? z :
                    axis === 'y' ? y : x;
          if (r === index) {
            const cube = this.cubes[z][y][x];
            cubes.push(cube);
          }
        }
      }
    }
    return cubes;
  }

  rotateCubes(axis, index, dir) {
    const cubes = this.getCubesBySlice(axis, index);
    for (let cube of cubes) {
      this.cubeGroup.remove(cube);
      this.rotationHelper.add(cube);
    }

    this.cubeTween = this.rotate(this.rotationHelper, axis, dir);
    this.cubeTween.onComplete(() => {
      cubes.forEach(c => {
        this.cubeGroup.add(c);
        this.rotationHelper.remove(c);
      });
      this.rotationHelper.rotation.set(0, 0, 0);
      this.cubeTween = null;
    });
  }

  rotate(object, axis, dir, easing) {
    const startRotation = object.rotation[axis];

    return new Tween({ x: 0 })
      .to({ x: 1 }, ROTATION_SPEED)
      .onUpdate(value => {
        object.rotation[axis] = startRotation + (value * Math.PI / 2 * dir);
      })
      .easing(easing || EASING)
      .start();
  }

  update(t, delta) {
    if (this.lastRotation + ROTATION_SPEED + ROTATION_DELAY < t &&
        !this.camTween && !this.cubeTween) {
      const index = Math.floor(Math.random() * 3);
      const axis = getRandomAxis();
      const dir = or(-1, 1);
      // Rotate a slice of cubes on `axis` at `index`
      this.rotateCubes(axis, index, dir);
      // Also rotate the camera randomly on a different access
      this.camTween = this.rotate(this.pivot, getRandomAxis(), dir * -1, Easing.Cubic.Out);
      this.camTween.onComplete(() => this.camTween = null);

      this.lastRotation = t;
    }
    this.camera.lookAt(new Vector3());
    this.camera.updateMatrixWorld();

    tweenUpdate();
  }

  render() {
    this.renderer.clearColor();
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
  }
}

export default new Experiment();
