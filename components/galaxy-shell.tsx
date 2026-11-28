"use client"

import { useState, type CSSProperties, type ReactNode } from "react"
import Link from "next/link"
import { LockKeyhole, Radio, Sparkles } from "lucide-react"
import { cn } from "cn"
import { buttonVariants } from "./ui/button"
import { GalaxySidebar } from "./sidebar"

type GalaxyShellProps = {
  children: ReactNode
  pageTitle: string
  privateAccess: boolean
}

export function GalaxyShell({ children, pageTitle, privateAccess }: GalaxyShellProps) {
  const [collapsed, setCollapsed] = useState(false)

  return (
    <div
      className="galaxy-os-shell grid h-svh min-h-[36rem] grid-cols-1 bg-background text-foreground md:grid-cols-[var(--sidebar-width)_minmax(0,1fr)]"
      style={{ "--sidebar-width": collapsed ? "4.5rem" : "17rem" } as CSSProperties}
    >
      <GalaxySidebar privateAccess={privateAccess} collapsed={collapsed} onCollapsedChange={setCollapsed} />
      <main className="flex min-h-0 min-w-0 flex-col overflow-y-auto">
        <header className="sticky top-0 z-20 flex min-h-[4.75rem] items-center justify-between gap-3 border-b border-border/80 bg-background/90 py-2 pl-14 pr-3 backdrop-blur-xl sm:px-5 md:pl-5 lg:px-8">
          <div className="flex min-w-0 items-center gap-3">
            <span className="hidden size-8 shrink-0 place-items-center rounded-md border border-primary/25 bg-primary/5 text-primary sm:grid">
              <Sparkles aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="hidden text-[9px] font-medium tracking-[0.2em] text-muted-foreground sm:block">{privateAccess ? "GALAXY / OPERATIONS" : "GALAXY / ECOSYSTEM DIRECTORY"}</p>
              <h1 className="truncate text-sm font-medium text-foreground sm:mt-1 sm:text-base">{pageTitle}</h1>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-2">
            {privateAccess ? (
              <div className="flex items-center gap-1 rounded-lg border border-border/80 bg-card/70 p-1" role="group" aria-label="Workspace view">
                <Link
                  href="/"
                  title="Founder Back-Office Mode"
                  className={cn(buttonVariants({ variant: "secondary", size: "sm" }), "gap-1.5 border border-primary/20 bg-primary/10 px-2 text-primary hover:bg-primary/15 sm:px-2.5")}
                >
                  <LockKeyhole aria-hidden="true" data-icon="inline-start" />
                  <span className="hidden xl:inline">Founder Back-Office Mode</span>
                  <span className="xl:hidden">Founder</span>
                </Link>
                <Link
                  href="/directory"
                  title="Public Affiliate Directory Preview"
                  className={cn(buttonVariants({ variant: "ghost", size: "sm" }), "gap-1.5 px-2 text-muted-foreground hover:text-foreground sm:px-2.5")}
                >
                  <Radio aria-hidden="true" data-icon="inline-start" />
                  <span className="hidden xl:inline">Public Affiliate Directory Preview</span>
                  <span className="xl:hidden">Public</span>
                </Link>
              </div>
            ) : (
              <Link href="/directory" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "hidden gap-1.5 sm:inline-flex")}>
                Browse directory
                <Radio aria-hidden="true" data-icon="inline-end" />
              </Link>
            )}
          </div>
        </header>
        <div className="mx-auto w-full max-w-[1440px] flex-1 px-4 py-5 sm:px-6 sm:py-7 lg:px-9 lg:py-9">
          {children}
        </div>
      </main>
    </div>
  )
}
