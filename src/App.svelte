<style lang="scss">
.main {
  padding: 20px 5px;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<script lang="ts">
import WebGLFluidSimulation from "./components/WebGLFluidSimulation/WebGLFluidSimulation.svelte";
import Content from "./components/Content/Content.svelte";
</script>

<main class="main">
  <WebGLFluidSimulation />
  <Content />
</main>
