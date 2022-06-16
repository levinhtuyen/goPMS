import{Q as te}from"./QInnerLoading.5fef3982.js";import{av as oe,aw as se,bh as le,_ as ae,bM as ie,r as u,by as ne,K as re,F as m,L as I,M as s,I as o,R as n,G as S,N as t,aG as x,ay as Q,am as de,aE as F,az as _,U as ue,T as g,q as b,Q as f,O as ce}from"./index.7efcbe86.js";import{Q as me}from"./QSelect.8edab530.js";import{Q as w}from"./QTime.fadff47c.js";import{Q as O}from"./QPopupProxy.9996c4ad.js";import{Q as _e}from"./QForm.df816fa6.js";import{C as U}from"./ClosePopup.145acd40.js";import{b as N,u as fe}from"./axiosClient.a0ee23b9.js";import{Q as z}from"./queryKeys.832af9fa.js";import{u as ve}from"./useI18n.6b7b36de.js";import{u as pe}from"./useNotify.967ca7e7.js";import"./QMenu.b19dfcca.js";import"./position-engine.4a23d733.js";import"./selection.6afffe69.js";import"./QItemLabel.938a9258.js";import"./rtl.4b414a6d.js";import"./TouchPan.87d2034a.js";import"./touch.70a9dd44.js";import"./date.2d51ed98.js";import"./use-quasar.f3f15168.js";const he=async()=>{const{data:r}=await N.get("/configuration/policy/getPolicy");return r.data},ye=()=>oe(z.POLICIES,he),Ve=async r=>{const{data:l}=await N.post("/configuration/policy/updatePolicy",r);return l.data},ge=()=>{const r=le();return se(Ve,{onSuccess:()=>{r.invalidateQueries(z.POLICIES)}})},be={components:{pmsSections:ie},setup(){const{t:r}=ve(),{hasPermission:l}=fe(),{mutate:q,isLoading:e}=ge(),c=u({countrySn:0,currency:"",endDaily:"",endOvernight:"",hotelSn:0,roundUpHour:0,policySn:0,startDaily:"",startOvernight:""});let{data:d,isLoading:D}=ye();const{notifySaveSuccess:a}=pe(),P=u(),v=u(null),L=()=>{v==null||v.value.show()},p=u(null),B=()=>{p==null||p.value.show()},h=u(null),M=()=>{h==null||h.value.show()},y=u(null),A=()=>{y==null||y.value.show()};ne(()=>{var i,V,C,k,H,R,E,j,T;d.value&&(c.value={countrySn:(i=d.value)==null?void 0:i.countrySn,currency:(V=d.value)==null?void 0:V.currency,endDaily:(C=d.value)==null?void 0:C.endDaily,endOvernight:(k=d.value)==null?void 0:k.endOvernight,hotelSn:(H=d.value)==null?void 0:H.hotelSn,roundUpHour:(R=d.value)==null?void 0:R.roundUpHour,policySn:(E=d.value)==null?void 0:E.sn,startDaily:(j=d.value)==null?void 0:j.startDaily,startOvernight:(T=d.value)==null?void 0:T.startOvernight})});const G=u(null),K=[i=>!!i||r("this_field_is_required")],Y=u(null),J=[i=>!!i||r("this_field_is_required")],W=u(null),X=[i=>!!i||r("this_field_is_required")],Z=u(null),$=[i=>!!i||r("this_field_is_required")],ee=()=>{var i;(i=P.value)==null||i.validate().then(V=>{if(V&&Number(c.value.roundUpHour)>1&&Number(c.value.roundUpHour)<59)q(c.value,{onSuccess:()=>{a()}});else return!1})};return{group:u(null),t:r,isLoading:D,currencyOptions:[{label:"VND",value:1}],formValues:c,startDailyField:G,startDailyRules:K,endDailyField:Y,endDailyRules:J,startOvernightField:W,startOvernightRules:X,endOvernightField:Z,endOvernightRules:$,onSubmit:ee,updatePolicyFormRef:P,isSubmitting:e,hasPermission:l,qOvernightStartTimeRef:v,onOpenOvernightStartTimePopUp:L,qOvernightEndTimeRef:p,onOpenOvernightEndTimePopUp:B,qDailyStartTimeRef:h,onOpenDailyStartTimePopUp:M,qDailyEndTimeRef:y,onOpenDailyEndTimePopUp:A}}},we={class:"row q-pb-md"},Oe={class:"text-h5 text-bold"},Ue={key:1,class:""},De={class:"row"},Se={class:"col-12 col-md-6 q-pr-sm"},xe={class:"text-subtitle1 text-white text-bold"},Qe={class:"row items-baseline justify-between"},Fe={class:"text-weight-bold"},qe={class:"row items-baseline justify-between",style:{width:"9em"}},Pe={key:0,class:"row justify-end text-red"},Ce={key:1,class:"row justify-end text-red"},ke={class:"row items-baseline justify-between"},He={class:"text-weight-bold"},Re={class:"row",style:{width:"9em"}},Ee={class:"col-12 col-md-6 q-pl-sm"},je={class:"text-subtitle1 text-white text-bold"},Te={class:"row"},Ie={class:"col-12 col-md-6 q-pa-sm"},Ne={class:"text-bold"},ze={class:"row items-center justify-end"},Le={class:"col-12 col-md-6 q-pa-sm"},Be={class:"text-bold"},Me={class:"row items-center justify-end"},Ae={class:"text-subtitle1 text-white text-bold"},Ge={class:"row"},Ke={class:"col-12 col-md-6 q-pa-sm"},Ye={class:"text-bold"},Je={class:"row items-center justify-end"},We={class:"col-12 col-md-6 q-pa-sm"},Xe={class:"text-bold"},Ze={class:"row items-center justify-end"},$e={class:"flex justify-end"};function et(r,l,q,e,c,d){const D=re("pms-sections");return m(),I(D,null,{header:s(()=>[o("div",we,[o("div",Oe,n(e.t("policy")),1)])]),default:s(()=>[e.isLoading?(m(),I(te,{key:0,showing:"",color:"red"})):(m(),S("div",Ue,[t(_e,{ref:"updatePolicyFormRef"},{default:s(()=>[o("div",De,[o("div",Se,[t(x,{class:"q-mb-sm"},{default:s(()=>[t(Q,{class:"bg-negative q-pa-sm"},{default:s(()=>[o("div",xe,n(e.t("general_setting")),1)]),_:1}),t(de),t(F,{vertical:""},{default:s(()=>[o("div",Qe,[o("p",Fe,n(e.t("hour_round_up")),1),o("div",qe,[o("p",null,[t(_,{modelValue:e.formValues.roundUpHour,"onUpdate:modelValue":l[0]||(l[0]=a=>e.formValues.roundUpHour=a),"lazy-rules":"",dense:"",outlined:"",mask:"##",style:{width:"3.5em"}},null,8,["modelValue"])]),o("p",null,n(e.t("minutes")),1)])]),e.formValues.roundUpHour?e.formValues.roundUpHour<1||e.formValues.roundUpHour>59?(m(),S("p",Ce,n(e.t("the_value_is_from_1_to_59")),1)):ue("v-if",!0):(m(),S("p",Pe,n(e.t("this_field_is_required")),1)),o("div",ke,[o("p",He,n(e.t("select_currency")),1),o("div",Re,[t(me,{modelValue:e.formValues.countrySn,"onUpdate:modelValue":l[1]||(l[1]=a=>e.formValues.countrySn=a),outlined:"",dense:"",style:{width:"100%"},options:e.currencyOptions,"emit-value":"","map-options":"","option-label":"label","option-value":"value"},null,8,["modelValue","options"])])])]),_:1})]),_:1})]),o("div",Ee,[t(x,{class:"q-mb-sm"},{default:s(()=>[t(Q,{class:"bg-negative q-pa-sm"},{default:s(()=>[o("div",je,n(e.t("overnight")),1)]),_:1}),t(F,{vertical:""},{default:s(()=>[o("div",Te,[o("div",Ie,[o("p",Ne,n(e.t("overnight_start_time")),1),t(_,{ref:"startOvernightField",modelValue:e.formValues.startOvernight,"onUpdate:modelValue":l[3]||(l[3]=a=>e.formValues.startOvernight=a),"lazy-rules":"",rules:e.startOvernightRules,mask:"time",dense:"",outlined:"",onFocus:e.onOpenOvernightStartTimePopUp},{append:s(()=>[t(g,{name:"access_time",class:"cursor-pointer"},{default:s(()=>[t(O,{ref:"qOvernightStartTimeRef",cover:"","transition-show":"scale","transition-hide":"scale"},{default:s(()=>[t(w,{modelValue:e.formValues.startOvernight,"onUpdate:modelValue":l[2]||(l[2]=a=>e.formValues.startOvernight=a),mask:"HH:mm",format24h:""},{default:s(()=>[o("div",ze,[b(t(f,{label:"Close",color:"primary",flat:""},null,512),[[U]])])]),_:1},8,["modelValue"])]),_:1},512)]),_:1})]),_:1},8,["modelValue","rules","onFocus"])]),o("div",Le,[o("p",Be,n(e.t("overnight_end_time")),1),t(_,{ref:"endOvernightField",modelValue:e.formValues.endOvernight,"onUpdate:modelValue":l[5]||(l[5]=a=>e.formValues.endOvernight=a),"lazy-rules":"",rules:e.endOvernightRules,mask:"time",dense:"",outlined:"",onFocus:e.onOpenOvernightEndTimePopUp},{append:s(()=>[t(g,{name:"access_time",class:"cursor-pointer"},{default:s(()=>[t(O,{ref:"qOvernightEndTimeRef",cover:"","transition-show":"scale","transition-hide":"scale"},{default:s(()=>[t(w,{modelValue:e.formValues.endOvernight,"onUpdate:modelValue":l[4]||(l[4]=a=>e.formValues.endOvernight=a),mask:"HH:mm",format24h:""},{default:s(()=>[o("div",Me,[b(t(f,{label:"Close",color:"primary",flat:""},null,512),[[U]])])]),_:1},8,["modelValue"])]),_:1},512)]),_:1})]),_:1},8,["modelValue","rules","onFocus"])])])]),_:1})]),_:1}),t(x,{class:"q-mb-md"},{default:s(()=>[t(Q,{class:"bg-negative q-pa-sm"},{default:s(()=>[o("div",Ae,n(e.t("daily")),1)]),_:1}),t(F,{vertical:""},{default:s(()=>[o("div",Ge,[o("div",Ke,[o("p",Ye,n(e.t("daily_start_time")),1),t(_,{ref:"startDailyField",modelValue:e.formValues.startDaily,"onUpdate:modelValue":l[7]||(l[7]=a=>e.formValues.startDaily=a),"lazy-rules":"",rules:e.startDailyRules,mask:"time",dense:"",outlined:"",onFocus:e.onOpenDailyStartTimePopUp},{append:s(()=>[t(g,{name:"access_time",class:"cursor-pointer"},{default:s(()=>[t(O,{ref:"qDailyStartTimeRef",cover:"","transition-show":"scale","transition-hide":"scale"},{default:s(()=>[t(w,{modelValue:e.formValues.startDaily,"onUpdate:modelValue":l[6]||(l[6]=a=>e.formValues.startDaily=a),mask:"HH:mm",format24h:""},{default:s(()=>[o("div",Je,[b(t(f,{label:"Close",color:"primary",flat:""},null,512),[[U]])])]),_:1},8,["modelValue"])]),_:1},512)]),_:1})]),_:1},8,["modelValue","rules","onFocus"])]),o("div",We,[o("p",Xe,n(e.t("daily_end_time")),1),t(_,{ref:"endDailyField",modelValue:e.formValues.endDaily,"onUpdate:modelValue":l[9]||(l[9]=a=>e.formValues.endDaily=a),"lazy-rules":"",rules:e.endDailyRules,mask:"time",dense:"",outlined:"",onFocus:e.onOpenDailyEndTimePopUp},{append:s(()=>[t(g,{name:"access_time",class:"cursor-pointer"},{default:s(()=>[t(O,{ref:"qDailyEndTimeRef",cover:"","transition-show":"scale","transition-hide":"scale"},{default:s(()=>[t(w,{modelValue:e.formValues.endDaily,"onUpdate:modelValue":l[8]||(l[8]=a=>e.formValues.endDaily=a),mask:"HH:mm",format24h:""},{default:s(()=>[o("div",Ze,[b(t(f,{label:"Close",color:"primary",flat:""},null,512),[[U]])])]),_:1},8,["modelValue"])]),_:1},512)]),_:1})]),_:1},8,["modelValue","rules","onFocus"])])])]),_:1})]),_:1})])])]),_:1},512),o("div",$e,[t(f,{"no-caps":"",class:ce(["q-px-lg",e.hasPermission("edit-policy")==!1?"hidden":""]),color:"negative",label:e.t("save"),loading:e.isSubmitting,type:"submit",onClick:e.onSubmit},null,8,["label","loading","class","onClick"])])]))]),_:1})}var bt=ae(be,[["render",et],["__file","D:/gopms-web/src/modules/policies/view.vue"]]);export{bt as default};
