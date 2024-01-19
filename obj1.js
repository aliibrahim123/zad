//global objects entry point

import { quran, quranHelpers } from './obj/quran.js';
import qTopic from './obj/qTopic.js';
import tajweed from './obj/tajweed.js';
import doaa from './obj/doaa.js';
import ziara from './obj/ziara.js';
import sala from './obj/sala.js';
import saaa from './obj/saaa.js';
import ayam from './obj/ayam.js';
import month from './obj/month.js';
import monasabat from './obj/monasabat.js';
import monasabatData from './data/monasabat.js';
import sera from './obj/sera.js';
import tafseer from './obj/tafseer.js';
import aliWord from './obj/aliWord.js';
import shorts from './obj/shorts.js';
import dewan from './obj/dewan.js';
import ghodab from './obj/ghodab.js';
import ibooks from './obj/ibooks.js';
import nahij from './obj/nahij.js';

globalThis.globalObjects = {
	'قرآن': quran,
	'مواضيع القرآن الكريم': qTopic,
	'أحكام التجويد': tajweed,
	'تفسير': tafseer,
	'أدعية': doaa,
	'زيارات': ziara,
	'قسم الصلاة': sala,
	'اعمال الساعات': saaa,
	'اعمال الأسبوع': ayam,
	'اعمال الأشهر': month,
	'مناسبات': monasabat,
	'سيرة أهل البيت': sera,
	'حكم الإمام علي': aliWord,
	'أقوال قصيرة': shorts,
	'ديوان': dewan,
	'خطب': ghodab,
	'كتب أهل البيت': ibooks,
	'نهج البلاغة': nahij,
	'المفضلة': JSON.parse(localStorage.getItem('z-favorite') || `{
		"$name": "المفضلة", 
		"$ind": 0, 
		"خذف": { "$isButton": true, "name": "delete" }}`
	),
	
	vdata: {
		'نهج البلاغة': ['viewer.html', 'nahij', 'json'],
		'حكم الإمام علي': ['viewer.html', 'aliWord', 'json'],
		'اعمال الأسبوع': ['viewer.html', 'ayam', 'json'],
		'اعمال الأشهر': ['viewer.html', 'month', 'json'],
		'قسم الصلاة': ['viewer.html', 'sala', 'json'],
		'اعمال الساعات': ['viewer.html', 'saaa', 'json'],
		'أدعية': ['viewer.html', 'doaa', 'json'],
		'زيارات': ['viewer.html', 'ziara', 'json'],
		'كتب أهل البيت': ['viewer.html', 'ibooks', 'json'],
		'ديوان': ['viewer.html', 'dewan', 'ihtml'],
		'خطب': ['viewer.html', 'ghodab', 'ihtml'],
		'أقوال قصيرة': ['viewer.html', 'shorts', 'json'],
		'مناسبات': ['viewer.html', 'monasabatData', 'obj'],
		'ثواب السور القرآنية': ['viewer.html', 'soraBenifits', 'json'],
		'مواضيع القرآن الكريم': ['viewer.html', 'qTopic', 'json'],
		'تفسير': ['viewer.html', 'tafseer', 'json'],
		'أحكام التجويد': ['viewer.html', 'tajweed', 'txt'],
		'قرآن': ['q-viewer.html', 'quran', 'txt'],
		'سيرة أهل البيت': ['viewer.html', 'sera', 'html']
	},
	
	fahrasBtns: {
		'المفضلة': {
			delete: async () => {
				var name = await createPrompt('الاسم:');
				delete globalObjects['المفضلة'][name];
				localStorage.setItem('z-favorite', JSON.stringify(globalObjects['المفضلة']));
				$comp.root.call('update', location)
			}
		}
	},
	
	cpacks: [
		['أساس', 'core'],
		['قرآن وأدعية', 'base'],
		['قسم القرآن', 'quran-plus'],
		['سيرة', 'sera'],
		['تراث الأئمة', 'iturath'],
		['وسائط', 'assets']
	],

	monasabatData,
	quranHelpers,
	months: Object.keys(monasabat)
}

//index globalObjects
var names = [];
var nameMap = {};
var walk = (obj, name, indexes) => {
	obj.$name = name;
	obj.$ind = indexes.push(obj) -1;
	
	for (let name in obj) {
		let prop = obj[name];
		if (prop && typeof prop === 'object' && !Array.isArray(prop)) walk(prop, name, indexes);
		else if (!nameMap[name]) nameMap[name] = names.push(name) -1;
	}
}

var cats = [
	'قرآن', 'مواضيع القرآن الكريم', 'أحكام التجويد', 'تفسير', 'أدعية', 'زيارات', 'قسم الصلاة', 'اعمال الساعات', 'اعمال الأسبوع', 'اعمال الأشهر',
	'مناسبات', 'سيرة أهل البيت', 'حكم الإمام علي', 'أقوال قصيرة', 'ديوان', 'خطب', 'كتب أهل البيت', 'نهج البلاغة'
]

globalObjects.names = names;
globalObjects.nameMap = nameMap;
globalObjects.indexes = Object.fromEntries(cats.map(cat => {
	var indexes = [];
	walk(globalObjects[cat], cat, indexes);
	return [cat, indexes]
}));