<style lang="scss">
@import "sweetalert2/src/sweetalert2.scss";

.main {
  padding: 20px 5px;
  width: 100vw;
  height: 100vh;
  display: flex;
  flex-direction: column;
}
</style>

<script lang="ts">
import Header from "./components/Header/Header.svelte";
import WebGLFluidSimulation from "./components/WebGLFluidSimulation/WebGLFluidSimulation.svelte";
import Container from "./components/Container/Container.svelte";
</script>

<main class="main">
  <WebGLFluidSimulation />
  <Header />
  <Container />
</main>
