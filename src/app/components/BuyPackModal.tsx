import { useState } from "react";
import type { Pack } from "./types";
import { projectId, publicAnonKey } from "/utils/supabase/info";

interface BuyPackModalProps {
  pack: Pack;
  onClose: () => void;
  onSuccess: (username: string) => void;
}

export function BuyPackModal({ pack, onClose, onSuccess }: BuyPackModalProps) {
  const [username, setUsername] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleBuy = async () => {
    if (!username.trim()) {
      setError("Please enter your Minecraft username.");
      return;
    }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-4dfdc949/validate-transaction`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${publicAnonKey}`,
          },
          body: JSON.stringify({ username: username.trim(), packPrice: pack.price }),
        }
      );
      const data = await res.json();
      if (data.valid) {
        onSuccess(username.trim());
      } else {
        setError(data.error || "Payment not found. Please try again.");
      }
    } catch (e) {
      setError(`Connection error: ${e}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.85)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 1000,
        backdropFilter: "blur(8px)",
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div style={{
        width: "420px",
        borderRadius: "20px",
        border: `2px solid ${pack.glowColor}60`,
        background: "linear-gradient(145deg, #1a1f2e, #0B0C10)",
        padding: "32px",
        boxShadow: `0 0 48px ${pack.glowColor}30, 0 32px 64px rgba(0,0,0,0.8)`,
        display: "flex",
        flexDirection: "column",
        gap: "20px",
      }}>
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "48px", marginBottom: "8px" }}>{pack.emoji}</div>
          <div style={{ fontSize: "20px", fontWeight: 800, color: "#E2E8F0" }}>
            Open {pack.name}
          </div>
          <div style={{ fontSize: "14px", color: "#64748B", marginTop: "4px" }}>
            Cost: <span style={{ color: pack.glowColor, fontWeight: 700 }}>{pack.priceDisplay}</span> in-game
          </div>
        </div>

        <div style={{
          padding: "14px",
          borderRadius: "10px",
          background: "#0d1117",
          border: "1px solid #2a2f3e",
          fontSize: "13px",
          color: "#94A3B8",
          lineHeight: 1.6,
        }}>
          💰 Send <strong style={{ color: pack.glowColor }}>{pack.priceDisplay}</strong> to{" "}
          <strong style={{ color: "#E2E8F0" }}>DCCards</strong> in-game, then enter your
          username below. We'll verify your payment automatically.
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          <label style={{ fontSize: "12px", color: "#64748B", fontWeight: 600, letterSpacing: "0.05em" }}>
            MINECRAFT USERNAME
          </label>
          <input
            value={username}
            onChange={e => setUsername(e.target.value)}
            onKeyDown={e => { if (e.key === "Enter") handleBuy(); }}
            placeholder="e.g. Steve123"
            style={{
              padding: "12px 16px",
              borderRadius: "10px",
              border: `1px solid ${error ? "#ef4444" : "#2a2f3e"}`,
              background: "#111827",
              color: "#E2E8F0",
              fontSize: "15px",
              outline: "none",
              width: "100%",
              boxSizing: "border-box",
            }}
          />
        </div>

        {error && (
          <div style={{
            padding: "12px",
            borderRadius: "8px",
            background: "#1f0a0a",
            border: "1px solid #7f1d1d",
            color: "#FCA5A5",
            fontSize: "13px",
          }}>
            ⚠️ {error}
          </div>
        )}

        <div style={{ display: "flex", gap: "12px" }}>
          <button
            onClick={onClose}
            style={{
              flex: 1,
              padding: "13px",
              borderRadius: "10px",
              border: "1px solid #2a2f3e",
              background: "transparent",
              color: "#64748B",
              fontSize: "14px",
              fontWeight: 600,
              cursor: "pointer",
            }}
          >
            Cancel
          </button>
          <button
            onClick={handleBuy}
            disabled={loading}
            style={{
              flex: 2,
              padding: "13px",
              borderRadius: "10px",
              border: "none",
              background: loading
                ? "#374151"
                : `linear-gradient(135deg, ${pack.gradientFrom}, ${pack.gradientTo})`,
              color: loading ? "#9CA3AF" : "#fff",
              fontSize: "14px",
              fontWeight: 700,
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : `0 4px 16px ${pack.glowColor}40`,
              transition: "all 0.2s",
            }}
          >
            {loading ? "Verifying Payment..." : "Verify & Open Pack 🎁"}
          </button>
        </div>
      </div>
    </div>
  );
}
