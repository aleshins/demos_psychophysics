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
  camera = new THREE.OrthographicCamera( window.innerWidth / - 20, window.innerWidth / 20, window.innerHeight / 20, window.innerHeight / - 20, 1, 1000 );

  // create a render and set the size
  renderer = new THREE.WebGLRenderer();
  renderer.setClearColor(new THREE.Color(currentParameters.renderer.color));
  renderer.setSize(window.innerWidth, window.innerHeight);


  // create a SFM shapes
  let parentShape = new THREE.Mesh();

  const childShapeGeometry = new THREE.SphereGeometry(
    currentParameters.childShape.size,
    currentParameters.childShape.numberOfVertices,
    currentParameters.childShape.numberOfVertices,
  );
  const childShapeMaterial = new THREE.MeshBasicMaterial({
    color: currentParameters.childShape.color,
  });
  const childShapeTemplate = new THREE.Mesh(childShapeGeometry, childShapeMaterial);
  for (let i = 0, l = currentParameters.parentShape.numberOfChilds; i < l; i++) {
    const childShape = childShapeTemplate.clone();
    // add random dot to parent shape
    [childShape.position.x, childShape.position.y, childShape.position.z] =
    generateRandomDotOnSphere(0, 0, 0, currentParameters.parentShape.size);
    parentShape.add(childShape);
  }
  scene.add(parentShape);
  // add fixation point
  let fixationGeometry = new THREE.CircleGeometry(1, 10);
  let fixationMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
  let fixationShape = new THREE.Mesh(fixationGeometry, fixationMaterial);
  fixationShape.position.z = -100;

  scene.add(fixationShape);
  // position and point the camera to the center of the scene
  camera.position.copy({ x: 0, y: 0, z: 100 });
  camera.lookAt(parentShape.position);
  // add ambientLight for the shadows
  const ambientLight = new THREE.AmbientLight(0xffffff);
  ambientLight.position.set(-100, 100, 50);
  scene.add(ambientLight);
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
function getDefaultParams() {
  // Define default parameters
  const defaultParameters = { // define all backgroun
    renderer: {
      color: 0xFFFFFF,
    }, // renderer
    parentShape: {
      numberOfVertices: 10,
      size: 20,
      numberOfChilds: 50,
    }, // parent shape
    childShape: {
      numberOfVertices: 5,
      size: 1,
      color: 0x7777ff,
    }, // child shape
  };
  return defaultParameters;
}
