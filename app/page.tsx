"use client"

import { useEffect, useState } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { fetchWordPressPage, fetchWordPressPostsByCategory } from "@/lib/wordpress-actions"
import { NextPageButton } from "@/components/next-page-button"
import { WavyLine } from "@/components/wavy-line"

export default function HomePage() {
  const [pageContent, setPageContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [gallerySlides, setGallerySlides] = useState<
    Array<{ id: number; image: string; title: string; description: string }>
  >([])

  useEffect(() => {
    console.log("[v0] [Client] Starting to fetch home data...")

    Promise.all([
      fetchWordPressPage("home").catch((err) => {
        console.error("[v0] [Client] Error fetching page:", err)
        throw err
      }),
      fetchWordPressPostsByCategory("bildergalerie").catch((err) => {
        console.error("[v0] [Client] Error fetching posts:", err)
        throw err
      }),
    ])
      .then(([homeData, galleryPosts]) => {
        console.log("[v0] [Client] Successfully fetched data")
        console.log("[v0] [Client] Home data:", homeData)
        console.log("[v0] [Client] Gallery posts:", galleryPosts.length)

        setPageContent(homeData.content || "")

        const slides: Array<{ id: number; image: string; title: string; description: string }> = []

        galleryPosts.forEach((post) => {
          slides.push({
            id: post.id,
            image: post.featuredImage || "/genego-housing-project.jpg",
            title: post.title,
            description: post.excerpt.replace(/<[^>]+>/g, "").trim() || "",
          })
        })

        console.log("[v0] [Client] Created slides:", slides.length)
        setGallerySlides(slides)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] [Client] Error loading home data:", error)
        setError(error.message || "Failed to load content")
        setLoading(false)
      })
  }, [])

  if (loading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-muted-foreground">Inhalte werden geladen...</p>
        </div>
      </main>
    )
  }

  if (error) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500 mb-4">Fehler beim Laden: {error}</p>
          <button onClick={() => window.location.reload()} className="px-4 py-2 bg-primary text-white rounded">
            Neu laden
          </button>
        </div>
      </main>
    )
  }

  const carouselSlides =
    gallerySlides.length > 0
      ? gallerySlides
      : [
          {
            id: 1,
            image: "/modern-sustainable-housing-development-with-green-.jpg",
            title: "Genossenschaft Neumühle Goldach",
            description: "Gemeinsam Wohnen, Gemeinsam Gestalten",
          },
        ]

  return (
    <main>
      <HeroCarousel slides={carouselSlides} />

      <section className="bg-white py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="wordpress-content" dangerouslySetInnerHTML={{ __html: pageContent }} />
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <NextPageButton currentSlug="home" />
      </div>
    </main>
  )
}
