import { hasDiff } from "./vendor.bundle.js";

export type Colour = number;
export type Tube = Colour[];
export type Stage = Tube[];

/**
 * Checks if the game is completed
 */
export async function checkWin(stage: Stage, size = 4): Promise<boolean> {
    const hasTubeWithDifferentColour = stage.some(tube => hasDiff(tube));
    const hasTubeNotFullOrEmpty = stage.some(tube => tube.length > 0 && tube.length < size);

    return !hasTubeWithDifferentColour && !hasTubeNotFullOrEmpty;
}


/**
 * Mutates the tubes, transferring the colour from tube1 to tube2
 * This function does not check if a transfer is allowed, use `isTransferValid`
 */
export async function transferColour(tube1: Tube, tube2: Tube, size = 4): Promise<void> {
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
        return tube1[tube1.length - 1] === tube2[tube2.length - 1] || tube2.length === 0;
    } else {
        return false;
    }
}
