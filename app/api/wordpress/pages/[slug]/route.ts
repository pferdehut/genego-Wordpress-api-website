import { NextResponse } from "next/server"

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL

interface WordPressPost {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  excerpt: { rendered: string }
}

const FALLBACK_PAGES: Record<string, WordPressPost> = {
  "unser-projekt": {
    id: 1,
    title: { rendered: "Unser Projekt" },
    content: {
      rendered: `
        <h2>Vision und Ziele</h2>
        <p>Die Genossenschaft Neumühle Goldach (GeNeGo) entwickelt eine altersdurchmischte Wohnsiedlung, die mehr als nur Wohnraum bietet. Unser Ziel ist es, einen Lebensort zu schaffen, der Gemeinschaft, Nachhaltigkeit und Selbstbestimmung vereint.</p>
        <h2>Nachhaltigkeit</h2>
        <p>Nachhaltigkeit steht im Zentrum unseres Projekts. Wir nutzen Boden, Energie und Infrastruktur ressourcenschonend und setzen auf ökologische Bauweise.</p>
        <h2>Gemeinschaft</h2>
        <p>Das Zusammenleben in der Gemeinschaft ist ein zentraler Aspekt unseres Projekts. Wir schaffen Räume für Begegnung und gemeinsame Aktivitäten.</p>
      `,
    },
    excerpt: { rendered: "" },
  },
}

export async function GET(request: Request, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  console.log("[v0] Fetching page with slug:", slug)
  console.log("[v0] WordPress API URL:", WORDPRESS_API_URL ? "Set" : "Not set")

  // If WordPress is not configured, return fallback data
  if (!WORDPRESS_API_URL || WORDPRESS_API_URL.includes("your-wordpress-site.com")) {
    console.log("[v0] Using fallback data for slug:", slug)
    const fallbackPage = FALLBACK_PAGES[slug]
    if (fallbackPage) {
      return NextResponse.json(fallbackPage)
    }
    return NextResponse.json({ error: "Page not found" }, { status: 404 })
  }

  try {
    const wpUrl = `${WORDPRESS_API_URL}/pages?slug=${slug}`
    console.log("[v0] Attempting to fetch from:", wpUrl)

    const response = await fetch(wpUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] WordPress response status:", response.status)

    if (!response.ok) {
      console.error("[v0] WordPress returned error:", response.status, response.statusText)
      throw new Error(`WordPress API returned ${response.status}`)
    }

    const pages: WordPressPost[] = await response.json()
    console.log("[v0] Fetched pages count:", pages.length)

    if (pages.length === 0) {
      console.log("[v0] No page found for slug:", slug)
      const fallbackPage = FALLBACK_PAGES[slug]
      if (fallbackPage) {
        console.log("[v0] Using fallback data instead")
        return NextResponse.json(fallbackPage)
      }
      return NextResponse.json({ error: "Page not found" }, { status: 404 })
    }

    console.log("[v0] Successfully fetched WordPress page:", slug)
    return NextResponse.json(pages[0])
  } catch (error) {
    console.error(`[v0] Error fetching WordPress page ${slug}:`, error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : String(error))

    // Try to return fallback data
    const fallbackPage = FALLBACK_PAGES[slug]
    if (fallbackPage) {
      console.log("[v0] Returning fallback data due to error")
      return NextResponse.json(fallbackPage)
    }

    return NextResponse.json({ error: "Failed to fetch page" }, { status: 500 })
  }
}
