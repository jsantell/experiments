(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory(require("three"));
	else if(typeof define === 'function' && define.amd)
		define(["three"], factory);
	else if(typeof exports === 'object')
		exports["app"] = factory(require("three"));
	else
		root["app"] = factory(root["THREE"]);
})(this, function(__WEBPACK_EXTERNAL_MODULE_0__) {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 1);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = __WEBPACK_EXTERNAL_MODULE_0__;

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = __webpack_require__(0);

var _app = __webpack_require__(2);

var _app2 = _interopRequireDefault(_app);

var _GPUComputationRenderer = __webpack_require__(3);

var _GPUComputationRenderer2 = _interopRequireDefault(_GPUComputationRenderer);

var _vert = __webpack_require__(4);

var _vert2 = _interopRequireDefault(_vert);

var _frag = __webpack_require__(5);

var _frag2 = _interopRequireDefault(_frag);

var _computePosition = __webpack_require__(6);

var _computePosition2 = _interopRequireDefault(_computePosition);

var _computeVelocity = __webpack_require__(7);

var _computeVelocity2 = _interopRequireDefault(_computeVelocity);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var scale = 100;
var size = 50;

var Experiment001 = function (_App) {
  _inherits(Experiment001, _App);

  function Experiment001() {
    _classCallCheck(this, Experiment001);

    return _possibleConstructorReturn(this, (Experiment001.__proto__ || Object.getPrototypeOf(Experiment001)).apply(this, arguments));
  }

  _createClass(Experiment001, [{
    key: 'init',
    value: function init() {
      var _this2 = this;

      this.material = new _three.ShaderMaterial({
        uniforms: {
          size: { value: size },
          time: { value: 0.0 },
          tPosition: { value: null },
          tVelocity: { value: null },
          map: { value: null }
        },
        fragmentShader: _frag2.default,
        vertexShader: _vert2.default,
        transparent: true
      });
      this.material.blending = _three.AdditiveBlending;
      this.textureLoader = new _three.TextureLoader();
      this.textureLoader.load('particle.png', function (texture) {
        _this2.material.uniforms.map.value = texture;
      });

      this.setupGeometry();

      this.mesh = new _three.Points(this.geometry, this.material);
      this.mesh.position.set(0, 0, 0);

      this.setupGPURenderer();

      this.pivot = new _three.Object3D();
      this.pivot.add(this.camera);
      this.scene.add(this.mesh);
      this.scene.add(this.pivot);
      this.camera.position.set(0, 0, 5);
    }
  }, {
    key: 'getTextureSize',
    value: function getTextureSize() {
      var count = this.geometry.getAttribute('position').count;

      var size = 2;
      while (size < Math.sqrt(count)) {
        size *= 2;
      }

      return size;
    }
  }, {
    key: 'setupGeometry',
    value: function setupGeometry() {
      // this.geometry = new BoxBufferGeometry(3,3,3, scale, scale, scale);
      this.geometry = new _three.SphereBufferGeometry(3, scale, scale);

      var verticesCount = this.geometry.getAttribute('position').count;
      console.log('Particle count: ', verticesCount);
      var width = this.getTextureSize();
      var uvs = new Float32Array(verticesCount * 2);
      var count = 0;

      for (var i = 0; i < width; i++) {
        for (var j = 0; j < width; j++) {
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
      this.geometry.addAttribute('uv', new _three.BufferAttribute(uvs, 2));
    }
  }, {
    key: 'setupGPURenderer',
    value: function setupGPURenderer() {
      var textureSize = this.getTextureSize();
      this.gpu = new _GPUComputationRenderer2.default(textureSize, textureSize, this.renderer);

      this.velTexture = this.gpu.createTexture();
      this.posTexture = this.gpu.createTexture();

      this.seedTextures();

      this.velVar = this.gpu.addVariable('tVelocity', _computeVelocity2.default, this.velTexture);
      this.posVar = this.gpu.addVariable('tPosition', _computePosition2.default, this.posTexture);
      this.gpu.setVariableDependencies(this.velVar, [this.velVar, this.posVar]);
      this.gpu.setVariableDependencies(this.posVar, [this.velVar, this.posVar]);

      var error = this.gpu.init();
      if (error) {
        throw new Error(error);
      }
    }
  }, {
    key: 'seedTextures',
    value: function seedTextures() {
      var positionData = this.posTexture.image.data;
      var velocityData = this.velTexture.image.data;

      // Use BoxBufferGeometry's position to start in
      // the texture
      var posCount = 0;
      var geoPos = this.geometry.getAttribute('position');

      for (var i = 0; i < positionData.length; i += 4) {
        if (posCount >= geoPos.count * 3) {
          positionData[i] = positionData[i + 1] = positionData[i + 2] = positionData[i + 3] = 0;
          velocityData[i] = velocityData[i + 1] = velocityData[i + 2] = velocityData[i + 3] = 0;
        } else {
          positionData[i] = geoPos.array[posCount++];
          positionData[i + 1] = geoPos.array[posCount++];
          positionData[i + 2] = geoPos.array[posCount++];
          positionData[i + 3] = 1;

          velocityData[i] = velocityData[i + 1] = velocityData[i + 2] = 0;
          velocityData[i + 3] = 1;
        }
      }
    }
  }, {
    key: 'update',
    value: function update(t) {
      this.pivot.rotation.y = t * 0.001;
      this.material.uniforms.time.value = t;
    }
  }, {
    key: 'render',
    value: function render() {
      this.renderer.clearColor();
      this.gpu.compute();
      this.material.uniforms.tPosition.value = this.gpu.getCurrentRenderTarget(this.posVar).texture;
      this.material.uniforms.tVelocity.value = this.gpu.getCurrentRenderTarget(this.velVar).texture;
      this.renderer.render(this.scene, this.camera);
    }
  }]);

  return Experiment001;
}(_app2.default);

exports.default = new Experiment001();

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _three = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var App = function () {
  function App() {
    _classCallCheck(this, App);

    this.renderer = new _three.WebGLRenderer();
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.autoClear = false;
    document.body.appendChild(this.renderer.domElement);

    this.scene = new _three.Scene();

    this.camera = new _three.PerspectiveCamera(60, this.getAspect(), 0.1, 100);

    this.onResize = this.onResize.bind(this);
    window.addEventListener('resize', this.onResize);

    this.init();

    this.onTick = this.onTick.bind(this);
    requestAnimationFrame(this.onTick);
  }

  _createClass(App, [{
    key: 'onTick',
    value: function onTick() {
      var t = performance.now();
      this.update(t);
      requestAnimationFrame(this.onTick);
      this.render(t);
    }
  }, {
    key: 'getAspect',
    value: function getAspect() {
      return window.innerWidth / window.innerHeight;
    }
  }, {
    key: 'onResize',
    value: function onResize() {
      this.camera.aspect = this.getAspect();
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  }]);

  return App;
}();

exports.default = App;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.default = GPUComputationRenderer;
/**
 * @author yomboprime https://github.com/yomboprime
 *
 * GPUComputationRenderer, based on SimulationRenderer by zz85
 *
 * The GPUComputationRenderer uses the concept of variables. These variables are RGBA float textures that hold 4 floats
 * for each compute element (texel)
 *
 * Each variable has a fragment shader that defines the computation made to obtain the variable in question.
 * You can use as many variables you need, and make dependencies so you can use textures of other variables in the shader
 * (the sampler uniforms are added automatically) Most of the variables will need themselves as dependency.
 *
 * The renderer has actually two render targets per variable, to make ping-pong. Textures from the current frame are used
 * as inputs to render the textures of the next frame.
 *
 * The render targets of the variables can be used as input textures for your visualization shaders.
 *
 * Variable names should be valid identifiers and should not collide with THREE GLSL used identifiers.
 * a common approach could be to use 'texture' prefixing the variable name; i.e texturePosition, textureVelocity...
 *
 * The size of the computation (sizeX * sizeY) is defined as 'resolution' automatically in the shader. For example:
 * #DEFINE resolution vec2( 1024.0, 1024.0 )
 *
 * -------------
 *
 * Basic use:
 *
 * // Initialization...
 *
 * // Create computation renderer
 * var gpuCompute = new GPUComputationRenderer( 1024, 1024, renderer );
 *
 * // Create initial state float textures
 * var pos0 = gpuCompute.createTexture();
 * var vel0 = gpuCompute.createTexture();
 * // and fill in here the texture data...
 *
 * // Add texture variables
 * var velVar = gpuCompute.addVariable( "textureVelocity", fragmentShaderVel, pos0 );
 * var posVar = gpuCompute.addVariable( "texturePosition", fragmentShaderPos, vel0 );
 *
 * // Add variable dependencies
 * gpuCompute.setVariableDependencies( velVar, [ velVar, posVar ] );
 * gpuCompute.setVariableDependencies( posVar, [ velVar, posVar ] );
 *
 * // Add custom uniforms
 * velVar.material.uniforms.time = { value: 0.0 };
 *
 * // Check for completeness
 * var error = gpuCompute.init();
 * if ( error !== null ) {
 *		console.error( error );
  * }
 *
 *
 * // In each frame...
 *
 * // Compute!
 * gpuCompute.compute();
 *
 * // Update texture uniforms in your visualization materials with the gpu renderer output
 * myMaterial.uniforms.myTexture.value = gpuCompute.getCurrentRenderTarget( posVar ).texture;
 *
 * // Do your rendering
 * renderer.render( myScene, myCamera );
 *
 * -------------
 *
 * Also, you can use utility functions to create ShaderMaterial and perform computations (rendering between textures)
 * Note that the shaders can have multiple input textures.
 *
 * var myFilter1 = gpuCompute.createShaderMaterial( myFilterFragmentShader1, { theTexture: { value: null } } );
 * var myFilter2 = gpuCompute.createShaderMaterial( myFilterFragmentShader2, { theTexture: { value: null } } );
 *
 * var inputTexture = gpuCompute.createTexture();
 *
 * // Fill in here inputTexture...
 *
 * myFilter1.uniforms.theTexture.value = inputTexture;
 *
 * var myRenderTarget = gpuCompute.createRenderTarget();
 * myFilter2.uniforms.theTexture.value = myRenderTarget.texture;
 *
 * var outputRenderTarget = gpuCompute.createRenderTarget();
 *
 * // Now use the output texture where you want:
 * myMaterial.uniforms.map.value = outputRenderTarget.texture;
 *
 * // And compute each frame, before rendering to screen:
 * gpuCompute.doRenderTarget( myFilter1, myRenderTarget );
 * gpuCompute.doRenderTarget( myFilter2, outputRenderTarget );
 * 
 *
 *
 * @param {int} sizeX Computation problem size is always 2d: sizeX * sizeY elements.
 * @param {int} sizeY Computation problem size is always 2d: sizeX * sizeY elements.
 * @param {WebGLRenderer} renderer The renderer
  */

function GPUComputationRenderer(sizeX, sizeY, renderer) {

	this.variables = [];

	this.currentTextureIndex = 0;

	var scene = new THREE.Scene();

	var camera = new THREE.Camera();
	camera.position.z = 1;

	var passThruUniforms = {
		texture: { value: null }
	};

	var passThruShader = createShaderMaterial(getPassThroughFragmentShader(), passThruUniforms);

	var mesh = new THREE.Mesh(new THREE.PlaneBufferGeometry(2, 2), passThruShader);
	scene.add(mesh);

	this.addVariable = function (variableName, computeFragmentShader, initialValueTexture) {

		var material = this.createShaderMaterial(computeFragmentShader);

		var variable = {
			name: variableName,
			initialValueTexture: initialValueTexture,
			material: material,
			dependencies: null,
			renderTargets: [],
			wrapS: null,
			wrapT: null,
			minFilter: THREE.NearestFilter,
			magFilter: THREE.NearestFilter
		};

		this.variables.push(variable);

		return variable;
	};

	this.setVariableDependencies = function (variable, dependencies) {

		variable.dependencies = dependencies;
	};

	this.init = function () {

		if (!renderer.extensions.get("OES_texture_float")) {

			return "No OES_texture_float support for float textures.";
		}

		if (renderer.capabilities.maxVertexTextures === 0) {

			return "No support for vertex shader textures.";
		}

		for (var i = 0; i < this.variables.length; i++) {

			var variable = this.variables[i];

			// Creates rendertargets and initialize them with input texture
			variable.renderTargets[0] = this.createRenderTarget(sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter);
			variable.renderTargets[1] = this.createRenderTarget(sizeX, sizeY, variable.wrapS, variable.wrapT, variable.minFilter, variable.magFilter);
			this.renderTexture(variable.initialValueTexture, variable.renderTargets[0]);
			this.renderTexture(variable.initialValueTexture, variable.renderTargets[1]);

			// Adds dependencies uniforms to the ShaderMaterial
			var material = variable.material;
			var uniforms = material.uniforms;
			if (variable.dependencies !== null) {

				for (var d = 0; d < variable.dependencies.length; d++) {

					var depVar = variable.dependencies[d];

					if (depVar.name !== variable.name) {

						// Checks if variable exists
						var found = false;
						for (var j = 0; j < this.variables.length; j++) {

							if (depVar.name === this.variables[j].name) {
								found = true;
								break;
							}
						}
						if (!found) {
							return "Variable dependency not found. Variable=" + variable.name + ", dependency=" + depVar.name;
						}
					}

					uniforms[depVar.name] = { value: null };

					material.fragmentShader = "\nuniform sampler2D " + depVar.name + ";\n" + material.fragmentShader;
				}
			}
		}

		this.currentTextureIndex = 0;

		return null;
	};

	this.compute = function () {

		var currentTextureIndex = this.currentTextureIndex;
		var nextTextureIndex = this.currentTextureIndex === 0 ? 1 : 0;

		for (var i = 0, il = this.variables.length; i < il; i++) {

			var variable = this.variables[i];

			// Sets texture dependencies uniforms
			if (variable.dependencies !== null) {

				var uniforms = variable.material.uniforms;
				for (var d = 0, dl = variable.dependencies.length; d < dl; d++) {

					var depVar = variable.dependencies[d];

					uniforms[depVar.name].value = depVar.renderTargets[currentTextureIndex].texture;
				}
			}

			// Performs the computation for this variable
			this.doRenderTarget(variable.material, variable.renderTargets[nextTextureIndex]);
		}

		this.currentTextureIndex = nextTextureIndex;
	};

	this.getCurrentRenderTarget = function (variable) {

		return variable.renderTargets[this.currentTextureIndex];
	};

	this.getAlternateRenderTarget = function (variable) {

		return variable.renderTargets[this.currentTextureIndex === 0 ? 1 : 0];
	};

	function addResolutionDefine(materialShader) {

		materialShader.defines.resolution = 'vec2( ' + sizeX.toFixed(1) + ', ' + sizeY.toFixed(1) + " )";
	}
	this.addResolutionDefine = addResolutionDefine;

	// The following functions can be used to compute things manually

	function createShaderMaterial(computeFragmentShader, uniforms) {

		uniforms = uniforms || {};

		var material = new THREE.ShaderMaterial({
			uniforms: uniforms,
			vertexShader: getPassThroughVertexShader(),
			fragmentShader: computeFragmentShader
		});

		addResolutionDefine(material);

		return material;
	}
	this.createShaderMaterial = createShaderMaterial;

	this.createRenderTarget = function (sizeXTexture, sizeYTexture, wrapS, wrapT, minFilter, magFilter) {

		sizeXTexture = sizeXTexture || sizeX;
		sizeYTexture = sizeYTexture || sizeY;

		wrapS = wrapS || THREE.ClampToEdgeWrapping;
		wrapT = wrapT || THREE.ClampToEdgeWrapping;

		minFilter = minFilter || THREE.NearestFilter;
		magFilter = magFilter || THREE.NearestFilter;

		var renderTarget = new THREE.WebGLRenderTarget(sizeXTexture, sizeYTexture, {
			wrapS: wrapS,
			wrapT: wrapT,
			minFilter: minFilter,
			magFilter: magFilter,
			format: THREE.RGBAFormat,
			type: /(iPad|iPhone|iPod)/g.test(navigator.userAgent) ? THREE.HalfFloatType : THREE.FloatType,
			stencilBuffer: false
		});

		return renderTarget;
	};

	this.createTexture = function (sizeXTexture, sizeYTexture) {

		sizeXTexture = sizeXTexture || sizeX;
		sizeYTexture = sizeYTexture || sizeY;

		var a = new Float32Array(sizeXTexture * sizeYTexture * 4);
		var texture = new THREE.DataTexture(a, sizeX, sizeY, THREE.RGBAFormat, THREE.FloatType);
		texture.needsUpdate = true;

		return texture;
	};

	this.renderTexture = function (input, output) {

		// Takes a texture, and render out in rendertarget
		// input = Texture
		// output = RenderTarget

		passThruUniforms.texture.value = input;

		this.doRenderTarget(passThruShader, output);

		passThruUniforms.texture.value = null;
	};

	this.doRenderTarget = function (material, output) {

		mesh.material = material;
		renderer.render(scene, camera, output);
		mesh.material = passThruShader;
	};

	// Shaders

	function getPassThroughVertexShader() {

		return "void main()	{\n" + "\n" + "	gl_Position = vec4( position, 1.0 );\n" + "\n" + "}\n";
	}

	function getPassThroughFragmentShader() {

		return "uniform sampler2D texture;\n" + "\n" + "void main() {\n" + "\n" + "	vec2 uv = gl_FragCoord.xy / resolution.xy;\n" + "\n" + "	gl_FragColor = texture2D( texture, uv );\n" + "\n" + "}\n";
	}
}

/***/ }),
/* 4 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float size;\nuniform sampler2D tPosition;\nuniform sampler2D tVelocity;\nvarying vec3 vPosition;\n\nvoid main() {\n  vec4 vel = texture2D(tVelocity, uv);\n  vec4 posTemp = texture2D(tPosition, uv);\n  vec3 pos = posTemp.xyz;\n  vPosition = pos;\n  gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);\n  gl_PointSize = size;\n}\n"

/***/ }),
/* 5 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nuniform float time;\nvarying vec3 vPosition;\n\nfloat map_1_0(float value, float inMin, float inMax, float outMin, float outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec2 map_1_0(vec2 value, vec2 inMin, vec2 inMax, vec2 outMin, vec2 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec3 map_1_0(vec3 value, vec3 inMin, vec3 inMax, vec3 outMin, vec3 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\nvec4 map_1_0(vec4 value, vec4 inMin, vec4 inMax, vec4 outMin, vec4 outMax) {\n  return outMin + (outMax - outMin) * (value - inMin) / (inMax - inMin);\n}\n\n\n\n\nvoid main() {\n  float x = abs(vPosition.x);\n  float y = abs(vPosition.y);\n  float z = abs(vPosition.z);\n  float r = map_1_0(x, 0.0, 4.5, 0.0, 0.5);\n  float g = map_1_0(y, 0.0, 4.5, 0.0, 0.5);\n  float b = map_1_0(z, 0.0, 4.5, 0.0, 0.5);\n  gl_FragColor = vec4(r,g,b, 0.9);\n}\n"

/***/ }),
/* 6 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\n#define delta ( 1.0 / 60.0 )\n\nvoid main() {\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n  vec4 tmpPos = texture2D(tPosition, uv);\n  vec3 pos = tmpPos.xyz;\n  vec4 tmpVel = texture2D(tVelocity, uv );\n  vec3 vel = tmpVel.xyz;\n  float mass = tmpVel.w;\n\n  if ( mass == 0.0 ) {\n    vel = vec3( 0.0 );\n  }\n\n  pos += vel * delta;\n\n  gl_FragColor = vec4(pos, 1.0 );\n}\n"

/***/ }),
/* 7 */
/***/ (function(module, exports) {

module.exports = "#define GLSLIFY 1\nvoid main() {\n  vec3 gravity = vec3(0.0, -0.0981, 0.0);\n  vec3 center = vec3(0.0);\n\n  vec2 uv = gl_FragCoord.xy / resolution.xy;\n  vec4 tmpPos = texture2D(tPosition, uv);\n  vec3 pos = tmpPos.xyz;\n  vec4 tmpVel = texture2D(tVelocity, uv);\n  vec3 vel = tmpVel.xyz;\n  float mass = tmpVel.w;\n\n  vel += (center - pos) * 0.001;\n  // vel= (vel + gravity) * mass;\n  /*\n  if (tmpPos.y <= -1.5) {\n    vel.y = 6.0;//-vel.y + 3.0;\n  }\n  if (abs(tmpPos.x) > 1.0) {\n    //vel.x = -tmpPos.x * 3.5;\n    //vel.z = tmpPos.z * 3.5;\n  }\n  if (abs(tmpPos.z) > 1.0) {\n    //vel.x = tmpPos.x * 3.5;\n    //vel.z = -tmpPos.z * 3.5;\n  }\n  */\n  gl_FragColor = vec4(vel, mass);\n}\n"

/***/ })
/******/ ]);
});