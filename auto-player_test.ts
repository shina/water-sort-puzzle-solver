import {assertEquals} from "./build/deps.ts";
import {availableTubes} from "./auto-player.ts";


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
