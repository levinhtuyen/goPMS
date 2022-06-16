import{aw as U,av as R,_ as k,r as V,i as C,w as P,by as M,K as B,F as j,L as A,M as p,at as Y,I as o,R as i,N as t,bo as D,az as m,O as K,Q as J}from"./index.7efcbe86.js";import{Q as W}from"./QInnerLoading.5fef3982.js";import{Q as G}from"./QSelect.8edab530.js";import{Q as X}from"./QForm.df816fa6.js";import{u as Z}from"./useI18n.6b7b36de.js";import{b as _,u as w,a as x}from"./axiosClient.a0ee23b9.js";import{Q as q}from"./queryKeys.832af9fa.js";import{u as $}from"./useNotify.967ca7e7.js";import{u as ee}from"./useValidate.96008b94.js";import"./QMenu.b19dfcca.js";import"./position-engine.4a23d733.js";import"./selection.6afffe69.js";import"./QItemLabel.938a9258.js";import"./rtl.4b414a6d.js";import"./use-quasar.f3f15168.js";const oe=async n=>{const{data:l}=await _.post("/configuration/hotel/updateHotel",n);return l.data},le=()=>U(oe,{}),se=async()=>{const{data:n}=await _.get("/configuration/hotel/getHotelInfo");return n.data},te=()=>R(q.INFORMATION,se),ae=async()=>{const{data:n}=await _.get("/appendix/getHotelTypeList");return n.data},ne=()=>R(q.HOTEL_TYPE_LIST,ae),ie={setup(){const{hasPermission:n}=w(),{t:l}=Z(),{notifySaveSuccess:v}=$(),e=V(),{mutate:y,isLoading:b}=le(),{data:a,isLoading:s,isFetching:S,refetch:T}=te(),{data:F,isFetching:I,refetch:Q}=ne(),L=C("emitter"),f=V({hotelTypeSn:0,name:"",email:"",phone:"",website:"",address:""});P(()=>Y.global.locale.value,()=>{Q.value()}),M(()=>{var r,c,u,h,d,g;f.value={hotelTypeSn:(r=a.value)==null?void 0:r.hotelTypeSn,name:(c=a.value)==null?void 0:c.name,email:(u=a.value)==null?void 0:u.email,phone:(h=a.value)==null?void 0:h.phone,website:(d=a.value)==null?void 0:d.website,address:(g=a.value)==null?void 0:g.address}});const{isRequiredRules:z,isEmailRules:E,websiteRules:H,isLengthFrom1To100Rules:N,isPhoneRules:O}=ee();return{onSubmit:()=>{var r;(r=e.value)==null||r.validate().then(c=>{if(c)y(f.value,{onSuccess:async()=>{var d;await T.value();const{setLocalStorageWithExpiry:u}=w(),h=(d=JSON.parse(localStorage.getItem(x)||"{}"))==null?void 0:d.expiry;u(x,a.value.name,h),L.emit("changeHotelInfo"),v()}});else return!1})},t:l,isRequiredRules:z,isEmailRules:E,websiteRules:H,isLengthFrom1To100Rules:N,isPhoneRules:O,formValues:f,hotelTypeOptions:F,isFetchingHotelType:I,isLoading:s,isSubmitting:b,isFetching:S,updateInformationFormRef:e,hasPermission:n}}},re={class:"row q-mb-md"},de={class:"text-h5 text-bold"},me={class:"relative-position"},ce={lass:"full-width","full-height":"",class:"q-mt-md row justify-center"},ue={class:"row"},he={class:"col col-12 col-sm-6 q-pr-sm"},pe={class:"text-bold q-ma-xs"},fe={class:"col col-12 col-sm-6 q-pl-sm"},_e={class:"text-bold q-ma-xs"},ve={class:"col col-12 col-sm-6 q-pr-sm"},ye={class:"text-bold q-ma-xs"},be={class:"col col-12 col-sm-6 q-pl-sm"},ge={class:"text-bold q-ma-xs"},Ve={class:"col-12 col-sm-6 q-pr-sm"},we={class:"text-bold q-ma-xs"},xe={class:"col-12 col-sm-6 q-pl-sm"},Re={class:"text-bold q-ma-xs"},qe={class:"col-12 col-md-12 row justify-end q-px-md q-pb-sm"};function Se(n,l,v,e,y,b){const a=B("pms-sections");return j(),A(a,null,{header:p(()=>[o("div",re,[o("div",de,i(e.t("hotel_information")),1)])]),default:p(()=>[o("div",me,[t(W,{showing:e.isFetching,label:"Please","label-class":"text-teal","label-style":"font-size:1.1em"},{default:p(()=>[o("div",ce,[t(D,{color:"negative",thickness:2,size:"2em"})])]),_:1},8,["showing"]),t(X,{ref:"updateInformationFormRef"},{default:p(()=>[o("div",ue,[o("div",he,[o("p",pe,i(e.t("hotel_type"))+"*",1),t(G,{modelValue:e.formValues.hotelTypeSn,"onUpdate:modelValue":l[0]||(l[0]=s=>e.formValues.hotelTypeSn=s),"map-options":"",loading:e.isFetchingHotelType,"option-label":"name","option-value":"sn",options:e.hotelTypeOptions,"emit-value":"",outlined:"",dense:"",clearable:"",label:e.t("select_hotel_type"),"lazy-rules":"",rules:[s=>!!s||e.t("please_select_one_value")]},null,8,["modelValue","loading","options","label","rules"])]),o("div",fe,[o("p",_e,i(e.t("hotel_name"))+"*",1),t(m,{modelValue:e.formValues.name,"onUpdate:modelValue":l[1]||(l[1]=s=>e.formValues.name=s),outlined:"",placeholder:e.t("input_hotel_name"),"lazy-rules":"",dense:"",rules:[...e.isRequiredRules,...e.isLengthFrom1To100Rules]},null,8,["modelValue","placeholder","rules"])]),o("div",ve,[o("p",ye,i(e.t("email"))+"*",1),t(m,{modelValue:e.formValues.email,"onUpdate:modelValue":l[2]||(l[2]=s=>e.formValues.email=s),type:"email",placeholder:e.t("input_email"),"lazy-rules":"",rules:[...e.isRequiredRules,...e.isEmailRules],outlined:"",dense:""},null,8,["modelValue","placeholder","rules"])]),o("div",be,[o("p",ge,i(e.t("hotel_phone"))+"*",1),t(m,{modelValue:e.formValues.phone,"onUpdate:modelValue":l[3]||(l[3]=s=>e.formValues.phone=s),outlined:"",mask:"############",placeholder:e.t("input_hotel_phone"),"lazy-rules":"",rules:[...e.isRequiredRules,...e.isPhoneRules],dense:""},null,8,["modelValue","placeholder","rules"])]),o("div",Ve,[o("p",we,i(e.t("hotel_website")),1),t(m,{modelValue:e.formValues.website,"onUpdate:modelValue":l[4]||(l[4]=s=>e.formValues.website=s),placeholder:e.t("input_hotel_website"),"lazy-rules":"",rules:e.websiteRules,outlined:"",dense:""},null,8,["modelValue","placeholder","rules"])]),o("div",xe,[o("p",Re,i(e.t("hotel_address"))+"*",1),t(m,{modelValue:e.formValues.address,"onUpdate:modelValue":l[5]||(l[5]=s=>e.formValues.address=s),outlined:"",placeholder:e.t("input_hotel_address"),"lazy-rules":"",rules:[...e.isRequiredRules,...e.isLengthFrom1To100Rules],dense:""},null,8,["modelValue","placeholder","rules"])])])]),_:1},512),o("div",qe,[t(J,{class:K(["q-px-lg",e.hasPermission("edit-hotel-information")===!1?"hidden":""]),label:e.t("save"),loading:e.isSubmitting,type:"submit",color:"negative","no-caps":"",onClick:e.onSubmit},null,8,["label","loading","class","onClick"])])])]),_:1})}var je=k(ie,[["render",Se],["__file","D:/gopms-web/src/modules/information/view.vue"]]);export{je as default};