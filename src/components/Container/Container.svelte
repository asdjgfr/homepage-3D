<style lang="scss">
.container {
  display: flex;
  flex: 1;

  .left {
    width: 420px;
  }
  .right {
    flex: 1;
  }
}
</style>

<script>
import Character from "../Character/Character.svelte";
</script>

<div class="container-w container">
  <div class="left">left</div>
  <div class="right">
    <Character />
  </div>
</div>
