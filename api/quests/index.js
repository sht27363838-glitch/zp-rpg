const { db } = require('../../_db.js')

module.exports = (req, res) => {
  if (req.method === 'GET') {
    return res.status(200).json(db.quests)
  }
  if (req.method === 'POST') {
    const body = req.body || {}
    const id = `q_${Date.now()}`
    const quest = { id, status:'planned', completed_at:null, ...body }
    db.quests.push(quest)
    return res.status(201).json(quest)
  }
  return res.status(405).json({ error: 'Method not allowed' })
}
