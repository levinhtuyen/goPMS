var Et=Object.defineProperty,Ft=Object.defineProperties;var Rt=Object.getOwnPropertyDescriptors;var it=Object.getOwnPropertySymbols;var Lt=Object.prototype.hasOwnProperty,Ht=Object.prototype.propertyIsEnumerable;var rt=(e,r,a)=>r in e?Et(e,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):e[r]=a,z=(e,r)=>{for(var a in r||(r={}))Lt.call(r,a)&&rt(e,a,r[a]);if(it)for(var a of it(r))Ht.call(r,a)&&rt(e,a,r[a]);return e},K=(e,r)=>Ft(e,Rt(r));import{c as vt,d as Tt,aX as Pt,f as Dt,aY as $t,a as d,s as Nt,g as Qe,b as g,T as Re,aZ as Kt,a_ as jt,a0 as ue,aR as Qt,r as R,w as ge,n as G,a$ as Ut,b0 as Wt,b1 as Xt,b2 as Yt,o as mt,b3 as Zt,a2 as St,a3 as Gt,b4 as Jt,a5 as el,b5 as ct,b6 as Ie,b7 as tl,b8 as ll,aI as ul,aL as Ne,a4 as nl,b9 as ol,aU as Se,ba as st,$ as al,bb as il,E as rl}from"./index.7efcbe86.js";import{Q as cl,a as sl}from"./QMenu.b19dfcca.js";import{a as dl,Q as fl}from"./selection.6afffe69.js";import{Q as vl}from"./QItemLabel.938a9258.js";import{r as je}from"./rtl.4b414a6d.js";const ml={xs:8,sm:10,md:14,lg:20,xl:24};var Sl=vt({name:"QChip",props:K(z(z({},Tt),Pt),{dense:Boolean,icon:String,iconRight:String,iconRemove:String,iconSelected:String,label:[String,Number],color:String,textColor:String,modelValue:{type:Boolean,default:!0},selected:{type:Boolean,default:null},square:Boolean,outline:Boolean,clickable:Boolean,removable:Boolean,tabindex:[String,Number],disable:Boolean,ripple:{type:[Boolean,Object],default:!0}}),emits:["update:modelValue","update:selected","remove","click"],setup(e,{slots:r,emit:a}){const{proxy:{$q:w}}=Qe(),_=Dt(e,w),i=$t(e,ml),O=d(()=>e.selected===!0||e.icon!==void 0),h=d(()=>e.selected===!0?e.iconSelected||w.iconSet.chip.selected:e.icon),y=d(()=>e.iconRemove||w.iconSet.chip.remove),p=d(()=>e.disable===!1&&(e.clickable===!0||e.selected!==null)),c=d(()=>{const V=e.outline===!0&&e.color||e.textColor;return"q-chip row inline no-wrap items-center"+(e.outline===!1&&e.color!==void 0?` bg-${e.color}`:"")+(V?` text-${V} q-chip--colored`:"")+(e.disable===!0?" disabled":"")+(e.dense===!0?" q-chip--dense":"")+(e.outline===!0?" q-chip--outline":"")+(e.selected===!0?" q-chip--selected":"")+(p.value===!0?" q-chip--clickable cursor-pointer non-selectable q-hoverable":"")+(e.square===!0?" q-chip--square":"")+(_.value===!0?" q-chip--dark q-dark":"")}),k=d(()=>e.disable===!0?{tabindex:-1,"aria-disabled":"true"}:{tabindex:e.tabindex||0});function I(V){V.keyCode===13&&m(V)}function m(V){e.disable||(a("update:selected",!e.selected),a("click",V))}function H(V){(V.keyCode===void 0||V.keyCode===13)&&(ue(V),e.disable===!1&&(a("update:modelValue",!1),a("remove")))}function L(){const V=[];p.value===!0&&V.push(g("div",{class:"q-focus-helper"})),O.value===!0&&V.push(g(Re,{class:"q-chip__icon q-chip__icon--left",name:h.value}));const Q=e.label!==void 0?[g("div",{class:"ellipsis"},[e.label])]:void 0;return V.push(g("div",{class:"q-chip__content col row no-wrap items-center q-anchor--skip"},Kt(r.default,Q))),e.iconRight&&V.push(g(Re,{class:"q-chip__icon q-chip__icon--right",name:e.iconRight})),e.removable===!0&&V.push(g(Re,K(z({class:"q-chip__icon q-chip__icon--remove cursor-pointer",name:y.value},k.value),{onClick:H,onKeyup:H}))),V}return()=>{if(e.modelValue===!1)return;const V={class:c.value,style:i.value};return p.value===!0&&Object.assign(V,k.value,{onClick:m,onKeyup:I}),Nt("div",V,L(),"ripple",e.ripple!==!1&&e.disable!==!0,()=>[[jt,e.ripple]])}}});const j=1e3,gl=["start","center","end","start-force","center-force","end-force"],gt=Array.prototype.filter,hl=window.getComputedStyle(document.body).overflowAnchor===void 0?Qt:function(e,r){requestAnimationFrame(()=>{if(e===void 0)return;const a=e.children||[];gt.call(a,_=>_.dataset&&_.dataset.qVsAnchor!==void 0).forEach(_=>{delete _.dataset.qVsAnchor});const w=a[r];w&&w.dataset&&(w.dataset.qVsAnchor="")})};function he(e,r){return e+r}function Ke(e,r,a,w,_,i,O,h){const y=e===window?document.scrollingElement||document.documentElement:e,p=_===!0?"offsetWidth":"offsetHeight",c={scrollStart:0,scrollViewSize:-O-h,scrollMaxSize:0,offsetStart:-O,offsetEnd:-h};if(_===!0?(e===window?(c.scrollStart=window.pageXOffset||window.scrollX||document.body.scrollLeft||0,c.scrollViewSize+=document.documentElement.clientWidth):(c.scrollStart=y.scrollLeft,c.scrollViewSize+=y.clientWidth),c.scrollMaxSize=y.scrollWidth,i===!0&&(c.scrollStart=(je===!0?c.scrollMaxSize-c.scrollViewSize:0)-c.scrollStart)):(e===window?(c.scrollStart=window.pageYOffset||window.scrollY||document.body.scrollTop||0,c.scrollViewSize+=document.documentElement.clientHeight):(c.scrollStart=y.scrollTop,c.scrollViewSize+=y.clientHeight),c.scrollMaxSize=y.scrollHeight),a!==null)for(let k=a.previousElementSibling;k!==null;k=k.previousElementSibling)k.classList.contains("q-virtual-scroll--skip")===!1&&(c.offsetStart+=k[p]);if(w!==null)for(let k=w.nextElementSibling;k!==null;k=k.nextElementSibling)k.classList.contains("q-virtual-scroll--skip")===!1&&(c.offsetEnd+=k[p]);if(r!==e){const k=y.getBoundingClientRect(),I=r.getBoundingClientRect();_===!0?(c.offsetStart+=I.left-k.left,c.offsetEnd-=I.width):(c.offsetStart+=I.top-k.top,c.offsetEnd-=I.height),e!==window&&(c.offsetStart+=c.scrollStart),c.offsetEnd+=c.scrollMaxSize-c.offsetStart}return c}function dt(e,r,a,w){r==="end"&&(r=(e===window?document.body:e)[a===!0?"scrollWidth":"scrollHeight"]),e===window?a===!0?(w===!0&&(r=(je===!0?document.body.scrollWidth-document.documentElement.clientWidth:0)-r),window.scrollTo(r,window.pageYOffset||window.scrollY||document.body.scrollTop||0)):window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,r):a===!0?(w===!0&&(r=(je===!0?e.scrollWidth-e.offsetWidth:0)-r),e.scrollLeft=r):e.scrollTop=r}function pe(e,r,a,w){if(a>=w)return 0;const _=r.length,i=Math.floor(a/j),O=Math.floor((w-1)/j)+1;let h=e.slice(i,O).reduce(he,0);return a%j!==0&&(h-=r.slice(i*j,a).reduce(he,0)),w%j!==0&&w!==_&&(h-=r.slice(w,O*j).reduce(he,0)),h}const ht={virtualScrollSliceSize:{type:[Number,String],default:null},virtualScrollSliceRatioBefore:{type:[Number,String],default:1},virtualScrollSliceRatioAfter:{type:[Number,String],default:1},virtualScrollItemSize:{type:[Number,String],default:24},virtualScrollStickySizeStart:{type:[Number,String],default:0},virtualScrollStickySizeEnd:{type:[Number,String],default:0},tableColspan:[Number,String]},pl=Object.keys(ht),yl=z({virtualScrollHorizontal:Boolean,onVirtualScroll:Function},ht);function bl({virtualScrollLength:e,getVirtualScrollTarget:r,getVirtualScrollEl:a,virtualScrollItemSizeComputed:w}){const _=Qe(),{props:i,emit:O,proxy:h}=_,{$q:y}=h;let p,c,k,I=[],m;const H=R(0),L=R(0),V=R({}),Q=R(null),P=R(null),Y=R(null),B=R({from:0,to:0}),M=d(()=>i.tableColspan!==void 0?i.tableColspan:100);w===void 0&&(w=d(()=>i.virtualScrollItemSize));const X=d(()=>w.value+";"+i.virtualScrollHorizontal),ye=d(()=>X.value+";"+i.virtualScrollSliceRatioBefore+";"+i.virtualScrollSliceRatioAfter);ge(ye,()=>{Z()}),ge(X,ne);function ne(){Ce(c,!0)}function be(l){Ce(l===void 0?c:l)}function J(l,n){const f=r();if(f==null||f.nodeType===8)return;const q=Ke(f,a(),Q.value,P.value,i.virtualScrollHorizontal,y.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd);k!==q.scrollViewSize&&Z(q.scrollViewSize),oe(f,q,Math.min(e.value-1,Math.max(0,parseInt(l,10)||0)),0,gl.indexOf(n)>-1?n:c>-1&&l>c?"end":"start")}function U(){const l=r();if(l==null||l.nodeType===8)return;const n=Ke(l,a(),Q.value,P.value,i.virtualScrollHorizontal,y.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd),f=e.value-1,q=n.scrollMaxSize-n.offsetStart-n.offsetEnd-L.value;if(p===n.scrollStart)return;if(n.scrollMaxSize<=0){oe(l,n,0,0);return}k!==n.scrollViewSize&&Z(n.scrollViewSize),we(B.value.from);const E=Math.floor(n.scrollMaxSize-Math.max(n.scrollViewSize,n.offsetEnd)-Math.min(m[f],n.scrollViewSize/2));if(E>0&&Math.ceil(n.scrollStart)>=E){oe(l,n,f,n.scrollMaxSize-n.offsetEnd-I.reduce(he,0));return}let b=0,S=n.scrollStart-n.offsetStart,F=S;if(S<=q&&S+n.scrollViewSize>=H.value)S-=H.value,b=B.value.from,F=S;else for(let v=0;S>=I[v]&&b<f;v++)S-=I[v],b+=j;for(;S>0&&b<f;)S-=m[b],S>-n.scrollViewSize?(b++,F=S):F=m[b]+S;oe(l,n,b,F)}function oe(l,n,f,q,E){const b=typeof E=="string"&&E.indexOf("-force")>-1,S=b===!0?E.replace("-force",""):E,F=S!==void 0?S:"start";let v=Math.max(0,f-V.value[F]),D=v+V.value.total;D>e.value&&(D=e.value,v=Math.max(0,D-V.value.total)),p=n.scrollStart;const ie=v!==B.value.from||D!==B.value.to;if(ie===!1&&S===void 0){_e(f);return}const{activeElement:xe}=document,W=Y.value;ie===!0&&W!==null&&W!==xe&&W.contains(xe)===!0&&(W.addEventListener("focusout",Ve),setTimeout(()=>{W!==void 0&&W.removeEventListener("focusout",Ve)})),hl(W,f-v);const Me=S!==void 0?m.slice(v,f).reduce(he,0):0;if(ie===!0){const ee=D>=B.value.from&&v<=B.value.to?B.value.to:D;B.value={from:v,to:ee},H.value=pe(I,m,0,v),L.value=pe(I,m,D,e.value),requestAnimationFrame(()=>{B.value.to!==D&&p===n.scrollStart&&(B.value={from:B.value.from,to:D},L.value=pe(I,m,D,e.value))})}requestAnimationFrame(()=>{if(p!==n.scrollStart)return;ie===!0&&we(v);const ee=m.slice(v,f).reduce(he,0),re=ee+n.offsetStart+H.value,Oe=re+m[f];let qe=re+q;if(S!==void 0){const Le=ee-Me,$=n.scrollStart+Le;qe=b!==!0&&$<re&&Oe<$+n.scrollViewSize?$:S==="end"?Oe-n.scrollViewSize:re-(S==="start"?0:Math.round((n.scrollViewSize-m[f])/2))}p=qe,dt(l,qe,i.virtualScrollHorizontal,y.lang.rtl),_e(f)})}function we(l){const n=Y.value;if(n){const f=gt.call(n.children,v=>v.classList&&v.classList.contains("q-virtual-scroll--skip")===!1),q=f.length,E=i.virtualScrollHorizontal===!0?v=>v.getBoundingClientRect().width:v=>v.offsetHeight;let b=l,S,F;for(let v=0;v<q;){for(S=E(f[v]),v++;v<q&&f[v].classList.contains("q-virtual-scroll--with-prev")===!0;)S+=E(f[v]),v++;F=S-m[b],F!==0&&(m[b]+=F,I[Math.floor(b/j)]+=F),b++}}}function Ve(){Y.value!==void 0&&Y.value.focus()}function Ce(l,n){const f=1*w.value;(n===!0||Array.isArray(m)===!1)&&(m=[]);const q=m.length;m.length=e.value;for(let b=e.value-1;b>=q;b--)m[b]=f;const E=Math.floor((e.value-1)/j);I=[];for(let b=0;b<=E;b++){let S=0;const F=Math.min((b+1)*j,e.value);for(let v=b*j;v<F;v++)S+=m[v];I.push(S)}c=-1,p=void 0,H.value=pe(I,m,0,B.value.from),L.value=pe(I,m,B.value.to,e.value),l>=0?(we(B.value.from),G(()=>{J(l)})):ae()}function Z(l){if(l===void 0&&typeof window!="undefined"){const S=r();S!=null&&S.nodeType!==8&&(l=Ke(S,a(),Q.value,P.value,i.virtualScrollHorizontal,y.lang.rtl,i.virtualScrollStickySizeStart,i.virtualScrollStickySizeEnd).scrollViewSize)}k=l;const n=parseFloat(i.virtualScrollSliceRatioBefore)||0,f=parseFloat(i.virtualScrollSliceRatioAfter)||0,q=1+n+f,E=l===void 0||l<=0?1:Math.ceil(l/w.value),b=Math.max(1,E,Math.ceil((i.virtualScrollSliceSize>0?i.virtualScrollSliceSize:10)/q));V.value={total:Math.ceil(b*q),start:Math.ceil(b*n),center:Math.ceil(b*(.5+n)),end:Math.ceil(b*(1+n)),view:E}}function Ae(l,n){const f=i.virtualScrollHorizontal===!0?"width":"height",q={["--q-virtual-scroll-item-"+f]:w.value+"px"};return[l==="tbody"?g(l,{class:"q-virtual-scroll__padding",key:"before",ref:Q},[g("tr",[g("td",{style:z({[f]:`${H.value}px`},q),colspan:M.value})])]):g(l,{class:"q-virtual-scroll__padding",key:"before",ref:Q,style:z({[f]:`${H.value}px`},q)}),g(l,{class:"q-virtual-scroll__content",key:"content",ref:Y,tabindex:-1},n.flat()),l==="tbody"?g(l,{class:"q-virtual-scroll__padding",key:"after",ref:P},[g("tr",[g("td",{style:z({[f]:`${L.value}px`},q),colspan:M.value})])]):g(l,{class:"q-virtual-scroll__padding",key:"after",ref:P,style:z({[f]:`${L.value}px`},q)})]}function _e(l){c!==l&&(i.onVirtualScroll!==void 0&&O("virtual-scroll",{index:l,from:B.value.from,to:B.value.to-1,direction:l<c?"decrease":"increase",ref:h}),c=l)}Z();const ae=Ut(U,y.platform.is.ios===!0?120:35);Wt(()=>{Z()});let ke=!1;return Xt(()=>{ke=!0}),Yt(()=>{if(ke!==!0)return;const l=r();p!==void 0&&l!==void 0&&l!==null&&l.nodeType!==8?dt(l,p,i.virtualScrollHorizontal,y.lang.rtl):J(c)}),mt(()=>{ae.cancel()}),Object.assign(h,{scrollTo:J,reset:ne,refresh:be}),{virtualScrollSliceRange:B,virtualScrollSliceSizeComputed:V,setVirtualScrollSize:Z,onVirtualScrollEvt:ae,localResetVirtualScroll:Ce,padVirtualScroll:Ae,scrollTo:J,reset:ne,refresh:be}}const ft=e=>["add","add-unique","toggle"].includes(e),wl=".*+?^${}()|[]\\",Vl=Object.keys(St);var Al=vt({name:"QSelect",inheritAttrs:!1,props:K(z(z(z({},yl),Zt),St),{modelValue:{required:!0},multiple:Boolean,displayValue:[String,Number],displayValueHtml:Boolean,dropdownIcon:String,options:{type:Array,default:()=>[]},optionValue:[Function,String],optionLabel:[Function,String],optionDisable:[Function,String],hideSelected:Boolean,hideDropdownIcon:Boolean,fillInput:Boolean,maxValues:[Number,String],optionsDense:Boolean,optionsDark:{type:Boolean,default:null},optionsSelectedClass:String,optionsHtml:Boolean,optionsCover:Boolean,menuShrink:Boolean,menuAnchor:String,menuSelf:String,menuOffset:Array,popupContentClass:String,popupContentStyle:[String,Array,Object],useInput:Boolean,useChips:Boolean,newValueMode:{type:String,validator:ft},mapOptions:Boolean,emitValue:Boolean,inputDebounce:{type:[Number,String],default:500},inputClass:[Array,String,Object],inputStyle:[Array,String,Object],tabindex:{type:[String,Number],default:0},autocomplete:String,transitionShow:String,transitionHide:String,transitionDuration:[String,Number],behavior:{type:String,validator:e=>["default","menu","dialog"].includes(e),default:"default"},virtualScrollItemSize:{type:[Number,String],default:void 0},onNewValue:Function,onFilter:Function}),emits:[...Gt,"add","remove","input-value","keyup","keypress","keydown","filter-abort"],setup(e,{slots:r,emit:a}){const{proxy:w}=Qe(),{$q:_}=w,i=R(!1),O=R(!1),h=R(-1),y=R(""),p=R(!1),c=R(!1);let k,I,m,H,L,V,Q,P,Y;const B=R(null),M=R(null),X=R(null),ye=R(null),ne=R(null),be=Jt(e),J=ol(lt),U=d(()=>Array.isArray(e.options)?e.options.length:0),oe=d(()=>e.virtualScrollItemSize===void 0?e.dense===!0?24:48:e.virtualScrollItemSize),{virtualScrollSliceRange:we,virtualScrollSliceSizeComputed:Ve,localResetVirtualScroll:Ce,padVirtualScroll:Z,onVirtualScrollEvt:Ae,reset:_e,scrollTo:ae,setVirtualScrollSize:ke}=bl({virtualScrollLength:U,getVirtualScrollTarget:Vt,getVirtualScrollEl:et,virtualScrollItemSizeComputed:oe}),l=el(),n=d(()=>{const t=e.mapOptions===!0&&e.multiple!==!0,o=e.modelValue!==void 0&&(e.modelValue!==null||t===!0)?e.multiple===!0&&Array.isArray(e.modelValue)?e.modelValue:[e.modelValue]:[];if(e.mapOptions===!0&&Array.isArray(e.options)===!0){const u=e.mapOptions===!0&&I!==void 0?I:[],s=o.map(x=>wt(x,u));return e.modelValue===null&&t===!0?s.filter(x=>x!==null):s}return o}),f=d(()=>{const t={};return Vl.forEach(o=>{const u=e[o];u!==void 0&&(t[o]=u)}),t}),q=d(()=>e.optionsDark===null?l.isDark.value:e.optionsDark),E=d(()=>ct(n.value)),b=d(()=>{let t="q-field__input q-placeholder col";return e.hideSelected===!0||n.value.length===0?[t,e.inputClass]:(t+=" q-field__input--padding",e.inputClass===void 0?t:[t,e.inputClass])}),S=d(()=>(e.virtualScrollHorizontal===!0?"q-virtual-scroll--horizontal":"")+(e.popupContentClass?" "+e.popupContentClass:"")),F=d(()=>U.value===0),v=d(()=>n.value.map(t=>N.value(t)).join(", ")),D=d(()=>e.optionsHtml===!0?()=>!0:t=>t!=null&&t.html===!0),ie=d(()=>e.displayValueHtml===!0||e.displayValue===void 0&&(e.optionsHtml===!0||n.value.some(D.value))),xe=d(()=>l.focused.value===!0?e.tabindex:-1),W=d(()=>({tabindex:e.tabindex,role:"combobox","aria-label":e.label,"aria-autocomplete":e.useInput===!0?"list":"none","aria-expanded":i.value===!0?"true":"false","aria-owns":`${l.targetUid.value}_lb`,"aria-controls":`${l.targetUid.value}_lb`})),Me=d(()=>{const t={id:`${l.targetUid.value}_lb`,role:"listbox","aria-multiselectable":e.multiple===!0?"true":"false"};return h.value>=0&&(t["aria-activedescendant"]=`${l.targetUid.value}_${h.value}`),t}),ee=d(()=>n.value.map((t,o)=>({index:o,opt:t,html:D.value(t),selected:!0,removeAtIndex:bt,toggleOption:te,tabindex:xe.value}))),re=d(()=>{if(U.value===0)return[];const{from:t,to:o}=we.value;return e.options.slice(t,o).map((u,s)=>{const x=ce.value(u)===!0,C=t+s,A={clickable:!0,active:!1,activeClass:Le.value,manualFocus:!0,focused:!1,disable:x,tabindex:-1,dense:e.optionsDense,dark:q.value,role:"option",id:`${l.targetUid.value}_${C}`,onClick:()=>{te(u)}};return x!==!0&&(Pe(u)===!0&&(A.active=!0),h.value===C&&(A.focused=!0),A["aria-selected"]=A.active===!0?"true":"false",_.platform.is.desktop===!0&&(A.onMousemove=()=>{i.value===!0&&se(C)})),{index:C,opt:u,html:D.value(u),label:N.value(u),selected:A.active,focused:A.focused,toggleOption:te,setOptionIndex:se,itemProps:A}})}),Oe=d(()=>e.dropdownIcon!==void 0?e.dropdownIcon:_.iconSet.arrow.dropdown),qe=d(()=>e.optionsCover===!1&&e.outlined!==!0&&e.standout!==!0&&e.borderless!==!0&&e.rounded!==!0),Le=d(()=>e.optionsSelectedClass!==void 0?e.optionsSelectedClass:e.color!==void 0?`text-${e.color}`:""),$=d(()=>Te(e.optionValue,"value")),N=d(()=>Te(e.optionLabel,"label")),ce=d(()=>Te(e.optionDisable,"disable")),Be=d(()=>n.value.map(t=>$.value(t))),yt=d(()=>{const t={onInput:lt,onChange:J,onKeydown:Je,onKeyup:Ze,onKeypress:Ge,onFocus:Xe,onClick(o){m===!0&&Se(o)}};return t.onCompositionstart=t.onCompositionupdate=t.onCompositionend=J,t});ge(n,t=>{I=t,e.useInput===!0&&e.fillInput===!0&&e.multiple!==!0&&l.innerLoading.value!==!0&&(O.value!==!0&&i.value!==!0||E.value!==!0)&&(H!==!0&&me(),(O.value===!0||i.value===!0)&&de(""))},{immediate:!0}),ge(()=>e.fillInput,me),ge(i,De),ge(U,Bt);function Ue(t){return e.emitValue===!0?$.value(t):t}function He(t){if(t>-1&&t<n.value.length)if(e.multiple===!0){const o=e.modelValue.slice();a("remove",{index:t,value:o.splice(t,1)[0]}),a("update:modelValue",o)}else a("update:modelValue",null)}function bt(t){He(t),l.focus()}function We(t,o){const u=Ue(t);if(e.multiple!==!0){e.fillInput===!0&&ze(N.value(t),!0,!0),a("update:modelValue",u);return}if(n.value.length===0){a("add",{index:0,value:u}),a("update:modelValue",e.multiple===!0?[u]:u);return}if(o===!0&&Pe(t)===!0||e.maxValues!==void 0&&e.modelValue.length>=e.maxValues)return;const s=e.modelValue.slice();a("add",{index:s.length,value:u}),s.push(u),a("update:modelValue",s)}function te(t,o){if(l.editable.value!==!0||t===void 0||ce.value(t)===!0)return;const u=$.value(t);if(e.multiple!==!0){o!==!0&&(ze(e.fillInput===!0?N.value(t):"",!0,!0),le()),M.value!==null&&M.value.focus(),(n.value.length===0||Ie($.value(n.value[0]),u)!==!0)&&a("update:modelValue",e.emitValue===!0?u:t);return}if((m!==!0||p.value===!0)&&l.focus(),Xe(),n.value.length===0){const C=e.emitValue===!0?u:t;a("add",{index:0,value:C}),a("update:modelValue",e.multiple===!0?[C]:C);return}const s=e.modelValue.slice(),x=Be.value.findIndex(C=>Ie(C,u));if(x>-1)a("remove",{index:x,value:s.splice(x,1)[0]});else{if(e.maxValues!==void 0&&s.length>=e.maxValues)return;const C=e.emitValue===!0?u:t;a("add",{index:s.length,value:C}),s.push(C)}a("update:modelValue",s)}function se(t){if(_.platform.is.desktop!==!0)return;const o=t>-1&&t<U.value?t:-1;h.value!==o&&(h.value=o)}function Ee(t=1,o){if(i.value===!0){let u=h.value;do u=st(u+t,-1,U.value-1);while(u!==-1&&u!==h.value&&ce.value(e.options[u])===!0);h.value!==u&&(se(u),ae(u),o!==!0&&e.useInput===!0&&e.fillInput===!0&&Fe(u>=0?N.value(e.options[u]):V))}}function wt(t,o){const u=s=>Ie($.value(s),t);return e.options.find(u)||o.find(u)||t}function Te(t,o){const u=t!==void 0?t:o;return typeof u=="function"?u:s=>s!==null&&typeof s=="object"&&u in s?s[u]:s}function Pe(t){const o=$.value(t);return Be.value.find(u=>Ie(u,o))!==void 0}function Xe(t){e.useInput===!0&&M.value!==null&&(t===void 0||M.value===t.target&&t.target.value===v.value)&&M.value.select()}function Ye(t){al(t,27)===!0&&i.value===!0&&(Se(t),le(),me()),a("keyup",t)}function Ze(t){const{value:o}=t.target;if(t.keyCode!==void 0){Ye(t);return}if(t.target.value="",clearTimeout(k),me(),typeof o=="string"&&o.length>0){const u=o.toLocaleLowerCase(),s=C=>{const A=e.options.find(T=>C.value(T).toLocaleLowerCase()===u);return A===void 0?!1:(n.value.indexOf(A)===-1?te(A):le(),!0)},x=C=>{s($)!==!0&&(s(N)===!0||C===!0||de(o,!0,()=>x(!0)))};x()}else l.clearValue(t)}function Ge(t){a("keypress",t)}function Je(t){if(a("keydown",t),il(t)===!0)return;const o=y.value.length>0&&(e.newValueMode!==void 0||e.onNewValue!==void 0),u=t.shiftKey!==!0&&e.multiple!==!0&&(h.value>-1||o===!0);if(t.keyCode===27){Ne(t);return}if(t.keyCode===9&&u===!1){fe();return}if(t.target===void 0||t.target.id!==l.targetUid.value)return;if(t.keyCode===40&&l.innerLoading.value!==!0&&i.value===!1){ue(t),ve();return}if(t.keyCode===8&&e.hideSelected!==!0&&y.value.length===0){e.multiple===!0&&Array.isArray(e.modelValue)===!0?He(e.modelValue.length-1):e.multiple!==!0&&e.modelValue!==null&&a("update:modelValue",null);return}(t.keyCode===35||t.keyCode===36)&&(typeof y.value!="string"||y.value.length===0)&&(ue(t),h.value=-1,Ee(t.keyCode===36?1:-1,e.multiple)),(t.keyCode===33||t.keyCode===34)&&Ve.value!==void 0&&(ue(t),h.value=Math.max(-1,Math.min(U.value,h.value+(t.keyCode===33?-1:1)*Ve.value.view)),Ee(t.keyCode===33?1:-1,e.multiple)),(t.keyCode===38||t.keyCode===40)&&(ue(t),Ee(t.keyCode===38?-1:1,e.multiple));const s=U.value;if((P===void 0||Y<Date.now())&&(P=""),s>0&&e.useInput!==!0&&t.key!==void 0&&t.key.length===1&&t.altKey===t.ctrlKey&&(t.keyCode!==32||P.length>0)){i.value!==!0&&ve(t);const x=t.key.toLocaleLowerCase(),C=P.length===1&&P[0]===x;Y=Date.now()+1500,C===!1&&(ue(t),P+=x);const A=new RegExp("^"+P.split("").map($e=>wl.indexOf($e)>-1?"\\"+$e:$e).join(".*"),"i");let T=h.value;if(C===!0||T<0||A.test(N.value(e.options[T]))!==!0)do T=st(T+1,-1,s-1);while(T!==h.value&&(ce.value(e.options[T])===!0||A.test(N.value(e.options[T]))!==!0));h.value!==T&&G(()=>{se(T),ae(T),T>=0&&e.useInput===!0&&e.fillInput===!0&&Fe(N.value(e.options[T]))});return}if(!(t.keyCode!==13&&(t.keyCode!==32||e.useInput===!0||P!=="")&&(t.keyCode!==9||u===!1))){if(t.keyCode!==9&&ue(t),h.value>-1&&h.value<s){te(e.options[h.value]);return}if(o===!0){const x=(C,A)=>{if(A){if(ft(A)!==!0)return}else A=e.newValueMode;if(C==null)return;ze("",e.multiple!==!0,!0),(A==="toggle"?te:We)(C,A==="add-unique"),e.multiple!==!0&&(M.value!==null&&M.value.focus(),le())};if(e.onNewValue!==void 0?a("new-value",y.value,x):x(y.value),e.multiple!==!0)return}i.value===!0?fe():l.innerLoading.value!==!0&&ve()}}function et(){return m===!0?ne.value:X.value!==null&&X.value.__qPortalInnerRef.value!==null?X.value.__qPortalInnerRef.value:void 0}function Vt(){return et()}function Ct(){return e.hideSelected===!0?[]:r["selected-item"]!==void 0?ee.value.map(t=>r["selected-item"](t)).slice():r.selected!==void 0?[].concat(r.selected()):e.useChips===!0?ee.value.map((t,o)=>g(Sl,{key:"option-"+o,removable:l.editable.value===!0&&ce.value(t.opt)!==!0,dense:!0,textColor:e.color,tabindex:xe.value,onRemove(){t.removeAtIndex(o)}},()=>g("span",{class:"ellipsis",[t.html===!0?"innerHTML":"textContent"]:N.value(t.opt)}))):[g("span",{[ie.value===!0?"innerHTML":"textContent"]:e.displayValue!==void 0?e.displayValue:v.value})]}function tt(){if(F.value===!0)return r["no-option"]!==void 0?r["no-option"]({inputValue:y.value}):void 0;const t=r.option!==void 0?r.option:u=>g(fl,z({key:u.index},u.itemProps),()=>g(dl,()=>g(vl,()=>g("span",{[u.html===!0?"innerHTML":"textContent"]:u.label}))));let o=Z("div",re.value.map(t));return r["before-options"]!==void 0&&(o=r["before-options"]().concat(o)),rl(r["after-options"],o)}function kt(t,o){const u=o===!0?z(z({},W.value),l.splitAttrs.attributes.value):void 0,s=z(K(z({ref:o===!0?M:void 0,key:"i_t",class:b.value,style:e.inputStyle,value:y.value!==void 0?y.value:"",type:"search"},u),{id:o===!0?l.targetUid.value:void 0,maxlength:e.maxlength,autocomplete:e.autocomplete,"data-autofocus":t!==!0&&e.autofocus===!0||void 0,disabled:e.disable===!0,readonly:e.readonly===!0}),yt.value);return t!==!0&&m===!0&&(Array.isArray(s.class)===!0?s.class=[...s.class,"no-pointer-events"]:s.class+=" no-pointer-events"),g("input",s)}function lt(t){clearTimeout(k),!(t&&t.target&&t.target.composing===!0)&&(Fe(t.target.value||""),H=!0,V=y.value,l.focused.value!==!0&&(m!==!0||p.value===!0)&&l.focus(),e.onFilter!==void 0&&(k=setTimeout(()=>{de(y.value)},e.inputDebounce)))}function Fe(t){y.value!==t&&(y.value=t,a("input-value",t))}function ze(t,o,u){H=u!==!0,e.useInput===!0&&(Fe(t),(o===!0||u!==!0)&&(V=t),o!==!0&&de(t))}function de(t,o,u){if(e.onFilter===void 0||o!==!0&&l.focused.value!==!0)return;l.innerLoading.value===!0?a("filter-abort"):(l.innerLoading.value=!0,c.value=!0),t!==""&&e.multiple!==!0&&n.value.length>0&&H!==!0&&t===N.value(n.value[0])&&(t="");const s=setTimeout(()=>{i.value===!0&&(i.value=!1)},10);clearTimeout(L),L=s,a("filter",t,(x,C)=>{(o===!0||l.focused.value===!0)&&L===s&&(clearTimeout(L),typeof x=="function"&&x(),c.value=!1,G(()=>{l.innerLoading.value=!1,l.editable.value===!0&&(o===!0?i.value===!0&&le():i.value===!0?De(!0):i.value=!0),typeof C=="function"&&G(()=>{C(w)}),typeof u=="function"&&G(()=>{u(w)})}))},()=>{l.focused.value===!0&&L===s&&(clearTimeout(L),l.innerLoading.value=!1,c.value=!1),i.value===!0&&(i.value=!1)})}function xt(){return g(cl,K(z({ref:X,class:S.value,style:e.popupContentStyle,modelValue:i.value,fit:e.menuShrink!==!0,cover:e.optionsCover===!0&&F.value!==!0&&e.useInput!==!0,anchor:e.menuAnchor,self:e.menuSelf,offset:e.menuOffset,dark:q.value,noParentEvent:!0,noRefocus:!0,noFocus:!0,square:qe.value,transitionShow:e.transitionShow,transitionHide:e.transitionHide,transitionDuration:e.transitionDuration,separateClosePopup:!0},Me.value),{onScrollPassive:Ae,onBeforeShow:nt,onBeforeHide:qt,onShow:zt}),tt)}function qt(t){ot(t),fe()}function zt(){ke()}function It(t){Se(t),M.value!==null&&M.value.focus(),p.value=!0,window.scrollTo(window.pageXOffset||window.scrollX||document.body.scrollLeft||0,0)}function pt(t){Se(t),G(()=>{p.value=!1})}function At(){const t=[g(sl,K(z(K(z({class:`col-auto ${l.fieldClass.value}`},f.value),{for:l.targetUid.value,dark:q.value,square:!0,loading:c.value,itemAligned:!1,filled:!0,stackLabel:y.value.length>0}),l.splitAttrs.listeners.value),{onFocus:It,onBlur:pt}),K(z({},r),{rawControl:()=>l.getControl(!0),before:void 0,after:void 0}))];return i.value===!0&&t.push(g("div",K(z({ref:ne,class:S.value+" scroll",style:e.popupContentStyle},Me.value),{onClick:Ne,onScrollPassive:Ae}),tt())),g(ul,{ref:ye,modelValue:O.value,position:e.useInput===!0?"top":void 0,transitionShow:Q,transitionHide:e.transitionHide,transitionDuration:e.transitionDuration,onBeforeShow:nt,onBeforeHide:_t,onHide:Mt,onShow:Ot},()=>g("div",{class:"q-select__dialog"+(q.value===!0?" q-select__dialog--dark q-dark":"")+(p.value===!0?" q-select__dialog--focused":"")},t))}function _t(t){ot(t),ye.value!==null&&ye.value.__updateRefocusTarget(l.rootRef.value.querySelector(".q-field__native > [tabindex]:last-child")),l.focused.value=!1}function Mt(t){le(),l.focused.value===!1&&a("blur",t),me()}function Ot(){const t=document.activeElement;(t===null||t.id!==l.targetUid.value)&&M.value!==null&&M.value!==t&&M.value.focus(),ke()}function fe(){O.value!==!0&&(h.value=-1,i.value===!0&&(i.value=!1),l.focused.value===!1&&(clearTimeout(L),L=void 0,l.innerLoading.value===!0&&(a("filter-abort"),l.innerLoading.value=!1,c.value=!1)))}function ve(t){l.editable.value===!0&&(m===!0?(l.onControlFocusin(t),O.value=!0,G(()=>{l.focus()})):l.focus(),e.onFilter!==void 0?de(y.value):(F.value!==!0||r["no-option"]!==void 0)&&(i.value=!0))}function le(){O.value=!1,fe()}function me(){e.useInput===!0&&ze(e.multiple!==!0&&e.fillInput===!0&&n.value.length>0&&N.value(n.value[0])||"",!0,!0)}function De(t){let o=-1;if(t===!0){if(n.value.length>0){const u=$.value(n.value[0]);o=e.options.findIndex(s=>Ie($.value(s),u))}Ce(o)}se(o)}function Bt(){i.value===!0&&l.innerLoading.value===!1&&(_e(),G(()=>{i.value===!0&&l.innerLoading.value===!1&&De(!0)}))}function ut(){O.value===!1&&X.value!==null&&X.value.updatePosition()}function nt(t){t!==void 0&&Se(t),a("popup-show",t),l.hasPopupOpen=!0,l.onControlFocusin(t)}function ot(t){t!==void 0&&Se(t),a("popup-hide",t),l.hasPopupOpen=!1,l.onControlFocusout(t)}function at(){m=_.platform.is.mobile!==!0&&e.behavior!=="dialog"?!1:e.behavior!=="menu"&&(e.useInput===!0?r["no-option"]!==void 0||e.onFilter!==void 0||F.value===!1:!0),Q=_.platform.is.ios===!0&&m===!0&&e.useInput===!0?"fade":e.transitionShow}return tl(at),ll(ut),at(),mt(()=>{clearTimeout(k)}),Object.assign(w,{showPopup:ve,hidePopup:le,removeAtIndex:He,add:We,toggleOption:te,getOptionIndex:()=>h.value,setOptionIndex:se,moveOptionSelection:Ee,filter:de,updateMenuPosition:ut,updateInputValue:ze,isOptionSelected:Pe,getEmittingOptionValue:Ue,isOptionDisabled:(...t)=>ce.value.apply(null,t)===!0,getOptionValue:(...t)=>$.value.apply(null,t),getOptionLabel:(...t)=>N.value.apply(null,t)}),Object.assign(l,{innerValue:n,fieldClass:d(()=>`q-select q-field--auto-height q-select--with${e.useInput!==!0?"out":""}-input q-select--with${e.useChips!==!0?"out":""}-chips q-select--${e.multiple===!0?"multiple":"single"}`),inputRef:B,targetRef:M,hasValue:E,showPopup:ve,floatingLabel:d(()=>(e.hideSelected===!0?y.value.length>0:E.value===!0)||ct(e.displayValue)),getControlChild:()=>{if(l.editable.value!==!1&&(O.value===!0||F.value!==!0||r["no-option"]!==void 0))return m===!0?At():xt();l.hasPopupOpen===!0&&(l.hasPopupOpen=!1)},controlEvents:{onFocusin(t){l.onControlFocusin(t)},onFocusout(t){l.onControlFocusout(t,()=>{me(),fe()})},onClick(t){if(Ne(t),m!==!0&&i.value===!0){fe(),M.value!==null&&M.value.focus();return}ve(t)}},getControl:t=>{const o=Ct(),u=t===!0||O.value!==!0||m!==!0;if(e.useInput===!0)o.push(kt(t,u));else if(l.editable.value===!0){const x=u===!0?W.value:void 0;o.push(g("input",K(z({ref:u===!0?M:void 0,key:"d_t",class:"q-select__focus-target",id:u===!0?l.targetUid.value:void 0,readonly:!0},x),{onKeydown:Je,onKeyup:Ye,onKeypress:Ge}))),u===!0&&typeof e.autocomplete=="string"&&e.autocomplete.length>0&&o.push(g("input",{class:"q-select__autocomplete-input",autocomplete:e.autocomplete,onKeyup:Ze}))}if(be.value!==void 0&&e.disable!==!0&&Be.value.length>0){const x=Be.value.map(C=>g("option",{value:C,selected:!0}));o.push(g("select",{class:"hidden",name:be.value,multiple:e.multiple},x))}const s=e.useInput===!0||u!==!0?void 0:l.splitAttrs.attributes.value;return g("div",z({class:"q-field__native row items-center"},s),o)},getInnerAppend:()=>e.loading!==!0&&c.value!==!0&&e.hideDropdownIcon!==!0?[g(Re,{class:"q-select__dropdown-icon"+(i.value===!0?" rotate-180":""),name:Oe.value})]:null}),nl(l)}});export{Al as Q,bl as a,Sl as b,pl as c,yl as u};