<style>
</style>

<script lang="ts">
import Header from "./Header/Header.svelte";
import Tailwindcss from "./Tailwindcss.svelte";
export let name: string;
</script>

<Tailwindcss />
<Header />
<main class="p-4 mx-auto text-center max-w-xl ">
  <h1 class="uppercase text-6xl leading-normal font-thin text-blue-500">
    Hello {name}!
  </h1>
  <p class="custom-style mt-[3rem]">
    Visit the
    <a href="https://svelte.dev/tutorial" class="text-blue-500 underline"
      >Svelte tutorial</a
    >
    to learn how to build Svelte apps.
  </p>
</main>
