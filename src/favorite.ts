import { create } from "./libs.ts";
import { prompt, alert } from "./prompt.ts";
import type { Bab, ProtoBab, SectionOptions } from "./sections";
import { addFahras, collectProtos, getRandomInd, sections } from './sections'
import { $is, deepCopy } from "./utils.ts";

const favorites: ProtoBab = JSON.parse(localStorage.getItem('favorites') as string) || { $ind: 0 };
let fahras = collectProtos(deepCopy(favorites), 'مفضلاتي');

export async function addToFavorites (link: string) {
	//ask for name
	let name = (await prompt('الإسم:', (container, input) => {
		const datalist = create('datalist', '#all-favorites', 
		  ...allFavorites().map(name => create('option', { value: name }))
		);
		input.setAttribute('list', datalist.id);
		container.append(datalist);
	})).trim();
	if (name === '') return;

	//loop through path
	const path = name.split('/');
	let curProtoBab = favorites, curBab = fahras.get(0) as Bab;
	for (let i = 0; i < (path.length -1); i++) {
		const name = path[i];
		//case group added before
		if (curProtoBab[name]) {
			const curItem = curProtoBab[name];
			//if is link
			if ($is<{link:string}>(curItem) && curItem.link) alert('إنك تضيف مفضلة مكان مجموعة');

			curProtoBab = curItem as ProtoBab;
			curBab = curBab[name] as Bab;
			continue;
		}
		
		//else create bab for the group 
		const ind = getRandomInd(fahras);
		const protoBab: ProtoBab = { $ind: ind };
		curProtoBab[name] = protoBab;

		const bab: Bab = { $ind: ind, $name: name, $parent: curBab };
		curBab[name] = bab;
		fahras.set(ind, bab);

		curProtoBab = protoBab;
		curBab = bab;
	}
	
	//add link
	name = path.at(-1) as string;
	curProtoBab[name] = { link };
	curBab[name] = { link };

	//save changes
	localStorage.setItem('favorites', JSON.stringify(favorites));
}

type DeleteMenuBab = Bab & {
	$meta: Bab['$meta'] & { isDeleteMenu: boolean }
}

sections.favorite.fahrasBattons = [{
	name: 'حذف',
	show (section, bab) {
		return !((bab as DeleteMenuBab)?.$meta?.isDeleteMenu)
	},
	handle (section, bab) {
		//create delete bab
		const ind = getRandomInd(fahras);
		const deleteBab = { 
			$ind: ind, $name: `حذف: ${bab.$name}`, $parent: bab, $meta: { isDeleteMenu: true } 
		} as DeleteMenuBab;

		//map items to scripted items that delete the selected
		for (const item in bab) if (item[0] !== '$')
		  deleteBab[item] = () => {
			//create path to root
			const path: string[] = [];
			let curBab = bab;
			while (curBab.$parent) {
				path.push(curBab.$name)
				curBab = curBab.$parent;
			}

			//get parent proto bab and delete item
			const protoBab = path.reduceRight((parent, child) => parent[child] as ProtoBab, favorites);
			delete protoBab[item];

			//save, recollect protos and return
			localStorage.setItem('favorites', JSON.stringify(favorites));
			fahras = collectProtos(deepCopy(favorites), 'مفضلاتي');
			addFahras('favorite', fahras);
			router.back();
		  };
		
		//add it and got to it
		fahras.set(ind, deleteBab);
		router.go('#favorite/' + ind);
	}
}];

export function allFavorites () {
	
	const names: string[] = [], path: string[] = [];
	function handle (bab: ProtoBab) {
	  for (const item in bab) if (!item.startsWith('$')) {
		//case link
		if ($is<{link:string}>(bab[item]) && bab[item].link) {
			names.push(path.concat(item).join('/'));
			continue;
		}
		path.push(item);
		handle(bab[item]);
		path.pop();
	  }
	}
	handle(favorites);
	return names
}

addFahras('favorite', fahras);