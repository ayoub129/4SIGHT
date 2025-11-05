"use client"

import { useEffect, useState } from "react"

interface FallingCard {
  id: number
  left: number
  delay: number
  duration: number
  rotation: number
  suit?: string
  color?: string
}

export function FallingCards() {
  const [cards, setCards] = useState<FallingCard[]>([])

  useEffect(() => {
    const suits = ['♣', '♠', '♥', '♦']
    const generatedCards: FallingCard[] = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 2,
      duration: 6 + Math.random() * 4,
      rotation: Math.random() * 360,
      suit: suits[i % 4],
      color: i % 4 < 2 ? '#ffffff' : '#ff6b6b', // black for clubs/spades, red for hearts/diamonds
    }))

    setCards(generatedCards)
  }, [])

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden">
      {cards.map((card) => (
        <div
          key={card.id}
          className="absolute w-16 h-24 opacity-30"
          style={{
            left: `${card.left}%`,
            top: "-100px",
            animation: `cardFall ${card.duration}s linear ${card.delay}s infinite`,
            transform: `rotateZ(${card.rotation}deg)`,
          }}
        >
          {/* Card design */}
          <div
            className="w-full h-full border-2 border-foreground/40 rounded-sm bg-transparent flex items-center justify-center relative"
            style={{
              backfaceVisibility: "hidden",
            }}
          >
            {/* Card symbol - different suits */}
            <div className="text-lg font-bold" style={{ color: card.color || '#ffffff' }}>
              {card.suit || '♣'}
            </div>

            {/* Card corner numbers */}
            <div className="absolute top-1 left-1 text-xs font-bold text-foreground/40">4</div>
            <div className="absolute bottom-1 right-1 text-xs font-bold text-foreground/40 transform rotate-180">4</div>
          </div>
        </div>
      ))}

      <style jsx>{`
        @keyframes cardFall {
          0% {
            transform: translateY(-100px) rotateZ(var(--rotation, 0deg));
            opacity: 0;
          }
          10% {
            opacity: 0.3;
          }
          90% {
            opacity: 0.3;
          }
          100% {
            transform: translateY(100vh) rotateZ(var(--rotation, 0deg));
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
