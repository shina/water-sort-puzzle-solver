import { deno2node, emitAndExit } from "https://raw.githubusercontent.com/wojpawlik/deno2node/v0.1.2/src/mod.ts";

const { files } = await Deno.emit(`build/deps.ts`, { bundle: "esm" });
await Deno.writeTextFile("vendor.bundle.js", files['deno:///bundle.js']);

const project = deno2node({
    tsConfigFilePath: "tsconfig.json",
    compilerOptions: { outDir: "dist" },
});

emitAndExit(project);
