import type React from "react"
import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import "./globals.css"
import "./wordpress-content.css"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"

const inter = Inter({ subsets: ["latin"] })
const playfair = Playfair_Display({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "GeNeGo - Genossenschaft Neumühle Goldach",
  description: "Gemeinsam Wohnen, Gemeinsam Gestalten",
    generator: 'v0.app'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="de">
      <body className={inter.className}>
        <Header />
        <main className="pt-16">{children}</main>
        <Footer />
      </body>
    </html>
  )
}
