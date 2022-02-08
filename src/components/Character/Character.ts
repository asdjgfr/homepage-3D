import Swal from "sweetalert2";
import {
  Clock,
  Scene,
  PerspectiveCamera,
  AnimationMixer,
  WebGLRenderer,
  ACESFilmicToneMapping,
  sRGBEncoding,
  PointLight,
  AnimationAction,
} from "three";
import { GLTFLoader } from "../Three/GLTFLoader";
import { OrbitControls } from "../Three/OrbitControls";

export type characterAnimates = "walk" | "stand";
export interface CharacterProps {
  dom: HTMLElement;
}
export default class {
  currentAnimate: characterAnimates = "stand";
  dom: HTMLElement;
  private clock: Clock;
  private scene: Scene;
  private camera: PerspectiveCamera;
  private renderer: WebGLRenderer;
  private loader: GLTFLoader;
  private point: PointLight;
  private mixer: AnimationMixer;
  private animationAction: AnimationAction;
  public percent: number = 0;
  public finished: boolean = false;
  private controls: OrbitControls;
  private GLTFPath: string = "/assets/character.glb";
  private gltf: any;

  constructor({ dom }: CharacterProps) {
    this.dom = dom;
    this.init();
  }
  async init() {
    const { width, height } = this.domRect;
    this.clock = new Clock();
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(45, width / height, 1, 1000);
    this.renderer = new WebGLRenderer({
      antialias: true,
      alpha: true,
    });

    this.loader = new GLTFLoader();
    this.point = new PointLight(0xffffff);
    const { point, scene, camera, renderer } = this;
    this.initControls();
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point);
    camera.position.set(0, 0, 500);
    camera.lookAt(0, 0, 500);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;
    this.dom.appendChild(renderer.domElement);
    this.resize();
    this.resizeObserver();
    await this.loadGLTF();
    this.animate(true);
  }
  render() {
    this.renderer?.render(this.scene, this.camera);
  }
  resizeObserver() {
    new ResizeObserver(this.resize.bind(this)).observe(this.dom);
  }
  resize() {
    requestAnimationFrame(() => {
      const { camera } = this;
      const { width, height } = this.domRect;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      this.renderer.setSize(width, height);
      this.render();
    });
  }
  initControls() {
    const { camera, renderer } = this;
    this.controls = new OrbitControls(camera, renderer.domElement);
    const { controls } = this;
    controls.addEventListener("change", this.render.bind(this));
    controls.minDistance = 2;
    controls.maxDistance = 10;
    controls.target.set(0, 0, 0);
    controls.update();
    this.render();
  }
  animate(refresh = false) {
    const { controls, mixer, clock } = this;
    if (refresh === true) {
      console.log(this.gltf.animations);
      this.animationAction = mixer.clipAction(this.gltf.animations[2]);
      const { animationAction } = this;
      animationAction.reset();
      animationAction.fadeIn(1);
      animationAction.play();
    }
    controls.update();
    mixer?.update(clock.getDelta());
    this.render();
    requestAnimationFrame(this.animate.bind(this));
  }
  async loadGLTF() {
    const { scene } = this;
    return new Promise((resolve, reject) => {
      this.loader.load(
        // resource URL
        this.GLTFPath,
        // called when the resource is loaded
        (gltf) => {
          // gltf.animations; // Array<THREE.AnimationClip>
          // gltf.scene; // THREE.Group
          // gltf.scenes; // Array<THREE.Group>
          // gltf.cameras; // Array<THREE.Camera>
          // gltf.asset; // Object
          this.gltf = gltf;
          scene.add(gltf.scene);
          this.mixer = new AnimationMixer(gltf.scene);

          this.render();
          this.finished = true;
          resolve(gltf);
        },
        // called while loading is progressing
        ({ loaded, total }) => {
          this.percent = Number(((loaded / total) * 100).toFixed(2));
        },
        // called when loading has errors
        (err) => {
          Swal.fire({
            icon: "error",
            title: "模型加载失败",
            text: err,
          }).then(function () {
            window.location.reload();
          });
          reject(err);
        }
      );
    });
  }
  get domRect() {
    return this.dom.getBoundingClientRect();
  }
}
