import { LockKeyhole, Sparkles } from "lucide-react"
import { signInFounder } from "../../app/back-office/actions"

export function FounderLogin({ error }: { error?: string }) {
  return (
    <main className="backoffice-login-page">
      <a className="backoffice-brand" href="/directory"><span><Sparkles size={17}/></span> GALAXY · PRIVATE ACCESS</a>
      <section className="login-card">
        <div className="login-lock"><LockKeyhole size={18}/></div>
        <p className="standard-kicker"><span/> FOUNDER ACCESS</p>
        <h1>A quiet space<br/>to make it <em>happen.</em></h1>
        <p className="login-copy">The work behind the worlds. Enter your founder passcode to continue.</p>
        <form action={signInFounder}>
          <label htmlFor="passcode">FOUNDER PASSCODE</label>
          <input id="passcode" name="passcode" type="password" autoComplete="current-password" required placeholder="Enter your passcode"/>
          <button className="login-submit" type="submit">ENTER GALAXY <span>↗</span></button>
        </form>
        {error === "invalid" && <p className="login-error" role="alert">That passcode could not be verified. Please try again.</p>}
        {error === "setup" && <p className="login-error" role="alert">Founder access is not configured yet. Add the project&apos;s founder passcode and session secret to continue.</p>}
        <a className="login-return" href="/directory">← View public directory</a>
      </section>
      <span className="login-footer">PRIVATE FOUNDER PORTAL · GALAXY</span>
    </main>
  )
}
