"use client"

import { useState } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Menu, PanelLeftClose, PanelLeftOpen, Sparkles } from "lucide-react"
import { cn } from "cn"
import { privateVentures, affiliateVentures, studioVentures, type Venture } from "../data/ventures"
import { VentureIcon } from "./venture-icon"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle, SheetTrigger } from "./ui/sheet"

type SidebarProps = {
  privateAccess: boolean
  collapsed: boolean
  onCollapsedChange: (collapsed: boolean) => void
}

type NavGroupProps = {
  label: string
  detail?: string
  items: Venture[]
  collapsed: boolean
  onNavigate?: () => void
}

function NavGroup({ label, detail, items, collapsed, onNavigate }: NavGroupProps) {
  const pathname = usePathname()

  return (
    <section className="grid gap-2">
      <div className={cn("grid gap-1 px-3", collapsed && "sr-only")}>
        <h2 className="text-[10px] font-semibold tracking-[0.16em] text-muted-foreground">{label}</h2>
        {detail && <p className="text-[10px] leading-relaxed text-muted-foreground/75">{detail}</p>}
      </div>
      <nav aria-label={label} className="grid gap-1">
        {items.map((venture) => {
          const active = pathname === venture.route
          return (
            <Link
              key={venture.slug}
              href={venture.route}
              onClick={onNavigate}
              title={collapsed ? venture.name : undefined}
              aria-current={active ? "page" : undefined}
              className={cn(
                "group flex min-h-10 items-center gap-3 rounded-md border border-transparent px-3 text-sm text-muted-foreground transition-colors hover:border-border hover:bg-muted/60 hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
                active && "border-primary/25 bg-primary/10 text-primary",
                collapsed && "justify-center px-0"
              )}
            >
              <VentureIcon name={venture.icon} className="size-4 shrink-0" />
              <span className={cn("min-w-0 truncate", collapsed && "sr-only")}>{venture.name}</span>
              {venture.plane === "commercial_affiliate" && !collapsed && (
                <Badge variant="outline" className="ml-auto border-primary/25 px-1.5 py-0 text-[9px] text-primary">Partner</Badge>
              )}
            </Link>
          )
        })}
      </nav>
    </section>
  )
}

function SidebarContents({ privateAccess, collapsed, onNavigate, onCollapsedChange }: { privateAccess: boolean; collapsed: boolean; onNavigate?: () => void; onCollapsedChange?: (collapsed: boolean) => void }) {
  const pathname = usePathname()
  const internalGroups = [
    { label: "PRIVATE BACK OFFICE", detail: "Founder HQ + Personal Life OS", items: privateVentures },
    { label: "BACK-OFFICE BRIDGE: EXECUTIVE TOOLS", detail: "Commercial SaaS · publicly listed as affiliates", items: affiliateVentures },
    { label: "PUBLIC SHOWCASE & CREATIVE STUDIOS", detail: "Brand portal + production workspaces", items: studioVentures },
  ]
  const publicGroups = [
    { label: "FEATURED PARTNER TOOLS", detail: "Independent products", items: affiliateVentures },
    { label: "CREATIVE STUDIOS", detail: "Stories, sound, motion, and design", items: studioVentures },
  ]

  return (
    <>
      <div className={cn("flex h-[68px] shrink-0 items-center border-b border-border/80", collapsed ? "justify-center px-2" : "justify-between px-4")}>
        <Link href={privateAccess ? "/" : "/directory"} className="flex min-w-0 items-center gap-3 text-foreground no-underline">
          <span className="grid size-9 shrink-0 place-items-center rounded-lg border border-primary/30 bg-primary/10 text-primary">
            <Sparkles aria-hidden="true" />
          </span>
          <span className={cn("grid min-w-0 gap-0.5", collapsed && "sr-only")}>
            <span className="text-sm font-semibold tracking-[0.18em]">GALAXY</span>
            <span className="truncate text-[9px] tracking-[0.12em] text-muted-foreground">OPERATING SYSTEM</span>
          </span>
        </Link>
        {privateAccess && (
          <Button
            variant="ghost"
            size="icon-sm"
            className="hidden shrink-0 text-muted-foreground hover:text-primary md:inline-flex"
            aria-label={collapsed ? "Expand sidebar" : "Collapse sidebar"}
            onClick={() => onCollapsedChange?.(!collapsed)}
          >
            {collapsed ? <PanelLeftOpen /> : <PanelLeftClose />}
          </Button>
        )}
      </div>

      {privateAccess && (
        <Link
          href="/"
          onClick={onNavigate}
          aria-current={pathname === "/" ? "page" : undefined}
          title={collapsed ? "Founder Overview" : undefined}
          className={cn(
            "mx-2 mt-3 flex min-h-10 items-center gap-3 rounded-md border border-transparent px-3 text-sm text-muted-foreground transition-colors hover:bg-muted/60 hover:text-foreground",
            pathname === "/" && "border-primary/25 bg-primary/10 text-primary",
            collapsed && "justify-center px-0"
          )}
        >
          <Sparkles aria-hidden="true" />
          <span className={cn(collapsed && "sr-only")}>Founder Overview</span>
        </Link>
      )}

      <div className="min-h-0 flex-1 overflow-y-auto px-2 py-4">
        {(privateAccess ? internalGroups : publicGroups).map((group) => (
          <div key={group.label} className="mb-6 last:mb-0">
            <NavGroup {...group} collapsed={collapsed && privateAccess} onNavigate={onNavigate} />
          </div>
        ))}
      </div>

      <div className={cn("shrink-0 border-t border-border/80 p-3", collapsed && "px-2")}>
        <div className={cn("flex items-center gap-2 rounded-md border border-border/70 bg-background/50 px-3 py-2 text-[10px] text-muted-foreground", collapsed && "justify-center px-0")}>
          <span className="size-1.5 shrink-0 rounded-full bg-primary" />
          <span className={cn("truncate", collapsed && "sr-only")}>{privateAccess ? "Private founder session" : "Public directory view"}</span>
        </div>
      </div>
    </>
  )
}

export function GalaxySidebar({ privateAccess, collapsed, onCollapsedChange }: SidebarProps) {
  const [mobileOpen, setMobileOpen] = useState(false)

  return (
    <>
      <aside className="hidden h-full min-h-0 flex-col border-r border-border/80 bg-sidebar text-sidebar-foreground md:flex">
        <SidebarContents privateAccess={privateAccess} collapsed={collapsed} onCollapsedChange={onCollapsedChange} />
      </aside>

      <div className="fixed left-3 top-3 z-40 md:hidden">
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger
            render={<Button variant="outline" size="icon" className="border-border bg-card text-foreground shadow-lg" aria-label="Open navigation" />}
          >
            <Menu />
          </SheetTrigger>
          <SheetContent side="left" className="w-[min(20rem,86vw)] border-border bg-sidebar p-0 text-sidebar-foreground">
            <SheetHeader className="sr-only">
              <SheetTitle>GALAXY navigation</SheetTitle>
              <SheetDescription>Navigate between the independent app workspaces.</SheetDescription>
            </SheetHeader>
            <SidebarContents privateAccess={privateAccess} collapsed={false} onNavigate={() => setMobileOpen(false)} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  )
}
