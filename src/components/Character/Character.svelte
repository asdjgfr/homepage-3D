<style>
.character {
  top: 0;
  left: 0;
  position: fixed;
  z-index: 999;
  height: 100vh;
  width: 100vw;
}
</style>

<script>
import Character from "./Character";
import { onMount } from "svelte";

let sceneElement;

onMount(() => {
  new Character({ dom: sceneElement });
});
console.log("asdasd");
</script>

<canvas bind:this="{sceneElement}" class="character"></canvas>
