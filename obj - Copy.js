//global objects entry point

import { quran, quranHelpers } from './obj/quran.js';
import qTopic from './obj/qTopic.js';
import soraBenifits from './obj/soraBenifits.js';
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
	'ثواب السور القرآنية': soraBenifits,
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
	
	monasabatData,
	quranHelpers,
	months: Object.keys(monasabat)
}