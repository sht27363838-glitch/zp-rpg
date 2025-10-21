const { db, computeXP, computeCoins } = require('../../../_db.js');

module.exports = async (req, res) => {
  try {
    const { id } = req.query || {};
    const quest = db.quests.find(q => q.id === id);
    if (!quest) return res.status(404).end(JSON.stringify({ error:'not found' }));

    if (quest.status !== 'done') {
      quest.status = 'done';
      quest.completed_at = new Date().toISOString();
      const xp = computeXP(quest);
      const coins = computeCoins(xp);
      const player = db.players[0];
      player.total_xp += xp;
      player.coins += coins;
      db.journal.push({ id:`j_${Date.now()}`, player_id:player.id, quest_id:quest.id, xp_awarded:xp, coins_awarded:coins, created_at:new Date().toISOString() });
    }

    res.setHeader('content-type', 'application/json; charset=utf-8');
    res.status(200).end(JSON.stringify({ ok:true, quest }));
  } catch (e) {
    res.status(500).end(JSON.stringify({ ok:false, error:String(e) }));
  }
};

