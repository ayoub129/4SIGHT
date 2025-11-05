"use client"

import { useEffect, useRef } from "react"

interface Card {
  id: number
  x: number
  y: number
  rotation: number
  scale: number
  vx: number
  vy: number
  size: "sm" | "md" | "lg"
}

export function FloatingCards() {
  const containerRef = useRef<HTMLDivElement>(null)
  const cardsRef = useRef<Card[]>([])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // Initialize cards
    cardsRef.current = Array.from({ length: 15 }, (_, i) => ({
      id: i,
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      rotation: Math.random() * 360,
      scale: 0.3 + Math.random() * 0.4,
      vx: (Math.random() - 0.5) * 0.5,
      vy: (Math.random() - 0.5) * 0.5,
      size: (["sm", "md", "lg"] as const)[Math.floor(Math.random() * 3)],
    }))

    let animationId: number

    const animate = () => {
      cardsRef.current.forEach((card) => {
        card.x += card.vx
        card.y += card.vy
        card.rotation += 0.5

        // Wrap around screen
        if (card.x > window.innerWidth + 100) card.x = -100
        if (card.x < -100) card.x = window.innerWidth + 100
        if (card.y > window.innerHeight + 100) card.y = -100
        if (card.y < -100) card.y = window.innerHeight + 100
      })

      animationId = requestAnimationFrame(animate)
    }

    animate()

    return () => cancelAnimationFrame(animationId)
  }, [])

  const sizeMap = {
    sm: "w-12 h-16",
    md: "w-16 h-24",
    lg: "w-20 h-32",
  }

  return (
    <div ref={containerRef} className="fixed inset-0 pointer-events-none overflow-hidden">
      {cardsRef.current.map((card) => (
        <div
          key={card.id}
          className={`absolute ${sizeMap[card.size]} opacity-10 transition-none`}
          style={{
            left: `${card.x}px`,
            top: `${card.y}px`,
            transform: `rotate(${card.rotation}deg) scale(${card.scale})`,
            transformOrigin: "center",
          }}
        >
          <div className="w-full h-full border-2 border-foreground rounded-sm bg-muted/30" />
        </div>
      ))}
    </div>
  )
}
