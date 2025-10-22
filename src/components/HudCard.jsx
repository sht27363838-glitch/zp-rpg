// src/components/HudCard.jsx
import React from "react";

export default function HudCard({ hud }) {
  // 안전 기본값
  const p = hud?.player ?? {
    id: "player-1",
    name: "Player One",
    total_xp: 0,
    coins: 0,
    coins_spent: 0,
  };

  // level, xp_to_next 계산도 안전하게
  const totalXP = Number(p.total_xp || 0);
  const level = Number.isFinite(p.level) ? p.level : Math.floor(totalXP / 1000) + 1;
  const xpToNext = Number.isFinite(p.xp_to_next) ? p.xp_to_next : (level * 1000 - totalXP);
  const coinsNet = (p.coins || 0) - (p.coins_spent || 0);
  const barPct = Math.max(0, Math.min(100, ((totalXP % 1000) / 1000) * 100));

  // KPI 기본값 (없어도 렌더되게)
  const kpi = hud?.kpi ?? { AOV: 0, CR: 0, ROAS: 0, CAC: 0, LTV_90d: 0 };

  return (
    <div className="card profile">
      <div className="avatar">🧑‍🚀</div>
      <div className="title">{p.name || "Player One"}</div>
      <div className="hp">LEVEL {level} · Coins {p.coins || 0} (net {coinsNet})</div>
      <div className="progress"><div style={{ width: `${barPct}%` }} /></div>

      <div className="stats-strip" style={{ marginTop: 8 }}>
        <div className="stat"><div className="label">AOV</div><div className="value">{kpi.AOV ?? 0}</div></div>
        <div className="stat"><div className="label">CR</div><div className="value">{kpi.CR ?? 0}</div></div>
        <div className="stat"><div className="label">ROAS</div><div className="value">{kpi.ROAS ?? 0}</div></div>
        <div className="stat"><div className="label">CAC</div><div className="value">{kpi.CAC ?? 0}</div></div>
        <div className="stat"><div className="label">LTV_90d</div><div className="value">{kpi.LTV_90d ?? 0}</div></div>
      </div>
    </div>
  );
}

