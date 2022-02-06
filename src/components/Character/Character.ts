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
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader";
import Stats from "three/examples/jsm/libs/stats.module";

export type characterAnimates = "walk" | "stand";
export default class {
  currentAnimate: characterAnimates = "stand";
  constructor() {
    this.init();
  }
  init() {}
}
