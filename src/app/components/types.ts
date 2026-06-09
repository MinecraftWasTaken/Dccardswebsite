export type Rarity = "Common" | "Rare" | "Epic" | "Legendary";

export interface Card {
  id: string;
  name: string;
  rarity: Rarity;
  emoji: string;
  description: string;
  flavor: string;
}

export interface Pack {
  id: string;
  name: string;
  price: number;
  priceDisplay: string;
  subtitle: string;
  emoji: string;
  gradientFrom: string;
  gradientTo: string;
  glowColor: string;
  odds: { rarity: Rarity; percent: number }[];
  cardsPerPack: number;
}

export interface AlbumEntry {
  cardId: string;
  count: number;
}

export interface Transaction {
  txnId: string;
  amount: number;
  fromPlayerName: string;
  toPlayerName: string;
  createdAt: string;
}
