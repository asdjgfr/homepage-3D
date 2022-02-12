<style>
.character {
  overflow: hidden;
  width: 100%;
  height: 100%;
}
</style>

<script>
// import Character from "./Character";
import { onMount } from "svelte";

let sceneElement;

onMount(() => {
  // new Character({ dom: sceneElement });
});
</script>

<div bind:this="{sceneElement}" class="character"></div>
