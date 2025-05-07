import { exec as execCallback } from 'node:child_process';
import { rm, cp, readFile, writeFile, copyFile, mkdir, readdir } from 'node:fs/promises';
import { dirname } from 'node:path';
import { glob } from 'glob'

await rm('./dist/', { force: true, recursive: true });

async function copy (path: string) {
	await mkdir(dirname(`./dist/${path}`), { recursive: true });
	await copyFile(`./${path}`, `./dist/${path}`);
}

const exec = (command: string) => {
	console.log(`executing: ${command}`);
	return new Promise(r => execCallback(command, r).stdout?.pipe(process.stdout));
}

await exec('node scripts/generateJSSource.js');

await exec('vite build');

await exec('node scripts/generatePacks.js');
console.log(await readdir('./'))
console.log('copying base files');
const excludedInRoot = [
	'./README.md',
	'./tsconfig.json',
	'./vite.config.ts'
]
for (const file of await glob('./*.*', { ignore: excludedInRoot })) copy(file);

await cp('./assets', './dist/assets', { recursive: true });
await cp('./internal', './dist/internal', { recursive: true });
await cp('./styles', './dist/styles', { recursive: true });

console.log('copying data');
await cp('./data', './dist/data', { recursive: true });

await exec('node scripts/redirectEntryToSrc.js');