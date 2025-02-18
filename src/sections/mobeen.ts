import { collectProtos } from "../base.ts";
import type { ProtoBab } from "../base.ts";

let curInd = 1;
const fahras: ProtoBab = { $ind: 0 };
for (let hundred = 0; hundred < 6; hundred++) {
	const hundredBab: ProtoBab = { $ind: curInd++ };
	for (let ten = 0; ten < 10; ten++) {
		const tenBab: ProtoBab = { $ind: curInd++ };
		for (let one = 0; one < 10; one++) 
			tenBab[`صفحة (${hundred}${ten}${one})`] = hundred * 100 + ten * 10 + one;
		if (hundred === 0 && ten == 0) delete tenBab['صفحة (000)'];
		hundredBab[`صفحات (${hundred}${ten}${hundred + ten === 0 ? 1 : 0}) إلى (${hundred}${ten}9)`] = tenBab;
	}
	fahras[`صفحات (${hundred}0${hundred === 0 ? 1 : 0}) إلى (${hundred}99)`] = hundredBab;
}
fahras['صفحات (600) إلى (604)'] = {
	$ind: curInd++,
	'صفحة (600)': 600,
	'صفحة (601)': 601,
	'صفحة (602)': 602,
	'صفحة (603)': 603,
	'صفحة (604)': 604,
} satisfies ProtoBab;

export default collectProtos(fahras, 'تفسير المبين')
