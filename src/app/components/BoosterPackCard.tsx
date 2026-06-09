import { useRef, useState } from "react";
import type { Pack } from "./types";
import { RARITY_STYLES } from "./cardData";

interface BoosterPackCardProps {
  pack: Pack;
  onBuy: (pack: Pack) => void;
}

export function BoosterPackCard({ pack, onBuy }: BoosterPackCardProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const [oddsOpen, setOddsOpen] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -10, y: dx * 10 });
  };

  return (
    <div style={{ perspective: "1000px", position: "relative" }}>
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setTilt({ x: 0, y: 0 }); setHovered(false); }}
        style={{
          width: "280px",
          borderRadius: "20px",
          border: `2px solid ${hovered ? pack.glowColor : "#2a2f3e"}`,
          background: `linear-gradient(145deg, ${pack.gradientFrom}22, #1F2833, #0B0C10)`,
          boxShadow: hovered
            ? `0 0 32px ${pack.glowColor}60, 0 0 64px ${pack.glowColor}30, 0 24px 48px rgba(0,0,0,0.7)`
            : "0 8px 32px rgba(0,0,0,0.5)",
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered ? 1.04 : 1})`,
          transition: hovered ? "box-shadow 0.2s, border-color 0.2s" : "transform 0.5s ease, box-shadow 0.5s ease",
          padding: "28px 24px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: "16px",
          cursor: "default",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Shimmer overlay */}
        <div style={{
          position: "absolute", inset: 0, borderRadius: "18px",
          background: `linear-gradient(135deg, transparent 30%, ${pack.gradientFrom}15 50%, transparent 70%)`,
          backgroundSize: "200% 200%",
          animation: "packShimmer 4s ease infinite",
          pointerEvents: "none",
        }} />

        {/* Pack emoji art */}
        <div style={{
          fontSize: "72px",
          lineHeight: 1,
          filter: hovered ? `drop-shadow(0 0 20px ${pack.glowColor})` : "none",
          transition: "filter 0.3s",
          zIndex: 1,
        }}>
          {pack.emoji}
        </div>

        {/* Pack name */}
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div style={{
            fontSize: "20px",
            fontWeight: 800,
            color: "#E2E8F0",
            marginBottom: "4px",
            letterSpacing: "0.02em",
          }}>
            {pack.name}
          </div>
          <div style={{ fontSize: "13px", color: "#94A3B8" }}>{pack.subtitle}</div>
        </div>

        {/* Price */}
        <div style={{
          fontSize: "28px",
          fontWeight: 900,
          color: pack.glowColor,
          textShadow: `0 0 16px ${pack.glowColor}`,
          zIndex: 1,
        }}>
          {pack.priceDisplay}
        </div>

        {/* Cards per pack */}
        <div style={{ fontSize: "12px", color: "#64748B", zIndex: 1 }}>
          {pack.cardsPerPack} cards per pack
        </div>

        {/* Buttons */}
        <div style={{ display: "flex", gap: "10px", width: "100%", zIndex: 1 }}>
          <button
            onClick={() => setOddsOpen(!oddsOpen)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: `1px solid ${pack.glowColor}60`,
              background: "transparent",
              color: pack.glowColor,
              fontSize: "13px",
              fontWeight: 600,
              cursor: "pointer",
              transition: "background 0.2s",
            }}
            onMouseEnter={e => (e.currentTarget.style.background = `${pack.glowColor}20`)}
            onMouseLeave={e => (e.currentTarget.style.background = "transparent")}
          >
            View Odds
          </button>
          <button
            onClick={() => onBuy(pack)}
            style={{
              flex: 1,
              padding: "10px",
              borderRadius: "8px",
              border: "none",
              background: `linear-gradient(135deg, ${pack.gradientFrom}, ${pack.gradientTo})`,
              color: "#fff",
              fontSize: "13px",
              fontWeight: 700,
              cursor: "pointer",
              boxShadow: `0 4px 16px ${pack.glowColor}40`,
              transition: "transform 0.15s, box-shadow 0.15s",
            }}
            onMouseEnter={e => { e.currentTarget.style.transform = "scale(1.04)"; }}
            onMouseLeave={e => { e.currentTarget.style.transform = "scale(1)"; }}
          >
            Buy Pack
          </button>
        </div>

        {/* Odds dropdown */}
        {oddsOpen && (
          <div style={{
            width: "100%",
            borderRadius: "10px",
            border: `1px solid #2a2f3e`,
            background: "#0d1117",
            padding: "14px",
            zIndex: 1,
          }}>
            <div style={{ fontSize: "11px", fontWeight: 700, color: "#64748B", letterSpacing: "0.1em", marginBottom: "10px" }}>
              DROP RATES
            </div>
            {pack.odds.map(({ rarity, percent }) => {
              const rs = RARITY_STYLES[rarity];
              return (
                <div key={rarity} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: rs.color }} />
                    <span style={{ fontSize: "13px", color: rs.color, fontWeight: 600 }}>{rarity}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "80px", height: "6px", borderRadius: "3px", background: "#1F2833", overflow: "hidden" }}>
                      <div style={{ width: `${percent}%`, height: "100%", background: rs.color, borderRadius: "3px" }} />
                    </div>
                    <span style={{ fontSize: "13px", color: "#94A3B8", fontWeight: 600, width: "36px", textAlign: "right" }}>{percent}%</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <style>{`
        @keyframes packShimmer {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </div>
  );
}
