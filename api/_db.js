// api/_db.js
// ─────────────────────────────────────────────────────────────────────────────
// 기본 유틸
const today = () => new Date().toISOString().slice(0, 10);
const nowISO = () => new Date().toISOString();

// ─────────────────────────────────────────────────────────────────────────────
// 초기 데이터(시드)
const db = {
  // 플레이어(기존 유지)
  players: [
    { id: 'player-1', name: 'Player One', total_xp: 0, coins: 0, coins_spent: 0, hp: 1000, stamina: 100 }
  ],

  // 영역/스킬(기존 유지)
  areas: [
    { id:'area-1', name:'Health', icon:'💪', color:'green' },
    { id:'area-2', name:'Work',   icon:'💼', color:'blue'  }
  ],
  skills: [
    { id:'skill-1', name:'Strength',  code:'STR', area_id:'area-1' },
    { id:'skill-2', name:'Discipline',code:'DSC', area_id:'area-2' }
  ],

  // 퀘스트(기존 유지)
  quests: [
    { id:'q1', name:'Morning workout', type:'habit',  area_id:'area-1', skill_id:'skill-1', difficulty:2, impact:3, energy:2, frequency:'daily', due_date: today(), status:'planned',  completed_at: null, kpi_ok:false },
    { id:'q2', name:'Deep work block', type:'task',   area_id:'area-2', skill_id:'skill-2', difficulty:3, impact:4, energy:3, frequency:'none',  due_date: today(), status:'planned',  completed_at: null, kpi_ok:true  }
  ],

  // KPI(기존 유지)
  kpi_bridge: [
    { metric:'AOV',     value:45.0,  snapshot_date: today() },
    { metric:'CR',      value:0.022, snapshot_date: today() },
    { metric:'ROAS',    value:2.3,   snapshot_date: today() },
    { metric:'CAC',     value:12.0,  snapshot_date: today() },
    { metric:'LTV_90d', value:72.0,  snapshot_date: today() }
  ],

  // 보상(기존 유지)
  rewards: [
    { id:'r1', name:'Premium coffee', coins_cost:50,  cooldown:'1 day'  },
    { id:'r2', name:'Movie night',    coins_cost:120, cooldown:'7 days' },
    { id:'r3', name:'Mini trip',      coins_cost:600, cooldown:'30 days'}
  ],
  rewards_redeemed: [],

  // ───────────────────────────────────────────────────────────────────────────
  // [신규] 감정 카탈로그(기본값)
  moods: [
    { id:'joy',       name:'Joy',       icon:'😊' },
    { id:'sadness',   name:'Sadness',   icon:'😢' },
    { id:'boredom',   name:'Boredom',   icon:'😐' },
    { id:'anxiety',   name:'Anxiety',   icon:'😰' },
    { id:'surprise',  name:'Surprise',  icon:'😮' },
    { id:'shame',     name:'Shame',     icon:'😳' },
    { id:'regret',    name:'Regret',    icon:'😔' },
    { id:'anger',     name:'Anger',     icon:'😡' }
  ],

  // [신규] 저널 엔트리
  // id, date(ISO), moodIds[], energy{morning,noon,evening}, focus, stress, notes,
  // sections{events[], learnings[], gratitude[], reflections[]}
 // _db.js 안의 journal_entries 초기값을 아래로 교체
journal_entries: [
  {
    id: 'je-seed-1',
    date: nowISO(),                 // ISO 타임스탬프
    moodIds: ['joy', 'anxiety'],    // 기본 제공 mood id들
    energy: { morning: 2.5, noon: 3, evening: 2 },
    focus: 3,
    stress: 2,
    notes: 'Seed example — edit or delete as you like.',
    sections: {
      events:      ['Planned the day', 'Short workout'],
      learnings:   ['Short, focused blocks work best'],
      gratitude:   ['A good cup of coffee'],
      reflections: ['Okay day. Keep momentum.']
    }
  },
  {
    id: 'je-seed-2',
    date: nowISO(),
    moodIds: ['joy'],
    energy: { morning: 3, noon: 2.5, evening: 2.5 },
    focus: 2.5,
    stress: 1.5,
    notes: 'Second sample entry.',
    sections: {
      events:      ['Deep work 90min'],
      learnings:   ['Reduce context switching'],
      gratitude:   ['Quiet morning'],
      reflections: ['Felt calm and steady.']
    }
  }
],


  // [신규] 활동 로그(우측 피드)
  // id, type, message, xp_delta, coin_delta, hp_delta, at(ISO)
  activity_log: [
    // { id:'log-1', type:'system', message:'RPG HUD ready', xp_delta:0, coin_delta:0, hp_delta:0, at: nowISO() }
  ]
};

// ─────────────────────────────────────────────────────────────────────────────
// XP/코인 계산(기존 유지)
function xpBase(q){ return (Number(q.difficulty||0)*10) + (Number(q.impact||0)*15); }
function xpMod(q){ return q.type==='habit' ? 0.8 : (q.type==='project' ? 1.3 : 1.0); }
function kpiMod(q){ return q.kpi_ok ? 1.15 : 1.0; }
function computeXP(q){ return Math.round(xpBase(q)*xpMod(q)*kpiMod(q)); }
function computeCoins(xp){ return Math.round(xp*0.2); }

// ─────────────────────────────────────────────────────────────────────────────
// [신규] 플레이어/레벨 계산 유틸
function getPlayer(id='player-1'){
  return db.players.find(p=>p.id===id) || db.players[0];
}
function levelFromXP(total_xp){ return Math.floor(Number(total_xp||0)/1000)+1; }
function xpToNext(total_xp){
  const lv = levelFromXP(total_xp);
  return (lv*1000) - Number(total_xp||0);
}

// ─────────────────────────────────────────────────────────────────────────────
// [신규] 상태 변경/로그 유틸
function logActivity({ type='info', message='', xp_delta=0, coin_delta=0, hp_delta=0 }){
  db.activity_log.unshift({
    id:'log-'+Date.now(),
    type, message, xp_delta, coin_delta, hp_delta,
    at: nowISO()
  });
}

function awardXP(playerId='player-1', xp=0){
  const p = getPlayer(playerId);
  p.total_xp = Math.max(0, Number(p.total_xp||0) + Number(xp||0));
  if (xp) logActivity({ type:'xp', message:`+${xp} XP`, xp_delta:xp });
  return p.total_xp;
}

function grantCoins(playerId='player-1', coins=0){
  const p = getPlayer(playerId);
  p.coins = Math.max(0, Number(p.coins||0) + Number(coins||0));
  if (coins) logActivity({ type:'coins', message:`+${coins} coins`, coin_delta:coins });
  return p.coins;
}

function spendCoins(playerId='player-1', coins=0){
  const p = getPlayer(playerId);
  const amount = Math.abs(Number(coins||0));
  p.coins = Math.max(0, Number(p.coins||0) - amount);
  p.coins_spent = Number(p.coins_spent||0) + amount;
  if (amount) logActivity({ type:'coins', message:`-${amount} coins`, coin_delta:-amount });
  return { coins:p.coins, coins_spent:p.coins_spent };
}

// 저널 평균 에너지
function averageEnergy(entry){
  const { morning=0, noon=0, evening=0 } = entry?.energy || {};
  return Math.round(((Number(morning)+Number(noon)+Number(evening))/3)*10)/10;
}

// 저널 업서트
function upsertJournal(entry){
  if (!entry) return null;
  const id = entry.id || ('je-'+(entry.date?.slice(0,10) || today()));
  const normalized = {
    id,
    date: entry.date || nowISO(),
    moodIds: Array.isArray(entry.moodIds) ? entry.moodIds : [],
    energy: { morning:0, noon:0, evening:0, ...(entry.energy||{}) },
    focus: Number(entry.focus||0),
    stress: Number(entry.stress||0),
    notes: entry.notes || '',
    sections: {
      events:      Array.isArray(entry.sections?.events)      ? entry.sections.events      : [],
      learnings:   Array.isArray(entry.sections?.learnings)   ? entry.sections.learnings   : [],
      gratitude:   Array.isArray(entry.sections?.gratitude)   ? entry.sections.gratitude   : [],
      reflections: Array.isArray(entry.sections?.reflections) ? entry.sections.reflections : []
    }
  };
  const idx = db.journal_entries.findIndex(e=>e.id===id);
  if (idx>=0) db.journal_entries[idx] = normalized;
  else        db.journal_entries.push(normalized);

  // 기본 규칙: 일지 저장 시 +5XP
  awardXP('player-1', 5);
  logActivity({ type:'journal', message:'Daily Journal saved', xp_delta:5 });

  return normalized;
}

// ─────────────────────────────────────────────────────────────────────────────
// 하위 호환: 기존 코드에서 db.journal을 읽는 경우를 위해 alias 유지
Object.defineProperty(db, 'journal', {
  get(){ return db.journal_entries; },
  set(v){ db.journal_entries = Array.isArray(v) ? v : []; }
});

// ─────────────────────────────────────────────────────────────────────────────
module.exports = {
  db,
  // 기존 계산 유틸
  xpBase, xpMod, kpiMod, computeXP, computeCoins,
  // 신규 유틸
  getPlayer, levelFromXP, xpToNext,
  logActivity, awardXP, grantCoins, spendCoins,
  averageEnergy, upsertJournal,
  // 날짜 유틸
  today, nowISO
};



