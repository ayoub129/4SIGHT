"use client"

import { useEffect, useState } from "react"

type CardColor = "red" | "yellow" | "white"

export function RandomCardDrop() {
  const [cards, setCards] = useState<Array<{ id: number; color: CardColor; left: number; delay: number }>>([])

  useEffect(() => {
    // 10% chance to drop a card
    const shouldDrop = Math.random() < 0.1

    if (shouldDrop) {
      const cardColor: CardColor = Math.random() < 0.33 ? "red" : Math.random() < 0.66 ? "yellow" : "white"
      const left = Math.random() * 100 // Random horizontal position
      const delay = Math.random() * 2 // Random delay

      const newCard = {
        id: Date.now(),
        color: cardColor,
        left,
        delay,
      }

      setCards([newCard])

      // Remove card after animation
      setTimeout(() => {
        setCards([])
      }, 5000)
    }
  }, [])

  if (cards.length === 0) return null

  return (
    <>
      <div className="fixed top-0 left-0 w-full h-full pointer-events-none z-50">
        {cards.map((card) => (
          <div
            key={card.id}
            className="absolute w-16 h-24 border-2 rounded-sm shadow-2xl"
            style={{
              left: `${card.left}%`,
              animation: `fall 3s linear ${card.delay}s forwards`,
              backgroundColor:
                card.color === "red"
                  ? "#ef4444"
                  : card.color === "yellow"
                    ? "#eab308"
                    : "#ffffff",
              borderColor:
                card.color === "red"
                  ? "#dc2626"
                  : card.color === "yellow"
                    ? "#ca8a04"
                    : "#000000",
            }}
          />
        ))}
      </div>
    </>
  )
}

