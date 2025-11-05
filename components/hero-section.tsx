"use client"

import { useEffect, useState } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
      {/* Background texture */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url('/paper-texture.jpg')`,
        }}
      />

      {/* Decorative card elements */}
      <div className="absolute top-10 left-5 w-20 h-28 border-2 border-foreground/20 rounded-sm opacity-20 transform -rotate-12" />
      <div className="absolute bottom-20 right-8 w-24 h-32 border-2 border-foreground/20 rounded-sm opacity-15 transform rotate-6" />

      <div className="relative z-10 text-center max-w-4xl mx-auto">
        {/* Main title */}
        <div
          className={`mb-6 transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
        >
          <h1
            className="text-7xl md:text-8xl font-black mb-2 tracking-tighter"
            style={{
              fontFamily: "Georgia, serif",
              letterSpacing: "-0.02em",
              textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
            }}
          >
            4SIGHT
          </h1>
          <div className="w-32 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent mx-auto my-4" />
        </div>

        {/* Subtitle */}
        <div
          className={`mb-12 transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <h2 className="text-2xl md:text-3xl font-light tracking-widest text-muted-foreground mb-4">
            THE HANDS OF CHANCE
          </h2>
          <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
            A cinematic journey where perception meets destiny. Follow the lens that captures what the eye cannot see.
          </p>
        </div>

        {/* Description paragraph */}
        <div
          className={`mb-12 transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
        >
          <p className="text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed text-sm md:text-base">
            In a city where playing cards fall from impossible skies, a photographer discovers they're not just
            images—they're messages. Each frame reveals a truth hidden from the ordinary eye. Each flash of light
            unlocks another layer of reality.
          </p>
        </div>

        {/* Author */}
        <div className={`transition-all duration-1000 delay-700 ${isVisible ? "opacity-100" : "opacity-0"}`}>
          <p className="text-sm tracking-widest text-muted-foreground mb-8">BY ACE STRIDER</p>

          {/* Quick stats */}
          <div className="flex flex-wrap gap-8 justify-center mt-8 text-sm">
            <div className="text-center">
              <div className="text-2xl font-black text-foreground mb-1">4</div>
              <div className="text-xs tracking-widest text-muted-foreground">CHAPTERS</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground mb-1">∞</div>
              <div className="text-xs tracking-widest text-muted-foreground">MYSTERIES</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-black text-foreground mb-1">1</div>
              <div className="text-xs tracking-widest text-muted-foreground">TRUTH</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
