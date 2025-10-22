const { db } = require('../_db.js');

module.exports = async (req, res) => {
  try {
    if (req.method !== 'POST') return res.status(405).end('Method Not Allowed');
    let body = {}; let data = '';
    for await (const c of req) data += c;
    try { body = JSON.parse(data||'{}'); } catch {}
    const { reward_id } = body;
    const reward = db.rewards.find(r=>r.id===reward_id);
    if (!reward) return res.status(404).end(JSON.stringify({ ok:false, error:'reward not found' }));

    const player = db.players[0];
    const net = player.coins - player.coins_spent;
    if (net < reward.coins_cost) return res.status(400).end(JSON.stringify({ ok:false, error:'not enough coins' }));

    player.coins_spent += reward.coins_cost;
    const rec = { id:`rd_${Date.now()}`, reward_id, player_id: player.id, coins_spent: reward.coins_cost, date: new Date().toISOString() };
    db.rewards_redeemed.push(rec);

    res.setHeader('content-type','application/json; charset=utf-8');
    res.status(200).end(JSON.stringify({ ok:true, redeemed: rec, player: { coins: player.coins, coins_spent: player.coins_spent } }));
  } catch (e) {
    res.status(500).end(JSON.stringify({ ok:false, where:'rewards/redeem', error:String(e) }));
  }
};
