import { NextResponse } from "next/server"

export async function GET() {
  const apiUrl = process.env.WORDPRESS_API_URL

  if (!apiUrl) {
    console.log("[v0] [API] WORDPRESS_API_URL not set")
    return NextResponse.json({
      pages: [
        { id: 1, title: "Home", slug: "home" },
        { id: 2, title: "Unser Projekt", slug: "projekt" },
        { id: 3, title: "Kontakt", slug: "kontakt" },
      ],
    })
  }

  try {
    // Normalize URL
    let normalizedUrl = apiUrl.trim().replace(/\/+$/, "")
    if (!normalizedUrl.includes("/wp-json")) {
      normalizedUrl = `${normalizedUrl}/wp-json/wp/v2`
    } else if (!normalizedUrl.endsWith("/wp/v2")) {
      normalizedUrl = `${normalizedUrl}/wp/v2`
    }

    const url = `${normalizedUrl}/pages?per_page=100&orderby=menu_order&order=asc`
    console.log("[v0] [API] Fetching pages from:", url)

    const response = await fetch(url, {
      headers: {
        Accept: "application/json",
      },
      next: { revalidate: 300 }, // Cache for 5 minutes
    })

    if (!response.ok) {
      console.log("[v0] [API] Response not OK:", response.status, response.statusText)
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const pages = await response.json()
    console.log("[v0] [API] Successfully fetched", pages.length, "pages")

    // Transform to simpler format
    const simplifiedPages = pages.map((page: any) => ({
      id: page.id,
      title: page.title.rendered,
      slug: page.slug,
    }))

    return NextResponse.json({ pages: simplifiedPages })
  } catch (error) {
    console.log("[v0] [API] Error fetching pages:", error instanceof Error ? error.message : "Unknown error")
    // Return fallback menu
    return NextResponse.json({
      pages: [
        { id: 1, title: "Home", slug: "home" },
        { id: 2, title: "Unser Projekt", slug: "projekt" },
        { id: 3, title: "Kontakt", slug: "kontakt" },
      ],
    })
  }
}
