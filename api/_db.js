const db = {
  players: [{ id: 'player-1', name: 'Player One', total_xp: 0, coins: 0, coins_spent: 0, hp: 1000, stamina: 100 }],
  areas: [{ id:'area-1', name:'Health', icon:'💪', color:'green' }, { id:'area-2', name:'Work', icon:'💼', color:'blue' }],
  skills: [{ id:'skill-1', name:'Strength', code:'STR', area_id:'area-1' }, { id:'skill-2', name:'Discipline', code:'DSC', area_id:'area-2' }],
  quests: [
    { id:'q1', name:'Morning workout', type:'habit', area_id:'area-1', skill_id:'skill-1', difficulty:2, impact:3, energy:2, frequency:'daily', due_date: new Date().toISOString().slice(0,10), status:'planned', completed_at: null, kpi_ok:false },
    { id:'q2', name:'Deep work block', type:'task', area_id:'area-2', skill_id:'skill-2', difficulty:3, impact:4, energy:3, frequency:'none', due_date: new Date().toISOString().slice(0,10), status:'planned', completed_at: null, kpi_ok:true }
  ],
  journal: [],
  kpi_bridge: [
    { metric:'AOV', value:45.0, snapshot_date: new Date().toISOString().slice(0,10) },
    { metric:'CR', value:0.022, snapshot_date: new Date().toISOString().slice(0,10) },
    { metric:'ROAS', value:2.3, snapshot_date: new Date().toISOString().slice(0,10) },
    { metric:'CAC', value:12.0, snapshot_date: new Date().toISOString().slice(0,10) },
    { metric:'LTV_90d', value:72.0, snapshot_date: new Date().toISOString().slice(0,10) }
  ],
  rewards: [
    { id:'r1', name:'Premium coffee', coins_cost:50, cooldown:'1 day' },
    { id:'r2', name:'Movie night', coins_cost:120, cooldown:'7 days' },
    { id:'r3', name:'Mini trip', coins_cost:600, cooldown:'30 days' }
  ],
  rewards_redeemed: []
};

function xpBase(q){ return (Number(q.difficulty||0)*10) + (Number(q.impact||0)*15); }
function xpMod(q){ return q.type==='habit' ? 0.8 : (q.type==='project' ? 1.3 : 1.0); }
function kpiMod(q){ return q.kpi_ok ? 1.15 : 1.0; }
function computeXP(q){ return Math.round(xpBase(q)*xpMod(q)*kpiMod(q)); }
function computeCoins(xp){ return Math.round(xp*0.2); }

module.exports = { db, xpBase, xpMod, kpiMod, computeXP, computeCoins }
