import { NextResponse } from "next/server"

export async function GET() {
  const wpUrl = process.env.WORDPRESS_API_URL

  console.log("[v0] === WordPress Connection Test ===")
  console.log("[v0] WORDPRESS_API_URL:", wpUrl || "NOT SET")

  if (!wpUrl) {
    return NextResponse.json({
      success: false,
      error: "WORDPRESS_API_URL environment variable is not set",
      instructions: "Add WORDPRESS_API_URL in the Vars section of the sidebar",
    })
  }

  if (wpUrl.includes("your-wordpress-site.com")) {
    return NextResponse.json({
      success: false,
      error: "WORDPRESS_API_URL is still set to placeholder value",
      instructions: "Update WORDPRESS_API_URL to your actual WordPress site URL",
    })
  }

  // Test basic connectivity
  try {
    console.log("[v0] Testing connection to:", wpUrl)

    const testUrl = `${wpUrl}/pages`
    console.log("[v0] Full test URL:", testUrl)

    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 10000) // 10 second timeout

    const response = await fetch(testUrl, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      signal: controller.signal,
    })

    clearTimeout(timeoutId)

    console.log("[v0] Response status:", response.status)
    console.log("[v0] Response headers:", Object.fromEntries(response.headers.entries()))

    if (!response.ok) {
      const errorText = await response.text()
      console.error("[v0] Error response:", errorText)

      return NextResponse.json({
        success: false,
        error: `WordPress API returned status ${response.status}`,
        details: errorText.substring(0, 200),
        url: testUrl,
      })
    }

    const data = await response.json()
    console.log("[v0] Successfully connected! Found", data.length, "pages")

    return NextResponse.json({
      success: true,
      message: "Successfully connected to WordPress",
      pagesFound: data.length,
      url: testUrl,
      samplePage: data[0]
        ? {
            id: data[0].id,
            title: data[0].title?.rendered,
            slug: data[0].slug,
          }
        : null,
    })
  } catch (error) {
    console.error("[v0] Connection test failed:", error)

    let errorMessage = "Unknown error"
    let errorType = "UNKNOWN"

    if (error instanceof Error) {
      errorMessage = error.message
      if (error.name === "AbortError") {
        errorType = "TIMEOUT"
        errorMessage = "Request timed out after 10 seconds"
      } else if (error.message.includes("fetch failed")) {
        errorType = "NETWORK_ERROR"
        errorMessage = "Network request failed - check if WordPress URL is accessible"
      }
    }

    return NextResponse.json({
      success: false,
      error: errorMessage,
      errorType,
      url: wpUrl,
      troubleshooting: [
        "Verify your WordPress URL is correct (should end with /wp-json/wp/v2)",
        "Check if your WordPress site is publicly accessible",
        "Ensure WordPress REST API is enabled",
        "Check for CORS restrictions on your WordPress site",
      ],
    })
  }
}
