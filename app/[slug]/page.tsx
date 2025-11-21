import { notFound } from "next/navigation"
import { fetchWordPressPage, fetchWordPressPostsByCategory, fetchWordPressPages } from "@/lib/wordpress-actions"
import { NextPageButton } from "@/components/next-page-button"
import { WordPressContentWrapper } from "@/components/wordpress-content-wrapper"

export async function generateStaticParams() {
  try {
    const pages = await fetchWordPressPages()
    // Filter out the home page since it has its own route
    return pages
      .filter((page) => page.slug !== "home")
      .map((page) => ({
        slug: page.slug,
      }))
  } catch (error) {
    console.error("[v0] Error generating static params:", error)
    // Return common pages as fallback
    return [{ slug: "unser-projekt" }, { slug: "unsere-genossenschaft" }, { slug: "kontakt" }]
  }
}

export default async function DynamicPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const [pageData, posts] = await Promise.all([fetchWordPressPage(slug), fetchWordPressPostsByCategory(slug)])

    if (!pageData) {
      notFound()
    }

    return (
      <main className="min-h-screen py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{pageData.title}</h1>

          <WordPressContentWrapper content={pageData.content} className="prose prose-lg max-w-none wordpress-content" />

          {posts.length > 0 && (
            <section className="mt-16">
              <h2 className="text-3xl font-bold mb-12">Was bisher geschah</h2>
              <div className="relative space-y-16 before:absolute before:left-0 before:top-0 before:bottom-0 before:w-0.5 before:bg-border pl-8">
                {posts.map((post) => {
                  const postDate = new Date(post.date)
                  const monthYear = postDate.toLocaleDateString("de-CH", {
                    year: "numeric",
                    month: "long",
                  })
                  const day = postDate.getDate()

                  return (
                    <div key={post.id} className="relative">
                      {/* Timeline dot */}
                      <div className="absolute -left-9 top-0 w-5 h-5 rounded-full bg-primary border-5 border-background" />

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
                          <WordPressContentWrapper
                            content={post.content}
                            className="prose prose-lg max-w-none wordpress-content"
                          />
                        </div>
                      </div>
                    </div>
                  )
                })}
              </div>
            </section>
          )}

          <NextPageButton currentSlug={slug} />
        </div>
      </main>
    )
  } catch (error) {
    console.error("[v0] Error loading page:", error)
    notFound()
  }
}
