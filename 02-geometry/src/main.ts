import { OrbitControls, ParametricGeometries, ParametricGeometry } from 'three/examples/jsm/Addons.js'
import './style.css'
import * as THREE from "three"
import GUI from 'three/examples/jsm/libs/lil-gui.module.min.js'
import { degToRad } from 'three/src/math/MathUtils.js';
import { TTFLoader, Font } from 'three/examples/jsm/Addons.js';
import { TextGeometry } from 'three/examples/jsm/Addons.js';

interface IGeometryHelper {
  createGeometry: () => THREE.BufferGeometry;
  createGUI: (update: () => void) => void;
}

class TetrahedronGeometryHelper implements IGeometryHelper {
  private args = {
    radius: .5,
    detail: 0
  }

  public createGeometry() {
    return new THREE.TetrahedronGeometry(
      this.args.radius,
      this.args.detail
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radius", 1, 20).onChange(update);
    gui.add(this.args, "detail", 0, 5, 1).onChange(update);
  }
}

class DodecahedronGeometryHelper implements IGeometryHelper {
  private args = {
    radius: .5,
    detail: 0
  }

  public createGeometry() {
    return new THREE.DodecahedronGeometry(
      this.args.radius,
      this.args.detail
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radius", 1, 20).onChange(update);
    gui.add(this.args, "detail", 0, 5, 1).onChange(update);
  }
}

class IcosahedronGeometryHelper implements IGeometryHelper {
  private args = {
    radius: .5,
    detail: 0
  }

  public createGeometry() {
    return new THREE.IcosahedronGeometry(
      this.args.radius,
      this.args.detail
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radius", 1, 20).onChange(update);
    gui.add(this.args, "detail", 0, 5, 1).onChange(update);
  }
}

class OctahedronGeometryHelper implements IGeometryHelper {
  private args = {
    radius: .5,
    detail: 0
  }

  public createGeometry() {
    return new THREE.OctahedronGeometry(
      this.args.radius,
      this.args.detail
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radius", 1, 20).onChange(update);
    gui.add(this.args, "detail", 0, 5, 1).onChange(update);
  }
}

class ParametricGeometryHelper implements IGeometryHelper {
  private args = {
    slices: 25,
    stacks: 25
  }

  public createGeometry() {
    // const funcUV = ParametricGeometries.plane(10, 10);
    // const funcUV = ParametricGeometries.klein;
    // const funcUV = ParametricGeometries.mobius;
    const funcUV = ParametricGeometries.mobius3d;
    const geometry = new ParametricGeometry(
      funcUV,
      this.args.slices,
      this.args.stacks
    )
    
    geometry.center();
    geometry.scale(0.1, 0.1, 0.1);

    return geometry;
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "slices", 1, 128, 1).onChange(update);
    gui.add(this.args, "stacks", 1, 128, 1).onChange(update);
  }
}

class CustomSinCurve extends THREE.Curve<THREE.Vector3> {
  private scale = 1;

  constructor(scale = 1) {
    super();
    this.scale = scale;
  }

  getPoint(t: number, optionalTarget = new THREE.Vector3()) {
    const tx = t * 3 - 1.5;
    const ty = Math.sin(2 * Math.PI * t);
    const tz = 0;
    return optionalTarget.set(tx, ty, tz).multiplyScalar(this.scale);
  }
}
class TubeGeometryHelper implements IGeometryHelper {
  private args = {
    segments: 20,
    radius: 0.15,
    radialSegments: 8,
    closed: false
  }

  public createGeometry() {
    const curve = new CustomSinCurve(0.7);
    return new THREE.TubeGeometry(
      curve,
      this.args.segments,
      this.args.radius,
      this.args.radialSegments,
      this.args.closed
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "segments", 1, 100, 1).onChange(update);
    gui.add(this.args, "radius", .1, 5, 0.01).onChange(update);
    gui.add(this.args, "radialSegments", 1, 20, 1).onChange(update);
    gui.add(this.args, "closed").onChange(update);
  }
}

class LatheGeometryHelper implements IGeometryHelper {
  private args = {
    segments: 12,
    phiStart: 0,
    phiLength: 360
  }

  public createGeometry() {
    const points = [];

    for(let i = 0; i < 20; i++) {
      points.push(
        new THREE.Vector2(
          Math.sin(i * 0.2) * 7 * (i / 20) + 5,
          (i - 10) * 2 
        )
      );
    }

    const geometry = new THREE.LatheGeometry(
      points,
      this.args.segments,
      degToRad(this.args.phiStart),
      degToRad(this.args.phiLength)
    )

    geometry.scale(0.04, 0.04, 0.04);

    return geometry;
  }

  public createGUI (update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "segments", 1, 30).step(1).onChange(update);
    gui.add(this.args, "phiStart", 0, 360).onChange(update);
    gui.add(this.args, "phiLength", 0, 360).onChange(update);
  }
}

class TextGeometryHelper implements IGeometryHelper {
  private args = {
    text: "Hello world",
    size: .5,
    height: .1,
    curveSegments: 2,
    bevelSegments: 3,
    bevelThickness: 0.1,
    bevelSize: .01,
    bevelOffset: 0,
    bevelEnabled: true
  }

  private font: Font

  constructor(font: Font) {
    this.font = font;
  }

  public createGeometry() {
    const geometry = new TextGeometry(this.args.text, {
      font: this.font,
      ...this.args
    });

    geometry.center();

    return geometry;
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "text").onChange(update);
    gui.add(this.args, "size", 0.1, 1, 0.01).onChange(update);
    gui.add(this.args, "height", 0.1, 1, 0.01).onChange(update);
    gui.add(this.args, "curveSegments", 1, 32, 1).onChange(update);
    gui.add(this.args, "bevelSegments", 1, 32, 1).onChange(update);
    gui.add(this.args, "bevelThickness", 0.01, 1, 0.001).onChange(update);
    gui.add(this.args, "bevelSize", 0.01, 1, 0.001).onChange(update);
    gui.add(this.args, "bevelOffset", -1, 1, 0.001).onChange(update);
    gui.add(this.args, "bevelEnabled").onChange(update);
  }
}

class ExtrudeGeometryHelper implements IGeometryHelper {
  private args = {
    steps: 2,
    depth: .5,
    bevelEnabled: true,
    bevelThickness: 0.2,
    bevelSize: .1,
    bevelOffset: 0,
    curveSegments: 12,
    bevelSegments: 1
  }

  public createGeometry() {
    const x = 0, y = 0;
    const shape = new THREE.Shape();
    shape.moveTo(x + 5, y + 5);
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const geometry = new THREE.ExtrudeGeometry(shape, this.args);
    geometry.center();
    geometry.scale(0.1, -0.1, 1);

    return geometry;
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "steps", 1, 10, 1).onChange(update);
    gui.add(this.args, "depth", 0, 2, 0.01).onChange(update);
    gui.add(this.args, "bevelThickness", 0, 1, 0.01).onChange(update);
    gui.add(this.args, "bevelSize", 0, 1, 0.01).onChange(update);
    gui.add(this.args, "bevelOffset", -4, 5, 0.01).onChange(update);
    gui.add(this.args, "curveSegments", 1, 32, 1).onChange(update);
    gui.add(this.args, "bevelSegments", 1, 32, 1).onChange(update);
  }
}

class ShapeGeometryHelper implements IGeometryHelper {
  private args = {
    segments: 12
  }

  public createGeometry() {
    // const length = 1.2, width = .8;
    // const shape = new THREE.Shape();
    // shape.moveTo(0, 0);
    // shape.lineTo(0, width);
    // shape.lineTo(length, width);
    // shape.lineTo(length, 0);
    // shape.lineTo(0, 0);

    const x = 0, y = 0;
    const shape = new THREE.Shape();
    shape.moveTo(x + 5, y + 5);
    shape.bezierCurveTo(x + 5, y + 5, x + 4, y, x, y);
    shape.bezierCurveTo(x - 6, y, x - 6, y + 7, x - 6, y + 7);
    shape.bezierCurveTo(x - 6, y + 11, x - 3, y + 15.4, x + 5, y + 19);
    shape.bezierCurveTo(x + 12, y + 15.4, x + 16, y + 11, x + 16, y + 7);
    shape.bezierCurveTo(x + 16, y + 7, x + 16, y, x + 10, y);
    shape.bezierCurveTo(x + 7, y, x + 5, y + 5, x + 5, y + 5);

    const geometry = new THREE.ShapeGeometry(
      shape,
      this.args.segments
    )

    geometry.center();
    geometry.scale(0.1, 0.1, 1);

    return geometry;
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "segments", 1, 100, 1).onChange(update);
  }
}

class TorusKnotGeometryHelper implements IGeometryHelper {
  private args = {
    radius: .8,
    tube: .25,
    tubularSegments: 64,
    radialSegments: 8,
    p: 2,
    q: 3
  }

  public createGeometry() {
    return new THREE.TorusKnotGeometry(
      this.args.radius,
      this.args.tube,
      this.args.tubularSegments,
      this.args.radialSegments,
      this.args.p,
      this.args.q,
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radius", .1, 2).onChange(update);
    gui.add(this.args, "tube", .1, 1).onChange(update);
    gui.add(this.args, "tubularSegments", 3, 300, 1).onChange(update);
    gui.add(this.args, "radialSegments", 3, 20, 1).onChange(update);
    gui.add(this.args, "p", 1, 20, 1).onChange(update);
    gui.add(this.args, "q", 1, 20, 1).onChange(update);
  }
}

class PlaneGeometryHelper implements IGeometryHelper {
  private args = {
    width: 1,
    height: 1,
    widthSegments: 1,
    heightSegments: 1
  }

  public createGeometry() {
    return new THREE.PlaneGeometry(
      this.args.width,
      this.args.height,
      this.args.widthSegments,
      this.args.heightSegments
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "width", 1, 30).onChange(update);
    gui.add(this.args, "height", 1, 30).onChange(update);
    gui.add(this.args, "widthSegments", 1, 30).step(1).onChange(update);
    gui.add(this.args, "heightSegments", 1, 30).step(1).onChange(update);
  }
}

class RingGeometryHelper implements IGeometryHelper {
  private args = {
    innerRadius: .5,
    outerRadius: 1,
    thetaSegments: 8,
    phiSegments: 8,
    thetaStart: 0,
    thetaLength: 360
  }

  public createGeometry() {
    return new THREE.RingGeometry(
      this.args.innerRadius,
      this.args.outerRadius,
      this.args.thetaSegments,
      this.args.phiSegments,
      degToRad(this.args.thetaStart),
      degToRad(this.args.thetaLength)
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "innerRadius", .1, 2).onChange(update);
    gui.add(this.args, "outerRadius", .1, 2).onChange(update);
    gui.add(this.args, "thetaSegments", 1, 32, 1).onChange(update);
    gui.add(this.args, "phiSegments", 1, 30, 2).onChange(update);
    gui.add(this.args, "thetaStart", 0, 360).onChange(update);
    gui.add(this.args, "thetaLength", 0, 360).onChange(update);
  }
}

class SphereGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 1,
    widthSegments: 32,
    heightSegments: 16,
    phiStart: 0,
    phiLength: 360,
    thetaStart: 0,
    thetaLength: 180
  }
  
  public createGeometry() {
    return new THREE.SphereGeometry(
      this.args.radius,
      this.args.widthSegments,
      this.args.heightSegments,
      degToRad(this.args.phiStart),
      degToRad(this.args.phiLength),
      degToRad(this.args.thetaStart),
      degToRad(this.args.thetaLength)
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radius", 0.5, 2, 0.01).onChange(update);
    gui.add(this.args, "widthSegments", 3, 64).step(1).onChange(update);
    gui.add(this.args, "heightSegments", 2, 32).step(1).onChange(update);
    gui.add(this.args, "phiStart", 0, 360).onChange(update);
    gui.add(this.args, "phiLength", 0, 360).onChange(update);
    gui.add(this.args, "thetaStart", 0, 180).onChange(update);
    gui.add(this.args, "thetaLength", 0, 180).onChange(update);
  }
}

class TorusGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 1,
    tube: 0.3,
    radialSegments: 16,
    tubularSegments: 100,
    arc: 360
  }

  public createGeometry() {
    return new THREE.TorusGeometry(
      this.args.radius,
      this.args.tube,
      this.args.radialSegments,
      this.args.tubularSegments,
      degToRad(this.args.arc)
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radius", .1, 2, 0.01).onChange(update);
    gui.add(this.args, "tube", .1, 2, 0.01).onChange(update);
    gui.add(this.args, "radialSegments", 2, 30, 1).onChange(update);
    gui.add(this.args, "tubularSegments", 3, 200, 1).onChange(update);
    gui.add(this.args, "arc", 0.1, 360).onChange(update);
  }
}

class CylinderGeometryHelper implements IGeometryHelper {
  private args = {
    radiusTop: .5,
    radiusBottom: .5,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: 360
  }

  public createGeometry() {
    return new THREE.CylinderGeometry(
      this.args.radiusTop,
      this.args.radiusBottom,
      this.args.height,
      this.args.radialSegments,
      this.args.heightSegments,
      this.args.openEnded,
      THREE.MathUtils.degToRad(this.args.thetaStart),
      THREE.MathUtils.degToRad(this.args.thetaLength)
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radiusTop", 0, 2, 0.01).onChange(update);
    gui.add(this.args, "radiusBottom", 0, 2, 0.01).onChange(update);
    gui.add(this.args, "height", 1, 2, 0.01).onChange(update);
    gui.add(this.args, "radialSegments", 3, 64, 1).onChange(update);
    gui.add(this.args, "heightSegments", 1, 64, 1).onChange(update);
    gui.add(this.args, "openEnded").onChange(update);
    gui.add(this.args, "thetaStart", 0, 360).onChange(update);
    gui.add(this.args, "thetaLength", 0, 360).onChange(update);
  }
}

class ConeGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 0.5,
    height: 1,
    radialSegments: 8,
    heightSegments: 1,
    openEnded: false,
    thetaStart: 0,
    thetaLength: 360
  }

  public createGeometry() {
    return new THREE.ConeGeometry(
      this.args.radius,
      this.args.height,
      this.args.radialSegments,
      this.args.heightSegments,
      this.args.openEnded,
      THREE.MathUtils.degToRad(this.args.thetaStart),
      THREE.MathUtils.degToRad(this.args.thetaLength)
    )
  }
  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radius", 0.1, 1, 0.01).onChange(update);
    gui.add(this.args, "height", 0.1, 2, 0.01).onChange(update);
    gui.add(this.args, "radialSegments", 1, 64, 1).onChange(update);
    gui.add(this.args, "heightSegments", 1, 64, 1).onChange(update);
    gui.add(this.args, "openEnded").onChange(update);
    gui.add(this.args, "thetaStart", 0, 360, 0.1).onChange(update);
    gui.add(this.args, "thetaLength", 0, 360, 0.1).onChange(update);
  };
}

class CircleGeometryHelper implements IGeometryHelper {
  private args = {
    radius: 1,
    segments: 32,
    thetaStart: 0,
    thetaLength: 360
  }
  public createGeometry() {
    return new THREE.CircleGeometry(
      this.args.radius,
      this.args.segments,
      THREE.MathUtils.degToRad(this.args.thetaStart),
      THREE.MathUtils.degToRad(this.args.thetaLength)
    )
  }

  public createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "radius", 0.1, 1, 0.01).onChange(update);
    gui.add(this.args, "segments", 1, 64, 1).onChange(update);
    gui.add(this.args, "thetaStart", 0, 360, 0.1).onChange(update);
    gui.add(this.args, "thetaLength", 0, 360, 0.1).onChange(update);
  }
}

class BoxGeometryHelper implements IGeometryHelper {

  private args = {
    width: 1,
    height: 1,
    depth: 1,
    widthSegments: 1,
    heightSegments: 1,
    depthSegments: 1
  }

  createGeometry() {
    return new THREE.BoxGeometry(
      this.args.width, this.args.height, this.args.depth,
      this.args.widthSegments, this.args.heightSegments, this.args.depthSegments
    );
  }
  createGUI(update: () => void) {
    const gui = new GUI();
    gui.add(this.args, "width", 0.1, 10, 0.01).onChange(update);
    gui.add(this.args, "height", 0.1, 10, 0.01).onChange(update);
    gui.add(this.args, "depth", 0.1, 10, 0.01).onChange(update);
    gui.add(this.args, "widthSegments", 1, 10, 1).onChange(update);
    gui.add(this.args, "heightSegments", 1, 10, 1).onChange(update);
    gui.add(this.args, "depthSegments", 1, 10, 1).onChange(update);
  }
}

class App {
  private domApp: Element;
  private renderer: THREE.WebGLRenderer;
  private scene: THREE.Scene;
  private camera?: THREE.PerspectiveCamera;
  private cube?: THREE.Mesh;

  constructor() {
    console.log('Hello three.js');

    this.domApp = document.querySelector('#app')!;
    
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setPixelRatio(window.devicePixelRatio);
    this.domApp.appendChild(this.renderer.domElement);
    this.scene = new THREE.Scene();
    this.scene.fog = new THREE.Fog(0x00000000, 1, 3.5);

    this.setupCamera();
    this.setupLight();
    this.setupHelpers();
    this.setupModels();
    this.setupControls();
    this.setupEvents();
  }

  private setupCamera() {
    const domApp = this.domApp;
    const width = domApp.clientWidth;
    const height = domApp.clientHeight;
    
    this.camera = new THREE.PerspectiveCamera(75, width/height, 0.1, 100);
    this.camera.position.z = 2;
  }

  private setupLight() {
    const lights = [];
    for(let i = 0; i < 3; i++) {
      lights[i] = new THREE.DirectionalLight(0xffffff, 3);
      this.scene.add(lights[i]);
    }

    lights[0].position.set(0, 200, 0);
    lights[1].position.set(100, 200, 100);
    lights[2].position.set(-100, -200, -100);
  }

  private setupHelpers() {
    const axes = new THREE.AxesHelper(10);
    this.scene.add(axes);

    const grid = new THREE.GridHelper(5, 20, 0xffffff, 0x444444);
    this.scene.add(grid);
  }

  private async setupModels() {
    const meshMaterial = new THREE.MeshPhongMaterial({
      color: 0x156289,
      flatShading: true, side: THREE.DoubleSide,
      transparent: true, opacity: .75
    });

    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0xffffff,
      transparent: true, opacity: 0.8
    });

    // const geometryHelper = new BoxGeometryHelper();
    // const geometryHelper = new CircleGeometryHelper();
    // const geometryHelper = new ConeGeometryHelper();
    // const geometryHelper = new CylinderGeometryHelper();
    // const geometryHelper = new TorusGeometryHelper();
    // const geometryHelper = new SphereGeometryHelper();
    // const geometryHelper = new RingGeometryHelper();
    // const geometryHelper = new PlaneGeometryHelper();
    // const geometryHelper = new TorusKnotGeometryHelper();
    // const geometryHelper = new ShapeGeometryHelper();
    // const geometryHelper = new ExtrudeGeometryHelper();

    // const json = await new TTFLoader().loadAsync('./Caveat-Regular.ttf');
    // const font = new Font(json);
    // const geometryHelper = new TextGeometryHelper(font);

    // const geometryHelper = new LatheGeometryHelper();
    // const geometryHelper = new TubeGeometryHelper();
    // const geometryHelper = new ParametricGeometryHelper();

    // const geometryHelper = new IcosahedronGeometryHelper();
    // const geometryHelper = new OctahedronGeometryHelper();
    // const geometryHelper = new DodecahedronGeometryHelper();
    const geometryHelper = new TetrahedronGeometryHelper();

    const createModel = () => {
      const geometry = geometryHelper.createGeometry();

      const mesh = new THREE.Mesh(geometry, meshMaterial);
  
      const line = new THREE.LineSegments(new THREE.WireframeGeometry(geometry), lineMaterial); // new THREE.EdgesGeometry(geometry)
  
      const group = new THREE.Group();
      group.name = "myModel";
      group.add(mesh, line);

      const oldGroup = this.scene.getObjectByName("myModel");
      if(oldGroup) {
        (oldGroup.children[0] as THREE.Mesh).geometry.dispose();
        (oldGroup.children[1] as THREE.LineSegments).geometry.dispose();
        this.scene.remove(oldGroup);
      }
  
      this.scene.add(group);
    }
    createModel();
    geometryHelper.createGUI(createModel);
  }

  private setupControls() {
    new OrbitControls(this.camera!, this.domApp! as HTMLElement);
  }

  private setupEvents() {
    window.onresize = this.resize.bind(this);
    this.resize();
    this.renderer.setAnimationLoop(this.render.bind(this));
  }

  private resize() {
    const domApp = this.domApp;
    const width = domApp.clientWidth;
    const height = domApp.clientHeight;

    const camera = this.camera;
    if(camera) {
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }

    this.renderer.setSize(width, height);
  }

  private update(time: number) {
    time *= 0.001 // ms -> s
    
    // const cube = this.cube
    // const cube = this.scene.getObjectByName("myModel");
    // if(cube) {
    //   cube.rotation.x = time
    //   cube.rotation.y = time
    // }
  }

  private render(time: number) {
    this.update(time);
    this.renderer.render(this.scene, this.camera!);
  }
}

new App()