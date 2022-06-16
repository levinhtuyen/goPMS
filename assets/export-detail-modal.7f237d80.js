import{av as K,C as A,bK as B,a as N,_ as G,J as Y,r as q,F as v,L as O,M as u,N as l,P as t,bo as z,U as J,ay as P,I as e,R as s,q as $,Q as j,az as r,T as W,G as k,V as X,W as H,aG as Z,aI as ee,aJ as te,aK as le}from"./index.7efcbe86.js";import{Q as ae}from"./QSpace.c00d4884.js";import{Q as F}from"./QSelect.8edab530.js";import{Q as oe}from"./QForm.df816fa6.js";import{C as se}from"./ClosePopup.145acd40.js";import{f as y}from"./useFormat.349e799c.js";import{u as ne}from"./useI18n.6b7b36de.js";import{b,c as ie}from"./axiosClient.a0ee23b9.js";import{Q as g}from"./queryKeys.832af9fa.js";import{d as re}from"./date.2d51ed98.js";const de=async()=>{const{data:a}=await b.get("/inventory/extraProperty/getCategoryList?limit=1000&isActive=1");return a.data},ue=()=>K(g.CATEGORY_LIST_STOCKS,de),ce=async a=>{if(a===null)return null;const{data:i}=await b.get("/inventory/stock/getExportStockDetail",{params:{exportStockSn:a}});return i.data},pe=a=>K(A([g.EXPORT_STOCKS,a]),()=>ce(a.value)),me=async a=>{const[,i]=a.queryKey,{data:o}=await b.get("/inventory/extraProperty/getProductList",{params:{categorySn:i,limit:1e3,isActive:1}});return o.data&&Object.assign(o.data,{categorySn:i}),o.data},_e=a=>B(N(()=>a.value.map(i=>({queryKey:[g.PRODUCT_LIST_STOCKS,i],queryFn:me}))));const ve=a=>(te("data-v-3cc4d62b"),a=a(),le(),a),fe={class:"text-h6"},xe={class:"row q-gutter-md"},ye={class:"col col-sm-12 col-xs-12"},be={class:"col col-sm-12 col-xs-12"},ge={class:"export-stock__container"},Se={class:"title"},he={class:"product"},Qe={class:"total-price__container"},De=ve(()=>e("span",{class:"text-orange-10 text-subtitle2 text-weight-bold"},"VND",-1)),Ce=Y({setup(a,{expose:i}){const{t:o}=ne(),f=q(!1),S=q(null);i({open:m=>{f.value=!0,S.value=m}});const{data:c,isLoading:M}=pe(S),{data:R}=ue(),U=_e(N(()=>{var m,_;return(_=(m=c.value)==null?void 0:m.exportStockDetailList.map(({categorySn:p})=>p))!=null?_:[]}));return(m,_)=>(v(),O(ee,{modelValue:f.value,"onUpdate:modelValue":_[0]||(_[0]=p=>f.value=p)},{default:u(()=>[l(Z,{style:{position:"relative",width:"1360px","max-width":"80vw"}},{default:u(()=>[t(M)?(v(),O(z,{key:0,color:"primary",size:"3em",style:{display:"block",position:"absolute",inset:"0",margin:"auto"}})):J("v-if",!0),l(P,{class:"row items-center"},{default:u(()=>[e("div",fe,s(t(o)("export_receipt_detail")),1),l(ae),$(l(j,{icon:"close",flat:"",round:"",dense:""},null,512),[[se]])]),_:1}),l(P,{class:"q-pt-none"},{default:u(()=>[l(oe,{class:"form"},{default:u(()=>{var p,h,Q,D,C,w,I;return[e("div",xe,[e("div",ye,[e("label",null,s(t(o)("export_receipt_id")),1),l(r,{"model-value":(p=t(c))==null?void 0:p.exportStock.receiptId,disable:"",filled:"",dense:""},null,8,["model-value"])]),e("div",be,[e("label",null,s(t(o)("export_datetime")),1),l(r,{"model-value":t(re).formatDate(((D=(Q=(h=t(c))==null?void 0:h.exportStock)==null?void 0:Q.exportDate)!=null?D:0)*1e3,t(ie)),disable:"",filled:"",dense:""},{prepend:u(()=>[l(W,{name:"date_range"})]),_:1},8,["model-value"])])]),e("div",null,[e("label",null,s(t(o)("note")),1),l(r,{"model-value":(C=t(c))==null?void 0:C.exportStock.note,type:"textarea",rows:"5",disable:"",filled:"",dense:""},null,8,["model-value"])]),e("div",ge,[e("p",Se,s(t(o)("export_stock")),1),e("ul",null,[(v(!0),k(H,null,X((w=t(c))==null?void 0:w.exportStockDetailList,n=>{var T,E,L,V;return v(),k("li",{key:n.sn},[e("div",he,[e("div",null,[e("label",null,s(t(o)("category"))+" *",1),l(F,{"model-value":n.categorySn,options:(T=t(R))==null?void 0:T.categoryList.map(({sn:d,name:x})=>({label:x,value:d})),"map-options":"",disable:"",filled:"",dense:""},null,8,["model-value","options"])]),e("div",null,[e("label",null,s(t(o)("product"))+" *",1),l(F,{"model-value":n.productSn,options:(V=(L=(E=t(U).find(({data:d})=>(d==null?void 0:d.categorySn)===n.categorySn))==null?void 0:E.data)==null?void 0:L.productList)==null?void 0:V.map(({name:d,sn:x})=>({label:d,value:x})),"map-options":"",disable:"",filled:"",dense:""},null,8,["model-value","options"])]),e("div",null,[e("label",null,s(t(o)("unit")),1),l(r,{"model-value":n.productUnitName,disable:"",filled:"",dense:""},null,8,["model-value"])]),e("div",null,[e("label",null,s(t(o)("quantity"))+" *",1),l(r,{"model-value":n.quantity,disable:"",filled:"",dense:""},null,8,["model-value"])]),e("div",null,[e("label",null,s(t(o)("unit_price")),1),l(r,{"model-value":t(y)(n.total/n.quantity),"input-class":"text-right",suffix:"VND",disable:"",filled:"",dense:""},null,8,["model-value"])]),e("div",null,[e("label",null,s(t(o)("total")),1),l(r,{"model-value":t(y)(n.total),"input-class":"text-right",suffix:"VND",disable:"",filled:"",dense:""},null,8,["model-value"])])])])}),128))])]),e("div",Qe,[e("label",null,s(t(o)("total_price")),1),l(r,{"model-value":t(y)((I=t(c))==null?void 0:I.exportStock.totalPrice),"input-class":"text-orange-10 text-weight-bold text-right","bg-color":"orange-1",disable:"",filled:"",dense:""},{append:u(()=>[De]),_:1},8,["model-value"])])]}),_:1})]),_:1})]),_:1})]),_:1},8,["modelValue"]))}});var Ke=G(Ce,[["__scopeId","data-v-3cc4d62b"],["__file","D:/gopms-web/src/modules/stock/components/export-detail-modal.vue"]]);export{Ke as E};
