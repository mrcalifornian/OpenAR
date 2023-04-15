const scene = new THREE.Scene();
const camera = new THREE.Camera();
const renderer = new THREE.WebGLRenderer({
  antialias: true,
  alpha: true
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
document.body.appendChild(renderer.domElement);

const arToolkitSource = new THREEx.ArToolkitSource({
  sourceType: 'webcam'
});

const arToolkitContext = new THREEx.ArToolkitContext({
  cameraParametersUrl: 'data/camera_para.dat',
  detectionMode: 'mono',
  maxDetectionRate: 30,
  canvasWidth: 80*3,
  canvasHeight: 60*3
});

arToolkitSource.init(() => {
  onResize();
});

window.addEventListener('resize', () => {
  onResize();
});

function onResize() {
  arToolkitSource.onResizeElement();
  arToolkitSource.copyElementSizeTo(renderer.domElement);
  if (arToolkitContext.arController !== null) {
    arToolkitSource.copyElementSizeTo(arToolkitContext.arController.canvas);
  }
}

const loader = new THREE.GLTFLoader();

loader.load('models\buster_drone.glb', (glb) => {
  scene.add(glb.scene);
});

arToolkitContext.init(() => {
  camera.projectionMatrix.copy(arToolkitContext.getProjectionMatrix());
});

function update() {
  if (arToolkitSource.ready) {
    arToolkitContext.update(arToolkitSource.domElement);
    scene.visible = camera.visible;
  }
  renderer.render(scene, camera);
  requestAnimationFrame(update);
}
update();
