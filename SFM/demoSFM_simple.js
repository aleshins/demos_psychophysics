
/* global THREE */

'use strict';

// Define default parameters
const generalParameters = { // define all backgroun
  backgroundColor: 0xFFFFFF,
  shadowsEnabled: true,
};
// once everything is loaded, we run our Three.js stuff.
function init() {
  // create a scene, that will hold all our elements such as objects, cameras and lights.
  const scene = new THREE.Scene();
  // create a camera, which defines where we're looking at.
  const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);

  // create a render and set the size
  const renderer = new THREE.WebGLRenderer();

  renderer.setClearColor(new THREE.Color(generalParameters.backgroundColor));
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.shadowMap.enabled = generalParameters.shadowsEnabled;
  // create the ground plane
  const planeGeometry = new THREE.PlaneGeometry(80, 80);
  const planeMaterial = new THREE.MeshLambertMaterial({ color: 0xffffff });
  const plane = new THREE.Mesh(planeGeometry, planeMaterial);
  plane.receiveShadow = true;
  // rotate and position the plane
  plane.rotation.x = -0.5 * Math.PI;
  plane.position.x = 10;
  plane.position.y = -30;
  plane.position.z = -20;
  // add the plane to the scene
  scene.add(plane);
  // create a sphere
  const parentGeometry = new THREE.SphereGeometry(20, 10, 10);
  const vertices = parentGeometry.vertices;
  const parentMesh = new THREE.Mesh();
  for (let i = 0, l = vertices.length; i < l; i++) {
    const childSphereGeometry = new THREE.SphereGeometry(2, 10, 10);
    const childSphereMaterial = new THREE.MeshLambertMaterial({ color: 0x7777ff });
    const childSphere = new THREE.Mesh(childSphereGeometry, childSphereMaterial);
    childSphere.position.x = vertices[i].x;
    childSphere.position.y = vertices[i].y;
    childSphere.position.z = vertices[i].z;
    childSphere.castShadow = true;
    parentMesh.add(childSphere);
  }

  // add the sphere to the scene

  scene.add(parentMesh);
  // position and point the camera to the center of the scene
  camera.position.x = 0;
  camera.position.y = 0;
  camera.position.z = 100;
  camera.lookAt(scene.position);
  // add spotlight for the shadows
  let spotLight = new THREE.SpotLight(0xffffff);
  spotLight.position.set(-100, 100, 50);
  spotLight.castShadow = true;
  scene.add(spotLight);
  // add the output of the renderer to the html element
  document.getElementById('WebGL-output').appendChild(renderer.domElement);
  // call the render function
  renderScene();
  function renderScene() {
      //stats.update();
      // rotate the cube around its axes
     // pool.rotation.x += 0.02;
      parentMesh.rotation.y += 0.02;
     // pool.rotation.z += 0.02;

     // render using requestAnimationFrame
      requestAnimationFrame(renderScene);
      renderer.render(scene, camera);
  }
          function initStats() {

      var stats = new Stats();

      stats.setMode(0); // 0: fps, 1: ms

      // Align top-left
      stats.domElement.style.position = 'absolute';
      stats.domElement.style.left = '0px';
      stats.domElement.style.top = '0px';

      document.getElementById("Stats-output").appendChild(stats.domElement);

      return stats;
  }
}
window.onload = init;
