import { Component, registry, create } from "./libs.ts";
import type { BaseMap, CompOptions } from "./libs.ts";
import template from './templates/aboutDay.neo.html';
import { toHijri, toHijriString, getFahras, type Bab, adjustedToday } from "./base.ts";

const months = [
	'مُحَرَّم', 'صَفَر', 'رَبِيع الْأَوَّل', 'رَبِيع الثَّانِي', 'جُمَادَى الْأُولَى', 'جُمَادَى الثَّانِيَة',
	'رَجَب', 'شَعْبَان', 'رَمَضَان', 'شَوَّال', 'ذُو الْقَعْدَة', 'ذُو الْحِجَّة'
];
const weakdays = ['الأحد', 'الأثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];

interface Location {
	longitude: number,
	latitude: number
}

var location: Location = JSON.parse(localStorage.getItem('location') as string);

interface TypeMap extends BaseMap {
	props: {
		hijri: ReturnType<typeof toHijri>,
		dateString: string,
		showMonasabat: boolean,
		monasabat: string
	},
	refs: {
		timings: HTMLElement
	}
};
 
class AboutDayPage extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { 
			template: template.aboutDay,
			insertMode: 'into',
			into: '#inner-container'
		},
		store: { addUndefined: true }
	};
	override async init() {
		const today = adjustedToday();
		const hijri = toHijri(today);
		this.set('hijri', hijri);
		this.set('dateString', toHijriString(today));
		this.set('showMonasabat', true);

		this.initDom();

		//handle monasabat
		(async () => {
			const monasabat = (await getFahras('monasabat')).get(0) as Bab;
			const id = (monasabat[months[hijri.month -1]] as any)[`اليوم (${hijri.day})`];
			this.set('showMonasabat', !!id);
			if (id) this.set('monasabat', (await (await fetch(`./data/monasabat/${id}.json`)).json()).data);
		})();

		//timings
		(async () => {
			if (!location) await this.updateLocation();
			const day = today.getDate().toString().padStart(2, '0');
			const month = (today.getMonth()+1).toString().padStart(2, '0');
			const year = today.getFullYear().toString().padStart(4, '0');

			const params = [
				['latitude', location.latitude],
				['longitude', location.longitude],
				['method', 10],
				['method', settings.timings.method],
				['safaq', settings.timings.safaq],
				['midnightMode', settings.timings.midnightMode],
				['latitudeAdjustmentMethod', settings.timings.latitudeAdjust]
			].map(entry => entry.join('=')).join('&');

			const res = (await (await fetch(
			  `https://api.aladhan.com/v1/timings/${day}-${month}-${year}?${params}`
			)).json()).data.timings;

			const timings = {
				'الفجر': res.Fajr || '00:00',
				'الشروق': res.Sunrise || '00:00',
				'الظهر': res.Dhuhr || '00:00',
				'العصر': res.Asr || '00:00',
				'الغروب': res.Sunset || '00:00',
				'المغرب': res.Maghrib || '00:00',
				'العشاء': res.Isha || '00:00',
				'الإمساك': res.Imsak || '00:00',
				'ثلث الليل الأول': res.Firstthird || '00:00',
				'منتصف الليل': res.Midnight || '00:00',
				'ثلث الليل الأخير': res.Lastthird || '00:00'
			}

			const container = this.refs['timings'][0];
			for (const time in timings) container.append(
			  create('div', '.item', 
				create('b', '.timing', time), ': ',
				create('span', '.timing-value', timings[time as keyof typeof timings])
			  )
			);
		})();

		this.fireInit();
	}
	
	async updateLocation() {
		const coords = await new Promise<GeolocationCoordinates>(
			(res) => navigator.geolocation.getCurrentPosition(v =>res(v.coords))
		);
		location = { latitude: coords.latitude, longitude: coords.longitude };
		localStorage.setItem('location', JSON.stringify(location));
	}

	async goToWeekWork() {
		const weekWork = (await getFahras('osboa')).get(0) as Bab;
		const id = (weekWork[weakdays[new Date().getDay()]] as any).$ind;
		router.go(`./fahras.html#osboa/${id}`);
	}
	async goToMonthWork() {
		const date = this.get('hijri');
		const monthWorks = (await getFahras('months')).get(0) as Bab;
		const id = (monthWorks[months[date.month -1]] as any)[`اليوم (${date.day})`].$ind;
		if (id) router.go(`./fahras.html#months/${id}`);
	}
}

registry.add('about-day', AboutDayPage);