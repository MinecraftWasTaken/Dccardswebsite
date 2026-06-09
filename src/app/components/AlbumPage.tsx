import { useState } from "react";
import { ALL_CARDS, RARITY_STYLES } from "./cardData";
import { CardDisplay } from "./CardDisplay";
import type { AlbumEntry } from "./types";

interface AlbumPageProps {
  username: string;
  album: AlbumEntry[];
  onUsernameChange: (u: string) => void;
}

const RARITY_ORDER = ["Common", "Rare", "Epic", "Legendary"];

export function AlbumPage({ username, album, onUsernameChange }: AlbumPageProps) {
  const [inputUser, setInputUser] = useState(username);
  const [filter, setFilter] = useState<string>("All");

  const getEntry = (cardId: string) => album.find(e => e.cardId === cardId);
  const totalUnlocked = album.filter(e => e.count > 0).length;
  const totalCards = ALL_CARDS.length;

  const filteredCards = filter === "All"
    ? ALL_CARDS
    : ALL_CARDS.filter(c => c.rarity === filter);

  return (
    <div style={{ padding: "40px 32px", maxWidth: "1100px", margin: "0 auto" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <h2 style={{
          fontSize: "32px",
          fontWeight: 900,
          color: "#E2E8F0",
          marginBottom: "8px",
          letterSpacing: "0.02em",
        }}>
          📚 My Card Album
        </h2>

        <div style={{ display: "flex", alignItems: "center", gap: "16px", flexWrap: "wrap" }}>
          <div style={{
            display: "flex",
            alignItems: "center",
            gap: "10px",
            padding: "10px 16px",
            borderRadius: "10px",
            background: "#1F2833",
            border: "1px solid #2a2f3e",
          }}>
            <span style={{ fontSize: "13px", color: "#64748B", fontWeight: 600 }}>Viewing album for:</span>
            <input
              value={inputUser}
              onChange={e => setInputUser(e.target.value)}
              onKeyDown={e => { if (e.key === "Enter") onUsernameChange(inputUser); }}
              placeholder="Minecraft username"
              style={{
                background: "transparent",
                border: "none",
                color: "#60A5FA",
                fontSize: "14px",
                fontWeight: 700,
                outline: "none",
                width: "160px",
              }}
            />
            <button
              onClick={() => onUsernameChange(inputUser)}
              style={{
                padding: "4px 12px",
                borderRadius: "6px",
                border: "1px solid #3B82F6",
                background: "transparent",
                color: "#60A5FA",
                fontSize: "12px",
                cursor: "pointer",
              }}
            >
              Load
            </button>
          </div>

          <div style={{
            padding: "10px 16px",
            borderRadius: "10px",
            background: "#1F2833",
            border: "1px solid #2a2f3e",
            fontSize: "14px",
            color: "#94A3B8",
          }}>
            <span style={{ fontWeight: 700, color: "#F59E0B" }}>{totalUnlocked}</span>
            <span> / {totalCards} cards unlocked</span>
          </div>
        </div>
      </div>

      {/* Progress bar */}
      <div style={{ marginBottom: "28px" }}>
        <div style={{ height: "8px", borderRadius: "4px", background: "#1F2833", overflow: "hidden" }}>
          <div style={{
            height: "100%",
            width: `${(totalUnlocked / totalCards) * 100}%`,
            background: "linear-gradient(90deg, #3B82F6, #8B5CF6, #F59E0B)",
            borderRadius: "4px",
            transition: "width 0.5s ease",
          }} />
        </div>
        <div style={{ fontSize: "11px", color: "#64748B", marginTop: "4px" }}>
          {Math.round((totalUnlocked / totalCards) * 100)}% complete
        </div>
      </div>

      {/* Rarity filter */}
      <div style={{ display: "flex", gap: "10px", marginBottom: "28px", flexWrap: "wrap" }}>
        {["All", ...RARITY_ORDER].map(r => {
          const rs = r !== "All" ? RARITY_STYLES[r] : null;
          const active = filter === r;
          return (
            <button
              key={r}
              onClick={() => setFilter(r)}
              style={{
                padding: "8px 18px",
                borderRadius: "8px",
                border: `1px solid ${active ? (rs?.border ?? "#3B82F6") : "#2a2f3e"}`,
                background: active ? `${rs?.color ?? "#3B82F6"}22` : "transparent",
                color: active ? (rs?.color ?? "#60A5FA") : "#64748B",
                fontSize: "13px",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.15s",
              }}
            >
              {r}
            </button>
          );
        })}
      </div>

      {/* Card grid grouped by rarity */}
      {(filter === "All" ? RARITY_ORDER : [filter]).map(rarity => {
        const rarityCards = filteredCards.filter(c => c.rarity === rarity);
        if (!rarityCards.length) return null;
        const rs = RARITY_STYLES[rarity];
        return (
          <div key={rarity} style={{ marginBottom: "40px" }}>
            <div style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
              marginBottom: "16px",
            }}>
              <div style={{ width: "4px", height: "24px", background: rs.color, borderRadius: "2px" }} />
              <h3 style={{ fontSize: "16px", fontWeight: 800, color: rs.color, letterSpacing: "0.08em" }}>
                {rarity.toUpperCase()}
              </h3>
            </div>
            <div style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
              {rarityCards.map(card => {
                const entry = getEntry(card.id);
                const unlocked = entry && entry.count > 0;
                return (
                  <div key={card.id} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "12px" }}>
                    <CardDisplay
                      card={card}
                      count={entry?.count}
                      dimmed={!unlocked}
                    />
                    {unlocked ? (
                      <button
                        style={{
                          padding: "6px 14px",
                          borderRadius: "6px",
                          border: `1px solid ${rs.border}60`,
                          background: "transparent",
                          color: rs.color,
                          fontSize: "11px",
                          fontWeight: 600,
                          cursor: "pointer",
                          letterSpacing: "0.05em",
                        }}
                        onClick={() => alert("Withdraw to Game coming soon!")}
                      >
                        Withdraw to Game
                      </button>
                    ) : (
                      <div style={{ fontSize: "11px", color: "#374151", fontWeight: 600, letterSpacing: "0.05em" }}>
                        NOT DISCOVERED
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
