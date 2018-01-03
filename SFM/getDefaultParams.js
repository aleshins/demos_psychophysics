function getDefaultParams() {
  // Define default parameters
  const defaultParameters = { // define all backgroun
    renderer: {
      color: 0xFFFFFF,
      shadows: true,
    }, // renderer

    landscape: {
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
    }, // landscape
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
  return defaultParameters;
}
