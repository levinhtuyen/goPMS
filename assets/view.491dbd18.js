import{Q as te}from"./QSelect.8edab530.js";import{Q as se}from"./QDate.804040fd.js";import{Q as oe}from"./QPopupProxy.9996c4ad.js";import{av as ae,_ as le,J as ie,r as b,a as I,K as ne,F as g,L as Y,M as o,I as e,R as n,P as t,N as a,aH as L,T as re,bo as ce,G as R,O as S,W as E,V as O,U,aG as $,ay as q,aF as Q}from"./index.7efcbe86.js";import{a as de}from"./QMenu.b19dfcca.js";import{Q as me}from"./QInnerLoading.5fef3982.js";import{a as D}from"./selection.6afffe69.js";import{Q as V}from"./QExpansionItem.202b51f4.js";import{Q as ue}from"./QList.e5651779.js";import{d as x}from"./date.2d51ed98.js";import{f as T}from"./useFormat.349e799c.js";import{b as _e,d}from"./axiosClient.a0ee23b9.js";import{Q as pe}from"./queryKeys.832af9fa.js";import{u as he}from"./useI18n.6b7b36de.js";import"./QItemLabel.938a9258.js";import"./rtl.4b414a6d.js";import"./use-cache.b0833c75.js";import"./position-engine.4a23d733.js";import"./QSlideTransition.02723b71.js";const A=x.formatDate(new Date,"DD/MM/YYYY"),j=(m=A)=>{const[l,r,v]=m.split("/");return`${v}/${r}/${l}`},fe=async m=>{const{data:l}=await _e.get(`/report/getCashProfitReportList?dateFrom=${Number(x.formatDate(j(m.startTime.value?m.startTime.value:A),"X"))}&dateTo=${Number(x.formatDate(j(m.endTime.value),"X"))}`);return l.data},ge=m=>ae([pe.SHIFT_HANDOVER_REPORT,{params:m}],()=>fe(m));const ve={class:"row q-mb-md"},De={class:"text-h5 text-bold"},ye={class:"row q-mb-lg q-gutter-md"},we={class:"col col-md-4 col-lg-2 col-sm-6 col-xs-12"},be={class:"col col-md-4 col-lg-3 col-sm-6 col-xs-12"},Te={class:"self-center full-width no-outline",tabindex:"0"},Re={class:"relative-position"},qe={lass:"full-width","full-height":"",class:"q-mt-md row justify-center"},Qe={key:0},xe={class:"q-gutter-sm custom-content"},ke={class:"row justify-center q-mt-none q-ml-none style-border-header"},Pe={class:"col-md-9 col-sm-6 col-xs-6"},Ye={class:"q-mb-none q-pa-md q-pl-lg text-bold"},Ve={class:"col-md-3 col-sm-6 col-xs-6"},Ne={class:"q-mb-none q-pa-md custom-padding-right q-mr-md float-right text-bold"},Fe={key:0,class:"q-ma-none q-pa-none"},Ce={class:"q-py-sm"},Me={class:"row items-center"},Ie={class:"custom-padding-right style-color"},Le={class:"row justify-between"},Se={class:"col-8 custom-section-left"},Ee={class:"col-4 custom-section-right"},Oe={class:"q-py-sm"},Ue={class:"row items-center"},$e={class:"custom-padding-right style-color"},je={class:"row justify-between"},Ae={class:"col-8 custom-section-left"},Be={class:"col-4 custom-section-right"},He={class:"q-py-sm"},ze={class:"row items-center"},Ge={class:"custom-padding-right style-color"},Ke=ie({setup(m){const{t:l}=he(),r=x.formatDate,v=b(null),B=I(()=>[{key:l("today"),id:1},{key:l("this_week"),id:2},{key:l("this_month"),id:3},{key:l("this_year"),id:4}]);let y=b(1),i=new Date,u=b(r(Date.now(),d)),_=b(r(Date.now(),d)),H=b({currentPage:1,lastPage:1}),{data:p,isLoading:N,refetch:z}=ge({page:H,startTime:u,endTime:_});const G=()=>{v==null||v.value.show(),z.value()},w=I({get:()=>({from:u.value,to:_.value}),set:s=>{typeof s=="object"?(u.value=s==null?void 0:s.from,_.value=s==null?void 0:s.to):(u.value=s,_.value=s)}}),K=()=>{const s=new Date;var h=new Date(s.setDate(s.getDate()-s.getDay()+1)),k=new Date(s.setDate(s.getDate()-s.getDay()+7));u.value=r(h,d),_.value=r(k,d)},W=()=>{i.getDate()>1?(_.value=r(new Date(i.getFullYear(),i.getMonth()+1,0),d),i.setDate(1),u.value=r(new Date(i.getFullYear(),i.getMonth(),i.getDate()),d)):i.getDate()===1&&(_.value=r(new Date(i.getFullYear(),i.getMonth()+1,0),d),i.setDate(1),u.value=r(new Date(i.getFullYear(),i.getMonth()-1,i.getDate()),d))},X=()=>{u.value=r(new Date(i.getFullYear()-1,12,1),d),_.value=r(new Date(new Date().getFullYear(),11,31),d)},J=s=>{s===1?(u.value=r(Date.now(),d),_.value=r(Date.now(),d)):s===2?K():s===3?W():s===4&&X()},Z=()=>{y.value=null},ee=s=>{if(!s)return;switch(s.replace(/\s/g,"")){case"Roomsale-Deposit":return"sale_deposit";case"Roomsale":return"room_sale";case"Retail":return"retail";default:return s}};return(s,h)=>{const k=ne("pms-sections");return g(),Y(k,null,{header:o(()=>[e("div",ve,[e("div",De,n(t(l)("cash_profit_report")),1)]),e("div",ye,[e("div",we,[a(te,{modelValue:t(y),"onUpdate:modelValue":[h[0]||(h[0]=f=>L(y)?y.value=f:y=f),J],name:"accepted_genres",options:t(B),filled:"",dense:"",label:t(l)("select_time_range"),"emit-value":"","map-options":"","input-debounce":"0",behavior:"menu","option-value":"id","option-label":"key"},null,8,["modelValue","options","label"])]),e("div",be,[a(de,{placeholder:t(l)("select_date_time"),dense:"","stack-label":"",style:{width:"100%"},filled:"",class:"q-mr-md inline-block",mask:"date",onFocus:G},{control:o(()=>[e("div",Te,n(t(w).from)+" - "+n(t(w).to),1)]),prepend:o(()=>[a(re,{name:"event",class:"no-pointer-events"},{default:o(()=>[a(oe,{ref_key:"qDateRef",ref:v,"transition-show":"scale","transition-hide":"scale"},{default:o(()=>[a(se,{modelValue:t(w),"onUpdate:modelValue":h[1]||(h[1]=f=>L(w)?w.value=f:null),mask:"DD/MM/YYYY",range:"",onRangeStart:Z},null,8,["modelValue"])]),_:1},512)]),_:1})]),_:1},8,["placeholder"])])])]),default:o(()=>[e("div",Re,[a(me,{showing:t(N),label:"Please","label-class":"text-teal","label-style":"font-size:1.1em"},{default:o(()=>[e("div",qe,[a(ce,{color:"negative",thickness:2,size:"2em"})])]),_:1},8,["showing"]),t(N)?U("v-if",!0):(g(),R("div",Qe,[e("div",xe,[e("div",ke,[e("div",Pe,[e("p",Ye,n(t(l)("description")),1)]),e("div",Ve,[e("p",Ne,n(t(l)("amount")),1)])]),t(p)?(g(),R("div",Fe,[a(ue,{bordered:"",class:"style-scroll-product q-pa-none"},{default:o(()=>{var f,F,C,M;return[a(V,{"switch-toggle-side":"","expand-separator":"",class:S(["custom-icon",((F=(f=t(p))==null?void 0:f.cashReceiptList)==null?void 0:F.length)>0?"":"disable-icon"])},{header:o(()=>[a(D,null,{default:o(()=>[e("div",Ce,"1. "+n(t(l)("cash_receipt")),1)]),_:1}),a(D,{side:""},{default:o(()=>{var c;return[e("div",Me,[e("div",Ie,n(t(T)((c=t(p))==null?void 0:c.totalCashReceipt))+" VND ",1)])]}),_:1})]),default:o(()=>[(g(!0),R(E,null,O(t(p).cashReceiptList,(c,P)=>(g(),Y($,{key:P},{default:o(()=>[e("div",Le,[e("div",Se,[a(q,{class:"q-pr-lg"},{default:o(()=>[Q(n(t(l)(`${ee(c.cashieringReceiptTypeName)}`)),1)]),_:2},1024)]),e("div",Ee,[a(q,{class:"float-right custom-padding-right q-mr-md"},{default:o(()=>[Q(n(t(T)(c.cashieringReceiptTypeTotalPrice))+" VND",1)]),_:2},1024)])])]),_:2},1024))),128))]),_:1},8,["class"]),a(V,{"switch-toggle-side":"","expand-separator":"",class:S(["custom-icon",((M=(C=t(p))==null?void 0:C.cashPaymentList)==null?void 0:M.length)>0?"":"disable-icon"])},{header:o(()=>[a(D,null,{default:o(()=>[e("div",Oe,"2. "+n(t(l)("cash_payment")),1)]),_:1}),a(D,{side:""},{default:o(()=>{var c;return[e("div",Ue,[e("div",$e,n(t(T)((c=t(p))==null?void 0:c.totalCashPayment))+" VND ",1)])]}),_:1})]),default:o(()=>[(g(!0),R(E,null,O(t(p).cashPaymentList,(c,P)=>(g(),Y($,{key:P},{default:o(()=>[e("div",je,[e("div",Ae,[a(q,{class:"q-pr-lg"},{default:o(()=>[Q(n(c.cashieringReceiptTypeName),1)]),_:2},1024)]),e("div",Be,[a(q,{class:"float-right custom-padding-right q-mr-md"},{default:o(()=>[Q(n(t(T)(c.cashieringReceiptTypeTotalPrice))+" VND",1)]),_:2},1024)])])]),_:2},1024))),128))]),_:1},8,["class"]),a(V,{"switch-toggle-side":"","expand-separator":"",class:"custom-icon disable-icon"},{header:o(()=>[a(D,null,{default:o(()=>[e("div",He,"3. "+n(t(l)("profit"))+" (1-2)",1)]),_:1}),a(D,{side:""},{default:o(()=>{var c;return[e("div",ze,[e("div",Ge,n(t(T)((c=t(p))==null?void 0:c.profit))+" VND ",1)])]}),_:1})]),_:1})]}),_:1})])):U("v-if",!0)])]))])]),_:1})}}});var ht=le(Ke,[["__scopeId","data-v-770fdb37"],["__file","D:/gopms-web/src/modules/report/cash-profit-report/view.vue"]]);export{ht as default};