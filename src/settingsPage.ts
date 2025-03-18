import type { AttrsMap } from "@neocomp/full/rawdom/typebase.ts";
import { Component, create, registry } from "./libs.ts";
import type {BaseMap, CompOptions } from "./libs.ts";
import template from './templates/settings.neo.html';
import { defaultSettings, saveSettings, sendRequest, setupStyle, type Settings, type StyleGroup } from "./base.ts";

type Section = 'main' | 'style' | 'content' | 'storage' | 'timing';
interface TypeMap extends BaseMap {
	childmap: {},
	props: {
		lastSection: HTMLElement,
		showFontAdjust: boolean,
		fontSize: number,
		styleGroup: StyleGroup
	},
	refs: {
		'adjust-font': HTMLElement
	} & Record<`section-${Section}`, HTMLElement>
};

class SettingsPage extends Component<TypeMap> {
	static override defaults: CompOptions = {
		...Component.defaults,
		view: { 
			template: template.settings,
			insertMode: 'into',
			into: '#inner-container'
		},
		store: { addUndefined: true },
		
	};
	styleGroup = this.signal('styleGroup');
	override init() {
		this.set('fontSize', settings.style.core.fontSize);
		this.set('showFontAdjust', false);
		this.styleGroup = this.signal('styleGroup', 'tools');

		this.initDom();

		//open current section
		const section = this.getSection(location.hash.slice(1) as Section);
		section.classList.add('current');
		this.store.add('lastSection', { value: section });

		this.addStyleSection();
		this.addStorageSection();
		this.addTimingSection();

		this.fireInit();
	}
	async onRoute (url: URL) {
		const lastSection = this.get('lastSection');
		const curSection = this.getSection(url.hash.slice(1) as Section);
		const sectionWidth = lastSection.clientWidth;

		//switch
		lastSection.classList.remove('current');
		curSection.classList.add('current');
		this.set('lastSection', curSection);

		//animate
		const animationSpeed = settings.style.core.animationSpeed;
		if (animationSpeed) {
			const toRoot = url.hash === '';

			curSection.animate({
				transform: [`translateX(${sectionWidth * (toRoot ? 1 : -1)}px)`, '']
			}, { duration: 350 * animationSpeed });

			lastSection.classList.add('exiting');
			await lastSection.animate({
				transform: ['', `translateX(${sectionWidth * (toRoot ? -1 : 1)}px)`]
			}, { duration: 350 * animationSpeed }).finished;
			lastSection.classList.remove('exiting') 
		}
	}
	getSection (section: '' | Section) {
		return this.refs[`section-${section === '' ? 'main' : section}`][0]
	}
	
	addStyleSection () {
		this.addHeader('style', 'عام');
		this.addButton('style', 'عدل حجم الخط', this.adjustFont.bind(this));
		this.addSlider(
		  'style', 'حجم العناوين', { min: 0.5, max: 1.5, step: 0.01 }, 
		  handlerFor('core', 'titleSize')
		);
		this.addOptions(
		  'style', 'التصميم', [
			{ name: 'صفحة ورقية', value: 'full-page' }, 
			{ name: 'صفحة عائمة', value: 'overlay' }, 
		  ], handlerFor('base', 'layout', false)
		);
		this.addSlider(
		  'style', 'سرعة التحريك', { min: 0, max: 2.5, step: 0.01 }, 
		  handlerFor('core', 'animationSpeed')
		);

		this.addHeader('style', 'خلفية');
		this.addOptions(
		  'style', 'ملأ الخلفية', [
			{ name: 'ملأ', value: 'fill' }, 
			{ name: 'ملائم', value: 'fit' }, 
			{ name: 'قص', value: 'crop' }
		  ], handlerFor('base', 'backFill', false)
		);
		this.addOptions(
		  'style', 'جودة الخلفيات', [
			{ name: 'منخفضة', value: 'low' }, 
			{ name: 'متوسطة', value: 'meduim' }, 
			{ name: 'مرتفعة', value: 'high' }
		  ], handlerFor('core', 'backRes')
		);
		this.addOptions(
		  'style', 'خلفية الصفحة', [
			{ name: 'ورقة', value: 'random' }, 
			{ name: 'شفاف', value: 'transparent' }, 
			{ name: 'ضبابي', value: 'blur' }
		  ], handlerFor('base', 'overlayBack', false)
		);
		this.addSlider(
		  'style', 'شفافية خلفية الصفحة', { min: 0, max: 1.5, step: 0.01 }, 
		  handlerFor('base', 'overlayTransMod')
		);
	
		this.addHeader('style', 'هوامش');
		this.addSlider(
		  'style', 'حجم الهامش الداخلي', { min: 0.25, max: 10, step: 0.01 }, 
		  handlerFor('base', 'padding')
		);
		this.addSlider(
		  'style', 'حجم الهامش الخارجي', { min: 0.25, max: 5, step: 0.01 }, 
		  handlerFor('base', 'margin')
		);
		this.addSlider(
		  'style', 'حجم الهامش الخارجي الأفقي', { min: 0.25, max: 3, step: 0.01 }, 
		  handlerFor('base', 'marginX')
		);
		
		this.addHeader('style', 'أخرى');
		this.addSlider(
		  'style', 'عمق الأسود', { min: 0.05, max: 1.5, step: 0.01 }, 
		  handlerFor('base', 'blackMod')
		);
		
		this.addSlider(
		  'style', 'حجم الحدود', { min: 0.25, max: 3, step: 0.01 }, 
		  handlerFor('core', 'borderSize')
		);
		this.addSlider(
		  'style', 'حجم المسبحة', { min: 0.25, max: 3, step: 0.01 }, 
		  handlerFor('core', 'masbahaSize')
		);
		
		function handlerFor 
		  <O extends keyof Settings['style'], P extends keyof Settings['style'][O], T>
		(obj: O, prop: P, soft = true) { return {
		  getter: () => settings.style[obj][prop] as T,
		  setter (value: T) {
			settings.style[obj][prop] = value as any;
			settings.overwritten.style[obj][prop] = value as any;
			setupStyle(soft);
		  },
		  reset () {
			settings.style[obj][prop] = defaultSettings.style[obj][prop];
			delete settings.overwritten.style[obj][prop];
			saveSettings();
			setupStyle(soft);
		   }
		} }
	}

	addStorageSection () {
		this.addButton('storage', 'حذف المسبحات', 
		  () => localStorage.removeItem('masabahat')
		);
		this.addButton('storage', 'حذف سجل البحث', 
		  () => localStorage.removeItem('search-history')
		);
		this.addButton('storage', 'حذف المفضلة', 
		  () => localStorage.removeItem('favorites')
		);
		this.addButton('storage', 'حذف سجل التنقل', 
		  () => localStorage.removeItem('scroll-history')
		);
		this.addButton('storage', 'حذف التنزيلات', () => {
			sendRequest({ type: 'cache', action: 'delete-all' });
			localStorage.removeItem('zad-installed-packs')
		});
		this.addButton('storage', 'إدارة التنزيلات', 
		  () => router.go('download.html')
		);
	}

	addTimingSection () {
		this.addInput('timing', 'تصحيح التاريخ', { type: 'number' }, handlerFor('adjustDate'));
		this.addOptions('timing', 'طريقة الحساب', [
			{ name: 'معهد ليفا، قم', value: '0' },
			{ name: 'جامعة العلوم الإسلامية، كراتشي', value: '1' },
			{ name: 'الجمعية الإسلامية لأمريكا الشمالية', value: '2' },
			{ name: 'رابطة العالم الإسلامي', value: '3' },
			{ name: 'جامعة أم القرى، مكة المكرمة', value: '4' },
			{ name: 'الهيئة المصرية العامة للمساحة', value: '5' },
			{ name: 'معهد الجيوفيزياء، جامعة طهران', value: '7' },
			{ name: 'منطقة الخليج', value: '8' },
			{ name: 'الكويت', value: '9' },
			{ name: 'قطر', value: '10' },
			{ name: 'مجلس أوغاما الإسلامي سنغافورة، سنغافورة', value: '11' },
			{ name: 'الاتحاد المنظمات الإسلامية في فرنسا', value: '12' },
			{ name: 'رئاسة الشؤون الدينية، تركيا', value: '13' },
			{ name: 'الإدارة الروحية لمسلمي روسيا', value: '14' },
			{ name: 'لجنة رؤية الهلال العالمية', value: '15' },
			{ name: 'دبي', value: '16' },
			{ name: 'إدارة التنمية الإسلامية الماليزية (جاكيم)', value: '17' },
			{ name: 'تونس', value: '18' },
			{ name: 'الجزائر', value: '19' },
			{ name: 'وزارة الشؤون الدينية بجمهورية إندونيسيا (كيمناج)', value: '20' },
			{ name: 'المغرب', value: '21' },
			{ name: 'الجماعة الإسلامية في لشبونة', value: '22' },
			{ name: 'وزارة الأوقاف والشؤون والمقدسات الإسلامية، الأردن', value: '23' },
		], handlerFor('method'));
		this.addOptions('timing', 'الشفق', [
			{ name: 'عام', value: 'general' },
			{ name: 'أحمر', value: 'ahmar' },
			{ name: 'أبيض', value: 'abyad' }
		], handlerFor('safaq'));
		this.addOptions('timing', 'وضع منتصف الليل', [
			{ name: 'قياسي (من منتصف الغروب إلى الشروق)', value: '0' },
			{ name: 'جعفري (من منتصف الغروب إلى الفجر)', value: '1' }
		], handlerFor('midnightMode'));
		this.addOptions('timing', 'طريقة ضبط خط العرض', [
			{ name: 'منتصف الليل', value: '1' },
			{ name: 'سبع الليل', value: '2' },
			{ name: 'بناءً على الزاوية', value: '3' }
		], handlerFor('latitudeAdjust'));

		function handlerFor <T> (prop: keyof Settings['timings']) { return {
		  getter: () => settings.timings[prop] as T,
		  setter (value: T) {
			settings.timings[prop] = value as never;
			settings.overwritten.timings[prop] = value as any;
		  },
		  reset () {
			settings.timings[prop] = defaultSettings.timings[prop] as never;
			delete settings.overwritten.timings[prop];
			saveSettings();
		   }
		} }
	}

	addHeader (section: Section, name: string) {
		this.refs[`section-${section}`][0].append(
		  create('div', '.header', name)
		)
	}
	addInput (section: Section, name: string, attrs: AttrsMap['input'], fns: { 
		getter: () => string, setter: (value: string) => void, reset: () => void 
	  }) {
		  const input = create('input', '.unit-input', { 
			attrs: attrs as any, value: String(fns.getter()),
			events: {
			  input () { fns.setter(input.value) },
			  change: () => saveSettings()
			}
		  });
  
		  const el = create('div', '.unit', 
			create('span', '.unit-name', name),
			input,
			create('button', '.unit-reset', 'اعادة التعيين', { events: {
			  click: () => { fns.reset(); input.value = fns.getter(); saveSettings() }
			} })
		  );
  
		  this.refs[`section-${section}`][0].append(el)
	  }
	addSlider (section: Section, name: string, attrs: AttrsMap['input'], fns: { 
	  getter: () => number, setter: (value: number) => void, reset: () => void 
	}) {
		const input = create('input', '.unit-slider', { 
		  type: 'range', attrs: attrs as any, value: String(fns.getter()),
		  events: {
		    input () { fns.setter(input.valueAsNumber) },
			change: () => saveSettings()
		  }
		});

		const el = create('div', '.unit', 
		  create('span', '.unit-name', name),
		  input,
		  create('button', '.unit-reset', 'اعادة التعيين', { events: {
			click: () => { fns.reset(); input.value = String(fns.getter()); saveSettings() }
		  } })
		);

		this.refs[`section-${section}`][0].append(el)
	}
	addOptions (section: Section, name: string, options: {name: string, value: string}[], fns: { 
		getter: () => string, setter: (value: string) => void
	  }) {
		  const select = create('select', '.unit-select',
			options.map(({ name, value }) => create('option', { value }, name)), 
			{ events: { change: () => { fns.setter(select.value); saveSettings() } } },
			{ value: fns.getter() }
		  );

		  const el = create('div', '.unit', 
			create('span', '.unit-name', name),
			select,
		  );
  
		  this.refs[`section-${section}`][0].append(el)
	  }
	addButton (section: Section, name: string, handler: () => void) {
		this.refs[`section-${section}`][0].append(
		  create('div', '.unit', '.unit-button', name, { events: {
			click: () => handler()
		  } })
		)
	}

	adjustFont () {
		const show = !this.get('showFontAdjust');
		const animationSpeed = settings.style.core.animationSpeed;
		const container = this.refs['adjust-font'][0];
		this.set('showFontAdjust', show);

		//if no animation
		if (!animationSpeed) return container.classList.toggle('hide', !show);

		//fade in/out
		container.classList.remove('hide');
		container.animate({ opacity: show ? [0, 1] : [1, 0] }, { duration: 400 * animationSpeed })
		  .finished.then(() => { if (!show) container.classList.add('hide') });
	}
	updateFont (size: number) {
		settings.style.core.fontSize = size;
		settings.overwritten.style.core.fontSize = size;
		this.set('fontSize', size);
		setupStyle(true);
	}

	saveSettings () {
		saveSettings()
	}
}

registry.add('settings', SettingsPage);