"use client"

import { useEffect, useState } from "react"
import { HeroCarousel } from "@/components/hero-carousel"
import { WaveSeparator } from "@/components/wave-separator"
import { fetchWordPressPage, fetchWordPressPostsByCategory } from "@/lib/wordpress-actions"
import { NextPageButton } from "@/components/next-page-button"
import { WordPressContentWrapper } from "@/components/wordpress-content-wrapper"

export default function HomePage() {
  const [pageContent, setPageContent] = useState<string>("")
  const [loading, setLoading] = useState(true)
  const [gallerySlides, setGallerySlides] = useState<
    Array<{ id: number; image: string; title: string; description: string; link?: string }>
  >([])

  useEffect(() => {
    Promise.all([fetchWordPressPage("home"), fetchWordPressPostsByCategory("bildergalerie")])
      .then(([homeData, galleryPosts]) => {
        setPageContent(homeData.content || "")

        const slides: Array<{ id: number; image: string; title: string; description: string; link?: string }> = []

        galleryPosts.forEach((post) => {
          if (post.featuredImage) {
            let link = undefined
            if (post.tags && post.tags.length > 0) {
              const lastTag = post.tags[post.tags.length - 1]
              link = `/${lastTag.slug}`
            }

            slides.push({
              id: post.id,
              image: post.featuredImage,
              title: post.title,
              description: post.excerpt.trim() || "",
              link: link,
            })
          }
        })

        setGallerySlides(slides)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error loading home data:", error)
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

  const carouselSlides =
    gallerySlides.length > 0
      ? gallerySlides
      : [
          {
            id: 1,
            image: "/modern-sustainable-housing-development-with-green-.jpg",
            title: "Genossenschaft Neumühle Goldach",
            description: "Gemeinsam Wohnen, Gemeinsam Gestalten",
            link: "/unser-projekt",
          },
        ]

  return (
    <main>
      <HeroCarousel slides={carouselSlides} />
      <WaveSeparator />

      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4 max-w-8xl">
          <h1 className="mb-6">
            Gemeinsam Wohnen, <br />
            Gemeinsam Gestalten
          </h1>
          <WordPressContentWrapper content={pageContent} className="wordpress-content" />
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-4xl pb-16">
        <NextPageButton currentSlug="home" />
      </div>
    </main>
  )
}
