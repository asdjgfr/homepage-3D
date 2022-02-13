<style>
.content-text {
  width: 100%;
  height: 500px;
  cursor: ew-resize;
}
</style>

<script>
import THREERoot from "../Three/THREERoot";
import ThreeDText from "../ThreeDText/ThreeDText";
import { onMount } from "svelte";

let sceneElement;

onMount(() => {
  const root = new THREERoot({
    createCameraControls: false,
    antialias: true,
    fov: 60,
    dom: sceneElement,
  });

  new ThreeDText({ root });
});
</script>

<div class="content-text" bind:this="{sceneElement}"></div>
