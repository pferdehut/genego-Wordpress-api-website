import { Button } from "@/components/ui/button"

interface ProjectInfoProps {
  content: {
    title: string
    paragraphs: string[]
  }
}

export function ProjectInfo({ content }: ProjectInfoProps) {
  return (
    <section className="py-16 md:py-24">
      <div className="container mx-auto px-4 max-w-5xl">
        <h2 className="text-4xl md:text-5xl font-bold mb-8 text-balance">{content.title}</h2>

        <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
          {content.paragraphs.map((paragraph, index) => (
            <p key={index} className="text-pretty">
              {paragraph}
            </p>
          ))}
        </div>

        <div className="mt-12 flex justify-center">
          <Button size="lg" className="rounded-full px-8">
            Erfahre mehr über das Projekt
          </Button>
        </div>
      </div>
    </section>
  )
}
