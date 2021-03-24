<script>
  import Colour from "./colour.svelte";

  export let colours;
  export let selected;
</script>

<div class="tube" class:tube-selected={selected} on:click>
  {#each colours as colour}
    <Colour is="{colour}"/>
  {/each}
</div>
