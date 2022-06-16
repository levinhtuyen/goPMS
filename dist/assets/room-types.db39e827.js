var pe=Object.defineProperty,fe=Object.defineProperties;var ye=Object.getOwnPropertyDescriptors;var G=Object.getOwnPropertySymbols;var ve=Object.prototype.hasOwnProperty,he=Object.prototype.propertyIsEnumerable;var K=(t,n,a)=>n in t?pe(t,n,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[n]=a,g=(t,n)=>{for(var a in n||(n={}))ve.call(n,a)&&K(t,a,n[a]);if(G)for(var a of G(n))he.call(n,a)&&K(t,a,n[a]);return t},O=(t,n)=>fe(t,ye(n));import{aF as te,bj as se,_ as ne,J as ae,a as U,r as S,bA as ge,F as R,L as z,M as b,P as u,G as k,W,V as X,N as c,I as d,aO as w,R as C,aI as M,aH as Y,q as Oe,Q as Z,O as Se,aS as Re,aT as Ce,bJ as be,bz as we,i as Te,p as qe,U as ee,aP as Ve,aR as Fe}from"./index.4bd8ab7e.js";import{u as re}from"./useI18n.96209f4d.js";import{Q as oe}from"./QSkeleton.6540a6ab.js";import{Q as Qe}from"./QForm.8a0c543d.js";import{C as xe}from"./ClosePopup.34597da2.js";import{u as Le}from"./useNotify.6f32b3a1.js";import{b as le,u as Me}from"./axiosClient.ad61c203.js";import{Q as T}from"./queryKeys.832af9fa.js";import{u as ue}from"./useRoomTypeListQuery.6ae8a4aa.js";import"./use-quasar.fa06306f.js";const Be=async t=>{const{data:n}=await le.post("/configuration/room/createRoomType",t);return n},ke=()=>{const t=se();return te(Be,{onSuccess:(n,a)=>{const y=t.getQueryData(T.ROOM_TYPES);!y||t.setQueryData(T.ROOM_TYPES,()=>[...y,O(g({},a),{sn:n.sn,numOfRoom:0})])}})},Ie=async t=>{const{data:n}=await le.post("/configuration/room/updateRoomType",t);return n},De=()=>{const t=se(),{findRoomTypeBySn:n}=ue(),a=m=>{const i=t.getQueryData(T.FLOORS),e=n(m.sn);!i||!e||t.setQueryData(T.FLOORS,()=>i.map(v=>O(g({},v),{roomList:v.roomList.map(h=>e.code!==h.roomTypeCode?h:O(g({},h),{roomTypeCode:m.code}))})))},y=m=>{const i=t.getQueryData(T.ROOM_TYPES);!i||t.setQueryData(T.ROOM_TYPES,()=>i.map(e=>e.sn!==m.sn?e:O(g({},m),{numOfRoom:e.numOfRoom})))};return te(Ie,{onSuccess:(m,i)=>{a(i),y(i)}})};const I=t=>(Re("data-v-ae84c5da"),t=t(),Ce(),t),Ae={key:0,class:"wrapper"},Ee={class:"container"},Pe={key:1,class:"wrapper"},Ne={class:"col-12 col-md-12"},Ue={class:"q-ma-none text-weight-bold"},ze=I(()=>d("span",null,"*",-1)),Ye={class:"col-12 col-md-12"},je={class:"q-ma-none text-weight-bold"},$e=I(()=>d("span",null,"*",-1)),He={class:"row col-12"},Je={class:"col-4 q-pr-sm"},Ge={class:"q-ma-none text-weight-bold"},Ke=I(()=>d("span",null,"*",-1)),We={class:"col-4 q-pr-sm"},Xe={class:"q-ma-none text-weight-bold"},Ze={class:"col-4"},eo={class:"q-ma-none text-weight-bold"},oo=I(()=>d("span",null,"*",-1)),to={class:"row justify-end q-gutter-md"},so=ae({props:{roomTypeSn:{type:[String,Number],required:!0}},emits:["onRequestSuccess"],setup(t,{emit:n}){const a=t,{hasPermission:y}=Me(),{notifySaveSuccess:m,notifySaveFailed:i}=Le(),{t:e}=re(),{data:v,isLoading:h,findRoomTypeBySn:f}=ue(),_=U(()=>a.roomTypeSn==="new"?null:f(a.roomTypeSn)),B=ke(),j=De(),$=U(()=>h.value),l=S({numOfAdult:2,numOfChildren:0,numOfBed:1,name:"",code:""});ge(()=>{var o,r,s,p,q,V,F,Q,x,L;l.value={numOfAdult:(r=(o=_.value)==null?void 0:o.numOfAdult)!=null?r:2,numOfChildren:(p=(s=_.value)==null?void 0:s.numOfChildren)!=null?p:0,numOfBed:(V=(q=_.value)==null?void 0:q.numOfBed)!=null?V:1,name:(Q=(F=_.value)==null?void 0:F.name)!=null?Q:"",code:(L=(x=_.value)==null?void 0:x.code)!=null?L:""}});const D=S(null),de=[o=>!!o||e("this_field_is_required"),o=>Number.isInteger(o)||e("this_is_invalid_value"),o=>1<=o||e("the_value_is_from_1_to_10"),o=>o<=10||e("the_value_is_from_1_to_10")],A=S(null),E=S(null),ie=[o=>!!o||e("this_field_is_required"),o=>Number.isInteger(o)||e("this_is_invalid_value"),o=>1<=o||e("the_value_is_from_1_to_10"),o=>o<=10||e("the_value_is_from_1_to_10")],P=S(null),me=[o=>!!o.trim()||e("this_field_is_required"),o=>o.trim().length<=50||e("the_length_is_from_1_to_50_characters"),o=>{var r;return!((r=v.value)!=null&&r.filter(s=>{var p;return s.sn!==((p=_.value)==null?void 0:p.sn)}).some(s=>s.name.toLowerCase()===o.trim().toLowerCase()))||e("already_exists",{name:e("room_type_name").toLowerCase()})}],N=S(null),ce=[o=>!!o.trim()||e("this_field_is_required"),o=>o.trim().length<=10||e("the_length_is_from_1_to_10_characters"),o=>{var r;return!((r=v.value)!=null&&r.filter(s=>{var p;return s.sn!==((p=_.value)==null?void 0:p.sn)}).some(s=>s.code===o.trim()))||e("already_exists",{name:e("room_type_code").toLowerCase()})}],_e=()=>{var r,s,p,q,V,F,Q,x,L,H,J;if((r=D.value)==null||r.validate(),(s=A.value)==null||s.validate(),(p=E.value)==null||p.validate(),(q=P.value)==null||q.validate(),(V=N.value)==null||V.validate(),((F=D.value)==null?void 0:F.error)||((Q=A.value)==null?void 0:Q.error)||((x=E.value)==null?void 0:x.error)||((L=P.value)==null?void 0:L.error)||((H=N.value)==null?void 0:H.error))return;if(a.roomTypeSn==="new"){B.mutate(O(g({},l.value),{code:l.value.code.trim(),name:l.value.name.trim()}),{onSuccess:()=>{m(),n("onRequestSuccess")},onError:()=>{i()}});return}const o=((J=_.value)==null?void 0:J.code)!==l.value.code;j.mutate(O(g({},l.value),{code:l.value.code.trim(),name:l.value.name.trim(),sn:a.roomTypeSn}),{onSuccess:()=>{m(),n("onRequestSuccess",o?l.value.code:void 0)},onError:()=>{i()}})};return(o,r)=>(R(),z(Qe,{onSubmit:_e},{default:b(()=>[u($)?(R(),k("div",Ae,[(R(),k(W,null,X(2,s=>c(oe,{key:s,type:"QInput"})),64)),d("div",Ee,[(R(),k(W,null,X(3,s=>c(oe,{key:s,class:"col",type:"QInput"})),64))])])):(R(),k("div",Pe,[c(Y,{class:"row"},{default:b(()=>[d("div",Ne,[d("p",Ue,[w(C(u(e)("room_type_code")),1),ze]),c(M,{ref_key:"codeField",ref:N,modelValue:l.value.code,"onUpdate:modelValue":r[0]||(r[0]=s=>l.value.code=s),filled:"",dense:"",placeholder:u(e)("input_room_type_code"),"lazy-rules":"",rules:ce},null,8,["modelValue","placeholder"])]),d("div",Ye,[d("p",je,[w(C(u(e)("room_type_name")),1),$e]),c(M,{ref_key:"nameField",ref:P,modelValue:l.value.name,"onUpdate:modelValue":r[1]||(r[1]=s=>l.value.name=s),filled:"",dense:"","lazy-rules":"",placeholder:u(e)("input_room_type_name"),rules:me},null,8,["modelValue","placeholder"])]),d("div",He,[d("div",Je,[d("p",Ge,[w(C(u(e)("number_of_adults")),1),Ke]),c(M,{ref_key:"numOfAdultField",ref:D,modelValue:l.value.numOfAdult,"onUpdate:modelValue":r[2]||(r[2]=s=>l.value.numOfAdult=s),modelModifiers:{number:!0},filled:"",dense:"","lazy-rules":"",rules:de,type:"number"},null,8,["modelValue"])]),d("div",We,[d("p",Xe,C(u(e)("number_of_children")),1),c(M,{ref_key:"numOfChildrenField",ref:A,modelValue:l.value.numOfChildren,"onUpdate:modelValue":r[3]||(r[3]=s=>l.value.numOfChildren=s),modelModifiers:{number:!0},filled:"",dense:"","lazy-rules":"",type:"number"},null,8,["modelValue"])]),d("div",Ze,[d("p",eo,[w(C(u(e)("number_of_beds")),1),oo]),c(M,{ref_key:"numOfBedField",ref:E,modelValue:l.value.numOfBed,"onUpdate:modelValue":r[4]||(r[4]=s=>l.value.numOfBed=s),modelModifiers:{number:!0},filled:"",dense:"","lazy-rules":"",rules:ie,type:"number"},null,8,["modelValue"])])])]),_:1})])),d("div",to,[Oe((R(),z(Z,{dense:"",outline:"","no-caps":"",color:"grey-8",style:{padding:"8px 20px"}},{default:b(()=>[w(C(u(e)("cancel")),1)]),_:1})),[[xe]]),c(Z,{"no-caps":"",label:u(e)("save"),color:"negative",type:"submit",class:Se(u(y)("add-edit-room-type")===!1?"hidden":""),disable:u($),loading:u(B).isLoading.value||u(j).isLoading.value,"data-testId":"submit-btn"},null,8,["label","class","disable","loading"])])]),_:1}))}});var no=ne(so,[["__scopeId","data-v-ae84c5da"],["__file","D:/project_learn/goPMS/src/modules/room-settings/components/room-type-form.vue"]]);const ao={class:"text-h6 text-weight-bold q-pl-md"},ro=ae({setup(t){const n=be(),a=we(),{t:y}=re(),m=S(!1),i=U(()=>{const{roomTypeSn:f}=a.params;return Array.isArray(f)?null:f==="new"?"new":typeof+f=="number"?+f:null}),e=Te("emitter");qe(()=>m.value=!0);const v=()=>{n.replace({path:"/settings/room-settings",query:a.query})},h=f=>{if(f&&a.query.code){n.replace({path:"/settings/room-settings",query:{code:f}});return}m.value=!1,e.emit("addRoomType")};return(f,_)=>u(i)?(R(),z(Fe,{key:0,modelValue:m.value,"onUpdate:modelValue":_[0]||(_[0]=B=>m.value=B),onHide:v},{default:b(()=>[c(Ve,{style:{width:"550px","max-width":"90vw"}},{default:b(()=>[c(Y,{class:"q-pb-none"},{default:b(()=>[d("div",ao,[w(C(u(i)==="new"?u(y)("new_room_type"):u(y)("edit_room_type")),1),ee(" {{ router.options.history.state.code }} ")])]),_:1}),c(Y,{class:"q-pt-none"},{default:b(()=>[c(no,{"room-type-sn":u(i),onOnRequestSuccess:h},null,8,["room-type-sn"])]),_:1})]),_:1})]),_:1},8,["modelValue"])):ee("v-if",!0)}});var go=ne(ro,[["__file","D:/project_learn/goPMS/src/modules/room-settings/views/room-types.vue"]]);export{go as default};
