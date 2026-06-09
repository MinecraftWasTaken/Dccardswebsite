import { Hono } from "npm:hono";
import { cors } from "npm:hono/cors";
import { logger } from "npm:hono/logger";
import * as kv from "./kv_store.tsx";

const app = new Hono();

app.use('*', logger(console.log));

app.use(
  "/*",
  cors({
    origin: "*",
    allowHeaders: ["Content-Type", "Authorization"],
    allowMethods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    exposeHeaders: ["Content-Length"],
    maxAge: 600,
  }),
);

app.get("/make-server-4dfdc949/health", (c) => {
  return c.json({ status: "ok" });
});

// Validate a DemocracyCraft transaction before allowing pack opening
app.post("/make-server-4dfdc949/validate-transaction", async (c) => {
  try {
    const { username, packPrice } = await c.req.json();

    if (!username || packPrice == null) {
      return c.json({ valid: false, error: "Missing username or packPrice" }, 400);
    }

    const apiToken = Deno.env.get('DC_API_TOKEN') ||
      "eyJraWQiOiIxNDUiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJiMTQ2ZmM0Ny1kZGMzLTQ2MTItOTY3ZC1hZTA1ZWNiMjZjYTEiLCJ0eXBlIjoiQlVTSU5FU1MiLCJqdGkiOiIwZGE3NWNmMy05MDAwLTQ3ZDEtODA3YS1lYjY4MjcyNzY3NWQiLCJpYXQiOjE3ODA5NzA4MTEsImV4cCI6MTc5NjUyMjgxMSwiZmlybSI6MjQ4M30.18EWVOhV8Oz7hw4dczBErUOUic1j1E2Kp3DEqPFI2wU";

    const response = await fetch(
      "https://api.democracycraft.net/economy/api/v1/accounts/2483/transactions",
      {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${apiToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      console.log(`DC API error: ${response.status} ${response.statusText}`);
      return c.json({ valid: false, error: `DC API returned ${response.status}: ${response.statusText}` }, 502);
    }

    const data = await response.json();
    const items = data?.items ?? [];

    const now = Date.now();
    const fiveMinutesMs = 5 * 60 * 1000;

    // Parse each transaction
    for (const item of items) {
      const amount = parseFloat(item.amount ?? "0");
      const txnId = String(item.txnId ?? "");
      const message = String(item.message ?? "");
      const settledAt = item.settledAt ? new Date(item.settledAt).getTime() : 0;

      // Only consider transactions within the last 5 minutes
      if (now - settledAt > fiveMinutesMs) continue;

      // Parse "Business payment: SenderName -> ReceiverName"
      const match = message.match(/Business payment:\s*(\S+)\s*->\s*(\S+)/i);
      if (!match) continue;

      const fromPlayerName = match[1];

      if (
        fromPlayerName.toLowerCase() === username.toLowerCase() &&
        Math.abs(amount - packPrice) < 0.01
      ) {
        return c.json({ valid: true, txnId });
      }
    }

    return c.json({
      valid: false,
      error: "No matching payment found in the last 5 minutes. Make sure you paid the correct amount and try again.",
    });
  } catch (err) {
    console.log(`validate-transaction error: ${err}`);
    return c.json({ valid: false, error: `Server error: ${err}` }, 500);
  }
});

// Get a user's card album
app.get("/make-server-4dfdc949/album/:username", async (c) => {
  try {
    const username = c.req.param("username").toLowerCase();
    const data = await kv.get(`album:${username}`);
    if (!data) return c.json({ cards: [] });
    return c.json({ cards: JSON.parse(data as string) });
  } catch (err) {
    console.log(`album get error: ${err}`);
    return c.json({ error: `Server error: ${err}` }, 500);
  }
});

// Save a user's card album
app.post("/make-server-4dfdc949/album/:username", async (c) => {
  try {
    const username = c.req.param("username").toLowerCase();
    const { cards } = await c.req.json();
    await kv.set(`album:${username}`, JSON.stringify(cards));
    return c.json({ success: true });
  } catch (err) {
    console.log(`album post error: ${err}`);
    return c.json({ error: `Server error: ${err}` }, 500);
  }
});

Deno.serve(app.fetch);
