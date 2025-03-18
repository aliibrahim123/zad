var h=Object.defineProperty;var c=(o,t)=>h(o,"name",{value:t,configurable:!0});import{Component as s,registry as r}from'./libs.js';import{getPacks as y,installedPacks as p,sendRequest as l,addListener as d,saveInstalledPacks as f,removeListener as k}from'./base.js';import{L as e}from"./chunks/node-BKieyWgd.js";const m={download:{node:new e("neo:template",{id:"download"},[new e("div",{id:"title"},["مركز التنزيل"],{"neocomp:id":54382923}),new e("div",{id:"no-internet"},["لا يوجد اتصال بالإنترنت"],{"neocomp:id":27960239}),new e("div",{id:"container"},[new e("div",{id:"status-bar"},[new e("div",{id:"primary"},["@(status){status?.primary}"],{"neocomp:id":87448673}),new e("div",{id:"secondary"},["@(status){status?.secondary}"],{"neocomp:id":49594446})],{"neocomp:id":3060853}),new e("div",{id:"list"},[],{"neocomp:id":63125956})],{"neocomp:id":72642534})],{"neocomp:id":6784963}),actions:[{type:"do",target:27960239,fn:new Function("comp","el","el.classList.toggle('hide', navigator.onLine)")},{type:"ref",target:3060853,name:"status-bar"},{type:"attr",target:87448673,attr:"text",template:["",{isExp:!0,fn:new Function("comp","el","status","return status?.primary"),dynamics:["status"],statics:[]}],staticProps:[],dynamicProps:[]},{type:"attr",target:49594446,attr:"text",template:["",{isExp:!0,fn:new Function("comp","el","status","return status?.secondary"),dynamics:["status"],statics:[]}],staticProps:[],dynamicProps:[]},{type:"ref",target:63125956,name:"list"}]},item:{node:new e("neo:template",{id:"item"},[new e("span",{class:["info"]},[new e("span",{class:["name"]},["@(pack){pack?.arabicName}"],{"neocomp:id":18239704}),new e("span",{class:["sep"]},["|"],{"neocomp:id":10579893}),new e("span",{class:["size"]},["حجم: @(pack){(pack?.size / 1000000).toFixed(2)} ميجا بايت"],{"neocomp:id":50638493}),new e("span",{class:["sep"]},["|"],{"neocomp:id":56520772}),new e("span",{class:["version"]},["آخر اصدار: @(pack){pack?.version}"],{"neocomp:id":42167896}),new e("span",{class:["no-pad"]},[new e("span",{class:["sep"]},["|"],{"neocomp:id":25032628}),new e("span",{},["الإصدار الموجود: @{installedVersion}"],{"neocomp:id":77049692})],{"neocomp:id":14965997})],{"neocomp:id":99907347}),new e("span",{class:["buttons"]},[new e("button",{},["تنزيل"],{"neocomp:id":55874952}),new e("button",{},["حذف"],{"neocomp:id":4397827})],{"neocomp:id":98842269})],{"neocomp:id":91699424}),actions:[{type:"attr",target:18239704,attr:"text",template:["",{isExp:!0,fn:new Function("comp","el","pack","return pack?.arabicName"),dynamics:["pack"],statics:[]}],staticProps:[],dynamicProps:[]},{type:"attr",target:50638493,attr:"text",template:["حجم: ",{isExp:!0,fn:new Function("comp","el","pack","return (pack?.size / 1000000).toFixed(2)"),dynamics:["pack"],statics:[]}," ميجا بايت"],staticProps:[],dynamicProps:[]},{type:"attr",target:42167896,attr:"text",template:["آخر اصدار: ",{isExp:!0,fn:new Function("comp","el","pack","return pack?.version"),dynamics:["pack"],statics:[]}],staticProps:[],dynamicProps:[]},{type:"effect",target:14965997,props:["installedVersion"],fn:new Function("comp","el","installedVersion",'el.classList.toggle("hide", !installedVersion)')},{type:"attr",target:77049692,attr:"text",template:["الإصدار الموجود: ",{isExp:!1,prop:"installedVersion",static:!1}],staticProps:[],dynamicProps:[]},{type:"on",target:55874952,events:["click"],fn:new Function("comp","el","event","comp.parent.download(comp.get('packName'))")},{type:"effect",target:4397827,props:["installedVersion"],fn:new Function("comp","el","installedVersion",'el.classList.toggle("hide", !installedVersion)')},{type:"on",target:4397827,events:["click"],fn:new Function("comp","el","event","comp.parent.delete(comp.get('packName'))")}]}};class u extends s{static{c(this,"Item")}static defaults={...s.defaults,view:{template:m.item,insertMode:"replace"},store:{addUndefined:!0},initMode:"minimal"};init(){}}class w extends s{static{c(this,"DownloadPage")}static defaults={...s.defaults,view:{template:m.download,insertMode:"into",into:"#inner-container"},store:{addUndefined:!0}};Status=this.signal("status",{primary:"متفرغ",secondary:""});listener=this.signal("listner",null);packs=this.signal("packs",null);async init(){if(this.initDom(),this.fireInit(),!navigator.onLine)return;const t=await y();this.packs.value=t;const a=this.refs.list[0];for(let n in t){const i=new u;this.addChild(i),i.el.id=`item-${n}`,i.store.setMultiple({packName:n,pack:t[n],installedVersion:p[n]}),a.append(i.el)}if(location.hash!==""){const n=this.query(`#item-${location.hash.slice(1)}`)[0];n.scrollIntoView({block:"center"}),n.animate({transform:["scale(1)","scale(1.025)","scale(1)"]},{duration:500,delay:300})}}download(t){if(l({type:"cache",action:"download",pack:t}),!this.listener.value){const a=this.onResponse.bind(this);this.listener.value=a,d("cache",a)}}delete(t){if(l({type:"cache",action:"delete",pack:t}),!this.listener.value){const a=this.onResponse.bind(this);this.listener.value=a,d("cache",a)}}name(t){return this.packs.value[t].arabicName}onResponse(t){if(t.type==="cache")if(t.status==="finished"){t.action==="download"?this.Status.value={primary:`تم تنزيل: ${this.name(t.pack)}`,secondary:""}:this.Status.value={primary:`تم حذف: ${this.name(t.pack)}`,secondary:""};const a=t.action==="download"?this.packs.value[t.pack].version:void 0;p[t.pack]=a,f(),this.children.find(n=>n.get("packName")===t.pack).set("installedVersion",a),t.nowIdle&&(k(this.listener.value),this.listener.value=null,setTimeout(()=>this.Status.value={primary:"متفرغ",secondary:""},1e3))}else t.action==="download"&&t.packType==="unpacked"?t.status==="started"?this.Status.value={primary:`بدأ تنزيل: ${this.name(t.pack)}`,secondary:""}:t.status==="caching"&&(this.Status.value={primary:`تنزيل: ${this.name(t.pack)}`,secondary:`تم تنزيل ${t.processed} / ${t.fullCount}`}):t.action==="download"&&t.packType==="packed"?t.status==="started"?this.Status.value={primary:`بدأ  تنزيل: ${this.name(t.pack)}`,secondary:""}:t.status==="fetched"?this.Status.value={primary:`تنزيل: ${this.name(t.pack)}`,secondary:`تم تنزيل جزأ ${t.chunk} / ${t.chunkCount}`}:t.status==="caching"?this.Status.value={primary:`تنزيل: ${this.name(t.pack)}`,secondary:`تم تحميل ${t.processed} / ${t.fileCount} من جزأ ${t.chunk} / ${t.chunkCount}`}:t.status==="finished-chunk"&&(this.Status.value={primary:`تنزيل: ${this.name(t.pack)}`,secondary:`تم تحميل جزأ ${t.chunk} / ${t.chunkCount} كاملاً`}):t.action==="delete"&&t.status==="deleting"&&(this.Status.value={primary:`يتم حذف: ${this.name(t.pack)}`,secondary:""})}}r.add("download",w);r.add("download.item",u);
