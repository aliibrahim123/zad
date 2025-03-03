import { collectProtos } from "../base.ts";
import type { ProtoBab } from "../base.ts";

export const sorMap: Record<string, [number, number]> = {
	'الفاتحة':   [1  , 1  ],
	'البقرة':    [2  , 49 ],
	'آل عمران':  [50 , 76 ],
	'النساء':    [77 , 106],
	'المائدة':   [106, 127],
	'الأنعام':   [128, 150],
	'الأعراف':   [151, 176],
	'الأنفال':   [177, 186],
	'التوبة':    [187, 207],
	'يونس':      [208, 221],
	'هود':       [221, 235],
	'يوسف':      [235, 248],
	'الرعد':     [249, 255],
	'ابراهيم':   [255, 261],
	'الحجر':     [262, 267],
	'النحل':     [267, 281],
	'الإسراء':   [282, 293],
	'الكهف':     [293, 304],
	'مريم':      [305, 312],
	'طه':        [312, 321],
	'الأنبياء':  [322, 331],
	'الحج':      [332, 341],
	'المؤمنون':  [342, 349],
	'النور':     [350, 359],
	'الفرقان':   [359, 366],
	'الشعراء':   [367, 376],
	'النمل':     [377, 385],
	'القصص':     [385, 396],
	'العنكبوت':  [396, 404],
	'الروم':     [404, 410],
	'لقمان':     [411, 414],
	'السجدة':    [415, 417],
	'الأحزاب':   [418, 427],
	'سبإ':       [428, 434],
	'فاطر':      [434, 440],
	'يس':        [440, 445],
	'الصافات':   [446, 452],
	'ص':         [453, 458],
	'الزمر':     [458, 467],
	'غافر':      [467, 476],
	'فصلت':      [477, 482],
	'الشورى':    [483, 489],
	'الزخرف':    [489, 495],
	'الدخان':    [496, 498],
	'الجاثية':   [499, 502],
	'الأحقاف':   [502, 506],
	'محمد':      [507, 510],
	'الفتح':     [511, 515],
	'الحجرات':   [515, 517],
	'ق':         [518, 520],
	'الذاريات':  [520, 523],
	'الطور':     [523, 525],
	'النجم':     [526, 528],
	'القمر':     [528, 531],
	'الرحمن':    [531, 534],
	'الواقعة':   [534, 537],
	'الحديد':    [537, 541],
	'المجادلة':  [542, 545],
	'الحشر':     [545, 548],
	'الممتحنة':  [549, 551],
	'الصف':      [551, 552],
	'الجمعة':    [553, 554],
	'المنافقون': [554, 555],
	'التغابن':   [556, 557],
	'الطلاق':    [558, 559],
	'التحريم':   [560, 561],
	'الملك':     [562, 564],
	'القلم':     [564, 566],
	'الحاقة':    [566, 568],
	'المعارج':   [568, 570],
	'نوح':       [570, 571],
	'الجن':      [572, 573],
	'المزمل':    [574, 575],
	'المدثر':    [575, 577],
	'القيامة':   [577, 578],
	'الانسان':   [578, 580],
	'المرسلات':  [580, 581],
	'النبإ':     [582, 583],
	'النازعات':  [583, 584],
	'عبس':       [585, 585],
	'التكوير':   [586, 586],
	'الإنفطار':  [587, 587],
	'المطففين':  [587, 589],
	'الإنشقاق':  [589, 589],
	'البروج':    [590, 590],
	'الطارق':    [591, 591],
	'الأعلى':    [591, 592],
	'الغاشية':   [592, 592],
	'الفجر':     [593, 594],
	'البلد':     [594, 594],
	'الشمس':     [595, 595],
	'الليل':     [595, 596],
	'الضحى':     [596, 596],
	'الشرح':     [596, 596],
	'التين':     [597, 597],
	'العلق':     [597, 597],
	'القدر':     [598, 598],
	'البينة':    [598, 599],
	'الزلزلة':   [599, 599],
	'العاديات':  [599, 600],
	'القارعة':   [600, 600],
	'التكاثر':   [600, 600],
	'العصر':     [601, 601],
	'الهمزة':    [601, 601],
	'الفيل':     [601, 601],
	'قريش':      [602, 602],
	'الماعون':   [602, 602],
	'الكوثر':    [602, 602],
	'الكافرون':  [603, 603],
	'النصر':     [603, 603],
	'المسد':     [603, 603],
	'الإخلاص':   [604, 604],
	'الفلق':     [604, 604],
	'الناس':     [604, 604]
};

let curInd = 6;

//construct sor bab
const sorBab: ProtoBab = { $ind: 1 };
for (const sor in sorMap) {
	const [start, end] = sorMap[sor];
	if (start === end) sorBab[sor] = start;
	else {
		const bab: ProtoBab = { $ind: curInd++ };
		for (let ind = start; ind <= end; ind++) bab[`صفحة (${ind})`] = ind;
		sorBab[sor] = bab;
	}
}

//construct page bab
const pageBab: ProtoBab = { $ind: 2 };
for (let hundred = 0; hundred < 6; hundred++) {
	const hundredBab: ProtoBab = { $ind: curInd++ };
	for (let ten = 0; ten < 10; ten++) {
		const tenBab: ProtoBab = { $ind: curInd++ };
		for (let one = 0; one < 10; one++) 
			tenBab[`صفحة (${hundred}${ten}${one})`] = hundred * 100 + ten * 10 + one;
		if (hundred === 0 && ten == 0) delete tenBab['صفحة (000)'];
		hundredBab[`صفحات (${hundred}${ten}${hundred + ten === 0 ? 1 : 0}) إلى (${hundred}${ten}9)`] = tenBab;
	}
	pageBab[`صفحات (${hundred}0${hundred === 0 ? 1 : 0}) إلى (${hundred}99)`] = hundredBab;
}
pageBab['صفحات (600) إلى (604)'] = {
	$ind: curInd++,
	'صفحة (600)': 600,
	'صفحة (601)': 601,
	'صفحة (602)': 602,
	'صفحة (603)': 603,
	'صفحة (604)': 604,
} satisfies ProtoBab;

//construct part bab;
const partBab: ProtoBab = { $ind: 3 };
for (let ind = 0; ind < 30; ind++) partBab[`جزأ (${ind + 1})`] = 
	ind === 0 ? 1 : ind * 20 + 2;

//construct ahzab bab
const ahzabBab: ProtoBab = { $ind: 4 };
const ahzab = [
	1, 11, 22, 32, 42, 51, 62, 72, 82, 92, 102, 112, 121, 132, 142, 151, 162, 173,
	182, 192, 201, 212, 222, 231, 242, 252, 262, 272, 282, 292, 302, 312, 322, 332,
	342, 352, 362, 371, 382, 392, 402, 413, 422, 431, 442, 451, 462, 472, 482, 491,
	502, 513, 522, 531, 542, 553, 562, 572, 582, 591
];
for (let ind = 0; ind < 60; ind++) ahzabBab[`حزب (${ind + 1})`] = ahzab[ind];

const fahras: ProtoBab = {
	$ind: 0,
	'حسب السور': sorBab,
	'حسب الصفحات': pageBab,
	'حسب الأجراء': partBab,
	'حسب الاحزاب': ahzabBab
}

export default collectProtos(fahras, 'القران الكريم')