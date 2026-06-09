import { useEffect, useRef, useState } from "react";

const FAKE_DROPS = [
  "AlphaMiner opened a Nether Pack and found [Legendary Mending Book]! ✨",
  "BuilderBob pulled [Epic Elytra] from an End Realm Pack! 🌌",
  "CraftingQueen got [Rare Diamond Pickaxe] from an Overworld Pack! ⛏️",
  "NetherKing_99 scored [Legendary The Mayor's Gavel] — the rarest pull! 🔨",
  "StoneBrigade opened an Overworld Pack and found [Common Iron Sword]! ⚔️",
  "RedstoneWizard pulled [Epic Dragon Egg] from a Nether Pack! 🥚",
  "MayorApproved found [Legendary Netherite Ingot] in an End Realm Pack! 🔱",
  "JungleExplorer opened an Overworld Pack and got [Rare Golden Apple]! 🍎",
  "DiamondDuke scored [Epic Beacon] from a Nether Pack! 🗼",
  "VillagerTrader found [Rare Enchanted Book] in an Overworld Pack! 📖",
  "EndermiteFan pulled [Legendary Mending Book] from an End Realm Pack! ✨",
  "PixelPioneer opened a Nether Pack and got [Epic Elytra]! 🦋",
];

export function LiveDropsTicker() {
  const [drops] = useState(() => [...FAKE_DROPS, ...FAKE_DROPS]);
  const trackRef = useRef<HTMLDivElement>(null);

  return (
    <div
      className="w-full overflow-hidden py-2 px-0"
      style={{ background: "linear-gradient(90deg, #0d1117 0%, #1a1f2e 50%, #0d1117 100%)", borderBottom: "1px solid #2a2f3e" }}
    >
      <div
        ref={trackRef}
        className="flex whitespace-nowrap"
        style={{ animation: "tickerScroll 60s linear infinite" }}
      >
        {drops.map((drop, i) => (
          <span key={i} className="inline-flex items-center gap-2 mx-8 text-sm font-medium" style={{ color: "#94A3B8" }}>
            <span style={{ color: "#F59E0B" }}>⚡</span>
            <span>{drop}</span>
          </span>
        ))}
      </div>
      <style>{`
        @keyframes tickerScroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}</style>
    </div>
  );
}
