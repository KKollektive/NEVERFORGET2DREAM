import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getVentureBySlug } from "../../../data/ventures"
import { GalaxyShell } from "../../../components/galaxy-shell"
import { VentureWorkspace } from "../../../components/venture-workspace"
import { FounderLogin } from "../../../components/back-office/founder-login"
import { isFounderSession } from "../auth"

type PageProps = {
  params: Promise<{ slug: string }>
  searchParams: Promise<{ error?: string }>
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const [{ slug }, authenticated] = await Promise.all([params, isFounderSession()])
  const venture = getVentureBySlug(slug)
  return {
    title: authenticated && venture?.plane === "back_office" ? `${venture.name} | GALAXY` : "Private Workspace | GALAXY",
    robots: { index: false, follow: false },
  }
}

export default async function PrivateVenturePage({ params, searchParams }: PageProps) {
  const [{ slug }, query, authenticated] = await Promise.all([params, searchParams, isFounderSession()])
  const venture = getVentureBySlug(slug)

  if (!venture || venture.plane !== "back_office") notFound()
  if (!authenticated) return <FounderLogin error={query.error} />

  return (
    <GalaxyShell pageTitle={venture.name} privateAccess>
      <VentureWorkspace venture={venture} internalMode />
    </GalaxyShell>
  )
}
