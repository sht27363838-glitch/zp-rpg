// api/quests/[id]/complete.js
// Robust quest completion endpoint for Vercel serverless (CommonJS)

const { db, computeXP, computeCoins } = require('../../../_db.js');

// ----- helpers --------------------------------------------------------------
function nowISO() {
  return new Date().toISOString();
}

function buildPlayerHUD(p) {
  const level = Math.floor((Number(p.total_xp) || 0) / 1000) + 1;
  const xp_to_next = (level * 1000) - (Number(p.total_xp) || 0);
  const coins_net = (Number(p.coins) || 0) - (Number(p.coins_spent) || 0);
  return {
    id: p.id,
    name: p.name,
    total_xp: Number(p.total_xp) || 0,
    coins: Number(p.coins) || 0,
    coins_spent: Number(p.coins_spent) || 0,
    level,
    xp_to_next,
    coins_net,
    hp: Number(p.hp) || 0,
    stamina: Number(p.stamina) || 0,
  };
}

// Ensure collections exist even if _db.js was minimal
function ensureCollections() {
  if (!Array.isArray(db.activity_log)) db.activity_log = [];
  if (!Array.isArray(db.journal)) db.journal = [];
  if (!Array.isArray(db.quests)) db.quests = [];
  if (!Array.isArray(db.players) || !db.players.length) {
    db.players = [{ id: 'player-1', name: 'Player One', total_xp: 0, coins: 0, coins_spent: 0, hp: 1000, stamina: 100 }];
  }
}

module.exports = async (req, res) => {
  try {
    ensureCollections();

    // method guard: POST/PATCH만 허용
    if (!['POST', 'PATCH'].includes(req.method)) {
      res.setHeader('Allow', 'POST, PATCH');
      res.status(405).json({ ok: false, error: 'Method Not Allowed' });
      return;
    }

    const { id } = req.query || {};
    if (!id || typeof id !== 'string') {
      res.status(400).json({ ok: false, error: 'Missing quest id' });
      return;
    }

    const quest = db.quests.find(q => q.id === id);
    if (!quest) {
      res.status(404).json({ ok: false, error: 'Quest not found' });
      return;
    }

    // 보상 계산은 "처음 완료될 때"만
    let xp = 0;
    let coins = 0;
    let alreadyDone = quest.status === 'done';

    if (!alreadyDone) {
      quest.status = 'done';
      quest.completed_at = nowISO();

      xp = Number(computeXP(quest)) || 0;
      coins = Number(computeCoins(xp)) || 0;

      const player = db.players[0];
      player.total_xp = (Number(player.total_xp) || 0) + xp;
      player.coins = (Number(player.coins) || 0) + coins;

      // 저널(간단 이벤트) 기록
      db.journal.push({
        id: `j_${Date.now()}`,
        type: 'quest_completed',
        player_id: player.id,
        quest_id: quest.id,
        quest_name: quest.name,
        xp_awarded: xp,
        coins_awarded: coins,
        created_at: nowISO(),
      });

      // 활동 로그(피드) 기록
      db.activity_log.unshift({
        id: 'log_' + Date.now(),
        type: 'quest_completed',
        message: `Completed "${quest.name}" (+${xp} XP, +${coins} coins)`,
        xp_delta: xp,
        coin_delta: coins,
        hp_delta: 0,
        at: nowISO(),
        links: { quest_id: quest.id, player_id: player.id },
      });
    }

    // 응답: 퀘스트 + 지급 보상 + 플레이어 HUD(프런트가 바로 렌더 가능)
    const playerHUD = buildPlayerHUD(db.players[0]);

    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.status(200).json({
      ok: true,
      alreadyDone,
      rewards: { xp, coins },
      quest,
      player: playerHUD,
      at: nowISO(),
    });
  } catch (e) {
    res
      .status(500)
      .json({ ok: false, error: String(e && e.stack ? e.stack : e) });
  }
};
