"use client"

import type React from "react"
import { NextPageButton } from "@/components/next-page-button"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"

export default function KontaktPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Send to WordPress REST API or contact form plugin
    console.log("[v0] Form submitted:", formData)

    // Reset form
    setFormData({ name: "", email: "", message: "" })
    alert("Vielen Dank für Ihre Nachricht!")
  }

  return (
    <main className="pt-24 pb-16">
      <div className="container mx-auto px-4">
        <h1 className="font-heading text-4xl md:text-5xl font-bold mb-8">Kontakt</h1>

        <div className="mb-8">
          <p className="text-lg text-muted-foreground mb-4">
            Haben Sie Fragen zu unserem Projekt? Wir freuen uns auf Ihre Nachricht.
          </p>
          <p className="text-lg">
            <strong>Email:</strong>{" "}
            <a href="mailto:kontakt@genego.ch" className="text-primary hover:underline">
              kontakt@genego.ch
            </a>
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="message">Nachricht</Label>
            <Textarea
              id="message"
              rows={6}
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              required
            />
          </div>

          <Button type="submit" size="lg" className="w-full">
            Nachricht senden
          </Button>
        </form>

        <NextPageButton currentSlug="kontakt" />
      </div>
    </main>
  )
}
