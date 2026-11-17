import type { Metadata, Viewport } from "next"
import "./globals.css"
import "./site.css"

export const metadata: Metadata = {
  title: "Never Forget to Dream | A Universe of Ideas",
  description: "Explore the Never Forget to Dream universe — a constellation of creative worlds, brands, stories, music, and ideas.",
}

export const viewport: Viewport = { themeColor: "#0b0719", width: "device-width", initialScale: 1, userScalable: true }

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="en"><body>{children}</body></html>
}
