import type { Metadata } from "next"
import { GalaxyOverview } from "../components/galaxy-overview"
import { FounderLogin } from "../components/back-office/founder-login"
import { isFounderSession } from "./back-office/auth"

export const metadata: Metadata = {
  title: "Founder Overview | GALAXY",
  description: "Private operating overview for independent ventures, creative studios, and personal workspaces.",
  robots: { index: false, follow: false },
}

export default async function HomePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [authenticated, query] = await Promise.all([isFounderSession(), searchParams])
  return authenticated ? <GalaxyOverview /> : <FounderLogin error={query.error} />
}
