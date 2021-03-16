import {findShortestGame} from "./auto-player.ts";

/**
 * Colours are defined just to have a readable `Colour`
 */
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

console.log(
    await findShortestGame(
        [
            [grey, brown, orange, blueLight], // each `Tube` is filled from the bottom to top
            [purple, greenLight, yellow, grey],
            [blueLight, pink, oliveGreen, orange],
            [yellow, red, yellow, blue],
            [yellow, orange, purple, brown],
            [greenDark, oliveGreen, greenLight, greenDark],
            [blue, red, blue, oliveGreen],
            [red, brown, greenLight, brown],
            [purple, blueLight, greenLight, pink],
            [pink, orange, oliveGreen, purple],
            [greenDark, greenDark, pink, grey],
            [blue, blueLight, red, grey],
            [],
            []
        ],
        1000 // how many times the game will be played to find the shortest game
    )
);
