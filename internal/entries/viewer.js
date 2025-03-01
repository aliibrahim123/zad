var w=Object.defineProperty;var g=(m,e)=>w(m,"name",{value:e,configurable:!0});import{Component as f,create as c,registry as v}from'./libs.js';import{L as n}from"./chunks/node-BKieyWgd.js";import{sections as y,updateFade as u,getHeight as b,addToFavorites as P,prepareForSearch as F,prompt as d,searchHistory as S,addSearchEntry as M,testString as L,setupStyle as C,saveSettings as x,masbahat as h,saveMasbahat as T}from'./base.js';const k={viewer:{node:new n("neo:template",{id:"viewer"},[new n("div",{id:"title"},["@{title}"],{"neocomp:id":73584579}),new n("div",{id:"info"},[],{"neocomp:id":77098076}),new n("div",{id:"main-toolbar",class:["toolbar"]},[new n("span",{class:["no-pad","inline"]},[new n("span",{},["الصفحة السابقة"],{"neocomp:id":75537406}),new n("span",{class:["sep"]},["|"],{"neocomp:id":52609524}),new n("span",{},["الصفحة التالية"],{"neocomp:id":10004596}),new n("span",{class:["sep"]},["|"],{"neocomp:id":93439084})],{"neocomp:id":93950115}),new n("span",{},["مدد"],{"neocomp:id":48658282}),new n("span",{},["قلص"],{"neocomp:id":98528223})],{"neocomp:id":81844862}),new n("br",{},[],{"neocomp:id":30201492}),new n("div",{id:"second-toolbar",class:["toolbar","hide"]},[new n("span",{},["عدل الخط"],{"neocomp:id":28068005}),new n("span",{class:["no-pad","inline"]},[new n("span",{class:["sep"]},["|"],{"neocomp:id":82670356}),new n("span",{},["اضف الى المفضلة"],{"neocomp:id":76285012})],{"neocomp:id":56245818}),new n("span",{ref:"download",class:["no-pad","inline"]},[new n("span",{class:["sep"]},["|"],{"neocomp:id":85090556}),new n("span",{},["تنزيل"],{"neocomp:id":71121421})],{"neocomp:id":18695310}),new n("span",{class:["no-pad","inline"]},[new n("span",{class:["sep"]},["|"],{"neocomp:id":97608619}),new n("span",{},["فلترة"],{"neocomp:id":6606815})],{"neocomp:id":23241238}),new n("span",{class:["sep"]},["|"],{"neocomp:id":67360595}),new n("span",{},["مسبحة"],{"neocomp:id":83739858}),new n("span",{class:["no-pad","inline"]},[new n("span",{class:["sep"]},["|"],{"neocomp:id":33728952}),new n("span",{},["تعديل المسبحة"],{"neocomp:id":17482155}),new n("span",{class:["sep"]},["|"],{"neocomp:id":86097582}),new n("span",{},["تحميل مسبحة"],{"neocomp:id":76365290}),new n("span",{class:["sep"]},["|"],{"neocomp:id":87396475}),new n("span",{},["حفظ المسبحة"],{"neocomp:id":54557247})],{"neocomp:id":7027869})],{"neocomp:id":98139158}),new n("div",{},[],{"neocomp:id":32663238}),new n("div",{id:"content"},[],{"neocomp:id":69639807}),new n("div",{id:"last-filler"},[],{"neocomp:id":9194362}),new n("div",{id:"masbaha",class:["hide"]},["@{masbahaCount}"],{"neocomp:id":78980332}),new n("div",{id:"adjust-font",class:["hide"]},[new n("span",{},["@(fontSize){String(fontSize).padStart(4, '0')}"],{"neocomp:id":4651736}),new n("input",{type:"range",min:"0.2",max:"5",step:"0.01"},[],{"neocomp:id":15304041})],{"neocomp:id":16410982})],{"neocomp:id":6983890}),actions:[{type:"attr",target:73584579,attr:"text",template:["",{isExp:!1,prop:"title",static:!1}],staticProps:[],dynamicProps:[]},{type:"ref",target:73584579,name:"title"},{type:"ref",target:77098076,name:"info"},{type:"ref",target:81844862,name:"main-toolbar"},{type:"ref",target:93950115,name:"page-control"},{type:"effect",target:93950115,props:["isMultiPage"],fn:new Function("comp","el","isMultiPage","el.classList.toggle('hide', !isMultiPage)")},{type:"on",target:75537406,events:["click"],fn:new Function("comp","el","event","comp.changePage(-1)")},{type:"on",target:10004596,events:["click"],fn:new Function("comp","el","event","comp.changePage(+1)")},{type:"effect",target:48658282,props:["show2ndToolbar"],fn:new Function("comp","el","show2ndToolbar","el.classList.toggle('hide', show2ndToolbar)")},{type:"on",target:48658282,events:["click"],fn:new Function("comp","el","event","comp.set('show2ndToolbar', true)")},{type:"effect",target:98528223,props:["show2ndToolbar"],fn:new Function("comp","el","show2ndToolbar","el.classList.toggle('hide', !show2ndToolbar)")},{type:"on",target:98528223,events:["click"],fn:new Function("comp","el","event","comp.set('show2ndToolbar', false)")},{type:"ref",target:98139158,name:"second-toolbar"},{type:"on",target:28068005,events:["click"],fn:new Function("comp","el","event","comp.adjustFont()")},{type:"ref",target:56245818,name:"add-favorite"},{type:"on",target:76285012,events:["click"],fn:new Function("comp","el","event","comp.addToFavorites()")},{type:"effect",target:18695310,props:["options"],fn:new Function("comp","el","options","el.classList.toggle('hide', options?.contentPack === '')")},{type:"on",target:71121421,events:["click"],fn:new Function("comp","el","event","comp.download()")},{type:"ref",target:23241238,name:"filter"},{type:"effect",target:23241238,props:["isMultiPage"],fn:new Function("comp","el","isMultiPage","el.classList.toggle('hide', !isMultiPage)")},{type:"on",target:6606815,events:["click"],fn:new Function("comp","el","event","comp.filter()")},{type:"on",target:83739858,events:["click"],fn:new Function("comp","el","event","comp.set('showMasbaha', !comp.get('showMasbaha'))")},{type:"ref",target:7027869,name:"masbaha-options"},{type:"effect",target:7027869,props:["showMasbaha"],fn:new Function("comp","el","showMasbaha","el.classList.toggle('hide', !showMasbaha)")},{type:"on",target:17482155,events:["click"],fn:new Function("comp","el","event","comp.adjustMasbaha()")},{type:"on",target:76365290,events:["click"],fn:new Function("comp","el","event","comp.loadMasbaha()")},{type:"on",target:54557247,events:["click"],fn:new Function("comp","el","event","comp.saveMasbaha()")},{type:"ref",target:32663238,name:"second-toolbar-filler"},{type:"ref",target:69639807,name:"content"},{type:"attr",target:78980332,attr:"text",template:["",{isExp:!1,prop:"masbahaCount",static:!1}],staticProps:[],dynamicProps:[]},{type:"on",target:78980332,events:["click"],fn:new Function("comp","el","event","comp.masbahaCount.value++")},{type:"ref",target:78980332,name:"masbaha"},{type:"ref",target:16410982,name:"adjust-font"},{type:"attr",target:4651736,attr:"text",template:["",{isExp:!0,fn:new Function("comp","el","fontSize","return String(fontSize).padStart(4, '0')"),dynamics:["fontSize"],statics:[]}],staticProps:[],dynamicProps:[]},{type:"attr",target:15304041,attr:"value",template:["",{isExp:!1,prop:"fontSize",static:!0}],staticProps:[],dynamicProps:[]},{type:"on",target:15304041,events:["input"],fn:new Function("comp","el","event","comp.updateFont(el.valueAsNumber)")},{type:"on",target:15304041,events:["change"],fn:new Function("comp","el","event","comp.saveSettings()")}]}};class j extends f{static{g(this,"Viewer")}static defaults={...f.defaults,view:{template:k.viewer,insertMode:"into",into:"#inner-container"},store:{addUndefined:!0}};init(){this.store.set("show2ndToolbar",!1),this.store.set("fontSize",settings.style.core.fontSize),this.store.set("showFontAdjust",!1),this.masbahaCount=this.signal("masbahaCount",0),this.pages=this.signal("pages",[]),this.effect(["show2ndToolbar"],this.togglw2ndToolbar.bind(this)),this.effect(["showMasbaha"],this.toggleMasbaha.bind(this)),this.initDom(),this.update(location.hash.slice(1)),this.fireInit()}sectionOptions=this.signal("options");page=this.signal("page");pages=this.signal("pages");data=this.signal("data");masbahaCount=this.signal("masbahaCount");async update(e){const[t,a]=e.split("/"),s=y[t];this.sectionOptions=this.signal("options",s);const o=await(await fetch(`./data/${s.dataFolder}/${a}.json`)).json();this.set("title",o.title),document.title=`زاد العباد ليوم المعاد: ${s.arabicName}`,this.data=this.signal("data",o);const i=Array.isArray(o.data)&&!o.singlePage;this.page=this.signal("page",0),this.set("isMultiPage",i),i&&this.collectPages(o.data),this.updateInfo();const p=this.refs.content[0];typeof o.data=="string"?this.setContent(p,o.data):i?this.updatePage(this.pages.value[0]):this.updatePage(o.data),s.viewerStyle&&s.viewerStyle.includes("quran")&&p.classList.add("quran")}updateInfo(){const e=this.data.value,t={};e.source&&(t.مصدر=e.source),this.get("isMultiPage")&&(t.صفحة="0"),e.info&&Object.assign(t,e.info);const a=this.refs.info[0];a.replaceChildren();for(const o in t)a.append(c("span",".info-item",{attrs:{prop:o}},`${o}: ${t[o]}`),c("span",".sep","|"));a.lastChild?.remove();const s=Object.keys(t).length===0;a.classList.toggle("hide",s)}setContent(e,t){this.data.value.type==="text"?e.innerText=t:e.innerHTML=t}collectPages(e){const{maxContentPerPage:t,maxUnitPerPage:a}=settings.content;let s=0,o=[],i=[o];for(const p of e)o.push(p),s+=p.text.length,(s>t||o.length===a)&&(o=[],i.push(o),s=0);i.at(-1)?.length===0&&i.pop(),this.pages.value=i}changePage(e){const t=this.page.value,a=this.pages.value,s=Math.max(0,Math.min(a.length-1,t+e));s!==t&&(this.page.value=s,this.updatePage(a[s]))}updatePage(e){const t=this.refs.content[0],a=this.refs.info[0];this.data.value.type;const s=settings.style.core.animationSpeed,o=t.childNodes.length===0;!o&&s&&(u(t,300),u(a,300)),t.replaceChildren(),this.updateInfo();const i=this.query('.info-item[prop="صفحة"]').filter(l=>!l.parentElement?.classList.contains("old"))[0];i&&(i.innerText=`صفحة: ${this.page.value+1} / ${this.pages.value.length}`);let p=0;for(const l of e){const r=c("div",".unit");this.setContent(r,l.text),l.miniTitle&&r.prepend(c("div",".unit-title",l.miniTitle)),l.source&&r.append(c("div",".unit-source",c("b","مصدر: "),l.source)),t.append(r),s&&!o&&r.animate([{opacity:0,transform:"translateY(1em)"},{opacity:1}],{fill:"backwards",easing:"ease-out",duration:400*s,delay:(100+Math.min(p++,15)*100)*s})}t.lastChild.classList.add("no-border")}togglw2ndToolbar(){const e=this.get("show2ndToolbar"),t=settings.style.core.animationSpeed,a=this.refs["second-toolbar"][0],s=this.refs["second-toolbar-filler"][0];if(t===0)return a.classList.toggle("hide",!e);e&&a.classList.remove("hide"),a.style.position="absolute",a.animate({opacity:e?[0,1]:[1,0]},{duration:300*t,fill:"backwards",delay:75*t*Number(e)}).finished.then(()=>{e||a.classList.add("hide")});const o=b(a)+"px";s.animate({height:e?["0",o]:[o,"0"]},{duration:300*t,easing:"ease-out",fill:"backwards",delay:75*t*+!e}).finished.then(()=>{s.style.height="0",a.style.position=""})}download(){const e=this.sectionOptions.value;router.go(`./download.html#${e.contentPack}`)}addToFavorites(){P(`.${location.pathname}${location.hash}`)}async filter(){const e=F(await d("الإسم: ",(a,s)=>{const o=c("datalist","#search-history",...S.map(i=>c("option",{value:i})));s.setAttribute("list",o.id),a.append(o)}));e[0]!==""&&M(e.join(" "));const t=this.data.value.data;e[0]===""?this.collectPages(t):this.collectPages(t.filter(a=>L(a.text,e))),this.page.value=0,this.updatePage(this.pages.value[0])}adjustFont(){const e=!this.get("showFontAdjust"),t=settings.style.core.animationSpeed,a=this.refs["adjust-font"][0];if(this.set("showFontAdjust",e),!t)return a.classList.toggle("hide",!e);a.classList.remove("hide"),a.animate({opacity:e?[0,1]:[1,0]},{duration:400*t}).finished.then(()=>{e||a.classList.add("hide")})}updateFont(e){settings.style.core.fontSize=e,settings.overwritten.style.core.fontSize=e,this.set("fontSize",e),C(!0)}saveSettings(){x()}toggleMasbaha(){const e=this.get("showMasbaha"),t=settings.style.core.animationSpeed,a=this.refs.masbaha[0];if(!t)return a.classList.toggle("hide",!e);a.classList.remove("hide"),a.animate({opacity:e?[0,1]:[1,0]},{duration:400*t}).finished.then(()=>{e||a.classList.add("hide")})}async adjustMasbaha(){const e=await d("العدد: ",(t,a)=>{a.value=String(this.masbahaCount.value)});this.masbahaCount.value=Number.parseInt(e)||0}masbahaAutoComplete(e,t){const a=c("datalist","#all-masbahat",...Object.keys(h).map(s=>c("option",{value:s})));t.setAttribute("list",a.id),e.append(a)}async loadMasbaha(){const e=await d("الإسم: ",this.masbahaAutoComplete);h[e]&&(this.masbahaCount.value=h[e])}async saveMasbaha(){h[await d("الإسم: ",this.masbahaAutoComplete)]=this.masbahaCount.value,T()}}v.add("viewer",j);export{j as Viewer};
