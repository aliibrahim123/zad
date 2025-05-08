import { exec as execCallback } from "node:child_process";
import { rm, cp, copyFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";
import { glob } from "glob";
await rm("./dist/", { force: true, recursive: true });
async function copy(path) {
  await mkdir(dirname(`./dist/${path}`), { recursive: true });
  await copyFile(`./${path}`, `./dist/${path}`);
}
const exec = (command) => {
  console.log(`executing: ${command}`);
  return new Promise((r) => {
    const child = execCallback(command, r);
    child.stdout?.pipe(process.stdout);
    child.stderr?.pipe(process.stdout);
  });
};
await exec("node scripts/generateJSSource.js");
await exec("node scripts/redirectEntryToSrc.js");
await exec("vite build");
await exec("node scripts/generatePacks.js");
console.log("copying base files");
const excludedInRoot = [
  "./README.md",
  "./tsconfig.json",
  "./vite.config.ts"
];
for (const file of await glob("./*.*", { ignore: excludedInRoot })) copy(file);
await cp("./assets", "./dist/assets", { recursive: true });
await cp("./internal", "./dist/internal", { recursive: true });
await cp("./styles", "./dist/styles", { recursive: true });
console.log("copying data");
await cp("./data", "./dist/data", { recursive: true });
