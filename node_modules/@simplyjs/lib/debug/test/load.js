//test loader

import { checkstr } from './check.js';
import { readdir } from 'node:fs/promises';
import { resolve } from 'node:path/posix';

export var load = async (path = './') => {
	//handle path
	checkstr(path);
	path = resolve(path); //convert from relative to working directory to absolute
	
	//gather files and folders
	var haveIndexFile = false, files = [], folders = [];
	var allFiles = await readdir(path, { withFileTypes: true });
	allFiles.forEach(file => {
		var name = file.name;
		if (file.isDirectory()) return folders.push(name);
		if (name === 'index.test.js') return haveIndexFile = true;
		if (name.includes('test')) files.push(name)
	})
	
	//load files and folders
	if (haveIndexFile) import(path + '/index.test.js').then(() => handleLoad(files, folders, path));
	else handleLoad(files, folders, path);
}

var handleLoad = (files, folders, path) => {
	files.forEach(file => import(path + '/' + file));
	folders.forEach(folder => load(path + '/' + folder));
}

if (globalThis.$test) $test.load = load