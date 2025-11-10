"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { WaveHeader } from "@/components/wave-header"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { fetchWordPressPages } from "@/lib/wordpress-actions"

interface MenuItem {
  id: number
  title: string
  slug: string
  url: string
  parent: number
}

export function Header() {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  useEffect(() => {
    async function loadMenu() {
      try {
        const pages = await fetchWordPressPages()
        setMenuItems(pages)
      } catch (error) {
        console.error("[v0] Failed to load menu items:", error)
        setMenuItems([
          { id: 1, title: "Home", slug: "home", url: "/", parent: 0 },
          { id: 2, title: "Unser Projekt", slug: "unser-projekt", url: "/unser-projekt", parent: 0 },
          { id: 3, title: "Kontakt", slug: "kontakt", url: "/kontakt", parent: 0 },
        ])
      } finally {
        setIsLoading(false)
      }
    }

    loadMenu()
  }, [])

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-transparent">
      <div className="w-full bg-white">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center">
            <img
              src="/images/design-mode/5ccfa224-676a-4750-8a25.png"
              alt="GeNeGo Logo"
              className="h-8 w-auto"
            />
          </Link>

          {/* Mobile Menu */}
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" className="md:hidden w-14 h-14">
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 64 64"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-32 w-32"
                >
                  <path
                    d="M8 16C8 16 16 20 24 16C32 12 40 20 48 16C56 12 56 16 56 16"
                    stroke="#1127CF"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 32C8 32 16 36 24 32C32 28 40 36 48 32C56 28 56 32 56 32"
                    stroke="#1127CF"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                  <path
                    d="M8 48C8 48 16 52 24 48C32 44 40 52 48 48C56 44 56 48 56 48"
                    stroke="#1127CF"
                    strokeWidth="5"
                    strokeLinecap="round"
                  />
                </svg>
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="flex flex-col gap-4 mt-8 pl-8">
                {isLoading ? (
                  <div className="text-sm text-muted-foreground">Laden...</div>
                ) : (
                  menuItems.slice(0, -1).map((item) => (
                    <Link
                      key={item.id}
                      href={item.url}
                      className="text-lg hover:text-primary transition-colors"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {item.title}
                    </Link>
                  ))
                )}
              </nav>
            </SheetContent>
          </Sheet>

          {/* Desktop Menu */}
          <nav className="hidden md:flex items-center gap-3">
            {isLoading ? (
              <div className="text-sm text-muted-foreground">Laden...</div>
            ) : (
              menuItems.slice(0, -1).map((item, index) => (
                <div key={item.id} className="flex items-center gap-3">
                  <Link href={item.url} className="text-sm hover:text-primary transition-colors">
                    {item.title}
                  </Link>
                  {index < menuItems.length - 2 && <span className="text-primary text-lg font-bold">·</span>}
                </div>
              ))
            )}
          </nav>
        </div>
      </div>
      <WaveHeader />
    </header>
  )
}
