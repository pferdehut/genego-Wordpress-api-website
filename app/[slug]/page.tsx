import { notFound } from "next/navigation"
import { fetchWordPressPage, fetchWordPressPostsByCategory, fetchAllWordPressSlugs } from "@/lib/wordpress-actions"
import { NextPageButton } from "@/components/next-page-button"
import { WavyLine } from "@/components/wavy-line"

export async function generateStaticParams() {
  try {
    const slugs = await fetchAllWordPressSlugs()
    console.log("[v0] generateStaticParams - Generating pages for slugs:", slugs)
    return slugs.map((slug) => ({ slug }))
  } catch (error) {
    console.error("[v0] generateStaticParams - Error:", error)
    // Return fallback slugs to ensure at least some pages are generated
    return [
      { slug: "unser-projekt" },
      { slug: "unsere-genossenschaft" },
      { slug: "unsere-mitgliedschaft" },
      { slug: "unsere-dokumente-und-links" },
    ]
  }
}

export default async function DynamicPage({ params }: { params: { slug: string } }) {
  console.log("[v0] Rendering dynamic page for slug:", params.slug)

  const [pageData, posts] = await Promise.all([
    fetchWordPressPage(params.slug),
    fetchWordPressPostsByCategory(params.slug),
  ])

  if (!pageData) {
    console.log("[v0] Page data not found for slug:", params.slug)
    notFound()
  }

  return (
    <main className="min-h-screen">
      <section className="bg-white py-12 px-4">
        <div className="container mx-auto px-4">
          <h1 className="font-heading text-4xl md:text-5xl font-bold mb-6 text-balance">{pageData.title}</h1>

          <div
            className="wordpress-content prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: pageData.content }}
          />

          {posts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-12">Was bisher geschah</h2>
              <div className="relative space-y-16 pl-12">
                <div className="absolute left-0 top-0 bottom-0 w-[4px]">
                  <WavyLine orientation="vertical" className="text-primary/30 h-full" />
                </div>
                {posts.map((post) => {
                  const postDate = new Date(post.date)
                  const monthYear = postDate.toLocaleDateString("de-CH", {
                    year: "numeric",
                    month: "long",
                  })
                  const day = postDate.getDate()

                  return (
                    <div key={post.id} className="relative">
                      <div className="absolute -left-12 top-0 w-8 h-8 rounded-full bg-primary border-4 border-background" />

                      <div className="mb-4">
                        <div className="text-sm font-medium text-muted-foreground uppercase tracking-wide">
                          {day}. {monthYear}
                        </div>
                      </div>

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
        </div>
      </section>

      <div className="container mx-auto px-4 py-16">
        <NextPageButton currentSlug={params.slug} />
      </div>
    </main>
  )
}
