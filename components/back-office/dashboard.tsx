"use client"

import { useEffect, useMemo, useState } from "react"
import { ArrowDown, ArrowUp, ExternalLink, Eye, EyeOff, LogOut, Plus, Save, Sparkles, Trash2 } from "lucide-react"
import { ecosystem, type EcosystemLink, type EcosystemProject, type StoreProduct, type Venture } from "../../data/ecosystem"
import { signOutFounder } from "../../app/back-office/actions"

type Tab = "worlds" | "links" | "projects" | "shop"
type Draft = { ventures: Venture[] }
const STORAGE_KEY = "nfdt-ecosystem-v1"

export function FounderDashboard() {
  const [data, setData] = useState<Draft>({ ventures: ecosystem.ventures })
  const [tab, setTab] = useState<Tab>("worlds")
  const [saved, setSaved] = useState(false)
  const [activeWorld, setActiveWorld] = useState(0)
  useEffect(() => {
    try { const stored = localStorage.getItem(STORAGE_KEY); if (stored) setData(JSON.parse(stored) as Draft) } catch { localStorage.removeItem(STORAGE_KEY) }
  }, [])
  const venture = data.ventures[activeWorld]
  const activeCount = useMemo(() => data.ventures.filter((item) => item.visible !== false).length, [data.ventures])
  function persist(next: Draft) {
    setData(next)
    localStorage.setItem(STORAGE_KEY, JSON.stringify(next))
    setSaved(true)
    window.setTimeout(() => setSaved(false), 1800)
  }
  function updateVenture(patch: Partial<Venture>) {
    persist({ ventures: data.ventures.map((item, index) => index === activeWorld ? { ...item, ...patch } : item) })
  }
  function moveWorld(index: number, direction: -1 | 1) {
    const target = index + direction
    if (target < 0 || target >= data.ventures.length) return
    const next = [...data.ventures]; [next[index], next[target]] = [next[target], next[index]]
    persist({ ventures: next }); setActiveWorld(target)
  }
  function addWorld() {
    const newWorld: Venture = { id: `new-world-${Date.now()}`, order: data.ventures.length + 1, title: "A new world", shortTitle: "New world", category: "NEW VENTURE", tagline: "A new idea is taking shape.", story: "Tell the story of this world.", color: "#d884ad", radius: 8 + data.ventures.length * 0.5, size: 0.31, speed: 0.04, phase: 0.6, cta: "Explore this world", href: "#", links: [], projects: [], moons: [] }
    const next = [...data.ventures, newWorld]; persist({ ventures: next }); setActiveWorld(next.length - 1)
  }
  function deleteWorld(index: number) {
    if (data.ventures.length < 2) return
    const next = data.ventures.filter((_, i) => i !== index); persist({ ventures: next }); setActiveWorld(Math.min(index, next.length - 1))
  }
  function updateChild(key: "links" | "projects" | "products", index: number, patch: Record<string, unknown>) {
    const list = [...((venture[key] ?? []) as Array<EcosystemLink | EcosystemProject | StoreProduct>)]
    list[index] = { ...list[index], ...patch }
    updateVenture({ [key]: list })
  }
  function moveChild(key: "links" | "projects" | "products", index: number, direction: -1 | 1) {
    const list = [...((venture[key] ?? []) as unknown[])]
    const target = index + direction
    if (target < 0 || target >= list.length) return
    ;[list[index], list[target]] = [list[target], list[index]]
    updateVenture({ [key]: list })
  }
  function addChild(key: "links" | "projects" | "products") {
    const base = key === "links" ? { label: "New link", href: "#" } : key === "projects" ? { title: "New project", type: "Project", description: "Add a short introduction.", href: "#" } : { name: "New product", category: "Collection", price: "$0", details: "Add product details.", href: "#" }
    updateVenture({ [key]: [...((venture[key] ?? []) as unknown[]), base] } as Pick<Venture, typeof key>)
  }
  function removeChild(key: "links" | "projects" | "products", index: number) {
    const next = [...((venture[key] ?? []) as unknown[])]; next.splice(index, 1)
    updateVenture({ [key]: next } as Pick<Venture, typeof key>)
  }
  const arrays = tab === "links" ? (venture.links ?? []) : tab === "projects" ? (venture.projects ?? []) : tab === "shop" ? (venture.products ?? []) : []
  const childKey: "links" | "projects" | "products" = tab === "shop" ? "products" : tab === "projects" ? "projects" : "links"
  return <main className="backoffice-page"><aside className="backoffice-sidebar"><a className="admin-logo" href="/"><span className="brand-symbol"><Sparkles size={16}/></span><span>NEVER FORGET<span>FOUNDER PORTAL</span></span></a><div className="admin-status"><i/> ECOSYSTEM LIVE</div><p className="sidebar-label">YOUR WORKSPACE</p><nav className="admin-nav">{(["worlds","links","projects","shop"] as Tab[]).map((item) => <button key={item} className={tab===item?"admin-nav-active":""} onClick={()=>setTab(item)}><span className="admin-nav-dot"/>{item === "worlds" ? "Planets & websites" : item === "links" ? "External links" : item === "projects" ? "Active projects" : "Store products"}</button>)}</nav><div className="sidebar-spacer"/><a className="back-to-site" href="/">↖ <span>Back to the site</span></a><form action={signOutFounder}><button className="signout-button"><LogOut size={14}/> Sign out</button></form><div className="sidebar-foot">NEVER FORGET TO DREAM INC.<br/>FOUNDER CONSOLE · 01</div></aside>
    <section className="admin-main"><header className="admin-topbar"><div><span>FOUNDER CONSOLE</span><b>/ {tab === "worlds" ? "PLANETS & WEBSITES" : tab === "links" ? "EXTERNAL LINKS" : tab === "projects" ? "ACTIVE PROJECTS" : "STORE PRODUCTS"}</b></div><div className="admin-top-actions"><span className="save-indicator"><i/>{saved ? "Saved just now" : "Changes save automatically"}</span><a href="/" target="_blank" rel="noreferrer">View live site <ExternalLink size={13}/></a></div></header><div className="admin-content"><div className="admin-welcome"><div><p className="standard-kicker"><span/> YOUR CREATIVE COMMAND CENTER</p><h1>Good ideas need<br/><em>a place to land.</em></h1><p>Shape the worlds, stories, and offerings across your ecosystem.</p></div><div className="admin-date">{activeCount.toString().padStart(2,"0")} <span>WORLDS<br/>VISIBLE</span></div></div>
      <div className="quick-launch"><a href="#second-me" target="_blank"><span className="quick-icon">✳</span><small>AI & BRAND</small><b>Second Me</b><span className="quick-arrow">↗</span></a><a href="#analytics" target="_blank"><span className="quick-icon">◌</span><small>MEASURE</small><b>Analytics</b><span className="quick-arrow">↗</span></a><a href="#pipeline" target="_blank"><span className="quick-icon">✺</span><small>MAKE & SHARE</small><b>Content pipeline</b><span className="quick-arrow">↗</span></a></div>
      <div className="manager-layout"><aside className="world-list"><div className="world-list-head"><span>YOUR WORLDS <b>{data.ventures.length.toString().padStart(2,"0")}</b></span><button onClick={addWorld} aria-label="Add world"><Plus size={15}/></button></div>{data.ventures.map((item,index)=><div className={`world-list-item ${activeWorld===index?"world-list-selected":""}`} key={item.id}><button onClick={()=>setActiveWorld(index)}><i style={{background:item.color}}/><span>{item.shortTitle}</span></button><div className="world-reorder"><button disabled={index===0} onClick={()=>moveWorld(index,-1)} aria-label="Move up"><ArrowUp size={12}/></button><button disabled={index===data.ventures.length-1} onClick={()=>moveWorld(index,1)} aria-label="Move down"><ArrowDown size={12}/></button></div></div>)}<button className="add-world" onClick={addWorld}><Plus size={13}/> Add a world</button></aside>
      <section className="editor-panel"><div className="editor-heading"><div><span>EDITING WORLD</span><h2>{venture?.shortTitle}</h2></div><button className={`visibility-toggle ${venture?.visible===false?"is-hidden":""}`} onClick={()=>updateVenture({visible:venture.visible===false})}>{venture?.visible===false?<><EyeOff size={13}/> Hidden</>:<><Eye size={13}/> Visible</>}</button></div>
      {tab === "worlds" ? <div className="field-grid"><label>World title<input value={venture.title} onChange={(e)=>updateVenture({title:e.target.value})}/></label><label>Short name<input value={venture.shortTitle} onChange={(e)=>updateVenture({shortTitle:e.target.value})}/></label><label>Category<input value={venture.category} onChange={(e)=>updateVenture({category:e.target.value})}/></label><label>Tagline<input value={venture.tagline} onChange={(e)=>updateVenture({tagline:e.target.value})}/></label><label className="field-wide">Brand story<textarea rows={3} value={venture.story} onChange={(e)=>updateVenture({story:e.target.value})}/></label><label>Primary link<input value={venture.href} onChange={(e)=>updateVenture({href:e.target.value})}/></label><label>Button label<input value={venture.cta} onChange={(e)=>updateVenture({cta:e.target.value})}/></label><div className="editor-save-note"><Save size={13}/> Updates appear in both Galaxy and Standard site modes.</div><button className="delete-world" onClick={()=>deleteWorld(activeWorld)}><Trash2 size={13}/> Remove this world</button></div> : <div className="child-manager"><div className="child-manager-head"><p>{tab === "links" ? "Links visitors can follow from this world." : tab === "projects" ? "The stories and experiences visitors can discover." : "Featured objects and digital products in your shop."}</p><button onClick={()=>addChild(childKey)}><Plus size={13}/> Add {tab === "links"?"link":tab === "projects"?"project":"product"}</button></div>{arrays.map((item,index)=><div className={`child-row ${item.visible===false?"child-hidden":""}`} key={index}><div className="child-fields"><div className="child-item-actions"><span>{item.visible===false?"HIDDEN":"VISIBLE"}</span><button onClick={()=>moveChild(childKey,index,-1)} disabled={index===0} aria-label="Move item up"><ArrowUp size={12}/></button><button onClick={()=>moveChild(childKey,index,1)} disabled={index===arrays.length-1} aria-label="Move item down"><ArrowDown size={12}/></button><button onClick={()=>updateChild(childKey,index,{visible:item.visible===false})} aria-label={item.visible===false?"Show item":"Hide item"}>{item.visible===false?<EyeOff size={13}/>:<Eye size={13}/>}</button></div>{"label" in item ? <label>Link label<input value={item.label} onChange={e=>updateChild("links",index,{label:e.target.value})}/></label> : "title" in item ? <><label>Project title<input value={item.title} onChange={e=>updateChild("projects",index,{title:e.target.value})}/></label><label>Type<input value={item.type} onChange={e=>updateChild("projects",index,{type:e.target.value})}/></label><label className="field-wide">Description<input value={item.description} onChange={e=>updateChild("projects",index,{description:e.target.value})}/></label></> : <><label>Product name<input value={item.name} onChange={e=>updateChild("products",index,{name:e.target.value})}/></label><label>Price<input value={item.price} onChange={e=>updateChild("products",index,{price:e.target.value})}/></label><label>Category<input value={item.category} onChange={e=>updateChild("products",index,{category:e.target.value})}/></label><label>Details<input value={item.details} onChange={e=>updateChild("products",index,{details:e.target.value})}/></label></>}{"href" in item&&<label className="field-wide">Destination URL<input value={item.href} onChange={e=>updateChild("links" in item?"links":"title" in item?"projects":"products",index,{href:e.target.value})}/></label>}</div><button className="remove-child" onClick={()=>removeChild(childKey,index)} aria-label="Remove item"><Trash2 size={13}/></button></div>)}{arrays.length===0&&<div className="empty-manager">No {tab} yet. Add the first one above.</div>}</div>}
      </section></div>
      <div className="admin-mobile-footer"><span><i/> LOCAL PREVIEW DATA</span><span>Your edits are saved in this browser.</span></div></div></section></main>
}
