import { WebGLRenderer, PerspectiveCamera, Scene } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export interface THREERootInterface {
  antialias?: boolean;
  fov?: number;
  zNear?: number;
  zFar?: number;
  createCameraControls?: boolean;
  alpha?: boolean;
  dom: HTMLElement;
  onResize?: () => void;
}

class THREERoot {
  antialias: boolean;
  fov: number;
  zNear: number;
  zFar: number;
  createCameraControls: boolean;
  public readonly renderer: WebGLRenderer;
  public readonly dom: HTMLElement;
  public readonly camera: PerspectiveCamera;
  public readonly scene: Scene;
  public readonly controls?: OrbitControls;
  public onResize?: () => void;

  constructor({
    antialias,
    fov,
    zNear,
    zFar,
    createCameraControls,
    dom,
    alpha = true,
    onResize,
  }: THREERootInterface) {
    this.dom = dom;
    this.antialias = antialias ?? false;
    this.fov = fov ?? 60;
    this.zNear = zNear ?? 1;
    this.zFar = zFar ?? 10000;
    this.createCameraControls = createCameraControls ?? true;
    this.onResize = onResize;

    this.renderer = new WebGLRenderer({
      antialias: this.antialias,
      alpha,
    });
    this.dom.appendChild(this.renderer.domElement);
    this.renderer.setClearColor(0x000000, 0);
    this.renderer.setPixelRatio(window.devicePixelRatio || 1);
    const { width, height } = this.domRect;
    this.camera = new PerspectiveCamera(
      this.fov,
      width / height,
      this.zNear,
      this.zFar
    );
    this.camera.position.set(0, 0, 400);

    this.scene = new Scene();

    if (this.createCameraControls) {
      this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    }
    this.tick();
    this.resizeObserver();
  }
  get domRect() {
    return this.dom.getBoundingClientRect();
  }
  tick() {
    this.update();
    this.render();
    requestAnimationFrame(this.tick.bind(this));
  }
  update() {
    this.controls && this.controls.update();
  }
  render() {
    this.renderer.render(this.scene, this.camera);
  }
  resize() {
    this.onResize && this.onResize();
    const { width, height } = this.domRect;
    this.camera.aspect = width / height;
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(width, height);
  }
  resizeObserver() {
    new ResizeObserver(this.resize.bind(this)).observe(this.dom);
  }
}

export default THREERoot;
