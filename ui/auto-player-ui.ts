import {findShortestGame, IFindShortestGame, IPlay, ITransferColour, play, takeTubeRandomly} from "../auto-player.ts";
import * as Game from "../game.ts";
import {delay} from "../vendor.bundle.js";

export class AutoPlayerUI {

    constructor(
        private transferColourDelay: number,
        private onTransferColour: () => Promise<void>
    ) {}

    play: IPlay = (stage: Game.Stage) => play(Game.checkWin, takeTubeRandomly, this.transferColour, [], stage);
    findShortestGame: IFindShortestGame = findShortestGame.bind(null, this.play);

    private transferColour: ITransferColour = (tube1: Game.Tube, tube2: Game.Tube, size = 4) => {
        return transferColour(this.transferColourDelay, this.onTransferColour, tube1, tube2, size);
    };
}


async function transferColour(
    delayTime: number,
    onTransferColour: () => Promise<void>,
    tube1: Game.Tube,
    tube2: Game.Tube,
    size = 4
) {
    await Game.transferColour(tube1, tube2, size);
    await onTransferColour();
    await delay(delayTime);
}
