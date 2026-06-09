# DC Cards — Minecraft TCG Booster Pack Site

## Context
Building a premium Minecraft-themed TCG booster pack opening website for DemocracyCraft server. The site validates real in-game payments via the DemocracyCraft Economy API before allowing pack openings. A previous Supabase connection attempt failed, so we need to properly wire up the secure backend. The app.tsx is currently empty.

## Architecture

### Backend — `/supabase/functions/server/index.tsx`
Add three routes to the existing Hono server:

1. **POST `/make-server-4dfdc949/validate-transaction`**
   - Body: `{ username: string, packPrice: number }`
   - Server fetches `https://api.democracycraft.net/economy/api/v1/accounts/2483/transactions` with the DC API token read from `Deno.env.get('DC_API_TOKEN')`
   - Parses each item's `message` field with regex `/Business payment:\s*(\w+)\s*->\s*(\w+)/i` to extract `fromPlayerName`
   - Converts `amount` string to float, maps `txnId` → id, `settledAt` → createdAt
   - Validates: `fromPlayerName === username` (case-insensitive), `amount === packPrice`, `settledAt` within last 5 minutes
   - Returns `{ valid: true, txnId }` or `{ valid: false, error: string }`

2. **GET `/make-server-4dfdc949/album/:username`**
   - Calls `kv.get(`album:${username}`)` and returns the stored album JSON

3. **POST `/make-server-4dfdc949/album/:username`**
   - Body: `{ cards: CardEntry[] }`
   - Calls `kv.set(`album:${username}`, JSON.stringify(cards))`

The DC API token is stored as Supabase secret `DC_API_TOKEN` (user must set it via the secret tool).

### Frontend — Component Files

All components in `src/app/components/`:

| File | Purpose |
|---|---|
| `types.ts` | Card, Pack, AlbumEntry, Transaction type definitions |
| `cardData.ts` | 12 card definitions + 3 pack definitions with odds |
| `LiveDropsTicker.tsx` | CSS marquee with simulated drop messages |
| `BoosterPackCard.tsx` | 3D hover pack card with "View Odds" dropdown + "Buy Pack" button |
| `OddsModal.tsx` | Dialog showing % drop rates per tier for a pack |
| `BuyPackModal.tsx` | Username input → calls validate-transaction → triggers opening |
| `PackOpeningAnimation.tsx` | Fullscreen unboxing: pack rip → cards face-down → flip one-by-one with rarity particles |
| `CardDisplay.tsx` | Individual card with 3D tilt (mousemove transforms) + holographic shimmer overlay for Epic/Legendary |
| `AlbumPage.tsx` | Grid of all 12 cards; undiscovered = grayscale silhouette; unlocked = vibrant + duplicate count + "Withdraw" button |
| `HowToPlayPage.tsx` | Static instructions page |
| `Header.tsx` | Nav bar with logo and page links |

**Main `src/app/App.tsx`:** Manages page state (`home | album | how-to-play`), renders `Header` + active page, fetches/saves album via server routes.

### Card Pool

**Common (gray/green glow):** Cobblestone Block, Iron Sword, Cooked Porkchop  
**Rare (blue glow):** Diamond Pickaxe, Enchanted Book, Golden Apple  
**Epic (purple glow):** Elytra, Beacon, Dragon Egg  
**Legendary (gold holographic):** Netherite Ingot, Mending Book, The Mayor's Gavel

### Pack Odds

| Pack | Price | Tiers |
|---|---|---|
| Overworld | $15 | Common 75%, Rare 25% |
| Nether | $45 | Rare 60%, Epic 40% |
| End Realm | $120 | Rare 30%, Epic 50%, Legendary 20% |

Each pack opening pulls 5 cards (with replacement allowed; duplicates tracked in album).

### Styling System

Override `theme.css` tokens for the dark Minecraft palette:
- Background: `#0B0C10`, surface: `#1F2833`
- Rarity glows: Common `#9CA3AF`, Rare `#60A5FA`, Epic `#A78BFA`, Legendary `#F59E0B`
- 3D tilt: CSS `perspective` + `rotateX/Y` driven by `onMouseMove` delta
- Holographic shimmer: `@keyframes shimmer` with `background: linear-gradient(...)` animated via `background-position`
- Pack rip animation: CSS keyframes for scale + clip-path tear effect
- Card flip: CSS `rotateY(180deg)` transition with `backface-visibility: hidden`

## Implementation Order

1. Show `create_supabase_secret` for `DC_API_TOKEN`
2. Update `supabase/functions/server/index.tsx` with 3 new routes
3. Create `src/app/components/types.ts` and `cardData.ts`
4. Create all UI components (can be done in parallel conceptually)
5. Update `src/app/App.tsx` as the orchestrator
6. Update `src/styles/theme.css` with Minecraft dark palette tokens

## Verification
- Health check: `GET /make-server-4dfdc949/health` returns `{status: "ok"}`
- Validate route returns `{valid: false, error: "..."}` for missing/old transactions
- Album round-trips: open a pack → album persists on page refresh (server KV)
- Card 3D tilt and holographic shimmer visible on hover
- Legendary cards show animated gold shimmer overlay
- Undiscovered cards appear as gray silhouettes in album
