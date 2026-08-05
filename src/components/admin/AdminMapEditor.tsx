import { FormEvent, useEffect, useRef, useState } from "react";
import { ImagePlus, Loader2, MapPinned, Save, Trash2, Upload } from "lucide-react";
import type { SupabaseSession } from "@/lib/supabase-auth";
import { uploadPublicFile } from "@/lib/storage-upload";
import { calculateGeometryArea, formatArea } from "@/lib/map-area";
import {
  createMapObject, deleteMapObject, listMapObjects, updateMapObject,
  type MapObject,
} from "@/lib/map-content-api";
import { loadLeaflet } from "@/components/maps/leaflet-loader";

const initialForm = {
  title_uz:"", title_ru:"", title_en:"", title_zh:"",
  description_uz:"", description_ru:"", description_en:"", description_zh:"",
  latitude:null as number|null, longitude:null as number|null,
  address:"", category:"Бўш ер майдони", image_url:"",
  object_type:"polygon" as MapObject["object_type"],
  geometry:null as MapObject["geometry"],
  area_sqm:0, area_ha:0, is_published:true,
};

const input="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-100";

export function AdminMapEditor({session}:{session:SupabaseSession}) {
  const mapNode=useRef<HTMLDivElement|null>(null);
  const mapRef=useRef<any>(null);
  const drawnRef=useRef<any>(null);
  const displayLayersRef=useRef<Map<string,any>>(new Map());
  const [form,setForm]=useState(initialForm);
  const [items,setItems]=useState<MapObject[]>([]);
  const [editingId,setEditingId]=useState<string|null>(null);
  const [message,setMessage]=useState("");
  const [busy,setBusy]=useState(false);
  const [uploading,setUploading]=useState(false);

  const setValue=(key:string,value:unknown)=>setForm(current=>({...current,[key]:value}));

  async function reload() {
    try { setItems(await listMapObjects(false,session)); }
    catch(e){ setMessage(e instanceof Error?e.message:"Харитани юклашда хато."); }
  }

  useEffect(()=>{ void reload(); },[]);

  function applyGeometry(layer:any, objectType:MapObject["object_type"]) {
    const geo=layer.toGeoJSON();
    const bounds=layer.getBounds?.();
    const center=bounds?bounds.getCenter():layer.getLatLng?.();
    const sqm=calculateGeometryArea(geo.geometry);
    setForm(current=>({
      ...current,
      object_type:objectType,
      geometry:geo.geometry,
      latitude:center?.lat ?? null,
      longitude:center?.lng ?? null,
      area_sqm:Number(sqm.toFixed(2)),
      area_ha:Number((sqm/10000).toFixed(4)),
    }));
  }

  useEffect(()=>{
    if(!mapNode.current||mapRef.current)return;
    let cancelled=false;
    void loadLeaflet(true).then(L=>{
      if(!L||cancelled||!mapNode.current)return;
      const map=L.map(mapNode.current,{center:[37.55,67.45],zoom:8});
      const street=L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",{maxZoom:19,attribution:"© OpenStreetMap"});
      const satellite=L.tileLayer("https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",{maxZoom:19,attribution:"Tiles © Esri"});
      street.addTo(map);
      L.control.layers({"Оддий харита":street,"Спутник":satellite},undefined,{position:"topright"}).addTo(map);

      const drawn=new L.FeatureGroup();
      map.addLayer(drawn);
      drawnRef.current=drawn;

      map.addControl(new L.Control.Draw({
        position:"topright",
        draw:{
          marker:true, polyline:true,
          polygon:{allowIntersection:false,showArea:true},
          rectangle:true, circle:false,circlemarker:false,
        },
        edit:{featureGroup:drawn,edit:true,remove:true},
      }));

      const typeMap:Record<string,MapObject["object_type"]>={
        marker:"marker",polyline:"polyline",polygon:"polygon",rectangle:"rectangle",
      };

      map.on(L.Draw.Event.CREATED,(event:any)=>{
        drawn.clearLayers();
        drawn.addLayer(event.layer);
        applyGeometry(event.layer,typeMap[event.layerType]||"polygon");
        const sqm=calculateGeometryArea(event.layer.toGeoJSON().geometry);
        const area=formatArea(sqm);
        setMessage(sqm>0
          ? `Ер майдони чизилди. Площадь: ${area.hectaresText} га (${area.squareMetersText} м²).`
          : "Объект чизилди. Маълумотларни тўлдириб сақланг.");
      });

      map.on(L.Draw.Event.EDITED,(event:any)=>{
        event.layers.eachLayer((layer:any)=>{
          applyGeometry(layer,form.object_type);
          const area=formatArea(calculateGeometryArea(layer.toGeoJSON().geometry));
          setMessage(`Чегара ўзгартирилди. Янги площадь: ${area.hectaresText} га (${area.squareMetersText} м²).`);
        });
      });

      map.on(L.Draw.Event.DELETED,()=>{
        setForm(current=>({...current,geometry:null,latitude:null,longitude:null,area_sqm:0,area_ha:0}));
      });

      mapRef.current=map;
      setTimeout(()=>map.invalidateSize(),100);
    });
    return()=>{cancelled=true;mapRef.current?.remove();mapRef.current=null;};
  },[]);

  useEffect(()=>{
    const map=mapRef.current,L=window.L;
    if(!map||!L)return;
    displayLayersRef.current.forEach(layer=>map.removeLayer(layer));
    displayLayersRef.current.clear();
    items.forEach(item=>{
      let layer:any=null;
      if(item.geometry){
        layer=L.geoJSON({type:"Feature",geometry:item.geometry,properties:{}},{
          style:{
            color:item.category.includes("Бўш")?"#16a34a":"#0b63ce",
            weight:3,fillColor:item.category.includes("Бўш")?"#22c55e":"#2f80ed",fillOpacity:.28,
          },
          pointToLayer:(_f:any,ll:any)=>L.marker(ll),
        });
      } else if(item.latitude!=null&&item.longitude!=null) layer=L.marker([item.latitude,item.longitude]);
      if(!layer)return;
      const area=formatArea(Number(item.area_sqm||0));
      layer.bindPopup(`<div style="min-width:210px">${item.image_url?`<img src="${item.image_url}" style="width:100%;height:110px;object-fit:cover;border-radius:8px;margin-bottom:8px">`:""}<strong>${item.title_uz||"Ер майдони"}</strong><div style="color:#15803d;font-weight:700;margin-top:5px">Площадь: ${area.hectaresText} га</div><div style="font-size:12px;color:#64748b">${area.squareMetersText} м²</div><div style="font-size:12px;margin-top:5px">${item.address||""}</div></div>`).addTo(map);
      displayLayersRef.current.set(item.id,layer);
    });
  },[items]);

  function reset(){setEditingId(null);setForm(initialForm);drawnRef.current?.clearLayers();}

  function editItem(item:MapObject){
    setEditingId(item.id);
    setForm({
      title_uz:item.title_uz||"",title_ru:item.title_ru||"",title_en:item.title_en||"",title_zh:item.title_zh||"",
      description_uz:item.description_uz||"",description_ru:item.description_ru||"",description_en:item.description_en||"",description_zh:item.description_zh||"",
      latitude:item.latitude,longitude:item.longitude,address:item.address||"",category:item.category||"",
      image_url:item.image_url||"",object_type:item.object_type||"polygon",geometry:item.geometry,
      area_sqm:Number(item.area_sqm||0),area_ha:Number(item.area_ha||0),is_published:item.is_published,
    });
    const L=window.L;if(!L||!drawnRef.current)return;
    drawnRef.current.clearLayers();
    if(item.geometry){
      const geo=L.geoJSON({type:"Feature",geometry:item.geometry,properties:{}});
      geo.eachLayer((layer:any)=>drawnRef.current.addLayer(layer));
      const bounds=geo.getBounds();if(bounds.isValid())mapRef.current?.fitBounds(bounds,{padding:[30,30]});
    }
    document.getElementById("map-object-form")?.scrollIntoView({behavior:"smooth",block:"start"});
  }

  async function uploadImage(file?:File){
    if(!file)return;setUploading(true);setMessage("");
    try{setValue("image_url",await uploadPublicFile("map-photos",file,session));setMessage("Расм юкланди.");}
    catch(e){setMessage(e instanceof Error?e.message:"Расм юклашда хато.");}
    finally{setUploading(false);}
  }

  async function submit(e:FormEvent){
    e.preventDefault();
    if(!form.geometry&&(form.latitude==null||form.longitude==null)){setMessage("Аввал харитада ер майдонини чизинг.");return;}
    setBusy(true);setMessage("");
    try{
      editingId?await updateMapObject(editingId,form,session):await createMapObject(form,session);
      await reload();reset();setMessage("Ер майдони ва унинг площади сақланди.");
    }catch(err){setMessage(err instanceof Error?err.message:"Сақлашда хато.");}
    finally{setBusy(false);}
  }

  async function remove(item:MapObject){
    if(!confirm(`«${item.title_uz||"Ер майдони"}»ни ўчиришни тасдиқлайсизми?`))return;
    await deleteMapObject(item.id,session);await reload();if(editingId===item.id)reset();
  }

  const area=formatArea(Number(form.area_sqm||0));

  return <div className="space-y-6">
    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div><h1 className="text-2xl font-extrabold">Ер майдонларини харитада белгилаш</h1><p className="mt-1 text-sm text-slate-500">Полигон ёки тўртбурчак чизинг — площадь автоматик ҳисобланади.</p></div>
        <span className="inline-flex items-center gap-2 rounded-xl bg-green-50 px-4 py-2 text-sm font-bold text-green-700"><MapPinned className="size-4"/>Ер майдонлари</span>
      </div>
      {message&&<p className="mt-5 rounded-xl bg-blue-50 p-4 text-sm font-semibold text-blue-800">{message}</p>}
      <div ref={mapNode} className="mt-6 h-[560px] overflow-hidden rounded-2xl border border-slate-200"/>
    </section>

    <form id="map-object-form" onSubmit={submit} className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="text-xl font-extrabold">{editingId?"Ер майдонини таҳрирлаш":"Янги ер майдони"}</h2>{editingId&&<button type="button" onClick={reset} className="rounded-xl border px-4 py-2 text-sm font-bold">Янги объект</button>}</div>

      <div className="mt-5 rounded-2xl border-2 border-green-200 bg-green-50 p-5">
        <p className="text-sm font-bold text-green-800">Автоматик ҳисобланган площадь</p>
        <p className="mt-1 text-4xl font-extrabold text-green-900">{area.hectaresText} га</p>
        <p className="mt-1 text-sm font-semibold text-green-700">{area.squareMetersText} м²</p>
      </div>

      <div className="mt-5 grid gap-4 lg:grid-cols-2">
        {[["uz","Ўзбекча"],["ru","Русский"],["en","English"],["zh","中文"]].map(([code,label])=><div key={code} className="rounded-2xl bg-slate-50 p-4"><p className="font-extrabold text-blue-800">{label}</p><label className="mt-3 block text-sm font-bold">Номи<input className={input} value={(form as any)[`title_${code}`]} onChange={e=>setValue(`title_${code}`,e.target.value)}/></label><label className="mt-3 block text-sm font-bold">Тавсиф<textarea rows={3} className={input} value={(form as any)[`description_${code}`]} onChange={e=>setValue(`description_${code}`,e.target.value)}/></label></div>)}
      </div>

      <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
        <label className="text-sm font-bold">Категория<input className={input} value={form.category} onChange={e=>setValue("category",e.target.value)}/></label>
        <label className="text-sm font-bold">Манзил<input className={input} value={form.address} onChange={e=>setValue("address",e.target.value)}/></label>
        <label className="text-sm font-bold">Площадь, га<input readOnly className={input} value={area.hectaresText}/></label>
        <label className="text-sm font-bold">Площадь, м²<input readOnly className={input} value={area.squareMetersText}/></label>
      </div>

      <div className="mt-5 rounded-2xl border p-4"><p className="font-extrabold">Ер майдони расми</p><div className="mt-3 flex flex-wrap items-center gap-4">{form.image_url?<img src={form.image_url} className="h-32 w-48 rounded-xl border object-cover" alt=""/>:<div className="grid h-32 w-48 place-items-center rounded-xl border border-dashed text-slate-400"><ImagePlus/></div>}<label className="inline-flex cursor-pointer items-center gap-2 rounded-xl bg-blue-700 px-5 py-3 text-sm font-bold text-white"><input type="file" accept="image/jpeg,image/png,image/webp" className="hidden" disabled={uploading} onChange={e=>void uploadImage(e.target.files?.[0])}/>{uploading?<Loader2 className="size-4 animate-spin"/>:<Upload className="size-4"/>}{uploading?"Юкланмоқда...":"Компьютердан расм танлаш"}</label><label className="flex items-center gap-3 rounded-xl border px-4 py-3"><input type="checkbox" checked={form.is_published} onChange={e=>setValue("is_published",e.target.checked)}/><b className="text-sm">Сайтда кўрсатиш</b></label></div></div>

      <button disabled={busy||uploading} className="mt-5 inline-flex items-center gap-2 rounded-xl bg-green-700 px-6 py-3 text-sm font-bold text-white disabled:opacity-60"><Save className="size-4"/>{busy?"Сақланмоқда...":"Ер майдонини сақлаш"}</button>
    </form>

    <section className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7"><h2 className="text-xl font-extrabold">Сақланган ер майдонлари</h2><div className="mt-5 space-y-3">{items.map(item=>{const a=formatArea(Number(item.area_sqm||0));return <article key={item.id} className="flex flex-wrap items-center gap-4 rounded-2xl border p-4">{item.image_url&&<img src={item.image_url} className="size-16 rounded-xl object-cover" alt=""/>}<div className="min-w-0 flex-1"><p className="font-extrabold">{item.title_uz||"Номсиз ер майдони"}</p><p className="mt-1 text-sm font-bold text-green-700">Площадь: {a.hectaresText} га · {a.squareMetersText} м²</p></div><button type="button" onClick={()=>editItem(item)} className="rounded-xl border border-blue-200 px-4 py-2 text-sm font-bold text-blue-700">Таҳрирлаш</button><button type="button" onClick={()=>void remove(item)} className="inline-flex items-center gap-2 rounded-xl border border-red-200 px-4 py-2 text-sm font-bold text-red-600"><Trash2 className="size-4"/>Ўчириш</button></article>})}</div></section>
  </div>;
}
