import Link from "next/link"
import { fetchWordPressPost, fetchWordPressPostsByCategory } from "@/lib/wordpress-actions"
import { Button } from "@/components/ui/button"
import { notFound } from "next/navigation"
import { WordPressContentWrapper } from "@/components/wordpress-content-wrapper"

export async function generateStaticParams() {
  try {
    // Fetch all posts from the "unser-projekt" category
    const posts = await fetchWordPressPostsByCategory("unser-projekt")
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch (error) {
    console.error("[v0] Error generating static params for blog posts:", error)
    return []
  }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  try {
    const post = await fetchWordPressPost(slug)

    if (!post) {
      notFound()
    }

    return (
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4 max-w-4xl">
          <Link href="/projekt">
            <Button variant="ghost" className="mb-6">
              <svg className="mr-2 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              Zurück zu Was bisher geschah
            </Button>
          </Link>

          <article>
            <header className="mb-8">
              <time className="inline-block px-3 py-1 text-sm font-medium bg-primary/10 text-primary rounded-full mb-4">
                {new Date(post.date).toLocaleDateString("de-CH", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </time>
              <h1 className="text-4xl md:text-5xl font-bold mb-6 text-balance">{post.title}</h1>
            </header>

            {post.featuredImage && (
              <div className="aspect-video w-full overflow-hidden rounded-lg mb-8">
                <img
                  src={post.featuredImage || "/placeholder.svg"}
                  alt={post.featuredImageAlt || post.title}
                  className="h-full w-full object-cover"
                />
              </div>
            )}

            <WordPressContentWrapper content={post.content} className="prose prose-lg max-w-none wordpress-content" />
          </article>
        </div>
      </main>
    )
  } catch (error) {
    console.error("[v0] Error loading blog post:", error)
    notFound()
  }
}
