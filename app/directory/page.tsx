import type { Metadata } from "next"
import { AffiliateDirectory } from "../../components/affiliate-directory"
import { isFounderSession } from "../back-office/auth"

export const metadata: Metadata = {
  title: "GALAXY Directory | Creative Studios & Featured Partners",
  description: "Explore independent creative studios and featured ecosystem partner tools across storytelling, sound, motion, strategy, and design.",
  robots: { index: true, follow: true },
}

export default async function DirectoryPage() {
  const founderPreview = await isFounderSession()
  return <AffiliateDirectory founderPreview={founderPreview} />
}
