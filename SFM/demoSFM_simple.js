
/* global THREE */

'use strict';

// Define default parameters
const generalParameters = { // define all backgroun
  renderer: {
    backgroundColor: 0xFFFFFF,
    shadowsEnabled: true,
  },
};
// once everything is loaded, we run our Three.js stuff.
function init() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(generalParameters.renderer.backgroundColor));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = generalParameters.renderer.shadowsEnabled;

  // create the ground plane
  const planeGeometry = new THREE.PlaneGeometry(80, 80);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.set(-0.5 * Math.PI, 0, 0);
  plane.position.set(10, -30, -20);
  scene.add(plane);

  // create a SFM shapes
  const parentGeometry = new THREE.SphereGeometry(20, 10, 10);
  const vertices = parentGeometry.vertices;
  const parentShape = new THREE.Mesh();
  const childShapeGeometry = new THREE.SphereGeometry(2, 10, 10);
  const childShapeMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
  const childShapeTemplate = new THREE.Mesh(childShapeGeometry, childShapeMaterial);
  childShapeTemplate.castShadow = true;
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
