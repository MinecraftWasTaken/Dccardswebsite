type Page = "home" | "album" | "how-to-play";

interface HeaderProps {
  page: Page;
  onNav: (p: Page) => void;
}

export function Header({ page, onNav }: HeaderProps) {
  const navItems: { id: Page; label: string; emoji: string }[] = [
    { id: "home", label: "Booster Packs", emoji: "🎴" },
    { id: "album", label: "My Album", emoji: "📚" },
    { id: "how-to-play", label: "How to Play", emoji: "❓" },
  ];

  return (
    <header style={{
      background: "linear-gradient(180deg, #0d1117 0%, #0B0C10 100%)",
      borderBottom: "1px solid #1e2533",
      padding: "0 32px",
      position: "sticky",
      top: 0,
      zIndex: 100,
    }}>
      <div style={{
        maxWidth: "1200px",
        margin: "0 auto",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        height: "64px",
      }}>
        {/* Logo */}
        <div
          style={{ display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}
          onClick={() => onNav("home")}
        >
          <div style={{
            fontSize: "28px",
            filter: "drop-shadow(0 0 12px #4ade80)",
          }}>
            🃏
          </div>
          <div>
            <div style={{
              fontSize: "20px",
              fontWeight: 900,
              background: "linear-gradient(90deg, #4ade80, #60A5FA, #A78BFA)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              letterSpacing: "0.04em",
              lineHeight: 1,
            }}>
              DC Cards
            </div>
            <div style={{ fontSize: "10px", color: "#374151", letterSpacing: "0.2em", lineHeight: 1.4 }}>
              DEMOCRACYCRAFT TCG
            </div>
          </div>
        </div>

        {/* Nav */}
        <nav style={{ display: "flex", gap: "4px" }}>
          {navItems.map(item => (
            <button
              key={item.id}
              onClick={() => onNav(item.id)}
              style={{
                display: "flex",
                alignItems: "center",
                gap: "6px",
                padding: "8px 16px",
                borderRadius: "8px",
                border: "none",
                background: page === item.id ? "#1F2833" : "transparent",
                color: page === item.id ? "#E2E8F0" : "#64748B",
                fontSize: "14px",
                fontWeight: page === item.id ? 700 : 500,
                cursor: "pointer",
                transition: "all 0.15s",
                boxShadow: page === item.id ? "inset 0 0 0 1px #2a2f3e" : "none",
              }}
              onMouseEnter={e => { if (page !== item.id) e.currentTarget.style.color = "#94A3B8"; }}
              onMouseLeave={e => { if (page !== item.id) e.currentTarget.style.color = "#64748B"; }}
            >
              <span>{item.emoji}</span>
              <span>{item.label}</span>
            </button>
          ))}
        </nav>
      </div>
    </header>
  );
}
