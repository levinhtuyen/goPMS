import{_ as Z,J as ee,aB as Q,r as y,a as O,w as M,F as $,G as R,P as o,L as fe,R as Y,U as De,aC as be,N as x,I as k,aE as he,C as ke,K as Ee,M as B,O as H,Q as K,T as $e,aQ as Ce}from"./index.4bd8ab7e.js";import{Q as de}from"./QSelect.2521a28c.js";import{Q as Ne}from"./QDate.20311372.js";import{Q as Re}from"./QPopupProxy.0d4ba934.js";import{a as qe}from"./QMenu.d60d439b.js";import{A as J}from"./vue3-apexcharts.common.2c595373.js";import{f as P}from"./useFormat.349e799c.js";import{u as te}from"./useI18n.96209f4d.js";import{d as l}from"./date.525ad423.js";import{b as ye,e as ve,d as S}from"./axiosClient.ad61c203.js";import{Q as _e}from"./queryKeys.832af9fa.js";import"./selection.cdf30163.js";import"./QItemLabel.0748896a.js";import"./rtl.4b414a6d.js";import"./use-cache.b0833c75.js";import"./position-engine.e365a736.js";const Fe={key:0},Me={key:1,class:"q-mt-md row justify-center full-width"},Ye=ee({props:{data:{type:[Object,null],required:!0},category:{type:Number,required:!0},isEmpty:{type:Boolean,required:!0},horizontalCol:{type:Array,required:!0},preposition:{type:String,required:!0}},setup(h){const i=h,{t:e}=te(),c=Q(i).data,X=Q(i).isEmpty,E=Q(i).category,_=Q(i).horizontalCol,f=Q(i).preposition,g=y(0),d=y([]),s=y([]),m=O(()=>E.value===1?"VND":"%"),u={chart:{type:"bar",height:350,stacked:!0,toolbar:{show:!1},zoom:{enabled:!1}},legend:{show:!0,onItemHover:{highlightDataSeries:!1},onItemClick:{toggleDataSeries:!1}},labels:[],tooltip:{enabled:!0,custom:({series:v,dataPointIndex:D,w:p})=>{var A,I,U,j,z,L;let w="";const b=`<p class="series"><span class="color-box"> </span> <span class="content-text"><span class="content-label">${e("revenue")} ${e(f.value)}
      ${_.value[D]}:<span><span class="content-value"> ${P((U=(I=c==null?void 0:c.value)==null?void 0:I.detailData[((A=c.value)==null?void 0:A.detailData.length)-2])==null?void 0:U.data[D])} ${m.value}</span> </p>`,C=`<p class="series"><span class="color-box"> </span> <span class="content-text"><span class="content-label">${e("efficiency")} ${e(f.value)}
      ${_.value[D]}:<span><span class="content-value">  ${P((L=(z=c==null?void 0:c.value)==null?void 0:z.detailData[((j=c.value)==null?void 0:j.detailData.length)-1])==null?void 0:L.data[D])} %</span> </p>`,F=E.value===1?b+C:C;return v.map((W,V)=>{w+=`<p class="series"><span class="color-box" style="background-color: ${p.globals.colors[V]}""></span> <span class="content-label">${s.value[V]}:</span><span class="content-value">${P(W[D])} ${m.value}</span></p>`}),' <div class="q-pa-md bg-white text-black col-chart-tooltip">'+F+w+"</div>"}},responsive:[{breakpoint:480,options:{legend:{position:"bottom",offsetX:-10,offsetY:0}}}],plotOptions:{bar:{horizontal:!1,borderRadius:10}},xaxis:{categories:[]},fill:{opacity:1},dataLabels:{enabled:!1}};return M(c,()=>{var v,D,p,w;if(c!=null&&c.value){d.value=(D=(v=c.value)==null?void 0:v.detailData)==null?void 0:D.filter(C=>C.name!=="revenueDetailData"&&C.name!=="efficiencyDetailData");const b=[];f.value=e(f.value),(w=(p=c==null?void 0:c.value)==null?void 0:p.detailData)==null||w.forEach(function(C,F){b[F]=C.name}),s.value=b,u.xaxis.categories=_.value,g.value++}}),M(_.value,()=>{u.xaxis.categories=_.value}),(v,D)=>{var p;return $(),R("div",null,[((p=d.value)==null?void 0:p.length)>0?($(),R("div",Fe,[o(X)?($(),fe(o(J),{key:g.value,height:"300",type:"bar",options:u,series:d.value},null,8,["series"])):($(),R("div",Me,Y(o(e)("no_data")),1))])):De("v-if",!0)])}}});var Xe=Z(Ye,[["__file","D:/project_learn/goPMS/src/modules/statistics-report/components/ColumnChart.vue"]]);const Se={key:0,class:"col-md-4 col-sm-12 col-xs-12"},Oe={key:0},Qe={class:"text-center"},Be={key:1,"full-height":"",class:"q-mt-md row justify-center full-width"},Pe={class:"col-md-8 col-sm-12 col-xs-12 custom-chart"},je={key:0},Le={class:"text-center q-mr-xl q-pr-xl"},Ve={key:1,"full-height":"",class:"q-mt-md row justify-center full-width"},Te=ee({props:{data:{type:[Object,null],required:!0},isEmpty:{type:Object,required:!0}},setup(h){const i=h,{t:e}=te(),c=Q(i).data,X=Q(i).isEmpty;let E=y([]),_=y([]);const f=y([]),g={chart:{id:"apex-donut",type:"pie"},legend:{show:!0,height:"300px",onItemHover:{highlightDataSeries:!1},onItemClick:{toggleDataSeries:!1},formatter:(m,u)=>f.value[u.seriesIndex]},tooltip:{enabled:!0,custom:({series:m,w:u})=>{var p;let v="";return m.map((w,b)=>{v+=`<p class="series"><span class="color-box" style="background-color: ${u.globals.colors[b]}"></span> <span class="content-label ellipsis q-pl-xs">${f.value[b]}:</span><span class="content-value text-right">${P(w)} %</span></p>`}),`
        <div class="q-pa-md bg-white text-black pie-chart-tooltip-efficiency">
          <p class="series"><span class="color-box col-md-2"> </span><span class="content-label ellipsis q-pl-xs col-md-6">${e("total_efficiency")}:</span><span class="content-value col-md-4 text-right"> ${(p=c.value)==null?void 0:p.totalEfficiency} %</span> </p>
          ${v}
        </div>`}}},d={chart:{id:"apex-donut",type:"pie"},legend:{show:!1},labels:[],tooltip:{enabled:!0,custom:({series:m,w:u})=>{var p;let v="";return m.map((w,b)=>{v+=`<p class="series"><span class="color-box col-md-2" style="background-color: ${u.globals.colors[b]}"></span> <span class="content-label ellipsis q-pl-xs col-md-4">${f.value[b]}:</span><span class="content-value col-md-6 text-right">${P(w)} VND</span></p>`}),`
        <div class="q-pa-md bg-white text-black pie-chart-tooltip-revenue">
          <p class="series"><span class="color-box col-md-2"> </span><span class="content-label ellipsis q-pl-xs col-md-4"> ${e("total_revenue")}:</span><span class="content-value col-md-6 text-right"> ${P((p=c.value)==null?void 0:p.totalRevenue)} VND</span> </p>
          ${v}
        </div>`}}};M(c,()=>{var m,u,v,D,p;if(c.value){E.value=((u=(m=c.value)==null?void 0:m.totalEfficiencyList)==null?void 0:u.map(b=>b.value))||[],_.value=((D=(v=c.value)==null?void 0:v.totalRevenueList)==null?void 0:D.map(b=>b.value))||[];const w=[];(p=c.value.totalEfficiencyList)==null||p.forEach(function(b,C){w[C]=b.name}),f.value=w}});const s=y("");return M(()=>be.global.locale.value,m=>{var u;if(c.value){const v=[];(u=c.value.totalEfficiencyList)==null||u.forEach(function(D,p){v[p]=D.name}),f.value=v,s.value=m}}),(m,u)=>($(),R("div",{key:s.value,class:"row"},[o(_).length>0?($(),R("div",Se,[o(X).isRevenueEmpty?($(),R("div",Oe,[x(o(J),{height:"300",options:d,series:o(_)},null,8,["series"]),k("p",Qe,Y(o(e)("chart_label_total_revenue")),1)])):($(),R("div",Be,Y(o(e)("no_data")),1))])):De("v-if",!0),k("div",Pe,[o(X).isEfficiencyEmpty?($(),R("div",je,[x(o(J),{height:"300",options:g,series:o(E)},null,8,["series"]),k("p",Le,Y(o(e)("chart_label_total_efficiency")),1)])):($(),R("div",Ve,Y(o(e)("no_data")),1))])]))}});var Ae=Z(Te,[["__file","D:/project_learn/goPMS/src/modules/statistics-report/components/PieChart.vue"]]);const Ie=async(h,i)=>{if(i.value===2)return!1;const{data:e}=await ye.get("statistics/getRevenueReport",{params:h});return e.data},Ue=(h,i)=>he([_e.REVENUE_REPORT,{params:h}],()=>Ie(h,i)),ze=async(h,i)=>{if(i.value===1)return!1;const{data:e}=await ye.get("statistics/getOccupancyReport",{params:h});return e.data},We=(h,i)=>he([_e.OCCUPANCY_REPORT,{params:h}],()=>ze(h,i)),G=()=>Array.from({length:24},(i,e)=>` ${e!==23?e+1:"00"}:00`);const He={class:"row q-mb-md justify-between"},Ke={key:0,class:"text-h5 text-bold"},Ge={key:1,class:"text-h5 text-bold"},Je={class:"q-gutter-y-sm custom-row rounded-borders"},Ze={class:"row items-center q-mb-md"},et={class:"col-md-2 col-sm-4 col-xs-12 q-pb-sm"},tt={class:"col-md-3 col-sm-2 col-xs-12 q-pb-sm"},at={class:"self-center full-width no-outline",tabindex:"0"},st={class:"col-md-2 col-sm-4 col-xs-12 q-pb-sm"},ot={class:"custom-row rounded-borders q-mb-sm"},lt=ee({setup(h){const i=l.formatDate,{t:e}=te(),c=O(()=>[e("monday"),e("tuesday"),e("wednesday"),e("thursday"),e("friday"),e("saturday"),e("sunday")]),X=O(()=>[e("january"),e("february"),e("march"),e("april"),e("may"),e("june"),e("july"),e("august"),e("september"),e("october"),e("november"),e("december")]),E=y(Date.now()),_=y(null),f=y(0),g=y(1),d=y(G()),s=ke({startDate:Number(l.formatDate(E.value,"X")),endDate:Number(l.formatDate(E.value,"X")),dataFilterBy:1,detailDataBy:1}),m=y(null),u=y(e("at")),{data:v,isFetching:D,refetch:p}=Ue(s,g),{data:w,isFetching:b,refetch:C}=We(s,g),F=O({get:()=>({from:l.formatDate(new Date(s.startDate*1e3),ve),to:l.formatDate(new Date(s.endDate*1e3),ve)}),set:t=>{f.value=null,t?(s.startDate=Number(l.formatDate(new Date(t.from),"X"))||Number(l.formatDate(new Date(t),"X")),s.endDate=Number(l.formatDate(new Date(t.to),"X"))||Number(l.formatDate(new Date(t),"X")),ce(l.formatDate(new Date(t.from||t),S),l.formatDate(new Date(t.to||t),S)),xe(l.formatDate(new Date(t.from||t),"YYYY-MM-DD"),l.formatDate(new Date(t.to||t),"YYYY-MM-DD"))):(s.startDate=s.endDate=Number(l.formatDate(E.value,"X")),f.value=0)}}),A=O(()=>[{value:0,name:e("today")},{value:1,name:e("this_week")},{value:2,name:e("this_month")},{value:3,name:e("previous_month")},{value:4,name:e("this_quarter")},{value:5,name:e("previous_quarter")},{value:6,name:e("this_year")},{value:7,name:e("last_year")}]),I=O(()=>[{value:1,name:e("booking_type")},{value:2,name:e("booking_source")}]);M(f,t=>{switch(t){case 0:s.startDate=s.endDate=Number(l.formatDate(E.value,"X")),d.value=G();break;case 1:L();break;case 2:W();break;case 3:V();break;case 4:ae();break;case 5:se();break;case 6:oe();break;case 7:le();break}ce(l.formatDate(new Date(s.startDate*1e3),S),l.formatDate(new Date(s.endDate*1e3),S))}),M(g,t=>{switch(f.value=0,s.startDate=Number(l.formatDate(E.value,"X")),s.endDate=Number(l.formatDate(E.value,"X")),s.dataFilterBy=1,s.detailDataBy=1,t){case 1:p.value();break;case 2:C.value();break}}),M(D,()=>{m.value=v.value}),M(b,()=>{m.value=w.value});const U=()=>{_==null||_.value.show()},j=(t=[])=>t.some(a=>a.value!==0),z=(t=[])=>t.some(a=>a.data.some(n=>n!==0)),L=()=>{const t=new Date,a=t.getDate()-t.getDay(),n=a+6;var r=new Date(new Date().setDate(a+1)),N=new Date(new Date().setDate(n+1));s.startDate=Number(l.formatDate(r,"X")),s.endDate=Number(l.formatDate(N,"X")),d.value=c.value},W=()=>{const t=new Date,a=new Date(t.getFullYear(),t.getMonth(),1),n=new Date(t.getFullYear(),t.getMonth()+1,0);s.startDate=Number(l.formatDate(a,"X")),s.endDate=Number(l.formatDate(n,"X")),d.value=ne(t.getFullYear(),t.getMonth())},V=()=>{const t=new Date,a=new Date(t.getFullYear(),t.getMonth()-1,1),n=new Date(t.getFullYear(),t.getMonth(),0);s.startDate=Number(l.formatDate(a,"X")),s.endDate=Number(l.formatDate(n,"X")),d.value=ne(t.getFullYear(),t.getMonth()-1)},ae=()=>{var t=new Date,a=Math.floor(t.getMonth()/3),n=new Date(t.getFullYear(),a*3,1),r=new Date(n.getFullYear(),n.getMonth()+3,0);s.startDate=Number(l.formatDate(n,"X")),s.endDate=Number(l.formatDate(r,"X")),d.value=re(a+1).value},se=()=>{var t=new Date,a=Math.floor(t.getMonth()/3)*3+1,n=new Date(t.getFullYear(),a*3,1),r=new Date(n.getFullYear(),n.getMonth()+3,0);s.startDate=Number(l.formatDate(n,"X")),s.endDate=Number(l.formatDate(r,"X")),d.value=re(a).value},oe=()=>{const t=new Date(new Date().getFullYear(),0,1),a=new Date(new Date().getFullYear(),11,31);s.startDate=Number(l.formatDate(t,"X")),s.endDate=Number(l.formatDate(a,"X")),d.value=X.value},le=()=>{const t=new Date(new Date().getFullYear()-1,0,1),a=new Date(new Date().getFullYear()-1,11,31);s.startDate=Number(l.formatDate(t,"X")),s.endDate=Number(l.formatDate(a,"X")),d.value=X.value},ne=(t,a)=>{const n=new Date(t,a,1),r=[];for(;n.getMonth()===a;){const[N,q]=i(n,S).split("/");r.push(`${N}/${q}`),n.setDate(n.getDate()+1)}return r},ge=(t,a)=>{const n=new Date(t.getTime()),r=[];for(;n<=a;){const[N,q]=i(n,S).split("/");r.push(`${N}/${q}`),n.setDate(n.getDate()+1)}return r},re=t=>O(()=>{switch(t){case 1:return[e("january"),e("february"),e("march")];case 2:return[e("april"),e("may"),e("june")];case 3:return[e("july"),e("august"),e("september")];case 4:return[e("october"),e("november"),e("december")];default:return[]}}),ce=(t,a)=>{const[n,r,N]=t.split("/"),[q,T,ie]=a.split("/");return n===q&&r===T?u.value="at":n!==q&&r===T?u.value="on":u.value="in",u.value},we=y("");M(()=>be.global.locale.value,t=>{switch(we.value=t,p.value(),C.value(),f.value){case 0:s.startDate=s.endDate=Number(l.formatDate(E.value,"X")),d.value=G();break;case 1:L();break;case 2:W();break;case 3:V();break;case 4:ae();break;case 5:se();break;case 6:oe();break;case 7:le();break}});const xe=(t,a)=>{const[n,r,N]=t.split("-"),[q,T,ie]=a.split("-"),ue=(new Date(a).getTime()-new Date(t).getTime())/(1e3*3600*24);if(N===ie&&r===T)d.value=G();else if(ue<31)d.value=ge(new Date(t),new Date(a));else if(ue>=31){let me=[];me=X.value.filter((nt,pe)=>pe>=Number(r)-1&&pe<=Number(T)-1),d.value=me}};return(t,a)=>{const n=Ee("pms-sections");return $(),fe(n,null,{header:B(()=>[k("div",He,[g.value===1?($(),R("div",Ke,Y(o(e)("statistics_revenue_report")),1)):($(),R("div",Ge,Y(o(e)("statistics_occupancy_report")),1)),k("div",Je,[x(K,{label:o(e)("revenue"),class:H(["col custom-tab text-bold",g.value===1?"active":""]),"no-caps":"",dense:"",onClick:a[0]||(a[0]=r=>g.value=1)},null,8,["label","class"]),x(K,{label:o(e)("occupancy"),class:H(["col custom-tab text-bold",g.value===2?"active":""]),"no-caps":"",dense:"",onClick:a[1]||(a[1]=r=>g.value=2)},null,8,["label","class"])])]),k("div",Ze,[k("div",et,[x(de,{modelValue:f.value,"onUpdate:modelValue":a[2]||(a[2]=r=>f.value=r),class:"q-mr-md",options:o(A),label:o(e)("select_time_range"),filled:"",dense:"","emit-value":"","map-options":"","input-debounce":"0","option-value":"value","option-label":"name"},null,8,["modelValue","options","label"])]),k("div",tt,[x(qe,{placeholder:o(e)("select_date_time"),dense:"","stack-label":"",filled:"",class:"block q-mr-md",onFocus:U},{control:B(()=>[k("div",at,Y(o(i)(o(F).from,o(S)))+" - "+Y(o(i)(o(F).to,o(S))),1)]),prepend:B(()=>[x($e,{name:"event",class:"no-pointer-events"},{default:B(()=>[x(Re,{ref_key:"qDateRef",ref:_,"transition-show":"scale","transition-hide":"scale"},{default:B(()=>[x(Ne,{modelValue:o(F),"onUpdate:modelValue":a[3]||(a[3]=r=>Ce(F)?F.value=r:null),range:""},null,8,["modelValue"])]),_:1},512)]),_:1})]),_:1},8,["placeholder"])]),k("div",st,[x(de,{modelValue:o(s).detailDataBy,"onUpdate:modelValue":a[4]||(a[4]=r=>o(s).detailDataBy=r),class:"q-mr-md",options:o(I),filled:"",dense:"","emit-value":"","map-options":"","input-debounce":"0","option-value":"value","option-label":"name"},null,8,["modelValue","options"])]),k("div",ot,[x(K,{label:o(e)("checked_in_time"),class:H(["col custom-tab text-bold",o(s).dataFilterBy===1?"active":""]),"no-caps":"",dense:"",onClick:a[5]||(a[5]=r=>o(s).dataFilterBy=1)},null,8,["label","class"]),x(K,{label:o(e)("checked_out_time"),class:H(["col custom-tab text-bold",o(s).dataFilterBy===2?"active":""]),"no-caps":"",dense:"",onClick:a[6]||(a[6]=r=>o(s).dataFilterBy=2)},null,8,["label","class"])])])]),default:B(()=>{var r,N,q;return[k("div",null,[k("div",null,[x(Ae,{data:m.value,"is-empty":{isEfficiencyEmpty:j((r=m.value)==null?void 0:r.totalEfficiencyList),isRevenueEmpty:j((N=m.value)==null?void 0:N.totalRevenueList)}},null,8,["data","is-empty"])]),k("div",null,[x(Xe,{data:m.value,category:g.value,"is-empty":z((q=m.value)==null?void 0:q.detailData),"horizontal-col":d.value,preposition:u.value},null,8,["data","category","is-empty","horizontal-col","preposition"])])])]}),_:1})}}});var xt=Z(lt,[["__scopeId","data-v-c3eab8d2"],["__file","D:/project_learn/goPMS/src/modules/statistics-report/view.vue"]]);export{xt as default};