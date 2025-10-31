import { NextResponse } from "next/server"

const WORDPRESS_API_URL = process.env.WORDPRESS_API_URL

interface WordPressPage {
  id: number
  title: { rendered: string }
  content: { rendered: string }
  acf?: {
    hero_slides?: Array<{
      image: string
      title: string
      description: string
    }>
  }
}

const FALLBACK_DATA = {
  heroSlides: [
    {
      id: 1,
      image: "/modern-sustainable-housing-development-with-green-.jpg",
      title: "Start 1. Etappe",
      description:
        "Das Wohnprojekt der Genossenschaft Neumühle Goldach steht in den Startlöchern. Die Baueingabe für die erste Etappe der altersdurchmischten Siedlung mit attraktiven Gemeinschaftsflächen erfolgt im Sommer 2025.",
    },
    {
      id: 2,
      image: "/community-garden-with-people-in-cooperative-housin.jpg",
      title: "Gemeinsam Wohnen",
      description:
        "Ein Lebensort, der mehr ist als Wohnen. Der komplette Kreislauf des Lebens mit all seinen Facetten soll in diesem Quartier Platz haben.",
    },
  ],
  content: {
    title: "Gemeinsam Wohnen, Gemeinsam Gestalten",
    paragraphs: [
      "Das Projekt einer altersdurchmischten Siedlung der Genossenschaft Neumühle Goldach (GeNeGo) ist aus dem Bedürfnis nach einem Lebensort entstanden, der mehr ist als Wohnen. Der komplette Kreislauf des Lebens mit all seinen Facetten soll in diesem Quartier Platz haben. Es bietet Wohnqualität für Menschen, die ein Leben in der Gemeinschaft suchen, die gerne ihren Beitrag für das Zusammenleben leisten und ihr Leben selbstbestimmt gestalten möchten. Hier sind sie eingebettet in ein grösseres Ganzes und finden gleichzeitig genügend Rückzugsmöglichkeiten und Freiraum für sich selbst.",
      "Nebst dem Aspekt des Sozialraums stellt sich die GeNeGo damit den weiteren Herausforderungen unserer Zeit. Im Wissen, dass Bauen und Wohnen nachhaltig sein müssen, werden Boden, Energie und Infrastruktur ressourcenschonend genutzt. Und durch die nicht gewinnorientierte Rechtsform der Genossenschaft bleibt das Geld im Projekt und wird der Spekulation entzogen.",
    ],
  },
}

export async function GET() {
  console.log("[v0] WordPress API URL:", WORDPRESS_API_URL ? "Set" : "Not set")

  if (!WORDPRESS_API_URL || WORDPRESS_API_URL.includes("your-wordpress-site.com")) {
    console.log("[v0] Using fallback data - WordPress not configured")
    return NextResponse.json(FALLBACK_DATA)
  }

  try {
    const wpUrl = `${WORDPRESS_API_URL}/pages?slug=home`
    console.log("[v0] Attempting to fetch from:", wpUrl)

    const response = await fetch(wpUrl, {
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
      },
    })

    console.log("[v0] WordPress response status:", response.status)

    if (!response.ok) {
      console.error("[v0] WordPress returned error status:", response.status, response.statusText)
      throw new Error(`WordPress API returned ${response.status}`)
    }

    const pages: WordPressPage[] = await response.json()
    console.log("[v0] Fetched pages count:", pages.length)

    const homePage = pages[0]

    if (!homePage) {
      console.log("[v0] No home page found, using fallback")
      return NextResponse.json(FALLBACK_DATA)
    }

    // Extract hero slides from ACF fields or use defaults
    const heroSlides = homePage.acf?.hero_slides || [
      {
        id: 1,
        image: "/modern-sustainable-housing-development-with-green-.jpg",
        title: homePage.title.rendered,
        description: homePage.content.rendered.substring(0, 200).replace(/<[^>]*>/g, ""),
      },
    ]

    // Parse content into paragraphs
    const contentDiv = homePage.content.rendered
    const paragraphs = contentDiv
      .split("</p>")
      .filter((p) => p.trim())
      .map((p) => p.replace(/<[^>]*>/g, "").trim())
      .filter((p) => p.length > 0)

    console.log("[v0] Successfully fetched WordPress content")

    return NextResponse.json({
      heroSlides,
      content: {
        title: homePage.title.rendered,
        paragraphs,
      },
    })
  } catch (error) {
    console.error("[v0] Error fetching WordPress home data:", error)
    console.error("[v0] Error details:", error instanceof Error ? error.message : String(error))
    console.log("[v0] Returning fallback data due to error")

    // Return fallback data on error
    return NextResponse.json(FALLBACK_DATA)
  }
}
