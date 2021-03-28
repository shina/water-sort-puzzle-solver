import {assert, assertEquals} from "./build/deps.ts";
import {availableTubes, isTransferValid} from "./auto-player.ts";


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

Deno.test('isTransferValidPlayer from no-diff to en empty tube: false', () => {
    assert(isTransferValid([1, 1, 1, 1], []) === false);
    assert(isTransferValid([1, 1, 1], []) === false);
});
