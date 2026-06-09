import { useEffect, useState, useCallback } from "react";
import { LiveDropsTicker } from "./components/LiveDropsTicker";
import { Header } from "./components/Header";
import { BoosterPackCard } from "./components/BoosterPackCard";
import { BuyPackModal } from "./components/BuyPackModal";
import { PackOpeningAnimation } from "./components/PackOpeningAnimation";
import { AlbumPage } from "./components/AlbumPage";
import { HowToPlayPage } from "./components/HowToPlayPage";
import { CardDisplay } from "./components/CardDisplay";
import { PACKS, ALL_CARDS, rollCards } from "./components/cardData";
import type { Pack, Card, AlbumEntry } from "./components/types";
import { projectId, publicAnonKey } from "/utils/supabase/info";

type Page = "home" | "album" | "how-to-play";

export default function App() {
  const [page, setPage] = useState<Page>("home");
  const [selectedPack, setSelectedPack] = useState<Pack | null>(null);
  const [openingPack, setOpeningPack] = useState<{ pack: Pack; cards: Card[] } | null>(null);
  const [username, setUsername] = useState<string>(() => localStorage.getItem("dc_username") ?? "");
  const [album, setAlbum] = useState<AlbumEntry[]>([]);

  const loadAlbum = useCallback(async (user: string) => {
    if (!user) return;
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4dfdc949/album/${encodeURIComponent(user.toLowerCase())}`,
        { headers: { Authorization: `Bearer ${publicAnonKey}` } }
      );
      if (res.ok) {
        const data = await res.json();
        setAlbum(data.cards ?? []);
      }
    } catch (e) {
      console.error("Album load error:", e);
    }
  }, []);

  useEffect(() => {
    if (username) loadAlbum(username);
  }, [username, loadAlbum]);

  const saveAlbum = async (user: string, entries: AlbumEntry[]) => {
    try {
      await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4dfdc949/album/${encodeURIComponent(user.toLowerCase())}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ cards: entries }),
        }
      );
    } catch (e) {
      console.error("Album save error:", e);
    }
  };

  const handleBuy = (pack: Pack) => setSelectedPack(pack);

  const handlePaymentVerified = (verifiedUsername: string) => {
    localStorage.setItem("dc_username", verifiedUsername);
    setUsername(verifiedUsername);
    const pack = selectedPack!;
    const drawnCards = rollCards(pack, pack.cardsPerPack);
    setSelectedPack(null);
    setOpeningPack({ pack, cards: drawnCards });
  };

  const handleOpeningComplete = async () => {
    if (!openingPack || !username) return;
    const newAlbum = [...album];
    for (const card of openingPack.cards) {
      const existing = newAlbum.find(e => e.cardId === card.id);
      if (existing) {
        existing.count += 1;
      } else {
        newAlbum.push({ cardId: card.id, count: 1 });
      }
    }
    setAlbum(newAlbum);
    await saveAlbum(username, newAlbum);
    setOpeningPack(null);
    setPage("album");
  };

  const handleUsernameChange = (u: string) => {
    setUsername(u);
    localStorage.setItem("dc_username", u);
    loadAlbum(u);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "#0B0C10",
      color: "#E2E8F0",
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
    }}>
      <LiveDropsTicker />
      <Header page={page} onNav={p => setPage(p as Page)} />

      {page === "home" && (
        <main>
          {/* Hero section */}
          <div style={{
            textAlign: "center",
            padding: "64px 32px 48px",
            background: "radial-gradient(ellipse 80% 40% at 50% 0%, #1a2744 0%, transparent 70%)",
          }}>
            <div style={{
              display: "inline-block",
              padding: "6px 16px",
              borderRadius: "20px",
              background: "#0d1f3c",
              border: "1px solid #1e3a5f",
              fontSize: "12px",
              color: "#60A5FA",
              fontWeight: 700,
              letterSpacing: "0.15em",
              marginBottom: "20px",
            }}>
              🃏 DEMOCRACYCRAFT OFFICIAL TCG
            </div>
            <h1 style={{
              fontSize: "clamp(36px, 6vw, 64px)",
              fontWeight: 900,
              background: "linear-gradient(135deg, #4ade80 0%, #60A5FA 40%, #A78BFA 70%, #F59E0B 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              lineHeight: 1.1,
              marginBottom: "16px",
              letterSpacing: "-0.02em",
            }}>
              DC Cards
            </h1>
            <p style={{
              fontSize: "18px",
              color: "#64748B",
              maxWidth: "520px",
              margin: "0 auto 12px",
              lineHeight: 1.6,
            }}>
              Open booster packs, collect Minecraft-themed cards, and build your ultimate album — exclusively for DemocracyCraft players.
            </p>
            <p style={{ fontSize: "13px", color: "#374151" }}>
              Pay in-game → verify instantly → open your pack
            </p>
          </div>

          {/* Pack grid */}
          <div style={{
            display: "flex",
            justifyContent: "center",
            gap: "32px",
            flexWrap: "wrap",
            padding: "0 32px 80px",
          }}>
            {PACKS.map(pack => (
              <BoosterPackCard key={pack.id} pack={pack} onBuy={handleBuy} />
            ))}
          </div>

          {/* Card preview gallery */}
          <div style={{
            borderTop: "1px solid #1e2533",
            padding: "64px 32px 80px",
            background: "linear-gradient(180deg, #0d1117 0%, #0B0C10 100%)",
          }}>
            <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
              <h2 style={{ fontSize: "24px", fontWeight: 800, color: "#E2E8F0", marginBottom: "6px" }}>
                🃏 All {ALL_CARDS.length} Cards
              </h2>
              <p style={{ color: "#64748B", fontSize: "14px", marginBottom: "28px" }}>
                Collect them all across 4 rarities. Can you complete the set?
              </p>
              <div style={{ display: "flex", gap: "14px", flexWrap: "wrap" }}>
                {ALL_CARDS.map(card => (
                  <CardDisplay key={card.id} card={card} small />
                ))}
              </div>
            </div>
          </div>
        </main>
      )}

      {page === "album" && (
        <AlbumPage
          username={username}
          album={album}
          onUsernameChange={handleUsernameChange}
        />
      )}

      {page === "how-to-play" && <HowToPlayPage />}

      {/* Buy pack modal */}
      {selectedPack && (
        <BuyPackModal
          pack={selectedPack}
          onClose={() => setSelectedPack(null)}
          onSuccess={handlePaymentVerified}
        />
      )}

      {/* Pack opening animation */}
      {openingPack && (
        <PackOpeningAnimation
          pack={openingPack.pack}
          cards={openingPack.cards}
          onComplete={handleOpeningComplete}
        />
      )}
    </div>
  );
}
