var S=Object.defineProperty,y=Object.defineProperties;var C=Object.getOwnPropertyDescriptors;var r=Object.getOwnPropertySymbols;var h=Object.prototype.hasOwnProperty,q=Object.prototype.propertyIsEnumerable;var o=(e,a,n)=>a in e?S(e,a,{enumerable:!0,configurable:!0,writable:!0,value:n}):e[a]=n,t=(e,a)=>{for(var n in a||(a={}))h.call(a,n)&&o(e,n,a[n]);if(r)for(var n of r(a))q.call(a,n)&&o(e,n,a[n]);return e},u=(e,a)=>y(e,C(a));import{c as k,d as I,a6 as Q,f as w,a8 as x,a as s,b as l,ag as z,g as D,bq as T}from"./index.4bd8ab7e.js";var _=k({name:"QInnerLoading",props:u(t(t({},I),Q),{showing:Boolean,color:String,size:{type:[String,Number],default:42},label:String,labelClass:String,labelStyle:[String,Array,Object]}),setup(e,{slots:a}){const n=D(),c=w(e,n.proxy.$q),{transition:g,transitionStyle:d}=x(e,s(()=>e.showing)),b=s(()=>"q-inner-loading absolute-full column flex-center"+(c.value===!0?" q-inner-loading--dark":"")),v=s(()=>"q-inner-loading__label"+(e.labelClass!==void 0?` ${e.labelClass}`:""));function f(){const i=[l(T,{size:e.size,color:e.color})];return e.label!==void 0&&i.push(l("div",{class:v.value,style:e.labelStyle},[e.label])),i}function m(){return e.showing===!0?l("div",{class:b.value,style:d.value},a.default!==void 0?a.default():f()):null}return()=>l(z,{name:g.value,appear:!0},m)}});export{_ as Q};
