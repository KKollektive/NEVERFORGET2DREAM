import { FounderDashboard } from "../../components/back-office/dashboard"
import { FounderLogin } from "../../components/back-office/founder-login"
import { isFounderSession } from "./auth"

export default async function BackOfficePage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const [authenticated, query] = await Promise.all([isFounderSession(), searchParams])
  return authenticated ? <FounderDashboard /> : <FounderLogin error={query.error} />
}
