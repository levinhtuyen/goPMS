import{aw as N,bh as A,av as ie,_ as ue,r as y,C as me,a as Z,by as Ue,F as c,G as R,N as n,M as l,ay as qe,I as s,R as i,az as ne,aA as Me,q as k,Q as P,W as se,aF as U,w as he,K as ce,L as _,U as p,bz as B,aD as z,bo as Se,V as be,X as $e,aI as oe,aG as ae,O as de}from"./index.7efcbe86.js";import{Q as Pe,a as xe,b as we}from"./QScrollArea.76ce0d19.js";import{Q as Ve}from"./QInnerLoading.5fef3982.js";import{Q as Re}from"./QTooltip.c975c2a0.js";import{Q as q,a as b}from"./selection.6afffe69.js";import{Q as le}from"./QList.e5651779.js";import{a as Ee,Q as ke}from"./QMenu.b19dfcca.js";import{C as M}from"./ClosePopup.145acd40.js";import{Q as re}from"./QSelect.8edab530.js";import{Q as Fe}from"./QForm.df816fa6.js";import{u as _e}from"./useI18n.6b7b36de.js";import{b as V,u as et}from"./axiosClient.a0ee23b9.js";import{Q as w}from"./queryKeys.832af9fa.js";import{u as ye}from"./useNotify.967ca7e7.js";import{f as ge,c as tt}from"./useFormat.349e799c.js";import{u as De}from"./useValidate.96008b94.js";import"./QResizeObserver.315a2c46.js";import"./QScrollObserver.614f31ec.js";import"./TouchPan.87d2034a.js";import"./touch.70a9dd44.js";import"./position-engine.4a23d733.js";import"./QItemLabel.938a9258.js";import"./rtl.4b414a6d.js";import"./use-quasar.f3f15168.js";const ot=async t=>{const{data:o}=await V.post("/inventory/extraProperty/createProduct",t);return o.data},at=()=>{const t=A();return N(ot,{onSuccess:()=>{t.invalidateQueries(w.PRODUCT_SERVICES),t.invalidateQueries(w.CATEGORY_SERVICES)}})},lt=async t=>{const{data:o}=await V.get(`/inventory/extraProperty/getProductUnitList?keyword=${t}`);return o.data?o.data:[]},Qe=t=>ie([w.UNIT_PRODUCT_SERVICES,t],()=>lt(t.value)),nt=async()=>{const{data:t}=await V.get("/inventory/extraProperty/getCategoryList?limit=-1");return t.data},Ie=()=>ie(w.CATEGORY_SERVICES_ALL,nt),st={props:{openCreateStaffModal:{type:Boolean,default:!1},categorySnDetail:{type:Number,default:0}},emits:["reset"],setup(t,o){const{t:D}=_e(),e=y(),{notifySaveSuccess:x}=ye(),h=y(""),{data:r}=Qe(h),u=y(""),v=y(r),a=y({categorySn:0,name:"",price:0,status:1,productUnitName:""}),g=(f,m)=>{a.value.productUnitName=f,h.value=f,m(()=>{})},C=me({price:!1}),S=f=>{a.value.productUnitName=f,h.value=f,u.value=f},L=f=>{u.value=f||0},{data:Q,isFetching:G}=Ie(),{mutate:j,isLoading:Y}=at(),I=Z(()=>t.openCreateStaffModal);Ue(()=>{var f;a.value.categorySn=t.categorySnDetail!=0?t.categorySnDetail:(f=Q==null?void 0:Q.value)==null?void 0:f[0].sn});const K=f=>{a.value.price=f},{isRequiredRules:H,isLengthFrom1To100Rules:W,isValueMoneyRules:X}=De();return{onSubmit:()=>{var f;(f=e.value)==null||f.validate().then(m=>{if(m)j(a.value,{onSuccess:()=>{x(),setTimeout(()=>{o.emit("reset",!1)},400)}});else return!1})},openStaffModalComputed:I,t:D,isRequiredRules:H,isLengthFrom1To100Rules:W,isValueMoneyRules:X,formValues:a,isLoading:Y,formatMoney:ge,changeMoney:tt,setModel:K,unitOptions:r,filterFn:g,keywordUnit:h,setModelUnit:S,changeModelUnit:L,modelUnit:u,optionsUnit:v,dataCategory:Q,isFetchingCategory:G,addProductFormRef:e,inputActive:C}}},rt={class:"col-12 col-sm-6 col-md-8 q-px-sm"},it={class:"text-bold q-ma-xs"},ct={class:"col-12 col-sm-6 col-md-4 q-px-sm"},dt={class:"text-bold q-ma-xs"},ut={class:"col-12 col-sm-6 col-md-8 q-px-sm"},mt={class:"text-bold q-ma-xs"},_t=["id","value","onChange"],yt={class:"col-12 col-sm-6 col-md-4 q-px-sm"},gt={class:"text-bold q-ma-xs"},vt=U(" No results "),ft={class:"col-12 col-sm-12 col-md-12 q-px-sm"},pt={class:"text-bold q-ma-xs"},Ct={class:"col-12 col-md-12 row justify-end q-px-lg q-pb-md q-gutter-sm"};function ht(t,o,D,e,x,h){return c(),R(se,null,[n(Fe,{ref:"addProductFormRef"},{default:l(()=>[n(qe,{class:"row"},{default:l(()=>[s("div",rt,[s("p",it,i(e.t("product_name"))+"*",1),n(ne,{modelValue:e.formValues.name,"onUpdate:modelValue":o[0]||(o[0]=r=>e.formValues.name=r),filled:"",dense:"",placeholder:e.t("input_product_name"),"lazy-rules":"",rules:[...e.isRequiredRules,...e.isLengthFrom1To100Rules]},null,8,["modelValue","placeholder","rules"])]),s("div",ct,[s("p",dt,i(e.t("product_status")),1),n(Me,{modelValue:e.formValues.status,"onUpdate:modelValue":o[1]||(o[1]=r=>e.formValues.status=r),"false-value":0,"true-value":1,color:"negative"},null,8,["modelValue"])]),s("div",ut,[s("p",mt,i(e.t("unit_price"))+"*",1),n(Ee,{modelValue:e.formValues.price,"onUpdate:modelValue":o[2]||(o[2]=r=>e.formValues.price=r),modelModifiers:{number:!0},filled:"",dense:"",class:"col",suffix:"VND",debounce:"500",rules:[r=>typeof r=="number"||e.t("please_enter_numeric_value"),...e.isValueMoneyRules],type:"number",onBlur:o[3]||(o[3]=r=>e.inputActive.price=!1),onFocus:o[4]||(o[4]=r=>e.inputActive.price=!0)},{control:l(({id:r,modelValue:u,emitValue:v})=>[s("input",{id:r,class:"q-field__input text-right",value:e.inputActive.price?u:e.formatMoney(u),onChange:a=>e.changeMoney(a,u,v)},null,40,_t)]),_:1},8,["modelValue","rules"])]),s("div",yt,[s("p",gt,i(e.t("unit")),1),n(re,{modelValue:e.modelUnit,"onUpdate:modelValue":[o[5]||(o[5]=r=>e.modelUnit=r),e.changeModelUnit],filled:"","use-input":"","hide-selected":"","fill-input":"","input-debounce":"200",options:e.optionsUnit,"option-label":"name","option-value":"sn",dense:"",placeholder:e.t("input_unit"),clearable:"",onFilter:e.filterFn,onInputValue:e.setModelUnit},{"no-option":l(()=>[n(q,null,{default:l(()=>[n(b,{class:"text-grey"},{default:l(()=>[vt]),_:1})]),_:1})]),_:1},8,["modelValue","options","placeholder","onFilter","onInputValue","onUpdate:modelValue"])]),s("div",ft,[s("p",pt,i(e.t("category"))+"*",1),n(re,{modelValue:e.formValues.categorySn,"onUpdate:modelValue":o[6]||(o[6]=r=>e.formValues.categorySn=r),filled:"",dense:"",label:e.t("select_category"),"map-options":"","option-label":"name","option-value":"sn",options:e.dataCategory,"emit-value":"",rules:e.isRequiredRules},null,8,["modelValue","label","options","rules"])])]),_:1})]),_:1},512),s("div",Ct,[k(n(P,{label:e.t("cancel"),dense:"",outline:"","no-caps":"",color:"grey-8",style:{padding:"8px 20px"}},null,8,["label"]),[[M]]),n(P,{label:e.t("save"),class:"q-px-lg",loading:e.isLoading,type:"submit",color:"negative","no-caps":"",onClick:e.onSubmit},null,8,["label","loading","onClick"])])],64)}var St=ue(st,[["render",ht],["__file","D:/gopms-web/src/modules/services/components/create-product-modal.vue"]]);const bt=async()=>{const{data:t}=await V.get("/inventory/extraProperty/getCategoryList?limit=-1");return t.data},Pt=()=>ie(w.CATEGORY_SERVICES,bt),xt=async t=>{const{data:o}=await V.post("/inventory/extraProperty/createCategory",t);return o.data},wt=()=>{const t=A();return N(xt,{onSuccess:()=>{t.invalidateQueries(w.CATEGORY_SERVICES)}})},Vt=async t=>{const{data:o}=await V.post("/inventory/extraProperty/updateCategory",t);return o.data},Rt=()=>{const t=A();return N(Vt,{onSuccess:()=>{t.invalidateQueries(w.CATEGORY_SERVICES)}})},kt=async t=>{const{data:o}=await V.post("/inventory/extraProperty/updateCategoryStatus",t);return o},Ut=()=>{const t=A();return N(kt,{onSuccess:()=>{t.invalidateQueries(w.CATEGORY_SERVICES)}})},qt=async t=>{const{data:o}=await V.post("/inventory/extraProperty/removeCategory",t);return o.data},Mt=()=>{const t=A();return N(qt,{onSuccess:()=>{t.invalidateQueries(w.CATEGORY_SERVICES)}})},Et=async t=>{const{data:o}=await V.get(`/inventory/extraProperty/getProductList?limit=-1&categorySn=${t||""}`);return o.data},Ft=t=>ie([w.PRODUCT_SERVICES,t],()=>Et(t.value)),Dt=async t=>{const{data:o}=await V.post("/inventory/extraProperty/updateProductStatus",t);return o},Qt=()=>{const t=A();return N(Dt,{onSuccess:()=>{t.invalidateQueries(w.PRODUCT_SERVICES)}})},It=async t=>{const{data:o}=await V.post("/inventory/extraProperty/removeProduct",t);return o.data},Nt=()=>{const t=A();return N(It,{onSuccess:()=>{t.invalidateQueries(w.PRODUCT_SERVICES)}})},At=async t=>{const{data:o}=await V.post("/inventory/extraProperty/updateProduct",t);return o.data},Lt=()=>{const t=A();return N(At,{onSuccess:()=>{t.invalidateQueries(w.PRODUCT_SERVICES)}})},Tt={props:{openCreateStaffModal:{type:Boolean,default:!1},productDetail:{type:Object,default:null}},emits:["reset"],setup(t,o){const{t:D}=_e(),e=y(),{notifySaveSuccess:x}=ye(),h=y(""),{data:r}=Qe(h),u=y(""),v=y(r),a=y({productSn:0,categorySn:0,name:"",price:0,status:1,productUnitName:""}),g=(m,F)=>{a.value.productUnitName=m,h.value=m,F(()=>{})},C=me({price:!1}),S=m=>{a.value.productUnitName=m,h.value=m,u.value=m},{data:L,isFetching:Q}=Ie(),{mutate:G,isLoading:j}=Lt(),Y=Z(()=>t.openCreateStaffModal);Ue(()=>{var m,F,T,$,ee,J,O;u.value=(m=t.productDetail)==null?void 0:m.productUnitName,a.value={productSn:(F=t.productDetail)==null?void 0:F.sn,categorySn:(T=t.productDetail)==null?void 0:T.categorySn,name:($=t.productDetail)==null?void 0:$.name,price:(ee=t.productDetail)==null?void 0:ee.price,status:(J=t.productDetail)==null?void 0:J.status,productUnitName:(O=t.productDetail)==null?void 0:O.productUnitName}});const I=m=>{u.value=m},K=m=>{a.value.price=m||0},H=(m,F,T)=>T(m.target.value),{isRequiredRules:W,isLengthFrom1To100Rules:X,isValueMoneyRules:E}=De();return{onSubmit:()=>{var m;(m=e.value)==null||m.validate().then(F=>{if(F)G(a.value,{onSuccess:()=>{x(),setTimeout(()=>{o.emit("reset",!1)},400)}});else return!1})},openStaffModalComputed:Y,t:D,isRequiredRules:W,isLengthFrom1To100Rules:X,isValueMoneyRules:E,formValues:a,isLoading:j,formatMoney:ge,changeMoney:H,setModel:K,changeModelUnit:I,unitOptions:r,filterFn:g,keywordUnit:h,setModelUnit:S,modelUnit:u,optionsUnit:v,dataCategory:L,isFetchingCategory:Q,editProductFormRef:e,inputActive:C}}},Ot={class:"col-12 col-sm-6 col-md-8 q-px-sm"},Bt={class:"text-bold q-ma-xs"},zt={class:"col-12 col-sm-6 col-md-4 q-px-sm"},Gt={class:"text-bold q-ma-xs"},jt={class:"col-12 col-sm-6 col-md-8 q-px-sm"},Yt={class:"text-bold q-ma-xs"},Kt=["id","value","onChange"],Ht={class:"col-12 col-sm-6 col-md-4 q-px-sm"},Wt={class:"text-bold q-ma-xs"},Xt=U(" No results "),Jt={class:"col-12 col-sm-12 col-md-12 q-px-sm"},Zt={class:"text-bold q-ma-xs"},$t={class:"col-12 col-md-12 row justify-end q-px-lg q-pb-md q-gutter-sm"};function eo(t,o,D,e,x,h){return c(),R(se,null,[n(Fe,{ref:"editProductFormRef"},{default:l(()=>[n(qe,{class:"row"},{default:l(()=>[s("div",Ot,[s("p",Bt,i(e.t("product_name"))+"*",1),n(ne,{modelValue:e.formValues.name,"onUpdate:modelValue":o[0]||(o[0]=r=>e.formValues.name=r),filled:"",dense:"",placeholder:e.t("input_product_name"),"lazy-rules":"",rules:[...e.isRequiredRules,...e.isLengthFrom1To100Rules]},null,8,["modelValue","placeholder","rules"])]),s("div",zt,[s("p",Gt,i(e.t("product_status")),1),n(Me,{modelValue:e.formValues.status,"onUpdate:modelValue":o[1]||(o[1]=r=>e.formValues.status=r),"false-value":0,"true-value":1,color:"negative"},null,8,["modelValue"])]),s("div",jt,[s("p",Yt,i(e.t("unit_price"))+"*",1),n(Ee,{modelValue:e.formValues.price,"onUpdate:modelValue":o[2]||(o[2]=r=>e.formValues.price=r),modelModifiers:{number:!0},filled:"",dense:"",class:"col",suffix:"VND",debounce:"500",rules:[r=>typeof r=="number"||e.t("please_enter_numeric_value"),...e.isValueMoneyRules],type:"number",onBlur:o[3]||(o[3]=r=>e.inputActive.price=!1),onFocus:o[4]||(o[4]=r=>e.inputActive.price=!0)},{control:l(({id:r,modelValue:u,emitValue:v})=>[s("input",{id:r,class:"q-field__input text-right",value:e.inputActive.price?u:e.formatMoney(u),onChange:a=>e.changeMoney(a,u,v)},null,40,Kt)]),_:1},8,["modelValue","rules"])]),s("div",Ht,[s("p",Wt,i(e.t("unit")),1),n(re,{modelValue:e.modelUnit,"onUpdate:modelValue":[o[5]||(o[5]=r=>e.modelUnit=r),e.changeModelUnit],filled:"","use-input":"","hide-selected":"","fill-input":"","input-debounce":"200",options:e.optionsUnit,"option-label":"name","option-value":"sn",dense:"",placeholder:e.t("input_unit"),clearable:"",onFilter:e.filterFn,onInputValue:e.setModelUnit},{"no-option":l(()=>[n(q,null,{default:l(()=>[n(b,{class:"text-grey"},{default:l(()=>[Xt]),_:1})]),_:1})]),_:1},8,["modelValue","options","placeholder","onFilter","onInputValue","onUpdate:modelValue"])]),s("div",Jt,[s("p",Zt,i(e.t("category"))+"*",1),n(re,{modelValue:e.formValues.categorySn,"onUpdate:modelValue":o[6]||(o[6]=r=>e.formValues.categorySn=r),filled:"",dense:"","map-options":"",label:e.t("select_category"),"option-label":"name","option-value":"sn",options:e.dataCategory,"emit-value":"",rules:e.isRequiredRules},null,8,["modelValue","label","options","rules"])])]),_:1})]),_:1},512),s("div",$t,[k(n(P,{label:e.t("cancel"),dense:"",outline:"","no-caps":"",color:"grey-8",style:{padding:"8px 20px"}},null,8,["label"]),[[M]]),n(P,{label:e.t("save"),class:"q-px-lg",loading:e.isLoading,type:"submit",color:"negative","no-caps":"",onClick:e.onSubmit},null,8,["label","loading","onClick"])])],64)}var to=ue(Tt,[["render",eo],["__file","D:/gopms-web/src/modules/services/components/edit-product-modal.vue"]]);const oo={components:{CreateProductModal:St,EditProductModal:to},setup(){const{t,locale:o}=_e(),{hasPermission:D}=et(),e=me({isSubmitCreateCategory:!1,visible:!0,isShowInputCreateCategory:!1,openCreateProductModal:!1,isRemoveCategory:!1,isRemoveProduct:!1,openDialogStatusCategory:!1,openDialogStatusProduct:!1}),x=y(""),h=y(1),r=y(),u=y(0),v=y(""),a=y(""),g=y(),{notifySaveSuccess:C,notifyUpdateSuccess:S,notifySaveFailed:L}=ye(),{mutate:Q}=Ut(),{mutate:G}=Qt(),{mutate:j}=Mt(),{mutate:Y}=Nt(),{data:I,isLoading:K,isFetching:H}=Pt(),{mutate:W}=wt(),{mutate:X}=Rt(),E=y({name:""}),f=d=>{v.value=t("are_you_sure_you_want_to_activate_this_category"),e.openDialogStatusCategory=!0,e.isRemoveCategory=!1,g.value=d},m=d=>{v.value=t("are_you_sure_you_want_to_deactivate_this_category"),e.openDialogStatusCategory=!0,e.isRemoveCategory=!1,g.value=d},F=d=>{d.isProduct?v.value=t("all_products_in_this_category_will_also_be_deleted"):v.value=t("are_you_sure_you_want_to_delete_this_category"),e.isRemoveCategory=!0,e.openDialogStatusCategory=!0,g.value=d},T=d=>{a.value=t("are_you_sure_you_want_to_deactivate_this_product"),e.openDialogStatusProduct=!0,g.value=d},$=d=>{a.value=t("are_you_sure_you_want_to_activate_this_product"),e.openDialogStatusProduct=!0,g.value=d},ee=d=>{a.value=t("are_you_sure_you_want_to_delete_this_product"),e.isRemoveProduct=!0,e.openDialogStatusProduct=!0,g.value=d};he(()=>o.value,()=>{v.value=t("all_products_in_this_category_will_also_be_deleted"),v.value=t("are_you_sure_you_want_to_deactivate_this_category"),a.value=t("are_you_sure_you_want_to_deactivate_this_product"),v.value=t("are_you_sure_you_want_to_activate_this_category"),a.value=t("are_you_sure_you_want_to_activate_this_product"),a.value=t("are_you_sure_you_want_to_delete_this_product"),v.value="are_you_sure_you_want_to_delete_this_category"});const J=y({}),O=y(!1),Ne=d=>{O.value=!0,J.value=d},Ae=()=>{Q({categorySn:g.value.sn,status:g.value.status?0:1},{onSuccess:()=>{C(),e.openDialogStatusCategory=!1},onError:()=>{L()}})},Le=()=>{j({categorySn:g.value.sn},{onSuccess:()=>{C(),e.openDialogStatusCategory=!1,u.value=0}})},Te=()=>{e.isShowInputCreateCategory=!e.isShowInputCreateCategory,te()},Oe=d=>{setTimeout(()=>{x.value=d.name,r.value=d.sn},200)},Be=y(null),ve=Z(()=>{var d,Ce;return!!((d=E.value)!=null&&d.name)&&((Ce=E.value)==null?void 0:Ce.name.length)<=50}),ze=y(null),fe=Z(()=>!!x.value&&x.value.length<=50),Ge=Z(()=>I.value&&I.value.length<10?`${50*I.value.length}px`:"600px");he(u,()=>{pe()});const je=()=>{if(e.isSubmitCreateCategory=!0,e.isShowInputCreateCategory=!0,E.value.name=="")pe();else if(ve.value)e.isShowInputCreateCategory=!1,W(E.value,{onSuccess:()=>{C(),te()}});else return!1},te=()=>{E.value.name=""},pe=()=>{e.isSubmitCreateCategory=!1,e.isShowInputCreateCategory=!1},Ye=d=>{if(d.name==x.value)return r.value=!1,!1;if(fe.value)X({categorySn:d.sn,name:x.value},{onSuccess:()=>{S(),r.value=!1}});else return!1},Ke=()=>{te(),e.isShowInputCreateCategory=!1},He=()=>{r.value=!1},We=y(),{data:Xe,isLoading:Je,isFetching:Ze}=Ft(u);return{t,hasPermission:D,formatMoney:ge,nameCategory:x,categorySn:u,isShowInputEditCategory:r,dataCategory:I,createCategoryServiceFormRef:We,formValues:E,isLoadingCategory:K,isFetchingCategory:H,pageCategory:h,addCategory:Te,openModalNewProduct:()=>{e.openCreateProductModal=!0},resetProductModal:d=>{e.openCreateProductModal=d,O.value=d},onChangeProducts:d=>{u.value=d,te()},onEditCategory:Oe,onSubmitEditCategory:Ye,onConfirmStatusCategoryPopup:Ae,onSubmitCreateCategory:je,onCancelSubmitCreateCategory:Ke,onCancelSubmitEditCategory:He,titleStatusCategory:v,ui:e,onActiveCategory:f,onDeactiveCategory:m,onRemoveCategory:F,onConfirmRemoveCategoryPopup:Le,titleStatusProduct:a,openEditProductModal:O,productDetail:J,dataProduct:Xe,isLoadingProduct:Je,isFetchingProduct:Ze,onActiveProduct:T,onDeactiveProduct:$,editProduct:Ne,onConfirmStatusProductPopup:()=>{G({productSn:g.value.sn,status:g.value.status?0:1},{onSuccess:()=>{C(),e.openDialogStatusProduct=!1},onError:()=>{L()}})},onConfirmRemoveProductPopup:()=>{Y({productSn:g.value.sn},{onSuccess:()=>{C(),e.openDialogStatusProduct=!1}})},onRemoveProduct:ee,categoryCreateField:Be,isCategoryRules:ve,categoryEditField:ze,isCategoryEditRules:fe,isHeghtScroll:Ge,thumbStyle:{right:"4px",borderRadius:"5px",backgroundColor:"grey",width:"5px",opacity:"0.75"},barStyle:{right:"2px",borderRadius:"9px",backgroundColor:"grey",width:"9px",opacity:" 0.2"}}}},ao={class:"row q-mb-md"},lo={class:"text-h5 text-bold"},no={class:"row q-col-gutter-lg"},so={class:"col-12 col-md-3"},ro={class:"caption"},io={key:0,class:"text-left"},co={lass:"full-width","full-height":"",class:"q-mt-md row justify-center"},uo={key:0,class:"text-left"},mo={key:1,class:"text-left"},_o={class:"row justify-between items-center"},yo={key:1,lass:"full-width","full-height":"",class:"q-mt-md row justify-center"},go={class:"col-12 col-md-9"},vo={lass:"full-width","full-height":"",class:"q-mt-md row justify-center"},fo={class:"q-md-2"},po={class:"limit-text-50 text-bold"},Co={class:"text-bold"},ho={key:1,lass:"full-width","full-height":"",class:"q-mt-md row justify-center"},So={align:"center"},bo={class:"text-bold"},Po={align:"right",class:"q-gutter-sm"},xo={align:"center"},wo={class:"text-bold"},Vo={align:"right",class:"q-gutter-sm"},Ro={class:"text-h5 q-mt-lg q-mx-lg"},ko={class:"text-h5 q-mt-lg q-mx-lg"};function Uo(t,o,D,e,x,h){const r=ce("create-product-modal"),u=ce("edit-product-modal"),v=ce("pms-sections");return c(),_(v,null,{header:l(()=>[s("div",ao,[s("div",lo,i(e.t("extra_services")),1)])]),default:l(()=>[s("div",no,[p(" Categories "),s("div",so,[n(Pe,{"inline-actions":"",rounded:"",class:"bg-negative text-white"},{action:l(()=>[e.hasPermission("add-edit-delete-category")?(c(),_(P,{key:0,push:"",color:"white","text-color":"negative",label:e.t("add_category"),icon:"add",dense:"","no-caps":"",onClick:e.addCategory},null,8,["label","onClick"])):p("v-if",!0)]),default:l(()=>[s("b",null,i(e.t("categories")),1)]),_:1}),n(we,{visible:e.ui.visible,"thumb-style":e.thumbStyle,"bar-style":e.barStyle,style:$e({height:e.isHeghtScroll})},{default:l(()=>[s("div",ro,[e.ui.isShowInputCreateCategory?(c(),_(ne,{key:0,ref:"categoryCreateField",modelValue:e.formValues.name,"onUpdate:modelValue":o[0]||(o[0]=a=>e.formValues.name=a),borderless:"",autofocus:"",dense:"",error:!e.isCategoryRules&&e.formValues.name!="",class:"full-width q-py-sm q-px-md",placeholder:e.t("input_category_name"),onBlur:e.onSubmitCreateCategory,onKeydown:[B(z(e.onSubmitCreateCategory,["prevent"]),["enter"]),B(z(e.onCancelSubmitCreateCategory,["prevent"]),["esc"]),B(z(e.onCancelSubmitCreateCategory,["prevent"]),["tab"])]},{error:l(()=>[e.formValues.name.length>50?(c(),R("p",io,i(e.t("the_length_is_from_1_to_50_characters")),1)):p("v-if",!0)]),_:1},8,["modelValue","error","placeholder","onBlur","onKeydown"])):p("v-if",!0)]),n(Ve,{showing:e.isLoadingCategory,label:"Please","label-class":"text-teal","label-style":"font-size:1.1em"},{default:l(()=>[s("div",co,[n(Se,{color:"negative",thickness:2,size:"2em"})])]),_:1},8,["showing"]),e.dataCategory?(c(),_(xe,{key:0,offset:50},{default:l(()=>[(c(!0),R(se,null,be(e.dataCategory,(a,g)=>(c(),R("div",{key:g,class:"caption bg-white"},[n(le,null,{default:l(()=>{var C;return[n(q,{disable:!a.status,class:de(e.dataCategory&&((C=e.dataCategory[0])==null?void 0:C.sn)==a.sn&&e.categorySn==0?"active-link":""),clickable:"",active:e.categorySn===a.sn,"active-class":"active-link",onClick:S=>e.onChangeProducts(a.sn)},{default:l(()=>[e.isShowInputEditCategory==a.sn?(c(),_(ne,{key:0,ref_for:!0,ref:"categoryEditField",modelValue:e.nameCategory,"onUpdate:modelValue":o[1]||(o[1]=S=>e.nameCategory=S),borderless:"",autofocus:"",dense:"",error:!e.isCategoryEditRules,class:"full-width",placeholder:e.t("input_category_name"),onBlur:S=>e.onSubmitEditCategory(a),onKeydown:[B(z(S=>e.onSubmitEditCategory(a),["prevent"]),["enter"]),B(z(e.onCancelSubmitEditCategory,["prevent"]),["esc"]),B(z(e.onCancelSubmitEditCategory,["prevent"]),["tab"])]},{error:l(()=>[e.nameCategory?e.nameCategory.length>50?(c(),R("p",mo,i(e.t("the_length_is_from_1_to_50_characters")),1)):p("v-if",!0):(c(),R("p",uo,i(e.t("this_field_is_required")),1))]),_:2},1032,["modelValue","error","placeholder","onBlur","onKeydown"])):(c(),_(b,{key:1},{default:l(()=>[s("div",_o,[s("strong",{class:de(["limit-text-25",a.status?"":"text-grey-5"])},i(a.name),3),n(Re,{anchor:"top middle",self:"bottom middle",offset:[10,10]},{default:l(()=>[s("strong",null,i(a.name),1)]),_:2},1024),e.hasPermission("add-edit-delete-category")||e.hasPermission("activate-deactivate-category")?(c(),_(b,{key:0,avatar:"",class:"customer-operations"},{default:l(()=>[n(P,{"icon-right":"more_vert","no-caps":"",flat:"",dense:""},{default:l(()=>[n(ke,null,{default:l(()=>[n(le,{style:{"min-width":"100px"}},{default:l(()=>[e.hasPermission("add-edit-delete-category")?k((c(),_(q,{key:0,clickable:"",onClick:S=>e.onEditCategory(a)},{default:l(()=>[n(b,null,{default:l(()=>[U(i(e.t("edit")),1)]),_:1})]),_:2},1032,["onClick"])),[[M]]):p("v-if",!0),e.hasPermission("activate-deactivate-category")?k((c(),_(q,{key:1,clickable:""},{default:l(()=>[a.status?(c(),_(b,{key:1,onClick:S=>e.onDeactiveCategory(a)},{default:l(()=>[U(i(e.t("deactivate")),1)]),_:2},1032,["onClick"])):(c(),_(b,{key:0,onClick:S=>e.onActiveCategory(a)},{default:l(()=>[U(i(e.t("activate")),1)]),_:2},1032,["onClick"]))]),_:2},1024)),[[M]]):p("v-if",!0),e.hasPermission("add-edit-delete-category")?k((c(),_(q,{key:2,clickable:""},{default:l(()=>[n(b,{onClick:S=>e.onRemoveCategory(a)},{default:l(()=>[U(i(e.t("delete")),1)]),_:2},1032,["onClick"])]),_:2},1024)),[[M]]):p("v-if",!0)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024)):p("v-if",!0)])]),_:2},1024))]),_:2},1032,["disable","class","active","onClick"])]}),_:2},1024)]))),128))]),_:1})):e.isFetchingCategory?p("v-if",!0):(c(),R("div",yo,i(e.t("no_data")),1))]),_:1},8,["visible","thumb-style","bar-style","style"])]),p(" Products "),s("div",go,[n(Pe,{"inline-actions":"",rounded:"",class:"bg-negative text-white"},{action:l(()=>[e.hasPermission("add-edit-delete-product")?(c(),_(P,{key:0,push:"",color:"white","text-color":"negative",label:e.t("add_product"),icon:"add",dense:"","no-caps":"",onClick:e.openModalNewProduct},null,8,["label","onClick"])):p("v-if",!0)]),default:l(()=>[s("b",null,i(e.t("products")),1)]),_:1}),n(we,{visible:e.ui.visible,style:{height:"600px"},"thumb-style":e.thumbStyle,"bar-style":e.barStyle},{default:l(()=>[n(Ve,{showing:e.isLoadingProduct,label:"Please","label-class":"text-teal","label-style":"font-size:1.1em"},{default:l(()=>[s("div",vo,[n(Se,{color:"negative",thickness:2,size:"2em"})])]),_:1},8,["showing"]),e.dataProduct?(c(),_(xe,{key:0,offset:50},{default:l(()=>[(c(!0),R(se,null,be(e.dataProduct,(a,g)=>(c(),R("div",{key:g,class:"caption bg-white"},[n(le,{padding:""},{default:l(()=>[n(q,{disable:!a.status},{default:l(()=>[n(b,null,{default:l(()=>[s("div",{class:de(["row justify-between",a.status?"":"text-grey-5"])},[s("div",fo,[s("div",po,i(a.name)+" "+i(a.productUnitName?`(${a.productUnitName})`:""),1),n(Re,{anchor:"top middle",self:"bottom middle",offset:[10,10]},{default:l(()=>[s("strong",null,i(a.name)+" "+i(a.productUnitName?`(${a.productUnitName})`:""),1)]),_:2},1024)]),s("div",Co,i(e.formatMoney(a.price))+" VND",1)],2)]),_:2},1024),e.hasPermission("add-edit-delete-product")||e.hasPermission("activate-deactivate-product")?(c(),_(b,{key:0,avatar:""},{default:l(()=>[n(P,{"icon-right":"more_vert","no-caps":"",flat:"",dense:""},{default:l(()=>[n(ke,null,{default:l(()=>[n(le,{style:{"min-width":"100px"}},{default:l(()=>[e.hasPermission("add-edit-delete-product")?k((c(),_(q,{key:0,clickable:""},{default:l(()=>[n(b,{onClick:C=>e.editProduct(a)},{default:l(()=>[U(i(e.t("edit")),1)]),_:2},1032,["onClick"])]),_:2},1024)),[[M]]):p("v-if",!0),e.hasPermission("activate-deactivate-product")?k((c(),_(q,{key:1,clickable:""},{default:l(()=>[a.status?(c(),_(b,{key:1,onClick:C=>e.onActiveProduct(a)},{default:l(()=>[U(i(e.t("deactivate")),1)]),_:2},1032,["onClick"])):(c(),_(b,{key:0,onClick:C=>e.onDeactiveProduct(a)},{default:l(()=>[U(i(e.t("activate")),1)]),_:2},1032,["onClick"]))]),_:2},1024)),[[M]]):p("v-if",!0),e.hasPermission("add-edit-delete-product")?k((c(),_(q,{key:2,clickable:""},{default:l(()=>[n(b,{onClick:C=>e.onRemoveProduct(a)},{default:l(()=>[U(i(e.t("delete")),1)]),_:2},1032,["onClick"])]),_:2},1024)),[[M]]):p("v-if",!0)]),_:2},1024)]),_:2},1024)]),_:2},1024)]),_:2},1024)):p("v-if",!0)]),_:2},1032,["disable"])]),_:2},1024)]))),128))]),_:1})):e.isFetchingProduct?p("v-if",!0):(c(),R("div",ho,i(e.t("no_data")),1))]),_:1},8,["visible","thumb-style","bar-style"])])]),n(oe,{modelValue:e.ui.openDialogStatusCategory,"onUpdate:modelValue":o[2]||(o[2]=a=>e.ui.openDialogStatusCategory=a)},{default:l(()=>[n(ae,{class:"q-pa-lg"},{default:l(()=>[s("div",So,[s("p",bo,i(e.titleStatusCategory),1)]),s("div",Po,[k(n(P,{label:e.t("cancel"),dense:"",outline:"","no-caps":"",color:"grey-8",style:{padding:"4px 12px"}},null,8,["label"]),[[M]]),e.ui.isRemoveCategory?(c(),_(P,{key:1,label:e.t("confirm"),color:"negative",dense:"",style:{width:"100px"},"no-caps":"",onClick:e.onConfirmRemoveCategoryPopup},null,8,["label","onClick"])):(c(),_(P,{key:0,label:e.t("confirm"),color:"negative",style:{width:"100px"},dense:"","no-caps":"",onClick:e.onConfirmStatusCategoryPopup},null,8,["label","onClick"]))])]),_:1})]),_:1},8,["modelValue"]),n(oe,{modelValue:e.ui.openDialogStatusProduct,"onUpdate:modelValue":o[3]||(o[3]=a=>e.ui.openDialogStatusProduct=a)},{default:l(()=>[n(ae,{class:"q-pa-lg"},{default:l(()=>[s("div",xo,[s("p",wo,i(e.titleStatusProduct),1)]),s("div",Vo,[k(n(P,{label:e.t("cancel"),dense:"",outline:"","no-caps":"",color:"grey-8",style:{padding:"4px 12px"}},null,8,["label"]),[[M]]),e.ui.isRemoveProduct?(c(),_(P,{key:1,label:e.t("confirm"),color:"negative",style:{width:"100px"},dense:"","no-caps":"",onClick:e.onConfirmRemoveProductPopup},null,8,["label","onClick"])):(c(),_(P,{key:0,label:e.t("confirm"),color:"negative",style:{width:"100px"},dense:"","no-caps":"",onClick:e.onConfirmStatusProductPopup},null,8,["label","onClick"]))])]),_:1})]),_:1},8,["modelValue"]),n(oe,{modelValue:e.ui.openCreateProductModal,"onUpdate:modelValue":o[4]||(o[4]=a=>e.ui.openCreateProductModal=a)},{default:l(()=>[n(ae,{style:{width:"700px","max-width":"80vw"}},{default:l(()=>[s("div",Ro,i(e.t("new_product")),1),n(r,{"category-sn-detail":e.categorySn,onReset:e.resetProductModal},null,8,["category-sn-detail","onReset"])]),_:1})]),_:1},8,["modelValue"]),n(oe,{modelValue:e.openEditProductModal,"onUpdate:modelValue":o[5]||(o[5]=a=>e.openEditProductModal=a)},{default:l(()=>[n(ae,{style:{width:"700px","max-width":"80vw"}},{default:l(()=>[s("div",ko,i(e.t("edit_product")),1),n(u,{"category-sn-detail":e.categorySn,"product-detail":e.productDetail,onReset:e.resetProductModal},null,8,["category-sn-detail","product-detail","onReset"])]),_:1})]),_:1},8,["modelValue"])]),_:1})}var na=ue(oo,[["render",Uo],["__scopeId","data-v-77195025"],["__file","D:/gopms-web/src/modules/services/view.vue"]]);export{na as default};
