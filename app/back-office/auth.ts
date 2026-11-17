import "server-only"
import { createHmac, timingSafeEqual } from "node:crypto"
import { cookies } from "next/headers"

const COOKIE_NAME = "nfdt_founder_session"
const SESSION_TTL = 8 * 60 * 60 * 1000

function signature(payload: string, secret: string) {
  return createHmac("sha256", secret).update(payload).digest("base64url")
}

export function verifyPasscode(candidate: string) {
  const expected = process.env.FOUNDER_PASSCODE
  if (!expected || !process.env.FOUNDER_SESSION_SECRET) return false
  const actualBuffer = Buffer.from(candidate)
  const expectedBuffer = Buffer.from(expected)
  return actualBuffer.length === expectedBuffer.length && timingSafeEqual(actualBuffer, expectedBuffer)
}

export async function createFounderSession() {
  const secret = process.env.FOUNDER_SESSION_SECRET
  if (!secret) return
  const payload = `${Date.now()}`
  const value = `${payload}.${signature(payload, secret)}`
  const cookieStore = await cookies()
  cookieStore.set(COOKIE_NAME, value, { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "lax", path: "/", maxAge: SESSION_TTL / 1000 })
}

export async function clearFounderSession() {
  const cookieStore = await cookies()
  cookieStore.delete(COOKIE_NAME)
}

export async function isFounderSession() {
  const secret = process.env.FOUNDER_SESSION_SECRET
  const value = (await cookies()).get(COOKIE_NAME)?.value
  if (!secret || !value) return false
  const [payload, received] = value.split(".")
  if (!payload || !received) return false
  const timestamp = Number(payload)
  if (!Number.isFinite(timestamp) || Date.now() - timestamp > SESSION_TTL || timestamp > Date.now()) return false
  const expected = Buffer.from(signature(payload, secret))
  const actual = Buffer.from(received)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
