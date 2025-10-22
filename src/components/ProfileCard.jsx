import React from "react";

export default function ProfileCard({ player }) {
  const p = player || { name:"Player", level:1, hp:1000, stamina:100, total_xp:0, xp_to_next:1000, coins:0, coins_net:0 };
  const pct = Math.max(0, Math.min(100, ((p.total_xp % 1000)/1000)*100));
  return (
    <div className="card profile">
      <div className="avatar">🧑🏻‍🎓</div>
      <div className="title">{p.name} • Level {p.level} • {p.coins} Coins</div>
      <div className="hp">HP: {"❤️".repeat(8)} {p.hp}/1000</div>
      <div className="progress"><div style={{width:`${pct}%`}}/></div>
      <div className="meta">
        <div><b>Goal Completion:</b> 0%</div>
        <div><b>Level Up:</b> {p.xp_to_next} xp to next</div>
      </div>
    </div>
  );
}
