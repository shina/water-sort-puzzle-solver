/**
 * After change of some dependencies:
 * `deno cache deps.ts --lock=lock.json --lock-write`
 *
 * To install the dependencies:
 * `deno cache deps.ts --lock=lock.json`
 */

export { assert, assertEquals } from 'https://deno.land/std@0.90.0/testing/asserts.ts';
export { hasDiff } from "https://raw.githubusercontent.com/shina/library/1.0.0/comparison.ts";
export { getOneRandomly } from "https://raw.githubusercontent.com/shina/library/1.0.0/random.ts";
export { clone } from "https://raw.githubusercontent.com/shina/library/1.0.0/clone.js";
export { pipe } from "https://raw.githubusercontent.com/shina/library/1.0.2/pipe.ts";
