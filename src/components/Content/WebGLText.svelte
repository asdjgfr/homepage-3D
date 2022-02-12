<script>
import ThreeDText from "../ThreeDText/ThreeDText";
import { onMount } from "svelte";

let sceneElement;

onMount(() => {
  new ThreeDText({ dom: sceneElement });
});
</script>

<div class="content" bind:this="{sceneElement}"></div>
