"use client"

import { useEffect, useState, type FormEvent } from "react"
import Link from "next/link"
import { ArrowRight, ExternalLink, Save, Settings2 } from "lucide-react"
import { cn } from "cn"
import type { Venture } from "../data/ventures"
import { BridgeTelemetry } from "./bridge-telemetry"
import { VentureIcon } from "./venture-icon"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { Field, FieldDescription, FieldError, FieldGroup, FieldLabel, FieldSet, FieldLegend } from "./ui/field"
import { Input } from "./ui/input"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"

type VentureConfig = {
  primaryUrl: string
  affiliateUrl: string
  telemetryEndpoint: string
}

const emptyConfig: VentureConfig = { primaryUrl: "", affiliateUrl: "", telemetryEndpoint: "" }

function isHttpsUrl(value: string) {
  if (!value.trim()) return true
  try {
    return new URL(value).protocol === "https:"
  } catch {
    return false
  }
}

function ConfigSheet({ venture }: { venture: Venture }) {
  const [open, setOpen] = useState(false)
  const [config, setConfig] = useState<VentureConfig>(emptyConfig)
  const [error, setError] = useState("")
  const [saved, setSaved] = useState(false)
  const storageKey = `galaxy-venture-config-v1:${venture.slug}`

  useEffect(() => {
    try {
      const stored = window.localStorage.getItem(storageKey)
      if (!stored) {
        setConfig(emptyConfig)
        return
      }
      const parsed = JSON.parse(stored) as Partial<VentureConfig>
      setConfig({
        primaryUrl: typeof parsed.primaryUrl === "string" ? parsed.primaryUrl : "",
        affiliateUrl: typeof parsed.affiliateUrl === "string" ? parsed.affiliateUrl : "",
        telemetryEndpoint: typeof parsed.telemetryEndpoint === "string" ? parsed.telemetryEndpoint : "",
      })
    } catch {
      setConfig(emptyConfig)
    }
  }, [storageKey])

  function handleSave(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (![config.primaryUrl, config.affiliateUrl, config.telemetryEndpoint].every(isHttpsUrl)) {
      setError("Use a valid HTTPS URL for each configured destination.")
      setSaved(false)
      return
    }

    try {
      window.localStorage.setItem(storageKey, JSON.stringify(config))
      setError("")
      setSaved(true)
    } catch {
      setError("This browser could not save the configuration. Check its storage settings and try again.")
      setSaved(false)
    }
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        render={<Button variant="outline" size="sm" className="gap-2 border-primary/25 bg-primary/5 text-primary hover:bg-primary/10" />}
      >
        <Settings2 aria-hidden="true" data-icon="inline-start" />
        Edit App & Affiliate Config
      </SheetTrigger>
      <SheetContent side="right" className="w-full overflow-y-auto border-border bg-popover p-0 text-popover-foreground sm:max-w-xl">
        <SheetHeader className="border-b border-border/80 px-6 py-5">
          <Badge variant="outline" className="w-fit border-primary/30 text-primary">{venture.name}</Badge>
          <SheetTitle className="mt-2 text-xl">App & affiliate configuration</SheetTitle>
          <SheetDescription>
            Save public destinations for this workspace. Values stay in this browser and are not sent anywhere yet.
          </SheetDescription>
        </SheetHeader>
        <form onSubmit={handleSave} className="flex flex-col gap-6 p-6">
          <FieldSet>
            <FieldLegend>Workspace destinations</FieldLegend>
            <FieldGroup className="gap-5">
              <Field data-invalid={Boolean(error && !isHttpsUrl(config.primaryUrl))}>
                <FieldLabel htmlFor="galaxy-primary-url">Standalone Lovable URL</FieldLabel>
                <Input
                  id="galaxy-primary-url"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://your-app.lovable.app"
                  value={config.primaryUrl}
                  onChange={(event) => setConfig((current) => ({ ...current, primaryUrl: event.target.value }))}
                  aria-invalid={Boolean(error && !isHttpsUrl(config.primaryUrl))}
                />
                <FieldDescription>The independent app destination used by internal launch links.</FieldDescription>
              </Field>
              <Field data-invalid={Boolean(error && !isHttpsUrl(config.affiliateUrl))}>
                <FieldLabel htmlFor="galaxy-affiliate-url">Public affiliate referral URL</FieldLabel>
                <Input
                  id="galaxy-affiliate-url"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://partner.example/referral"
                  value={config.affiliateUrl}
                  onChange={(event) => setConfig((current) => ({ ...current, affiliateUrl: event.target.value }))}
                  aria-invalid={Boolean(error && !isHttpsUrl(config.affiliateUrl))}
                />
                <FieldDescription>Only use a destination that is approved for public partner referrals.</FieldDescription>
              </Field>
              <Field data-invalid={Boolean(error && !isHttpsUrl(config.telemetryEndpoint))}>
                <FieldLabel htmlFor="galaxy-telemetry-endpoint">Supabase telemetry endpoint</FieldLabel>
                <Input
                  id="galaxy-telemetry-endpoint"
                  type="url"
                  inputMode="url"
                  autoComplete="url"
                  placeholder="https://project.supabase.co/functions/v1/telemetry"
                  value={config.telemetryEndpoint}
                  onChange={(event) => setConfig((current) => ({ ...current, telemetryEndpoint: event.target.value }))}
                  aria-invalid={Boolean(error && !isHttpsUrl(config.telemetryEndpoint))}
                />
                <FieldDescription>Do not enter API keys, access tokens, or other secrets here.</FieldDescription>
              </Field>
            </FieldGroup>
          </FieldSet>
          {error && <FieldError>{error}</FieldError>}
          {saved && <p role="status" className="text-sm text-primary">Saved locally for this browser.</p>}
          <div className="flex flex-wrap items-center gap-3 border-t border-border/80 pt-5">
            <Button type="submit" className="gap-2">
              <Save aria-hidden="true" data-icon="inline-start" />
              Save configuration
            </Button>
            <Button type="button" variant="ghost" onClick={() => setOpen(false)}>Close</Button>
          </div>
          <p className="text-xs leading-relaxed text-muted-foreground">
            These settings are a local prototype only. Affiliate links are not published and telemetry is not transmitted until a protected backend is connected.
          </p>
        </form>
      </SheetContent>
    </Sheet>
  )
}

function ModuleCard({ module }: { module: Venture["modules"][number] }) {
  return (
    <Card className="group border-border/80 bg-card/80 transition-colors hover:border-primary/25 hover:bg-card">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
            <VentureIcon name={module.icon} className="size-4" />
          </span>
          <Badge variant="outline" className="border-border/80 text-muted-foreground">Workspace module</Badge>
        </div>
        <div className="grid gap-1.5">
          <CardTitle className="text-base">{module.title}</CardTitle>
          <CardDescription className="text-xs leading-relaxed">{module.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between gap-3 border-t border-border/70 pt-3 text-xs text-muted-foreground">
          <span>Independent app canvas</span>
          <ArrowRight aria-hidden="true" className="size-4" />
        </div>
      </CardContent>
    </Card>
  )
}

export function VentureWorkspace({ venture, internalMode }: { venture: Venture; internalMode: boolean }) {
  const badgeLabel = venture.plane === "back_office"
    ? "PRIVATE BACK OFFICE"
    : venture.plane === "commercial_affiliate"
      ? internalMode ? "BACK-OFFICE MANAGED // PUBLIC AFFILIATE LISTING" : "FEATURED ECOSYSTEM AFFILIATE"
      : "PUBLIC CREATIVE STUDIO"

  return (
    <div className="grid gap-6">
      <section className="flex flex-col justify-between gap-5 rounded-xl border border-border/80 bg-card/55 p-5 sm:flex-row sm:items-end sm:p-7">
        <div className="grid max-w-3xl gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline" className={cn("border-primary/30 text-primary", venture.plane === "back_office" && "border-border text-muted-foreground")}>
              {badgeLabel}
            </Badge>
            {venture.plane === "commercial_affiliate" && !internalMode && (
              <Badge variant="secondary" className="bg-primary/10 text-primary">Featured Partner</Badge>
            )}
          </div>
          <div>
            <h2 className="font-serif text-3xl tracking-tight text-foreground sm:text-4xl">{venture.name}</h2>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">{venture.workspaceDescription ?? venture.description}</p>
          </div>
          {!internalMode && venture.plane === "commercial_affiliate" && (
            <p className="text-xs text-muted-foreground">Independent partner product. Public referral destination is not configured.</p>
          )}
        </div>
        {internalMode && <ConfigSheet venture={venture} />}
      </section>

      {internalMode && venture.plane !== "back_office" && <BridgeTelemetry venture={venture} />}

      <section aria-labelledby="workspace-title" className="grid gap-4">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div>
            <p className="text-[10px] font-semibold tracking-[0.18em] text-primary">INDEPENDENT WORKSPACE</p>
            <h3 id="workspace-title" className="mt-1 text-lg font-medium text-foreground">{venture.name} canvas</h3>
          </div>
          {internalMode && venture.plane !== "back_office" && (
            <Link href="/back-office/founder-command-center" className="inline-flex items-center gap-2 text-xs text-muted-foreground transition-colors hover:text-primary">
              Open Founder Command Center <ExternalLink aria-hidden="true" />
            </Link>
          )}
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {venture.modules.map((module) => <ModuleCard key={module.title} module={module} />)}
        </div>
      </section>
    </div>
  )
}
