import type { ComponentProps } from "react"
import {
  Building2,
  Briefcase,
  CalendarDays,
  CircleHelp,
  Clapperboard,
  Globe,
  Heart,
  ListChecks,
  Megaphone,
  MessagesSquare,
  Music2,
  PenTool,
  Ruler,
  Scale,
  Video,
  type LucideIcon,
} from "lucide-react"
import type { VentureIconName } from "../data/ventures"

const icons: Record<VentureIconName, LucideIcon> = {
  Building2,
  Briefcase,
  ListChecks,
  Heart,
  MessagesSquare,
  CircleHelp,
  Scale,
  PenTool,
  Megaphone,
  CalendarDays,
  Globe,
  Clapperboard,
  Music2,
  Video,
  Ruler,
}

export function VentureIcon({ name, ...props }: { name: VentureIconName } & ComponentProps<LucideIcon>) {
  const Icon = icons[name]
  return <Icon aria-hidden="true" {...props} />
}
