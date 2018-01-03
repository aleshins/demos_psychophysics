/* global THREE, getDefaultParams */

'use strict';

const defaultParameters = getDefaultParams();
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

  // create the landscape
  const landscapeGeometry = new THREE.PlaneGeometry(
    defaultParameters.landscape.width,
    defaultParameters.landscape.height,
  );
  const landscapeMaterial = new THREE.MeshLambertMaterial({ color: defaultParameters.landscape.color });
  const landscape = new THREE.Mesh(landscapeGeometry, landscapeMaterial);

  landscape.rotation.x = defaultParameters.landscape.rotation.x;
  landscape.rotation.y = defaultParameters.landscape.rotation.y;
  landscape.rotation.z = defaultParameters.landscape.rotation.z;

  landscape.position.x = defaultParameters.landscape.position.x;
  landscape.position.y = defaultParameters.landscape.position.y;
  landscape.position.z = defaultParameters.landscape.position.z;

  landscape.receiveShadow = defaultParameters.landscape.shadows;
  scene.add(landscape);

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
