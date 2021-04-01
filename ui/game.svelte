<script>
  import {writable} from "svelte/store";
  import Tube from "./tube.svelte";
  import { AutoPlayerUI } from "../dist/ui/auto-player-ui";
  import * as Game from "../dist/game";

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

  let isWin = false;

  const game = writable({ tubes });

  const autoPlayer = new AutoPlayerUI(1000, async () => {
      game.set({tubes});
      isWin = await Game.checkWin(tubes);
  });

  let from;
  async function tubeClick(tube) {
      if (from === undefined) {
          from = tube;
      } else {
          if (Game.isTransferValid(from, tube)) {
              await Game.transferColour(from, tube);
              game.set({tubes});
              isWin = await Game.checkWin(tubes);
          }
          from = undefined;
      }
  }

  function play() {
      autoPlayer.play(tubes);
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

<button on:click={play}>Solve it!</button>
