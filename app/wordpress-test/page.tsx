"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

export default function WordPressTestPage() {
  const [result, setResult] = useState<any>(null)
  const [loading, setLoading] = useState(false)

  const testConnection = async () => {
    setLoading(true)
    setResult(null)

    try {
      const response = await fetch("/api/wordpress/test")
      const data = await response.json()
      setResult(data)
    } catch (error) {
      setResult({
        success: false,
        error: "Failed to run test",
        details: error instanceof Error ? error.message : String(error),
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4 max-w-3xl">
        <h1 className="text-4xl font-bold mb-4">WordPress Connection Test</h1>
        <p className="text-muted-foreground mb-8">
          Use this page to test your WordPress REST API connection and diagnose any issues.
        </p>

        <Card className="p-6 mb-6">
          <h2 className="text-xl font-semibold mb-4">Test Your Connection</h2>
          <p className="text-sm text-muted-foreground mb-4">
            Click the button below to test if your WordPress site is properly configured and accessible.
          </p>
          <Button onClick={testConnection} disabled={loading} size="lg">
            {loading ? "Testing..." : "Run Connection Test"}
          </Button>
        </Card>

        {result && (
          <Card className={`p-6 ${result.success ? "border-green-500" : "border-red-500"}`}>
            <h2 className="text-xl font-semibold mb-4">{result.success ? "✓ Success" : "✗ Failed"}</h2>

            {result.success ? (
              <div className="space-y-2">
                <p className="text-green-600 font-medium">{result.message}</p>
                <div className="text-sm space-y-1">
                  <p>
                    <strong>Pages Found:</strong> {result.pagesFound}
                  </p>
                  <p>
                    <strong>API URL:</strong> {result.url}
                  </p>
                  {result.samplePage && (
                    <div className="mt-4 p-4 bg-muted rounded">
                      <p className="font-medium mb-2">Sample Page:</p>
                      <p>
                        <strong>ID:</strong> {result.samplePage.id}
                      </p>
                      <p>
                        <strong>Title:</strong> {result.samplePage.title}
                      </p>
                      <p>
                        <strong>Slug:</strong> {result.samplePage.slug}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                <p className="text-red-600 font-medium">{result.error}</p>
                {result.errorType && (
                  <p className="text-sm">
                    <strong>Error Type:</strong> {result.errorType}
                  </p>
                )}
                {result.details && (
                  <div className="text-sm">
                    <strong>Details:</strong>
                    <pre className="mt-2 p-3 bg-muted rounded text-xs overflow-auto">{result.details}</pre>
                  </div>
                )}
                {result.url && (
                  <p className="text-sm">
                    <strong>Attempted URL:</strong> {result.url}
                  </p>
                )}
                {result.troubleshooting && (
                  <div className="mt-4">
                    <p className="font-medium mb-2">Troubleshooting Steps:</p>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      {result.troubleshooting.map((step: string, i: number) => (
                        <li key={i}>{step}</li>
                      ))}
                    </ul>
                  </div>
                )}
                {result.instructions && (
                  <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-950 rounded">
                    <p className="text-sm">
                      <strong>Instructions:</strong> {result.instructions}
                    </p>
                  </div>
                )}
              </div>
            )}
          </Card>
        )}

        <Card className="p-6 mt-6">
          <h2 className="text-xl font-semibold mb-4">Setup Instructions</h2>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-medium mb-2">1. Set Your WordPress URL</p>
              <p className="text-muted-foreground">
                Add your WordPress REST API URL in the <strong>Vars</strong> section of the sidebar.
              </p>
              <code className="block mt-2 p-2 bg-muted rounded text-xs">
                WORDPRESS_API_URL=https://your-site.com/wp-json/wp/v2
              </code>
            </div>
            <div>
              <p className="font-medium mb-2">2. Verify WordPress REST API</p>
              <p className="text-muted-foreground">
                Make sure your WordPress site has the REST API enabled (it's enabled by default in WordPress 4.7+).
              </p>
            </div>
            <div>
              <p className="font-medium mb-2">3. Check CORS Settings</p>
              <p className="text-muted-foreground">
                If you're getting network errors, you may need to configure CORS on your WordPress site to allow
                requests from this domain.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </main>
  )
}
