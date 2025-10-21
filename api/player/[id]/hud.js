const { db } = require('../../_db.js')

module.exports = (req, res) => {
  const { id } = req.query
  const p = db.players.find(p=>p.id===id) || db.players[0]
  const level = Math.floor(p.total_xp/1000)+1
  const xp_to_next = (level*1000) - p.total_xp
  const coins_net = p.coins - p.coins_spent
  res.status(200).json({ player: { ...p, level, xp_to_next, coins_net }, kpi: db.kpi_bridge })
}
