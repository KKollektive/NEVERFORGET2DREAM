import { Activity, ArrowDownToLine, CircleDollarSign, Link2, Users } from "lucide-react"
import { Badge } from "./ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card"
import type { Venture } from "../data/ventures"

const telemetryItems = [
  { label: "Sales / Revenue Reported", value: "Awaiting feed", icon: CircleDollarSign },
  { label: "Active Users", value: "Awaiting source", icon: Users },
  { label: "System Health", value: "Awaiting heartbeat", icon: Activity },
  { label: "Affiliate Referral Link / Webhook Status", value: "Not connected", icon: Link2 },
]

export function BridgeTelemetry({ venture }: { venture: Venture }) {
  return (
    <Card className="border-border/80 bg-card/90 text-card-foreground">
      <CardHeader className="gap-3 border-b border-border/70 pb-4">
        <div className="flex items-start justify-between gap-3">
          <div className="grid gap-1">
            <CardTitle className="text-base">Back-office bridge</CardTitle>
            <CardDescription>Placeholder telemetry for {venture.name}</CardDescription>
          </div>
          <Badge variant="outline" className="border-primary/30 text-primary">Feed pending</Badge>
        </div>
        <p className="text-xs leading-relaxed text-muted-foreground">
          Metrics will appear here after a secure source is connected. Nothing is being reported yet.
        </p>
      </CardHeader>
      <CardContent className="grid gap-3 pt-4 sm:grid-cols-2">
        {telemetryItems.map(({ label, value, icon: Icon }) => (
          <div key={label} className="flex min-h-24 items-start gap-3 rounded-lg border border-border/70 bg-background/60 p-3">
            <span className="grid size-9 shrink-0 place-items-center rounded-md border border-primary/20 bg-primary/5 text-primary">
              <Icon aria-hidden="true" className="size-4" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-medium text-foreground">{label}</p>
              <p className="mt-1.5 text-sm text-muted-foreground">{value}</p>
            </div>
          </div>
        ))}
      </CardContent>
      <div className="flex items-center gap-2 border-t border-border/70 px-4 py-3 text-xs text-muted-foreground">
        <ArrowDownToLine aria-hidden="true" className="size-4" />
        <span>One-way receiver: Founder Command Center · no live data connected</span>
      </div>
    </Card>
  )
}
