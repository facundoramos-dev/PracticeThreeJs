import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader.js";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry.js";
import * as dat from "lil-gui";
import { gsap } from "gsap/all";

const gui = new dat.GUI();

const canvas = document.querySelector("canvas.webgl");

const scene = new THREE.Scene();

const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("textures/matcaps/8.png");

const fontLoader = new FontLoader();

// const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
// const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);
// const donut = new THREE.Mesh(donutGeometry, material);
// scene.add(donut);

// console.log("donut: ", donut.position);
// gsap.to(donut.rotation, {
//   x: Math.PI,
//   duration: 5,
//   repeat: -1,
//   ease: "none",
// });

fontLoader.load("/fonts/helvetiker_regular.typeface.json", (font) => {
  const textConfig = {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 5,
  };
  const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const textGeometry1 = new TextGeometry("mmm   cereal", textConfig);
  const textGeometry2 = new TextGeometry(".", textConfig);

  textGeometry1.computeBoundingBox();
  textGeometry2.computeBoundingBox();

  textGeometry1.center();
  textGeometry2.center();

  const text1 = new THREE.Mesh(textGeometry1, material);
  const text2 = new THREE.Mesh(textGeometry2, material);
  const text3 = new THREE.Mesh(textGeometry2, material);
  const text4 = new THREE.Mesh(textGeometry2, material);
  const group = new THREE.Group();
  group.add(text1, text2, text3, text4);

  const scale = 1.2;
  // gsap.to(text.scale, {
  //   x: scale,
  //   y: scale,
  //   z: scale,
  //   duration: 5,
  //   repeat: -1,
  //   yoyo: true,
  // });
  const box = textGeometry2.boundingBox.max.x * 2;
  console.log("GEOM", textGeometry1.boundingBox.max);

  text2.position.x = -box / 2;
  text3.position.x = -box * 1.75;
  text4.position.x = -box * 3;

  const boxY =
    textGeometry1.boundingBox.max.y -
    (textGeometry2.boundingBox.max.y - 0.021) * 2;
  text2.position.y = -boxY;
  text3.position.y = -boxY;
  text4.position.y = -boxY;
  // gui.add(text2.position, "y", -box * 4, box, box);
  // gui.add(text3.position, "y", -box * 4, box, box);
  // gui.add(text4.position, "y", -box * 4, box, box);
  console.log("group: ", group);

  scene.add(group);

  const tl = gsap.timeline({
    defaults: { duration: 0.5 },
    repeat: -1,
    yoyo: true,
  });
  tl.fromTo(text4.scale, { x: 0, y: 0 }, { x: 1, y: 1 })
    .fromTo(text3.scale, { x: 0, y: 0 }, { x: 1, y: 1 }, ">")
    .fromTo(text2.scale, { x: 0, y: 0 }, { x: 1, y: 1 }, ">")
    .fromTo(
      group.scale,
      { x: 1, y: 1, z: 1 },
      { x: 1.05, y: 1.05, z: 1.05, duration: 2 },
      ">"
    );

  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 32, 64);

  const min = 5,
    max = 7;

  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, material);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;
    // donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;
    const scale = Math.random();
    donut.scale.set(scale, scale, scale);

    let time = Math.floor(Math.random() * (max - min) + min);
    gsap.to(donut.rotation, {
      x: Math.PI * 2,
      duration: time,
      repeat: -1,
      ease: "none",
    });
    scene.add(donut);
  }
});

const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 1;
camera.position.y = 1;
camera.position.z = 2;
scene.add(camera);

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  controls.update();

  renderer.render(scene, camera);

  window.requestAnimationFrame(tick);
};

tick();
