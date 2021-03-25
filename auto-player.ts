import {checkWin, isTransferValid, Stage, transferColour, Tube} from "./game.ts";
import {clone, getOneRandomly, pipe} from "./build/deps.ts";

type Log = string[];

/**
 * Randomly play the game until it is solved
 * It returns an array with the steps used to solve the game
 */
export function play(stage: Stage): Promise<Log> {
    return new Promise((resolve) => {
        const log: Log = [];

        const initialStage: Stage = clone(stage);

        let counter = 0;
        while (!checkWin(stage)) {
            const tube1 = takeTubeRandomly(stage);
            const tube2 = takeTubeRandomly(stage, tube1);

            if (tube2 !== undefined) {
                log.push(`${stage.indexOf(tube1) + 1} -> ${stage.indexOf(tube2) + 1}`);
                transferColour(tube1, tube2);
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
export async function findShortestGame(stage: Stage, times: number): Promise<Log> {
    const games: Promise<Log>[] = [];
    for (let i = 0; i < times; i++) {
        games.push(
            pipe<Promise<Log>>(
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
export function availableTubes(stage: Stage, tube?: Tube): Tube[] {
    if (tube !== undefined) {
        return stage
            .filter(t => t !== tube)
            .filter(t => isTransferValid(tube, t));
    } else {
        return stage.filter(t => t.length !== 0);
    }
}

function takeTubeRandomly(stage: Stage, tube?: Tube): Tube {
    return pipe<Tube>(
        () => availableTubes(stage, tube),
        getOneRandomly
    )();
}
