var n=Object.defineProperty;var a=Object.getOwnPropertySymbols;var l=Object.prototype.hasOwnProperty,c=Object.prototype.propertyIsEnumerable;var s=(r,t,o)=>t in r?n(r,t,{enumerable:!0,configurable:!0,writable:!0,value:o}):r[t]=o,i=(r,t)=>{for(var o in t||(t={}))l.call(t,o)&&s(r,o,t[o]);if(a)for(var o of a(t))c.call(t,o)&&s(r,o,t[o]);return r};import{_ as u,J as _,bJ as d,bz as f,r as x,p as k,F as M,L as g}from"./index.4bd8ab7e.js";import{E as D}from"./export-detail-modal.2aae70ad.js";import"./QSpace.196a214e.js";import"./QSelect.2521a28c.js";import"./QMenu.d60d439b.js";import"./position-engine.e365a736.js";import"./selection.cdf30163.js";import"./QItemLabel.0748896a.js";import"./rtl.4b414a6d.js";import"./QForm.8a0c543d.js";import"./ClosePopup.34597da2.js";import"./useFormat.349e799c.js";import"./useI18n.96209f4d.js";import"./axiosClient.ad61c203.js";import"./queryKeys.832af9fa.js";import"./date.525ad423.js";const b=_({setup(r){const t=d(),o=f(),p=x(null);k(()=>{var e;(e=p.value)==null||e.open(Number(o.params.stockSn.toString()))});const m=()=>t.replace({path:"/settings/stock/export",query:i({},o.query)});return(e,v)=>(M(),g(D,{ref_key:"exportDetailModal",ref:p,onHide:m},null,512))}});var A=u(b,[["__file","D:/project_learn/goPMS/src/modules/stock/export/pages/detail.vue"]]);export{A as default};
