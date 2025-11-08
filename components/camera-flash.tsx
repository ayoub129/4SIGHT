"use client"

import { useEffect, useState } from "react"

export function CameraFlash() {
  const [stage, setStage] = useState(0)

  useEffect(() => {
    const timings = [
      { delay: 300, stage: 1 },
      { delay: 1400, stage: 2 },
      { delay: 2200, stage: 3 }, // Flash happens, start zoom out
      { delay: 3600, stage: 4 }, // Photographer appears with camera
      { delay: 5000, stage: 5 }, // Start walking
      { delay: 6500, stage: 6 }, // Throw cards
      { delay: 7500, stage: 7 }, // Cards start falling
    ]

    timings.forEach(({ delay, stage }) => {
      setTimeout(() => setStage(stage), delay)
    })
  }, [])

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black overflow-hidden">
      {/* STAGE 1-2: Camera Lens with Flash - using SVG */}
      <div 
        className="relative" 
        style={{ 
          perspective: "1000px",
          transform: stage >= 3 ? "scale(0.02) translateY(350px) translateX(0px)" : "scale(1)",
          transition: stage === 3 ? "all 1.4s cubic-bezier(0.34, 1.56, 0.64, 1)" : "none",
          opacity: stage >= 4 ? 0 : 1,
        }}
      >
        {/* Camera SVG */}
        <div
          className="absolute transition-all duration-700 ease-out"
          style={{
            width: "240px",
            height: "240px",
            left: "-120px",
            top: "-120px",
            transform: `scale(${stage >= 1 ? 3 : 0.03})`,
            opacity: stage >= 1 && stage <= 2 ? 1 : 0,
          }}
        >
          <img
            src="/cards-cover/camera drawing.svg"
            alt="Camera"
            className="w-full h-full object-contain"
            style={{
              filter: "drop-shadow(0 0 20px rgba(255,255,255,0.3))",
            }}
          />
        </div>

        {/* Flash burst - closer to camera lens */}
        {stage === 2 && (
          <>
            <div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "120px",
                height: "120px",
                background:
                  "radial-gradient(circle, rgba(255,255,255,1) 0%, rgba(255,255,255,0.8) 15%, rgba(200,220,255,0.4) 40%, transparent 70%)",
                boxShadow:
                  "0 0 80px rgba(255,255,255,1), 0 0 150px rgba(200,220,255,0.9), inset 0 0 50px rgba(255,255,255,0.95)",
                animation: "flashExplosion 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
              }}
            />

            <div
              className="absolute left-1/2 top-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-full"
              style={{
                width: "100px",
                height: "100px",
                background: "radial-gradient(circle, rgba(255,255,255,0.8) 0%, transparent 50%)",
                filter: "blur(20px)",
                animation: "flashGlow 0.8s ease-out forwards",
              }}
            />
          </>
        )}
      </div>

      {/* STAGE 4-7: Photographer with realistic walking animation */}
      {stage >= 4 && (
        <div
          className="absolute"
          style={{
            animation: stage === 4 ? "fadeInPhotographer 0.5s ease-in forwards" : "none",
            opacity: stage >= 4 ? 1 : 0,
          }}
        >
          <div
            style={{
              animation: stage >= 5 ? "walkSequence 4s cubic-bezier(0.25, 0.46, 0.45, 0.94) forwards" : "none",
            }}
          >
            <svg
              width="220"
              height="320"
              viewBox="0 0 220 320"
              className="drop-shadow-2xl"
              style={{
                filter: "drop-shadow(0 30px 60px rgba(0,0,0,0.7))",
              }}
            >
              {/* Legs with realistic walking animation - more natural proportions */}
              <g id="legs">
                {/* Left leg - thigh */}
                <ellipse
                  cx="100"
                  cy="200"
                  rx="12"
                  ry="35"
                  fill="#D4A574"
                  style={{
                    animation: stage >= 5 ? "leftLegWalk 1.2s ease-in-out infinite" : "none",
                    transformOrigin: "100px 165px",
                  }}
                />
                {/* Left calf */}
                <ellipse
                  cx="98"
                  cy="260"
                  rx="10"
                  ry="30"
                  fill="#C49564"
                  style={{
                    animation: stage >= 5 ? "leftLegWalk 1.2s ease-in-out infinite" : "none",
                    transformOrigin: "100px 165px",
                  }}
                />
                {/* Left shoe */}
                <ellipse
                  cx="97"
                  cy="300"
                  rx="12"
                  ry="8"
                  fill="#2A2A2A"
                  style={{
                    animation: stage >= 5 ? "leftLegWalk 1.2s ease-in-out infinite" : "none",
                    transformOrigin: "100px 165px",
                  }}
                />

                {/* Right leg - thigh */}
                <ellipse
                  cx="120"
                  cy="200"
                  rx="12"
                  ry="35"
                  fill="#D4A574"
                  style={{
                    animation: stage >= 5 ? "rightLegWalk 1.2s ease-in-out infinite" : "none",
                    transformOrigin: "120px 165px",
                  }}
                />
                {/* Right calf */}
                <ellipse
                  cx="122"
                  cy="260"
                  rx="10"
                  ry="30"
                  fill="#C49564"
                  style={{
                    animation: stage >= 5 ? "rightLegWalk 1.2s ease-in-out infinite" : "none",
                    transformOrigin: "120px 165px",
                  }}
                />
                {/* Right shoe */}
                <ellipse
                  cx="123"
                  cy="300"
                  rx="12"
                  ry="8"
                  fill="#2A2A2A"
                  style={{
                    animation: stage >= 5 ? "rightLegWalk 1.2s ease-in-out infinite" : "none",
                    transformOrigin: "120px 165px",
                  }}
                />
              </g>

              {/* Torso with normal clothing - casual look */}
              <g id="torso">
                {/* Torso body */}
                <ellipse cx="110" cy="160" rx="28" ry="50" fill="#E8D5B7" />
                
                {/* Shirt/top */}
                <ellipse cx="110" cy="160" rx="25" ry="45" fill="#F5E6D3" />
                
                {/* Waist area */}
                <ellipse cx="110" cy="195" rx="20" ry="8" fill="#D4C4A5" />

                {/* Simple clothing details */}
                <line x1="110" y1="140" x2="110" y2="180" stroke="#C4B4A5" strokeWidth="1.5" opacity="0.4" />
              </g>

              {/* Arms - one holding camera, one for throwing cards */}
              <g id="arms">
                {/* Left upper arm - holding camera */}
                <ellipse
                  cx="90"
                  cy="140"
                  rx="10"
                  ry="25"
                  fill="#D4A574"
                  style={{
                    transform: "rotate(-15deg)",
                    transformOrigin: "90px 140px",
                  }}
                />
                {/* Left forearm */}
                <ellipse
                  cx="75"
                  cy="150"
                  rx="8"
                  ry="20"
                  fill="#C49564"
                  style={{
                    transform: "rotate(-25deg)",
                    transformOrigin: "75px 150px",
                  }}
                />
                {/* Left hand holding camera */}
                <ellipse cx="68" cy="165" rx="7" ry="9" fill="#D4A574" />

                {/* Right upper arm - for throwing cards */}
                <ellipse
                  cx="130"
                  cy="140"
                  rx="10"
                  ry="25"
                  fill="#D4A574"
                  style={{
                    animation: stage === 6 ? "throwCardsUpper 1s ease-out forwards" : "none",
                    transform: stage >= 5 ? "rotate(10deg)" : "rotate(0deg)",
                    transformOrigin: "130px 140px",
                  }}
                />
                {/* Right forearm */}
                <ellipse
                  cx="145"
                  cy="150"
                  rx="8"
                  ry="20"
                  fill="#C49564"
                  style={{
                    animation: stage === 6 ? "throwCardsForearm 1s ease-out forwards" : "none",
                    transform: stage >= 5 ? "rotate(25deg)" : "rotate(0deg)",
                    transformOrigin: "145px 150px",
                  }}
                />
                {/* Right hand */}
                <ellipse cx="152" cy="165" rx="7" ry="9" fill="#D4A574" />
              </g>

              {/* Camera in hands - using camera drawing SVG */}
              <g id="camera" style={{ transform: "translateX(-10px) translateY(10px)" }}>
                <image
                  href="/cards-cover/camera drawing.svg"
                  x="50"
                  y="145"
                  width="50"
                  height="35"
                  preserveAspectRatio="xMidYMid meet"
                />
              </g>

              {/* Neck connection */}
              <ellipse cx="110" cy="110" rx="8" ry="12" fill="#D4A574" />

              {/* Head with realistic, normal human features */}
              <g id="head">
                {/* Face shape - more natural proportions */}
                <ellipse cx="110" cy="85" rx="22" ry="26" fill="#F5E6D3" />

                {/* Hair - normal, natural style */}
                <ellipse cx="110" cy="55" rx="24" ry="20" fill="#4A3A2A" />
                <ellipse cx="95" cy="60" rx="12" ry="15" fill="#4A3A2A" />
                <ellipse cx="125" cy="60" rx="12" ry="15" fill="#4A3A2A" />
                <ellipse cx="110" cy="45" rx="18" ry="12" fill="#4A3A2A" />

                {/* Eyes - normal, realistic */}
                <ellipse cx="102" cy="80" rx="5" ry="6" fill="#1A1A1A" />
                <ellipse cx="118" cy="80" rx="5" ry="6" fill="#1A1A1A" />

                {/* Eye shine */}
                <ellipse cx="103" cy="78" rx="2" ry="2.5" fill="white" opacity="0.9" />
                <ellipse cx="119" cy="78" rx="2" ry="2.5" fill="white" opacity="0.9" />

                {/* Eyebrows */}
                <path
                  d="M 97 73 Q 102 71 107 73"
                  stroke="#3A2A1A"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />
                <path
                  d="M 113 73 Q 118 71 123 73"
                  stroke="#3A2A1A"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Nose - subtle */}
                <ellipse cx="110" cy="88" rx="3" ry="4" fill="#E8D5B7" opacity="0.6" />
                <path d="M 110 85 L 110 92" stroke="#D4C4A5" strokeWidth="2" strokeLinecap="round" opacity="0.5" />

                {/* Mouth - natural */}
                <path
                  d="M 105 96 Q 110 98 115 96"
                  stroke="#C4A494"
                  strokeWidth="2.5"
                  fill="none"
                  strokeLinecap="round"
                />

                {/* Facial shading for depth */}
                <ellipse cx="95" cy="85" rx="6" ry="10" fill="#000" opacity="0.08" />
                <ellipse cx="125" cy="85" rx="6" ry="10" fill="#000" opacity="0.08" />
              </g>

              {/* Defs for gradients */}
              <defs>
                <radialGradient id="lensGradient">
                  <stop offset="0%" stopColor="#7a8a9a" />
                  <stop offset="40%" stopColor="#5a7a8a" />
                  <stop offset="100%" stopColor="#2a4a6a" />
                </radialGradient>
              </defs>
            </svg>
          </div>
        </div>
      )}

      {/* Cards being thrown from hand - magician animation */}
      {stage === 6 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(12)].map((_, i) => {
            const suits = ['♣', '♠', '♥', '♦']
            const suit = suits[i % 4]
            const colors = ['#ffffff', '#ffffff', '#ff6b6b', '#ff6b6b'] // black for clubs/spades, red for hearts/diamonds
            const color = colors[i % 4]
            const spreadAngle = (i * 20) - 110 // spread cards from -110 to 110 degrees
            const xOffset = Math.sin((spreadAngle * Math.PI) / 180) * 200
            const yOffset = -Math.cos((spreadAngle * Math.PI) / 180) * 300
            
              return (
                <div
                  key={`thrown-${i}`}
                  className="absolute w-14 h-20"
                  style={{
                    left: "75%",
                    top: "55%",
                    animation: `cardThrowSpread ${0.8 + i * 0.05}s cubic-bezier(0.4, 0.0, 0.2, 1) forwards`,
                    animationDelay: `${i * 0.08}s`,
                    transformOrigin: "center center",
                    '--throw-x': `${xOffset}px`,
                    '--throw-y': `${yOffset}px`,
                    '--throw-angle': `${spreadAngle}deg`,
                  } as React.CSSProperties}
                >
                  <div className="w-full h-full border-2 border-white/60 rounded-sm flex items-center justify-center bg-white/10 backdrop-blur-sm">
                    <span className="text-base font-bold" style={{ color }}>{suit}</span>
                  </div>
                </div>
              )
            })}
        </div>
      )}

      {/* Falling cards after being thrown */}
      {stage >= 7 && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(24)].map((_, i) => {
            const suits = ['♣', '♠', '♥', '♦']
            const suit = suits[i % 4]
            const colors = ['#ffffff', '#ffffff', '#ff6b6b', '#ff6b6b'] // black for clubs/spades, red for hearts/diamonds
            const color = colors[i % 4]
            const startLeft = 20 + (i % 12) * 6 + Math.random() * 30
            
            return (
              <div
                key={`falling-${i}`}
                className="absolute w-14 h-20"
                style={{
                  left: `${startLeft}%`,
                  top: "-100px",
                  animation: `cardFall ${4 + i * 0.15}s cubic-bezier(0.25, 0.46, 0.45, 0.94) infinite`,
                  animationDelay: `${i * 0.1}s`,
                  transform: `rotateZ(${Math.random() * 360}deg)`,
                }}
              >
                <div className="w-full h-full border-2 border-white/40 rounded-sm flex items-center justify-center bg-white/5">
                  <span className="text-base font-bold" style={{ color }}>{suit}</span>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {/* 4SIGHT text */}
      <div
        className="absolute bottom-16 text-center transition-all duration-500"
        style={{
          opacity: stage >= 1 ? 1 : 0,
        }}
      >
        <p className="text-white text-sm font-light tracking-widest">4SIGHT</p>
        {stage >= 3 && (
          <p className="text-gray-400 text-xs font-light tracking-widest mt-1 animate-pulse">THE HANDS OF CHANCE</p>
        )}
      </div>

      <style jsx>{`
        @keyframes flashExplosion {
          0% {
            transform: translate(-50%, -50%) scale(0.9);
            opacity: 1;
          }
          40% {
            transform: translate(-50%, -50%) scale(1);
            opacity: 1;
          }
          100% {
            transform: translate(-50%, -50%) scale(1.3);
            opacity: 0;
          }
        }

        @keyframes flashGlow {
          0% {
            opacity: 1;
            filter: blur(10px);
          }
          100% {
            opacity: 0;
            filter: blur(40px);
          }
        }

        /* Fade in photographer with camera */
        @keyframes fadeInPhotographer {
          0% {
            opacity: 0;
            transform: scale(0.9);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }

        /* Photographer walks 2 steps from left to right */
        @keyframes walkSequence {
          0% {
            transform: translateX(-400px);
            opacity: 1;
          }
          20% {
            transform: translateX(-100px);
          }
          40% {
            transform: translateX(100px);
          }
          60% {
            transform: translateX(300px);
          }
          100% {
            transform: translateX(400px);
            opacity: 1;
          }
        }

        /* Card throwing animation with spread effect */
        @keyframes cardThrowSpread {
          0% {
            transform: translate(0, 0) rotateZ(0deg) scale(0.8);
            opacity: 0.8;
          }
          30% {
            transform: translate(var(--throw-x, 0px), var(--throw-y, -300px)) rotateZ(var(--throw-angle, 0deg)) scale(1);
            opacity: 1;
          }
          60% {
            transform: translate(var(--throw-x, 0px), var(--throw-y, -300px)) rotateZ(var(--throw-angle, 0deg)) scale(1);
            opacity: 0.9;
          }
          100% {
            transform: translate(var(--throw-x, 0px), calc(var(--throw-y, -300px) - 200px)) rotateZ(var(--throw-angle, 0deg)) scale(1.2);
            opacity: 0;
          }
        }

        /* Arm throwing cards animation */
        @keyframes throwCardsUpper {
          0% {
            transform: rotate(10deg);
          }
          50% {
            transform: rotate(-50deg);
          }
          100% {
            transform: rotate(10deg);
          }
        }

        @keyframes throwCardsForearm {
          0% {
            transform: rotate(25deg);
          }
          50% {
            transform: rotate(-80deg);
          }
          100% {
            transform: rotate(25deg);
          }
        }

        /* Left leg walking motion - smoother */
        @keyframes leftLegWalk {
          0% {
            transform: rotateZ(-30deg);
          }
          25% {
            transform: rotateZ(20deg);
          }
          50% {
            transform: rotateZ(-30deg);
          }
          75% {
            transform: rotateZ(20deg);
          }
          100% {
            transform: rotateZ(-30deg);
          }
        }

        /* Right leg opposite for natural walking */
        @keyframes rightLegWalk {
          0% {
            transform: rotateZ(30deg);
          }
          25% {
            transform: rotateZ(-20deg);
          }
          50% {
            transform: rotateZ(30deg);
          }
          75% {
            transform: rotateZ(-20deg);
          }
          100% {
            transform: rotateZ(30deg);
          }
        }

        @keyframes cardFall {
          0% {
            transform: translateY(-100px) rotateZ(-25deg);
            opacity: 0.3;
          }
          10% {
            opacity: 0.2;
          }
          50% {
            opacity: 0.12;
            transform: translateY(350px) rotateZ(10deg);
          }
          100% {
            transform: translateY(900px) rotateZ(45deg);
            opacity: 0;
          }
        }
      `}</style>
    </div>
  )
}
