"use client"

import { useEffect, useState } from "react"
import { fetchWordPressPage, fetchWordPressPostsByCategory } from "@/lib/wordpress-actions"
import { NextPageButton } from "@/components/next-page-button"
import { WordPressContentWrapper } from "@/components/wordpress-content-wrapper"

export default function ProjektPage() {
  const [page, setPage] = useState<Awaited<ReturnType<typeof fetchWordPressPage>> | null>(null)
  const [posts, setPosts] = useState<Awaited<ReturnType<typeof fetchWordPressPostsByCategory>>>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    Promise.all([fetchWordPressPage("unser-projekt"), fetchWordPressPostsByCategory("projekt")])
      .then(([pageResult, postsResult]) => {
        setPage(pageResult)
        setPosts(postsResult)
        setLoading(false)
      })
      .catch((error) => {
        console.error("[v0] Error loading projekt page:", error)
        setLoading(false)
      })
  }, [])

  if (loading || !page) {
    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-muted-foreground">Seite wird geladen...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-4xl">
        <h1 className="text-4xl md:text-5xl font-bold mb-8 text-balance">{page.title}</h1>

        <WordPressContentWrapper content={page.content} className="prose prose-lg max-w-none mb-16" />

        {posts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-12">Was bisher geschah</h2>
            <div className="relative space-y-16 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-border pl-8">
              {posts.map((post, index) => {
                const postDate = new Date(post.date)
                const monthYear = postDate.toLocaleDateString("de-CH", {
                  year: "numeric",
                  month: "long",
                })
                const day = postDate.getDate()

                return (
                  <div key={post.id} className="relative">
                    {/* Timeline dot */}
                    <div className="absolute -left-8 top-0 w-4 h-4 rounded-full bg-primary border-4 border-background" />

                    {/* Month/Year label */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {day}. {monthYear}
                      </div>
                    </div>

                    {/* Post content */}
                    <div className="bg-card overflow-hidden">
                      {post.featuredImage && (
                        <div className="aspect-video w-full overflow-hidden">
                          <img
                            src={post.featuredImage || "/placeholder.svg"}
                            alt={post.featuredImageAlt || post.title}
                            className="h-full w-full object-cover"
                          />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold mb-4">{post.title}</h3>
                        <WordPressContentWrapper content={post.content} className="prose prose-lg max-w-none" />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        <NextPageButton currentSlug="unser-projekt" />
      </div>
    </main>
  )
}
