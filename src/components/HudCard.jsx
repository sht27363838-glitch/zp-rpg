import React from 'react'

export default function HudCard({ player, kpi }){
  const lvl = player.level
  const pct = Math.min(100, Math.round(((player.total_xp % 1000) / 1000) * 100))
  const safe = (v, d) => (v===0 || !!v) ? v : d;
const p = hud?.player ? hud.player : { name:"Player One", level:1, total_xp:0, xp_to_next:1000, coins:0, coins_net:0 };
const level = safe(p.level, 1);


  return (
    <div style={{background:'#0f172a', color:'#fff', padding:16, borderRadius:12}}>
      <div style={{display:'flex', justifyContent:'space-between', alignItems:'center'}}>
        <div>
          <div style={{opacity:.7, fontSize:12}}>LEVEL {lvl}</div>
          <div style={{fontSize:24, fontWeight:700}}>{player.name}</div>
        </div>
        <div style={{textAlign:'right'}}>
          <div style={{fontSize:12}}>Coins</div>
          <div style={{fontSize:18, fontWeight:600}}>
            {player.coins} (net {player.coins - player.coins_spent})
          </div>
        </div>
      </div>

      <div style={{marginTop:12}}>
        <div style={{background:'#334155', height:8, borderRadius:6}}>
          <div style={{height:8, width:`${pct}%`, background:'#22c55e', borderRadius:6}}/>
        </div>
        <div style={{fontSize:12, opacity:.7, marginTop:4}}>{pct}% to next</div>
      </div>

      <div style={{display:'grid', gridTemplateColumns:'repeat(5,1fr)', gap:8, marginTop:12}}>
        {kpi.map(item=>(
          <div key={item.metric} style={{background:'#111827', padding:8, borderRadius:8, textAlign:'center'}}>
            <div style={{fontSize:12, opacity:.7}}>{item.metric}</div>
            <div style={{fontSize:14, fontWeight:700}}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
