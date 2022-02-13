import { Mesh, FlatShading, DoubleSide, MathUtils, Color } from "three";
import type { TextGeometry } from "three";
import {
  ModelBufferGeometry,
  Utils,
  BasicAnimationMaterial,
  ShaderChunk,
} from "./bas.module";

class TextAnimation extends Mesh {
  public animationDuration: number;
  private _animationProgress: number;
  public readonly material: BasicAnimationMaterial;
  public frustumCulled: boolean;

  constructor(textGeometry: TextGeometry) {
    const bufferGeometry: ModelBufferGeometry = new ModelBufferGeometry(
      textGeometry
    );
    const aAnimation = bufferGeometry.createAttribute("aAnimation", 2);
    const aCentroid = bufferGeometry.createAttribute("aCentroid", 3);
    const aControl0 = bufferGeometry.createAttribute("aControl0", 3);
    const aControl1 = bufferGeometry.createAttribute("aControl1", 3);
    const aEndPosition = bufferGeometry.createAttribute("aEndPosition", 3);

    const faceCount = bufferGeometry.faceCount;
    let i, i2, i3, i4, v;

    const size = textGeometry["userData"].size;

    const maxDelayX = 2.0;
    const maxDelayY = 0.25;
    const minDuration = 2;
    const maxDuration = 8;
    const stretch = 0.25;

    for (
      i = 0, i2 = 0, i3 = 0, i4 = 0;
      i < faceCount;
      i++, i2 += 6, i3 += 9, i4 += 12
    ) {
      const face = textGeometry.faces[i];
      const centroid = Utils.computeCentroid(textGeometry, face);

      // animation
      const delayX = Math.max(0, (centroid.x / size.width) * maxDelayX);
      const delayY = Math.max(0, (1.0 - centroid.y / size.height) * maxDelayY);
      const duration = MathUtils.randFloat(minDuration, maxDuration);

      for (v = 0; v < 6; v += 2) {
        aAnimation.array[i2 + v] = delayX + delayY + Math.random() * stretch;
        aAnimation.array[i2 + v + 1] = duration;
      }

      // centroid
      for (v = 0; v < 9; v += 3) {
        aCentroid.array[i3 + v] = centroid.x;
        aCentroid.array[i3 + v + 1] = centroid.y;
        aCentroid.array[i3 + v + 2] = centroid.z;
      }

      // ctrl
      const c0x = centroid.x + MathUtils.randFloat(40, 120);
      const c0y = centroid.y + size.height * MathUtils.randFloat(0.0, 12.0);
      const c0z = MathUtils.randFloatSpread(120);

      const c1x = centroid.x + MathUtils.randFloat(80, 120) * -1;
      const c1y = centroid.y + size.height * MathUtils.randFloat(0.0, 12.0);
      const c1z = MathUtils.randFloatSpread(120);

      for (v = 0; v < 9; v += 3) {
        aControl0.array[i3 + v] = c0x;
        aControl0.array[i3 + v + 1] = c0y;
        aControl0.array[i3 + v + 2] = c0z;

        aControl1.array[i3 + v] = c1x;
        aControl1.array[i3 + v + 1] = c1y;
        aControl1.array[i3 + v + 2] = c1z;
      }

      // end position
      let x, y, z;

      x = centroid.x + MathUtils.randFloatSpread(120);
      y = centroid.y + size.height * MathUtils.randFloat(0.0, 12.0);
      z = MathUtils.randFloat(-20, 20);

      for (v = 0; v < 9; v += 3) {
        aEndPosition.array[i3 + v] = x;
        aEndPosition.array[i3 + v + 1] = y;
        aEndPosition.array[i3 + v + 2] = z;
      }
    }

    const material = new BasicAnimationMaterial({
      diffuse: new Color(0xdddddd),
      flatShading: FlatShading,
      side: DoubleSide,
      transparent: true,
      uniforms: {
        uTime: { type: "f", value: 0 },
      },
      vertexFunctions: [
        ShaderChunk["cubic_bezier"],
        ShaderChunk["ease_cubic_out"],
      ],
      vertexParameters: [
        "uniform float uTime;",
        "attribute vec2 aAnimation;",
        "attribute vec3 aCentroid;",
        "attribute vec3 aControl0;",
        "attribute vec3 aControl1;",
        "attribute vec3 aEndPosition;",
      ],
      vertexInit: [
        "float tDelay = aAnimation.x;",
        "float tDuration = aAnimation.y;",
        "float tTime = clamp(uTime - tDelay, 0.0, tDuration);",
        "float tProgress =  easeCubicOut(tTime, 0.0, 1.0, tDuration);",
      ],
      vertexPosition: [
        "vec3 tPosition = transformed - aCentroid;",
        "tPosition *= 1.0 - tProgress;",
        "tPosition += aCentroid;",
        "tPosition += cubicBezier(tPosition, aControl0, aControl1, aEndPosition, tProgress);",
        "transformed = tPosition;",
      ],
    });
    super(bufferGeometry, material);

    this.animationDuration = maxDelayX + maxDelayY + maxDuration - 3;
    this._animationProgress = 0;
    this.material = material;
    this.frustumCulled = false;
    this.userData = { fontSize: textGeometry["userData"].fontSize };
  }

  get animationProgress() {
    return this._animationProgress;
  }
  set animationProgress(v) {
    this._animationProgress = v;
    this.material.uniforms["uTime"].value = this.animationDuration * v;
  }
}

export default TextAnimation;
