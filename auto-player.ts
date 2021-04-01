import * as Game from "./game.ts";
import {clone, getOneRandomly, hasDiff, pipe} from "./vendor.bundle.js";

type Log = string[];

export interface ICheckWin {
    (stage: Game.Stage, size?: number): Promise<boolean>;
}

export interface ITakeTubeRandomly {
    (stage: Game.Stage, tube?: Game.Tube): Promise<Game.Tube>;
}

export interface ITransferColour {
    (tube1: Game.Tube, tube2: Game.Tube, size?: number): Promise<void>;
}

export interface IPlay {
    (stage: Game.Stage): Promise<Log>;
}

export interface IFindShortestGame {
    (stage: Game.Stage, times: number): Promise<Log>;
}

export class AutoPlayer {
    play: IPlay = (stage: Game.Stage) => play(Game.checkWin, takeTubeRandomly, Game.transferColour, [], stage);
    findShortestGame: IFindShortestGame = findShortestGame.bind(null, this.play);
}

/**
 * Randomly play the game until it is solved
 * It returns an array with the steps used to solve the game
 */
export function play(
    checkWin: ICheckWin,
    takeTubeRandomly: ITakeTubeRandomly,
    transferColour: ITransferColour,
    log: Log,
    stage: Game.Stage
): Promise<Log> {
    return new Promise(async (resolve) => {
        const initialStage: Game.Stage = clone(stage);

        let counter = 0;
        while (!(await checkWin(stage))) {
            const tube1 = await takeTubeRandomly(stage);
            const tube2 = await takeTubeRandomly(stage, tube1);

            if (tube2 !== undefined) {
                log.push(`${stage.indexOf(tube1) + 1} -> ${stage.indexOf(tube2) + 1}`);
                await transferColour(tube1, tube2);
            } else {
                // it means there are no tube available to transfer from tube1
                counter++;
            }

            if (counter === 1000) {
                // start over
                log.length = 0;
                stage = clone(initialStage);
                counter = 0;
            }
        }

        resolve(log);
    });
}

/**
 * Play the game *n* `times` and returns the shortest path
 */
export async function findShortestGame(play: IPlay, stage: Game.Stage, times: number): Promise<Log> {
    const games: Promise<Log>[] = [];
    for (let i = 0; i < times; i++) {
        games.push(
            pipe(
                clone,
                play
            )(stage)
        );
    }

    const shortest = (await Promise.all(games))
        .map((g, index) => {
            return {
                index,
                length: g.length
            };
        })
        .sort((a, b) => {
            if (a.length === b.length) {
                return 0;
            }

            return a.length < b.length ? 1 : -1;
        })
        .pop();

    if (shortest !== undefined) {
        return games[shortest.index];
    } else {
        throw new Error('Something weird happened');
    }
}

/**
 * Finds the tubes available to be used
 * When the `tube` is defined, it finds the possible tubes to be transferred to
 */
export function availableTubes(stage: Game.Stage, tube?: Game.Tube): Game.Tube[] {
    if (tube !== undefined) {
        return stage
            .filter(t => t !== tube)
            .filter(t => isTransferValid(tube, t));
    } else {
        return stage.filter(t => t.length !== 0);
    }
}

export function isTransferValid(tube1: Game.Tube, tube2: Game.Tube, tubeLimit = 4): boolean {
    // a tube without any different colour don't need to go to an empty tube
    if (!hasDiff(tube1) && tube2.length === 0) {
        return false;
    } else {
        return Game.isTransferValid(tube1, tube2, tubeLimit);
    }
}

export async function takeTubeRandomly(stage: Game.Stage, tube?: Game.Tube): Promise<Game.Tube> {
    return pipe(
        () => availableTubes(stage, tube),
        getOneRandomly
    )();
}
