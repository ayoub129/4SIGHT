"use client"

import { useEffect, useState } from "react"

export function BookShowcase() {
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

    const element = document.querySelector("[data-book-showcase]")
    if (element) observer.observe(element)

    return () => observer.disconnect()
  }, [])

  return (
    <section data-book-showcase className="relative py-24 px-4 flex items-center justify-center min-h-screen">
      {/* Background cards */}
      <div className="absolute top-20 left-10 w-16 h-24 border border-foreground/10 rounded-sm opacity-20 transform -rotate-45" />
      <div className="absolute bottom-32 right-12 w-20 h-28 border border-foreground/10 rounded-sm opacity-15 transform rotate-45" />

      <div className="relative z-10 max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Book image */}
        <div
          className={`flex justify-center transition-all duration-1000 ${isInView ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <div className="relative w-64 h-80 perspective">
            <img
              src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/4sightbook01-4wjcuebstGhZ1Fhm7Q4CEXiShnUhuL.png"
              alt="4Sight Book Cover"
              className="w-full h-full object-cover rounded-lg shadow-2xl"
              style={{
                boxShadow: "0 20px 60px rgba(0, 0, 0, 0.3), 0 0 0 1px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        </div>

        {/* Content */}
        <div
          className={`transition-all duration-1000 delay-200 ${isInView ? "opacity-100 translate-x-0" : "opacity-0 translate-x-8"}`}
        >
          <h2 className="text-5xl md:text-6xl font-black mb-6 tracking-tight">
            Witness the
            <br />
            <span className="text-muted-foreground">Unseen</span>
          </h2>

          <p className="text-lg text-muted-foreground leading-relaxed mb-8 font-light">
            In a world where perception shapes reality, one photographer discovers the truth hidden in every frame.
            Playing cards fall from the sky. Luck becomes destiny. And seeing is just the beginning.
          </p>

          <div className="space-y-4 mb-12">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-foreground mt-3 flex-shrink-0" />
              <p className="text-muted-foreground font-light">A gripping mystery that challenges what you see</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-foreground mt-3 flex-shrink-0" />
              <p className="text-muted-foreground font-light">Stunning hand-drawn artistic direction</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-foreground mt-3 flex-shrink-0" />
              <p className="text-muted-foreground font-light">A tale of fate, chance, and the power of perspective</p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-foreground mt-3 flex-shrink-0" />
              <p className="text-muted-foreground font-light">Immersive noir aesthetic with symbolic imagery</p>
            </div>
          </div>

          <div className="text-xs text-muted-foreground tracking-widest">
            <p>AVAILABLE IN HARDCOVER & EBOOK</p>
          </div>
        </div>
      </div>
    </section>
  )
}
