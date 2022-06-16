var ce=Object.defineProperty,ge=Object.defineProperties;var ve=Object.getOwnPropertyDescriptors;var Y=Object.getOwnPropertySymbols;var fe=Object.prototype.hasOwnProperty,_e=Object.prototype.propertyIsEnumerable;var J=(n,a,t)=>a in n?ce(n,a,{enumerable:!0,configurable:!0,writable:!0,value:t}):n[a]=t,Q=(n,a)=>{for(var t in a||(a={}))fe.call(a,t)&&J(n,t,a[t]);if(Y)for(var t of Y(a))_e.call(a,t)&&J(n,t,a[t]);return n},T=(n,a)=>ge(n,ve(a));import{Q as F,a as H,b as pe}from"./QTabPanels.ffcab7b1.js";import{Q as be}from"./QTabs.85589f95.js";import{Q as U,a as q,c as k,b as S}from"./QTable.4cc8e1c9.js";import{Q as E}from"./QPagination.a48c1bef.js";import{av as R,_ as ke,J as he,r as N,p as ye,D as we,a as w,w as xe,K as W,F as c,L as f,M as o,at as De,I as h,N as l,P as g,U as X,G as j,V as C,W as K,aF as _,R as p,bo as O}from"./index.7efcbe86.js";import{Q as P}from"./QInnerLoading.5fef3982.js";import{b as $,c as Z}from"./axiosClient.a0ee23b9.js";import{Q as M}from"./queryKeys.832af9fa.js";import{d as Ne}from"./date.2d51ed98.js";import{u as Qe}from"./useI18n.6b7b36de.js";import"./touch.70a9dd44.js";import"./selection.6afffe69.js";import"./use-cache.b0833c75.js";import"./QResizeObserver.315a2c46.js";import"./rtl.4b414a6d.js";import"./QList.e5651779.js";import"./QSelect.8edab530.js";import"./QMenu.b19dfcca.js";import"./position-engine.4a23d733.js";import"./QItemLabel.938a9258.js";const Te=async({queryKey:n})=>{const[,a,t]=n,d={page:a,limit:t},{data:v}=await $.get("dashboard/getBookingArrivalList",{params:d});return v.data},Be=(n,a,t)=>{const d=[M.BOOKING_ARRIVALS,n,a];return R(d,Te,{enabled:t,select:v=>v})},Ie=async({queryKey:n})=>{const[,a,t]=n,d={page:a,limit:t},{data:v}=await $.get("dashboard/getBookingDepartureList",{params:d});return v.data},Ve=(n,a,t)=>{const d=[M.BOOKING_DEPARTURE,n,a];return R(d,Ie,{enabled:t,select:v=>v})},Ae=async({queryKey:n})=>{const[,a,t]=n,d={page:a,limit:t},{data:v}=await $.get("dashboard/getBookingInHouseGuestList",{params:d});return v.data},Ge=(n,a,t)=>{const d=[M.BOOKING_IN_HOUSE_GUEST,n,a];return R(d,Ae,{enabled:t,select:v=>v})};const Le={class:"row justify-center q-mb-md"},Fe={class:"q-mt-md row justify-end"},He={lass:"full-width full-height q-mt-md row justify-center"},Ue={class:"q-mt-md row justify-end"},qe={lass:"full-width full-height q-mt-md row justify-center"},Se={class:"q-mt-md row justify-end"},Ee={lass:"full-width full-height q-mt-md row justify-center"},je=he({setup(n){const{t:a}=Qe(),t=N("arrival"),d=10,v=N(new Date);ye(()=>{B(!1)}),we(()=>{B(!0)});const B=s=>{s||setTimeout(()=>{v.value=new Date,B(!1)},6e4)},{formatDate:z}=Ne,x=N(1),I=N(1),D=N(1),ee=w(()=>t.value==="arrival"),ae=w(()=>t.value==="departure"),te=w(()=>t.value==="inHouseGuest"),{data:V,isFetching:oe,refetch:le}=Be(x,d,ee),{data:A,isFetching:ne,refetch:se}=Ve(I,d,ae),{data:G,isFetching:ie,refetch:re}=Ge(D,d,te),ue=w(()=>{var i,m;if(!((i=V.value)!=null&&i.bookingList))return[];let s=[];return s=s==null?void 0:s.concat((m=V.value)==null?void 0:m.bookingList.map((y,r)=>T(Q({},y),{index:r+x.value}))),s}),me=w(()=>{var i,m;if(!((i=G.value)!=null&&i.bookingList))return[];let s=[];return s=s==null?void 0:s.concat((m=G.value)==null?void 0:m.bookingList.map((y,r)=>T(Q({},y),{index:D.value<2?r+1:`${D.value-1}${r+1}`}))),s}),de=w(()=>{var i,m;if(!((i=A.value)!=null&&i.bookingList))return[];let s=[];return s=s==null?void 0:s.concat((m=A.value)==null?void 0:m.bookingList.map((y,r)=>T(Q({},y),{index:r+x.value}))),s});xe(()=>De.global.locale.value,()=>{le.value(),se.value(),re.value()});const L=w(()=>{const s=t.value==="arrival"?"arrival_date_time":"actual_checked_in_date_time",i=t.value==="arrival"?"arrivalDatetime":"actualCheckIn";return[{name:"index",label:a("no"),field:"index",align:"center"},{name:"roomName",required:!0,label:a("room"),align:"left",field:"roomName"},{name:"bookingNo",align:"left",label:a("booking_no"),field:"bookingNo",style:"color: #C2410C"},{name:"guestName",align:"left",label:a("guest_name"),field:"guestName"},{name:i,align:"left",label:a(s),field:i,format:m=>`${z(Number(m*1e3),Z)}`},{name:"departureDatetime",align:"left",label:a("departure_date_time"),field:"departureDatetime",format:m=>`${z(Number(m*1e3),Z)}`},{name:"timeToStay",align:"left",label:a("time_to_stay"),field:"timeToStay"}]});return(s,i)=>{const m=W("router-link"),y=W("pms-sections");return c(),f(y,null,{default:o(()=>[h("div",Le,[l(be,{modelValue:t.value,"onUpdate:modelValue":i[0]||(i[0]=r=>t.value=r),dense:"","active-color":"white",align:"justify","indicator-color":"transparent",class:"box-shadow-tabs col-xs-11 col-md-6 col-lg-4 col-sm-02 row","active-bg-color":"negative"},{default:o(()=>[l(F,{name:"arrival",label:g(a)("arrival"),class:"col custom-tab","no-caps":""},null,8,["label"]),l(F,{name:"departure",label:g(a)("departure"),class:"col custom-tab","no-caps":""},null,8,["label"]),l(F,{name:"inHouseGuest",label:g(a)("inhouse_guest"),class:"col custom-tab","no-caps":""},null,8,["label"])]),_:1},8,["modelValue"])]),h("div",null,[l(pe,{modelValue:t.value,"onUpdate:modelValue":i[4]||(i[4]=r=>t.value=r)},{default:o(()=>[X(" arrival "),l(H,{name:"arrival"},{default:o(()=>{var r,b;return[l(U,{"table-header-class":"custom-header","row-key":"roomName",rows:g(ue),columns:g(L),"hide-pagination":"","no-data-label":"No data","rows-per-page-options":[0],"hide-bottom":""},{header:o(e=>[l(q,{props:e},{default:o(()=>[(c(!0),j(K,null,C(e.cols,u=>(c(),f(S,{key:u.name,props:e},{default:o(()=>[_(p(u.label),1)]),_:2},1032,["props"]))),128))]),_:2},1032,["props"])]),"body-cell":o(e=>[e.col.name==="bookingNo"?(c(),f(k,{key:0},{default:o(()=>{var u;return[l(m,{style:{"text-decoration":"none"},class:"custom-link text-negative",to:{name:"BookingDetails",params:{sn:(u=e.row)==null?void 0:u.sn}}},{default:o(()=>[_(p(e.value),1)]),_:2},1032,["to"])]}),_:2},1024)):(c(),f(k,{key:1,props:e},{default:o(()=>[_(p(e.value),1)]),_:2},1032,["props"]))]),_:1},8,["rows","columns"]),h("div",Fe,[l(E,{modelValue:x.value,"onUpdate:modelValue":i[1]||(i[1]=e=>x.value=e),color:"negative",max:((b=(r=g(V))==null?void 0:r.meta)==null?void 0:b.lastPage)||1,"max-pages":5,"boundary-numbers":"","direction-links":"",push:""},null,8,["modelValue","max"])]),l(P,{showing:g(oe),style:{height:"500px"}},{default:o(()=>[h("div",He,[l(O,{color:"negative",thickness:2,size:"2em"})])]),_:1},8,["showing"])]}),_:1}),X(" departure "),l(H,{name:"departure"},{default:o(()=>{var r,b;return[l(U,{"row-key":"roomName",rows:g(de),columns:g(L),"no-data-label":"No data","hide-pagination":"","rows-per-page-options":[0],"hide-bottom":""},{header:o(e=>[l(q,{props:e},{default:o(()=>[(c(!0),j(K,null,C(e.cols,u=>(c(),f(S,{key:u.name,props:e},{default:o(()=>[_(p(u.label),1)]),_:2},1032,["props"]))),128))]),_:2},1032,["props"])]),"body-cell":o(e=>[e.col.name==="bookingNo"?(c(),f(k,{key:0},{default:o(()=>{var u;return[l(m,{style:{"text-decoration":"none"},class:"custom-link text-negative",to:{name:"BookingDetails",params:{sn:(u=e.row)==null?void 0:u.sn}}},{default:o(()=>[_(p(e.value),1)]),_:2},1032,["to"])]}),_:2},1024)):e.col.name==="timeToStay"&&t.value!=="arrival"?(c(),f(k,{key:1},{default:o(()=>[_(p(e.row.timeToStay),1)]),_:2},1024)):(c(),f(k,{key:2,props:e},{default:o(()=>[_(p(e.value),1)]),_:2},1032,["props"]))]),_:1},8,["rows","columns"]),h("div",Ue,[l(E,{modelValue:I.value,"onUpdate:modelValue":i[2]||(i[2]=e=>I.value=e),color:"negative",max:((b=(r=g(A))==null?void 0:r.meta)==null?void 0:b.lastPage)||1,"max-pages":5,"boundary-numbers":"","direction-links":"",push:""},null,8,["modelValue","max"])]),l(P,{showing:g(ne),style:{height:"500px"}},{default:o(()=>[h("div",qe,[l(O,{color:"negative",thickness:2,size:"2em"})])]),_:1},8,["showing"])]}),_:1}),l(H,{name:"inHouseGuest"},{default:o(()=>{var r,b;return[l(U,{"row-key":"roomName",rows:g(me),columns:g(L),"hide-pagination":"","rows-per-page-options":[0],"hide-bottom":""},{header:o(e=>[l(q,{props:e},{default:o(()=>[(c(!0),j(K,null,C(e.cols,u=>(c(),f(S,{key:u.name,props:e},{default:o(()=>[_(p(u.label),1)]),_:2},1032,["props"]))),128))]),_:2},1032,["props"])]),"body-cell":o(e=>[e.col.name==="bookingNo"?(c(),f(k,{key:0},{default:o(()=>{var u;return[l(m,{style:{"text-decoration":"none"},class:"custom-link text-negative",to:{name:"BookingDetails",params:{sn:(u=e.row)==null?void 0:u.sn}}},{default:o(()=>[_(p(e.value),1)]),_:2},1032,["to"])]}),_:2},1024)):e.col.name==="timeToStay"&&t.value!=="arrival"?(c(),f(k,{key:1},{default:o(()=>[_(p(e.row.timeToStay),1)]),_:2},1024)):(c(),f(k,{key:2,props:e},{default:o(()=>[_(p(e.value),1)]),_:2},1032,["props"]))]),_:1},8,["rows","columns"]),h("div",Se,[l(E,{modelValue:D.value,"onUpdate:modelValue":i[3]||(i[3]=e=>D.value=e),color:"negative","no-data-label":"No data",max:((b=(r=g(G))==null?void 0:r.meta)==null?void 0:b.lastPage)||1,"max-pages":5,"boundary-numbers":"","direction-links":"",push:""},null,8,["modelValue","max"])]),l(P,{showing:g(ie),style:{height:"500px"}},{default:o(()=>[h("div",Ee,[l(O,{color:"negative",thickness:2,size:"2em"})])]),_:1},8,["showing"])]}),_:1})]),_:1},8,["modelValue"])])]),_:1})}}});var ra=ke(je,[["__scopeId","data-v-52731295"],["__file","D:/gopms-web/src/modules/homepage/view.vue"]]);export{ra as default};
