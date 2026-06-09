import type { Card, Pack } from "./types";

export const ALL_CARDS: Card[] = [
  // Common
  {
    id: "cobblestone",
    name: "Cobblestone Block",
    rarity: "Common",
    emoji: "🪨",
    description: "The foundation of every great build.",
    flavor: "Gray and reliable — just like democracy.",
  },
  {
    id: "iron-sword",
    name: "Iron Sword",
    rarity: "Common",
    emoji: "⚔️",
    description: "A trusty blade forged from iron ore.",
    flavor: "Every hero starts somewhere.",
  },
  {
    id: "porkchop",
    name: "Cooked Porkchop",
    rarity: "Common",
    emoji: "🥩",
    description: "Restores hunger and spirits.",
    flavor: "The official meal of the DemocracyCraft senate.",
  },
  // Rare
  {
    id: "diamond-pickaxe",
    name: "Diamond Pickaxe",
    rarity: "Rare",
    emoji: "⛏️",
    description: "Mines through the toughest of blocks.",
    flavor: "Fortune III. The crowd goes wild.",
  },
  {
    id: "enchanted-book",
    name: "Enchanted Book",
    rarity: "Rare",
    emoji: "📖",
    description: "Contains ancient knowledge.",
    flavor: "What's inside? Nobody knows. That's the magic.",
  },
  {
    id: "golden-apple",
    name: "Golden Apple",
    rarity: "Rare",
    emoji: "🍎",
    description: "Grants absorption and regeneration.",
    flavor: "One bite and the council is impressed.",
  },
  // Epic
  {
    id: "elytra",
    name: "Elytra",
    rarity: "Epic",
    emoji: "🦋",
    description: "Soar above the server skyline.",
    flavor: "Permission to fly: GRANTED by the Mayor.",
  },
  {
    id: "beacon",
    name: "Beacon",
    rarity: "Epic",
    emoji: "🗼",
    description: "Emits a powerful status effect beam.",
    flavor: "A monument to prosperity.",
  },
  {
    id: "dragon-egg",
    name: "Dragon Egg",
    rarity: "Epic",
    emoji: "🥚",
    description: "A relic of the Ender Dragon's defeat.",
    flavor: "Do not hatch in a residential zone.",
  },
  // Legendary
  {
    id: "netherite-ingot",
    name: "Netherite Ingot",
    rarity: "Legendary",
    emoji: "🔱",
    description: "The most durable material known.",
    flavor: "Fireproof. Lavaproof. Future-proof.",
  },
  {
    id: "mending-book",
    name: "Mending Book",
    rarity: "Legendary",
    emoji: "✨",
    description: "Repairs items using experience.",
    flavor: "The Senate debated its legality for three sessions.",
  },
  {
    id: "mayors-gavel",
    name: "The Mayor's Gavel",
    rarity: "Legendary",
    emoji: "🔨",
    description: "A DemocracyCraft exclusive. Wield true power.",
    flavor: "With this, you call the session to order.",
  },
];

export const PACKS: Pack[] = [
  {
    id: "overworld",
    name: "Overworld Pack",
    price: 15,
    priceDisplay: "$15.00",
    subtitle: "Common to Rare cards",
    emoji: "🌿",
    gradientFrom: "#16a34a",
    gradientTo: "#15803d",
    glowColor: "#4ade80",
    odds: [
      { rarity: "Common", percent: 75 },
      { rarity: "Rare", percent: 25 },
    ],
    cardsPerPack: 5,
  },
  {
    id: "nether",
    name: "Nether Pack",
    price: 45,
    priceDisplay: "$45.00",
    subtitle: "Rare to Epic cards",
    emoji: "🔥",
    gradientFrom: "#dc2626",
    gradientTo: "#991b1b",
    glowColor: "#f87171",
    odds: [
      { rarity: "Rare", percent: 60 },
      { rarity: "Epic", percent: 40 },
    ],
    cardsPerPack: 5,
  },
  {
    id: "end-realm",
    name: "End Realm Pack",
    price: 120,
    priceDisplay: "$120.00",
    subtitle: "Rare to Legendary cards",
    emoji: "🌌",
    gradientFrom: "#7c3aed",
    gradientTo: "#4c1d95",
    glowColor: "#a78bfa",
    odds: [
      { rarity: "Rare", percent: 30 },
      { rarity: "Epic", percent: 50 },
      { rarity: "Legendary", percent: 20 },
    ],
    cardsPerPack: 5,
  },
];

export const RARITY_STYLES: Record<string, { color: string; glow: string; border: string; label: string }> = {
  Common: {
    color: "#9CA3AF",
    glow: "rgba(156,163,175,0.4)",
    border: "#6B7280",
    label: "COMMON",
  },
  Rare: {
    color: "#60A5FA",
    glow: "rgba(96,165,250,0.5)",
    border: "#3B82F6",
    label: "RARE",
  },
  Epic: {
    color: "#A78BFA",
    glow: "rgba(167,139,250,0.5)",
    border: "#8B5CF6",
    label: "EPIC",
  },
  Legendary: {
    color: "#F59E0B",
    glow: "rgba(245,158,11,0.6)",
    border: "#D97706",
    label: "LEGENDARY",
  },
};

export function rollCards(pack: Pack, count: number): Card[] {
  const results: Card[] = [];
  for (let i = 0; i < count; i++) {
    const roll = Math.random() * 100;
    let cumulative = 0;
    let chosenRarity = pack.odds[0].rarity;
    for (const tier of pack.odds) {
      cumulative += tier.percent;
      if (roll < cumulative) {
        chosenRarity = tier.rarity;
        break;
      }
    }
    const pool = ALL_CARDS.filter((c) => c.rarity === chosenRarity);
    const card = pool[Math.floor(Math.random() * pool.length)];
    results.push(card);
  }
  return results;
}
