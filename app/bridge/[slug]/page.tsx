import type { Metadata } from "next"
import { notFound } from "next/navigation"
import { getVentureBySlug } from "../../../data/ventures"
import { GalaxyShell } from "../../../components/galaxy-shell"
import { VentureWorkspace } from "../../../components/venture-workspace"
import { isFounderSession } from "../../back-office/auth"

type PageProps = { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const venture = getVentureBySlug(slug)
  return {
    title: venture ? `${venture.name} | GALAXY` : "Creative Workspace | GALAXY",
    description: venture?.workspaceDescription ?? venture?.description,
  }
}

export default async function PublicVenturePage({ params }: PageProps) {
  const [{ slug }, founderAccess] = await Promise.all([params, isFounderSession()])
  const venture = getVentureBySlug(slug)

  if (!venture || venture.plane === "back_office") notFound()

  return (
    <GalaxyShell pageTitle={venture.name} privateAccess={founderAccess}>
      <VentureWorkspace venture={venture} internalMode={founderAccess} />
    </GalaxyShell>
  )
}
