import { OrbitControls } from 'three/examples/jsm/Addons.js';
import './style.css';
import * as THREE from 'three';

class App {
  private renderer: THREE.WebGLRenderer;
  private domApp: Element;
  private scene: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;

  constructor() {
    console.log("three.js~~");
    this.renderer = new THREE.WebGLRenderer({antialias: true});
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio));

    this.domApp = document.querySelector('#app')!;
    this.domApp.appendChild(this.renderer.domElement);

    this.scene = new THREE.Scene();

    this.setupCamera();
    this.setupLight();
    this.setupModels();
    this.setupEvents();
  }

  private setupCamera() {
    const width = this.domApp.clientWidth;
    const height = this.domApp.clientHeight;

    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100);
    this.camera.position.z = 5;

    new OrbitControls(this.camera, this.domApp as HTMLElement);
  }

  private setupLight() {
    const color = 0xffffff;
    const intensity = 1;
    const light = new THREE.DirectionalLight(color, intensity);
    light.position.set(-1, 2, 4);

    this.scene.add(light);
  }

  // private setupModels() {
  //   const geoBox = new THREE.BoxGeometry(1);
  //   const material = new THREE.MeshStandardMaterial();
  //   const box = new THREE.Mesh(geoBox, material);

  //   // 행렬은 적용 순서에 따라서 결과가 달라짐.
  //   const matrixS = new THREE.Matrix4().makeScale(0.5, 0.5, 0.5);
  //   const matrixR = new THREE.Matrix4().makeRotationX(THREE.MathUtils.degToRad(45));
  //   const matrixT = new THREE.Matrix4().makeTranslation(0, 2, 0);
  //   box.applyMatrix4(matrixS);
  //   box.applyMatrix4(matrixR);
  //   box.applyMatrix4(matrixT);
    
  //   // 하지만 아래의 경우는 순서에 상관없이 scale, rotation, position 순으로 적용이 됨.
  //   // box.position.set(0, 2, 0);
  //   // box.rotation.x = THREE.MathUtils.degToRad(45);
  //   // box.scale.set(0.5, 0.5, 0.5);

  //   this.scene.add(box);

  //   const axesOfscene = new THREE.AxesHelper(5);
  //   this.scene.add(axesOfscene);
  // }

  // private setupModels() {
  //   const material = new THREE.MeshStandardMaterial();
    
  //   const geomParent = new THREE.BoxGeometry(2, 2, 2);
  //   const parent = new THREE.Mesh(geomParent, material);
  //   parent.position.y = 2;
  //   parent.rotation.z = THREE.MathUtils.degToRad(45);

  //   const geomChild = new THREE.BoxGeometry(1, 1, 1);
  //   const child = new THREE.Mesh(geomChild, material);
  //   child.position.x = 3;
  //   child.rotation.y = THREE.MathUtils.degToRad(45);

  //   parent.add(child);
  //   this.scene.add(parent);

  //   const axesOfscene = new THREE.AxesHelper(10);
  //   this.scene.add(axesOfscene);

  //   const axesOfparent = new THREE.AxesHelper(3);
  //   parent.add(axesOfparent);
  // }

  private setupModels() {
    const axisHelper = new THREE.AxesHelper(10);
    this.scene.add(axisHelper);

    const geomGround = new THREE.PlaneGeometry(5, 5);
    const matGround = new THREE.MeshStandardMaterial();
    const ground = new THREE.Mesh(geomGround, matGround);
    ground.rotation.x = -THREE.MathUtils.degToRad(90);
    ground.position.y = -.5;
    this.scene.add(ground);

    const geomBigSphere = new THREE.SphereGeometry(1, 32, 16, 0, THREE.MathUtils.degToRad(360), 0, THREE.MathUtils.degToRad(90));
    const matBigSphere = new THREE.MeshStandardMaterial();
    const bigSphere = new THREE.Mesh(geomBigSphere, matBigSphere);
    bigSphere.position.y = -0.5;
    this.scene.add(bigSphere);

    const geomSmallSphere = new THREE.SphereGeometry(0.2);
    const matSmallSphere = new THREE.MeshStandardMaterial();
    const smallSphere = new THREE.Mesh(geomSmallSphere, matSmallSphere);

    const smallSpherePivot = new THREE.Object3D();
    smallSpherePivot.add(smallSphere);
    bigSphere.add(smallSpherePivot);

    smallSphere.position.x = 2;
    smallSpherePivot.rotation.y = THREE.MathUtils.degToRad(-45);
    smallSpherePivot.position.y = 0.5;
    smallSpherePivot.name = "smallSpherePivot";

    const cntItems = 8;
    const geomTorus = new THREE.TorusGeometry(0.3, 0.1);
    const matTorus = new THREE.MeshStandardMaterial();
    for(let i = 0; i < cntItems; i++) {
      const torus = new THREE.Mesh(geomTorus, matTorus);
      const torusPivot = new THREE.Object3D();
      bigSphere.add(torusPivot);
      torus.position.x = 2;
      torusPivot.position.y = 0.5;
      torusPivot.rotation.y = THREE.MathUtils.degToRad(360) / cntItems * i;
      torusPivot.add(torus);
      
    }
  }

  private setupEvents() {
    window.onresize = this.resize.bind(this);
    this.resize();

    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  private resize() {
    const width = this.domApp.clientWidth;
    const height = this.domApp.clientHeight;

    const camera = this.camera;
    if(camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    this.renderer.setSize(width, height);
  }

  private update(time: number) {
    time *= 0.001 // ms -> s

    const smallSpherePivot = this.scene.getObjectByName("smallSpherePivot");
    if(smallSpherePivot) {
      // smallSpherePivot.rotation.y = time;
      const euler = new THREE.Euler(0, time, 0);
      const quaternion = new THREE.Quaternion().setFromEuler(euler);
      smallSpherePivot.setRotationFromQuaternion(quaternion);

      // smallSpherePivot.quaternion.setFromEuler(euler);
    }
  }

  private render(time: number) {
    this.update(time);
    this.renderer.render(this.scene, this.camera!);
  }
}

new App();