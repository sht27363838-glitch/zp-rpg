import React from "react";
export default function StatsStrip({ kpi }) {
  const m = (code) => kpi?.find(x=>x.metric===code)?.value ?? "-";
  return (
    <div className="stats-strip">
      <div className="stat"><div className="label">AOV</div><div className="value">{m("AOV")}</div></div>
      <div className="stat"><div className="label">CR</div><div className="value">{m("CR")}</div></div>
      <div className="stat"><div className="label">ROAS</div><div className="value">{m("ROAS")}</div></div>
      <div className="stat"><div className="label">CAC</div><div className="value">{m("CAC")}</div></div>
      <div className="stat"><div className="label">LTV_90d</div><div className="value">{m("LTV_90d")}</div></div>
    </div>
  );
}
