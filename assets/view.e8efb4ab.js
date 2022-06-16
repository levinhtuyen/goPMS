var et=Object.defineProperty;var Be=Object.getOwnPropertySymbols;var tt=Object.prototype.hasOwnProperty,at=Object.prototype.propertyIsEnumerable;var Me=(r,u,s)=>u in r?et(r,u,{enumerable:!0,configurable:!0,writable:!0,value:s}):r[u]=s,Je=(r,u)=>{for(var s in u||(u={}))tt.call(u,s)&&Me(r,s,u[s]);if(Be)for(var s of Be(u))at.call(u,s)&&Me(r,s,u[s]);return r};import{aw as Ve,bh as Xe,_ as Se,J as Ce,r as k,ax as Te,C as ie,a as W,F as b,L as I,M as d,N as o,I as t,R as i,P as e,aD as je,ay as Le,T as ke,aH as pe,q as Z,Q as P,az as ee,G as $,V as $e,an as _e,W as ne,aF as ae,aG as ze,aI as He,aJ as Ke,aK as Ye,av as Ge,w as xe,U as N,O as te,bx as lt,p as ot,K as st,bo as nt}from"./index.7efcbe86.js";import{Q as ve}from"./QSelect.8edab530.js";import{Q as qe}from"./QDate.804040fd.js";import{Q as Ne}from"./QPopupProxy.9996c4ad.js";import{a as le}from"./QMenu.b19dfcca.js";import{Q as it,a as Ee,c as O,b as dt}from"./QTable.4cc8e1c9.js";import{Q as ct}from"./QTooltip.c975c2a0.js";import{Q as rt}from"./QPagination.a48c1bef.js";import{Q as ut}from"./QInnerLoading.5fef3982.js";import{Q as We}from"./QForm.df816fa6.js";import{C as fe}from"./ClosePopup.145acd40.js";import{u as Pe}from"./useI18n.6b7b36de.js";import{f as J,c as ye,a as mt}from"./useFormat.349e799c.js";import{d as C}from"./date.2d51ed98.js";import{b as ue,e as De,d as ge,u as pt,c as be}from"./axiosClient.a0ee23b9.js";import{Q as he}from"./queryKeys.832af9fa.js";import{u as Ze}from"./useReceiptTypeQuery.2e6198bb.js";import{u as Re}from"./useNotify.967ca7e7.js";import{n as we}from"./useCreateDate.6141d343.js";import"./selection.6afffe69.js";import"./QItemLabel.938a9258.js";import"./rtl.4b414a6d.js";import"./use-cache.b0833c75.js";import"./position-engine.4a23d733.js";import"./QList.e5651779.js";import"./use-quasar.f3f15168.js";const _t=async r=>{const{data:u}=await ue.post("/accounting/createCashTransaction",r);return u},vt=()=>{const r=Xe();return Ve(_t,{onSuccess:()=>{r.invalidateQueries(he.CASH_TRANSACTION)}})};const ft=r=>(Ke("data-v-660b423c"),r=r(),Ye(),r),yt={class:"text-bold q-mt-md q-mx-lg text-heading"},gt={class:"col-12 col-sm-6 col-md-3"},ht={class:"required text-bold q-ma-xs"},bt={class:"col-12 col-sm-6 col-md-3"},wt={class:"text-bold q-ma-xs"},xt={class:"self-center full-width no-outline",tabindex:"0"},Dt={class:"row items-center justify-end"},Vt={class:"col-12 col-sm-6 col-md-3"},St={class:"text-bold q-ma-xs"},Ct={class:"col-12 col-sm-6 col-md-3"},Tt={class:"text-bold q-ma-xs"},kt={class:"col-12 col-md-12"},$t={class:"text-bold q-ma-xs"},qt={class:"bg-grey-2 col-12 col-md-12",style:{"max-height":"340px",overflow:"auto"}},Nt={class:"row q-mx-sm q-mt-sm"},Pt={class:"col-md-6 col-sm-6 col-xs-6 text-left"},Rt={class:"text-weight-700"},At={class:"col-md-6 col-sm-6 col-xs-6 text-right"},It={class:"row"},Qt={class:"col-12 col-sm-6 col-md-9 q-px-sm"},Ot={class:"required q-my-xs text-bold"},Ut={class:"col-12 col-sm-6 col-md-3 q-px-sm"},Ft={class:"required q-my-xs text-bold"},Bt={class:"row"},Mt=["id","value","onChange"],Jt={class:"col-12 col-md-12 q-my-sm"},Et={class:"row"},Xt={class:"col-12 col-md-9 col-sm-6 text-left"},jt={class:"text-bold"},Lt={class:"col-12 col-md-3 col-sm-6 text-right"},zt=["id","value","onChange"],Ht=ft(()=>t("span",{style:{"font-size":"15px"},class:"text-deep-orange-9 text-bold"},"VND",-1)),Kt={class:"col-12 col-md-12 row justify-end"},Yt=Ce({props:{modelValue:{type:Boolean,required:!0}},emits:["close","update:modelValue"],setup(r,{expose:u,emit:s}){const A=r,{notifyCreateSuccess:L}=Re(),q=k(null),y=Te(),T=k(Date.now()),z=vt(),{data:D}=Ze(),{subtractFromDate:H}=C,{t:a}=Pe(),U=k(""),h=ie({categorySn:1,cashieringReceiptTypeSn:null,date:null,reason:"",dataDetail:[{description:"",amount:0}],totalPrice:0}),R=ie({createBy:"",id:""}),_=W({get(){return A.modelValue},set(v){s("update:modelValue",v)}}),K=W({get:()=>C.formatDate(new Date(Number(h.date)*1e3),De),set:v=>{h.date=Number(C.formatDate(new Date(v),"X"))}}),de=async v=>{F(),U.value=v.labelType,h.categorySn=v.categorySn,h.cashieringReceiptTypeSn=v.categorySn===1?1:null},X=[v=>200>=v.length||a("the_length_is_from_0_to_200_characters")],Q=[v=>!!v||a("this_field_is_required"),v=>200>=(v==null?void 0:v.length)||a("the_length_is_from_0_to_200_characters")],w=[v=>!!v||a("this_field_is_required"),v=>0<=v&&1e11>=v||a("the_value_is_from_1_to_100_000_000_000")],V=v=>new Date(v)<=H(new Date,{day:0}),j=()=>{y.dialog({title:"",message:a("confirm_new_"+U.value),cancel:{color:"grey-8",label:a("cancel"),noCaps:!0,align:"center",dense:!0,outline:!0},ok:{color:"negative",label:a("confirm"),dense:!0,noCaps:!0,align:"center"},persistent:!0,position:"standard"}).onOk(()=>{const v=h.dataDetail.map(f=>({description:f.description,amount:f.amount}));z.mutate({categorySn:h.categorySn,cashieringReceiptTypeSn:h.cashieringReceiptTypeSn,date:h.date,reason:h.reason,dataDetail:v,totalPrice:h.totalPrice},{onSuccess:f=>{(f==null?void 0:f.code)===1&&(L(),setTimeout(()=>{s("close")},400))}})})},oe=()=>{let v=0;h.dataDetail.map(f=>v+=Number(f.amount)),h.totalPrice=v},ce=v=>{h.dataDetail.splice(v,1),oe()},F=()=>{h.date=Number(C.formatDate(T.value,"X")),h.reason="",h.totalPrice=0,h.dataDetail=[{description:"",amount:0}]},re=()=>{q==null||q.value.show()};return u({setupPricingAddDialog:de}),(v,f)=>(b(),I(He,{modelValue:e(_),"onUpdate:modelValue":f[8]||(f[8]=g=>pe(_)?_.value=g:null)},{default:d(()=>[o(ze,{style:{width:"1360px","max-width":"80vw"}},{default:d(()=>[t("div",yt,i(e(a)("new_"+U.value)),1),o(We,{onSubmit:je(j,["prevent","stop"])},{default:d(()=>[o(Le,{class:"row q-mx-sm"},{default:d(()=>[t("div",gt,[t("p",ht,i(e(a)(U.value+"_type")),1),o(ve,{modelValue:e(h).cashieringReceiptTypeSn,"onUpdate:modelValue":f[0]||(f[0]=g=>e(h).cashieringReceiptTypeSn=g),class:"q-mr-md",options:e(h).categorySn===1?e(D)[0].receiptTypeList:e(D)[1].receiptTypeList,label:e(a)(U.value+"_type_placeholder"),clearable:"",dense:"",outlined:"","map-options":"","option-label":"name","option-value":"sn","emit-value":"",rules:[g=>!!g||e(a)("please_select_one_value")]},null,8,["modelValue","options","label","rules"])]),t("div",bt,[t("p",wt,i(e(a)(U.value+"_date")),1),o(le,{placeholder:"Select date time",dense:"","stack-label":"",outlined:"",class:"q-mr-md",onFocus:re},{control:d(()=>[t("div",xt,i(e(C).formatDate(Number(e(h).date)*1e3,e(ge))),1)]),prepend:d(()=>[o(ke,{name:"event",class:"no-pointer-events"},{default:d(()=>[o(Ne,{ref_key:"qDateRef",ref:q,cover:"","transition-show":"scale","transition-hide":"scale"},{default:d(()=>[o(qe,{modelValue:e(K),"onUpdate:modelValue":f[1]||(f[1]=g=>pe(K)?K.value=g:null),options:V},{default:d(()=>[t("div",Dt,[Z(o(P,{label:"Close",color:"primary",flat:""},null,512),[[fe]])])]),_:1},8,["modelValue"])]),_:1},512)]),_:1})]),_:1})]),t("div",Vt,[t("p",St,i(e(a)(U.value+"_id")),1),o(ee,{modelValue:e(R).id,"onUpdate:modelValue":f[2]||(f[2]=g=>e(R).id=g),disable:"","bg-color":"grey-4",class:"q-mr-md",dense:"",filled:""},null,8,["modelValue"])]),t("div",Ct,[t("p",Tt,i(e(a)("created_by")),1),o(ee,{modelValue:e(R).createBy,"onUpdate:modelValue":f[3]||(f[3]=g=>e(R).createBy=g),disable:"","bg-color":"grey-4",dense:"",filled:""},null,8,["modelValue"])]),t("div",kt,[t("p",$t,i(e(a)("reason")),1),o(ee,{modelValue:e(h).reason,"onUpdate:modelValue":f[4]||(f[4]=g=>e(h).reason=g),placeholder:e(a)("reason_placeholder"),dense:"",filled:"",rules:X,rows:"2",type:"textarea"},null,8,["modelValue","placeholder"])]),t("div",qt,[t("div",Nt,[t("div",Pt,[t("p",Rt,i(e(a)("detail")),1)]),t("div",At,[o(P,{outline:"","no-caps":"",color:"deep-orange-12",class:"bg-grey-1",label:e(y).screen.gt.xs?e(a)("add_new"):void 0,icon:"add_circle",style:{"font-size":"12px"},onClick:f[5]||(f[5]=g=>e(h).dataDetail.push({description:"",amount:0,inputActive:!1}))},null,8,["label"])])]),(b(!0),$(ne,null,$e(e(h).dataDetail,(g,E)=>(b(),$("div",{key:E},[t("div",It,[t("div",Qt,[t("p",Ot,i(e(a)("description")),1),o(ee,{modelValue:g.description,"onUpdate:modelValue":S=>g.description=S,placeholder:e(a)("input_description"),outlined:"",dense:"",rules:Q},null,8,["modelValue","onUpdate:modelValue","placeholder"])]),t("div",Ut,[t("p",Ft,i(e(a)("amount")),1),t("div",Bt,[o(le,{modelValue:g.amount,"onUpdate:modelValue":[S=>g.amount=S,f[6]||(f[6]=S=>oe())],modelModifiers:{number:!0},class:"col-md-10",outlined:"",dense:"",suffix:"VND",debounce:"500",rules:w,onBlur:S=>g.inputActive=!1,onFocus:S=>g.inputActive=!0},{control:d(({id:S,floatingLabel:c,modelValue:m,emitValue:x})=>[Z(t("input",{id:S,class:"q-field__input text-right",value:g.inputActive?m:e(J)(m),onChange:Y=>e(ye)(Y,m,x)},null,40,Mt),[[_e,c]])]),_:2},1032,["modelValue","onUpdate:modelValue","onBlur","onFocus"]),o(P,{class:"col-md-2",flat:"",round:"",color:"dark",icon:"delete",style:{"max-height":"10px"},disable:E===0,onClick:S=>ce(E)},null,8,["disable","onClick"])])])])]))),128))]),t("div",Jt,[t("div",Et,[t("div",Xt,[t("p",jt,i(e(a)("total_price")),1)]),t("div",Lt,[o(le,{modelValue:e(h).totalPrice,"onUpdate:modelValue":f[7]||(f[7]=g=>e(h).totalPrice=g),modelModifiers:{number:!0},filled:"",color:"primary",dense:"",class:"bg-deep-orange-2",debounce:"500",disable:""},{control:d(({id:g,floatingLabel:E,modelValue:S,emitValue:c})=>[Z(t("input",{id:g,class:"q-field__input text-right text-bold text-deep-orange-9",value:e(J)(S),onChange:m=>e(ye)(m,S,c)},null,40,zt),[[_e,E]])]),append:d(()=>[Ht]),_:1},8,["modelValue"])])])]),t("div",Kt,[Z((b(),I(P,{class:"q-mr-md",dense:"",outline:"","no-caps":"",color:"grey-8",style:{padding:"8px 20px"}},{default:d(()=>[ae(i(e(a)("cancel")),1)]),_:1})),[[fe]]),o(P,{type:"submit","no-caps":"",color:"negative",style:{padding:"8px 20px"}},{default:d(()=>[ae(i(e(a)("save")),1)]),_:1})])]),_:1})]),_:1},8,["onSubmit"])]),_:1})]),_:1},8,["modelValue"]))}});var Gt=Se(Yt,[["__scopeId","data-v-660b423c"],["__file","D:/gopms-web/src/modules/cash-transactions/components/addCash.vue"]]);const Wt=async r=>{const{data:u}=await ue.post("/accounting/updateCashTransaction",r);return u},Zt=()=>Ve(Wt,{onSuccess:()=>{}}),ea=async({queryKey:r})=>{const[,u]=r;if(!u||u===-1)return;const{data:s}=await ue.get("/accounting/getCashTransactionDetail",{params:{sn:u}});return s.data},ta=(r,{enabled:u})=>{const s=[he.CASH_TRANSACTION,r];return Ge(s,ea,{enabled:u,select:A=>A})};const aa=r=>(Ke("data-v-aa346f94"),r=r(),Ye(),r),la={class:"text-bold q-mt-md q-mx-lg text-heading"},oa={class:"col-12 col-sm-6 col-md-3"},sa={class:"required text-bold q-ma-xs"},na={class:"col-12 col-sm-6 col-md-3"},ia={class:"text-bold q-ma-xs"},da={class:"self-center full-width no-outline",tabindex:"0"},ca={class:"row items-center justify-end"},ra={class:"col-12 col-sm-6 col-md-3"},ua={class:"text-bold q-ma-xs"},ma={class:"col-12 col-sm-6 col-md-3"},pa={class:"text-bold q-ma-xs"},_a={class:"col-12 col-md-12"},va={class:"text-bold q-ma-xs"},fa={class:"bg-grey-2 col-12 col-md-12",style:{"max-height":"340px",overflow:"auto"}},ya={class:"row q-mx-sm q-mt-sm"},ga={class:"col-md-6 col-sm-6 col-xs-6 text-left"},ha={class:"text-weight-700"},ba={class:"col-md-6 col-sm-6 col-xs-6 text-right"},wa={class:"row"},xa={class:"col-12 col-sm-6 col-md-9 q-px-sm"},Da={class:"required q-my-xs text-bold"},Va={class:"col-12 col-sm-6 col-md-3 q-px-sm"},Sa={class:"required q-my-xs text-bold"},Ca={class:"row"},Ta=["id","value","onChange"],ka={class:"col-12 col-md-12 q-my-sm"},$a={class:"row"},qa={class:"col-12 col-md-9 col-sm-6 text-left"},Na={class:"text-bold"},Pa={class:"col-12 col-md-3 col-sm-6 text-right"},Ra=["id","value","onChange"],Aa=aa(()=>t("span",{style:{"font-size":"15px"},class:"text-deep-orange-9 text-bold"},"VND",-1)),Ia={key:0,class:"col-12 col-md-12 row justify-end"},Qa=Ce({props:{modelValue:{type:Boolean,required:!0}},emits:["close","update:modelValue"],setup(r,{expose:u,emit:s}){const A=r,{notifyUpdateSuccess:L}=Re(),q=k(null),y=k(-1),T=k(1),z=k(""),D=k(1),H=ie({price:!1}),a=ie({cashieringReceiptTypeSn:0,reason:"",dataDetail:[{description:"",amount:0}],totalPrice:0,id:"",dateTime:"",createBy:""}),U=W(()=>!!y.value),h=Te(),R=Zt();let{data:_,isFetching:K,refetch:de}=ta(y,{enabled:U.value});const{data:X}=Ze(),{subtractFromDate:Q}=C,{t:w}=Pe(),V=k(""),j=W({get(){return A.modelValue},set(c){s("update:modelValue",c)}}),oe=async c=>{V.value=c.labelType===1?"cash_receipt":"cash_payment",T.value=c.pageType,z.value=c.pageType?"edit_":"detail_",D.value=c.categorySn?c.categorySn:c.labelType,y.value===c.sn&&de.value(),y.value=c.sn},ce=[c=>200>=c.length||w("the_length_is_from_0_to_200_characters")],F=[c=>!!c||w("this_field_is_required"),c=>200>=(c==null?void 0:c.length)||w("the_length_is_from_0_to_200_characters")],re=[c=>!!c||w("this_field_is_required"),c=>0<=c&&1e11>=c||w("the_value_is_from_1_to_100_000_000_000")];xe(K,()=>{_!=null&&_.value&&(a.cashieringReceiptTypeSn=JSON.parse(JSON.stringify(_==null?void 0:_.value.cashieringReceiptTypeSn)),a.reason=_!=null&&_.value.reason?JSON.parse(JSON.stringify(_==null?void 0:_.value.reason)):"",a.dataDetail=JSON.parse(JSON.stringify(_==null?void 0:_.value.dataDetail)),a.totalPrice=JSON.parse(JSON.stringify(_==null?void 0:_.value.totalPrice)),a.id=JSON.parse(JSON.stringify(_==null?void 0:_.value.id)),a.dateTime=JSON.parse(JSON.stringify((_==null?void 0:_.value.dateTime)*1e3)),a.createBy=JSON.parse(JSON.stringify(_==null?void 0:_.value.createBy)))});const v=c=>new Date(c)<=Q(new Date,{day:0}),f=()=>{h.dialog({message:w("confirm_edit_pricing"),cancel:{color:"grey-8",label:w("cancel"),noCaps:!0,dense:!0,outline:!0},color:"negative",ok:{color:"negative",label:w("confirm"),noCaps:!0,dense:!0},persistent:!0}).onOk(()=>{R.mutate({sn:y.value,categorySn:D.value,cashieringReceiptTypeSn:a.cashieringReceiptTypeSn,reason:a.reason,dataDetail:a.dataDetail,totalPrice:a.totalPrice},{onSuccess:c=>{(c==null?void 0:c.code)===1&&(L(),setTimeout(()=>{s("close")},400))}})})},g=()=>{let c=0;a.dataDetail.map(m=>c+=Number(m.amount)),a.totalPrice=c},E=c=>{a.dataDetail.splice(c,1),g()},S=()=>{q==null||q.value.show()};return u({setupPricingAddDialog:oe}),(c,m)=>(b(),I(He,{modelValue:e(j),"onUpdate:modelValue":m[11]||(m[11]=x=>pe(j)?j.value=x:null)},{default:d(()=>[o(ze,{style:{width:"1360px","max-width":"80vw"}},{default:d(()=>[t("div",la,i(e(w)(z.value+V.value)),1),e(a)?(b(),I(We,{key:0,onSubmit:je(f,["prevent","stop"])},{default:d(()=>[o(Le,{class:"row q-mx-sm"},{default:d(()=>[t("div",oa,[t("p",sa,i(e(w)(V.value+"_type")),1),o(ve,{modelValue:e(a).cashieringReceiptTypeSn,"onUpdate:modelValue":m[0]||(m[0]=x=>e(a).cashieringReceiptTypeSn=x),class:"q-mr-md",options:D.value===1?e(X)[0].receiptTypeList:e(X)[1].receiptTypeList,label:e(w)(V.value+"_type_placeholder"),disable:!T.value,"bg-color":T.value?"":"grey-4",dense:"",outlined:"","map-options":"",clearable:"","option-label":"name","option-value":"sn","emit-value":"",rules:[x=>!!x||e(w)("please_select_one_value")]},null,8,["modelValue","options","label","disable","bg-color","rules"])]),t("div",na,[t("p",ia,i(e(w)(V.value+"_date_time")),1),o(le,{modelValue:e(a).dateTime,"onUpdate:modelValue":m[2]||(m[2]=x=>e(a).dateTime=x),placeholder:e(w)("select_date_time"),dense:"","stack-label":"",filled:"",class:"q-mr-md",disable:"","bg-color":"grey-4",onFocus:S},{control:d(()=>[t("div",da,i(e(C).formatDate(e(a).dateTime,e(ge))),1)]),prepend:d(()=>[o(ke,{name:"event",class:"no-pointer-events"},{default:d(()=>[o(Ne,{ref_key:"qDateRef",ref:q,cover:"","transition-show":"scale","transition-hide":"scale"},{default:d(()=>[o(qe,{modelValue:e(a).dateTime,"onUpdate:modelValue":m[1]||(m[1]=x=>e(a).dateTime=x),options:v},{default:d(()=>[t("div",ca,[Z(o(P,{label:"Close",color:"primary",flat:""},null,512),[[fe]])])]),_:1},8,["modelValue"])]),_:1},512)]),_:1})]),_:1},8,["modelValue","placeholder"])]),t("div",ra,[t("p",ua,i(e(w)(V.value+"_id")),1),o(ee,{modelValue:e(a).id,"onUpdate:modelValue":m[3]||(m[3]=x=>e(a).id=x),disable:"","bg-color":"grey-4",class:"q-mr-md",dense:"",filled:""},null,8,["modelValue"])]),t("div",ma,[t("p",pa,i(e(w)("created_by")),1),o(ee,{modelValue:e(a).createBy,"onUpdate:modelValue":m[4]||(m[4]=x=>e(a).createBy=x),disable:"","bg-color":"grey-4",dense:"",filled:""},null,8,["modelValue"])]),t("div",_a,[t("p",va,i(e(w)("reason")),1),o(ee,{modelValue:e(a).reason,"onUpdate:modelValue":m[5]||(m[5]=x=>e(a).reason=x),dense:"",filled:"",placeholder:e(w)("reason_placeholder"),disable:!T.value,"bg-color":T.value?"":"grey-4",rules:ce,rows:"2",type:"textarea"},null,8,["modelValue","placeholder","disable","bg-color"])]),t("div",fa,[t("div",ya,[t("div",ga,[t("p",ha,i(e(w)("detail")),1)]),t("div",ba,[T.value?(b(),I(P,{key:0,outline:"","no-caps":"",color:"deep-orange-12",class:"bg-grey-1",label:e(w)("add_new"),icon:"add_circle",style:{"font-size":"12px"},onClick:m[6]||(m[6]=x=>e(a).dataDetail.push({description:"",amount:0}))},null,8,["label"])):N("v-if",!0)])]),(b(!0),$(ne,null,$e(e(a).dataDetail,(x,Y)=>{var p;return b(),$("div",{key:Y},[t("div",wa,[t("div",xa,[t("p",Da,i(e(w)("description")),1),o(ee,{modelValue:x.description,"onUpdate:modelValue":n=>x.description=n,placeholder:e(w)("input_description"),disable:!T.value,"bg-color":T.value?"":"grey-4",dense:"",filled:"",rules:F},null,8,["modelValue","onUpdate:modelValue","placeholder","disable","bg-color"])]),t("div",Va,[t("p",Sa,i(e(w)("amount")),1),t("div",Ca,[o(le,{modelValue:x.amount,"onUpdate:modelValue":[n=>x.amount=n,m[9]||(m[9]=n=>g())],modelModifiers:{number:!0},disable:!T.value,"bg-color":T.value?"":"grey-4",filled:"",dense:"",suffix:"VND",class:te(T.value?"col-lg-10 col-md-10 col-sm-10 col-xs-10":"col-lg-12 col-md-12 col-sm-12"),debounce:"500",rules:re,onBlur:m[7]||(m[7]=n=>e(H).price=!1),onFocus:m[8]||(m[8]=n=>e(H).price=!0)},{control:d(({id:n,floatingLabel:B,modelValue:M,emitValue:se})=>[Z(t("input",{id:n,class:"q-field__input text-right",value:e(H).price?M:e(J)(M),onChange:me=>e(ye)(me,M,se)},null,40,Ta),[[_e,B]])]),_:2},1032,["modelValue","onUpdate:modelValue","disable","bg-color","class"]),T.value?(b(),I(P,{key:0,class:"col-md-2",flat:"",round:"",color:"dark",icon:"delete",style:{"max-height":"10px"},disable:((p=e(a).dataDetail)==null?void 0:p.length)<2,onClick:n=>E(Y)},null,8,["disable","onClick"])):N("v-if",!0)])])])])}),128))]),t("div",ka,[t("div",$a,[t("div",qa,[t("p",Na,i(e(w)("total_price")),1)]),t("div",Pa,[o(le,{modelValue:e(a).totalPrice,"onUpdate:modelValue":m[10]||(m[10]=x=>e(a).totalPrice=x),modelModifiers:{number:!0},filled:"",color:"primary",dense:"",class:"bg-deep-orange-2",debounce:"500",disable:""},{control:d(({id:x,floatingLabel:Y,modelValue:p,emitValue:n})=>[Z(t("input",{id:x,class:"q-field__input text-right text-bold text-deep-orange-9",value:e(J)(p),onChange:B=>e(ye)(B,p,n)},null,40,Ra),[[_e,Y]])]),append:d(()=>[Aa]),_:1},8,["modelValue"])])])]),T.value?(b(),$("div",Ia,[Z((b(),I(P,{class:"q-mr-md",dense:"","no-caps":"",outline:"",color:"grey-8",style:{padding:"8px 20px"}},{default:d(()=>[ae(i(e(w)("cancel")),1)]),_:1})),[[fe]]),o(P,{type:"submit","no-caps":"",color:"deep-orange-12",style:{padding:"8px 20px"}},{default:d(()=>[ae(i(e(w)("save")),1)]),_:1})])):N("v-if",!0)]),_:1})]),_:1},8,["onSubmit"])):N("v-if",!0)]),_:1})]),_:1},8,["modelValue"]))}});var Oa=Se(Qa,[["__scopeId","data-v-aa346f94"],["__file","D:/gopms-web/src/modules/cash-transactions/components/editDetailCash.vue"]]);const Ua=async({queryKey:r})=>{const[,u]=r;if((u==null?void 0:u.dateFrom)&&(u==null?void 0:u.dateTo)){const{data:s}=await ue.get("/accounting/getCashTransactionList",{params:u});return s.data}},Fa=(r,u)=>{const s=[he.CASH_TRANSACTION,r];return Ge(s,Ua,{enabled:u,select:A=>A})},Ba=async r=>{await ue.post("/accounting/deleteCashTransaction",r)},Ma=()=>{const r=Xe();return Ve(Ba,{onSuccess:()=>{r.invalidateQueries(he.CASH_TRANSACTION)}})};const Ja={class:"text-center q-mb-md"},Ea={class:"custom-row rounded-borders"},Xa={class:"row q-mb-md"},ja={key:0,class:"col-md-2 col-sm-4 col-xs-12 q-pb-sm"},La={class:"col-md-2 col-sm-4 col-xs-12 q-pb-sm"},za={class:"col-md-4 col-sm-4 col-xs-12 q-pb-sm"},Ha={key:0,class:"self-center full-width no-outline",tabindex:"0"},Ka={key:1,class:"col-md-2 col-sm-4 col-xs-12"},Ya={key:0,class:"container"},Ga=["onClick"],Wa=["onClick"],Za=["onClick"],el=["onClick"],tl={key:2},al={class:"ellipsis",style:{width:"300px"}},ll={class:"q-mt-md row justify-end"},ol={key:1,class:"container relative-position q-pa-md"},sl={lass:"full-width full-height q-mx-md row justify-center"},nl={key:2,class:"bg-deep-orange-1 q-mt-md q-px-md text-bold custom-fs-16"},il={class:"row justify-between"},dl={class:"row justify-between"},cl={class:"row justify-between"},rl={class:"row justify-between"},ul=Ce({setup(r){const u=k(Date.now()),{t:s}=Pe(),A=k(["receiptDateTime","cashReceiptId","total","reason","operations"]),L=lt(),{hasPermission:q}=pt(),y=k({label:"cash_receipt",field:"receiptPrice",per:"cash-receipt",view:"receipt"}),T=Te(),z=k([]),D=k(1),H={page:1,limit:10,categorySn:D.value||0,isDeleted:null,dateFrom:Number(C.formatDate(u.value,"X")),dateTo:Number(C.formatDate(u.value,"X"))},a=ie(Je({},H)),U=k(0),h=W(()=>[{name:"index",label:s("no"),field:"index",align:"left",style:"width: 50px",required:!0},{name:"paymentDateTime",label:s("cash_payment_date_time"),field:"dateTime",align:"left"},{name:"receiptDateTime",label:s("cash_receipt_date_time_table"),field:"dateTime",align:"left"},{name:"dateTime",label:s("date_time"),field:"dateTime",align:"left"},{name:"cashPaymentId",field:"cashPaymentId",label:"cash_payment_id",align:"left"},{name:"cashReceiptId",field:"cashReceiptId",label:s("cash_receipt_id"),align:"left"},{name:"total",field:y.value.field,label:s("total"),align:"right"},{name:"paymentPrice",field:"paymentPrice",label:s("payment_price"),align:"right"},{name:"receiptPrice",field:"receiptPrice",label:s("receipt_price"),align:"right"},{name:"reason",field:"reason",label:s("reason"),align:"left"},{name:"createBy",field:"createBy",label:s("created_by"),align:"left"},{name:"operations",field:"",label:s("operations"),align:"left"}]),R=ie({isShowAddCash:!1,isShowEditDetailCash:!1}),_=k(null),K=k(null),{notifyUpdateSuccess:de}=Re(),X=k(null),Q=k(0),w=()=>{a.page=1},{data:V,isFetching:j,refetch:oe}=Fa(a,!0),ce=Ma();xe(j,()=>{z.value=V!=null&&V.value?JSON.parse(JSON.stringify(V==null?void 0:V.value.cashTransactionList)):[],U.value=V!=null&&V.value?JSON.parse(JSON.stringify(V==null?void 0:V.value.meta.lastPage)):[]}),xe(D,()=>{switch(a.page=1,a.categorySn=D.value,a.isDeleted=H.isDeleted,Q.value=0,E(),D.value){case 1:y.value.label="cash_receipt",y.value.field="receiptPrice",y.value.per="cash-receipt",y.value.view="receipt",A.value=["receiptDateTime","cashReceiptId","total","reason","operations"];break;case 2:y.value.label="cash_payment",y.value.field="paymentPrice",y.value.per="cash-payment",y.value.view="payment",A.value=["paymentDateTime","cashPaymentId","total","reason","operations"];break;case null:y.value.label="",A.value=["dateTime","cashReceiptId","cashPaymentId","receiptPrice","paymentPrice","reason","createBy"];break;default:y.value.label="cash_receipt",A.value=["paymentDateTime","cashReceiptId","receiptPrice","reason","createBy"];break}});const F=W({get:()=>({from:a.dateFrom?C.formatDate(new Date(a.dateFrom*1e3),De):"",to:a.dateTo?C.formatDate(new Date(a.dateTo*1e3),De):""}),set:p=>{Q.value=0,p?(a.dateFrom=Number(C.formatDate(new Date(p.from),"X"))||Number(C.formatDate(new Date(p),"X")),a.dateTo=Number(C.formatDate(new Date(p.to),"X"))||Number(C.formatDate(new Date(p),"X"))):a.dateFrom=a.dateTo=null,f()}}),re=W(()=>[{name:s("all_"+y.value.label),value:null},{name:s("available_"+y.value.label),value:0},{name:s("deleted_"+y.value.label),value:1}]),v=W(()=>[{name:s("today"),value:0},{name:s("this_week"),value:1},{name:s("this_month"),value:2},{name:s("this_year"),value:3}]),f=()=>{a.page=1},g=()=>{var p;R.isShowAddCash=!0,(p=_.value)==null||p.setupPricingAddDialog({labelType:y.value.label,categorySn:D.value})},E=()=>{if(Q.value===0)a.dateFrom=a.dateTo=Number(C.formatDate(u.value,"X"));else if(Q.value===1){const p=new Date,n=p.getDate()-p.getDay(),B=n+6,M=new Date(new Date().setDate(n+1)),se=new Date(new Date().setDate(B+1));a.dateFrom=Number(C.formatDate(M,"X")),a.dateTo=Number(C.formatDate(se,"X"))}else if(Q.value===2){const p=new Date,n=new Date(p.getFullYear(),p.getMonth(),1),B=new Date(p.getFullYear(),p.getMonth()+1,0);a.dateFrom=Number(C.formatDate(n,"X")),a.dateTo=Number(C.formatDate(B,"X"))}else if(Q.value===3){const p=new Date(new Date().getFullYear(),0,1),n=new Date(new Date().getFullYear(),11,31);a.dateFrom=Number(C.formatDate(p,"X")),a.dateTo=Number(C.formatDate(n,"X"))}f()},S=(p,n,B)=>{var M;R.isShowEditDetailCash=!0,(M=K.value)==null||M.setupPricingAddDialog({labelType:B,categorySn:D.value,sn:p,pageType:n})},c=p=>{T.dialog({message:s("are_you_sure_you_want_to_delete_this_"+y.value.label),cancel:{color:"grey-8",label:s("cancel"),noCaps:!0,dense:!0,outline:!0},color:"negative",ok:{color:"negative",label:s("confirm"),noCaps:!0,dense:!0},persistent:!0}).onOk(()=>{ce.mutate({sn:p},{onSuccess:()=>{de()}})})},m=()=>{R.isShowAddCash=!1,R.isShowEditDetailCash=!1,oe.value()},x=()=>{X==null||X.value.show()},Y=()=>{if(L.params&&!L.params.sn)return;let p=Number(L.params.sn),n=Number(L.params.activitiesSn);n===16||n===17||n===18?(D.value=1,n===16&&S(p,1,1),n===17&&S(p,1,1),n===18&&S(p,0,1)):(n===19||n===20||n===21)&&(D.value=2,n===19&&g(),n===20&&S(p,1,2),n===21&&S(p,0,2))};return ot(()=>{setTimeout(()=>{Y()},800)}),(p,n)=>{const B=st("pms-sections");return b(),I(B,null,{default:d(()=>{var M,se,me,Ae,Ie,Qe,Oe,Ue,Fe;return[t("div",Ja,[t("div",Ea,[o(P,{label:e(s)("cash_receipt_title"),class:te(["col custom-tab text-bold",D.value===1?"active":""]),"no-caps":"",dense:"",onClick:n[0]||(n[0]=l=>D.value=1)},null,8,["label","class"]),o(P,{label:e(s)("cash_payment_title"),class:te(["col custom-tab text-bold",D.value===2?"active":""]),"no-caps":"",dense:"",onClick:n[1]||(n[1]=l=>D.value=2)},null,8,["label","class"]),o(P,{label:e(s)("transaction_detail"),class:te(["col custom-tab text-bold",D.value?"":"active"]),"no-caps":"",dense:"",onClick:n[2]||(n[2]=l=>D.value=null)},null,8,["label","class"])])]),t("div",Xa,[D.value?(b(),$("div",ja,[o(ve,{modelValue:e(a).isDeleted,"onUpdate:modelValue":[n[3]||(n[3]=l=>e(a).isDeleted=l),n[4]||(n[4]=l=>f())],class:"q-mr-md",options:e(re),dense:"",filled:"","map-options":"","option-label":"name","emit-value":""},null,8,["modelValue","options"])])):N("v-if",!0),t("div",La,[o(ve,{modelValue:Q.value,"onUpdate:modelValue":[n[5]||(n[5]=l=>Q.value=l),E],class:"q-mr-md",options:e(v),dense:"",label:e(s)("select_time_range"),filled:"","map-options":"","option-label":"name","emit-value":""},null,8,["modelValue","options","label"])]),t("div",za,[o(le,{placeholder:e(s)("select_date_time"),dense:"","stack-label":"",filled:"",class:"q-mr-md inline-block",onFocus:x},{control:d(()=>[e(F).from&&e(F).to?(b(),$("div",Ha,i(e(C).formatDate(e(F).from,e(ge)))+" - "+i(e(C).formatDate(e(F).to,e(ge))),1)):N("v-if",!0)]),prepend:d(()=>[o(ke,{name:"event",class:"no-pointer-events"},{default:d(()=>[o(Ne,{ref_key:"qDateRef",ref:X,"transition-show":"scale","transition-hide":"scale"},{default:d(()=>[o(qe,{modelValue:e(F),"onUpdate:modelValue":n[6]||(n[6]=l=>pe(F)?F.value=l:null),range:"",onRangeEnd:w},null,8,["modelValue"])]),_:1},512)]),_:1})]),_:1},8,["placeholder"])]),!D.value&&e(T).screen.gt.sm?(b(),$("div",Ka)):N("v-if",!0),t("div",{class:te(["col-md-4 col-sm-4 col-xs-12 q-py-sm",!D.value&&!e(T).screen.gt.sm?"text-left":"text-right"])},[e(a).categorySn&&e(q)("add-edit-delete-"+y.value.per)?(b(),I(P,{key:0,outline:"","no-caps":"",color:"deep-orange-12",label:e(T).screen.gt.sm?e(s)(`add_${y.value.label}`):void 0,icon:"add_circle",onClick:g},null,8,["label"])):N("v-if",!0)],2)]),e(j)?N("v-if",!0):(b(),$("div",Ya,[z.value?(b(),I(it,{key:0,rows:z.value,columns:e(h),"table-colspan":9,"row-key":"index",dense:"","no-data-label":e(s)("no_data"),"virtual-scroll-item-size":48,"rows-per-page-options":[0],"visible-columns":A.value,"hide-bottom":""},{header:d(l=>[o(Ee,{props:l},{default:d(()=>[(b(!0),$(ne,null,$e(l.cols,G=>(b(),I(dt,{key:G.name,props:l},{default:d(()=>[ae(i(e(s)(G.label)),1)]),_:2},1032,["props"]))),128))]),_:2},1032,["props"])]),body:d(l=>[o(Ee,{props:l,class:te(" isDeleted-"+l.row.isDeleted)},{default:d(()=>[o(O,{key:"index",props:l},{default:d(()=>[t("p",null,i(e(mt)(e(a).page,l.pageIndex)),1)]),_:2},1032,["props"]),o(O,{key:"paymentDateTime",props:l},{default:d(()=>[t("p",null,i(e(we)(l.row.dateTime,e(be))),1)]),_:2},1032,["props"]),o(O,{key:"receiptDateTime",props:l},{default:d(()=>[t("p",null,i(e(we)(l.row.dateTime,e(be))),1)]),_:2},1032,["props"]),o(O,{key:"dateTime",props:l},{default:d(()=>[t("p",null,i(e(we)(l.row.dateTime,e(be))),1)]),_:2},1032,["props"]),o(O,{key:"cashPaymentId",props:l},{default:d(()=>[l.row.isDeleted===0&&l.row.isAutoBySystem===0&&e(q)("add-edit-delete-"+y.value.per)?(b(),$("div",{key:0,flat:"",class:"text-negative cursor-pointer",onClick:G=>S(l.row.sn,1,2)},i(l.row.cashPaymentId),9,Ga)):!e(a).categorySn&&e(q)("view-cash-payment-detail")?(b(),$(ne,{key:1},[N(" edit receipt, just edit when transaction isn't delete and create by user  "),t("div",{flat:"",class:"text-negative cursor-pointer",onClick:G=>S(l.row.sn,0,2)},i(l.row.cashPaymentId),9,Wa)],2112)):(b(),$(ne,{key:2},[N(" detail cash payment detail   "),t("p",null,i(l.row.cashPaymentId),1)],2112)),N(" label for all tabs ")]),_:2},1032,["props"]),o(O,{key:"cashReceiptId",props:l},{default:d(()=>[l.row.isDeleted===0&&l.row.isAutoBySystem===0&&e(q)("add-edit-delete-"+y.value.per)?(b(),$("div",{key:0,class:"text-negative cursor-pointer",flat:"",onClick:G=>S(l.row.sn,1,1)},i(l.row.cashReceiptId),9,Za)):!e(a).categorySn&&e(q)("view-cash-receipt-detail")?(b(),$(ne,{key:1},[N(" edit payment, just edit when transaction isn't delete and create by user  "),t("div",{flat:"",class:"text-negative cursor-pointer",onClick:G=>S(l.row.sn,0,1)},i(l.row.cashReceiptId),9,el)],2112)):(b(),$("p",tl,i(l.row.cashReceiptId),1))]),_:2},1032,["props"]),o(O,{key:"total",props:l},{default:d(()=>[t("p",null,i(e(J)(l.row[y.value.field]))+" VND",1)]),_:2},1032,["props"]),o(O,{key:"paymentPrice",props:l},{default:d(()=>[t("p",null,i(e(J)(l.row.paymentPrice))+" VND",1)]),_:2},1032,["props"]),o(O,{key:"receiptPrice",props:l},{default:d(()=>[t("p",null,i(e(J)(l.row.receiptPrice))+" VND",1)]),_:2},1032,["props"]),o(O,{key:"reason",props:l},{default:d(()=>[t("p",al,[t("span",null,[o(ct,null,{default:d(()=>[ae(i(l.row.reason),1)]),_:2},1024),ae(" "+i(l.row.reason),1)])])]),_:2},1032,["props"]),o(O,{key:"createBy",props:l},{default:d(()=>[t("p",null,i(l.row.createBy),1)]),_:2},1032,["props"]),o(O,{class:"active-visibility",key:"operations",props:l},{default:d(()=>[l.row.isDeleted===0&&l.row.isAutoBySystem===0&&e(q)("add-edit-delete-"+y.value.per)?(b(),I(P,{key:0,flat:"",round:"",icon:"delete",style:{"max-height":"10px"},onClick:G=>c(l.row.sn)},null,8,["onClick"])):(b(),I(P,{key:1,class:te(e(q)("view-cash-"+y.value.view+"-detail")===!1?"hidden":""),flat:"",round:"",icon:"visibility",style:{"max-height":"10px"},onClick:G=>S(l.row.sn,0,D.value)},null,8,["class","onClick"]))]),_:2},1032,["props"])]),_:2},1032,["props","class"])]),_:1},8,["rows","columns","no-data-label","visible-columns"])):N("v-if",!0),t("div",ll,[o(rt,{modelValue:e(a).page,"onUpdate:modelValue":n[7]||(n[7]=l=>e(a).page=l),color:"negative",max:((M=e(V))==null?void 0:M.meta.lastPage)||1,"max-pages":5,"boundary-numbers":"","direction-links":"",push:""},null,8,["modelValue","max"])])])),e(j)?(b(),$("div",ol,[o(ut,{showing:!0,label:"Please wait...","label-class":"text-teal","label-style":"font-size: 1.1em"},{default:d(()=>[t("div",sl,[o(nt,{color:"negative",thickness:2,size:"2em"})])]),_:1})])):N("v-if",!0),D.value?N("v-if",!0):(b(),$("div",nl,[t("div",il,[t("p",null,"1. "+i(e(s)("starting_balance")),1),t("p",null,i(e(J)((me=(se=e(V))==null?void 0:se.additionalData)==null?void 0:me.startingBalance))+" VND",1)]),t("div",dl,[t("p",null,"2. "+i(e(s)("total_receipt")),1),t("p",null,i(e(J)((Ie=(Ae=e(V))==null?void 0:Ae.additionalData)==null?void 0:Ie.totalReceipt))+" VND",1)]),t("div",cl,[t("p",null,"3. "+i(e(s)("total_payment")),1),t("p",null,i(e(J)((Oe=(Qe=e(V))==null?void 0:Qe.additionalData)==null?void 0:Oe.totalPayment))+" VND",1)]),t("div",rl,[t("p",null,"4. "+i(e(s)("end_balance")),1),t("p",null,i(e(J)((Fe=(Ue=e(V))==null?void 0:Ue.additionalData)==null?void 0:Fe.endBalance))+" VND",1)])])),o(Gt,{ref_key:"refAddCash",ref:_,modelValue:e(R).isShowAddCash,"onUpdate:modelValue":n[8]||(n[8]=l=>e(R).isShowAddCash=l),onClose:m},null,8,["modelValue"]),o(Oa,{ref_key:"refEditDetailCash",ref:K,modelValue:e(R).isShowEditDetailCash,"onUpdate:modelValue":n[9]||(n[9]=l=>e(R).isShowEditDetailCash=l),onClose:m},null,8,["modelValue"])]}),_:1})}}});var Fl=Se(ul,[["__scopeId","data-v-b429ebb4"],["__file","D:/gopms-web/src/modules/cash-transactions/view.vue"]]);export{Fl as default};