"use server"

interface WordPressPage {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  acf?: {
    hero_images?: Array<{ url: string; alt: string }>
    hero_title?: string
    hero_subtitle?: string
    main_content?: string
    cta_text?: string
    cta_link?: string
  }
}

interface WordPressPost {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
  date: string
  slug: string
  link: string
  _embedded?: {
    "wp:featuredmedia"?: Array<{
      source_url: string
      alt_text: string
    }>
    "wp:term"?: Array<
      Array<{
        name: string
        slug: string
      }>
    >
  }
}

function getWordPressBaseUrl(): string | null {
  const baseUrl = process.env.WORDPRESS_API_URL

  if (!baseUrl) {
    console.log("[v0] [Server Action] WORDPRESS_API_URL not set")
    return null
  }

  return baseUrl.trim().replace(/\/+$/, "")
}

export async function fetchWordPressHome() {
  console.log("[v0] [Server Action] Fetching WordPress home data")

  const baseUrl = getWordPressBaseUrl()

  if (!baseUrl) {
    console.log("[v0] [Server Action] Using fallback data (no API URL)")
    return getFallbackHomeData()
  }

  // Try plugin endpoint first
  try {
    const pluginUrl = `${baseUrl}/wp-json/genego/v1/home`
    console.log("[v0] [Server Action] Trying plugin endpoint:", pluginUrl)

    const response = await fetch(pluginUrl, {
      next: { revalidate: 60 },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("[v0] [Server Action] Successfully fetched from plugin endpoint")
      if (data.content) {
        data.content = transformImageUrls(data.content, baseUrl)
      }
      return data
    }
  } catch (error) {
    console.log("[v0] [Server Action] Plugin endpoint failed, trying standard API")
  }

  // Fallback to standard WordPress REST API
  try {
    const standardUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=home`
    console.log("[v0] [Server Action] Trying standard API:", standardUrl)

    const response = await fetch(standardUrl, {
      next: { revalidate: 60 },
    })

    if (response.ok) {
      const pages = await response.json()
      if (pages && pages.length > 0) {
        const page = pages[0]
        console.log("[v0] [Server Action] Successfully fetched from standard API")

        const content = transformImageUrls(page.content.rendered, baseUrl)

        return {
          heroSlides: [
            {
              image: "/modern-sustainable-housing-development-with-green-.jpg",
              title: page.title.rendered,
              subtitle: "Genossenschaft Neumühle Goldach",
            },
          ],
          content: content,
        }
      }
    }
  } catch (error) {
    console.log(
      "[v0] [Server Action] Standard API also failed:",
      error instanceof Error ? error.message : "Unknown error",
    )
  }

  console.log("[v0] [Server Action] All endpoints failed, using fallback data")
  return getFallbackHomeData()
}

export async function fetchWordPressPage(slug: string) {
  console.log("[v0] [Server Action] Fetching WordPress page:", slug)

  const baseUrl = getWordPressBaseUrl()

  if (!baseUrl) {
    console.log("[v0] [Server Action] Using fallback data for", slug)
    return getFallbackPageData(slug)
  }

  // Try plugin endpoint first
  try {
    const pluginUrl = `${baseUrl}/wp-json/genego/v1/pages/${slug}`
    console.log("[v0] [Server Action] Trying plugin endpoint:", pluginUrl)

    const response = await fetch(pluginUrl, {
      next: { revalidate: 60 },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("[v0] [Server Action] Successfully fetched from plugin endpoint")
      if (data.content) {
        data.content = transformImageUrls(data.content, baseUrl)
      }
      return data
    }
  } catch (error) {
    console.log("[v0] [Server Action] Plugin endpoint failed, trying standard API")
  }

  // Fallback to standard WordPress REST API
  try {
    const standardUrl = `${baseUrl}/wp-json/wp/v2/pages?slug=${slug}`
    console.log("[v0] [Server Action] Trying standard API:", standardUrl)

    const response = await fetch(standardUrl, {
      next: { revalidate: 60 },
    })

    if (response.ok) {
      const pages = await response.json()
      if (pages && pages.length > 0) {
        const page = pages[0]
        console.log("[v0] [Server Action] Successfully fetched from standard API")

        const content = transformImageUrls(page.content.rendered, baseUrl)

        return {
          title: page.title.rendered,
          content: content,
        }
      }
    }
  } catch (error) {
    console.log(
      "[v0] [Server Action] Standard API also failed:",
      error instanceof Error ? error.message : "Unknown error",
    )
  }

  console.log("[v0] [Server Action] All endpoints failed, using fallback data")
  return getFallbackPageData(slug)
}

export async function fetchWordPressPages() {
  console.log("[v0] [Server Action] Fetching all WordPress pages")

  const baseUrl = getWordPressBaseUrl()

  if (!baseUrl) {
    console.log("[v0] [Server Action] Using fallback pages")
    return getFallbackPages()
  }

  // Try plugin endpoint first
  try {
    const pluginUrl = `${baseUrl}/wp-json/genego/v1/pages`
    console.log("[v0] [Server Action] Trying plugin endpoint:", pluginUrl)

    const response = await fetch(pluginUrl, {
      next: { revalidate: 300 },
    })

    if (response.ok) {
      const pages = await response.json()
      console.log("[v0] [Server Action] Successfully fetched from plugin endpoint")

      return pages.map((page: any, index: number) => {
        if (index === 0 && page.slug === "home") {
          return {
            ...page,
            url: "/",
          }
        }
        return page
      })
    }
  } catch (error) {
    console.log("[v0] [Server Action] Plugin endpoint failed, trying standard API")
  }

  // Fallback to standard WordPress REST API
  try {
    const standardUrl = `${baseUrl}/wp-json/wp/v2/pages?per_page=100`
    console.log("[v0] [Server Action] Trying standard API:", standardUrl)

    const response = await fetch(standardUrl, {
      next: { revalidate: 300 },
    })

    if (response.ok) {
      const pages = await response.json()
      console.log("[v0] [Server Action] Successfully fetched from standard API")

      // Transform to our format
      return pages.map((page: WordPressPage) => ({
        id: page.id,
        title: page.title.rendered,
        slug: page.id.toString(), // WordPress doesn't expose slug in REST API by default
        url: `/${page.id}`,
        parent: 0,
      }))
    }
  } catch (error) {
    console.log(
      "[v0] [Server Action] Standard API also failed:",
      error instanceof Error ? error.message : "Unknown error",
    )
  }

  console.log("[v0] [Server Action] All endpoints failed, using fallback pages")
  return getFallbackPages()
}

export async function fetchWordPressPostsByCategory(categorySlug: string) {
  console.log("[v0] [Server Action] Fetching WordPress posts for category:", categorySlug)

  const baseUrl = getWordPressBaseUrl()

  if (!baseUrl) {
    console.log("[v0] [Server Action] No API URL configured, returning empty array")
    return []
  }

  try {
    // First, get the category ID by slug
    const categoryUrl = `${baseUrl}/wp-json/wp/v2/categories?slug=${categorySlug}`
    console.log("[v0] [Server Action] Fetching category:", categoryUrl)

    const categoryResponse = await fetch(categoryUrl, {
      next: { revalidate: 300 },
    })

    if (!categoryResponse.ok) {
      console.log("[v0] [Server Action] Category not found:", categorySlug)
      return []
    }

    const categories = await categoryResponse.json()

    if (!categories || categories.length === 0) {
      console.log("[v0] [Server Action] No category found with slug:", categorySlug)
      return []
    }

    const categoryId = categories[0].id
    console.log("[v0] [Server Action] Found category ID:", categoryId, "for slug:", categorySlug)

    // Now fetch posts with this category
    const postsUrl = `${baseUrl}/wp-json/wp/v2/posts?categories=${categoryId}&_embed&per_page=100`
    console.log("[v0] [Server Action] Fetching posts:", postsUrl)

    const postsResponse = await fetch(postsUrl, {
      next: { revalidate: 60 },
    })

    if (!postsResponse.ok) {
      console.log("[v0] [Server Action] Failed to fetch posts for category:", categorySlug)
      return []
    }

    const posts = await postsResponse.json()
    console.log("[v0] [Server Action] Successfully fetched", posts.length, "posts")

    // Transform to our format
    return posts.map((post: WordPressPost) => {
      const content = transformImageUrls(post.content.rendered, baseUrl)

      return {
        id: post.id,
        title: post.title.rendered,
        excerpt: post.excerpt.rendered,
        content: content,
        date: post.date,
        slug: post.slug,
        link: post.link,
        featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
        featuredImageAlt: post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "",
        tags: post._embedded?.["wp:term"]?.[1] || [], // Include tags from embedded data (index 1 is tags, 0 is categories)
      }
    })
  } catch (error) {
    console.log("[v0] [Server Action] Error fetching posts:", error instanceof Error ? error.message : "Unknown error")
    return []
  }
}

export async function fetchWordPressPost(slug: string) {
  console.log("[v0] [Server Action] Fetching WordPress post:", slug)

  const baseUrl = getWordPressBaseUrl()

  if (!baseUrl) {
    console.log("[v0] [Server Action] Using fallback post")
    return getFallbackPost(slug)
  }

  // Try plugin endpoint first
  try {
    const pluginUrl = `${baseUrl}/wp-json/genego/v1/posts/${slug}`
    console.log("[v0] [Server Action] Trying plugin endpoint:", pluginUrl)

    const response = await fetch(pluginUrl, {
      next: { revalidate: 60 },
    })

    if (response.ok) {
      const post = await response.json()
      console.log("[v0] [Server Action] Successfully fetched post from plugin endpoint")
      return post
    }
  } catch (error) {
    console.log("[v0] [Server Action] Plugin endpoint failed, trying standard API")
  }

  // Fallback to standard WordPress REST API
  try {
    const standardUrl = `${baseUrl}/wp-json/wp/v2/posts?slug=${slug}&_embed`
    console.log("[v0] [Server Action] Trying standard API:", standardUrl)

    const response = await fetch(standardUrl, {
      next: { revalidate: 60 },
    })

    if (response.ok) {
      const posts = await response.json()
      if (posts && posts.length > 0) {
        const post = posts[0]
        console.log("[v0] [Server Action] Successfully fetched post from standard API")

        return {
          id: post.id,
          title: post.title.rendered,
          excerpt: post.excerpt.rendered,
          content: post.content.rendered,
          date: post.date,
          slug: post.slug,
          link: post.link,
          featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
          featuredImageAlt: post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "",
          tags: post._embedded?.["wp:term"]?.[1] || [], // Include tags from embedded data (index 1 is tags, 0 is categories)
        }
      }
    }
  } catch (error) {
    console.log("[v0] [Server Action] Standard API failed:", error instanceof Error ? error.message : "Unknown error")
  }

  console.log("[v0] [Server Action] All endpoints failed, using fallback post")
  return getFallbackPost(slug)
}

function getFallbackHomeData() {
  return {
    heroSlides: [
      {
        image: "/modern-sustainable-housing-development-with-green-.jpg",
        title: "Start 1. Etappe",
        subtitle: "Genossenschaft Neumühle Goldach",
      },
    ],
    content:
      "<p>Die Genossenschaft Neumühle Goldach (GeNeGo) realisiert ein innovativer Wohnprojekt, das gemeinschaftliches Leben und nachhaltiges Wohnen vereint.</p><p>Unser Ziel ist es, bezahlbaren Wohnraum zu schaffen, der gleichzeitig hohe ökologische Standards erfüllt und ein lebendiges Miteinander fördert.</p><p>Werden Sie Teil unserer Gemeinschaft und gestalten Sie die Zukunft des Wohnens mit.</p>",
  }
}

function getFallbackPageData(slug: string) {
  const fallbackData: Record<string, any> = {
    "unser-projekt": {
      title: "Unser Projekt",
      content: "<p>Informationen über das GeNeGo Projekt werden hier angezeigt, sobald WordPress verbunden ist.</p>",
    },
  }

  return (
    fallbackData[slug] || {
      title: "Seite nicht gefunden",
      content: "<p>Diese Seite ist noch nicht verfügbar.</p>",
    }
  )
}

function getFallbackPages() {
  return [
    { id: 1, title: "Home", slug: "home", url: "/", parent: 0 },
    { id: 2, title: "Unser Projekt", slug: "unser-projekt", url: "/projekt", parent: 0 },
    { id: 3, title: "Kontakt", slug: "kontakt", url: "/kontakt", parent: 0 },
  ]
}

function getFallbackPosts() {
  return [
    {
      id: 1,
      title: "Beispiel Blogpost",
      excerpt:
        "<p>Dies ist ein Beispiel-Blogpost. Sobald WordPress verbunden ist, werden hier echte Beiträge angezeigt.</p>",
      content:
        "<p>Dies ist ein Beispiel-Blogpost. Sobald WordPress verbunden ist, werden hier echte Beiträge angezeigt.</p>",
      date: new Date().toISOString(),
      slug: "beispiel-blogpost",
      link: "#",
      featuredImage: null,
      featuredImageAlt: "",
    },
  ]
}

function getFallbackPost(slug: string) {
  return {
    id: 1,
    title: "Blogpost nicht gefunden",
    excerpt: "<p>Dieser Blogpost konnte nicht geladen werden.</p>",
    content: "<p>Dieser Blogpost konnte nicht geladen werden. Bitte überprüfen Sie die WordPress-Verbindung.</p>",
    date: new Date().toISOString(),
    slug: slug,
    link: "#",
    featuredImage: null,
    featuredImageAlt: "",
  }
}

// Helper function to transform relative image URLs to absolute
function transformImageUrls(html: string, baseUrl: string): string {
  if (!html || !baseUrl) return html

  // Remove trailing slash from baseUrl
  const cleanBaseUrl = baseUrl.replace(/\/+$/, "")

  // Transform relative image URLs to absolute
  // Match src="/wp-content/..." or src="wp-content/..."
  html = html.replace(/src=["'](?!https?:\/\/)([^"']+)["']/gi, (match, url) => {
    // If URL starts with /, it's relative to domain root
    if (url.startsWith("/")) {
      return `src="${cleanBaseUrl}${url}"`
    }
    // If URL doesn't start with http or /, prepend base URL with /
    return `src="${cleanBaseUrl}/${url}"`
  })

  // Also handle srcset for responsive images
  html = html.replace(/srcset=["']([^"']+)["']/gi, (match, srcset) => {
    const transformedSrcset = srcset.replace(/(?!https?:\/\/)([^\s,]+)/g, (url: string) => {
      if (url.startsWith("http")) return url
      if (url.startsWith("/")) return `${cleanBaseUrl}${url}`
      return `${cleanBaseUrl}/${url}`
    })
    return `srcset="${transformedSrcset}"`
  })

  console.log("[v0] [Server Action] Transformed image URLs in content")
  return html
}
