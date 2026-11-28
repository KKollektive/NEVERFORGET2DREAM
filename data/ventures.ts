export type VenturePlane = "back_office" | "commercial_affiliate" | "public_studio"
export type PublicFraming = "affiliate_partner" | "creative_studio" | "hidden"

export type VentureIconName =
  | "Building2"
  | "Briefcase"
  | "ListChecks"
  | "Heart"
  | "MessagesSquare"
  | "CircleHelp"
  | "Scale"
  | "PenTool"
  | "Megaphone"
  | "CalendarDays"
  | "Globe"
  | "Clapperboard"
  | "Music2"
  | "Video"
  | "Ruler"

export interface VentureModule {
  title: string
  description: string
  icon: VentureIconName
}

export interface Venture {
  slug: string
  name: string
  route: string
  plane: VenturePlane
  publicFraming: PublicFraming
  description: string
  workspaceDescription?: string
  icon: VentureIconName
  modules: VentureModule[]
}

export const ventures: Venture[] = [
  {
    slug: "founder-command-center",
    name: "Founder Command Center",
    route: "/back-office/founder-command-center",
    plane: "back_office",
    publicFraming: "hidden",
    description: "Private headquarters for portfolio health, revenue signals, audience growth, and operating priorities across the venture ecosystem.",
    icon: "Building2",
    modules: [
      { title: "Portfolio pulse", description: "A single view of revenue, subscribers, active users, and system health as sources connect.", icon: "Briefcase" },
      { title: "Telemetry inbox", description: "One-way sales and service reports from commercial tools and creative studios.", icon: "ListChecks" },
      { title: "Founder priorities", description: "Keep the highest-leverage decisions and next actions within reach.", icon: "CalendarDays" },
    ],
  },
  {
    slug: "founder-business-command-center",
    name: "Founder Business Command Center",
    route: "/back-office/founder-business-command-center",
    plane: "back_office",
    publicFraming: "hidden",
    description: "Private holding-company operations for entity oversight, internal financials, and confidential business pipelines.",
    icon: "Briefcase",
    modules: [
      { title: "Entity register", description: "Track ventures, operating status, and internal ownership context.", icon: "Building2" },
      { title: "Finance desk", description: "A structured place for budgets, recurring costs, and private financial reviews.", icon: "ListChecks" },
      { title: "Private pipeline", description: "Organize opportunities, relationships, and decision checkpoints.", icon: "CalendarDays" },
    ],
  },
  {
    slug: "your-digital-ally",
    name: "Your Digital Ally",
    route: "/back-office/your-digital-ally",
    plane: "back_office",
    publicFraming: "hidden",
    description: "A private AI chief-of-staff workspace for tasks, life logistics, and coordinated project handoffs.",
    icon: "ListChecks",
    modules: [
      { title: "Today command", description: "Bring the day’s most important actions into one calm, manageable list.", icon: "CalendarDays" },
      { title: "Life logistics", description: "Keep practical reminders and personal follow-through out of your head.", icon: "ListChecks" },
      { title: "Project handoffs", description: "Connect the next action to the venture and workspace it belongs to.", icon: "Briefcase" },
    ],
  },
  {
    slug: "mira-daily-compass",
    name: "Mira Daily Compass",
    route: "/back-office/mira-daily-compass",
    plane: "back_office",
    publicFraming: "hidden",
    description: "A mobile-first personal compass for grounding, habit continuity, and compassionate daily accountability.",
    icon: "Heart",
    modules: [
      { title: "Morning grounding", description: "Start with a gentle check-in and one clear intention for the day.", icon: "Heart" },
      { title: "Habit continuity", description: "Notice steady progress without turning a missed day into a setback.", icon: "ListChecks" },
      { title: "Reflection journal", description: "Capture short reflections, wins, and what you need next.", icon: "PenTool" },
    ],
  },
  {
    slug: "ai-companion-studio",
    name: "AI Companion Studio",
    route: "/back-office/ai-companion-studio",
    plane: "back_office",
    publicFraming: "hidden",
    description: "A private comparative workbench for reviewing ideas and responses across Claude, ChatGPT, and Gemini.",
    icon: "MessagesSquare",
    modules: [
      { title: "Parallel prompts", description: "Prepare one prompt and compare independent model responses side by side.", icon: "MessagesSquare" },
      { title: "Response comparison", description: "Capture useful differences, citations, and follow-up questions.", icon: "ListChecks" },
      { title: "Research notebook", description: "Save research notes and reusable prompt patterns for later review.", icon: "PenTool" },
    ],
  },
  {
    slug: "your-friendly-helper",
    name: "Your Friendly Helper",
    route: "/back-office/your-friendly-helper",
    plane: "back_office",
    publicFraming: "hidden",
    description: "A private, modular assistant canvas ready to become a focused niche helper or lightweight utility.",
    icon: "CircleHelp",
    modules: [
      { title: "Assistant canvas", description: "Shape a focused helper around one repeatable need or workflow.", icon: "CircleHelp" },
      { title: "Utility builder", description: "Collect small tools and references in a practical workspace.", icon: "PenTool" },
      { title: "Saved workflows", description: "Keep the helpful steps that deserve to be repeated.", icon: "ListChecks" },
    ],
  },
  {
    slug: "boardroom-ai",
    name: "Boardroom AI",
    route: "/bridge/boardroom-ai",
    plane: "commercial_affiliate",
    publicFraming: "affiliate_partner",
    description: "An independent strategic deliberation product for pressure-testing decisions across multiple AI perspectives.",
    icon: "Scale",
    modules: [
      { title: "Decision docket", description: "Frame a strategic question, constraints, and the decision to be made.", icon: "ListChecks" },
      { title: "Model perspectives", description: "Compare independent viewpoints before choosing a direction.", icon: "MessagesSquare" },
      { title: "Deliberation record", description: "Keep the rationale, open questions, and final decision together.", icon: "PenTool" },
    ],
  },
  {
    slug: "brand-brilliance-hub",
    name: "Brand Brilliance Hub",
    route: "/bridge/brand-brilliance-hub",
    plane: "commercial_affiliate",
    publicFraming: "affiliate_partner",
    description: "An independent brand management and marketing workspace for on-brand campaigns, content calendars, and voice consistency.",
    icon: "PenTool",
    modules: [
      { title: "Brand voice", description: "Keep voice principles, audience notes, and message guardrails in view.", icon: "PenTool" },
      { title: "Campaign planner", description: "Turn launches and ongoing marketing into a clear content calendar.", icon: "CalendarDays" },
      { title: "Asset review", description: "Organize creative approvals and reusable campaign materials.", icon: "ListChecks" },
    ],
  },
  {
    slug: "social-media-operator",
    name: "Social Media Operator",
    route: "/bridge/social-media-operator",
    plane: "commercial_affiliate",
    publicFraming: "affiliate_partner",
    description: "An independent tactical social planning tool that turns audience goals and available bandwidth into a practical daily standup.",
    icon: "Megaphone",
    modules: [
      { title: "Daily social brief", description: "Set the audience, priority, and outcome for today’s publishing work.", icon: "CalendarDays" },
      { title: "Channel queue", description: "Arrange posts and publishing tasks by channel and campaign.", icon: "ListChecks" },
      { title: "Bandwidth planner", description: "Match the plan to the time and energy actually available.", icon: "Heart" },
    ],
  },
  {
    slug: "dreamweaver-hub",
    name: "Dreamweaver Hub",
    route: "/bridge/dreamweaver-hub",
    plane: "public_studio",
    publicFraming: "creative_studio",
    description: "A public-facing brand and IP portal that introduces the creative worlds, stories, and experiences in the ecosystem.",
    workspaceDescription: "The public-facing brand portal for Never Forget to Dream Inc., introducing the ventures, original IP, and creative ecosystem.",
    icon: "Globe",
    modules: [
      { title: "Brand index", description: "Give each venture a clear introduction and public destination.", icon: "Globe" },
      { title: "Studio showcase", description: "Bring creative projects and original IP into a curated public view.", icon: "Clapperboard" },
      { title: "Discovery paths", description: "Help visitors move naturally from a story to the studio behind it.", icon: "ListChecks" },
    ],
  },
  {
    slug: "reverie-screen",
    name: "Reverie Screen",
    route: "/bridge/reverie-screen",
    plane: "public_studio",
    publicFraming: "creative_studio",
    description: "A vertical micro-drama platform and guided writer workspace for developing episodic series, characters, and scripts.",
    icon: "Clapperboard",
    modules: [
      { title: "Series bible", description: "Keep premise, characters, season arcs, and world rules together.", icon: "PenTool" },
      { title: "Episode room", description: "Shape short-form episodes for a mobile-first viewing rhythm.", icon: "Video" },
      { title: "Script workshop", description: "Develop scenes, dialogue, and revision notes in one writing space.", icon: "ListChecks" },
    ],
  },
  {
    slug: "songcraft-studio",
    name: "Songcraft Studio",
    route: "/bridge/songcraft-studio",
    plane: "public_studio",
    publicFraming: "creative_studio",
    description: "A music production suite for developing rough vocal memos, melodies, and prompts into arranged tracks.",
    icon: "Music2",
    modules: [
      { title: "Memo inbox", description: "Collect voice notes, melodic fragments, and lyrical sparks.", icon: "Music2" },
      { title: "Arrangement desk", description: "Map sections, instrumentation, and production direction.", icon: "ListChecks" },
      { title: "Track library", description: "Keep works in progress and release-ready mixes organized.", icon: "PenTool" },
    ],
  },
  {
    slug: "creative-studio-ai",
    name: "Creative Studio AI",
    route: "/bridge/creative-studio-ai",
    plane: "public_studio",
    publicFraming: "creative_studio",
    description: "A cinematic generative media studio for long-form video concepts up to five minutes, with voice synchronization workflows.",
    icon: "Video",
    modules: [
      { title: "Film brief", description: "Define concept, audience, mood, and target runtime.", icon: "PenTool" },
      { title: "Scene planner", description: "Break a long-form idea into visual beats and scene requirements.", icon: "Clapperboard" },
      { title: "Voice sync", description: "Plan narration and synchronization checkpoints for each scene.", icon: "Music2" },
    ],
  },
  {
    slug: "atelier-vector-studio",
    name: "Atelier Vector Studio",
    route: "/bridge/atelier-vector-studio",
    plane: "public_studio",
    publicFraming: "creative_studio",
    description: "A fashion CAD lab for modular garment patterns, starting with semi-fitted blouses and interchangeable vector components.",
    icon: "Ruler",
    modules: [
      { title: "Garment canvas", description: "Set silhouette, measurements, and fit preferences for a new pattern.", icon: "Ruler" },
      { title: "Vector components", description: "Explore modular neckline, sleeve, and finishing elements.", icon: "PenTool" },
      { title: "Pattern export", description: "Prepare pattern pieces and notes for production review.", icon: "ListChecks" },
    ],
  },
]

export const privateVentures = ventures.filter((venture) => venture.plane === "back_office")
export const affiliateVentures = ventures.filter((venture) => venture.plane === "commercial_affiliate")
export const studioVentures = ventures.filter((venture) => venture.plane === "public_studio")
export const publicVentures = ventures.filter((venture) => venture.plane !== "back_office")

export function getVentureBySlug(slug: string) {
  return ventures.find((venture) => venture.slug === slug)
}
