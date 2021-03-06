import { SphereBufferGeometry, TextureLoader, AdditiveBlending, BufferAttribute, Points, Mesh, Object3D, ShaderMaterial, BoxBufferGeometry } from 'three';
import ThreeApp from '../ThreeApp';
import GPUComputationRenderer from '../lib/GPUComputationRenderer';
import vertexShader from './vert.glsl';
import fragmentShader from './frag.glsl';
import computePositionShader from './compute-position.glsl';
import computeVelocityShader from './compute-velocity.glsl';
import WAGNER from '@alex_toudic/wagner';
import BloomPass from '@alex_toudic/wagner/src/passes/bloom/MultiPassBloomPass';

const scale = 1000;
const size = 1;
class Experiment extends ThreeApp {
  init() {
    this.renderer.setClearColor(0x111111);
    this.material = new ShaderMaterial({
      uniforms: {
        size: { value: size },
        time: { value: 0.0 },
        tPosition: { value: null },
        tVelocity: { value: null },
        sprite: { value: null },
      },
      fragmentShader,
      vertexShader,
      transparent: true,
      depthWrite: false,
    });
    this.material.blending = AdditiveBlending;
    this.textureLoader = new TextureLoader();
    this.textureLoader.load('particle.png', texture => {
      this.material.uniforms.sprite.value = texture;
    });

    this.setupGeometry();

    this.mesh = new Points(this.geometry, this.material);
    this.mesh.position.set(0, 0, 0);

    this.setupGPURenderer();

    this.pivot = new Object3D();
    this.pivot.add(this.camera);
    this.scene.add(this.mesh);
    this.scene.add(this.pivot);
    this.camera.position.set(0, 0, 4);

    this.composer = new WAGNER.Composer(this.renderer);
    this.pass = new BloomPass({
      zoomBlurStrength: 0.5,
      applyZoomBlur: true,
      blurAmount: 5,
    });
  }

  getTextureSize() {
    const count = this.geometry.getAttribute('position').count;

    let size = 2;
    while (size < Math.sqrt(count)) {
      size *= 2;
    }

    return size;
  }

  setupGeometry() {
    this.geometry = new SphereBufferGeometry(3,scale, scale);

    const verticesCount = this.geometry.getAttribute('position').count;
    console.log('Particle count: ', verticesCount);
    const width = this.getTextureSize();
    const uvs = new Float32Array(verticesCount * 2);
    let count = 0;

    for (let i = 0; i < width; i++) {
      for (let j = 0; j < width; j++) {
        uvs[count++] = i / (width - 1);
        uvs[count++] = j / (width - 1);

        if (count === verticesCount * 2) {
          break;
        }
      }
      if (count === verticesCount * 2) {
        break;
      }
    }
    this.geometry.addAttribute('uv', new BufferAttribute(uvs, 2));
  }

  setupGPURenderer() {
    const textureSize = this.getTextureSize();
    this.gpu = new GPUComputationRenderer(textureSize, textureSize, this.renderer);

    this.velTexture = this.gpu.createTexture();
    this.posTexture = this.gpu.createTexture();

    this.seedTextures();

    this.velVar = this.gpu.addVariable('tVelocity', computeVelocityShader, this.velTexture);
    this.posVar = this.gpu.addVariable('tPosition', computePositionShader, this.posTexture);
    this.gpu.setVariableDependencies(this.velVar, [this.velVar, this.posVar]);
    this.gpu.setVariableDependencies(this.posVar, [this.velVar, this.posVar]);
    this.velVar.material.uniforms.time = { value: 0.0 };
    this.posVar.material.uniforms.delta = { value: 0.0 };

    const error = this.gpu.init();
    if (error) {
      throw new Error(error);
    }
  }

  seedTextures() {
    const positionData = this.posTexture.image.data;
    const velocityData = this.velTexture.image.data;

    // Use BoxBufferGeometry's position to start in
    // the texture
    let posCount = 0;
    let geoPos = this.geometry.getAttribute('position');

    for (let i = 0; i < positionData.length; i += 4) {
      if (i / 4 >= geoPos.count) {
        positionData[i] = positionData[i + 1] = positionData[i + 2] = positionData[i + 3] = 0;
        velocityData[i] = velocityData[i + 1] = velocityData[i + 2] = velocityData[i + 3] = 0;
      } else {
        /*
        // Initial position from buffer geometry
        positionData[i]     = geoPos.array[posCount++];
        positionData[i + 1] = geoPos.array[posCount++];
        positionData[i + 2] = geoPos.array[posCount++];
        positionData[i + 3] = 1;
        */

        let theta = Math.random() * Math.PI * 2;
        let phi = (Math.random() * Math.PI) - (Math.PI/2);
        let r = Math.random() * 1.5;
        positionData[i]     = r * Math.cos(theta) * Math.cos(phi);
        positionData[i + 1] = r * Math.sin(phi);
        positionData[i + 2] = r * Math.sin(theta) * Math.cos(phi);
        positionData[i + 3] = 1;

        velocityData[i] = Math.random()*2 - 1;
        velocityData[i + 1] = Math.random()*2 - 1;
        velocityData[i + 2] = Math.random()*2-1;
        velocityData[i + 3] = 1;
      }
    }
  }

  update(t, delta) {
    this.pivot.rotation.y = t * 0.0001;
    this.material.uniforms.time.value = t;
    this.velVar.material.uniforms.time.value = t;
    this.posVar.material.uniforms.delta.value = delta / 1000;
  }

  render() {
    this.renderer.clearColor();
    this.gpu.compute();
    this.material.uniforms.tPosition.value = this.gpu.getCurrentRenderTarget(this.posVar).texture;
    this.material.uniforms.tVelocity.value = this.gpu.getCurrentRenderTarget(this.velVar).texture;
    this.composer.reset();
    this.composer.render(this.scene, this.camera);
    this.composer.pass(this.pass);
    this.composer.toScreen();
    // this.renderer.render(this.scene, this.camera);
  }
}

export default new Experiment();
