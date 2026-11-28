"use client"

import { useEffect, useState } from "react"
import { SiteGuideAssistant } from "./site-guide-assistant"
import { ecosystem, type Venture } from "../data/ecosystem"
import { GalaxyExperience } from "./galaxy-experience"
import { StandardSite } from "./standard-site"
import { KVerseExperience } from "./kverse-experience"
import type { DisplayTheme, ViewMode } from "./mode-selector"

const STORAGE_KEY = "nfdt-ecosystem-v1"

export function EcosystemHome() {
  const [ventures, setVentures] = useState<Venture[]>(ecosystem.ventures)
  const [mode, setMode] = useState<ViewMode>("galaxy")
  const [theme, setTheme] = useState<DisplayTheme>("night")
  const toggleTheme = () => setTheme((current) => current === "night" ? "day" : "night")
  useEffect(() => {
    try {
      const saved = window.localStorage.getItem(STORAGE_KEY)
      if (saved) {
        const parsed = JSON.parse(saved) as { ventures?: Venture[] }
        if (Array.isArray(parsed.ventures)) setVentures(parsed.ventures.filter((venture) => venture.visible !== false))
      }
    } catch { window.localStorage.removeItem(STORAGE_KEY) }
  }, [])
  return <>
    {mode === "galaxy" ? <GalaxyExperience ventures={ventures} onModeChange={setMode} theme={theme} onThemeToggle={toggleTheme} /> : mode === "standard" ? <StandardSite ventures={ventures} onModeChange={setMode} theme={theme} onThemeToggle={toggleTheme} /> : <KVerseExperience ventures={ventures} onModeChange={setMode} theme={theme} onThemeToggle={toggleTheme} />}
    <SiteGuideAssistant />
  </>
}
