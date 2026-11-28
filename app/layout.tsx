import type { Metadata, Viewport } from "next"
import "./globals.css"
import "./site.css"

export const metadata: Metadata = {
  title: "GALAXY | Venture Operations Portal",
  description: "A modular executive portal for independent ventures, creative studios, and personal operating systems.",
}

export const viewport: Viewport = { themeColor: "#0c0d0e", width: "device-width", initialScale: 1, userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
