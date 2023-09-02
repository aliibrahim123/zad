var z=Object.defineProperty;var p=(e,r)=>z(e,"name",{value:r,configurable:!0});var a=p((e,r="handler")=>{if(typeof e!="function")throw new TypeError(`promise: ${r} of type (${e?.constructor?.name}), expected (Function)`)},"checkfn"),s=p((e,r)=>{if(typeof e!="number")throw new TypeError(`promise: ${r} of type (${e?.constructor?.name}), expected (Number)`);if(!Number.isInteger(e)||e<=0)throw new TypeError(`promise: ${r} is (${e}), expected positive integer`)},"checkpInt"),v=p(e=>{if(!(e instanceof Promise))throw new TypeError(`promise: promise of type (${e?.constructor?.name}), expected (Promise)`)},"checkpromise");var y=p((e,r,t)=>(v(e),a(t,"catcher"),e.catch(o=>o instanceof r&&t(o))),"catchOfType"),w=p((e,r)=>(v(e),a(r),e.then(t=>(r(t),t))),"tap"),P=p((e,r)=>(a(e),s(r,"delay"),new Promise((t,o)=>setTimeout(()=>e(t,o),r))),"delay");var k=p(()=>{var e,r,t=new Promise((o,n)=>{e=o,r=n});return{promise:t,resolve:e,reject:r}},"extracted"),d=p(e=>{checkhandler(e);var r=!1,t=new Promise((o,n)=>{e(c=>r||o(c),c=>r||n(c))});return{promise:t,cancel:()=>r=!0}},"cancelable"),E=p(e=>(a(e,"fn"),(...r)=>new Promise((t,o)=>{e(...r,(n,c)=>{n?o(n):t(c)})})),"promisify");var h=p(e=>{if(!Array.isArray(e))throw new TypeError("promise: array of type ("+e?.constructor?.name+"), expected (Array)")},"checkarr"),T=p((e,r)=>(a(r),h(e),e.reduce((t,o,n)=>t.then(()=>new Promise((c,i)=>r(o,c,i,n,e))),Promise.resolve())),"each"),g=p((e,r)=>(a(r),h(e),Promise.all(e.map((t,o)=>new Promise((n,c)=>r(t,n,c,o,e))))),"map"),A=p((e,r)=>(a(r),h(e),e.reduce((t,o,n)=>t.then(c=>new Promise((i,f)=>r(o,i,f,n,e)).then(i=>(c.push(i),c))),Promise.resolve([]))),"mapSeries"),$=p((e,r)=>(a(r),h(e),Promise.all(e.map((t,o)=>new Promise((n,c)=>r(t,n,c,o,e)))).then(t=>e.filter((o,n)=>t[n]))),"filter"),I=p((e,r,t)=>(a(r),h(e),e.reduce((o,n,c)=>o.then(i=>new Promise((f,m)=>r(i,n,f,m,c,e))),Promise.resolve(t))),"reduce");var B=p(e=>{if(!Array.isArray(e))throw new TypeError("promise: promises of type ("+e?.constructor?.name+"), expected (Array)");e.forEach((r,t)=>{if(!(r instanceof Promise))throw new TypeError("promise: promise at index ("+t+") of type ("+r?.constructor?.name+"), expected (Array)")})},"checkpromises"),O=p((e,r)=>{if(B(e),s(r,"count"),e.length<r)throw new TypeError("promise: promises length ("+e.length+") less than count ("+r+")");return new Promise((t,o)=>{var n=[],c=[],i=p(()=>{n.length===r&&t(n),e.length-c.length<r&&o(c)},"check");e.forEach(f=>f.then(m=>n.push(m)&&i()).catch(m=>c.push(m)&&i()))})},"some"),F=p(e=>new Promise((r,t)=>{var o={...e},n=[];for(let c in e)e[c]instanceof Promise&&n.push(e[c].then(i=>o[c]=i));Promise.all(n).then(()=>r(o)).catch(t)}),"props"),N=p((...e)=>(Array.isArray(e[0])&&(e=e[0]),B(e),new Promise((r,t)=>{var o=0;e.forEach(n=>n.then(c=>{o++,o===e.length&&r(c)},c=>{o++,o===e.length&&t(c)}))})),"last");var u=p((e,r,t,o)=>{a(e),s(r,"limit");var n=0,c=p((i,f,m,x)=>{n++,o(i,f)?n===r?x("max attempts reached"):setTimeout(()=>e(l=>c(l,!1,m,x),l=>c(l,!0,m,x)),t(n)):m(i)},"handle");return new Promise((i,f)=>e(m=>c(m,!1,i,f),m=>c(m,!0,i,f)))},"handle"),D=p((e,r,t=0,o=()=>!0)=>(s(t,"delay"),u(e,r,()=>t,o)),"retry"),L=p((e,r,t,o,n=()=>!0)=>(s(t,"initDelay"),s(o,"delayMultiplier"),u(e,r,c=>t+c*o,n)),"retryLinearBackoff"),S=p((e,r,t,o=()=>!0)=>(s(t,"delayMultiplier"),u(e,r,n=>(1<<n)*t,o)),"retryExponentialBackoff"),q=p((e,r,t,o=()=>!0)=>(a(t,"delayFn"),u(e,r,t,o)),"retryDelayFn");var C=p(()=>Object.assign(Promise.prototype,{$catchOfType(e,r){return y(this,e,r)},$tap(e){return w(this,e)}}),"extendNative"),ae={catchOfType:y,tap:w,delay:P,extracted:k,cancelable:d,promisify:E,map:g,mapSeries:A,filter:$,reduce:I,each:T,some:O,props:F,last:N,retry:D,retryLinearBackoff:L,retryExponentialBackoff:S,retryDelayFn:q,extendNative:C};export{d as cancelable,y as catchOfType,ae as default,P as delay,T as each,C as extendNative,k as extracted,$ as filter,N as last,g as map,A as mapSeries,E as promisify,F as props,I as reduce,D as retry,q as retryDelayFn,S as retryExponentialBackoff,L as retryLinearBackoff,O as some,w as tap};