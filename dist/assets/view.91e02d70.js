import{Q as te}from"./QSelect.2521a28c.js";import{Q as se}from"./QDate.20311372.js";import{Q as oe}from"./QPopupProxy.0d4ba934.js";import{aE as ae,_ as le,J as ie,r as b,a as I,K as ne,F as g,L as Y,M as o,I as e,R as n,P as t,N as a,aQ as L,T as re,bq as ce,G as R,O as S,W as E,V as O,U as j,aP as U,aH as q,aO as Q}from"./index.4bd8ab7e.js";import{a as de}from"./QMenu.d60d439b.js";import{Q as me}from"./QInnerLoading.36fa411b.js";import{a as D}from"./selection.cdf30163.js";import{Q as V}from"./QExpansionItem.e87902a2.js";import{Q as ue}from"./QList.550b5ccf.js";import{d as x}from"./date.525ad423.js";import{f as T}from"./useFormat.349e799c.js";import{b as _e,d}from"./axiosClient.ad61c203.js";import{Q as pe}from"./queryKeys.832af9fa.js";import{u as he}from"./useI18n.96209f4d.js";import"./QItemLabel.0748896a.js";import"./rtl.4b414a6d.js";import"./use-cache.b0833c75.js";import"./position-engine.e365a736.js";import"./QSlideTransition.a9dd61c4.js";const A=x.formatDate(new Date,"DD/MM/YYYY"),$=(m=A)=>{const[l,r,v]=m.split("/");return`${v}/${r}/${l}`},fe=async m=>{const{data:l}=await _e.get(`/report/getCashProfitReportList?dateFrom=${Number(x.formatDate($(m.startTime.value?m.startTime.value:A),"X"))}&dateTo=${Number(x.formatDate($(m.endTime.value),"X"))}`);return l.data},ge=m=>ae([pe.SHIFT_HANDOVER_REPORT,{params:m}],()=>fe(m));const ve={class:"row q-mb-md"},De={class:"text-h5 text-bold"},ye={class:"row q-mb-lg q-gutter-md"},we={class:"col col-md-4 col-lg-2 col-sm-6 col-xs-12"},be={class:"col col-md-4 col-lg-3 col-sm-6 col-xs-12"},Te={class:"self-center full-width no-outline",tabindex:"0"},Re={class:"relative-position"},qe={lass:"full-width","full-height":"",class:"q-mt-md row justify-center"},Qe={key:0},xe={class:"q-gutter-sm custom-content"},ke={class:"row justify-center q-mt-none q-ml-none style-border-header"},Pe={class:"col-md-9 col-sm-6 col-xs-6"},Ye={class:"q-mb-none q-pa-md q-pl-lg text-bold"},Ve={class:"col-md-3 col-sm-6 col-xs-6"},Ne={class:"q-mb-none q-pa-md custom-padding-right q-mr-md float-right text-bold"},Ce={key:0,class:"q-ma-none q-pa-none"},Fe={class:"q-py-sm"},Me={class:"row items-center"},Ie={class:"custom-padding-right style-color"},Le={class:"row justify-between"},Se={class:"col-8 custom-section-left"},Ee={class:"col-4 custom-section-right"},Oe={class:"q-py-sm"},je={class:"row items-center"},Ue={class:"custom-padding-right style-color"},$e={class:"row justify-between"},Ae={class:"col-8 custom-section-left"},Be={class:"col-4 custom-section-right"},He={class:"q-py-sm"},ze={class:"row items-center"},Ke={class:"custom-padding-right style-color"},We=ie({setup(m){const{t:l}=he(),r=x.formatDate,v=b(null),B=I(()=>[{key:l("today"),id:1},{key:l("this_week"),id:2},{key:l("this_month"),id:3},{key:l("this_year"),id:4}]);let y=b(1),i=new Date,u=b(r(Date.now(),d)),_=b(r(Date.now(),d)),H=b({currentPage:1,lastPage:1}),{data:p,isLoading:N,refetch:z}=ge({page:H,startTime:u,endTime:_});const K=()=>{v==null||v.value.show(),z.value()},w=I({get:()=>({from:u.value,to:_.value}),set:s=>{typeof s=="object"?(u.value=s==null?void 0:s.from,_.value=s==null?void 0:s.to):(u.value=s,_.value=s)}}),W=()=>{const s=new Date;var h=new Date(s.setDate(s.getDate()-s.getDay()+1)),k=new Date(s.setDate(s.getDate()-s.getDay()+7));u.value=r(h,d),_.value=r(k,d)},X=()=>{i.getDate()>1?(_.value=r(new Date(i.getFullYear(),i.getMonth()+1,0),d),i.setDate(1),u.value=r(new Date(i.getFullYear(),i.getMonth(),i.getDate()),d)):i.getDate()===1&&(_.value=r(new Date(i.getFullYear(),i.getMonth()+1,0),d),i.setDate(1),u.value=r(new Date(i.getFullYear(),i.getMonth()-1,i.getDate()),d))},G=()=>{u.value=r(new Date(i.getFullYear()-1,12,1),d),_.value=r(new Date(new Date().getFullYear(),11,31),d)},J=s=>{s===1?(u.value=r(Date.now(),d),_.value=r(Date.now(),d)):s===2?W():s===3?X():s===4&&G()},Z=()=>{y.value=null},ee=s=>{if(!s)return;switch(s.replace(/\s/g,"")){case"Roomsale-Deposit":return"sale_deposit";case"Roomsale":return"room_sale";case"Retail":return"retail";default:return s}};return(s,h)=>{const k=ne("pms-sections");return g(),Y(k,null,{header:o(()=>[e("div",ve,[e("div",De,n(t(l)("cash_profit_report")),1)]),e("div",ye,[e("div",we,[a(te,{modelValue:t(y),"onUpdate:modelValue":[h[0]||(h[0]=f=>L(y)?y.value=f:y=f),J],name:"accepted_genres",options:t(B),filled:"",dense:"",label:t(l)("select_time_range"),"emit-value":"","map-options":"","input-debounce":"0",behavior:"menu","option-value":"id","option-label":"key"},null,8,["modelValue","options","label"])]),e("div",be,[a(de,{placeholder:t(l)("select_date_time"),dense:"","stack-label":"",style:{width:"100%"},filled:"",class:"q-mr-md inline-block",mask:"date",onFocus:K},{control:o(()=>[e("div",Te,n(t(w).from)+" - "+n(t(w).to),1)]),prepend:o(()=>[a(re,{name:"event",class:"no-pointer-events"},{default:o(()=>[a(oe,{ref_key:"qDateRef",ref:v,"transition-show":"scale","transition-hide":"scale"},{default:o(()=>[a(se,{modelValue:t(w),"onUpdate:modelValue":h[1]||(h[1]=f=>L(w)?w.value=f:null),mask:"DD/MM/YYYY",range:"",onRangeStart:Z},null,8,["modelValue"])]),_:1},512)]),_:1})]),_:1},8,["placeholder"])])])]),default:o(()=>[e("div",Re,[a(me,{showing:t(N),label:"Please","label-class":"text-teal","label-style":"font-size:1.1em"},{default:o(()=>[e("div",qe,[a(ce,{color:"negative",thickness:2,size:"2em"})])]),_:1},8,["showing"]),t(N)?j("v-if",!0):(g(),R("div",Qe,[e("div",xe,[e("div",ke,[e("div",Pe,[e("p",Ye,n(t(l)("description")),1)]),e("div",Ve,[e("p",Ne,n(t(l)("amount")),1)])]),t(p)?(g(),R("div",Ce,[a(ue,{bordered:"",class:"style-scroll-product q-pa-none"},{default:o(()=>{var f,C,F,M;return[a(V,{"switch-toggle-side":"","expand-separator":"",class:S(["custom-icon",((C=(f=t(p))==null?void 0:f.cashReceiptList)==null?void 0:C.length)>0?"":"disable-icon"])},{header:o(()=>[a(D,null,{default:o(()=>[e("div",Fe,"1. "+n(t(l)("cash_receipt")),1)]),_:1}),a(D,{side:""},{default:o(()=>{var c;return[e("div",Me,[e("div",Ie,n(t(T)((c=t(p))==null?void 0:c.totalCashReceipt))+" VND ",1)])]}),_:1})]),default:o(()=>[(g(!0),R(E,null,O(t(p).cashReceiptList,(c,P)=>(g(),Y(U,{key:P},{default:o(()=>[e("div",Le,[e("div",Se,[a(q,{class:"q-pr-lg"},{default:o(()=>[Q(n(t(l)(`${ee(c.cashieringReceiptTypeName)}`)),1)]),_:2},1024)]),e("div",Ee,[a(q,{class:"float-right custom-padding-right q-mr-md"},{default:o(()=>[Q(n(t(T)(c.cashieringReceiptTypeTotalPrice))+" VND",1)]),_:2},1024)])])]),_:2},1024))),128))]),_:1},8,["class"]),a(V,{"switch-toggle-side":"","expand-separator":"",class:S(["custom-icon",((M=(F=t(p))==null?void 0:F.cashPaymentList)==null?void 0:M.length)>0?"":"disable-icon"])},{header:o(()=>[a(D,null,{default:o(()=>[e("div",Oe,"2. "+n(t(l)("cash_payment")),1)]),_:1}),a(D,{side:""},{default:o(()=>{var c;return[e("div",je,[e("div",Ue,n(t(T)((c=t(p))==null?void 0:c.totalCashPayment))+" VND ",1)])]}),_:1})]),default:o(()=>[(g(!0),R(E,null,O(t(p).cashPaymentList,(c,P)=>(g(),Y(U,{key:P},{default:o(()=>[e("div",$e,[e("div",Ae,[a(q,{class:"q-pr-lg"},{default:o(()=>[Q(n(c.cashieringReceiptTypeName),1)]),_:2},1024)]),e("div",Be,[a(q,{class:"float-right custom-padding-right q-mr-md"},{default:o(()=>[Q(n(t(T)(c.cashieringReceiptTypeTotalPrice))+" VND",1)]),_:2},1024)])])]),_:2},1024))),128))]),_:1},8,["class"]),a(V,{"switch-toggle-side":"","expand-separator":"",class:"custom-icon disable-icon"},{header:o(()=>[a(D,null,{default:o(()=>[e("div",He,"3. "+n(t(l)("profit"))+" (1-2)",1)]),_:1}),a(D,{side:""},{default:o(()=>{var c;return[e("div",ze,[e("div",Ke,n(t(T)((c=t(p))==null?void 0:c.profit))+" VND ",1)])]}),_:1})]),_:1})]}),_:1})])):j("v-if",!0)])]))])]),_:1})}}});var ht=le(We,[["__scopeId","data-v-770fdb37"],["__file","D:/project_learn/goPMS/src/modules/report/cash-profit-report/view.vue"]]);export{ht as default};
