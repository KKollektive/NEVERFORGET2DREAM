"use client"

import { useEffect, useRef, useState } from "react"
import { ChevronDown, Moon, Sparkles, Sun } from "lucide-react"

export type ViewMode = "galaxy" | "standard" | "kverse"
export type DisplayTheme = "night" | "day"
type ModeSelectorProps = { currentMode: ViewMode; onModeChange: (mode: ViewMode) => void; variant: "galaxy" | "standard" | "kverse"; theme: DisplayTheme; onThemeToggle: () => void }

const modes: { id: ViewMode; label: string; description: string }[] = [
  { id: "galaxy", label: "Galaxy", description: "Explore the universe" },
  { id: "standard", label: "Standard site", description: "Browse the creative house" },
  { id: "kverse", label: "K-Verse", description: "Enter the game world" },
]

export function ModeSelector({ currentMode, onModeChange, variant, theme, onThemeToggle }: ModeSelectorProps) {
  const [open, setOpen] = useState(false)
  const root = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const closeOutside = (event: PointerEvent) => {
      if (event.target instanceof Node && !root.current?.contains(event.target)) setOpen(false)
    }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setOpen(false)
    }
    document.addEventListener("pointerdown", closeOutside)
    document.addEventListener("keydown", closeOnEscape)
    return () => {
      document.removeEventListener("pointerdown", closeOutside)
      document.removeEventListener("keydown", closeOnEscape)
    }
  }, [open])

  const current = modes.find((mode) => mode.id === currentMode) ?? modes[0]
  const triggerLabel = variant === "standard" ? "Explore in galaxy" : current.label
  const otherModes = modes.filter((mode) => mode.id !== currentMode)

  return <div className={`mode-selector mode-selector-${variant}`} data-theme={theme} ref={root}>
    <button className={`mode-selector-trigger ${variant === "standard" || variant === "kverse" ? "mode-pill" : "mode-active"}`} onClick={() => setOpen((value) => !value)} aria-expanded={open} aria-controls="view-mode-options" aria-haspopup="true">
      <span className="mode-spark"><Sparkles size={11} /></span>
      <span>{triggerLabel}</span>
      <ChevronDown size={13} className={open ? "mode-chevron mode-chevron-open" : "mode-chevron"} />
    </button>
    {open && <div className="mode-options" id="view-mode-options" role="group" aria-label="Choose a view">
      {otherModes.map((mode) => <button key={mode.id} className="mode-option" onClick={() => { onModeChange(mode.id); setOpen(false) }}>
        <span className={`mode-option-dot mode-option-${mode.id}`} />
        <span><b>{mode.label}</b><small>{mode.description}</small></span>
      </button>)}
      <div className="appearance-option">
        <span>APPEARANCE</span>
        <button type="button" onClick={onThemeToggle} aria-label={`Switch to ${theme === "night" ? "day" : "night"} view`} aria-pressed={theme === "day"}>
          {theme === "night" ? <Sun size={14} /> : <Moon size={14} />}
          <span>{theme === "night" ? "Day view" : "Night view"}</span>
          <small>{theme === "night" ? "LIGHT" : "DARK"}</small>
        </button>
      </div>
    </div>}
  </div>
}
