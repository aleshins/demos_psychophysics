/* global THREE, getDefaultParams */

'use strict';

let camera;
let renderer;
const currentParameters = getDefaultParams();
// once everything is loaded, we run our Three.js stuff.
function init() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();

  // create a camera, which defines where we're looking at.
  camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(currentParameters.renderer.color));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = currentParameters.renderer.shadows;

  // create the landscape
  const landscapeGeometry = new THREE.PlaneGeometry(
    currentParameters.landscape.width,
    currentParameters.landscape.height,
  );
  const landscapeMaterial = new THREE.MeshLambertMaterial({ color: currentParameters.landscape.color });
  const landscape = new THREE.Mesh(landscapeGeometry, landscapeMaterial);

  landscape.rotation.x = currentParameters.landscape.rotation.x;
  landscape.rotation.y = currentParameters.landscape.rotation.y;
  landscape.rotation.z = currentParameters.landscape.rotation.z;

  landscape.position.x = currentParameters.landscape.position.x;
  landscape.position.y = currentParameters.landscape.position.y;
  landscape.position.z = currentParameters.landscape.position.z;

  landscape.receiveShadow = currentParameters.landscape.shadows;
  scene.add(landscape);

  // create a SFM shapes
  let parentGeometry = new THREE.SphereGeometry(
    currentParameters.parentShape.size,
    currentParameters.parentShape.numberOfVertices,
    currentParameters.parentShape.numberOfVertices,
  );
  let parentMaterial = new THREE.MeshLambertMaterial({
    color: 0x7777ff,
    opacity: 0.3,
    transparent: true,
  });


  let parentShape = new THREE.Mesh(parentGeometry, parentMaterial); // new THREE.Mesh();

  const childShapeGeometry = new THREE.SphereGeometry(
    currentParameters.childShape.size,
    currentParameters.childShape.numberOfVertices,
    currentParameters.childShape.numberOfVertices,
  );
  const childShapeMaterial = new THREE.MeshLambertMaterial({
    color: currentParameters.childShape.color,
  });
  const childShapeTemplate = new THREE.Mesh(childShapeGeometry, childShapeMaterial);
  childShapeTemplate.castShadow = currentParameters.childShape.shadows;
  for (let i = 0, l = currentParameters.parentShape.numberOfChilds; i < l; i++) {
    const childShape = childShapeTemplate.clone();
    // add random dot to parent shape
    [childShape.position.x, childShape.position.y, childShape.position.z] =
    generateRandomDotOnSphere(0, 0, 0, currentParameters.parentShape.size);
    parentShape.add(childShape);
  }
  scene.add(parentShape);
  // add fixation point
  let fixationGeometry = new THREE.TorusKnotGeometry(3, 1);
  let fixationMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00 });
  let fixationShape = new THREE.Mesh(fixationGeometry, fixationMaterial);
  fixationShape.castShadow = true;
  fixationShape.receiveShadow = true;
  scene.add(fixationShape);
  // position and point the camera to the center of the scene
  camera.position.copy({ x: 0, y: 0, z: 100 });
  camera.lookAt(parentShape.position);
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
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}


window.onload = init;
// listen to the resize events
window.addEventListener('resize', onResize, false);

// *********************************************
// *********HELPERS*****************************
function generateRandomDotOnSphere(x0, y0, z0, radius) {
/*
source: https://stackoverflow.com/questions/5531827/random-point-on-a-given-sphere
Returns a random point of a sphere, evenly distributed over the sphere.
The sphere is centered at (x0,y0,z0) with the passed in radius.
The returned point is returned as a three element array [x,y,z].
*/
  let u = Math.random();
  let v = Math.random();
  let theta = 2 * Math.PI * u;
  let phi = Math.acos(2 * v - 1);
  let x = x0 + (radius * Math.sin(phi) * Math.cos(theta));
  let y = y0 + (radius * Math.sin(phi) * Math.sin(theta));
  let z = z0 + (radius * Math.cos(phi));
  return [x, y, z];
}
