<style>
.content-text {
  width: 100%;
  height: 500px;
  cursor: ew-resize;
}
</style>

<script>
import ThreeDText from "../ThreeDText/ThreeDText";
import { onMount } from "svelte";

let sceneElement;

onMount(() => {
  new ThreeDText({ dom: sceneElement });
});
</script>

<div class="content-text" bind:this="{sceneElement}"></div>
