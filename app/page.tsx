"use client"

import { useState, useEffect } from "react"
import { CameraFlash } from "@/components/camera-flash"
import { FallingCards } from "@/components/falling-cards"
import { HeroSection } from "@/components/hero-section"
import { BookShowcase } from "@/components/book-showcase"
import { StorySection } from "@/components/story-section"
import { CTASection } from "@/components/cta-section"
import { Footer } from "@/components/footer"

export default function Home() {
  const [showContent, setShowContent] = useState(false)

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowContent(true)
    }, 3200)

    return () => clearTimeout(timer)
  }, [])

  return (
    <main className="relative min-h-screen overflow-x-hidden bg-background text-foreground">
      {/* Falling cards background */}
      <FallingCards />

      {/* Camera flash animation - only show until content appears */}
      {!showContent && <CameraFlash />}

      {/* Main content */}
      <div
        className={`transition-opacity duration-1000 ${showContent ? "opacity-100" : "opacity-0 pointer-events-none"}`}
      >
        <HeroSection />
        <BookShowcase />
        <StorySection />
        <CTASection />
        <Footer />
      </div>
    </main>
  )
}
