"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { fetchWordPressPages } from "@/lib/wordpress-actions"
import { ArrowRight } from "lucide-react"

interface NextPageButtonProps {
  currentSlug: string
}

export function NextPageButton({ currentSlug }: NextPageButtonProps) {
  const [nextPage, setNextPage] = useState<{ title: string; url: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadNextPage() {
      try {
        const pages = await fetchWordPressPages()

        // Find current page index
        const currentIndex = pages.findIndex((page) => {
          // Match by slug or URL
          return (
            page.slug === currentSlug || page.url === `/${currentSlug}` || (currentSlug === "home" && page.url === "/")
          )
        })

        // Get next page if not the last one
        if (currentIndex !== -1 && currentIndex < pages.length - 1) {
          const next = pages[currentIndex + 1]
          setNextPage({ title: next.title, url: next.url })
        }
      } catch (error) {
        console.error("[v0] Failed to load next page:", error)
      } finally {
        setLoading(false)
      }
    }

    loadNextPage()
  }, [currentSlug])

  if (loading || !nextPage) {
    return null
  }

  return (
    <div className="mt-16 pt-8 border-t justify-center flex">
      <Link href={nextPage.url}>
        <Button size="lg" className="group rounded-full">
          Erfahre mehr über {nextPage.title}
          <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
        </Button>
      </Link>
    </div>
  )
}
