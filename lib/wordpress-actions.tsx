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
  }
}

interface WordPressMenuItem {
  id: number
  title: { rendered: string }
  url: string
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

        return {
          heroSlides: [
            {
              image: "/modern-sustainable-housing-development-with-green-.jpg",
              title: page.title.rendered,
              subtitle: "Genossenschaft Neumühle Goldach",
            },
          ],
          content: page.content.rendered, // Keep full HTML
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
      console.log("[v0] [Server Action] Plugin response data:", JSON.stringify(data).substring(0, 200))

      const title = typeof data.title === "string" ? data.title : data.title?.rendered || "Untitled"
      const content = typeof data.content === "string" ? data.content : data.content?.rendered || ""

      console.log("[v0] [Server Action] Parsed title:", title)
      console.log("[v0] [Server Action] Parsed content (first 100 chars):", content.substring(0, 100))

      return {
        title,
        content,
      }
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

        return {
          title: page.title.rendered,
          content: page.content.rendered,
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
      console.log("[v0] [Server Action] Sample page with parent field:", JSON.stringify(pages[0]))
      console.log(
        "[v0] [Server Action] All pages with parent:",
        JSON.stringify(pages.map((p: any) => ({ id: p.id, title: p.title, parent: p.parent }))),
      )
      return pages
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
      console.log("[v0] [Server Action] Raw WordPress pages sample:", pages.slice(0, 2))

      const transformedPages = pages.map((page: WordPressPage) => ({
        id: page.id,
        title: page.title.rendered,
        slug: page.id.toString(),
        url: `/${page.id}`,
        parent: (page as any).parent || 0, // Use actual parent value from WordPress
      }))

      console.log("[v0] [Server Action] Transformed pages sample:", transformedPages.slice(0, 2))
      return transformedPages
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
    return posts.map((post: WordPressPost) => ({
      id: post.id,
      title: post.title.rendered,
      excerpt: post.excerpt.rendered,
      content: post.content.rendered,
      date: post.date,
      slug: post.slug,
      link: post.link,
      featuredImage: post._embedded?.["wp:featuredmedia"]?.[0]?.source_url || null,
      featuredImageAlt: post._embedded?.["wp:featuredmedia"]?.[0]?.alt_text || "",
    }))
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
        }
      }
    }
  } catch (error) {
    console.log("[v0] [Server Action] Standard API failed:", error instanceof Error ? error.message : "Unknown error")
  }

  console.log("[v0] [Server Action] All endpoints failed, using fallback post")
  return getFallbackPost(slug)
}

export async function fetchWordPressMenu(menuSlug: string) {
  console.log("[v0] [Server Action] Fetching WordPress menu:", menuSlug)

  const baseUrl = getWordPressBaseUrl()

  if (!baseUrl) {
    console.log("[v0] [Server Action] No API URL configured, returning empty menu")
    return []
  }

  // Try plugin endpoint first
  try {
    const pluginUrl = `${baseUrl}/wp-json/genego/v1/menus/${menuSlug}`
    console.log("[v0] [Server Action] Trying plugin menu endpoint:", pluginUrl)

    const response = await fetch(pluginUrl, {
      next: { revalidate: 300 },
    })

    if (response.ok) {
      const data = await response.json()
      console.log("[v0] [Server Action] Menu API response:", JSON.stringify(data))

      if (data.items && Array.isArray(data.items)) {
        console.log("[v0] [Server Action] Successfully fetched menu from plugin endpoint:", data.items.length, "items")
        return data.items
      } else if (Array.isArray(data)) {
        // Fallback for old response format
        console.log("[v0] [Server Action] Successfully fetched menu (legacy format):", data.length, "items")
        return data
      }
    } else {
      const errorData = await response.json().catch(() => null)
      if (
        errorData?.code === "no_menu" ||
        errorData?.code === "no_menus_exist" ||
        errorData?.code === "menu_not_found"
      ) {
        console.log(
          `[v0] [Server Action] WordPress menu "${menuSlug}" not found - this is expected if you haven't created the menu yet. Using fallback navigation.`,
        )
      } else {
        console.log("[v0] [Server Action] Menu endpoint returned status:", response.status)
      }
    }
  } catch (error) {
    console.log("[v0] [Server Action] Could not connect to WordPress menu endpoint. Using fallback navigation.")
  }

  console.log(
    `[v0] [Server Action] No WordPress menu found for "${menuSlug}". Components will use their default navigation.`,
  )
  return []
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
