import React, { useEffect, useState } from "react";
import axios from "axios";

export default function Rewards({ onAfter }) {
  const [shop, setShop] = useState([]);
  const [redeemed, setRedeemed] = useState([]);
  const [busy, setBusy] = useState(false);

  async function load() {
    const r = await axios.get('/api/rewards');
    setShop(r.data.rewards || []);
    setRedeemed(r.data.redeemed || []);
  }
  async function redeem(id){
    if (busy) return;
    setBusy(true);
    try {
      const r = await axios.post('/api/rewards/redeem', { reward_id: id });
      await load();
      onAfter?.(); // HUD 갱신(상위에서 load 호출)
      alert('Redeemed!');
    } catch(e) {
      alert(e.response?.data?.error || e.message);
    } finally { setBusy(false); }
  }

  useEffect(()=>{ load(); }, []);
  return (
    <div className="page">
      <div className="panel">
        <div className="panel-title">Marketplace · Reward</div>
        <div className="reward-grid">
          {shop.map(r => (
            <div key={r.id} className="reward-card">
              <div className="reward-name">{r.name}</div>
              <div className="reward-cost">{r.coins_cost} coins</div>
              <button className="btn" onClick={()=>redeem(r.id)} disabled={busy}>Redeem</button>
            </div>
          ))}
        </div>
      </div>
      <div className="panel">
        <div className="panel-title">Rewards Redeemed</div>
        <div className="list">
          {redeemed.map(x=>(
            <div className="row" key={x.id}>
              <div>{x.date.slice(0,10)}</div>
              <div>{shop.find(s=>s.id===x.reward_id)?.name || x.reward_id}</div>
              <div>-{x.coins_spent} coins</div>
            </div>
          ))}
          {!redeemed.length && <div className="empty">No history</div>}
        </div>
      </div>
    </div>
  );
}
