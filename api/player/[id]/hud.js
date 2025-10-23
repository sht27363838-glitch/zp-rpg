// /api/player/[id]/hud.js
const { db, getPlayer, levelFromXP, xpToNext } = require('../../../_db.js');

module.exports = async (req, res) => {
  try {
    const { id } = req.query || {};
    const p = getPlayer(id);
    if (!p) return res.status(404).end(JSON.stringify({ ok:false, error:'player not found' }));

    const level = levelFromXP(p.total_xp);
    const toNext = xpToNext(p.total_xp);

    res.setHeader('content-type','application/json; charset=utf-8');
    res.status(200).end(JSON.stringify({
      ok:true,
      player: { id:p.id, name:p.name, total_xp:p.total_xp, coins:p.coins, coins_spent:p.coins_spent, hp:p.hp, stamina:p.stamina, level, xp_to_next: toNext },
      kpi: db.kpi_bridge || [],
      skills: db.skills || [],
      areas: db.areas || [],
    }));
  } catch (e) {
    res.status(500).end(JSON.stringify({ ok:false, error:String(e) }));
  }
};
