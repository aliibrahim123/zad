var n=Object.defineProperty;var r=(e,t)=>n(e,"name",{value:t,configurable:!0});var p=r((e=!1,t,o)=>e===!1?"\x1B["+t+"m":"\x1B["+t+"m"+e+"\x1B["+o+"m","format");var a=r((e=!1)=>p(e,31,39),"red"),l=r((e=!1)=>p(e,32,39),"green");var x=r(e=>{console.clear(),console.log(`running test:
    total: ${e.total}, started: ${e.started}, executed: ${e.executed},
    ${l("passed: "+e.passed)}, ${a("failed: "+e.failed)}`)},"onPatch"),f=r(e=>{console.clear(),console.log(`results:
    total: ${e.total}, ${l("passed: "+e.passed)}, ${a("failed: "+e.failed)}

errors:
${e.errors.map(({error:t,test:o})=>"    at "+o.path+": "+a(t.name+": "+t.message)).join(`
`)}`)},"onComplete"),s=r(e=>(e.onPatch=x,e.onComplete=f,e),"consoleLogger"),$=s;globalThis.$test&&($test.consoleLogger=s);export{$ as default};
