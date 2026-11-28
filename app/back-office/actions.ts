"use server"

import { redirect } from "next/navigation"
import { clearFounderSession, createFounderSession, verifyPasscode } from "./auth"

export async function signInFounder(formData: FormData) {
  const passcode = formData.get("passcode")
  if (!process.env.FOUNDER_PASSCODE || !process.env.FOUNDER_SESSION_SECRET) redirect("/?error=setup")
  if (typeof passcode !== "string" || !verifyPasscode(passcode)) redirect("/?error=invalid")
  await createFounderSession()
  redirect("/")
}

export async function signOutFounder() {
  await clearFounderSession()
  redirect("/")
}
