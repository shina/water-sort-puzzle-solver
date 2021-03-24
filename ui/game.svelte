<script>
  import Tube from "./tube.svelte";
  import {isTransferValid, transferColour, checkWin} from "../dist/game.bundle.js";
  import {writable} from "svelte/store";

  const blue = 0;
  const red = 1;
  const orange = 2;
  const greenLight = 3;
  const oliveGreen = 4;
  const greenDark = 5;
  const grey = 6;
  const yellow = 7;
  const purple = 8;
  const blueLight = 9;
  const pink = 10;
  const brown = 11;

  const tubes = [
      [red, blue, orange, yellow],
      [red, blue, orange, yellow],
      [red, blue, orange, yellow],
      [red, blue, orange, yellow],
      [],
      [],
  ];

  const game = writable({ tubes });

  let from;
  let isWin = false;
  function tubeClick(tube) {
      if (from === undefined) {
          from = tube;
      } else {
          if (isTransferValid(from, tube)) {
              transferColour(from, tube);
              game.set({tubes});
              isWin = checkWin(tubes);
          }
          from = undefined;
      }
  }
</script>

<div class="stage">
  {#each $game.tubes as colours}
    <Tube colours="{colours}" selected="{colours === from}" on:click={tubeClick(colours)}/>
  {/each}
</div>

{#if isWin}
  <h1>Congratulations!</h1>
{/if}
