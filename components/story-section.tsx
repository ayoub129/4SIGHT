"use client"

import { useEffect, useState } from "react"

export function StorySection() {
  const [isInView, setIsInView] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
        }
      },
      { threshold: 0.3 },
    )

    const element = document.querySelector("[data-story]")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section data-story className="relative py-24 px-4 bg-secondary/30">
      <div className="max-w-4xl mx-auto">
        <div
          className={`transition-all duration-1000 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-12 tracking-tight text-center">The Story</h2>

          <div className="space-y-8 text-lg text-muted-foreground leading-relaxed font-light">
            <p>
              Every photograph tells a story. But what happens when the photographer begins to see things that shouldn't
              be there? Objects that defy explanation. Patterns that suggest something far deeper than mere coincidence.
            </p>

            <p>
              Our protagonist discovers a truth hidden within the frames: playing cards falling from an impossible sky,
              each one carrying a message from beyond. Are they visions? Warnings? Or something more sinister than
              either?
            </p>

            <p>
              As the cards continue to fall and the mystery deepens, one question remains: What will you see when you
              stop looking and start perceiving? In the world of 4SIGHT, perception is everything—and seeing is just the
              beginning.
            </p>

            <div className="border-l-4 border-foreground/30 pl-8 py-6 my-12 bg-card/50 rounded-r">
              <p className="italic text-foreground">
                "The photograph captures not what we see, but what we choose to believe. 4SIGHT asks: what if what we
                believe becomes real?"
              </p>
              <p className="text-sm text-muted-foreground mt-4">— Ace Strider</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12 pt-8 border-t border-foreground/10">
              <div className="text-center">
                <h3 className="text-2xl font-black mb-2">NOIR</h3>
                <p className="text-sm text-muted-foreground">Dark, atmospheric, mysterious</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black mb-2">SURREAL</h3>
                <p className="text-sm text-muted-foreground">Symbolic imagery and hidden truths</p>
              </div>
              <div className="text-center">
                <h3 className="text-2xl font-black mb-2">ARTISTIC</h3>
                <p className="text-sm text-muted-foreground">Hand-drawn visuals by Ace Strider</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
