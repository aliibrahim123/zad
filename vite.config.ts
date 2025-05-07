import { defineConfig } from 'vite';
import type { Plugin } from 'vite';
import directoryPlugin from 'vite-plugin-directory-index';
import { neoTempPlugin } from './node_modules/@neocomp/full/src/build/plugin';
import { entries, entriesFull, entriesFullSet } from './scripts/entries.ts';
import { resolve } from 'node:path'
import { rename } from 'node:fs/promises';
console.log('a')
//config
export default defineConfig({
	server: {
		port: 8080,
		open: true,
		
	},
	publicDir: false,
	base: '/zad/',
	build: {
		target: 'esnext',
		outDir: './internal/entries/',
		manifest: true,
		rollupOptions: {
			input: Object.fromEntries(entries.map((entry, ind) => [entry, entriesFull[ind]])),
			preserveEntrySignatures: 'allow-extension',
			output: { 
				entryFileNames: '[name].js',
				chunkFileNames: 'chunks/[name]-[hash].js'
			},
			external: (path, parentPath) => {
				//mark external if module import from entry
				return !!(parentPath && entriesFullSet.has(path.slice(path.indexOf('src/'))));
			},
		},
		dynamicImportVarsOptions: {
			include: ['']
		}
	},
	esbuild: {
		keepNames: true
	},
	plugins: [directoryPlugin(), neoTempPlugin(), tsToJsImports()]
});

//vite dont change extention to .js
function tsToJsImports (): Plugin { return {
	name: 'internal:external-resolver',
	generateBundle (option, bundle) {
		for (const name in bundle) {
			const entry = bundle[name];
			if (entry.type === 'asset') continue;

			entry.code = entry.code.replaceAll(/from\s*['"]([^'"]+\.ts)['"]/g, 
				(match, path)=> `from'${path.slice(0, -3)}.js'`
			);
		}
	},
	writeBundle(_, bundle) {
		rename('./internal/entries/sw.js', './sw.js');
	}
}
}