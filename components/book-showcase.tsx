"use client"

import { useEffect, useState } from "react"

export function BookShowcase() {
  const [isInView, setIsInView] = useState(false)
  const [selectedCover, setSelectedCover] = useState<{
    src: string
    alt: string
    title: string
  } | null>(null)

  useEffect(() => {
    // Fallback: show content after a delay if IntersectionObserver doesn't trigger
    const fallbackTimer = setTimeout(() => {
      setIsInView(true)
    }, 1000)

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true)
          clearTimeout(fallbackTimer)
        }
      },
      { 
        threshold: 0.1, // Lower threshold for mobile
        rootMargin: '50px', // Trigger earlier
      },
    )

    const element = document.querySelector("[data-book-showcase]")
    if (element) {
      observer.observe(element)
    } else {
      // If element not found, show content anyway
      clearTimeout(fallbackTimer)
      setIsInView(true)
    }

    return () => {
      observer.disconnect()
      clearTimeout(fallbackTimer)
    }
  }, [])

  const handleCoverClick = (src: string, alt: string, title: string) => {
    setSelectedCover({ src, alt, title })
  }

  const closeModal = () => {
    setSelectedCover(null)
  }

  return (
    <section data-book-showcase className="relative py-24 px-4 flex items-center justify-center min-h-screen">
      {/* Background cards */}
      <div className="absolute top-20 left-10 w-16 h-24 border border-foreground/10 rounded-sm opacity-20 transform -rotate-45" />
      <div className="absolute bottom-32 right-12 w-20 h-28 border border-foreground/10 rounded-sm opacity-15 transform rotate-45" />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Content */}
        <div
          className={`text-center mb-16 transition-all duration-1000 delay-200 ${isInView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"}`}
        >
          <h2 
            className="text-6xl md:text-7xl lg:text-8xl font-black mb-6 tracking-tight"
            style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
          >
            Witness the
            <br />
            <span className="text-muted-foreground">Unseen</span>
          </h2>

          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 font-light max-w-3xl mx-auto">
            In a world where perception shapes reality, one photographer discovers the truth hidden in every frame.
            Playing cards fall from the sky. Luck becomes destiny. And seeing is just the beginning.
          </p>
        </div>

        {/* Special Edition Covers Showcase */}
        <div
          className={`flex flex-col items-center gap-12 transition-all duration-1000 ${isInView ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
        >
          <div className="text-center mb-4">
            <h3 
              className="text-4xl md:text-5xl font-black mb-6 tracking-tight"
              style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
            >
              Special Edition Covers
            </h3>
            <p className="text-lg md:text-xl text-muted-foreground font-light max-w-3xl mx-auto leading-relaxed">
              Each book comes with a unique card cover and includes special playing cards. Limited quantities available—each edition is a collector's item.
            </p>
          </div>

          {/* Cover Variants Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-6 lg:gap-8 w-full max-w-6xl">
            {/* White Edition - Common (First) */}
            <div className="flex flex-col items-center group relative">
              {/* Pre-order Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-foreground text-background px-4 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg border-2 border-white/20">
                  PRE-ORDER GUARANTEED
                </div>
              </div>
              
              {/* Edition Card Container */}
              <div className="relative w-full bg-gradient-to-br from-foreground/5 to-foreground/10 dark:from-foreground/10 dark:to-foreground/5 rounded-2xl p-6 border-2 border-foreground/20 group-hover:border-foreground/40 transition-all duration-500">
                <div className="relative mb-6">
                  <div
                    className="relative w-full max-w-[200px] mx-auto aspect-[3/4] transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-foreground/10 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <img
                      src="/cards-cover/cover1000.png"
                      alt="White Edition Cover"
                      onClick={() => handleCoverClick("/cards-cover/cover1000.png", "White Edition Cover", "White Edition")}
                      className="relative w-full h-full object-contain rounded-lg shadow-2xl border-2 border-foreground/30 bg-background/80 cursor-pointer transition-all duration-300 hover:scale-105"
                      style={{
                        boxShadow: "0 30px 80px rgba(0, 0, 0, 0.5), 0 0 0 1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h4 className="text-2xl md:text-3xl font-black mb-3" style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}>
                    White Edition
                  </h4>
                  <div className="inline-flex items-center gap-2 bg-foreground/10 dark:bg-foreground/20 px-3 py-1 rounded-full mb-3">
                    <span className="text-2xl font-black">1,000</span>
                    <span className="text-sm font-semibold text-muted-foreground">copies total</span>
                  </div>
                  <div className="space-y-2 text-xs text-muted-foreground leading-relaxed">
                    <p className="font-semibold text-foreground">First 100 pre-orders guaranteed</p>
                    <p>Then 900 copies available</p>
                  </div>
                </div>

                {/* Included Cards - Fan Layout */}
                <div className="relative mb-6 flex justify-center items-center h-32">
                  <div className="relative w-24 h-32 transition-all duration-300 hover:scale-110 hover:z-10 hover:rotate-6" style={{ transform: "rotate(-8deg)" }}>
                    <img
                      src="/cards-cover/Front1000.png"
                      alt="White Front Card"
                      className="w-full h-full object-cover rounded-sm shadow-xl border-2 border-foreground/20"
                    />
                  </div>
                  <div className="relative w-24 h-32 -ml-4 transition-all duration-300 hover:scale-110 hover:z-10 hover:-rotate-6" style={{ transform: "rotate(8deg)" }}>
                    <img
                      src="/cards-cover/Back1000.png"
                      alt="White Back Card"
                      className="w-full h-full object-cover rounded-sm shadow-xl border-2 border-foreground/20"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  Includes matching white playing cards with every book
                </p>
              </div>
            </div>

            {/* Red Edition - Ultra Rare */}
            <div className="flex flex-col items-center group relative">
              {/* Rarity Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-red-600 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg border-2 border-white/20">
                  ULTRA RARE
                </div>
              </div>
              
              {/* Edition Card Container */}
              <div className="relative w-full bg-gradient-to-br from-red-50/50 to-red-100/30 dark:from-red-950/20 dark:to-red-900/10 rounded-2xl p-6 border-2 border-red-600/20 group-hover:border-red-600/40 transition-all duration-500">
                <div className="relative mb-6">
                  <div
                    className="relative w-full max-w-[200px] mx-auto aspect-[3/4] transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <img
                      src="/cards-cover/cover10red.png"
                      alt="Red Edition Cover"
                      onClick={() => handleCoverClick("/cards-cover/cover10red.png", "Red Edition Cover", "Red Edition")}
                      className="relative w-full h-full object-contain rounded-lg shadow-2xl border-2 border-red-600/40 bg-background/80 cursor-pointer transition-all duration-300 hover:scale-105"
                      style={{
                        boxShadow: "0 30px 80px rgba(239, 68, 68, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h4 className="text-2xl md:text-3xl font-black mb-3 text-red-600" style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}>
                    Red Edition
                  </h4>
                  <div className="inline-flex items-center gap-2 bg-red-600/10 dark:bg-red-600/20 px-3 py-1 rounded-full mb-3">
                    <span className="text-2xl font-black text-red-600">10</span>
                    <span className="text-sm font-semibold text-muted-foreground">copies only</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Randomly distributed between pre-orders and normal orders
                  </p>
                </div>

                {/* Included Cards - Fan Layout */}
                <div className="relative mb-6 flex justify-center items-center h-32">
                  <div className="relative w-24 h-32 transition-all duration-300 hover:scale-110 hover:z-10 hover:rotate-6" style={{ transform: "rotate(-8deg)" }}>
                    <img
                      src="/cards-cover/Front10red.png"
                      alt="Red Front Card"
                      className="w-full h-full object-cover rounded-sm shadow-xl border-2 border-red-600/30"
                    />
                  </div>
                  <div className="relative w-24 h-32 -ml-4 transition-all duration-300 hover:scale-110 hover:z-10 hover:-rotate-6" style={{ transform: "rotate(8deg)" }}>
                    <img
                      src="/cards-cover/Back10red.png"
                      alt="Red Back Card"
                      className="w-full h-full object-cover rounded-sm shadow-xl border-2 border-red-600/30"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  Includes matching red playing cards with every book
                </p>
              </div>
            </div>

            {/* Yellow Edition */}
            <div className="flex flex-col items-center group relative">
              {/* Rarity Badge */}
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 z-20">
                <div className="bg-yellow-500 text-white px-4 py-1 rounded-full text-xs font-bold tracking-wider shadow-lg border-2 border-white/20">
                  ULTRA RARE
                </div>
              </div>
              
              {/* Edition Card Container */}
              <div className="relative w-full bg-gradient-to-br from-yellow-50/50 to-yellow-100/30 dark:from-yellow-950/20 dark:to-yellow-900/10 rounded-2xl p-6 border-2 border-yellow-500/20 group-hover:border-yellow-500/40 transition-all duration-500">
                <div className="relative mb-6">
                  <div
                    className="relative w-full max-w-[200px] mx-auto aspect-[3/4] transition-all duration-500 group-hover:scale-105 group-hover:-translate-y-2"
                    style={{
                      transformStyle: "preserve-3d",
                    }}
                  >
                    <div className="absolute inset-0 bg-gradient-to-br from-yellow-500/20 to-transparent rounded-lg blur-xl group-hover:blur-2xl transition-all duration-500" />
                    <img
                      src="/cards-cover/cover10.png"
                      alt="Yellow Edition Cover"
                      onClick={() => handleCoverClick("/cards-cover/cover10.png", "Yellow Edition Cover", "Yellow Edition")}
                      className="relative w-full h-full object-contain rounded-lg shadow-2xl border-2 border-yellow-500/40 bg-background/80 cursor-pointer transition-all duration-300 hover:scale-105"
                      style={{
                        boxShadow: "0 30px 80px rgba(234, 179, 8, 0.6), 0 0 0 1px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </div>
                </div>
                
                <div className="text-center mb-6">
                  <h4 className="text-2xl md:text-3xl font-black mb-3 text-yellow-600" style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}>
                    Yellow Edition
                  </h4>
                  <div className="inline-flex items-center gap-2 bg-yellow-500/10 dark:bg-yellow-500/20 px-3 py-1 rounded-full mb-3">
                    <span className="text-2xl font-black text-yellow-600">10</span>
                    <span className="text-sm font-semibold text-muted-foreground">copies only</span>
                  </div>
                  <p className="text-xs text-muted-foreground leading-relaxed">
                    Randomly distributed between pre-orders and normal orders
                  </p>
                </div>

                {/* Included Cards - Fan Layout */}
                <div className="relative mb-6 flex justify-center items-center h-32">
                  <div className="relative w-24 h-32 transition-all duration-300 hover:scale-110 hover:z-10 hover:rotate-6" style={{ transform: "rotate(-8deg)" }}>
                    <img
                      src="/cards-cover/Front10.png"
                      alt="Yellow Front Card"
                      className="w-full h-full object-cover rounded-sm shadow-xl border-2 border-yellow-500/30"
                    />
                  </div>
                  <div className="relative w-24 h-32 -ml-4 transition-all duration-300 hover:scale-110 hover:z-10 hover:-rotate-6" style={{ transform: "rotate(8deg)" }}>
                    <img
                      src="/cards-cover/Back10.png"
                      alt="Yellow Back Card"
                      className="w-full h-full object-cover rounded-sm shadow-xl border-2 border-yellow-500/30"
                    />
                  </div>
                </div>
                
                <p className="text-xs text-center text-muted-foreground leading-relaxed">
                  Includes matching yellow playing cards with every book
                </p>
              </div>
            </div>

          </div>

          <div className="mt-8 text-center max-w-3xl mx-auto">
            <p className="text-base text-muted-foreground font-light leading-relaxed">
              Each book is randomly assigned one of three exclusive card covers. Every cover comes with its matching set of special playing cards. 
              <span className="font-semibold"> Red and Yellow editions are ultra-rare with only 10 copies each, randomly distributed.</span> 
              <span className="font-semibold"> The first 100 pre-orders are guaranteed the White edition,</span> followed by 900 more copies. 
              You won't know which one you'll receive until it arrives.
            </p>
          </div>
        </div>
      </div>

      {/* Modal for enlarged cover view */}
      {selectedCover && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 overflow-auto"
          onClick={closeModal}
        >
          <div
            className="relative max-w-4xl w-full flex flex-col items-center py-8"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close button - positioned inside viewport */}
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-white hover:text-red-600 transition-colors cursor-pointer text-3xl font-bold w-10 h-10 flex items-center justify-center rounded-full bg-black/50 hover:bg-black/70 z-10"
              aria-label="Close"
            >
              ×
            </button>

            {/* Cover image */}
            <div className="relative w-full max-w-md aspect-[3/4] mb-6">
              <img
                src={selectedCover.src}
                alt={selectedCover.alt}
                className="w-full h-full object-contain rounded-xl shadow-2xl"
                style={{
                  boxShadow: "0 40px 100px rgba(0, 0, 0, 0.8)",
                }}
              />
            </div>

            {/* Title */}
            <h3 
              className="text-3xl md:text-4xl font-black text-white mb-2"
              style={{ fontFamily: "var(--font-bebas-neue), sans-serif" }}
            >
              {selectedCover.title}
            </h3>

            {/* Click outside hint */}
            <p className="text-sm text-white/60 mt-2">Click outside to close</p>
          </div>
        </div>
      )}
    </section>
  )
}
