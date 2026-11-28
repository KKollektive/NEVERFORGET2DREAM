import Link from "next/link"
import { Activity, ArrowDownToLine, ArrowRight, CircleDollarSign, Clock3, Users } from "lucide-react"
import { cn } from "cn"
import { ventures, publicVentures, privateVentures, affiliateVentures, studioVentures } from "../data/ventures"
import { GalaxyShell } from "./galaxy-shell"
import { VentureIcon } from "./venture-icon"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import { buttonVariants } from "./ui/button"

const summaryMetrics = [
  { label: "Sales / revenue", value: "—", note: "No connected source", icon: CircleDollarSign },
  { label: "Monthly recurring revenue", value: "—", note: "No connected source", icon: CircleDollarSign },
  { label: "Active users", value: "—", note: "No connected source", icon: Users },
  { label: "System uptime", value: "—", note: "No heartbeat received", icon: Activity },
]

function SummaryMetric({ label, value, note, icon: Icon }: (typeof summaryMetrics)[number]) {
  return (
    <Card className="border-border/80 bg-card/80">
      <CardHeader className="grid-cols-[1fr_auto] items-center gap-3 pb-3">
        <CardTitle className="text-xs font-normal text-muted-foreground">{label}</CardTitle>
        <span className="grid size-9 place-items-center rounded-lg border border-primary/20 bg-primary/5 text-primary"><Icon aria-hidden="true" className="size-4" /></span>
      </CardHeader>
      <CardContent>
        <p className="font-serif text-3xl text-foreground">{value}</p>
        <p className="mt-2 text-xs text-muted-foreground">{note}</p>
      </CardContent>
    </Card>
  )
}

function AppCard({ venture }: { venture: (typeof ventures)[number] }) {
  const badge = venture.plane === "back_office" ? "Private" : venture.plane === "commercial_affiliate" ? "Affiliate" : "Studio"
  return (
    <Card className="group border-border/80 bg-card/75 transition-all hover:-translate-y-0.5 hover:border-primary/30 hover:bg-card">
      <CardHeader className="gap-4">
        <div className="flex items-center justify-between gap-3">
          <span className="grid size-10 place-items-center rounded-lg border border-primary/20 bg-primary/5 text-primary"><VentureIcon name={venture.icon} className="size-4" /></span>
          <Badge variant={venture.plane === "commercial_affiliate" ? "secondary" : "outline"} className={venture.plane === "commercial_affiliate" ? "bg-primary/10 text-primary" : "border-border text-muted-foreground"}>{badge}</Badge>
        </div>
        <div className="grid gap-2">
          <CardTitle className="text-base">{venture.name}</CardTitle>
          <CardDescription className="min-h-12 text-xs leading-relaxed">{venture.description}</CardDescription>
        </div>
      </CardHeader>
      <CardContent>
        <Link href={venture.route} className={cn(buttonVariants({ variant: "outline", size: "sm" }), "w-full justify-between border-border/80 group-hover:border-primary/30 group-hover:text-primary")}>
          Open independent workspace <ArrowRight aria-hidden="true" data-icon="inline-end" />
        </Link>
      </CardContent>
    </Card>
  )
}

function TelemetryRow({ name, path }: { name: string; path: string }) {
  return (
    <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 border-b border-border/70 py-3 last:border-0">
      <div className="min-w-0">
        <p className="truncate text-sm font-medium text-foreground">{name}</p>
        <p className="mt-1 truncate text-xs text-muted-foreground">{path}</p>
      </div>
      <Badge variant="outline" className="border-border text-muted-foreground">Awaiting feed</Badge>
    </div>
  )
}

export function GalaxyOverview() {
  return (
    <GalaxyShell pageTitle="Founder Overview" privateAccess>
      <div className="grid gap-7 lg:gap-9">
        <section className="flex flex-col justify-between gap-5 rounded-xl border border-border/80 bg-card/55 p-5 sm:flex-row sm:items-end sm:p-7">
          <div className="max-w-3xl">
            <Badge variant="outline" className="border-primary/30 text-primary">PRIVATE BACK OFFICE</Badge>
            <p className="mt-4 text-[10px] font-semibold tracking-[0.2em] text-primary">PORTFOLIO OPERATIONS</p>
            <h2 className="mt-2 font-serif text-4xl leading-tight tracking-tight text-foreground sm:text-5xl">One clear view.<br className="hidden sm:block" /> Fourteen independent ventures.</h2>
            <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">A private operating layer for the business, creative studios, and personal systems — with each app kept in its own workspace.</p>
          </div>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="secondary" className="gap-1.5 bg-primary/10 px-3 py-1.5 text-primary"><span className="size-1.5 rounded-full bg-primary" />{ventures.length} app shells</Badge>
            <Link href="/directory" className={cn(buttonVariants({ variant: "outline", size: "sm" }), "gap-2 border-primary/25 text-primary hover:bg-primary/5")}>
              Public directory preview <ArrowRight aria-hidden="true" data-icon="inline-end" />
            </Link>
          </div>
        </section>

        <section aria-label="Portfolio telemetry summary" className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
          {summaryMetrics.map((metric) => <SummaryMetric key={metric.label} {...metric} />)}
        </section>

        <section className="grid gap-4 xl:grid-cols-[minmax(0,1.3fr)_minmax(300px,0.7fr)]">
          <Card className="border-border/80 bg-card/80">
            <CardHeader className="grid-cols-[minmax(0,1fr)_auto] items-start gap-4 border-b border-border/70 pb-4">
              <div className="grid gap-1.5">
                <CardTitle className="text-base">Telemetry intake</CardTitle>
                <CardDescription>Sales and system signals from commercial tools and studios.</CardDescription>
              </div>
              <Badge variant="outline" className="border-border text-muted-foreground">{publicVentures.length} sources pending</Badge>
            </CardHeader>
            <CardContent className="pt-2">
              {publicVentures.map((venture) => <TelemetryRow key={venture.slug} name={venture.name} path={venture.route} />)}
            </CardContent>
          </Card>

          <Card className="border-border/80 bg-card/80">
            <CardHeader className="gap-3">
              <div className="flex items-center justify-between gap-3">
                <span className="grid size-10 place-items-center rounded-lg border border-primary/20 bg-primary/5 text-primary"><ArrowDownToLine aria-hidden="true" className="size-4" /></span>
                <Badge variant="outline" className="border-primary/25 text-primary">Bridge status</Badge>
              </div>
              <div className="grid gap-1.5">
                <CardTitle className="text-base">No live feeds connected</CardTitle>
                <CardDescription className="leading-relaxed">This preview does not fabricate business metrics. Each telemetry card will populate after its source and protected receiver are configured.</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="grid gap-3 border-t border-border/70 pt-4">
              <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Commercial partner tools</span><span className="font-medium text-foreground">{affiliateVentures.length}</span></div>
              <div className="flex items-center justify-between text-xs"><span className="text-muted-foreground">Public studio workspaces</span><span className="font-medium text-foreground">{studioVentures.length}</span></div>
              <div className="flex items-center gap-2 pt-1 text-xs text-muted-foreground"><Clock3 aria-hidden="true" className="size-4" /> Waiting for first authenticated heartbeat</div>
            </CardContent>
          </Card>
        </section>

        <section aria-labelledby="venture-grid-title" className="grid gap-5">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <p className="text-[10px] font-semibold tracking-[0.2em] text-primary">APP DIRECTORY</p>
              <h2 id="venture-grid-title" className="mt-2 font-serif text-3xl text-foreground sm:text-4xl">All 14 app shells</h2>
              <p className="mt-2 text-sm text-muted-foreground">Each card opens a dedicated route and tailored placeholder workspace.</p>
            </div>
            <Badge variant="outline" className="border-border text-muted-foreground">6 private · 3 affiliate · 5 studio</Badge>
          </div>
          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {ventures.map((venture) => <AppCard key={venture.slug} venture={venture} />)}
          </div>
        </section>
      </div>
    </GalaxyShell>
  )
}
