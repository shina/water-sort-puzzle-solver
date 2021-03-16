import {assert, assertEquals, hasDiff} from "./deps.ts";

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

Deno.test('checkWin true', () => assert(checkWin([[1, 1, 1], [2, 2, 2]], 3)));
Deno.test('checkWin false', () => assert(checkWin([[1, 1, 2], [2, 2, 1]], 3) === false));
Deno.test('checkWin with empty tube', () => assert(checkWin([[1, 1, 1], [], [2, 2, 2]], 3)));
Deno.test('checkWin tubes fullfilled: true', () => assert(checkWin([[1, 1, 1, 1], [], [2, 2, 2, 2]])));
Deno.test('checkWin tubes fullfilled: false', () => assert(checkWin([[1, 1, 1, 1], [2], [2, 2, 2]]) === false));


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

Deno.test('transfer success', () => {
    const tube1 = [2, 2, 2, 0];
    const tube2 = [0, 0, 0];

    transferColour(tube1, tube2);

    assertEquals(tube1, [2, 2, 2]);
    assertEquals(tube2, [0, 0, 0, 0]);
});

Deno.test('transfer empty tube', () => {
    const tube1: Tube = [];
    const tube2 = [1, 1, 1];

    transferColour(tube1, tube2);

    assertEquals(tube1, []);
    assertEquals(tube2, [1, 1, 1]);
});

Deno.test('transfer sequence of same colour', () => {
    const tube1: Tube = [2, 1, 1];
    const tube2: Tube = [];

    transferColour(tube1, tube2);

    assertEquals(tube1, [2]);
    assertEquals(tube2, [1, 1]);
});

Deno.test('transfer sequence of same colour cannot overflow', () => {
    const tube1: Tube = [2, 1, 1, 1];
    const tube2: Tube = [1, 1, 1];

    transferColour(tube1, tube2);

    assertEquals(tube1, [2, 1, 1]);
    assertEquals(tube2, [1, 1, 1, 1]);
});


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

Deno.test('isTransferValid true', () => assert(isTransferValid([1, 1, 1], [2, 2, 1])));
Deno.test('isTransferValid false', () => assert(isTransferValid([1, 1, 1], [2, 2, 2]) === false));
Deno.test('isTransferValid: when tube is full', () => assert(isTransferValid([1, 1, 1], [1, 1, 1, 1]) === false));
Deno.test('isTransferValid: to an empty tube', () => assert(isTransferValid([0, 1, 1], [])));
Deno.test('isTransferValid from no-diff to en empty tube: false', () => {
    assert(isTransferValid([1, 1, 1, 1], []) === false);
    assert(isTransferValid([1, 1, 1], []) === false);
});


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

Deno.test('availableTubes', () => {
    const stage = [
        [],
        [1],
        [1, 2, 2],
        [2, 1, 1]
    ];

    assertEquals(availableTubes(stage), [
        [1],
        [1, 2, 2],
        [2, 1, 1]
    ]);
});

Deno.test('availableTubes with tube', () => {
    const stage = [
        [],
        [1],
        [1, 2, 2],
        [2, 1, 1]
    ];

    assertEquals(availableTubes(stage, stage[1]), [
        [2, 1, 1]
    ]);

    assertEquals(availableTubes(stage, stage[3]), [
        [],
        [1]
    ]);
});
