var f=Object.defineProperty;var s=(e,t)=>f(e,"name",{value:t,configurable:!0});var o=s((e,t="fn")=>{if(typeof e!="function")throw new TypeError(`timing: ${t} of type (${e?.constructor?.name}), expected (Function)`)},"checkfn"),h=s((e,t)=>{if(typeof e!="number")throw new TypeError(`timing: ${t} of type (${e?.constructor?.name}), expected (Number)`);if(!Number.isInteger(e)||e<=0)throw new TypeError(`timing: ${t} is (${e}), expected positive integer`)},"checkpInt");var a=class{constructor(t,r=!0,i=!1){h(t,"interval"),i!==!1&&h(i,"limit"),this._interval=t,this.tickcount=0,this.limit=i,this.isStopped=!r,this.handlers=[],r&&this.start()}get interval(){return this._interval}set interval(t){this._interval=t,this.isStopped||this.restart()}start(){if(this.tickcount!==this.limit)return this.isStopped=!1,this.id=setInterval(this.handle.bind(this),this._interval),this}stop(){return this.isStopped=!0,clearInterval(this.id),this}restart(){return this.stop(),this.start(),this}clear(t=!0){return this.tickcount=0,this.stop(),t&&this.start(),this}delay(t){return h(t,"delay"),this.isStopped?this:(this.stop(),setTimeout(this.start.bind(this),t),this)}handle(){this.tickcount++,this.handlers.forEach(t=>t(this.tickcount)),this.limit===this.tickcount&&this.stop()}addHandler(t){return o(t,"handler"),this.handlers.push(t),this}removeHandler(t){return o(t,"handler"),this.handlers=this.handlers.filter(r=>r!==t),this}nextTick(t=1){h(t,"count");var r=this.tickcount;return new Promise(i=>{var c=s(n=>{n-r===t&&(i(n),this.removeHandler(c))},"handler");this.addHandler(c)})}};s(a,"Ticker");var u=s((e,t,r)=>new a(e,t,r),"ticker");var p=s((e,t)=>(o(e),h(t,"delay"),(...r)=>setTimeout(e,t,...r)),"delay"),l=s((e,t)=>{o(e),h(t,"delay");var r=0;return(...i)=>{clearTimeout(r),r=setTimeout(e,t,...i)}},"debounce"),d=s((e,t)=>{o(e),h(t,"delay");var r=0,i=0;return(...c)=>{var n=Date.now();if(n-i>=t){i=n,e(...c);return}clearTimeout(r),r=setTimeout(()=>{i=n,e(...c)},t-(n-i))}},"throttle"),m=s(e=>{o(e),setTimeout(e,0)},"defer");var H={ticker:u,Ticker:a,delay:p,debounce:l,throttle:d,defer:m};export{a as Ticker,l as debounce,H as default,m as defer,p as delay,d as throttle,u as ticker};