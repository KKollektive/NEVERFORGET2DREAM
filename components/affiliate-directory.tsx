"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { ComponentProps } from "react"
import { ArrowUpRight, Compass, Sparkles } from "lucide-react"
import { cn } from "cn"
import { affiliateVentures, studioVentures } from "../data/ventures"
import { VentureIcon } from "./venture-icon"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { buttonVariants } from "./ui/button"

type DirectoryCardProps = {
  name: string
  description: string
  icon: ComponentProps<typeof VentureIcon>["name"]
  href: string
  badge: string
  partner?: boolean
  external?: boolean
}

function DirectoryCard({ name, description, icon, href, badge, partner = false, external = false }: DirectoryCardProps) {
  const actionClassName = cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 border-border/80 group-hover:border-primary/30 group-hover:text-primary")
  const action = external ? (
    <a href={href} target="_blank" rel="noopener noreferrer" className={actionClassName}>
      Explore <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
    </a>
  ) : (
    <Link href={href} className={actionClassName}>
      Explore <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
    </Link>
  )

  return (
    <Card className="group border-border/80 bg-card/75 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="grid size-11 place-items-center rounded-lg border border-primary/20 bg-primary/5 text-primary">
            <VentureIcon name={icon} className="size-5" />
          </span>
          <Badge variant={partner ? "secondary" : "outline"} className={partner ? "bg-primary/10 text-primary" : "border-border text-muted-foreground"}>
            {badge}
          </Badge>
        </div>
        <div className="grid gap-2">
          <CardTitle className="text-lg">{name}</CardTitle>
          <CardDescription className="min-h-12 text-sm leading-relaxed">{description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex items-center justify-between gap-3">
        <p className="text-xs text-muted-foreground">{partner ? external ? "Partner referral link" : "Referral destination pending" : "Independent creative workspace"}</p>
        {action}
      </CardContent>
    </Card>
  )
}

export function AffiliateDirectory({ founderPreview = false }: { founderPreview?: boolean }) {
  const [affiliateLinks, setAffiliateLinks] = useState<Record<string, string>>({})

  useEffect(() => {
    const nextLinks: Record<string, string> = {}
    for (const venture of affiliateVentures) {
      try {
        const raw = window.localStorage.getItem(`galaxy-venture-config-v1:${venture.slug}`)
        if (!raw) continue
        const parsed = JSON.parse(raw) as { affiliateUrl?: unknown }
        if (typeof parsed.affiliateUrl !== "string" || !parsed.affiliateUrl.trim()) continue
        const url = new URL(parsed.affiliateUrl)
        if (url.protocol === "https:") nextLinks[venture.slug] = url.toString()
      } catch {
        continue
      }
    }
    setAffiliateLinks(nextLinks)
  }, [])

  return (
    <main className="galaxy-directory h-svh min-h-svh overflow-y-auto bg-background text-foreground">
      <header className="sticky top-0 z-20 border-b border-border/80 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex min-h-[4.5rem] max-w-[1440px] items-center justify-between gap-4 px-4 sm:px-7 lg:px-10">
          <Link href="/directory" className="flex items-center gap-3 text-foreground no-underline">
            <span className="grid size-9 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary"><Sparkles aria-hidden="true" className="size-4" /></span>
            <span className="grid gap-0.5">
              <span className="text-sm font-semibold tracking-[0.18em]">GALAXY</span>
              <span className="text-[9px] tracking-[0.14em] text-muted-foreground">PUBLIC DIRECTORY</span>
            </span>
          </Link>
          {founderPreview && (
            <div className="flex items-center gap-2" role="group" aria-label="Preview mode">
              <Badge variant="outline" className="hidden border-primary/25 text-primary sm:inline-flex">Public affiliate directory preview</Badge>
              <Link href="/" className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "gap-2 bg-primary/10 text-primary hover:bg-primary/15")}>
                Founder Back-Office Mode
                <Compass aria-hidden="true" data-icon="inline-end" />
              </Link>
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto grid w-full max-w-[1440px] gap-12 px-4 py-10 sm:px-7 sm:py-14 lg:gap-16 lg:px-10 lg:py-20">
        <section className="relative overflow-hidden rounded-2xl border border-border/80 bg-card/65 px-6 py-10 sm:px-10 sm:py-14 lg:px-14">
          <div className="pointer-events-none absolute inset-y-0 right-0 hidden w-2/5 bg-[radial-gradient(ellipse_at_center,rgba(198,169,111,0.12),transparent_68%)] lg:block" />
          <div className="relative max-w-3xl">
            <Badge variant="outline" className="border-primary/30 text-primary">DISCOVER · CREATE · EXPLORE</Badge>
            <h1 className="mt-6 max-w-2xl font-serif text-4xl leading-[1.04] tracking-tight text-foreground sm:text-5xl lg:text-6xl">A constellation of creative tools.</h1>
            <p className="mt-5 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
              Find independent studios and featured partner products for strategy, storytelling, sound, motion, and design.
            </p>
            <a href="#studios" className={cn(buttonVariants({ variant: "default", size: "lg" }), "mt-8 gap-2 bg-primary text-primary-foreground hover:bg-primary/90")}>
              Browse the directory <ArrowUpRight aria-hidden="true" data-icon="inline-end" />
            </a>
          </div>
        </section>

        <section id="studios" aria-labelledby="studios-title" className="grid gap-5 scroll-mt-24">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-primary">PUBLIC SHOWCASE</p>
              <h2 id="studios-title" className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">Creative studios</h2>
            </div>
            <Badge variant="outline" className="border-border text-muted-foreground">{studioVentures.length} independent apps</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {studioVentures.map((venture) => (
              <DirectoryCard key={venture.slug} name={venture.name} description={venture.description} icon={venture.icon} href={venture.route} badge={venture.slug === "dreamweaver-hub" ? "Brand portal" : "Creative studio"} />
            ))}
          </div>
        </section>

        <section aria-labelledby="partners-title" className="grid gap-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-primary">PARTNER SPOTLIGHT</p>
              <h2 id="partners-title" className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">Featured ecosystem partners</h2>
              <p className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground">Each product is presented as an independent partner tool. Referral destinations will appear when configured.</p>
            </div>
            <Badge variant="secondary" className="bg-primary/10 text-primary">{affiliateVentures.length} featured partners</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {affiliateVentures.map((venture) => (
              <DirectoryCard key={venture.slug} name={venture.name} description={venture.description} icon={venture.icon} href={affiliateLinks[venture.slug] ?? venture.route} badge="Featured Partner" partner external={Boolean(affiliateLinks[venture.slug])} />
            ))}
          </div>
        </section>

        <footer className="flex flex-col gap-3 border-t border-border/80 pt-5 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <span className="flex items-center gap-2"><Compass aria-hidden="true" className="size-4" /> GALAXY / ECOSYSTEM DIRECTORY</span>
          <span>Listings are independent app workspaces; referral destinations are pending configuration.</span>
        </footer>
      </div>
    </main>
  )
}
