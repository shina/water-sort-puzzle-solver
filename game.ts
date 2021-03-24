import { hasDiff } from "./build/deps.ts";

export type Colour = number;
export type Tube = Colour[];
export type Stage = Tube[];

/**
 * Checks if the game is completed
 */
export function checkWin(stage: Stage, size = 4): boolean {
    const hasTubeWithDifferentColour = stage.some(tube => hasDiff(tube));
    const hasTubeNotFullOrEmpty = stage.some(tube => tube.length > 0 && tube.length < size);

    return !hasTubeWithDifferentColour && !hasTubeNotFullOrEmpty;
}


/**
 * Mutates the tubes, transferring the colour from tube1 to tube2
 * This function does not check if a transfer is allowed, use `isTransferValid`
 */
export function transferColour(tube1: Tube, tube2: Tube, size = 4) {
    const colour = tube1.pop();
    if (colour !== undefined) {
        tube2.push(colour);

        // same colours will be transferred altogether
        if (colour === tube1[tube1.length - 1] && tube2.length < size) {
            transferColour(tube1, tube2);
        }
    }
}


/**
 * Checks if a transfer is allowed
 */
export function isTransferValid(tube1: Tube, tube2: Tube, tubeLimit = 4): boolean {
    // destination must have space
    if (tube2.length < tubeLimit) {

        // a tube without any different colour don't need to go to an empty tube
        if (!hasDiff(tube1) && tube2.length === 0) {
            return false;
        } else {
            return tube1[tube1.length - 1] === tube2[tube2.length - 1] || tube2.length === 0;
        }

    } else {
        return false;
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
