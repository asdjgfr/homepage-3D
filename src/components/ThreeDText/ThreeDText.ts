import { Matrix4, MathUtils, FontLoader, TextGeometry, Vector3 } from "three";
import gsap from "gsap";
import type THREERoot from "../Three/THREERoot";
import TextAnimation from "../Three/TextAnimation";
import { Utils } from "../Three/bas.module";
import { Power1 } from "gsap/gsap-core";

export interface ThreeDTextProps {
  root: THREERoot;
}

class ThreeDText {
  dom: HTMLElement;
  private textAnimation: TextAnimation;
  private THREERoot: THREERoot;
  constructor({ root }: ThreeDTextProps) {
    this.THREERoot = root;

    root.onResize = this.resize.bind(this);
    this.init(root);
  }
  resize() {
    if (this.textAnimation === undefined) return;
    const { scale } = this;

    this.textAnimation.scale.set(scale, scale, 1);
  }
  get scale() {
    return (this.THREERoot?.domRect.width ?? 1920) / 1920;
  }
  async init(root: THREERoot) {
    this.textAnimation = await this.createTextAnimation();
    const { textAnimation } = this;
    textAnimation.position.y = -40;
    this.resize();
    root.scene.add(textAnimation);

    const tl = gsap.timeline({
      repeat: 0,
      repeatDelay: 0.25,
    });

    tl.fromTo(
      textAnimation,
      { animationProgress: 1.0 },
      { duration: 4, animationProgress: 0, ease: Power1.easeInOut },
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

    geometry["userData"] = {
      fontSize: params.size,
    };
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
        seek.call(this, -dx);
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

      seek.call(this, -dx);
      e.preventDefault();
    });
  }
}

export default ThreeDText;
