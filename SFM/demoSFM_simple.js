//123
/* global THREE */

'use strict';

// Define default parameters
const defaultParameters = { // define all backgroun
  renderer: {
    color: 0xFFFFFF,
    shadows: true,
  }, // renderer

  plane: {
    color: 0xFFFFFF,
    shadows: true,
    width: 80,
    height: 80,

    rotation: {
      x: -0.5 * Math.PI,
      y: 0,
      z: 0,
    }, // rotation

    position: {
      x: 10,
      y: -30,
      z: -20,
    }, // position
  }, // plane
  parentShape: {
    numberOfNodes: 10,
    size: 20,
  }, // parent shape
  childShape: {
    numberOfNodes: 10,
    size: 1,
    color: 0x7777ff,
    shadows: true,
  }, // child shape
};
// once everything is loaded, we run our Three.js stuff.
function init() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(defaultParameters.renderer.color));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = defaultParameters.renderer.shadows;

  // create the ground plane
  const planeGeometry = new THREE.PlaneGeometry(
    defaultParameters.plane.width,
    defaultParameters.plane.height,
  );
  const planeMaterial = new THREE.MeshLambertMaterial({ color: defaultParameters.plane.color });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);

  plane.rotation.x = defaultParameters.plane.rotation.x;
  plane.rotation.y = defaultParameters.plane.rotation.y;
  plane.rotation.z = defaultParameters.plane.rotation.z;

  plane.position.x = defaultParameters.plane.position.x;
  plane.position.y = defaultParameters.plane.position.y;
  plane.position.z = defaultParameters.plane.position.z;

  plane.receiveShadow = defaultParameters.plane.shadows;
  scene.add(plane);

  // create a SFM shapes
  const parentGeometry = new THREE.SphereGeometry(
    defaultParameters.parentShape.size,
    defaultParameters.parentShape.numberOfNodes,
    defaultParameters.parentShape.numberOfNodes,
  );

  const vertices = parentGeometry.vertices;
  const parentShape = new THREE.Mesh();

  const childShapeGeometry = new THREE.SphereGeometry(
    defaultParameters.childShape.size,
    defaultParameters.childShape.numberOfNodes,
    defaultParameters.childShape.numberOfNodes,
  );
  const childShapeMaterial = new THREE.MeshLambertMaterial({
    color: defaultParameters.childShape.color,
  });
  const childShapeTemplate = new THREE.Mesh(childShapeGeometry, childShapeMaterial);
  childShapeTemplate.castShadow = defaultParameters.childShape.shadows;
  for (let i = 0, l = vertices.length; i < l; i++) {
    const childShape = childShapeTemplate.clone();
    childShape.position.copy(vertices[i]);
    parentShape.add(childShape);
  }
  scene.add(parentShape);

  // position and point the camera to the center of the scene
  camera.position.copy({ x: 0, y: 0, z: 100 });
  camera.lookAt(scene.position);
  // add spotlight for the shadows
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-100, 100, 50);
  spotLight.castShadow = true;
  scene.add(spotLight);
  // Output
  document.getElementById('WebGL-output').appendChild(renderer.domElement);
  renderScene();

  function renderScene() {
    parentShape.rotation.y += 0.02;
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }
}
window.onload = init;
