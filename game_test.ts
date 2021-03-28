import {assert, assertEquals} from "./build/deps.ts";
import {checkWin, isTransferValid, transferColour, Tube} from "./game.ts";

Deno.test('checkWin true', async () => assert(await checkWin([[1, 1, 1], [2, 2, 2]], 3)));
Deno.test('checkWin false', async () => assert(await checkWin([[1, 1, 2], [2, 2, 1]], 3) === false));
Deno.test('checkWin with empty tube', async () => assert(await checkWin([[1, 1, 1], [], [2, 2, 2]], 3)));
Deno.test('checkWin tubes fullfilled: true', async () => assert(await checkWin([[1, 1, 1, 1], [], [2, 2, 2, 2]])));
Deno.test('checkWin tubes fullfilled: false', async () => assert(await checkWin([[1, 1, 1, 1], [2], [2, 2, 2]]) === false));

Deno.test('transfer success', async () => {
    const tube1 = [2, 2, 2, 0];
    const tube2 = [0, 0, 0];

    await transferColour(tube1, tube2);

    assertEquals(tube1, [2, 2, 2]);
    assertEquals(tube2, [0, 0, 0, 0]);
});
Deno.test('transfer empty tube', async () => {
    const tube1: Tube = [];
    const tube2 = [1, 1, 1];

    await transferColour(tube1, tube2);

    assertEquals(tube1, []);
    assertEquals(tube2, [1, 1, 1]);
});
Deno.test('transfer sequence of same colour', async () => {
    const tube1: Tube = [2, 1, 1];
    const tube2: Tube = [];

    await transferColour(tube1, tube2);

    assertEquals(tube1, [2]);
    assertEquals(tube2, [1, 1]);
});
Deno.test('transfer sequence of same colour cannot overflow', async () => {
    const tube1: Tube = [2, 1, 1, 1];
    const tube2: Tube = [1, 1, 1];

    await transferColour(tube1, tube2);

    assertEquals(tube1, [2, 1, 1]);
    assertEquals(tube2, [1, 1, 1, 1]);
});

Deno.test('isTransferValid true', () => assert(isTransferValid([1, 1, 1], [2, 2, 1])));
Deno.test('isTransferValid false', () => assert(isTransferValid([1, 1, 1], [2, 2, 2]) === false));
Deno.test('isTransferValid: when tube is full', () => assert(isTransferValid([1, 1, 1], [1, 1, 1, 1]) === false));
Deno.test('isTransferValid: to an empty tube', () => assert(isTransferValid([0, 1, 1], [])));
