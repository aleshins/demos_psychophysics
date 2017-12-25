
/* global THREE */

'use strict';

// Define default parameters
const generalParameters = { // define all backgroun
  backgroundColor: 0xFFFFFF,
  shadowsEnabled: true,
};
// once everything is loaded, we run our Three.js stuff.
function init() {
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // Initialize render
  const renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(generalParameters.backgroundColor));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = generalParameters.shadowsEnabled;

  // create the ground plane
  const planeGeometry = new THREE.PlaneGeometry(80, 80);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 10;
  plane.position.y = -30;
  plane.position.z = -20;
  scene.add(plane);

  // create a SFM shape
  const parentGeometry = new THREE.SphereGeometry(20, 10, 10);
  const vertices = parentGeometry.vertices;
  const parentShape = new THREE.Mesh();
  const childShapeGeometry = new THREE.SphereGeometry(2, 10, 10);
  const childShapeMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
  const childShape = new THREE.Mesh(childShapeGeometry, childShapeMaterial);
  childShape.castShadow = true;
  for (let i = 0, l = vertices.length; i < l; i++) {
    childShape.position.set(vertices[i]);
    parentShape.add(childShape);
  }

  // add the sphere to the scene

  scene.add(parentShape);
  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 100;
  camera.lookAt(scene.position);
  // add spotlight for the shadows
  const spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-100, 100, 50);
  spotLight.castShadow = true;
  scene.add(spotLight);
  // add the output of the renderer to the html element
  document.getElementById('WebGL-output').appendChild(renderer.domElement);
  // call the render function
  renderScene();
  function renderScene() {
    // rotate parent shape
    parentShape.rotation.y += 0.02;
    // render using requestAnimationFrame
    requestAnimationFrame(renderScene);
    renderer.render(scene, camera);
  }
}
window.onload = init;
