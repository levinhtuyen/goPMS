import{b as e}from"./axiosClient.ad61c203.js";import{Q as a}from"./queryKeys.832af9fa.js";import{aE as r}from"./index.4bd8ab7e.js";const o=async()=>{const{data:t}=await e.get("/configuration/cashiering/getCategoryReceiptTypeList");return t.data},c=()=>r(a.RECEIPT_TYPES,o);export{c as u};
