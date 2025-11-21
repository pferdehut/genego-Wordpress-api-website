"use client"

import { useEffect, useRef } from "react"

export function WordPressContentWrapper({
  content,
  className = "",
}: {
  content: string
  className?: string
}) {
  const contentRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (contentRef.current) {
      const fileButtons = contentRef.current.querySelectorAll(".wp-block-file__button")
      fileButtons.forEach((button) => {
        if (button instanceof HTMLAnchorElement) {
          button.setAttribute("target", "_blank")
          button.setAttribute("rel", "noopener noreferrer")
        }
      })
    }
  }, [content])

  return <div ref={contentRef} className={className} dangerouslySetInnerHTML={{ __html: content }} />
}
