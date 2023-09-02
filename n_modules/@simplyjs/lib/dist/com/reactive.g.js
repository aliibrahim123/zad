var ur=Object.defineProperty;var i=(e,r)=>ur(e,"name",{value:r,configurable:!0});var p=class extends Error{constructor(r="reactive: empty"){var t=r.indexOf(":");super(r.slice(t+1).trim()),this.name=r.slice(0,t)}};i(p,"ReactiveError");var l=class{constructor(r=[],t={}){this.fns=[],this.pipe(r),this.packetHandlers=[],this.completeHandlers=[],this.errorHandlers=[],t&&this.subscribe(t),this.latest=void 0,this.processingPackets=0,this.completed=!1}pipe(...r){return Array.isArray(r[0])&&(r=r[0]),r.forEach((t,o)=>{if(typeof t!="function")throw new p(`stream: fn at index (${o}) of type (${t?.constructor?.name}), expected (Function)`)}),this.fns=this.fns.concat(r),this}pipeFirst(...r){return Array.isArray(r[0])&&(r=r[0]),r.forEach((t,o)=>{if(typeof t!="function")throw new p(`stream: fn at index (${o}) of type (${t?.constructor?.name}), expected (Function)`)}),this.fns.unshift(...r),this}next(r){return r instanceof Promise?r.then(this.next.bind(this)):(this.processingPackets++,new Promise((t,o)=>{if(this.completed)return this.processingPackets=0;g(this,r,0,t,o)}))}nextMultiple(...r){return Array.isArray(r[0])&&(r=r[0]),Promise.all(r.map(t=>this.next(t)))}complete(r){return new Promise(t=>{if(this.processingPackets===0)return b(this,r,t);this.packetHandlers.push(()=>this.processingPackets===0&&b(this,r,t))})}subscribe(r){var{packet:t,complete:o,error:a}=r;return t&&(s(t,"stream","packetHandler"),this.packetHandlers.push(t)),o&&(s(o,"stream","completeHandler"),this.completeHandlers.push(o)),a&&(s(a,"stream","errorHandler"),this.errorHandlers.push(a)),this}unsubscribe(r){var{packet:t,complete:o,error:a}=subscription;return t&&(s(t,"stream","packetHandler"),this.packetHandlers.filter(n=>n!==t)),o&&(s(o,"stream","completeHandler"),this.completeHandlers.filter(n=>n!==o)),a&&(s(a,"stream","errorHandler"),this.errorHandlers.filter(n=>n!==a)),this}};i(l,"Stream");var g=i((e,r,t,o,a)=>{var n=r;for(let c=t;c<e.fns.length;c++){if(n=lr(e,n,c,o,a),n===$)return;if(n instanceof Promise)return n.then(d=>g(e,d,c+1,o,a)).catch(d=>g(e,d,c+1,o,a))}if(e.processingPackets--,n===y)return o(n);if(n instanceof Error)return I(e,n,a);Promise.all(e.packetHandlers.map(c=>c(n,e))).then(()=>{o(n),e.latest=n})},"handle"),I=i((e,r,t)=>Promise.all(e.errorHandlers.map(o=>o(r,e))).then(()=>t(r)),"handleError"),b=i((e,r,t)=>{e.completed=!0,Promise.all(e.completeHandlers.map(o=>o(r,e))).then(()=>t(r))},"handleComplte"),lr=i((e,r,t,o,a)=>{if(r=e.fns[t](r,e),r instanceof Error&&!e.fns[t+1]?.$isCatcher)I(e,r,a);else if(r===y)o(y);else return r;return e.processingPackets--,$},"handleOne"),$=Symbol("break"),y=Symbol("stream-drop");var s=i((e,r,t="fn")=>{if(typeof e!="function")throw new p(`${r}: ${t} of type (${e?.constructor?.name}), expected (Function)`)},"checkfn"),T=i((e,r,t)=>{if(!Array.isArray(e))throw new p(`${r}: ${t} of type (${e?.constructor?.name}), expected (Array)`)},"checkarr"),E=i((e,r)=>{if(!(e instanceof l))throw new p(`${r}: stream of type (${e?.constructor?.name}), expected (Stream)`)},"checkStream"),v=i((e,r)=>e.forEach((t,o)=>{if(!(t instanceof l))throw new p(`${r}: stream at index (${o}) of type (${t?.constructor?.name}), expected (Stream)`)}),"checkStreams"),h=i((e,r,t)=>{if(typeof e!="number")throw new p(`${r}: ${t} of type (${e?.constructor?.name}), expected (Number)`);if(!Number.isInteger(e)||e<=0)throw new p(`${r}: ${t} is (${e}), expected positive integer`)},"checkInt");var u=class{constructor(r){this._value=r,this.effects=[]}get v(){return this._value}set v(r){this._value!==r&&(this._value=r,this.effects.forEach(t=>t(r,this)))}get value(){return this._value}set value(r){this._value!==r&&(this._value=r,this.effects.forEach(t=>t(r,this)))}addEffect(r){return s(r,"rvalue"),this.effects.push(r),this}removeEffect(r){return s(r,"rvalue"),this.effects=this.effects.filter(t=>t!==r),this}};i(u,"RValue");var x=class extends u{constructor(r,t){if(super(),!Array.isArray(r))throw new p("cvalue: rvalues of type ("+r?.constructor?.name+"), expected (Array)");s(t),this.vals=r,this.fn=t,r.forEach(o=>o.addEffect(this.handle.bind(this))),this.handle()}get v(){return this._value}get value(){return this._value}set v(r){throw new p("cvalue: unable to manualy set computed value")}set value(r){throw new p("cvalue: unable to manualy set computed value")}handle(){var r=this.fn(...this.vals.map(t=>t.v));this._value=r,this.effects.forEach(t=>t(r,this))}};i(x,"CValue");var A=i(e=>{throw new p("store: undefined property ("+e+")")},"throwUPError"),w=class{constructor(r={}){this.data={};for(let t in r)this.add(t,r[t])}add(r,t,o=!1){return r in this.data&&console.warn("store: adding defined property ("+r+")"),this.data[r]=t instanceof u?t:new u(t),o?this.data[r]:this}addC(r,t,o,a=!1){return T(t,"store","values"),this.add(r,new x(t.map(n=>(this.data[n]||A(n),this.data[n])),o),a)}get(r,t=!1){var o=this.data[r];return o?t?o:o.v:void 0}set(r,t,o=!1){var a=this.data[r];return a?t instanceof u?a=this.data[r]=t:a.v=t:a=this.add(r,t,!0),o?a:this}delete(r){return r in this.data?(delete this.data[r],!0):!1}addEffect(r,t){if(s(t),!Array.isArray(r)){var o=this.data[r];return o||A(r),o.addEffect(t),t}var a=i(()=>t(...n.map(c=>c.value),this),"nfn");r.forEach(c=>{c in this.data?this.data[c].addEffect(a):A(c)});var n=r.map(c=>this.data[c]);return a}removeEffect(r,t){if(Array.isArray(r))r.forEach(a=>this.removeEffect(a,t));else{var o=this.data[r];o?o.removeEffect(t):A(r)}return this}};i(w,"Store");var m=class{constructor(r){if(!Array.isArray(r))throw new p("stream collection: streams of type ("+r?.constructor?.name+"), expected (Array)");v(r,"stream collection"),this.streams=r}add(r){return E(r,"stream collection"),this.streams.push(r),this}remove(r){return E(r,"stream collection"),this.streams=this.streams.filter(t=>t!==r),this}next(r){return Promise.all(this.streams.map(t=>t.next(r)))}complete(r){return Promise.all(this.streams.map(t=>t.complete(r)))}nextMultiple(...r){return Promise.all(this.streams.map(t=>t.nextMultiple(...r)))}};i(m,"StreamCollection");var S=i(e=>{var r=e instanceof u?e:new u(e);return[r.v,t=>r.v=t,()=>r.v,r]},"state");var H=i((e,r,t=[])=>{if(!(e instanceof EventTarget))throw new p("stream op (fromEvents): target of type ("+e?.constructor?.name+"), expected (EventTarget)");var o=new m(t);return e.addEventListener(r,a=>o.next(a)),o},"fromEvents"),_=i((e,r=a=>a,t=281474976710656,o=[])=>{s(r,"stream op (fromTimer)","mapper"),h(e,"stream op (fromTimer)","delay"),h(e,"stream op (fromTimer)","max");var a=new m(o),n=0,c=setInterval(()=>{a.next(r(++n)),n===t&&(a.complete(),clearInterval(c))},e);return[a,()=>clearInterval(c)]},"fromTimer"),M=i((...e)=>new m(e),"createCollection"),R=i(e=>{E(e,"stream op (fromStream)");var r=new m([]);return e.subscribe({packet:t=>r.next(t),complete:t=>r.complete(t)}),r},"fromStream");var C=i((...e)=>{var r=new l;if(e.length===0)throw new p("stream op (merge): no streams had been given");v(e,"stream op (merge)");var t=[];return e.forEach(o=>{var a;t.push(new Promise(n=>a=n)),o.subscribe({packet:n=>r.next(n),complete:a})}),Promise.all(t).then(o=>r.complete(o)),r},"merge"),F=i((e,r=o=>o,...t)=>{var o=!0;s(e,"stream op (mergeWhen)","filter"),r instanceof l?(t.push(r),o=!1):s(r,"stream op (mergeWhen)","mapper");var a=new l;if(t.length===0)throw new p("stream op (mergeWhen): no streams had been given");v(t,"stream op (mergeWhen)");var n=[];return t.forEach(c=>{var d;n.push(new Promise(k=>d=k)),c.subscribe({packet:k=>e(k,c)&&a.next(o?r(k,c):k),complete:d})}),Promise.all(n).then(c=>a.complete(c)),a},"mergeWhen");var D=i(e=>(s(e,"stream op (map)"),e),"map"),V=i((e,r)=>{s(e,"stream op (acc)");var t=r;return(o,a)=>t=e(t,o,a)},"acc"),N=i((e,r)=>{s(e,"stream op (statefulMap)");var t=r,o;return(a,n)=>([o,t]=e(t,a,n),o)},"statefulMap"),O=i(e=>()=>e,"fill"),B=i((e,r)=>(s(e,"stream op (mapIf)","cond"),s(r,"stream op (mapIf)"),(t,o)=>e(t,o)?r(t,o):t),"mapIf"),L=i((e,r,t)=>{s(e,"stream op (accIf)","cond"),s(r,"stream op (accIf)");var o=t;return(a,n)=>e(a,o,n)?o=r(o,a,n):o},"accIf"),U=i((e,r,t)=>{s(e,"stream op (statefulMapIf)","cond"),s(r,"stream op (statefulMapIf)");var o=t,a;return(n,c)=>e(n,o,c)?([a,o]=r(o,n,c),a):n},"statefulMapIf"),q=i((e,r)=>(s(e,"stream op (fillIf)","cond"),(t,o)=>e(t,o)?r:t),"fillIf");var f=y,G=i(e=>(s(e,"stream op (filter)"),(r,t)=>e(r,t)?r:f),"filter"),J=i((e=[])=>{if(!Array.isArray(e)&&!(e instanceof Set))throw new p("stream op (distinct): set of type ("+e?.constructor?.name+"), expected (Array) or (Set)");return Array.isArray(e)&&(e=new Set(e)),r=>e.has(r)?f:e.add(r)&&r},"distinct"),K=i(e=>{if(!Array.isArray(e)&&!(e instanceof Set))throw new p("stream op (remove): set of type ("+e?.constructor?.name+"), expected (Array) or (Set)");return Array.isArray(e)&&(e=new Set(e)),r=>e.has(r)?f:r},"remove"),Q=i(e=>{h(e,"stream op (skip)","count");var r=e;return t=>e-- >0?f:t},"skip"),X=i(e=>{s(e,"stream op (skipWhile)");var r=!0;return(t,o)=>r?e(t,o)?f:(r=!1)||t:t},"skipWhile"),Y=i(e=>{h(e,"stream op (take)","count");var r=e;return t=>e-- >0?t:f},"take"),Z=i(e=>{s(e,"stream op (takeWhile)");var r=!0;return(t,o)=>r?e(t,o)?t:(r=!1)||f:f},"takeWhile");var z=i((...e)=>(e[0]instanceof m&&(e=e[0].streams),v(e,"stream op (redirectTo)"),r=>(e.forEach(t=>t.next(r)),f)),"redirectTo"),j=i((e,...r)=>(r[0]instanceof m&&(r=r[0].streams),s(e,"stream op (redirectWhen)"),v(r,"stream op (redirectWhen)"),(t,o)=>e(t,o)?(r.forEach(a=>a.next(t)),f):t),"redirectWhen"),rr=i((...e)=>(e[0]instanceof m&&(e=e[0].streams),v(e,"stream op (multicast)"),r=>(e.forEach(t=>t.next(r)),r)),"multicast"),er=i((e,...r)=>(r[0]instanceof m&&(r=r[0].streams),s(e,"stream op (multicastWhen)"),v(r,"stream op (multicastWhen)"),(t,o)=>(e(t,o)&&r.forEach(a=>a.next(t)),t)),"multicastWhen"),tr=i((...e)=>(e[0]instanceof m&&(e=e[0].streams),v(e,"stream op (mcastAndWait)"),r=>Promise.all(e.map(t=>t.next(r))).then(()=>r)),"mcastAndWait"),or=i((e,...r)=>(r[0]instanceof m&&(r=r[0].streams),s(e,"stream op (mcastWhenAndWait)"),v(r,"stream op (mcastWhenAndWait)"),(t,o)=>e(t,o)?Promise.all(r.map(a=>a.next(t))).then(()=>t):t),"mcastWhenAndWait");var ir=i(e=>{h(e,"stream op (debounce)","delay");var r,t,o;return a=>(clearTimeout(r),t&&t(f),o=new Promise(n=>t=n),r=setTimeout(()=>t(a),e),o)},"debounce"),ar=i(e=>{h(e,"stream op (throttle)","delay");var r,t=0,o,a;return n=>{var c=Date.now();return c-t>=e?(t=c,n):(clearTimeout(r),o&&o(f),a=new Promise(d=>o=d),r=setTimeout(()=>{t=c,o(n)},e-(c-t)),a)}},"throttle"),nr=i(e=>(h(e,"stream op (delay)","delay"),r=>{var t,o=new Promise(a=>t=a);return setTimeout(()=>t(r),e),o}),"delay"),sr=i((e,r)=>(s(e,"stream op (delayWhen)","cond"),h(r,"stream op (delayWhen)","delay"),(t,o)=>{if(!e(t,o))return t;var a,n=new Promise(c=>a=c);return setTimeout(()=>a(t),r),n}),"delayWhen");var cr=i((e,r=1)=>{h(e,"stream op (buffer)","size"),h(r,"stream op (buffer)","startEvery");var t=Array.from({length:e}),o=r;return a=>(t.push(a),t.shift(),--o!==0?f:(o=r,Array.from(t)))},"buffer"),pr=i((e,r=0)=>{h(e,"stream op (bufferTime)","delay"),r!==0&&h(r,"stream op (bufferTime)","maxSize");var t=[],o,a,n=!0;return c=>(t.push(c),r>0&&t.length>r&&t.shift(),n?(o=new Promise(d=>a=d),setTimeout(()=>{n=!0;var d=t;t=[],a(d)},e),n=!1,o):f)},"bufferTime");var fr=i(e=>{s(e,"stream op (catchError)");var r=i((t,o)=>t instanceof Error?e(t,o):t,"toreturn");return r.$isCatcher=!0,r},"catchError"),W=i(e=>e instanceof Error?f:e,"dropError");W.$isCatcher=!0;var mr=i(e=>(s(e,"stream op (tap)"),r=>(e(r),r)),"tap"),hr=i(e=>(console.log(e),result),"log");var dr=i(e=>new u(e),"v"),vr=i((e,r)=>new x(e,r),"cv"),xr=i((e,r)=>e.addEffect(r),"on"),wr=i((e,r)=>e.removeEffect(r),"off"),kr=i(e=>new w(e),"store"),yr=i((e,r)=>new l(e,r),"stream"),P={RValue:u,CValue:x,Store:w,Stream:l,StreamCollection:m,ReactiveError:p,v:dr,cv:vr,on:xr,off:wr,store:kr,state:S,stream:yr,fromEvents:H,fromTimer:_,createCollection:M,fromStream:R,merge:C,mergeWhen:F,map:D,mapIf:B,acc:V,accIf:L,fill:O,fillIf:q,statefulMap:N,statefulMapIf:U,drop:f,filter:G,distinct:J,remove:K,skip:Q,skipWhile:X,take:Y,takeWhile:Z,redirectTo:z,redirectWhen:j,multicast:rr,multicastWhen:er,mcastAndWait:tr,mcastWhenAndWait:or,debounce:ir,throttle:ar,delay:nr,delayWhen:sr,buffer:cr,bufferTime:pr,catchError:fr,dropError:W,tap:mr,log:hr};globalThis.$rct=P;var it=P;export{x as CValue,u as RValue,p as ReactiveError,w as Store,l as Stream,m as StreamCollection,V as acc,L as accIf,cr as buffer,pr as bufferTime,fr as catchError,M as createCollection,vr as cv,ir as debounce,it as default,nr as delay,sr as delayWhen,J as distinct,f as drop,W as dropError,O as fill,q as fillIf,G as filter,H as fromEvents,R as fromStream,_ as fromTimer,hr as log,D as map,B as mapIf,tr as mcastAndWait,or as mcastWhenAndWait,C as merge,F as mergeWhen,rr as multicast,er as multicastWhen,wr as off,xr as on,z as redirectTo,j as redirectWhen,K as remove,Q as skip,X as skipWhile,S as state,N as statefulMap,U as statefulMapIf,kr as store,yr as stream,Y as take,Z as takeWhile,mr as tap,ar as throttle,dr as v};