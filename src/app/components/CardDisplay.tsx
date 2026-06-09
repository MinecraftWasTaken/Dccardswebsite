import { useRef, useState } from "react";
import type { Card } from "./types";
import { RARITY_STYLES } from "./cardData";

interface CardDisplayProps {
  card: Card;
  count?: number;
  isNew?: boolean;
  dimmed?: boolean;
  small?: boolean;
}

export function CardDisplay({ card, count, isNew, dimmed, small }: CardDisplayProps) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [hovered, setHovered] = useState(false);
  const style = RARITY_STYLES[card.rarity];
  const isHolo = card.rarity === "Epic" || card.rarity === "Legendary";

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = (e.clientX - cx) / (rect.width / 2);
    const dy = (e.clientY - cy) / (rect.height / 2);
    setTilt({ x: dy * -12, y: dx * 12 });
  };

  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
    setHovered(false);
  };

  const w = small ? "120px" : "160px";
  const h = small ? "170px" : "220px";

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{
        width: w,
        height: h,
        perspective: "800px",
        cursor: dimmed ? "default" : "pointer",
        position: "relative",
        flexShrink: 0,
      }}
    >
      <div
        style={{
          width: "100%",
          height: "100%",
          borderRadius: "12px",
          border: `2px solid ${dimmed ? "#374151" : style.border}`,
          background: dimmed
            ? "linear-gradient(145deg, #1a1f2e, #111827)"
            : `linear-gradient(145deg, #1F2833, #0B0C10)`,
          boxShadow: hovered && !dimmed
            ? `0 0 24px ${style.glow}, 0 0 48px ${style.glow}40, 0 20px 40px rgba(0,0,0,0.6)`
            : `0 4px 16px rgba(0,0,0,0.4)`,
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y}deg) scale(${hovered && !dimmed ? 1.06 : 1})`,
          transition: hovered ? "box-shadow 0.15s, border-color 0.15s" : "transform 0.4s ease, box-shadow 0.4s ease",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "space-between",
          padding: small ? "10px 8px" : "14px 10px",
          position: "relative",
          filter: dimmed ? "grayscale(100%) brightness(0.35)" : "none",
        }}
      >
        {/* Holographic shimmer overlay */}
        {isHolo && !dimmed && (
          <div
            style={{
              position: "absolute",
              inset: 0,
              borderRadius: "10px",
              background: "linear-gradient(135deg, transparent 20%, rgba(255,255,255,0.08) 40%, transparent 60%, rgba(255,255,255,0.06) 80%, transparent 100%)",
              backgroundSize: "200% 200%",
              animation: "holoShimmer 3s ease infinite",
              pointerEvents: "none",
              zIndex: 2,
            }}
          />
        )}

        {/* Rarity badge */}
        <div
          style={{
            fontSize: small ? "9px" : "10px",
            fontWeight: 800,
            letterSpacing: "0.15em",
            color: dimmed ? "#4B5563" : style.color,
            fontFamily: "monospace",
            alignSelf: "flex-start",
          }}
        >
          {style.label}
        </div>

        {/* Emoji art */}
        <div
          style={{
            fontSize: small ? "36px" : "52px",
            lineHeight: 1,
            filter: hovered && !dimmed ? `drop-shadow(0 0 12px ${style.color})` : "none",
            transition: "filter 0.2s",
            zIndex: 1,
          }}
        >
          {dimmed ? "❓" : card.emoji}
        </div>

        {/* Card name */}
        <div style={{ textAlign: "center", zIndex: 1 }}>
          <div
            style={{
              fontSize: small ? "10px" : "12px",
              fontWeight: 700,
              color: dimmed ? "#4B5563" : "#E2E8F0",
              marginBottom: "2px",
              lineHeight: 1.2,
            }}
          >
            {dimmed ? "???" : card.name}
          </div>
          {!small && !dimmed && (
            <div style={{ fontSize: "10px", color: "#64748B", lineHeight: 1.3 }}>
              {card.flavor}
            </div>
          )}
        </div>

        {/* Duplicate count badge */}
        {count !== undefined && count > 0 && !dimmed && (
          <div
            style={{
              position: "absolute",
              top: "6px",
              right: "6px",
              background: style.color,
              color: "#0B0C10",
              borderRadius: "50%",
              width: "22px",
              height: "22px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "11px",
              fontWeight: 800,
              zIndex: 3,
            }}
          >
            {count}
          </div>
        )}

        {/* NEW badge */}
        {isNew && (
          <div
            style={{
              position: "absolute",
              top: "-8px",
              left: "50%",
              transform: "translateX(-50%)",
              background: "#F59E0B",
              color: "#0B0C10",
              borderRadius: "4px",
              padding: "2px 8px",
              fontSize: "10px",
              fontWeight: 800,
              letterSpacing: "0.1em",
              zIndex: 4,
            }}
          >
            NEW!
          </div>
        )}
      </div>

      <style>{`
        @keyframes holoShimmer {
          0% { background-position: 0% 0%; }
          50% { background-position: 100% 100%; }
          100% { background-position: 0% 0%; }
        }
      `}</style>
    </div>
  );
}
