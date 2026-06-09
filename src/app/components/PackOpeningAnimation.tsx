import { useEffect, useState } from "react";
import type { Card, Pack } from "./types";
import { RARITY_STYLES } from "./cardData";
import { CardDisplay } from "./CardDisplay";

interface PackOpeningAnimationProps {
  pack: Pack;
  cards: Card[];
  onComplete: () => void;
}

type Phase = "rip" | "reveal" | "done";

export function PackOpeningAnimation({ pack, cards, onComplete }: PackOpeningAnimationProps) {
  const [phase, setPhase] = useState<Phase>("rip");
  const [revealedIndex, setRevealedIndex] = useState(-1);
  const [flippedCards, setFlippedCards] = useState<boolean[]>(cards.map(() => false));
  const [particles, setParticles] = useState<{ id: number; x: number; y: number; color: string; angle: number }[]>([]);

  useEffect(() => {
    const t = setTimeout(() => setPhase("reveal"), 1200);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    if (phase !== "reveal") return;
    if (revealedIndex < cards.length - 1) {
      const t = setTimeout(() => setRevealedIndex(i => i + 1), 600);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => setPhase("done"), 400);
      return () => clearTimeout(t);
    }
  }, [phase, revealedIndex, cards.length]);

  useEffect(() => {
    if (revealedIndex < 0) return;
    const card = cards[revealedIndex];
    const style = RARITY_STYLES[card.rarity];
    const newParticles = Array.from({ length: 16 }, (_, i) => ({
      id: Date.now() + i,
      x: 50 + Math.random() * 200 - 100,
      y: 50 + Math.random() * 200 - 100,
      color: style.color,
      angle: (i / 16) * 360,
    }));
    setParticles(newParticles);
    const t = setTimeout(() => setParticles([]), 900);

    // Flip the card
    setFlippedCards(prev => {
      const next = [...prev];
      next[revealedIndex] = true;
      return next;
    });

    return () => clearTimeout(t);
  }, [revealedIndex]);

  return (
    <div style={{
      position: "fixed",
      inset: 0,
      background: "rgba(0,0,0,0.95)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 2000,
      gap: "40px",
    }}>
      {/* Pack rip phase */}
      {phase === "rip" && (
        <div style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "24px",
          animation: "packRip 1.1s ease-in-out forwards",
        }}>
          <div style={{ fontSize: "100px", animation: "packShake 0.3s ease infinite" }}>{pack.emoji}</div>
          <div style={{
            fontSize: "18px",
            fontWeight: 700,
            color: pack.glowColor,
            letterSpacing: "0.15em",
            textShadow: `0 0 20px ${pack.glowColor}`,
            animation: "pulseText 0.5s ease infinite",
          }}>
            OPENING {pack.name.toUpperCase()}...
          </div>
        </div>
      )}

      {/* Card reveal phase */}
      {(phase === "reveal" || phase === "done") && (
        <>
          <div style={{
            fontSize: "22px",
            fontWeight: 800,
            color: "#E2E8F0",
            letterSpacing: "0.05em",
          }}>
            You got:
          </div>

          {/* Particle effects */}
          <div style={{ position: "fixed", inset: 0, pointerEvents: "none", zIndex: 2001 }}>
            {particles.map(p => (
              <div key={p.id} style={{
                position: "absolute",
                left: "50%",
                top: "50%",
                width: "8px",
                height: "8px",
                borderRadius: "50%",
                background: p.color,
                boxShadow: `0 0 8px ${p.color}`,
                animation: `particleBurst 0.8s ease-out forwards`,
                "--px": `${p.x}px`,
                "--py": `${p.y}px`,
              } as any} />
            ))}
          </div>

          <div style={{
            display: "flex",
            gap: "16px",
            flexWrap: "wrap",
            justifyContent: "center",
            maxWidth: "900px",
            padding: "0 24px",
          }}>
            {cards.map((card, i) => (
              <div
                key={i}
                style={{
                  opacity: i <= revealedIndex ? 1 : 0.15,
                  transition: "opacity 0.4s ease",
                  position: "relative",
                }}
              >
                {/* Card flip wrapper */}
                <div style={{
                  perspective: "600px",
                }}>
                  <div style={{
                    transition: "transform 0.6s ease",
                    transformStyle: "preserve-3d",
                    transform: flippedCards[i] ? "rotateY(0deg)" : "rotateY(90deg)",
                  }}>
                    <CardDisplay card={card} isNew={i === revealedIndex} />
                  </div>
                </div>

                {/* Rarity label pop */}
                {flippedCards[i] && (
                  <div style={{
                    textAlign: "center",
                    marginTop: "8px",
                    fontSize: "11px",
                    fontWeight: 700,
                    color: RARITY_STYLES[card.rarity].color,
                    textShadow: `0 0 12px ${RARITY_STYLES[card.rarity].color}`,
                    animation: "fadeInUp 0.4s ease",
                    letterSpacing: "0.1em",
                  }}>
                    {RARITY_STYLES[card.rarity].label}
                  </div>
                )}
              </div>
            ))}
          </div>

          {phase === "done" && (
            <button
              onClick={onComplete}
              style={{
                padding: "14px 40px",
                borderRadius: "12px",
                border: "none",
                background: `linear-gradient(135deg, ${pack.gradientFrom}, ${pack.gradientTo})`,
                color: "#fff",
                fontSize: "16px",
                fontWeight: 700,
                cursor: "pointer",
                boxShadow: `0 8px 24px ${pack.glowColor}40`,
                animation: "fadeInUp 0.5s ease",
                marginTop: "8px",
              }}
            >
              Add to Album →
            </button>
          )}
        </>
      )}

      <style>{`
        @keyframes packRip {
          0% { transform: scale(1); opacity: 1; }
          60% { transform: scale(1.3) rotate(-5deg); opacity: 1; }
          100% { transform: scale(0) rotate(15deg); opacity: 0; }
        }
        @keyframes packShake {
          0%, 100% { transform: rotate(-3deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes pulseText {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.6; }
        }
        @keyframes particleBurst {
          0% { transform: translate(-50%, -50%) scale(1); opacity: 1; }
          100% { transform: translate(calc(-50% + var(--px)), calc(-50% + var(--py))) scale(0); opacity: 0; }
        }
        @keyframes fadeInUp {
          0% { opacity: 0; transform: translateY(10px); }
          100% { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}
