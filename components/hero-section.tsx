"use client"

import { useEffect, useState } from "react"

export function HeroSection() {
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const handlePreorderClick = (format: "ebook" | "paperback") => {
    const price = format === "ebook" ? "4.99" : "14.99"
    // Redirect immediately to checkout page
    window.location.href = `/checkout?format=${format}&price=${price}`
  }

  return (
    <section className="relative min-h-screen flex items-center justify-center px-6 md:px-12 lg:px-16 py-24 md:py-32 overflow-hidden">
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

      <div className="relative z-10 max-w-7xl mx-auto flex flex-col md:flex-row gap-16 md:gap-20 lg:gap-24 items-center">
        {/* Left side - Image */}
        <div
          className={`flex-1 flex justify-center md:justify-start transition-all duration-1000 delay-400 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <div className="relative w-full max-w-sm md:max-w-md lg:max-w-lg perspective">
            <img
              src="/book-cover.png"
              alt="4Sight Book Cover"
              className="w-full h-auto object-cover rounded-xl shadow-2xl"
              style={{
                boxShadow: "0 25px 70px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(0, 0, 0, 0.1)",
              }}
            />
          </div>
        </div>

        {/* Right side - Content */}
        <div className="flex-1 text-center space-y-8 md:space-y-10">
          {/* Main title */}
          <div
            className={`transition-all duration-1000 ${isVisible ? "opacity-100 scale-100" : "opacity-0 scale-95"}`}
          >
            <h1
              className="text-6xl md:text-7xl lg:text-8xl font-black mb-4 tracking-tighter text-red-600"
              style={{
                fontFamily: "var(--font-bebas-neue), sans-serif",
                letterSpacing: "0.02em",
                textShadow: "2px 2px 4px rgba(0,0,0,0.1)",
              }}
            >
              4SIGHT
            </h1>
            <div className="w-40 h-1 bg-gradient-to-r from-transparent via-foreground to-transparent mx-auto my-6" />
          </div>

          {/* Subtitle */}
          <div
            className={`transition-all duration-1000 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-light tracking-widest text-muted-foreground mb-6">
              THE HANDS OF CHANCE
            </h2>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              A cinematic journey where perception meets destiny. Follow the lens that captures what the eye cannot see.
            </p>
          </div>

          {/* Description paragraph */}
          <div
            className={`transition-all duration-1000 delay-500 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            <p className="text-base md:text-lg text-muted-foreground font-light max-w-2xl mx-auto leading-relaxed">
              In a city where playing cards fall from impossible skies, a photographer discovers they're not just
              images—they're messages. Each frame reveals a truth hidden from the ordinary eye. Each flash of light
              unlocks another layer of reality.
            </p>
          </div>

          {/* Preorder section */}
          <div
            className={`transition-all duration-1000 delay-600 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}
          >
            {/* Preorder boxes */}
            <div className="flex flex-col sm:flex-row gap-4 mb-8 justify-center">
              <button
                type="button"
                onClick={() => handlePreorderClick("paperback")}
                className="flex-1 px-8 py-10 border-2 rounded-xl transition-all hover:scale-105 cursor-pointer border-foreground/20 hover:border-foreground/40 bg-background/50 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <div className="text-2xl font-bold mb-2"> Paper Book</div>
                <div className="text-lg font-semibold text-foreground">$14.99</div>
              </button>
              <button
                type="button"
                onClick={() => handlePreorderClick("ebook")}
                className="flex-1 px-8 py-10 border-2 rounded-xl transition-all hover:scale-105 cursor-pointer border-foreground/20 hover:border-foreground/40 bg-background/50 hover:border-red-600 hover:bg-red-50 dark:hover:bg-red-950/20"
              >
                <div className="text-2xl font-bold mb-2">Ebook</div>
                <div className="text-lg font-semibold text-foreground">$4.99</div>
              </button>
            </div>

            <p className="text-sm text-muted-foreground text-center leading-relaxed">
              Click a format above to proceed to checkout. Email is optional and can be added separately.
            </p>
          </div>

        </div>
      </div>
    </section>
  )
}
