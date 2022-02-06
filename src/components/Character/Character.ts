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
  public percent: number = 0;
  public finished: boolean = false;
  private controls: OrbitControls;
  private GLTFPath: string = "/assets/character.glb";
  constructor({ dom }: CharacterProps) {
    this.dom = dom;

    this.init();
  }
  async init() {
    this.clock = new Clock();
    this.scene = new Scene();
    this.camera = new PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      1000
    );
    this.renderer = new WebGLRenderer({
      antialias: true,
      canvas: this.dom,
      alpha: true,
    });

    this.loader = new GLTFLoader();
    this.point = new PointLight(0xffffff);
    const { point, scene, camera, renderer } = this;
    this.initControls();
    point.position.set(400, 200, 300); //点光源位置
    scene.add(point);
    camera.position.set(-1.8, 0.6, 2.7);
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.toneMapping = ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1;
    renderer.outputEncoding = sRGBEncoding;
    this.resize();
    this.resizeObserver();
    await this.loadGLTF();
    this.animate();
  }
  render() {
    this.renderer?.render(this.scene, this.camera);
  }
  resizeObserver() {
    window.addEventListener("resize", this.resize.bind(this));
  }
  resize() {
    requestAnimationFrame(() => {
      const { camera } = this;
      const { innerWidth, innerHeight } = window;
      camera.aspect = innerWidth / innerHeight;
      camera.updateProjectionMatrix();
      this.renderer.setSize(innerWidth, innerHeight);
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
    controls.target.set(0, 0, -0.2);
    controls.update();
    this.render();
  }
  animate() {
    const { controls, mixer, clock } = this;
    requestAnimationFrame(this.animate.bind(this));
    controls.update();
    if (mixer) {
      mixer.update(clock.getDelta());
    }
    this.render();
  }
  async loadGLTF() {
    const { scene } = this;
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
        scene.add(gltf.scene);
        this.mixer = new AnimationMixer(gltf.scene);
        const animationAction = this.mixer.clipAction(gltf.animations[1]);
        animationAction.reset();
        animationAction.fadeIn(1);
        animationAction.play();

        this.render();
        this.finished = true;
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
      }
    );
  }
}
