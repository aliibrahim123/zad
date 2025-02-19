var q=Object.defineProperty;var i=(e,t)=>q(e,"name",{value:t,configurable:!0});import*as A from'./libs.js';import{query as b,create as d,ZRORouter as J,registry as v}from'./libs.js';function x(e,t){return t===void 0?Math.floor(Math.random()*e):Math.floor(Math.random()*(t-e))+e}i(x,"randomInt");function U(){return screen.orientation.type.startsWith("portrait")}i(U,"isMobile");function ce(){for(const e of b("svg")){const t=e.getAttribute("_src");t&&fetch(t).then(async a=>{e.replaceWith(new DOMParser().parseFromString(await a.text(),"image/svg+xml").documentElement)})}}i(ce,"loadSvgs");function pe(e){setTimeout(e,0)}i(pe,"defer");function C(e){return!0}i(C,"$is");function S(e){if(Array.isArray(e))return e.map(a=>S(a));if(typeof e!="object"||e===null)return e;const t={};for(const a in e)t[a]=S(e[a]);return t}i(S,"deepCopy");function I(e,t){const a={};for(const r in e){const n=e[r],o=t[r];typeof n=="object"?a[r]=I(n,o||{}):a[r]=o||n}return a}i(I,"merge");function D(e){return new Promise(t=>setTimeout(t,e))}i(D,"delay");function ge(e){const t=window.getComputedStyle(e);return e.offsetHeight+Number.parseFloat(t.marginTop)+Number.parseFloat(t.marginBottom)}i(ge,"getHeight");function H(e){return e.trim().replaceAll(/[\u0617-\u061A\u064B-\u0652]/g,"").replaceAll(/[ئءؤإأآ]/g,"ا").split(" ")}i(H,"prepareForSearch");function de(e,t){const a=H(e);let r=0,n=t[0];for(const o of a)if(o.includes(n)&&(r++,n=t[r],r===t.length))return!0;return!1}i(de,"testString");const me=void 0;async function _(e,t){let a;const r=d("input"),n=d("div",".prompt",d("div",d("span",{innerText:e}),r,d("br"),d("button","حسناً",{events:{click(s){a(r.value)}}})));document.body.append(n),t&&t(n,r);const o=settings.style.core.animationSpeed;o&&n.animate({opacity:[0,1]},{duration:300*o}),r.focus();const l=await new Promise(s=>a=s);return o?n.animate({opacity:[1,0]},{duration:300*o}).finished.then(()=>n.remove()):n.remove(),l}i(_,"prompt");async function L(e,t=3e3){const a=d("div",".alert",{innerText:e});document.body.append(a);const r=settings.style.core.animationSpeed;r&&a.animate({opacity:[0,1]},{duration:300*r}),await D(t),r?a.animate({opacity:[1,0]},{duration:300*r}).finished.then(()=>a.remove()):a.remove()}i(L,"alert");const V="modulepreload",X=i(function(e){return"/"+e},"assetsURL"),N={},$=i(function(t,a,r){let n=Promise.resolve();if(a&&a.length>0){document.getElementsByTagName("link");const l=document.querySelector("meta[property=csp-nonce]"),s=l?.nonce||l?.getAttribute("nonce");n=Promise.allSettled(a.map(c=>{if(c=X(c),c in N)return;N[c]=!0;const g=c.endsWith(".css"),u=g?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${c}"]${u}`))return;const p=document.createElement("link");if(p.rel=g?"stylesheet":V,g||(p.as="script"),p.crossOrigin="",p.href=c,s&&p.setAttribute("nonce",s),document.head.appendChild(p),g)return new Promise((f,h)=>{p.addEventListener("load",f),p.addEventListener("error",()=>h(new Error(`Unable to preload CSS for ${c}`)))})}))}function o(l){const s=new Event("vite:preloadError",{cancelable:!0});if(s.payload=l,window.dispatchEvent(s),!s.defaultPrevented)throw l}return i(o,"handlePreloadError"),n.then(l=>{for(const s of l||[])s.status==="rejected"&&o(s.reason);return t().catch(o)})},"preload"),Z={quran:{viewer:"quranViewer",arabicName:"القرآن الكريم",dataFolder:"quran",contentPack:"quran",viewerStyle:["quran"]},doaa:{viewer:"viewer",arabicName:"قسم الدعاء",contentPack:"",dataFolder:"doaa"},saaat:{viewer:"viewer",arabicName:"أعمال الساعات",contentPack:"",dataFolder:"saaat"},osboa:{viewer:"viewer",arabicName:"أعمال الأسبوع",contentPack:"",dataFolder:"osboa"},months:{viewer:"viewer",arabicName:"أعمال الأشهر",contentPack:"",dataFolder:"months"},ziara:{viewer:"viewer",arabicName:"قسم زيارات",contentPack:"",dataFolder:"ziara"},mobeen:{viewer:"viewer",arabicName:"تفسير المبين",contentPack:"",dataFolder:"mobeen"},sera:{viewer:"viewer",arabicName:"سيرة أهل البيت (ع)",contentPack:"",dataFolder:"sera"},sala:{viewer:"viewer",arabicName:"قسم الصلاة",contentPack:"",dataFolder:"sala"},shorts:{viewer:"viewer",arabicName:"حكم وأقوال  قصيرة",contentPack:"",dataFolder:"shorts"},aliWord:{viewer:"viewer",arabicName:"حكم الإمام علي (ع)",contentPack:"",dataFolder:"aliWord"},dewan:{viewer:"viewer",arabicName:"ديوان أهل البيت",contentPack:"",dataFolder:"dewan"},nahij:{viewer:"viewer",arabicName:"نهج البلاغة",contentPack:"",dataFolder:"nahij"},ibooks:{viewer:"viewer",arabicName:"كتب اهل البيت",contentPack:"",dataFolder:"ibooks"},quranTopics:{viewer:"viewer",arabicName:"موضوعات القران الكريم",contentPack:"",dataFolder:"quranTopics",viewerStyle:["quran"]},quranInfo:{viewer:"viewer",arabicName:"مقتطفات قرآنية",contentPack:"",dataFolder:"quranInfo"},monasabat:{viewer:"viewer",arabicName:"مناسبات دينية",contentPack:"",dataFolder:"monasabat"},favorite:{contentPack:"",dataFolder:"",viewer:"",arabicName:"مفضلة",favoritable:!1,searchable:!1},test:{viewer:"viewer",arabicName:"تجربة",contentPack:"",dataFolder:"test"}},k=new Map;function M(e,t){k.set(e,t)}i(M,"addFahras");async function G(e){if(k.has(e))return k.get(e);let t;try{t=(await $(async()=>{const{default:a}=await import(`./sections/${e}.js`);return{default:a}},[])).default}catch{}try{t=(await $(async()=>{const{default:a}=await import(`./sections/${e}.ts`);return{default:a}},[])).default}catch{}return k.set(e,t),t}i(G,"getFahras");function R(e,t){const a=new Map;function r(n,o,l){const s=l;a.set(s.$ind,s),s.$name=o,s.$parent=n;for(const c in l)c[0]!=="$"&&l[c].$ind&&r(s,c,l[c])}return i(r,"walk"),r(void 0,t,e),a}i(R,"collectProtos");function z(e){let t=Math.ceil(Math.random()*1e6);for(;e.has(t);)t=Math.ceil(Math.random()*1e6);return t}i(z,"getRandomInd");const w={style:{core:{animationSpeed:1,backRes:"meduim",fontSize:1,titleSize:1,borderSize:1,masbahaSize:1},base:{layout:"full-page",background:"random",backFill:"fit",overlayBack:"blur",margin:1,marginX:1,borderWidth:1,overlayTransMod:.5,padding:.5,blackMod:1},root:{},viewer:{},fahras:{},tools:{}},content:{maxContentPerPage:8e3,maxUnitPerPage:30}};U()?(w.style.base.padding=1,w.style.base.blackMod=.4,w.style.core.fontSize=1.75):w.style.base.layout="overlay";const T=JSON.parse(localStorage.getItem("zad-settings"))||{style:{base:{},core:{},fahras:{},root:{},tools:{},viewer:{}},content:{}};globalThis.settings=I(w,T);globalThis.settings.overwritten=T;function ue(){localStorage.setItem("zad-settings",JSON.stringify(settings.overwritten))}i(ue,"saveSettings");"serviceWorker"in navigator&&navigator.serviceWorker.register("./sw.js",{scope:"./",type:"module"});let P=[];function je(e,t){P.push({type:e,fn:t})}i(je,"addListener");function fe(e){P=P.filter(t=>t.fn!==e)}i(fe,"removeListener");navigator.serviceWorker.addEventListener("message",e=>{const t=e.data;for(const{type:a,fn:r}of P)t.type===a&&r(t)});function he(e){navigator.serviceWorker.controller?.postMessage(e)}i(he,"sendRequest");JSON.parse(localStorage.getItem("zad-installed-packs"));const K=["12919.h.jpg","14273.h.jpg","14850.h.jpg","16856.h.jpg","17238.h.jpg","19834.h.jpg","30579.h.jpg","36655.h.jpg","39378.h.jpg","39411.h.jpg","39764.h.jpg","47923.h.jpg","49168.h.jpg","49840.h.jpg","54802.h.jpg","55805.h.jpg","59784.h.jpg","60082.h.jpg","62095.h.jpg","65358.h.jpg","66619.h.jpg","6735.h.jpg","67527.h.jpg","68769.h.jpg","7024.h.jpg","71477.h.jpg","71827.h.jpg","71990.h.jpg","73057.h.jpg","74560.h.jpg","76799.h.jpg","7855.h.jpg","80993.h.jpg","82491.h.jpg","84911.h.jpg","87531.h.jpg","88833.h.jpg","92135.h.jpg","92945.h.jpg","96616.h.jpg","96727.h.jpg","97605.h.jpg","97813.h.jpg","97820.h.jpg","99102.h.jpg","28546.m.jpg","45790.m.jpg","58927.m.jpg","82592.m.jpg","20036.l.jpg","32850.l.jpg","46741.l.jpg","61147.l.jpg","61681.l.jpg","81188.l.jpg","83126.l.jpg","90272.l.jpg","99707.l.jpg"],Q=["12919.m.jpg","14273.m.jpg","14850.m.jpg","16856.m.jpg","17238.m.jpg","19834.m.jpg","28546.m.jpg","30579.m.jpg","36655.m.jpg","39378.m.jpg","39411.m.jpg","39764.m.jpg","45790.m.jpg","47923.m.jpg","49168.m.jpg","49840.m.jpg","54802.m.jpg","55805.m.jpg","58927.m.jpg","59784.m.jpg","60082.m.jpg","62095.m.jpg","65358.m.jpg","66619.m.jpg","6735.m.jpg","67527.m.jpg","68769.m.jpg","71477.m.jpg","71827.m.jpg","71990.m.jpg","73057.m.jpg","74560.m.jpg","76799.m.jpg","7855.m.jpg","80993.m.jpg","82491.m.jpg","82592.m.jpg","84911.m.jpg","87531.m.jpg","88833.m.jpg","92135.m.jpg","92945.m.jpg","96616.m.jpg","96727.m.jpg","97605.m.jpg","97813.m.jpg","97820.m.jpg","99102.m.jpg","20036.l.jpg","32850.l.jpg","46741.l.jpg","61147.l.jpg","61681.l.jpg","7024.l.jpg","81188.l.jpg","83126.l.jpg","90272.l.jpg","99707.l.jpg"],Y=["12919.l.jpg","14273.l.jpg","14850.l.jpg","16856.l.jpg","17238.l.jpg","19834.l.jpg","20036.l.jpg","28546.l.jpg","30579.l.jpg","32850.l.jpg","36655.l.jpg","39378.l.jpg","39411.l.jpg","39764.l.jpg","45790.l.jpg","46741.l.jpg","47923.l.jpg","49168.l.jpg","49840.l.jpg","54802.l.jpg","55805.l.jpg","58927.l.jpg","59784.l.jpg","60082.l.jpg","61147.l.jpg","61681.l.jpg","62095.l.jpg","65358.l.jpg","66619.l.jpg","6735.l.jpg","67527.l.jpg","68769.l.jpg","7024.l.jpg","71477.l.jpg","71827.l.jpg","71990.l.jpg","73057.l.jpg","74560.l.jpg","76799.l.jpg","7855.l.jpg","80993.l.jpg","81188.l.jpg","82491.l.jpg","82592.l.jpg","83126.l.jpg","84911.l.jpg","87531.l.jpg","88833.l.jpg","90272.l.jpg","92135.l.jpg","92945.l.jpg","96616.l.jpg","96727.l.jpg","97605.l.jpg","97813.l.jpg","97820.l.jpg","99102.l.jpg","99707.l.jpg"],F=["16430.png","35948.png","46.jpg","47365.jpg","61492.png"];function B(e=!1){const t=b("main")[0].getAttribute("style-group");var a=settings.style[t];t!=="base"&&(a={...settings.style.base,...a});const r=settings.style.core,n=document.body,o=b("main")[0],l=b("#back-inner")[0],s=b("#overlay-border")[0];if(n.style.setProperty("--font-size",String(r.fontSize)),a.layout==="overlay"&&(a.overlayBack==="blur"||a.overlayBack==="transparent")?n.style.setProperty("--font-color","white"):n.style.setProperty("--font-color","black"),n.style.setProperty("--title-size",String(r.titleSize)),n.style.setProperty("--border-size",String(r.borderSize)),n.style.setProperty("--masbaha-size",String(r.masbahaSize)),n.style.setProperty("--black-mod",String(a.blackMod)),!e)if(a.layout==="full-page")u(g(F,a.background),"crop"),o.style.backgroundImage="";else{const p=r.backRes==="high"?K:r.backRes==="meduim"?Q:Y;u(g(p,a.background))}o.style.setProperty("--padding-mod",String(a.padding)),o.classList.remove("overlay"),s.classList.remove("enable"),a.layout==="overlay"&&c();function c(){o.classList.add("overlay"),o.style.setProperty("--margin-mod",String(a.margin)),o.style.setProperty("--margin-x-mod",String(a.marginX)),s.style.setProperty("--margin-mod",String(a.margin)),s.style.setProperty("--margin-x-mod",String(a.marginX)),o.style.setProperty("--border-width",String(a.borderWidth)),s.classList.add("enable"),s.style.setProperty("--trans-mod",String(a.overlayTransMod)),s.style.setProperty("--border-width",String(a.borderWidth)),o.style.setProperty("--trans-mod",String(a.overlayTransMod)),!e&&(o.classList.remove("transparent","blur","back-crop"),o.style.background="",a.overlayBack==="transparent"?o.classList.add("transparent"):a.overlayBack==="blur"?o.classList.add("blur"):(o.classList.add("back-crop"),o.style.backgroundClip="padding-box",o.style.backgroundImage=`url('./assets/background/${g(F,a.overlayBack)}')`))}i(c,"overlay");function g(p,f){return a.background==="random"?p[x(p.length)]:p.find(h=>h.startsWith(String(a.background)))}i(g,"getBack");function u(p,f=a.backFill){const h=`url('./assets/background/${p}')`;n.style.backgroundImage=h,f==="fit"?l.style.backgroundImage=h:l.style.backgroundImage="",n.classList.remove("back-fill","back-crop","back-blur"),l.classList.remove("back-fit"),f==="fill"?n.classList.add("back-fill"):f==="crop"?n.classList.add("back-crop"):(n.classList.add("back-fill","back-blur"),l.classList.add("back-fit"))}i(u,"setBack")}i(B,"setupStyle");function ye(e,t){const a=settings.style.core.animationSpeed,r=e.cloneNode(!0);r.classList.add("old"),r.style.position="absolute",e.before(r),r.animate({opacity:[1,0]},{duration:t*a}).finished.then(()=>r.remove()),e.animate({opacity:[0,1]},{duration:t*a})}i(ye,"updateFade");const ee=[],O=JSON.parse(localStorage.getItem("masabahat"))||{},y=JSON.parse(localStorage.getItem("search-history"))||[],E=JSON.parse(localStorage.getItem("zad-installed-packs"))||{};function te(){localStorage.setItem("masabahat",JSON.stringify(O))}i(te,"saveMasbahat");function ae(){localStorage.setItem("zad-installed-packs",JSON.stringify(E))}i(ae,"saveInstalledPacks");function re(e){y.includes(e)||(y.unshift(e),y.length>75&&y.pop(),localStorage.setItem("search-history",JSON.stringify(y)))}i(re,"addSearchEntry");async function ne(){return await(await fetch("./internal/contentPacks/info.json")).json()}i(ne,"getPacks");const oe=Object.freeze(Object.defineProperty({__proto__:null,addSearchEntry:re,currentSearches:ee,getPacks:ne,installedPacks:E,masbahat:O,saveInstalledPacks:ae,saveMasbahat:te,searchHistory:y},Symbol.toStringTag,{value:"Module"})),j=JSON.parse(localStorage.getItem("favorites"))||{$ind:0};let m=R(S(j),"مفضلاتي");async function be(e){let t=(await _("الإسم:",(o,l)=>{const s=d("datalist","#all-favorites",...ie().map(c=>d("option",{value:c})));l.setAttribute("list",s.id),o.append(s)})).trim();if(t==="")return;const a=t.split("/");let r=j,n=m.get(0);for(let o=0;o<a.length-1;o++){const l=a[o];if(r[l]){const u=r[l];u.link&&L("إنك تضيف مفضلة مكان مجموعة"),r=u,n=n[l];continue}const s=z(m),c={$ind:s};r[l]=c;const g={$ind:s,$name:l,$parent:n};n[l]=g,m.set(s,g),r=c,n=g}t=a.at(-1),r[t]={link:e},n[t]={link:e},localStorage.setItem("favorites",JSON.stringify(j))}i(be,"addToFavorites");Z.favorite.fahrasBattons=[{name:"حذف",show(e,t){return!t?.$meta?.isDeleteMenu},handle(e,t){const a=z(m),r={$ind:a,$name:`حذف: ${t.$name}`,$parent:t,$meta:{isDeleteMenu:!0}};for(const n in t)n[0]!=="$"&&(r[n]=()=>{const o=[];let l=t;for(;l.$parent;)o.push(l.$name),l=l.$parent;const s=o.reduceRight((c,g)=>c[g],j);delete s[n],localStorage.setItem("favorites",JSON.stringify(j)),m=R(S(j),"مفضلاتي"),M("favorite",m),router.back()});m.set(a,r),router.go("#favorite/"+a)}}];function ie(){const e=[],t=[];function a(r){for(const n in r)if(!n.startsWith("$")){if(C(r[n])&&r[n].link){e.push(t.concat(n).join("/"));continue}t.push(n),a(r[n]),t.pop()}}return i(a,"handle"),a(j),e}i(ie,"allFavorites");M("favorite",m);globalThis.router=new J({transitions:!!settings.style.core.animationSpeed,scrollToHash:!1});function W(){const e=b("main")[0];v.root&&v.removeRoot();const t=new(v.get(e.getAttribute("comp:name")))(e);v.setRoot(t),router.attachToDom(),B()}i(W,"update");router.onAftrerUpdate.on(W);router.onRoute.on((e,t)=>{t.pathname.endsWith("viewer.html")&&router.lastURL.pathname.endsWith("viewer.html")&&(router.lastURL=new URL("./force-reload",location.origin)),t.pathname===router.lastURL.pathname&&v.root?.onRoute?.(t)});W();globalThis.test={setupStyle:B,getFahras:G,prompt:_,alert:L,globalState:{...oe},libs:{...A}};export{C as $is,M as addFahras,je as addListener,re as addSearchEntry,be as addToFavorites,L as alert,ie as allFavorites,me as any,R as collectProtos,ee as currentSearches,S as deepCopy,w as defaultSettings,pe as defer,D as delay,G as getFahras,ge as getHeight,ne as getPacks,z as getRandomInd,E as installedPacks,U as isMobile,ce as loadSvgs,O as masbahat,I as merge,H as prepareForSearch,_ as prompt,x as randomInt,fe as removeListener,ae as saveInstalledPacks,te as saveMasbahat,ue as saveSettings,y as searchHistory,Z as sections,he as sendRequest,B as setupStyle,de as testString,ye as updateFade};
