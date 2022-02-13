import { Matrix4, MathUtils, FontLoader, TextGeometry } from "three";
import gsap from "gsap";
import THREERoot from "../Three/THREERoot";
import TextAnimation from "../Three/TextAnimation";
import { Utils } from "../Three/bas.module";
import { Power1 } from "gsap/gsap-core";

export interface ThreeDTextProps {
  dom: HTMLElement;
}

class ThreeDText {
  dom: HTMLElement;
  constructor({ dom }: ThreeDTextProps) {
    this.dom = dom;
    const root = new THREERoot({
      createCameraControls: false,
      antialias: true,
      fov: 60,
      dom,
    });
    root.renderer.setClearColor(0x000000, 0);
    root.renderer.setPixelRatio(window.devicePixelRatio || 1);
    root.camera.position.set(0, 0, 400);
    this.init(root);
  }
  async init(root: THREERoot) {
    const textAnimation = await this.createTextAnimation();
    textAnimation.position.y = -40;
    root.scene.add(textAnimation);

    const tl = gsap.timeline({
      repeat: -1,
      repeatDelay: 0.25,
      yoyo: true,
    });
    tl.fromTo(
      textAnimation,
      { animationProgress: 0.0 },
      { duration: 4, animationProgress: 1.0, ease: Power1.easeInOut },
      0
    );

    this.createTweenScrubber(tl);
  }
  async createTextAnimation() {
    const font = await new Promise((resolve, reject) => {
      new FontLoader().load(
        "/assets/fonts/test.json",
        resolve,
        undefined,
        reject
      );
    });
    const geometry = this.generateTextGeometry(process.env.TITLE, {
      font,
      size: 40,
      height: 0,
      weight: "light",
      style: "normal",
      bevelSize: 0.75,
      bevelThickness: 0.5,
      bevelEnabled: true,
      anchor: { x: 0.5, y: 0.5, z: 0.0 },
    });

    Utils.separateFaces(geometry);
    return new TextAnimation(geometry);
  }

  generateTextGeometry(text, params) {
    const geometry = new TextGeometry(text, params);

    geometry.computeBoundingBox();

    geometry["userData"] = {};
    geometry["userData"].size = {
      width: geometry.boundingBox.max.x - geometry.boundingBox.min.x,
      height: geometry.boundingBox.max.y - geometry.boundingBox.min.y,
      depth: geometry.boundingBox.max.z - geometry.boundingBox.min.z,
    };

    const anchorX = geometry["userData"].size.width * -params.anchor.x;
    const anchorY = geometry["userData"].size.height * -params.anchor.y;
    const anchorZ = geometry["userData"].size.depth * -params.anchor.z;
    const matrix = new Matrix4().makeTranslation(anchorX, anchorY, anchorZ);
    geometry.applyMatrix4(matrix);
    return geometry;
  }

  createTweenScrubber(tween, seekSpeed = 0.001) {
    function stop() {
      gsap.to(tween, { duration: 2, timeScale: 0 });
    }

    function resume() {
      gsap.to(tween, { duration: 2, timeScale: 1 });
    }

    function seek(dx) {
      const progress = tween.progress();
      const p = MathUtils.clamp(progress + dx * seekSpeed, 0, 1);

      tween.progress(p);
    }

    let _cx = 0;

    // desktop
    let mouseDown = false;

    window.addEventListener("mousedown", (e) => {
      mouseDown = true;
      _cx = e.clientX;
      stop.call(this);
    });
    window.addEventListener("mouseup", () => {
      mouseDown = false;
      resume.call(this);
    });
    window.addEventListener("mousemove", (e) => {
      if (mouseDown === true) {
        const cx = e.clientX;
        const dx = cx - _cx;
        _cx = cx;
        seek.call(this, dx);
      }
    });
    // mobile
    window.addEventListener("touchstart", (e) => {
      _cx = e.touches[0].clientX;
      stop.call(this);
      e.preventDefault();
    });
    window.addEventListener("touchend", (e) => {
      resume.call(this);
      e.preventDefault();
    });
    window.addEventListener("touchmove", (e) => {
      const cx = e.touches[0].clientX;
      const dx = cx - _cx;
      _cx = cx;

      seek.call(this, dx);
      e.preventDefault();
    });
  }
}

export default ThreeDText;
