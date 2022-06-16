var ke=Object.defineProperty;var re=Object.getOwnPropertySymbols;var xe=Object.prototype.hasOwnProperty,Ie=Object.prototype.propertyIsEnumerable;var ie=(e,v,d)=>v in e?ke(e,v,{enumerable:!0,configurable:!0,writable:!0,value:d}):e[v]=d,se=(e,v)=>{for(var d in v||(v={}))xe.call(v,d)&&ie(e,d,v[d]);if(re)for(var d of re(v))Ie.call(v,d)&&ie(e,d,v[d]);return e};import{i as Ae,g as ve,r as T,a as b,o as fe,p as Be,bG as be,q as $e,b3 as Me,b as w,$ as Pe,bd as Ee,a0 as Fe,T as H,E as We,c as Qe,a7 as je,j as ue,ao as ce,w as P,n as V,z as ze,at as Ne,au as Ve,t as He}from"./index.4bd8ab7e.js";import{Q as Ke}from"./QResizeObserver.cca26867.js";import{r as Oe}from"./rtl.4b414a6d.js";let De=0;const pe=["click","keydown"],et={icon:String,label:[Number,String],alert:[Boolean,String],alertIcon:String,name:{type:[Number,String],default:()=>`t_${De++}`},noCaps:Boolean,tabindex:[String,Number],disable:Boolean,contentClass:String,ripple:{type:[Boolean,Object],default:!0}};function tt(e,v,d,f){const l=Ae(be,()=>{console.error("QTab/QRouteTab component needs to be child of QTabs")}),{proxy:K}=ve(),B=T(null),E=T(null),F=T(null),S=b(()=>e.disable===!0||e.ripple===!1?!1:Object.assign({keyCodes:[13,32],early:!0},e.ripple===!0?{}:e.ripple)),h=b(()=>l.currentModel.value===e.name),L=b(()=>"q-tab relative-position self-stretch flex flex-center text-center"+(h.value===!0?" q-tab--active"+(l.tabProps.value.activeClass?" "+l.tabProps.value.activeClass:"")+(l.tabProps.value.activeColor?` text-${l.tabProps.value.activeColor}`:"")+(l.tabProps.value.activeBgColor?` bg-${l.tabProps.value.activeBgColor}`:""):" q-tab--inactive")+(e.icon&&e.label&&l.tabProps.value.inlineLabel===!1?" q-tab--full":"")+(e.noCaps===!0||l.tabProps.value.noCaps===!0?" q-tab--no-caps":"")+(e.disable===!0?" disabled":" q-focusable q-hoverable cursor-pointer")+(f!==void 0&&f.linkClass.value!==""?` ${f.linkClass.value}`:"")),k=b(()=>"q-tab__content self-stretch flex-center relative-position q-anchor--skip non-selectable "+(l.tabProps.value.inlineLabel===!0?"row no-wrap q-tab__content--inline":"column")+(e.contentClass!==void 0?` ${e.contentClass}`:"")),$=b(()=>e.disable===!0||l.hasFocus.value===!0?-1:e.tabindex||0);function x(i,g){if(g!==!0&&B.value!==null&&B.value.focus(),e.disable!==!0){let C;if(f!==void 0)if(f.hasRouterLink.value===!0)C=()=>{i.__qNavigate=!0,l.avoidRouteWatcher=!0;const m=f.navigateToRouterLink(i);m===!1?l.avoidRouteWatcher=!1:m.then(q=>{l.avoidRouteWatcher=!1,q===void 0&&l.updateModel({name:e.name,fromRoute:!0})})};else{d("click",i);return}else C=()=>{l.updateModel({name:e.name,fromRoute:!1})};d("click",i,C),i.defaultPrevented!==!0&&C()}}function M(i){Pe(i,[13,32])?x(i,!0):Ee(i)!==!0&&i.keyCode>=35&&i.keyCode<=40&&l.onKbdNavigate(i.keyCode,K.$el)===!0&&Fe(i),d("keydown",i)}function I(){const i=l.tabProps.value.narrowIndicator,g=[],C=w("div",{ref:F,class:["q-tab__indicator",l.tabProps.value.indicatorClass]});e.icon!==void 0&&g.push(w(H,{class:"q-tab__icon",name:e.icon})),e.label!==void 0&&g.push(w("div",{class:"q-tab__label"},e.label)),e.alert!==!1&&g.push(e.alertIcon!==void 0?w(H,{class:"q-tab__alert-icon",color:e.alert!==!0?e.alert:void 0,name:e.alertIcon}):w("div",{class:"q-tab__alert"+(e.alert!==!0?` text-${e.alert}`:"")})),i===!0&&g.push(C);const m=[w("div",{class:"q-focus-helper",tabindex:-1,ref:B}),w("div",{class:k.value},We(v.default,g))];return i===!1&&m.push(C),m}const _={name:b(()=>e.name),rootRef:E,tabIndicatorRef:F,routerProps:f};fe(()=>{l.unregisterTab(_),l.recalculateScroll()}),Be(()=>{l.registerTab(_),l.recalculateScroll()});function A(i,g){const C=se({ref:E,class:L.value,tabindex:$.value,role:"tab","aria-selected":h.value===!0?"true":"false","aria-disabled":e.disable===!0?"true":void 0,onClick:x,onKeydown:M},g);return $e(w(i,C,I()),[[Me,S.value]])}return{renderTab:A,$tabs:l}}function Ue(e,v,d){const f=d===!0?["left","right"]:["top","bottom"];return`absolute-${v===!0?f[0]:f[1]}${e?` text-${e}`:""}`}const Ge=["left","center","right","justify"],de=()=>{};var at=Qe({name:"QTabs",props:{modelValue:[Number,String],align:{type:String,default:"center",validator:e=>Ge.includes(e)},breakpoint:{type:[String,Number],default:600},vertical:Boolean,shrink:Boolean,stretch:Boolean,activeClass:String,activeColor:String,activeBgColor:String,indicatorColor:String,leftIcon:String,rightIcon:String,outsideArrows:Boolean,mobileArrows:Boolean,switchIndicator:Boolean,narrowIndicator:Boolean,inlineLabel:Boolean,noCaps:Boolean,dense:Boolean,contentClass:String,"onUpdate:modelValue":[Function,Array]},setup(e,{slots:v,emit:d}){const f=ve(),{proxy:{$q:l}}=f,{registerTick:K}=je(),{registerTimeout:B,removeTimeout:E}=ue(),{registerTimeout:F}=ue(),S=T(null),h=T(null),L=T(e.modelValue),k=T(!1),$=T(!0),x=T(!1),M=T(!1),I=b(()=>l.platform.is.desktop===!0||e.mobileArrows===!0),_=[],A=T(!1);let i=!1,g,C,m,q=I.value===!0?Z:ce;const he=b(()=>({activeClass:e.activeClass,activeColor:e.activeColor,activeBgColor:e.activeBgColor,indicatorClass:Ue(e.indicatorColor,e.switchIndicator,e.vertical),narrowIndicator:e.narrowIndicator,inlineLabel:e.inlineLabel,noCaps:e.noCaps})),ge=b(()=>`q-tabs__content--align-${k.value===!0?"left":M.value===!0?"justify":e.align}`),me=b(()=>`q-tabs row no-wrap items-center q-tabs--${k.value===!0?"":"not-"}scrollable q-tabs--${e.vertical===!0?"vertical":"horizontal"} q-tabs__arrows--${I.value===!0&&e.outsideArrows===!0?"outside":"inside"}`+(e.dense===!0?" q-tabs--dense":"")+(e.shrink===!0?" col-shrink":"")+(e.stretch===!0?" self-stretch":"")),we=b(()=>"q-tabs__content row no-wrap items-center self-stretch hide-scrollbar relative-position "+ge.value+(e.contentClass!==void 0?` ${e.contentClass}`:"")+(l.platform.is.mobile===!0?" scroll":"")),W=b(()=>e.vertical===!0?{container:"height",content:"offsetHeight",scroll:"scrollHeight"}:{container:"width",content:"offsetWidth",scroll:"scrollWidth"}),Q=b(()=>e.vertical!==!0&&l.lang.rtl===!0),O=b(()=>Oe===!1&&Q.value===!0);P(Q,q),P(()=>e.modelValue,t=>{D({name:t,setCurrent:!0,skipEmit:!0})}),P(()=>e.outsideArrows,()=>{V(j())}),P(I,t=>{q=t===!0?Z:ce,V(j())});function D({name:t,setCurrent:a,skipEmit:n,fromRoute:s}){L.value!==t&&(n!==!0&&d("update:modelValue",t),(a===!0||e["onUpdate:modelValue"]===void 0)&&(Ce(L.value,t),L.value=t)),s!==void 0&&(i=s)}function j(){K(()=>{f.isDeactivated!==!0&&f.isUnmounted!==!0&&Y({width:S.value.offsetWidth,height:S.value.offsetHeight})})}function Y(t){if(W.value===void 0||h.value===null)return;const a=t[W.value.container],n=Math.min(h.value[W.value.scroll],Array.prototype.reduce.call(h.value.children,(o,u)=>o+(u[W.value.content]||0),0)),s=a>0&&n>a;k.value!==s&&(k.value=s),s===!0&&V(q);const c=a<parseInt(e.breakpoint,10);M.value!==c&&(M.value=c)}function Ce(t,a){const n=t!=null&&t!==""?_.find(c=>c.name.value===t):null,s=a!=null&&a!==""?_.find(c=>c.name.value===a):null;if(n&&s){const c=n.tabIndicatorRef.value,o=s.tabIndicatorRef.value;clearTimeout(g),c.style.transition="none",c.style.transform="none",o.style.transition="none",o.style.transform="none";const u=c.getBoundingClientRect(),r=o.getBoundingClientRect();o.style.transform=e.vertical===!0?`translate3d(0,${u.top-r.top}px,0) scale3d(1,${r.height?u.height/r.height:1},1)`:`translate3d(${u.left-r.left}px,0,0) scale3d(${r.width?u.width/r.width:1},1,1)`,V(()=>{g=setTimeout(()=>{o.style.transition="transform .25s cubic-bezier(.4, 0, .2, 1)",o.style.transform="none"},70)})}s&&k.value===!0&&z(s.rootRef.value)}function z(t){const{left:a,width:n,top:s,height:c}=h.value.getBoundingClientRect(),o=t.getBoundingClientRect();let u=e.vertical===!0?o.top-s:o.left-a;if(u<0){h.value[e.vertical===!0?"scrollTop":"scrollLeft"]+=Math.floor(u),q();return}u+=e.vertical===!0?o.height-c:o.width-n,u>0&&(h.value[e.vertical===!0?"scrollTop":"scrollLeft"]+=Math.ceil(u),q())}function Z(){const t=h.value;if(t!==null){const a=t.getBoundingClientRect(),n=e.vertical===!0?t.scrollTop:Math.abs(t.scrollLeft);Q.value===!0?($.value=Math.ceil(n+a.width)<t.scrollWidth-1,x.value=n>0):($.value=n>0,x.value=e.vertical===!0?Math.ceil(n+a.height)<t.scrollHeight:Math.ceil(n+a.width)<t.scrollWidth)}}function p(t){y(),ae(t),C=setInterval(()=>{ae(t)===!0&&y()},5)}function ee(){p(O.value===!0?Number.MAX_SAFE_INTEGER:0)}function te(){p(O.value===!0?0:Number.MAX_SAFE_INTEGER)}function y(){clearInterval(C)}function Te(t,a){const n=Array.prototype.filter.call(h.value.children,r=>r===a||r.matches&&r.matches(".q-tab.q-focusable")===!0),s=n.length;if(s===0)return;if(t===36)return z(n[0]),!0;if(t===35)return z(n[s-1]),!0;const c=t===(e.vertical===!0?38:37),o=t===(e.vertical===!0?40:39),u=c===!0?-1:o===!0?1:void 0;if(u!==void 0){const r=Q.value===!0?-1:1,R=n.indexOf(a)+u*r;return R>=0&&R<s&&(z(n[R]),n[R].focus({preventScroll:!0})),!0}}const _e=b(()=>O.value===!0?{get:t=>Math.abs(t.scrollLeft),set:(t,a)=>{t.scrollLeft=-a}}:e.vertical===!0?{get:t=>t.scrollTop,set:(t,a)=>{t.scrollTop=a}}:{get:t=>t.scrollLeft,set:(t,a)=>{t.scrollLeft=a}});function ae(t){const a=h.value,{get:n,set:s}=_e.value;let c=!1,o=n(a);const u=t<o?-1:1;return o+=u*5,o<0?(c=!0,o=0):(u===-1&&o<=t||u===1&&o>=t)&&(c=!0,o=t),s(a,o),q(),c}function U(){return _.filter(t=>t.routerProps!==void 0&&t.routerProps.hasRouterLink.value===!0)}function qe(){let t=null,a=i;const n={matchedLen:0,hrefLen:0,exact:!1,found:!1},{hash:s}=f.proxy.$route,c=L.value;let o=a===!0?de:r=>{c===r.name.value&&(a=!0,o=de)};const u=U();for(const r of u){const R=r.routerProps.exact.value===!0;if(r.routerProps[R===!0?"linkIsExactActive":"linkIsActive"].value!==!0||n.exact===!0&&R!==!0){o(r);continue}const G=r.routerProps.linkRoute.value,X=G.hash;if(R===!0){if(s===X){t=r.name.value;break}else if(s!==""&&X!==""){o(r);continue}}const J=G.matched.length,oe=G.href.length-X.length;if(J===n.matchedLen?oe>n.hrefLen:J>n.matchedLen){t=r.name.value,Object.assign(n,{matchedLen:J,hrefLen:oe,exact:R});continue}o(r)}(a===!0||t!==null)&&D({name:t,setCurrent:!0,fromRoute:!0})}function Re(t){if(E(),A.value!==!0&&S.value!==null&&t.target&&typeof t.target.closest=="function"){const a=t.target.closest(".q-tab");a&&S.value.contains(a)===!0&&(A.value=!0)}}function ye(){B(()=>{A.value=!1},30)}function N(){le.avoidRouteWatcher!==!0&&F(qe)}function Se(t){_.push(t),U().length>0&&(m===void 0&&(m=P(()=>f.proxy.$route,N)),N())}function Le(t){_.splice(_.indexOf(t),1),m!==void 0&&(U().length===0&&(m(),m=void 0),N())}const le={currentModel:L,tabProps:he,hasFocus:A,registerTab:Se,unregisterTab:Le,verifyRouteModel:N,updateModel:D,recalculateScroll:j,onKbdNavigate:Te,avoidRouteWatcher:!1};ze(be,le),fe(()=>{clearTimeout(g),m!==void 0&&m()});let ne=!1;return Ne(()=>{ne=!0}),Ve(()=>{ne===!0&&j()}),()=>{const t=[w(Ke,{onResize:Y}),w("div",{ref:h,class:we.value,onScroll:q},He(v.default))];return I.value===!0&&t.push(w(H,{class:"q-tabs__arrow q-tabs__arrow--left absolute q-tab__icon"+($.value===!0?"":" q-tabs__arrow--faded"),name:e.leftIcon||l.iconSet.tabs[e.vertical===!0?"up":"left"],onMousedown:ee,onTouchstartPassive:ee,onMouseup:y,onMouseleave:y,onTouchend:y}),w(H,{class:"q-tabs__arrow q-tabs__arrow--right absolute q-tab__icon"+(x.value===!0?"":" q-tabs__arrow--faded"),name:e.rightIcon||l.iconSet.tabs[e.vertical===!0?"down":"right"],onMousedown:te,onTouchstartPassive:te,onMouseup:y,onMouseleave:y,onTouchend:y})),w("div",{ref:S,class:me.value,role:"tablist",onFocusin:Re,onFocusout:ye},t)}}});export{at as Q,pe as a,tt as b,et as u};