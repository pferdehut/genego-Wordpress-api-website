"use client"

import { useEffect, useState } from "react"
import { fetchWordPressPage, fetchWordPressPostsByCategory } from "@/lib/wordpress-actions"
import { NextPageButton } from "@/components/next-page-button"
import { WavyLine } from "@/components/wavy-line"

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
        <div className="container mx-auto px-4 text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent mb-4" />
          <p className="text-muted-foreground">Seite wird geladen...</p>
        </div>
      </main>
    )
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-8 text-balance">{page.title}</h1>

        <div
          className="wordpress-content prose prose-lg max-w-none mb-16"
          dangerouslySetInnerHTML={{
            __html: page.content,
          }}
        />

        {posts.length > 0 && (
          <section className="mt-16">
            <h2 className="text-3xl font-bold mb-12">Was bisher geschah</h2>
            <div className="relative space-y-16 pl-12">
              <div className="absolute left-0 top-0 bottom-0 w-[4px]">
                <WavyLine orientation="vertical" className="text-primary/30 h-full" />
              </div>
              {posts.map((post, index) => {
                const postDate = new Date(post.date)
                const monthYear = postDate.toLocaleDateString("de-CH", {
                  year: "numeric",
                  month: "long",
                })
                const day = postDate.getDate()

                return (
                  <div key={post.id} className="relative">
                    <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-primary border-4 border-background" />

                    {/* Month/Year label */}
                    <div className="mb-4">
                      <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                        {day}. {monthYear}
                      </div>
                    </div>

                    {/* Post content */}
                    <div className="bg-card overflow-hidden shadow-lg">
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
                        <div
                          className="wordpress-content prose prose-lg max-w-none"
                          dangerouslySetInnerHTML={{ __html: post.content }}
                        />
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
