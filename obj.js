//objects entry point

import { quran, quranHelpers } from './obj/quran.js';
import qTopic from './obj/qTopic.js';
import tajweed from './obj/tajweed.js';

globalThis.globalObjects = {
	'قرآن': quran,
	'مواضيع القرآن الكريم': qTopic,
	'أحكام التجويد': tajweed,
	
	quranHelpers
}