import{av as e}from"./index.7efcbe86.js";import{b as o}from"./axiosClient.a0ee23b9.js";import{Q as r}from"./queryKeys.832af9fa.js";const s=async t=>{const{data:a}=await o.get("/appendix/getRoleList",{params:{keyword:t}});return a.data},p=t=>e([r.ROLE,t],()=>s(t));export{p as u};