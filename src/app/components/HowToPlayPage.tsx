export function HowToPlayPage() {
  const steps = [
    {
      n: "1",
      title: "Choose Your Pack",
      body: "Browse the three booster packs on the home page. Each pack targets different card rarities — Overworld for Common/Rare, Nether for Rare/Epic, End Realm for the rarest pulls.",
      icon: "🎴",
    },
    {
      n: "2",
      title: "Send Payment In-Game",
      body: 'Join DemocracyCraft and send the exact pack price to the account "DCCards" using /pay DCCards [amount]. The transaction must be made within 5 minutes of opening your pack.',
      icon: "💰",
    },
    {
      n: "3",
      title: "Enter Your Username",
      body: 'Click "Buy Pack" on your chosen pack, enter your Minecraft username exactly as it appears in-game, and click "Verify & Open Pack". Our server will confirm your payment automatically.',
      icon: "🎮",
    },
    {
      n: "4",
      title: "Watch the Unboxing",
      body: "Enjoy the animated pack opening! Cards slide out face-down and flip one by one. Rarity-colored particles burst as each card is revealed.",
      icon: "✨",
    },
    {
      n: "5",
      title: "Build Your Album",
      body: "All pulled cards are saved to your personal album. Visit My Album to track your collection, see undiscovered cards as silhouettes, and withdraw cards to the game.",
      icon: "📚",
    },
  ];

  const rarities = [
    { name: "Common", color: "#9CA3AF", emoji: "🪨⚔️🥩", desc: "Foundation drops — always useful." },
    { name: "Rare", color: "#60A5FA", emoji: "⛏️📖🍎", desc: "Sought-after tools and enchantments." },
    { name: "Epic", color: "#A78BFA", emoji: "🦋🗼🥚", desc: "Powerful endgame items with holographic shimmer." },
    { name: "Legendary", color: "#F59E0B", emoji: "🔱✨🔨", desc: "Exceedingly rare. Animated gold holographic foil." },
  ];

  return (
    <div style={{ padding: "40px 32px", maxWidth: "900px", margin: "0 auto" }}>
      <h2 style={{
        fontSize: "32px",
        fontWeight: 900,
        color: "#E2E8F0",
        marginBottom: "8px",
      }}>
        ❓ How to Play
      </h2>
      <p style={{ color: "#64748B", fontSize: "15px", marginBottom: "40px", lineHeight: 1.6 }}>
        DC Cards is the official DemocracyCraft Trading Card Game. Collect all 12 Minecraft-themed cards and show off your collection.
      </p>

      {/* Steps */}
      <div style={{ display: "flex", flexDirection: "column", gap: "16px", marginBottom: "48px" }}>
        {steps.map(step => (
          <div
            key={step.n}
            style={{
              display: "flex",
              gap: "20px",
              alignItems: "flex-start",
              padding: "20px 24px",
              borderRadius: "14px",
              background: "#1F2833",
              border: "1px solid #2a2f3e",
            }}
          >
            <div style={{
              fontSize: "28px",
              minWidth: "44px",
              textAlign: "center",
            }}>
              {step.icon}
            </div>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "6px" }}>
                <span style={{
                  fontSize: "11px",
                  fontWeight: 800,
                  color: "#3B82F6",
                  background: "#1e3a5f",
                  padding: "2px 8px",
                  borderRadius: "4px",
                  letterSpacing: "0.1em",
                }}>
                  STEP {step.n}
                </span>
                <span style={{ fontSize: "16px", fontWeight: 700, color: "#E2E8F0" }}>{step.title}</span>
              </div>
              <p style={{ fontSize: "14px", color: "#94A3B8", lineHeight: 1.6, margin: 0 }}>{step.body}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Rarity guide */}
      <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#E2E8F0", marginBottom: "20px" }}>
        Card Rarities
      </h3>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(200px, 1fr))", gap: "16px" }}>
        {rarities.map(r => (
          <div
            key={r.name}
            style={{
              padding: "20px",
              borderRadius: "14px",
              background: "#1F2833",
              border: `1px solid ${r.color}40`,
              boxShadow: `0 0 16px ${r.color}10`,
            }}
          >
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{r.emoji}</div>
            <div style={{ fontSize: "14px", fontWeight: 800, color: r.color, marginBottom: "6px", letterSpacing: "0.08em" }}>
              {r.name.toUpperCase()}
            </div>
            <div style={{ fontSize: "13px", color: "#64748B", lineHeight: 1.5 }}>{r.desc}</div>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <h3 style={{ fontSize: "22px", fontWeight: 800, color: "#E2E8F0", marginTop: "48px", marginBottom: "20px" }}>
        FAQ
      </h3>
      {[
        ["What if my payment isn't found?", "Make sure you sent the exact amount (not more, not less) and that you're entering your username exactly as it appears in-game. Payments must be made within 5 minutes."],
        ["Can I have duplicate cards?", "Yes! Duplicates are tracked in your album with a count badge."],
        ["What does 'Withdraw to Game' do?", "This feature is coming soon — it will allow you to claim physical in-game versions of your pulled cards."],
        ["Is my album saved permanently?", "Your album is saved server-side by username and persists between sessions."],
      ].map(([q, a]) => (
        <div key={q} style={{ marginBottom: "16px", padding: "16px 20px", borderRadius: "10px", background: "#1F2833", border: "1px solid #2a2f3e" }}>
          <div style={{ fontSize: "14px", fontWeight: 700, color: "#E2E8F0", marginBottom: "6px" }}>❓ {q}</div>
          <div style={{ fontSize: "13px", color: "#94A3B8", lineHeight: 1.6 }}>{a}</div>
        </div>
      ))}
    </div>
  );
}
