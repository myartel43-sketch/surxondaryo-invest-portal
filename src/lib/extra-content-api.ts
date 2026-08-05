import type { SupabaseSession } from "@/lib/supabase-auth";

export type StaffItem = { id:string; name_uz:string; name_ru:string; name_en:string; name_zh:string; role_uz:string; role_ru:string; role_en:string; role_zh:string; phone:string; email:string; image_url:string; sort_order:number; is_published:boolean };
export type DocumentItem = { id:string; title_uz:string; title_ru:string; title_en:string; title_zh:string; file_type:string; document_date:string; file_url:string; is_published:boolean };
export type MediaItem = { id:string; title_uz:string; title_ru:string; title_en:string; title_zh:string; description_uz:string; description_ru:string; description_en:string; description_zh:string; media_type:string; media_url:string; thumbnail_url:string; is_published:boolean };
export type MapItem = { id:string; title_uz:string; title_ru:string; title_en:string; title_zh:string; description_uz:string; description_ru:string; description_en:string; description_zh:string; latitude:number; longitude:number; address:string; category:string; image_url:string; is_published:boolean };

function cfg(){ const url=(import.meta.env.VITE_SUPABASE_URL as string|undefined)?.replace(/\/$/,""); const key=import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string|undefined; if(!url||!key) throw new Error("Supabase муҳит ўзгарувчилари киритилмаган."); return {url,key}; }
async function req<T>(path:string, init:RequestInit={}, session?:SupabaseSession):Promise<T>{ const {url,key}=cfg(); const r=await fetch(`${url}/rest/v1/${path}`,{...init,headers:{apikey:key,Authorization:`Bearer ${session?.access_token||key}`,"Content-Type":"application/json",Prefer:"return=representation",...(init.headers||{})}}); if(!r.ok) throw new Error((await r.text())||`Supabase хатоси: ${r.status}`); if(r.status===204)return undefined as T; return r.json() as Promise<T>; }

export const emptyStaff=()=>({name_uz:"",name_ru:"",name_en:"",name_zh:"",role_uz:"",role_ru:"",role_en:"",role_zh:"",phone:"",email:"",image_url:"",sort_order:0,is_published:true});
export const emptyDocument=()=>({title_uz:"",title_ru:"",title_en:"",title_zh:"",file_type:"PDF",document_date:new Date().toISOString().slice(0,10),file_url:"",is_published:true});
export const emptyMedia=()=>({title_uz:"",title_ru:"",title_en:"",title_zh:"",description_uz:"",description_ru:"",description_en:"",description_zh:"",media_type:"image",media_url:"",thumbnail_url:"",is_published:true});
export const emptyMap=()=>({title_uz:"",title_ru:"",title_en:"",title_zh:"",description_uz:"",description_ru:"",description_en:"",description_zh:"",latitude:37.2242,longitude:67.2783,address:"",category:"Инвестиция объекти",image_url:"",is_published:true});

export const listStaff=(pub=false,s?:SupabaseSession)=>req<StaffItem[]>(`staff?select=*&order=sort_order.asc${pub?"&is_published=eq.true":""}`,{},s);
export const listDocuments=(pub=false,s?:SupabaseSession)=>req<DocumentItem[]>(`documents?select=*&order=document_date.desc${pub?"&is_published=eq.true":""}`,{},s);
export const listMedia=(pub=false,s?:SupabaseSession)=>req<MediaItem[]>(`media_items?select=*&order=created_at.desc${pub?"&is_published=eq.true":""}`,{},s);
export const listMapItems=(pub=false,s?:SupabaseSession)=>req<MapItem[]>(`map_objects?select=*&order=created_at.desc${pub?"&is_published=eq.true":""}`,{},s);

export const createExtra=(table:string,item:any,s:SupabaseSession)=>req<any[]>(table,{method:"POST",body:JSON.stringify(item)},s);
export const updateExtra=(table:string,id:string,item:any,s:SupabaseSession)=>req<any[]>(`${table}?id=eq.${id}`,{method:"PATCH",body:JSON.stringify(item)},s);
export const deleteExtra=(table:string,id:string,s:SupabaseSession)=>req<void>(`${table}?id=eq.${id}`,{method:"DELETE"},s);
export const localized=(item:any,field:string,lang:string)=>item[`${field}_${lang}`]||item[`${field}_uz`]||"";
