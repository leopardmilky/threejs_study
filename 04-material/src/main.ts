import { OrbitControls } from 'three/examples/jsm/Addons.js'
import './style.css'
import * as THREE from "three"
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'

class App {
  private domApp: Element
  private renderer: THREE.WebGLRenderer
  private scene: THREE.Scene
  private camera?: THREE.PerspectiveCamera

  constructor() {
    console.log('Hello three.js')

    this.domApp = document.querySelector('#app')!
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true })
    this.renderer.setPixelRatio(window.devicePixelRatio)
    this.domApp.appendChild(this.renderer.domElement)
    this.scene = new THREE.Scene()

    this.setupCamera()
    this.setupLight()
    this.setupModels()
    this.setupEvents()
  }

  private setupCamera() {
    const domApp = this.domApp
    const width = domApp.clientWidth
    const height = domApp.clientHeight
    
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100);
    this.camera.position.z = 4;

    new OrbitControls(this.camera, this.domApp as HTMLElement);
  }

  private setupLight() {
    const color = 0xffffff
    const intensity = 1
    const light = new THREE.DirectionalLight(color, intensity)
    light.position.set(-1, 2, 4)
    this.scene.add(light)
  }

  // private setupModels() {
    // const geometry = new THREE.SphereGeometry();
    // geometry.deleteAttribute("uv");
    // const circle = new THREE.TextureLoader().load("./circle.png");
    // const material = new THREE.PointsMaterial({
    //   color: 0xff0000,  // 색상 이름으로도 지정 가능. (ex: "green", "#ffff00")
    //   size: 5,
    //   sizeAttenuation: true,
    //   map: circle,
    //   alphaTest: 0.5
    // });
    // const points = new THREE.Points(geometry, material);
    // this.scene.add(points);

    // const gui = new GUI();
    // gui.add(material, "size", 0.1, 10, 0.01);
  // }

  // private setupModels() {
  //   const vertices = [
  //     -1, 1, 0,
  //     1, 1, 0,
  //     -1, -1, 0,
  //     1, -1, 0,
  //   ];

  //   const geometry = new THREE.BufferGeometry();

  //   geometry.setAttribute("position", new THREE.Float32BufferAttribute(vertices, 3));

  //   // const material = new THREE.LineBasicMaterial({
  //   //   color: 0xffff00
  //   // });
  //   const material = new THREE.LineDashedMaterial({
  //     color: 0xffff00,
  //     dashSize: 0.2,
  //     gapSize: 0.1,
  //     scale: 1
  //   });

  //   // const line = new THREE.Line(geometry, material);
  //   // const line = new THREE.LineLoop(geometry, material);
  //   const line = new THREE.LineSegments(geometry, material);
  //   line.computeLineDistances();
  //   this.scene.add(line);
  // }

  private setupModels() {
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: false,

      visible: true,
      transparent: false,
      opacity: 1,
      depthTest: true,
      depthWrite: true,
      side: THREE.FrontSide,
    });

    const geomCylinder = new THREE.CylinderGeometry(0.6, 0.9, 1.2, 64, 1);
    const cylinder = new THREE.Mesh(geomCylinder, material);
    cylinder.position.x = -1;
    this.scene.add(cylinder);

    const geomTorusknot = new THREE.TorusKnotGeometry(0.4, 0.18, 128, 64);
    const torusknot = new THREE.Mesh(geomTorusknot, material);
    torusknot.position.x = 1;
    this.scene.add(torusknot);
  }

  private setupEvents() {
    window.onresize = this.resize.bind(this)
    this.resize()
    this.renderer.setAnimationLoop(this.render.bind(this))
  }

  private resize() {
    const domApp = this.domApp
    const width = domApp.clientWidth
    const height = domApp.clientHeight

    const camera = this.camera
    if(camera) {
      camera.aspect = width / height
      camera.updateProjectionMatrix()
    }

    this.renderer.setSize(width, height)
  }

  private update(time: number) {
    time *= 0.001 // ms -> s
  }

  private render(time: number) {
    this.update(time)
    this.renderer.render(this.scene, this.camera!)
  }
}

new App()