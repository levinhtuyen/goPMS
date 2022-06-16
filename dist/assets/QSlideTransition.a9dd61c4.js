import{c as b,o as v,b as w,ag as E}from"./index.4bd8ab7e.js";var H=b({name:"QSlideTransition",props:{appear:Boolean,duration:{type:Number,default:300}},emits:["show","hide"],setup(s,{slots:g,emit:p}){let a=!1,r,u,d,f,i,h;function l(){r&&r(),r=null,a=!1,clearTimeout(d),clearTimeout(f),u!==void 0&&u.removeEventListener("transitionend",i),i=null}function m(t,e,n){t.style.overflowY="hidden",e!==void 0&&(t.style.height=`${e}px`),t.style.transition=`height ${s.duration}ms cubic-bezier(.25, .8, .50, 1)`,a=!0,r=n}function c(t,e){t.style.overflowY=null,t.style.height=null,t.style.transition=null,l(),e!==h&&p(e)}function y(t,e){let n=0;u=t,a===!0?(l(),n=t.offsetHeight===t.scrollHeight?0:void 0):h="hide",m(t,n,e),d=setTimeout(()=>{t.style.height=`${t.scrollHeight}px`,i=o=>{(Object(o)!==o||o.target===t)&&c(t,"show")},t.addEventListener("transitionend",i),f=setTimeout(i,s.duration*1.1)},100)}function T(t,e){let n;u=t,a===!0?l():(h="show",n=t.scrollHeight),m(t,n,e),d=setTimeout(()=>{t.style.height=0,i=o=>{(Object(o)!==o||o.target===t)&&c(t,"hide")},t.addEventListener("transitionend",i),f=setTimeout(i,s.duration*1.1)},100)}return v(()=>{a===!0&&l()}),()=>w(E,{css:!1,appear:s.appear,onEnter:y,onLeave:T},g.default)}});export{H as Q};
