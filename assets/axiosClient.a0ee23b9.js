var _e=Object.defineProperty,Le=Object.defineProperties;var De=Object.getOwnPropertyDescriptors;var re=Object.getOwnPropertySymbols;var Ue=Object.prototype.hasOwnProperty,Be=Object.prototype.propertyIsEnumerable;var ne=(t,e,r)=>e in t?_e(t,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):t[e]=r,M=(t,e)=>{for(var r in e||(e={}))Ue.call(e,r)&&ne(t,r,e[r]);if(re)for(var r of re(e))Be.call(e,r)&&ne(t,r,e[r]);return t},q=(t,e)=>Le(t,De(e));import{C as je,as as Ie,at as Me,au as x}from"./index.7efcbe86.js";const Y="access_token",z="profile",se="hotel_name",qe="https://staging-api.gopms.io/api/v1",sr=/^\d+$/;new Date().getTimezoneOffset();const ar="DD/MM/YYYY HH:mm",ir="DD/MM/YYYY",or="YYYY/MM/DD",ur="YYYY/MM/DD HH:mm";var ke=(t=>(t.NEW_GUEST="New guest",t.AVAILABLE_GUEST="Available guest",t))(ke||{});const Fe=JSON.parse(localStorage.getItem(Y)||"{}").value,C=JSON.parse(localStorage.getItem(z)||"{}").value,R=je({accessToken:Fe,profile:C}),He=()=>{const t=n=>{r(Y,n.accessToken,n.expiresAt),r(z,n.profile,n.expiresAt),r(se,n.profile.hotelName,n.expiresAt),R.accessToken=n.accessToken,R.profile=n.profile,window.location.href="dashboard"},e=()=>{localStorage.removeItem(Y),localStorage.removeItem(z),localStorage.removeItem(se),R.accessToken=null,R.profile=null,window.location.href="sign-in"},r=(n,a,o)=>{const u={value:a,expiry:o};localStorage.setItem(n,JSON.stringify(u))},s=n=>!!((C==null?void 0:C.permission)&&n&&C.permission[n]);return q(M({},Ie(R)),{signIn:t,signOut:e,hasPermission:s,setLocalStorageWithExpiry:r})};var X={exports:{}},ve=function(e,r){return function(){for(var n=new Array(arguments.length),a=0;a<n.length;a++)n[a]=arguments[a];return e.apply(r,n)}},Je=ve,y=Object.prototype.toString;function K(t){return Array.isArray(t)}function V(t){return typeof t=="undefined"}function Ye(t){return t!==null&&!V(t)&&t.constructor!==null&&!V(t.constructor)&&typeof t.constructor.isBuffer=="function"&&t.constructor.isBuffer(t)}function Ee(t){return y.call(t)==="[object ArrayBuffer]"}function ze(t){return y.call(t)==="[object FormData]"}function Ve(t){var e;return typeof ArrayBuffer!="undefined"&&ArrayBuffer.isView?e=ArrayBuffer.isView(t):e=t&&t.buffer&&Ee(t.buffer),e}function We(t){return typeof t=="string"}function Xe(t){return typeof t=="number"}function be(t){return t!==null&&typeof t=="object"}function P(t){if(y.call(t)!=="[object Object]")return!1;var e=Object.getPrototypeOf(t);return e===null||e===Object.prototype}function Ke(t){return y.call(t)==="[object Date]"}function Ge(t){return y.call(t)==="[object File]"}function Qe(t){return y.call(t)==="[object Blob]"}function ye(t){return y.call(t)==="[object Function]"}function Ze(t){return be(t)&&ye(t.pipe)}function et(t){return y.call(t)==="[object URLSearchParams]"}function tt(t){return t.trim?t.trim():t.replace(/^\s+|\s+$/g,"")}function rt(){return typeof navigator!="undefined"&&(navigator.product==="ReactNative"||navigator.product==="NativeScript"||navigator.product==="NS")?!1:typeof window!="undefined"&&typeof document!="undefined"}function G(t,e){if(!(t===null||typeof t=="undefined"))if(typeof t!="object"&&(t=[t]),K(t))for(var r=0,s=t.length;r<s;r++)e.call(null,t[r],r,t);else for(var n in t)Object.prototype.hasOwnProperty.call(t,n)&&e.call(null,t[n],n,t)}function W(){var t={};function e(n,a){P(t[a])&&P(n)?t[a]=W(t[a],n):P(n)?t[a]=W({},n):K(n)?t[a]=n.slice():t[a]=n}for(var r=0,s=arguments.length;r<s;r++)G(arguments[r],e);return t}function nt(t,e,r){return G(e,function(n,a){r&&typeof n=="function"?t[a]=Je(n,r):t[a]=n}),t}function st(t){return t.charCodeAt(0)===65279&&(t=t.slice(1)),t}var h={isArray:K,isArrayBuffer:Ee,isBuffer:Ye,isFormData:ze,isArrayBufferView:Ve,isString:We,isNumber:Xe,isObject:be,isPlainObject:P,isUndefined:V,isDate:Ke,isFile:Ge,isBlob:Qe,isFunction:ye,isStream:Ze,isURLSearchParams:et,isStandardBrowserEnv:rt,forEach:G,merge:W,extend:nt,trim:tt,stripBOM:st},g=h;function ae(t){return encodeURIComponent(t).replace(/%3A/gi,":").replace(/%24/g,"$").replace(/%2C/gi,",").replace(/%20/g,"+").replace(/%5B/gi,"[").replace(/%5D/gi,"]")}var we=function(e,r,s){if(!r)return e;var n;if(s)n=s(r);else if(g.isURLSearchParams(r))n=r.toString();else{var a=[];g.forEach(r,function(l,m){l===null||typeof l=="undefined"||(g.isArray(l)?m=m+"[]":l=[l],g.forEach(l,function(c){g.isDate(c)?c=c.toISOString():g.isObject(c)&&(c=JSON.stringify(c)),a.push(ae(m)+"="+ae(c))}))}),n=a.join("&")}if(n){var o=e.indexOf("#");o!==-1&&(e=e.slice(0,o)),e+=(e.indexOf("?")===-1?"?":"&")+n}return e},at=h;function L(){this.handlers=[]}L.prototype.use=function(e,r,s){return this.handlers.push({fulfilled:e,rejected:r,synchronous:s?s.synchronous:!1,runWhen:s?s.runWhen:null}),this.handlers.length-1};L.prototype.eject=function(e){this.handlers[e]&&(this.handlers[e]=null)};L.prototype.forEach=function(e){at.forEach(this.handlers,function(s){s!==null&&e(s)})};var it=L,ot=h,ut=function(e,r){ot.forEach(e,function(n,a){a!==r&&a.toUpperCase()===r.toUpperCase()&&(e[r]=n,delete e[a])})},Se=function(e,r,s,n,a){return e.config=r,s&&(e.code=s),e.request=n,e.response=a,e.isAxiosError=!0,e.toJSON=function(){return{message:this.message,name:this.name,description:this.description,number:this.number,fileName:this.fileName,lineNumber:this.lineNumber,columnNumber:this.columnNumber,stack:this.stack,config:this.config,code:this.code,status:this.response&&this.response.status?this.response.status:null}},e},lt=Se,ge=function(e,r,s,n,a){var o=new Error(e);return lt(o,r,s,n,a)},ct=ge,ft=function(e,r,s){var n=s.config.validateStatus;!s.status||!n||n(s.status)?e(s):r(ct("Request failed with status code "+s.status,s.config,null,s.request,s))},N=h,dt=N.isStandardBrowserEnv()?function(){return{write:function(r,s,n,a,o,u){var l=[];l.push(r+"="+encodeURIComponent(s)),N.isNumber(n)&&l.push("expires="+new Date(n).toGMTString()),N.isString(a)&&l.push("path="+a),N.isString(o)&&l.push("domain="+o),u===!0&&l.push("secure"),document.cookie=l.join("; ")},read:function(r){var s=document.cookie.match(new RegExp("(^|;\\s*)("+r+")=([^;]*)"));return s?decodeURIComponent(s[3]):null},remove:function(r){this.write(r,"",Date.now()-864e5)}}}():function(){return{write:function(){},read:function(){return null},remove:function(){}}}(),ht=function(e){return/^([a-z][a-z\d+\-.]*:)?\/\//i.test(e)},pt=function(e,r){return r?e.replace(/\/+$/,"")+"/"+r.replace(/^\/+/,""):e},mt=ht,vt=pt,Et=function(e,r){return e&&!mt(r)?vt(e,r):r},k=h,bt=["age","authorization","content-length","content-type","etag","expires","from","host","if-modified-since","if-unmodified-since","last-modified","location","max-forwards","proxy-authorization","referer","retry-after","user-agent"],yt=function(e){var r={},s,n,a;return e&&k.forEach(e.split(`
`),function(u){if(a=u.indexOf(":"),s=k.trim(u.substr(0,a)).toLowerCase(),n=k.trim(u.substr(a+1)),s){if(r[s]&&bt.indexOf(s)>=0)return;s==="set-cookie"?r[s]=(r[s]?r[s]:[]).concat([n]):r[s]=r[s]?r[s]+", "+n:n}}),r},ie=h,wt=ie.isStandardBrowserEnv()?function(){var e=/(msie|trident)/i.test(navigator.userAgent),r=document.createElement("a"),s;function n(a){var o=a;return e&&(r.setAttribute("href",o),o=r.href),r.setAttribute("href",o),{href:r.href,protocol:r.protocol?r.protocol.replace(/:$/,""):"",host:r.host,search:r.search?r.search.replace(/^\?/,""):"",hash:r.hash?r.hash.replace(/^#/,""):"",hostname:r.hostname,port:r.port,pathname:r.pathname.charAt(0)==="/"?r.pathname:"/"+r.pathname}}return s=n(window.location.href),function(o){var u=ie.isString(o)?n(o):o;return u.protocol===s.protocol&&u.host===s.host}}():function(){return function(){return!0}}();function Q(t){this.message=t}Q.prototype.toString=function(){return"Cancel"+(this.message?": "+this.message:"")};Q.prototype.__CANCEL__=!0;var D=Q,$=h,St=ft,gt=dt,At=we,Ot=Et,xt=yt,Rt=wt,F=ge,Ct=B,Tt=D,oe=function(e){return new Promise(function(s,n){var a=e.data,o=e.headers,u=e.responseType,l;function m(){e.cancelToken&&e.cancelToken.unsubscribe(l),e.signal&&e.signal.removeEventListener("abort",l)}$.isFormData(a)&&delete o["Content-Type"];var i=new XMLHttpRequest;if(e.auth){var c=e.auth.username||"",E=e.auth.password?unescape(encodeURIComponent(e.auth.password)):"";o.Authorization="Basic "+btoa(c+":"+E)}var d=Ot(e.baseURL,e.url);i.open(e.method.toUpperCase(),At(d,e.params,e.paramsSerializer),!0),i.timeout=e.timeout;function ee(){if(!!i){var v="getAllResponseHeaders"in i?xt(i.getAllResponseHeaders()):null,S=!u||u==="text"||u==="json"?i.responseText:i.response,w={data:S,status:i.status,statusText:i.statusText,headers:v,config:e,request:i};St(function(I){s(I),m()},function(I){n(I),m()},w),i=null}}if("onloadend"in i?i.onloadend=ee:i.onreadystatechange=function(){!i||i.readyState!==4||i.status===0&&!(i.responseURL&&i.responseURL.indexOf("file:")===0)||setTimeout(ee)},i.onabort=function(){!i||(n(F("Request aborted",e,"ECONNABORTED",i)),i=null)},i.onerror=function(){n(F("Network Error",e,null,i)),i=null},i.ontimeout=function(){var S=e.timeout?"timeout of "+e.timeout+"ms exceeded":"timeout exceeded",w=e.transitional||Ct.transitional;e.timeoutErrorMessage&&(S=e.timeoutErrorMessage),n(F(S,e,w.clarifyTimeoutError?"ETIMEDOUT":"ECONNABORTED",i)),i=null},$.isStandardBrowserEnv()){var te=(e.withCredentials||Rt(d))&&e.xsrfCookieName?gt.read(e.xsrfCookieName):void 0;te&&(o[e.xsrfHeaderName]=te)}"setRequestHeader"in i&&$.forEach(o,function(S,w){typeof a=="undefined"&&w.toLowerCase()==="content-type"?delete o[w]:i.setRequestHeader(w,S)}),$.isUndefined(e.withCredentials)||(i.withCredentials=!!e.withCredentials),u&&u!=="json"&&(i.responseType=e.responseType),typeof e.onDownloadProgress=="function"&&i.addEventListener("progress",e.onDownloadProgress),typeof e.onUploadProgress=="function"&&i.upload&&i.upload.addEventListener("progress",e.onUploadProgress),(e.cancelToken||e.signal)&&(l=function(v){!i||(n(!v||v&&v.type?new Tt("canceled"):v),i.abort(),i=null)},e.cancelToken&&e.cancelToken.subscribe(l),e.signal&&(e.signal.aborted?l():e.signal.addEventListener("abort",l))),a||(a=null),i.send(a)})},f=h,ue=ut,Nt=Se,$t={"Content-Type":"application/x-www-form-urlencoded"};function le(t,e){!f.isUndefined(t)&&f.isUndefined(t["Content-Type"])&&(t["Content-Type"]=e)}function Pt(){var t;return(typeof XMLHttpRequest!="undefined"||typeof process!="undefined"&&Object.prototype.toString.call(process)==="[object process]")&&(t=oe),t}function _t(t,e,r){if(f.isString(t))try{return(e||JSON.parse)(t),f.trim(t)}catch(s){if(s.name!=="SyntaxError")throw s}return(r||JSON.stringify)(t)}var U={transitional:{silentJSONParsing:!0,forcedJSONParsing:!0,clarifyTimeoutError:!1},adapter:Pt(),transformRequest:[function(e,r){return ue(r,"Accept"),ue(r,"Content-Type"),f.isFormData(e)||f.isArrayBuffer(e)||f.isBuffer(e)||f.isStream(e)||f.isFile(e)||f.isBlob(e)?e:f.isArrayBufferView(e)?e.buffer:f.isURLSearchParams(e)?(le(r,"application/x-www-form-urlencoded;charset=utf-8"),e.toString()):f.isObject(e)||r&&r["Content-Type"]==="application/json"?(le(r,"application/json"),_t(e)):e}],transformResponse:[function(e){var r=this.transitional||U.transitional,s=r&&r.silentJSONParsing,n=r&&r.forcedJSONParsing,a=!s&&this.responseType==="json";if(a||n&&f.isString(e)&&e.length)try{return JSON.parse(e)}catch(o){if(a)throw o.name==="SyntaxError"?Nt(o,this,"E_JSON_PARSE"):o}return e}],timeout:0,xsrfCookieName:"XSRF-TOKEN",xsrfHeaderName:"X-XSRF-TOKEN",maxContentLength:-1,maxBodyLength:-1,validateStatus:function(e){return e>=200&&e<300},headers:{common:{Accept:"application/json, text/plain, */*"}}};f.forEach(["delete","get","head"],function(e){U.headers[e]={}});f.forEach(["post","put","patch"],function(e){U.headers[e]=f.merge($t)});var B=U,Lt=h,Dt=B,Ut=function(e,r,s){var n=this||Dt;return Lt.forEach(s,function(o){e=o.call(n,e,r)}),e},Ae=function(e){return!!(e&&e.__CANCEL__)},ce=h,H=Ut,Bt=Ae,jt=B,It=D;function J(t){if(t.cancelToken&&t.cancelToken.throwIfRequested(),t.signal&&t.signal.aborted)throw new It("canceled")}var Mt=function(e){J(e),e.headers=e.headers||{},e.data=H.call(e,e.data,e.headers,e.transformRequest),e.headers=ce.merge(e.headers.common||{},e.headers[e.method]||{},e.headers),ce.forEach(["delete","get","head","post","put","patch","common"],function(n){delete e.headers[n]});var r=e.adapter||jt.adapter;return r(e).then(function(n){return J(e),n.data=H.call(e,n.data,n.headers,e.transformResponse),n},function(n){return Bt(n)||(J(e),n&&n.response&&(n.response.data=H.call(e,n.response.data,n.response.headers,e.transformResponse))),Promise.reject(n)})},p=h,Oe=function(e,r){r=r||{};var s={};function n(i,c){return p.isPlainObject(i)&&p.isPlainObject(c)?p.merge(i,c):p.isPlainObject(c)?p.merge({},c):p.isArray(c)?c.slice():c}function a(i){if(p.isUndefined(r[i])){if(!p.isUndefined(e[i]))return n(void 0,e[i])}else return n(e[i],r[i])}function o(i){if(!p.isUndefined(r[i]))return n(void 0,r[i])}function u(i){if(p.isUndefined(r[i])){if(!p.isUndefined(e[i]))return n(void 0,e[i])}else return n(void 0,r[i])}function l(i){if(i in r)return n(e[i],r[i]);if(i in e)return n(void 0,e[i])}var m={url:o,method:o,data:o,baseURL:u,transformRequest:u,transformResponse:u,paramsSerializer:u,timeout:u,timeoutMessage:u,withCredentials:u,adapter:u,responseType:u,xsrfCookieName:u,xsrfHeaderName:u,onUploadProgress:u,onDownloadProgress:u,decompress:u,maxContentLength:u,maxBodyLength:u,transport:u,httpAgent:u,httpsAgent:u,cancelToken:u,socketPath:u,responseEncoding:u,validateStatus:l};return p.forEach(Object.keys(e).concat(Object.keys(r)),function(c){var E=m[c]||a,d=E(c);p.isUndefined(d)&&E!==l||(s[c]=d)}),s},xe={version:"0.25.0"},qt=xe.version,Z={};["object","boolean","number","function","string","symbol"].forEach(function(t,e){Z[t]=function(s){return typeof s===t||"a"+(e<1?"n ":" ")+t}});var fe={};Z.transitional=function(e,r,s){function n(a,o){return"[Axios v"+qt+"] Transitional option '"+a+"'"+o+(s?". "+s:"")}return function(a,o,u){if(e===!1)throw new Error(n(o," has been removed"+(r?" in "+r:"")));return r&&!fe[o]&&(fe[o]=!0,console.warn(n(o," has been deprecated since v"+r+" and will be removed in the near future"))),e?e(a,o,u):!0}};function kt(t,e,r){if(typeof t!="object")throw new TypeError("options must be an object");for(var s=Object.keys(t),n=s.length;n-- >0;){var a=s[n],o=e[a];if(o){var u=t[a],l=u===void 0||o(u,a,t);if(l!==!0)throw new TypeError("option "+a+" must be "+l);continue}if(r!==!0)throw Error("Unknown option "+a)}}var Ft={assertOptions:kt,validators:Z},Re=h,Ht=we,de=it,he=Mt,j=Oe,Ce=Ft,A=Ce.validators;function T(t){this.defaults=t,this.interceptors={request:new de,response:new de}}T.prototype.request=function(e,r){if(typeof e=="string"?(r=r||{},r.url=e):r=e||{},!r.url)throw new Error("Provided config url is not valid");r=j(this.defaults,r),r.method?r.method=r.method.toLowerCase():this.defaults.method?r.method=this.defaults.method.toLowerCase():r.method="get";var s=r.transitional;s!==void 0&&Ce.assertOptions(s,{silentJSONParsing:A.transitional(A.boolean),forcedJSONParsing:A.transitional(A.boolean),clarifyTimeoutError:A.transitional(A.boolean)},!1);var n=[],a=!0;this.interceptors.request.forEach(function(d){typeof d.runWhen=="function"&&d.runWhen(r)===!1||(a=a&&d.synchronous,n.unshift(d.fulfilled,d.rejected))});var o=[];this.interceptors.response.forEach(function(d){o.push(d.fulfilled,d.rejected)});var u;if(!a){var l=[he,void 0];for(Array.prototype.unshift.apply(l,n),l=l.concat(o),u=Promise.resolve(r);l.length;)u=u.then(l.shift(),l.shift());return u}for(var m=r;n.length;){var i=n.shift(),c=n.shift();try{m=i(m)}catch(E){c(E);break}}try{u=he(m)}catch(E){return Promise.reject(E)}for(;o.length;)u=u.then(o.shift(),o.shift());return u};T.prototype.getUri=function(e){if(!e.url)throw new Error("Provided config url is not valid");return e=j(this.defaults,e),Ht(e.url,e.params,e.paramsSerializer).replace(/^\?/,"")};Re.forEach(["delete","get","head","options"],function(e){T.prototype[e]=function(r,s){return this.request(j(s||{},{method:e,url:r,data:(s||{}).data}))}});Re.forEach(["post","put","patch"],function(e){T.prototype[e]=function(r,s,n){return this.request(j(n||{},{method:e,url:r,data:s}))}});var Jt=T,Yt=D;function O(t){if(typeof t!="function")throw new TypeError("executor must be a function.");var e;this.promise=new Promise(function(n){e=n});var r=this;this.promise.then(function(s){if(!!r._listeners){var n,a=r._listeners.length;for(n=0;n<a;n++)r._listeners[n](s);r._listeners=null}}),this.promise.then=function(s){var n,a=new Promise(function(o){r.subscribe(o),n=o}).then(s);return a.cancel=function(){r.unsubscribe(n)},a},t(function(n){r.reason||(r.reason=new Yt(n),e(r.reason))})}O.prototype.throwIfRequested=function(){if(this.reason)throw this.reason};O.prototype.subscribe=function(e){if(this.reason){e(this.reason);return}this._listeners?this._listeners.push(e):this._listeners=[e]};O.prototype.unsubscribe=function(e){if(!!this._listeners){var r=this._listeners.indexOf(e);r!==-1&&this._listeners.splice(r,1)}};O.source=function(){var e,r=new O(function(n){e=n});return{token:r,cancel:e}};var zt=O,Vt=function(e){return function(s){return e.apply(null,s)}},Wt=h,Xt=function(e){return Wt.isObject(e)&&e.isAxiosError===!0},pe=h,Kt=ve,_=Jt,Gt=Oe,Qt=B;function Te(t){var e=new _(t),r=Kt(_.prototype.request,e);return pe.extend(r,_.prototype,e),pe.extend(r,e),r.create=function(n){return Te(Gt(t,n))},r}var b=Te(Qt);b.Axios=_;b.Cancel=D;b.CancelToken=zt;b.isCancel=Ae;b.VERSION=xe.version;b.all=function(e){return Promise.all(e)};b.spread=Vt;b.isAxiosError=Xt;X.exports=b;X.exports.default=b;var Zt=X.exports;const{accessToken:er,signOut:tr}=He();var me;const Ne=(me=Me.global.locale)!=null?me:"en",$e=Zt.create({baseURL:qe,headers:{Accept:"application/json"}});$e.interceptors.request.use(t=>(t.headers=q(M({},t.headers),{Authorization:`Bearer ${er.value}`,Localization:Ne.value==="vi-VN"?"vi":"en"}),t));$e.interceptors.response.use(t=>{const{data:e}=t;return e.error&&e.error[0].message&&x.create({message:e.error[0].message,position:"top",type:"positive",actions:[{label:"Dismiss",color:"white"}]}),t},function(t){var e;return((e=t==null?void 0:t.response)==null?void 0:e.status)===500?x.create({message:Ne.value==="vi"?"L\u01B0u kh\xF4ng th\xE0nh c\xF4ng. Vui l\xF2ng th\u1EED l\u1EA1i.":"We couldn\u2019t save your changes. Please try again.",position:"top",type:"negative",color:"red-1",textColor:"negative",actions:[{label:"Dismiss",color:"negative"}]}):t.response.data.error[0].code===103?(tr(),x.create({message:t.toString(),position:"top",type:"positive",actions:[{label:"Dismiss",color:"white"}]})):t.response.data.error[0]?x.create({message:t.response.data.error[0].message,position:"top",type:"negative",color:"red-1",textColor:"negative"}):x.create({message:t.response.data.error[0].code.toString(),position:"top",type:"negative",color:"red-1",textColor:"negative"}),t});export{ur as F,ke as G,z as L,sr as V,se as a,$e as b,ar as c,ir as d,or as e,He as u};
