var R=Object.defineProperty,p=Object.defineProperties;var F=Object.getOwnPropertyDescriptors;var f=Object.getOwnPropertySymbols;var g=Object.prototype.hasOwnProperty,Q=Object.prototype.propertyIsEnumerable;var m=(o,t,n)=>t in o?R(o,t,{enumerable:!0,configurable:!0,writable:!0,value:n}):o[t]=n,c=(o,t)=>{for(var n in t||(t={}))g.call(t,n)&&m(o,n,t[n]);if(f)for(var n of f(t))Q.call(t,n)&&m(o,n,t[n]);return o},d=(o,t)=>p(o,F(t));import{av as v}from"./index.7efcbe86.js";import{b as h}from"./axiosClient.a0ee23b9.js";import{Q as B}from"./queryKeys.832af9fa.js";const L=async()=>{const{data:o}=await h.get("/configuration/room/getRoomTypeFloorInfo");return o.data},I=()=>{const o=v(B.FLOORS,L,{staleTime:1e4}),t=e=>{if(!e)return null;const r=o.data.value;if(!r)return null;let l=null;for(let s=0;s<r.length;s++){const u=r[s].roomList;for(let a=0;a<u.length;a++){const i=u[a];if(i.sn===e){l=i;break}}}return l},n=e=>{if(!e)return null;const r=o.data.value;return r?r.find(({roomList:s})=>s.some(({sn:u})=>u===e)):null},y=e=>{var l,s;if(!e)return null;const r=o.data.value;return(s=(l=r==null?void 0:r.find(u=>u.sn===e))==null?void 0:l.roomList)!=null?s:null};return d(c({},o),{findRoomByRoomSn:t,findRoomsByFloorSn:y,findFloorByRoomSn:n})};export{I as u};