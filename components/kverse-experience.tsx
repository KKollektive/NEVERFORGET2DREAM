"use client"

import { useState, type CSSProperties } from "react"
import { ArrowRight, Compass, Heart, Sparkles, Star, Zap } from "lucide-react"
import type { Venture } from "../data/ecosystem"
import { ModeSelector, type DisplayTheme, type ViewMode } from "./mode-selector"

type KVerseExperienceProps = { ventures: Venture[]; onModeChange: (mode: ViewMode) => void; theme: DisplayTheme; onThemeToggle: () => void }
const avatarColors = [{ name: "Rose", color: "#ed8db5" }, { name: "Violet", color: "#a491f4" }, { name: "Solar", color: "#f0bf75" }]

export function KVerseExperience({ ventures, onModeChange, theme, onThemeToggle }: KVerseExperienceProps) {
  const [selectedId, setSelectedId] = useState(ventures[0]?.id ?? "")
  const [avatarColor, setAvatarColor] = useState(avatarColors[0].color)
  const [xp, setXp] = useState(340)
  const [credits, setCredits] = useState(120)
  const [sparkCollected, setSparkCollected] = useState(false)
  const [message, setMessage] = useState("")
  const selected = ventures.find((venture) => venture.id === selectedId) ?? ventures[0]
  const level = Math.floor(xp / 500) + 1

  function collectSpark() {
    if (sparkCollected) return
    setXp((value) => value + 35)
    setCredits((value) => value + 10)
    setSparkCollected(true)
    setMessage("Dream spark collected · +35 XP · +10 Dream Credits")
  }

  function enterWorld() {
    if (!selected) return
    setXp((value) => value + 15)
    setMessage(`Portal opened to ${selected.shortTitle} · +15 XP`)
  }

  return <main className="kverse-shell" data-theme={theme}>
    <header className="kverse-header">
      <a className="brand-mark" href="/" aria-label="Never Forget to Dream home"><span className="brand-symbol"><Sparkles size={17} /></span><span className="brand-name">NEVER FORGET<span>TO DREAM INC.</span></span></a>
      <div className="kverse-header-right"><span className="kverse-beta"><i /> PLAYER ONE</span><ModeSelector currentMode="kverse" onModeChange={onModeChange} variant="kverse" theme={theme} onThemeToggle={onThemeToggle} /></div>
    </header>
    <section className="kverse-welcome">
      <div><p className="kverse-kicker"><span /> K-VERSE · YOUR GAME SPACE</p><h1>Make a life<br />between <em>worlds.</em></h1><p>Choose a portal, build your power, and let your story take shape.</p></div>
      <div className="kverse-player-card" style={{ "--avatar-accent": avatarColor } as CSSProperties}>
        <div className="kverse-avatar"><Sparkles size={23} /></div><div><span>YOUR AVATAR</span><b>Dreamwalker</b><small>LEVEL {String(level).padStart(2, "0")} · WANDERER</small></div>
        <div className="kverse-credit"><Star size={14} /><b>{credits}</b><small>DREAM CREDITS</small></div>
      </div>
    </section>
    <div className="kverse-layout">
      <section className="kverse-world-panel" aria-label="Choose a world">
        <div className="kverse-panel-heading"><div><span>YOUR MAP</span><h2>Choose a portal</h2></div><span className="kverse-world-count">{String(ventures.length).padStart(2, "0")} WORLDS</span></div>
        <div className="kverse-portals">{ventures.map((venture, index) => <button key={venture.id} className={`kverse-portal${selectedId === venture.id ? " kverse-portal-active" : ""}`} onClick={() => { setSelectedId(venture.id); setMessage("") }} style={{ "--portal-color": venture.color } as CSSProperties} aria-pressed={selectedId === venture.id}>
          <span className="kverse-portal-index">{String(index + 1).padStart(2, "0")}</span><span className="kverse-portal-orb" /><span className="kverse-portal-copy"><b>{venture.shortTitle}</b><small>{venture.moons.length} destinations</small></span><ArrowRight size={14} />
        </button>)}</div>
        {selected && <div className="kverse-selected-world" style={{ "--portal-color": selected.color } as CSSProperties}>
          <div><span>PORTAL SELECTED · {selected.category.replace(/^PLANET \d+ · /, "")}</span><h3>{selected.title}</h3><p>{selected.tagline}</p></div>
          <button onClick={enterWorld}>Enter this world <ArrowRight size={14} /></button>
        </div>}
      </section>
      <aside className="kverse-side-panel">
        <section className="kverse-stats-card"><div className="kverse-panel-heading"><div><span>CHARACTER STATS</span><h2>Growing stronger</h2></div><span className="kverse-level">LVL {level}</span></div>
          <div className="kverse-xp-row"><span>EXPERIENCE</span><b>{xp % 500} / 500 XP</b></div><div className="kverse-xp-track"><i style={{ width: `${(xp % 500) / 5}%` }} /></div>
          <div className="kverse-stat"><Heart size={15} /><span>Healing</span><i><b style={{ width: "46%" }} /></i><strong>04</strong></div>
          <div className="kverse-stat"><Zap size={15} /><span>Energy</span><i><b style={{ width: "68%" }} /></i><strong>07</strong></div>
          <div className="kverse-stat"><Compass size={15} /><span>Lore</span><i><b style={{ width: `${Math.min(20 + level * 8, 92)}%` }} /></i><strong>{String(level + 2).padStart(2, "0")}</strong></div>
        </section>
        <section className="kverse-avatar-card" style={{ "--avatar-accent": avatarColor } as CSSProperties}><div className="kverse-panel-heading"><div><span>AVATAR STUDIO</span><h2>Set your aura</h2></div><Sparkles size={16} /></div><div className="kverse-aura-options" role="group" aria-label="Choose avatar aura">{avatarColors.map((color) => <button key={color.name} onClick={() => setAvatarColor(color.color)} aria-label={`${color.name} aura`} aria-pressed={avatarColor === color.color} style={{ "--swatch": color.color } as CSSProperties} />)}</div><p>Choose the energy you carry through the K-Verse.</p></section>
        <section className="kverse-quest-card"><span className="kverse-quest-icon"><Star size={16} /></span><div><span>DAILY QUEST</span><h2>Gather a dream spark</h2><p>Collect a little light and keep moving forward.</p></div><button onClick={collectSpark} disabled={sparkCollected}>{sparkCollected ? "Collected" : "Collect spark"}<ArrowRight size={13} /></button></section>
        {message && <p className="kverse-toast" role="status">{message}</p>}
      </aside>
    </div>
    <footer className="kverse-footer"><span>THE K-VERSE · A WORK IN PROGRESS</span><span>ONE DREAM · INFINITE DIRECTIONS</span></footer>
  </main>
}
