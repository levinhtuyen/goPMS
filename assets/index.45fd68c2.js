var j=Object.defineProperty;var P=Object.getOwnPropertySymbols;var z=Object.prototype.hasOwnProperty,K=Object.prototype.propertyIsEnumerable;var $=(t,o,n)=>o in t?j(t,o,{enumerable:!0,configurable:!0,writable:!0,value:n}):t[o]=n,q=(t,o)=>{for(var n in o||(o={}))z.call(o,n)&&$(t,n,o[n]);if(P)for(var n of P(o))K.call(o,n)&&$(t,n,o[n]);return t};import{aE as X,_ as J,J as W,r as m,i as G,bz as H,bJ as Z,p as ee,a as te,K as ae,F as y,G as h,I as g,N as r,P as i,M as s,L as V,U as C,W as U,bq as oe,V as ne,aO as d,R as u,Q as re,O as se}from"./index.4bd8ab7e.js";import{Q as ie}from"./QInnerLoading.36fa411b.js";import{Q as le,a as E,c,b as ue}from"./QTable.87be80e4.js";import{Q as ce}from"./QPagination.952d6437.js";import{F as de}from"./filter.e22c1f76.js";import{b as me,u as ye,d as Y}from"./axiosClient.ad61c203.js";import{Q as fe}from"./queryKeys.832af9fa.js";import{d as f}from"./date.525ad423.js";import{u as pe}from"./useI18n.96209f4d.js";import{a as ve}from"./useFormat.349e799c.js";import"./QList.550b5ccf.js";import"./QSelect.2521a28c.js";import"./QMenu.d60d439b.js";import"./position-engine.e365a736.js";import"./selection.cdf30163.js";import"./QItemLabel.0748896a.js";import"./rtl.4b414a6d.js";import"./QDate.20311372.js";import"./use-cache.b0833c75.js";import"./QPopupProxy.0d4ba934.js";import"./useCategoryServiceQuery.1a080013.js";const _e=f.formatDate(new Date,"DD/MM/YYYY"),w=(t=_e)=>{const[o,n,l]=t.split("/");return`${l}/${n}/${o}`},ge=async t=>{var n,l;const{data:o}=await me.get(`/inventory/stock/getStockInventory?page=${(l=(n=t.page)==null?void 0:n.value)==null?void 0:l.currentPage}&categorySn=${t.categorySn.value}&limit=${t.limit}&startTime=${t.startTime.value?Number(f.formatDate(w(t.startTime.value),"X")):Number(f.formatDate(w(t.startWeek.value),"X"))}&endTime=${Number(f.formatDate(w(t.endTime.value),"X"))}`);return o.data},ke=t=>X([fe.STOCK_INVENTORIES,{params:t}],()=>ge(t));const be={lass:"full-width","full-height":"",class:"q-mt-md row justify-center"},he={key:0},we={class:"limit-text"},Qe={class:"row justify-end q-mt-md"},Te=W({setup(t){const o=f.formatDate,{hasPermission:n}=ye(),{t:l}=pe();let p=m({currentPage:1,lastPage:1});const F=G("emitter"),L=H(),Q=Z(),M=m({key:"All receipts",id:0}),T=m("");let v=m(o(Date.now(),Y)),_=m(o(Date.now(),Y));const{data:k,isLoading:b,refetch:O}=ke({startTime:v,endTime:_,categorySn:T,page:p,limit:10});Q.replace({path:"/settings/stock/inventory",query:{startTime:v.value,endTime:_.value}}),ee(()=>{F.on("closeDetailInventory",async()=>{O.value()})});const R=a=>{v.value=a.startTime,_.value=a.endTime,M.value=a.valuereceipts,T.value=a.categorySn,Q.replace({path:"/settings/stock/inventory",query:{startTime:v.value,endTime:_.value}})},A=te(()=>[{name:"no",label:l("no"),field:a=>a.sn},{name:"products",label:l("product",99),field:a=>a.productName},{name:"unit",label:l("unit"),field:a=>a.productUnitName},{name:"startInventory",label:l("start_inventory"),field:a=>a.startInventory},{name:"importQuantity",label:l("import_quantity"),field:a=>a.importQuantity},{name:"exportQuantity",label:l("export_quantity"),field:a=>a.exportQuantity},{name:"lastInventory",label:l("last_inventory"),field:a=>a.lastInventory},{name:"detail",label:"",field:()=>""}]);return(a,x)=>{var I,N,D;const B=ae("router-view");return y(),h(U,null,[g("div",null,[r(de,{"booking-no-field":!1,"is-category":!0,"is-add":!1,onChangeSuccess:R}),r(ie,{showing:i(b),label:"Please","label-class":"text-teal","label-style":"font-size:1.1em"},{default:s(()=>[g("div",be,[r(oe,{color:"negative",thickness:2,size:"2em"})])]),_:1},8,["showing"]),i(b)?C("v-if",!0):(y(),h("div",he,[(I=i(k))!=null&&I.stockInventoryList?(y(),V(le,{key:0,loading:i(b),columns:i(A),rows:(N=i(k))==null?void 0:N.stockInventoryList,"rows-per-page-options":[0],"hide-pagination":"","hide-bottom":"","no-data-label":"No data"},{header:s(e=>[r(E,null,{default:s(()=>[(y(!0),h(U,null,ne(e.cols,S=>(y(),V(ue,{key:S.name,props:e,class:"th"},{default:s(()=>[d(u(S.label),1)]),_:2},1032,["props"]))),128))]),_:2},1024)]),body:s(e=>[r(E,{props:e},{default:s(()=>[r(c,{key:"no",props:e,class:"td"},{default:s(()=>[d(u(i(ve)(i(p).currentPage,e.pageIndex)),1)]),_:2},1032,["props"]),r(c,{key:"products",props:e,class:"td"},{default:s(()=>[g("div",we,u(e.row.productName),1)]),_:2},1032,["props"]),r(c,{key:"unit",props:e,class:"td"},{default:s(()=>[d(u(e.row.productUnitName),1)]),_:2},1032,["props"]),r(c,{key:"startInventory",props:e,class:"td"},{default:s(()=>[d(u(e.row.startInventory),1)]),_:2},1032,["props"]),r(c,{key:"importQuantity",props:e,class:"td"},{default:s(()=>[d(u(e.row.importQuantity),1)]),_:2},1032,["props"]),r(c,{key:"exportQuantity",props:e,class:"td"},{default:s(()=>[d(u(e.row.exportQuantity),1)]),_:2},1032,["props"]),r(c,{key:"lastInventory",props:e,class:"td"},{default:s(()=>[d(u(e.row.lastInventory),1)]),_:2},1032,["props"]),r(c,{key:"detail",props:e,class:"td"},{default:s(()=>[r(re,{class:se(i(n)("import-export-detail")===!1?"hidden":""),icon:"visibility",to:{path:`/settings/stock/inventory/${e.row.sn}`,query:q({},i(L).query),state:{productName:e.row.productName,productUnitName:e.row.productUnitName}},dense:"",round:"",flat:""},null,8,["class","to"])]),_:2},1032,["props"])]),_:2},1032,["props"])]),_:1},8,["loading","columns","rows"])):C("v-if",!0),g("div",Qe,[r(ce,{modelValue:i(p).currentPage,"onUpdate:modelValue":x[0]||(x[0]=e=>i(p).currentPage=e),color:"negative",max:((D=i(k))==null?void 0:D.meta.lastPage)||1,"max-pages":6,"direction-links":""},null,8,["modelValue","max"])])]))]),r(B)],64)}}});var Ke=J(Te,[["__scopeId","data-v-e760cfec"],["__file","D:/project_learn/goPMS/src/modules/stock/inventory/pages/index.vue"]]);export{Ke as default};